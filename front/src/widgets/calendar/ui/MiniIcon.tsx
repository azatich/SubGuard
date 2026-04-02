"use client";

import { POPULAR_SUBSCRIPTIONS } from "@/entities/subscriptions";
import type { Subscription } from "@/entities/subscriptions";

interface MiniIconProps {
  sub: Subscription;
}

export const MiniIcon = ({ sub }: MiniIconProps) => {
  const match = POPULAR_SUBSCRIPTIONS.find(
    (s) => s.name.toLowerCase() === sub.name.toLowerCase()
  );

  if (match?.logoUrl) {
    return (
      <div
        className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ backgroundColor: match.name === "GitHub Copilot" ? "#ffffff" : match.color }}
        title={sub.name}
      >
        {/* eslint_disable-next-line @next/next/no-img-element */}
        <img src={match.logoUrl} alt={sub.name} className="w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 object-contain" />
      </div>
    );
  }

  return (
    <div
      className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 bg-zinc-700 text-white text-[8px] font-bold"
      title={sub.name}
    >
      {sub.name.charAt(0)}
    </div>
  );
};
