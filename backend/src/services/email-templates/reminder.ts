/**
 * Генерирует HTML-шаблон письма-напоминания о списании.
 * Используется в NotificationController.processDailyReminders
 */
export function getReminderEmailHtml(params: {
  subName: string;
  cost: number | string;
  currency: string;
  reminderDays: number;
  nextPaymentDate: string; // "25 июля 2025"
}): string {
  const { subName, cost, currency, reminderDays, nextPaymentDate } = params;
 
  const urgencyColor =
    reminderDays === 1 ? "#fc2c2c" : reminderDays <= 3 ? "#fcb92c" : "#2cfc73";
 
  const urgencyLabel =
    reminderDays === 1
      ? "Завтра списание!"
      : reminderDays <= 3
        ? "Скоро списание"
        : "Напоминание";
 
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Напоминание: ${subName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background-color: #09090b;
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      padding: 40px 16px 60px;
    }
    .wrapper { max-width: 580px; margin: 0 auto; position: relative; }
    .glow {
      position: absolute; top: 60px; left: 50%; transform: translateX(-50%);
      width: 480px; height: 400px;
      background: radial-gradient(ellipse at center, ${urgencyColor}1f 0%, transparent 70%);
      pointer-events: none; z-index: 0; filter: blur(24px);
    }
    .header { text-align: center; padding: 0 0 24px; position: relative; z-index: 1; }
    .logo { display: inline-flex; align-items: center; gap: 9px; }
    .logo-icon {
      width: 34px; height: 34px;
      background: rgba(44,252,115,0.1);
      border: 1px solid rgba(44,252,115,0.28);
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .logo-text { font-size: 19px; font-weight: 700; color: #fff; letter-spacing: -0.4px; }
    .card {
      background: #111113; border: 1px solid #27272a;
      border-radius: 20px; overflow: hidden; position: relative; z-index: 1;
    }
    .hero {
      height: 148px;
      background:
        radial-gradient(ellipse at 35% 60%, ${urgencyColor}22 0%, transparent 55%),
        radial-gradient(ellipse at 70% 25%, ${urgencyColor}0d 0%, transparent 50%),
        linear-gradient(155deg, #131313 0%, #0d0d10 100%);
      display: flex; align-items: center; justify-content: center;
      position: relative; border-bottom: 1px solid #27272a;
    }
    .hero::before {
      content: '';
      position: absolute; inset: 0;
      background-image:
        linear-gradient(${urgencyColor}0f 1px, transparent 1px),
        linear-gradient(90deg, ${urgencyColor}0f 1px, transparent 1px);
      background-size: 28px 28px;
      mask-image: radial-gradient(ellipse at center, black 20%, transparent 72%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 72%);
    }
    .hero-inner { position: relative; z-index: 2; text-align: center; }
    .hero-ring {
      width: 64px; height: 64px;
      background: ${urgencyColor}1a;
      border: 1.5px solid ${urgencyColor}59;
      border-radius: 18px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 10px;
      box-shadow: 0 0 28px ${urgencyColor}33;
    }
    .urgency-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: ${urgencyColor}1a;
      border: 1px solid ${urgencyColor}40;
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 11.5px; font-weight: 600;
      color: ${urgencyColor};
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .body { padding: 32px 40px 36px; }
    @media (max-width: 480px) { .body { padding: 24px 22px 28px; } }
    .eyebrow {
      font-size: 12px; font-weight: 600; color: ${urgencyColor};
      letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 8px;
    }
    .headline {
      font-size: 26px; font-weight: 700; color: #fff;
      letter-spacing: -0.5px; line-height: 1.22; margin-bottom: 12px;
    }
    .sub-text {
      font-size: 14.5px; color: #a1a1aa; line-height: 1.68; margin-bottom: 28px;
    }
    .sub-text strong { color: #e4e4e7; font-weight: 600; }
    .payment-card {
      background: #0d0d0f;
      border: 1px solid #2a2a2e;
      border-radius: 14px;
      padding: 20px 24px;
      margin-bottom: 28px;
      display: flex; align-items: center; gap: 18px;
    }
    .payment-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      background: ${urgencyColor}15;
      border: 1px solid ${urgencyColor}33;
      border-radius: 13px;
      display: flex; align-items: center; justify-content: center;
    }
    .payment-info { flex: 1; }
    .payment-service {
      font-size: 16px; font-weight: 700; color: #fff;
      letter-spacing: -0.3px; margin-bottom: 3px;
    }
    .payment-date {
      font-size: 12.5px; color: #71717a;
    }
    .payment-amount {
      text-align: right; flex-shrink: 0;
    }
    .payment-sum {
      font-size: 22px; font-weight: 700; color: #fff;
      letter-spacing: -0.4px;
    }
    .payment-currency {
      font-size: 13px; color: #71717a; margin-top: 1px;
    }
    .countdown {
      background: ${urgencyColor}0f;
      border: 1px solid ${urgencyColor}2e;
      border-radius: 12px;
      padding: 14px 20px;
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 28px;
    }
    .countdown-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: ${urgencyColor};
      flex-shrink: 0;
      box-shadow: 0 0 8px ${urgencyColor}99;
    }
    .countdown-text {
      font-size: 13.5px; color: #d4d4d8; line-height: 1.5;
    }
    .countdown-text strong { color: ${urgencyColor}; font-weight: 700; }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #27272a 20%, #27272a 80%, transparent);
      margin-bottom: 28px;
    }
    .cta-wrap { text-align: center; margin-bottom: 24px; }
    .cta-btn {
      display: inline-block;
      background: ${urgencyColor};
      color: #09090b;
      font-family: 'Geist', sans-serif;
      font-size: 15px; font-weight: 700;
      text-decoration: none;
      padding: 15px 44px;
      border-radius: 12px;
      letter-spacing: -0.2px;
      box-shadow: 0 0 24px ${urgencyColor}4d;
    }
    .cta-note { font-size: 12px; color: #52525b; margin-top: 9px; }
    .footer {
      padding: 20px 40px 28px;
      border-top: 1px solid #1c1c1e;
      text-align: center;
    }
    .footer-logo { display: inline-flex; align-items: center; gap: 5px; margin-bottom: 10px; }
    .footer-logo-icon {
      width: 18px; height: 18px;
      background: rgba(44,252,115,0.1);
      border: 1px solid rgba(44,252,115,0.2);
      border-radius: 5px;
      display: flex; align-items: center; justify-content: center;
    }
    .footer-logo-text { font-size: 12px; font-weight: 600; color: #52525b; }
    .footer-links { display: flex; justify-content: center; gap: 18px; margin-bottom: 12px; }
    .footer-link { font-size: 11.5px; color: #3f3f46; text-decoration: none; }
    .footer-copy { font-size: 10.5px; color: #3f3f46; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="card">
    <div class="body">
      <p class="eyebrow">Напоминание о платеже</p>
      <h1 class="headline">Через ${reminderDays} ${reminderDays === 1 ? "день" : reminderDays < 5 ? "дня" : "дней"}<br/>спишут за <span style="color:${urgencyColor}">${subName}</span></h1>
      <p class="sub-text">Убедись, что на карте достаточно средств. Платёж пройдёт автоматически — <strong>${nextPaymentDate}</strong>.</p>
 
      <div class="payment-card">
        <div class="payment-info">
          <div class="payment-service">${subName}</div>
          <div class="payment-date">${nextPaymentDate}</div>
        </div>
        <div class="payment-amount">
          <div class="payment-sum">${cost} ${currency}</div>
          <div class="payment-currency">к списанию</div>
        </div>
      </div>
 
      <div class="countdown">
        <div class="countdown-dot"></div>
        <p class="countdown-text">
          Осталось <strong>${reminderDays} ${reminderDays === 1 ? "день" : reminderDays < 5 ? "дня" : "дней"}</strong> — проверь баланс карты и настройки подписки заранее.
        </p>
      </div>
 
      <div class="divider"></div>
 
      <div class="cta-wrap">
        <a href="https://subsguard.vercel.app/dashboard" class="cta-btn">Перейти в Дэшборд</a>
        <p class="cta-note">Управляй подпиской или отмени её в любой момент</p>
      </div>
    </div>
 
    <div class="footer">
      <div class="footer-logo">
        <div class="footer-logo-icon">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6V12C4 16.42 7.43 20.57 12 22C16.57 20.57 20 16.42 20 12V6L12 2Z" stroke="#2cfc73" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="footer-logo-text">SubGuard</span>
      </div>
      <p class="footer-copy">© 2025 SubGuard · Управляй расходами умнее</p>
    </div>
  </div>
</div>
</body>
</html>`;
}