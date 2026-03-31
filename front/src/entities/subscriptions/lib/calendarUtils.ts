import type { Subscription } from "../model/types";

export const DAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Convert Sunday=0 to Monday=0 based week
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { startDow, daysInMonth };
}

/** Returns all billing days for a subscription within a given month/year */
export function getBillingDaysInMonth(sub: Subscription, year: number, month: number): number[] {
  if (sub.status !== "Active") return [];

  const first = new Date(sub.first_payment_date);
  const days = new Set<number>();

  if (sub.cycle === "Monthly") {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    days.add(Math.min(first.getDate(), daysInMonth));
  } else if (sub.cycle === "Yearly") {
    if (first.getMonth() === month) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      days.add(Math.min(first.getDate(), daysInMonth));
    }
  }

  return Array.from(days);
}

export function formatCurrency(cost: number, currency: string): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "€", RUB: "₽", KZT: "₸" };
  return `${symbols[currency] ?? currency}${cost.toLocaleString()}`;
}

/** Builds a map of day -> active subscriptions billed that day */
export function buildBillingMap(
  subscriptions: Subscription[],
  year: number,
  month: number
): Map<number, Subscription[]> {
  const map = new Map<number, Subscription[]>();
  subscriptions.forEach((sub) => {
    getBillingDaysInMonth(sub, year, month).forEach((d) => {
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(sub);
    });
  });
  return map;
}

/** Computes monthly spend totals grouped by currency */
export function buildMonthlyTotals(
  subscriptions: Subscription[],
  year: number,
  month: number
): Record<string, number> {
  const totals: Record<string, number> = {};
  subscriptions
    .filter((s) => s.status === "Active")
    .forEach((sub) => {
      if (getBillingDaysInMonth(sub, year, month).length === 0) return;
      totals[sub.currency] = (totals[sub.currency] ?? 0) + sub.cost;
    });
  return totals;
}
