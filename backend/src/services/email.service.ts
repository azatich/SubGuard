import nodemailer from "nodemailer";

// ----------------------------------------------------------------
// 📧 Email Service — Nodemailer + Gmail (App Password)
// ----------------------------------------------------------------
//
// В файл .env нужно добавить:
//
//   EMAIL_USER=your-email@gmail.com
//   EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
//
// ⚠️  EMAIL_APP_PASSWORD — это НЕ обычный пароль от Gmail!
//     Это «Пароль приложения» (App Password), который генерируется
//     в настройках Google-аккаунта:
//     https://myaccount.google.com/apppasswords
//
//     Для этого у вас должна быть включена двухфакторная аутентификация.
// ----------------------------------------------------------------

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

/**
 * Универсальная функция отправки email.
 * Используется во всех контроллерах приложения.
 *
 * @param options.to      — адрес(а) получателя
 * @param options.subject — тема письма
 * @param options.html    — HTML-содержимое письма
 * @returns               — объект с результатом отправки Nodemailer
 * @throws                — пробрасывает ошибку, если отправка не удалась
 */
export async function sendMail({ to, subject, html }: SendMailOptions) {
  try {
    const mailOptions = {
      from: `SubGuard <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email отправлен: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Ошибка отправки email:", error);
    throw error;
  }
}
