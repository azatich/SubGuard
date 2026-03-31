import { calculateNextPaymentDate, Subscription } from "@/entities/subscriptions";
import { Calendar } from "lucide-react";

interface UpcomingPaymentsProps {
  subscriptions: Subscription[];
}

export const UpcomingPayments = ({ subscriptions }: UpcomingPaymentsProps) => {
  // Вычисляем следующую дату для каждой подписки и сортируем по близости
  const sortedSubs = [...subscriptions]
    .map(sub => ({
      ...sub,
      nextDate: new Date(calculateNextPaymentDate(sub.first_payment_date, sub.cycle))
    }))
    .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
    .slice(0, 5); // Берем только 5 ближайших

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg h-full">
      <h3 className="text-lg font-semibold text-white mb-6">Ближайшие платежи</h3>
      
      {sortedSubs.length === 0 ? (
        <p className="text-sm text-zinc-500">Нет предстоящих платежей.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedSubs.map(sub => (
            <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                  {sub.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{sub.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    {sub.nextDate.toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold text-white">
                ${sub.cost.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};