const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

interface SendTelegramOptions {
  chatId: string | number;
  message: string;
}

export async function sendTelegramMessage({
  chatId,
  message,
}: SendTelegramOptions) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || "Failed to send Telegram message");
    }

    console.log(`✅ Telegram message sent to ${chatId}`);
    return data;
  } catch (error) {
    console.error("❌ Error sending Telegram message:", error);
    throw error;
  }
}

export async function setupWebhook() {
  try {
    const webhookUrl = `${process.env.BACKEND_URL}/api/telegram/webhook`;

    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || "Failed to setup webhook");
    }

    console.log(`✅ Telegram webhook set to: ${webhookUrl}`);
    return data;
  } catch (error) {
    console.error("❌ Error setting webhook:", error);
    throw error;
  }
}

export async function removeWebhook() {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/deleteWebhook`, {
      method: "POST",
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || "Failed to remove webhook");
    }

    console.log("✅ Telegram webhook removed");
    return data;
  } catch (error) {
    console.error("❌ Error removing webhook:", error);
    throw error;
  }
}
