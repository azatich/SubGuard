"use client";

import { motion, useReducedMotion} from "framer-motion";
import type { Subscription } from "@/entities/subscriptions";
import { MiniIcon } from "./MiniIcon";

interface CalendarDayCellProps {
  day: number;
  subs: Subscription[];
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

export const CalendarDayCell = ({
  day,
  subs,
  isSelected,
  isToday,
  onClick,
}: CalendarDayCellProps) => {
  const hasBilling = subs.length > 0;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
      onClick={onClick}
      className={`
        relative aspect-square rounded-xl flex flex-col items-center justify-start pt-2 pb-1 px-1 transition-all border
        ${
          isSelected
            ? "bg-[#2cfc73]/10 border-[#2cfc73]/40 shadow-[0_0_12px_rgba(44,252,115,0.15)]"
            : hasBilling
              ? "bg-zinc-900/80 border-zinc-700/60 hover:border-zinc-600"
              : "bg-transparent border-transparent hover:bg-zinc-900/50 hover:border-zinc-800"
        }
      `}
    >
      <span
        className={`text-sm font-semibold leading-none mb-1.5 w-6 h-6 flex items-center justify-center rounded-full transition-colors
          ${isToday ? "bg-[#2cfc73] text-zinc-950" : isSelected ? "text-[#2cfc73]" : hasBilling ? "text-white" : "text-zinc-500"}
        `}
      >
        {day}
      </span>

      {hasBilling && (
        <div className="flex flex-wrap justify-center gap-0.5 w-full">
          {subs.slice(0, 3).map((sub) => (
            <MiniIcon key={sub.id} sub={sub} />
          ))}
          {subs.length > 3 && (
            <span className="text-[9px] text-zinc-500 font-medium leading-none mt-0.5">
              +{subs.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
};
