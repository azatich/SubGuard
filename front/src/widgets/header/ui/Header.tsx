"use client";

import type { JSX } from "react";
import { useState } from "react";
import Link from "next/link";
import { Bell, LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useProfile } from "@/entities/user/useProfile";
import Image from "next/image";
import { useLogout } from "@/features/auth";
import { useNotifications } from "@/features/notifications";
import { Notification } from "@/entities/notifications";

const navLinks = [
  { name: "Дэшборд", href: "/dashboard" },
  { name: "Подписки", href: "/subscriptions" },
  { name: "Календарь", href: "/calendar" },
];

export const Header = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion();

  const { data: user, isPending } = useProfile();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();

  const { data: notifications } = useNotifications();
  const safeNotifications: Notification[] = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.is_read).length;

  return (
    <header className="bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800 sticky top-0 z-50 w-full h-16">
      <div className="flex items-center justify-between px-4 sm:px-12 lg:px-16 relative w-full h-full">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 font-semibold text-lg shrink-0 hover:cursor-pointer">
          <div className="bg-[#0A1F11] border border-green-500/50 p-1.5 rounded-lg flex items-center justify-center">
            <span className="text-green-500 text-sm font-bold">
              <ShieldCheck />
            </span>
          </div>
          <span className="text-white">SubGuard</span>
        </button>

        <nav className="hidden md:flex flex-1 justify-center gap-6 text-sm h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative flex items-center h-full font-medium transition-colors
                  ${isActive ? "text-green-500" : "text-zinc-400 hover:text-white"}
                `}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                    transition={{
                      type: "tween",
                      duration: shouldReduceMotion ? 0 : 0.3,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="block md:hidden border-zinc-800 bg-transparent p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <Link
            className="relative hover:text-green-500"
            href="/notifications"
            aria-label="Уведомления"
            title="Уведомления"
          >
            {unreadCount > 0 && (
              <span className="absolute top-[-15px] right-[-10px] bg-[#2cfc73] text-black text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
            <Bell />
          </Link>

          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
            ) : (
              <Link
                href="/settings"
                className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
                title="Профиль"
              >
                <span className="hidden sm:block text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {user?.full_name || "Пользователь"}
                </span>

                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center shadow-lg group-hover:border-[#2cfc73] transition-colors">
                  {user?.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="40px"
                      priority
                    />
                  ) : (
                    <User className="w-5 h-5 text-zinc-500" />
                  )}
                </div>
              </Link>
            )}
          </div>

          <button
            aria-label="Выйти"
            title="Выйти"
            className="bg-red-500 p-2 rounded-lg flex justify-center items-center hover:bg-red-900 transition-colors duration-200"
            disabled={isLogoutPending}
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-800 p-4 shadow-lg md:hidden z-40 px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-col gap-4 text-sm text-zinc-400">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors px-3 py-2 rounded-full font-medium ${
                  pathname === link.href
                    ? "bg-zinc-900 text-white"
                    : "hover:text-white text-left"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
