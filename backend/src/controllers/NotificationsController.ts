import { type Request, type Response } from "express";
import { Resend } from "resend";
import { supabase } from "../index.js";
import { isSameDay, subDays } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);

export class NotificationController {
  static async processDailyReminders(req?: Request, res?: Response) {
    try {
      console.log("⏰ [Cron] Запуск проверки уведомлений...");

      // 1. Получаем сегодняшний день (сбрасываем часы/минуты для точного сравнения)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 2. Достаем все Активные подписки И привязанный профиль юзера
      // Предполагается, что у тебя есть таблица profiles с колонками email и reminder_days
      const { data: subscriptions, error: dbError } = await supabase
        .from("subscriptions")
        .select(`
          id, 
          name, 
          cost, 
          currency, 
          next_payment_date,
          user_id,
          profiles:user_id ( 
            email, 
            reminder_days 
          )
        `)
        .eq("status", "Active");

      if (dbError) throw dbError;

      if (!subscriptions || subscriptions.length === 0) {
        if (res) return res.status(200).json({ message: "Нет активных подписок" });
        return;
      }

      let sentCount = 0;

      // 3. Обрабатываем каждую подписку
      for (const sub of subscriptions) {
        
        if (!sub.profiles) continue; 
        
        // @ts-ignore - так как Supabase возвращает profiles как массив или объект, берем данные
        const profile = Array.isArray(sub.profiles) ? sub.profiles[0] : sub.profiles;
        
        const userEmail = profile?.email;
        if (!userEmail) continue;

        const reminderDays = profile?.reminder_days || 3; // 3 дня по дефолту

        const targetDate = subDays(new Date(sub.next_payment_date), reminderDays);


        const nextPayment = new Date(sub.next_payment_date);
        const notificationDate = new Date(nextPayment);
        notificationDate.setDate(notificationDate.getDate() - reminderDays);
        notificationDate.setHours(0, 0, 0, 0);

        // Если сегодня НЕ день уведомления — идем к следующей подписке
        if (notificationDate.getTime() !== today.getTime()) {
          continue;
        }

        // 5. ПРОВЕРКА НА ДУБЛИКАТЫ (чтобы не заспамить юзера, если сервер перезагрузится)
        const { data: alreadySent } = await supabase
          .from("notifications")
          .select("id")
          .eq("subscription_id", sub.id)
          .eq("for_payment_date", sub.next_payment_date) // Проверяем конкретный цикл оплаты!
          .single();

        if (alreadySent) {
          continue;
        }

        // 6. ОТПРАВЛЯЕМ ПИСЬМО
        const { error: emailError } = await resend.emails.send({
          from: "SubGuard <onboarding@resend.dev>", // Заменишь на свой
          to: [userEmail],
          subject: `🔔 Напоминание: скоро списание за ${sub.name}`,
          html: `
            <div style="font-family: sans-serif; color: #18181b;">
              <h2>Привет!</h2>
              <p>Напоминаем, что <strong>через ${reminderDays} дней</strong> произойдет списание за подписку <strong>${sub.name}</strong>.</p>
              <p>Сумма к оплате: <strong>${sub.cost} ${sub.currency}</strong></p>
              <hr />
              <p style="font-size: 12px; color: #71717a;">
                Управляй своими расходами в <a href="https://subguard.vercel.app">SubGuard</a>.
              </p>
            </div>
          `,
        });

        if (emailError) {
          console.error(`Ошибка отправки письма для ${userEmail}:`, emailError);
          continue;
        }

        // 7. ЗАПИСЫВАЕМ ЛОГ В БД (чтобы сработала проверка на дубликаты завтра)
        await supabase.from("notifications").insert({
          user_id: sub.user_id,
          subscription_id: sub.id,
          for_payment_date: sub.next_payment_date,
          message: `Напоминание за ${reminderDays} дн. до оплаты ${sub.name}`
        });

        sentCount++;
      }

      console.log(`✅ [Cron] Проверка завершена. Отправлено писем: ${sentCount}`);

      // Если мы дергали этот метод через API (Postman), отвечаем:
      if (res) {
        return res.status(200).json({ success: true, sent: sentCount });
      }

    } catch (error: any) {
      console.error("❌ Критическая ошибка в рассылке:", error.message);
      if (res) return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}