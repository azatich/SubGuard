"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Repeat } from "lucide-react";
import { SubscriptionBrandIcon } from "@/entities/subscriptions/ui/SubscriptionBrandIcon";
import { MONTHS_RU, formatCurrency } from "@/entities/subscriptions/lib/calendarUtils";
import type { Subscription } from "@/entities/subscriptions";

interface CalendarSidePanelProps {
  selectedDay: number | null;
  month: number;
  subscriptions: Subscription[];
}

export const CalendarSidePanel = ({
  selectedDay,
  month,
  subscriptions,
}: CalendarSidePanelProps) => {
  const dayTotals: Record<string, number> = {};
  subscriptions.forEach((s) => {
    dayTotals[s.currency] = (dayTotals[s.currency] ?? 0) + s.cost;
  });

  return (
    <div className="w-full xl:w-80 flex-shrink-0">
      <AnimatePresence mode="wait">
        {selectedDay ? (
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">
                {selectedDay} {MONTHS_RU[month]}
              </h3>
              <p className="text-zinc-500 text-sm">
                {subscriptions.length === 0
                  ? "Нет списаний"
                  : `${subscriptions.length} ${subscriptions.length === 1 ? "списание" : "списания"}`}
              </p>
            </div>

            {subscriptions.length === 0 ? (
              <EmptyState message="В этот день нет списаний" />
            ) : (
              <div className="flex flex-col gap-3">
                {subscriptions.map((sub) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <SubscriptionBrandIcon name={sub.name} category={sub.category} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{sub.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Repeat className="w-3 h-3 text-zinc-500" />
                        <span className="text-zinc-500 text-xs">
                          {sub.cycle === "Yearly" ? "Ежегодно" : "Ежемесячно"}
                        </span>
                      </div>
                    </div>
                    <span className="text-white font-bold text-sm flex-shrink-0">
                      {formatCurrency(sub.cost, sub.currency)}
                    </span>
                  </motion.div>
                ))}

                {/* Multi-currency day total */}
                {subscriptions.length > 1 && (
                  <div className="mt-1 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-500 text-sm">Итого</span>
                    <div className="flex gap-2">
                      {Object.entries(dayTotals).map(([cur, amt]) => (
                        <span key={cur} className="text-white font-bold text-sm">
                          {formatCurrency(amt, cur)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-48 xl:h-full text-center"
          >
            <CalendarDays className="w-12 h-12 text-zinc-800 mb-3" />
            <p className="text-zinc-600 text-sm">
              Выберите день,
              <br />
              чтобы увидеть списания
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <CalendarDays className="w-10 h-10 text-zinc-800 mb-3" />
    <p className="text-zinc-600 text-sm">{message}</p>
  </div>
);
