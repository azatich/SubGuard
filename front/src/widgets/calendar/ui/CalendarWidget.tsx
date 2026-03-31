"use client";

import { useState, useMemo } from "react";
import { useSubscriptionsQuery } from "@/features/subscriptions/model/use-subscriptions-query";
import { buildBillingMap, buildMonthlyTotals, getMonthDays } from "@/entities/subscriptions/lib/calendarUtils";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarSidePanel } from "./CalendarSidePanel";

export const CalendarWidget = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [direction, setDirection] = useState(0);

  const { data: subscriptions = [] } = useSubscriptionsQuery();

  const { startDow, daysInMonth } = getMonthDays(currentYear, currentMonth);

  const billingMap = useMemo(
    () => buildBillingMap(subscriptions, currentYear, currentMonth),
    [subscriptions, currentYear, currentMonth]
  );

  const monthlyTotal = useMemo(
    () => buildMonthlyTotals(subscriptions, currentYear, currentMonth),
    [subscriptions, currentYear, currentMonth]
  );

  const selectedSubs = selectedDay ? (billingMap.get(selectedDay) ?? []) : [];

  const goToPrev = () => {
    setDirection(-1);
    setSelectedDay(null);
    if (currentMonth === 0) { setCurrentYear((y) => y - 1); setCurrentMonth(11); }
    else setCurrentMonth((m) => m - 1);
  };

  const goToNext = () => {
    setDirection(1);
    setSelectedDay(null);
    if (currentMonth === 11) { setCurrentYear((y) => y + 1); setCurrentMonth(0); }
    else setCurrentMonth((m) => m + 1);
  };

  const goToToday = () => {
    setDirection(0);
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const handleSelectDay = (day: number) => {
    setSelectedDay((prev) => (prev === day ? null : day));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      <div className="flex-1 min-w-0">
        <CalendarHeader
          year={currentYear}
          month={currentMonth}
          totalBillingDays={billingMap.size}
          totalActiveSubs={subscriptions.filter((s) => s.status === "Active").length}
          onPrev={goToPrev}
          onNext={goToNext}
          onToday={goToToday}
        />
        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          startDow={startDow}
          daysInMonth={daysInMonth}
          direction={direction}
          selectedDay={selectedDay}
          today={today}
          billingMap={billingMap}
          monthlyTotal={monthlyTotal}
          onSelectDay={handleSelectDay}
        />
      </div>

      <CalendarSidePanel
        selectedDay={selectedDay}
        month={currentMonth}
        subscriptions={selectedSubs}
      />
    </div>
  );
};
