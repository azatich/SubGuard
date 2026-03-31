"use client";

import { Subscription, SUBSCRIPTION_CATEGORIES } from "@/entities/subscriptions";
import { useExchangeRates } from "@/shared/lib/useExchangeRates";
import { Loader2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2cfc73",
  "#3b82f6",
  "#f43f5e",
  "#a855f7",
  "#eab308",
  "#64748b",
];

interface ExpenseChartProps {
  subscriptions: Subscription[];
  baseCurrency: string; // 🔥 Добавили базовую валюту
}

export const ExpenseChart = ({ subscriptions, baseCurrency }: ExpenseChartProps) => {
  // 🔥 Подтягиваем курсы валют
  const { data: rates, isPending } = useExchangeRates(baseCurrency);

  // Пока курсы грузятся, показываем красивый лоадер, чтобы график не прыгал
  if (isPending) {
    return (
      <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#2cfc73] animate-spin" />
        <span className="text-sm text-zinc-500 mt-4">Загрузка курсов валют...</span>
      </div>
    );
  }

  // Определяем символ валюты для Tooltip
  const currencySymbol = 
    baseCurrency === "KZT" ? "₸" : 
    baseCurrency === "RUB" ? "₽" : 
    baseCurrency === "EUR" ? "€" : "$";

  const categoryData = subscriptions.reduce(
    (acc, sub) => {
      const categoryLabel =
        SUBSCRIPTION_CATEGORIES[sub.category]?.label || sub.category;

      const existingCategory = acc.find((item) => item.name === categoryLabel);

      // 1. Приводим к месячной стоимости
      const monthlyCost = sub.cycle === "Yearly" ? sub.cost / 12 : sub.cost;
      
      // 2. Достаем курс валюты для текущей подписки (если API упало, считаем 1:1)
      const exchangeRate = rates?.[sub.currency] || 1;
      
      // 3. Конвертируем в базовую валюту
      const convertedCost = monthlyCost / exchangeRate;

      if (existingCategory) {
        existingCategory.value += convertedCost;
      } else {
        acc.push({ name: categoryLabel, value: convertedCost });
      }
      return acc;
    },
    [] as { name: string; value: number }[],
  );

  categoryData.sort((a, b) => b.value - a.value);

  return (
    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Расходы по категориям
        </h3>
        <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">
          в {baseCurrency}
        </span>
      </div>

      {categoryData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
          Нет данных для графика
        </div>
      ) : (
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => {
                  const num = Number(value) || 0;
                  // 🔥 Теперь Tooltip показывает правильный символ (например, ₸4500.00 вместо $4500.00)
                  return `${currencySymbol}${num.toFixed(2)}`;
                }}
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  borderColor: "#27272a",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};