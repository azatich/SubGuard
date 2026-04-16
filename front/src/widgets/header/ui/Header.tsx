"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { Button } from "@/shared/ui/button";
import { useProfile } from "@/entities/user/useProfile";
import { useLogout } from "@/features/auth";
import { useNotifications } from "@/features/notifications";

const NAV_LINKS = [
  { name: "Дэшборд", href: "/dashboard" },
  { name: "Подписки", href: "/subscriptions" },
  { name: "Календарь", href: "/calendar" },
];

interface NavLinkProps {
  name: string;
  href: string;
  isActive: boolean;
  shouldReduceMotion: boolean | null;
}

function NavLink({ name, href, isActive, shouldReduceMotion }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`relative flex items-center h-full font-medium transition-colors ${
        isActive ? "text-green-500" : "text-zinc-400 hover:text-white"
      }`}
    >
      {name}
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
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const { data: user, isPending } = useProfile();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const { data: notifications } = useNotifications();

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  // Закрываем меню при переходе на другую страницу
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Закрываем меню при клике вне его области
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideMenu = menuRef.current && !menuRef.current.contains(target);
      const outsideBtn = toggleBtnRef.current && !toggleBtnRef.current.contains(target);
      if (outsideMenu && outsideBtn) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="bg-zinc-950 text-white border-b border-zinc-800 sticky top-0 z-50 w-full h-16">
      <div className="flex items-center justify-between px-4 sm:px-12 lg:px-16 w-full h-full relative">
        {/* Логотип */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 font-semibold text-lg shrink-0 hover:cursor-pointer"
        >
          <div className="bg-[#0A1F11] border border-green-500/50 p-1.5 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-green-500 w-5 h-5" />
          </div>
          <span className="text-white">SubGuard</span>
        </button>

        {/* Навигация (десктоп) */}
        <nav className="hidden md:flex flex-1 justify-center gap-6 text-sm h-full">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              isActive={pathname === link.href}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </nav>

        {/* Правая часть */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Бургер (мобильный) */}
          <Button
            ref={toggleBtnRef}
            variant="outline"
            size="sm"
            className="md:hidden border-zinc-800 bg-transparent p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Уведомления */}
          <Link
            href="/notifications"
            aria-label="Уведомления"
            title="Уведомления"
            className="relative hover:text-green-500"
          >
            {unreadCount > 0 && (
              <span className="absolute -top-3 -right-2 bg-[#2cfc73] text-black text-xs px-2 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
            <Bell className="w-5 h-5" />
          </Link>

          {/* Профиль */}
          {isPending ? (
            <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
          ) : (
            <Link
              href="/settings"
              title="Профиль"
              className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
            >
              <span className="hidden sm:block text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                {user?.full_name ?? "Пользователь"}
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

          {/* Выход */}
          <button
            aria-label="Выйти"
            title="Выйти"
            className="bg-red-500 p-2 rounded-lg flex justify-center items-center hover:bg-red-900 transition-colors duration-200 disabled:opacity-50"
            disabled={isLogoutPending}
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-800 p-4 shadow-lg md:hidden z-40 px-4 sm:px-6"
          >
            <nav className="flex flex-col gap-2 text-sm text-zinc-400">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-full font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-zinc-900 text-white"
                      : "hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}