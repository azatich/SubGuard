import { type Request, type Response } from "express";
import { supabase } from "../index.js";
import { sendTelegramMessage, setupWebhook } from "../services/telegram.service.js";
import type { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";

export class TelegramController {
  static async setupWebhookEndpoint(req: Request, res: Response) {
    try {
      await setupWebhook();
      res.status(200).json({ success: true, message: "Webhook setup complete" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async handleWebhook(req: Request, res: Response) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(200).json({ ok: true });
      }

      const chatId = message.chat.id;
      const userId = message.from.id;
      const text = message.text || "";

      // Check if user already has this telegram ID
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("telegram_chat_id", chatId)
        .single();

      if (existingProfile) {
        // Already linked
        await sendTelegramMessage({
          chatId,
          message: "✅ Your Telegram is already linked to SubGuard!",
        });
      } else {
        // Send chat ID to user
        const message_text = `🎯 <b>Your Telegram Chat ID:</b>\n\n<code>${chatId}</code>\n\nCopy this ID and paste it in SubGuard Settings → Telegram Chat ID`;

        await sendTelegramMessage({
          chatId,
          message: message_text,
        });
      }

      res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(200).json({ ok: true });
    }
  }

  static async saveTelegramId(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      const { telegram_chat_id } = req.body;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!telegram_chat_id) {
        return res.status(400).json({ message: "Telegram Chat ID is required" });
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({ telegram_chat_id })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      // Send test message
      try {
        await sendTelegramMessage({
          chatId: telegram_chat_id,
          message: "🎉 Telegram notifications enabled in SubGuard!",
        });
      } catch (error) {
        console.error("Test message failed:", error);
      }

      res.status(200).json({
        message: "Telegram Chat ID saved successfully",
        data,
      });
    } catch (error) {
      console.error("Save Telegram ID Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getTelegramId(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("telegram_chat_id")
        .eq("id", user.id)
        .single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Get Telegram ID Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
