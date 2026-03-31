"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS_RU } from "@/entities/subscriptions/lib/calendarUtils";

interface CalendarHeaderProps {
  year: number;
  month: number;
  totalBillingDays: number;
  totalActiveSubs: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const CalendarHeader = ({
  year,
  month,
  totalBillingDays,
  totalActiveSubs,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight">
        {MONTHS_RU[month]} <span className="text-zinc-500">{year}</span>
      </h2>
      <p className="text-zinc-500 text-sm mt-0.5">
        {totalBillingDays} дней со списаниями · {totalActiveSubs} активных подписок
      </p>
    </div>

    <div className="flex gap-2">
      <button
        onClick={onPrev}
        className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center transition-all text-zinc-400 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={onToday}
        className="px-3 h-9 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-400 hover:text-white transition-all"
      >
        Сегодня
      </button>
      <button
        onClick={onNext}
        className="w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 flex items-center justify-center transition-all text-zinc-400 hover:text-white"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
