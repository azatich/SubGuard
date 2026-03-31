"use client"; // 🔥 ОБЯЗАТЕЛЬНО: добавляем "use client", так как теперь тут есть состояние

import Image from "next/image";
import { useState, useEffect } from "react";
import { POPULAR_SUBSCRIPTIONS, SUBSCRIPTION_CATEGORIES } from "@/entities/subscriptions"; 

interface SubscriptionBrandIconProps {
  name: string;
  category: string;
  size?: "sm" | "md" | "lg";
}

export const SubscriptionBrandIcon = ({ 
  name, 
  category, 
  size = "md" 
}: SubscriptionBrandIconProps) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [name]);

  const match = POPULAR_SUBSCRIPTIONS.find(
    (sub) => sub.name.toLowerCase().includes(name.toLowerCase())
  );

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-xs",
    md: "w-10 h-10 rounded-xl text-sm",
    lg: "w-12 h-12 rounded-2xl text-base",
  };

  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;

  if (match && match.logoUrl && !imageError) {
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center shadow-md flex-shrink-0`}
        style={{ backgroundColor: match.name === 'GitHub Copilot' ? '#ffffff' : match.color }}
      >
        <Image
          src={match.logoUrl}
          alt={match.name}
          width={iconSize}
          height={iconSize}
          unoptimized
          onError={() => setImageError(true)} 
        />
      </div>
    );
  }
  
  const fallbackColor = SUBSCRIPTION_CATEGORIES[category]?.colorClass || "bg-zinc-800 text-zinc-400";
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center font-bold flex-shrink-0 ${fallbackColor}`}>
      {initial}
    </div>
  );
};