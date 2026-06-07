import { GoogleGenerativeAI } from "@google/generative-ai";

const SUBSCRIPTION_CATEGORIES = [
  "Entertainment",
  "Music",
  "Software",
  "Shopping",
  "Health",
  "AI",
  "Cloud",
  "Gaming",
  "VPN",
  "Fitness",
  "Education",
] as const;

export type SubscriptionCategory = (typeof SUBSCRIPTION_CATEGORIES)[number];

export interface SubscriptionPrediction {
  name: string;
  cost: number;
  currency: string;
  date: string; // YYYY-MM-DD
  category: SubscriptionCategory;
}

const SYSTEM_PROMPT = `Ты — эксперт по финансовым выпискам и регулярным подпискам. Твоя задача — прочитать текст банковской выписки, найти вероятные регулярные списания по подпискам и вернуть СТРОГО JSON-массив.

Каждый объект должен иметь свойства:
- name: название сервиса
- cost: сумма списания (число)
- currency: код валюты в 3 буквы (KZT, USD, EUR, RUB и т.д.)
- date: дата последнего списания в формате YYYY-MM-DD
- category: строго один из этих ключей: Entertainment, Music, Software, Shopping, Health, AI, Cloud, Gaming, VPN, Fitness, Education

Если не удаётся определить значение, выбери наиболее вероятную интерпретацию, но не возвращай null. Если в тексте нет подписок, верни пустой массив [] без дополнительных сообщений.

Ответ должен быть:
- только валидный JSON
- без markdown, без комментариев, без объяснений
- без обёртки типа { "data": ... }

Примеры желаемого формата:
[
  {"name":"Netflix","cost":14.99,"currency":"USD","date":"2026-05-10","category":"Entertainment"},
  {"name":"Yandex Plus","cost":5.99,"currency":"KZT","date":"2026-05-01","category":"Entertainment"},
  {"name":"GitHub Copilot","cost":10,"currency":"USD","date":"2026-05-03","category":"AI"}
]
`;

const USER_PROMPT = `
Вот текст банковской выписки. Проанализируй транзакции и найди только регулярные подписки:

{statement}
`;

function normalizeLlmOutput(text: string): string {
  return text.replace(/```(?:json)?/gi, "").trim();
}

function normalizeSubscriptionCategory(category: unknown): SubscriptionCategory {
  if (typeof category !== "string") return "Software";

  if ((SUBSCRIPTION_CATEGORIES as readonly string[]).includes(category)) {
    return category as SubscriptionCategory;
  }

  const legacyCategoryMap: Record<string, SubscriptionCategory> = {
    Work: "Software",
    Utilities: "Software",
    Other: "Software",
  };

  return legacyCategoryMap[category] || "Software";
}

function assertSubscriptionPrediction(value: any): value is Omit<SubscriptionPrediction, "category"> & { category: unknown } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.cost === "number" &&
    typeof value.currency === "string" &&
    typeof value.date === "string" &&
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value.date)
  );
}

export async function detectRecurringSubscriptionsFromText(rawText: string): Promise<SubscriptionPrediction[]> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY не задан. Установите ключ в .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  const prompt = USER_PROMPT.replace("{statement}", rawText);

  const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
  const rawOutput = result.response.text();
  const cleaned = normalizeLlmOutput(rawOutput);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error(`Не удалось распарсить JSON от LLM: ${error instanceof Error ? error.message : String(error)}. Ответ LLM: ${cleaned}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`LLM вернула не массив. Ответ: ${cleaned}`);
  }

  const subscriptions: SubscriptionPrediction[] = [];
  for (const item of parsed) {
    if (!assertSubscriptionPrediction(item)) {
      throw new Error(`LLM вернула объект неверного формата: ${JSON.stringify(item)}`);
    }
    subscriptions.push({
      ...item,
      category: normalizeSubscriptionCategory(item.category),
    });
  }

  return subscriptions;
}
