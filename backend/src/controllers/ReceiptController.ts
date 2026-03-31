import { type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";

const PROMPT = `
Ты — эксперт по распознаванию финансовых чеков, квитанций и скриншотов об оплате.
Твоя задача — извлечь данные из предоставленного изображения и вернуть их СТРОГО в формате валидного JSON.
Не пиши никаких приветствий, пояснений или разметки markdown (типа \`\`\`json). ТОЛЬКО чистый JSON.

Если какое-то поле невозможно определить, верни null для этого поля.
Формат JSON должен быть ровно таким:
{
  "merchant": "Название магазина или сервиса (Например: 'Netflix', 'Apple', 'Yandex'). Убери лишние слова вроде 'LLC' или 'Inc'.",
  "totalCost": "Число. Итоговая сумма платежа (Например: 15.99). Без символов валют, только число.",
  "currencyISO": "Код валюты из 3 букв (Например: 'USD', 'KZT', 'RUB', 'EUR'). Определи по символу ($, ₸, ₽) или тексту.",
  "paymentDate": "Дата платежа в формате YYYY-MM-DD. Если год не указан, используй текущий.",
  "categoryFallback": "Выбери одну наиболее подходящую категорию из списка: 'Entertainment', 'Music', 'Software', 'Shopping', 'Health', 'AI', 'Cloud', 'Gaming', 'VPN', 'Fitness', 'Education'."
}
`;

export class ReceiptController {
  static async ScanReceipt(req: AuthenticatedRequest, res: Response) {
    try {
      const { imageBase64 } = req.body;

      if (!imageBase64) {
        return res.status(400).json({
          success: false,
          error: "Изображение не предоставлено",
        });
      }

      const mimeTypeMatch = imageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      if (!cleanBase64) {
        return res.status(400).json({
          success: false,
          error: "Неверный формат изображения",
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("Критическая ошибка: GEMINI_API_KEY не задан в .env");
        return res.status(500).json({
          success: false,
          error: "Ошибка конфигурации сервера",
        });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const imageParts = [
        {
          inlineData: {
            data: cleanBase64,
            mimeType,
          },
        },
      ];

      let text = "";
      let success = false;
      const MAX_RETRIES = 3;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await model.generateContent([PROMPT, ...imageParts]);
          const response = await result.response;
          text = response.text();
          success = true;
          break;
        } catch (apiError: any) {
          console.warn(`Попытка ${attempt} провалилась:`, apiError.message);
          if (attempt === MAX_RETRIES) {
            throw apiError;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }

      if (!success) {
        return res.status(503).json({
          success: false,
          error: "Серверы ИИ перегружены",
        });
      }

      // 🔥 2. Очищаем текст ТОЛЬКО после того, как получили его от ИИ
      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // 🔥 3. Парсим и отправляем ответ фронтенду
      try {
        const jsonData = JSON.parse(cleanedText);
        return res.status(200).json({
          success: true,
          data: jsonData,
        });
      } catch (parseError) {
        console.error("Gemini вернул невалидный JSON:", text);
        return res.status(500).json({
          success: false,
          error: "Ошибка парсинга ответа от ИИ",
        });
      }

    } catch (error: any) {
      console.error("Ошибка в ReceiptController.ScanReceipt:", error.message);
      return res.status(500).json({
        success: false,
        error: `Похоже что серверы заняты. Попробуй позже. ${error.message}`,
      });
    }
  }
}