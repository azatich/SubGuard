"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";
import { DAYS_RU, formatCurrency } from "@/entities/subscriptions/lib/calendarUtils";
import type { Subscription } from "@/entities/subscriptions";
import { CalendarDayCell } from "./CalendarDayCell";

interface CalendarGridProps {
  year: number;
  month: number;
  startDow: number;
  daysInMonth: number;
  direction: number;
  selectedDay: number | null;
  today: Date;
  billingMap: Map<number, Subscription[]>;
  monthlyTotal: Record<string, number>;
  onSelectDay: (day: number) => void;
}

export const CalendarGrid = ({
  year,
  month,
  startDow,
  daysInMonth,
  direction,
  selectedDay,
  today,
  billingMap,
  monthlyTotal,
  onSelectDay,
}: CalendarGridProps) => {
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <>
      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_RU.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-zinc-600 py-2 uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Animated month grid */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 40 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="grid grid-cols-7 gap-1"
        >
          {Array.from({ length: startDow }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <CalendarDayCell
              key={day}
              day={day}
              subs={billingMap.get(day) ?? []}
              isSelected={selectedDay === day}
              isToday={isToday(day)}
              onClick={() => onSelectDay(day)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Monthly total pills */}
      {Object.keys(monthlyTotal).length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mr-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>Итого за месяц:</span>
          </div>
          {Object.entries(monthlyTotal).map(([currency, amount]) => (
            <span
              key={currency}
              className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-sm font-semibold text-white"
            >
              {formatCurrency(amount, currency)}
            </span>
          ))}
        </div>
      )}
    </>
  );
};
