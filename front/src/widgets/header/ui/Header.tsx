"use client";

import type { JSX } from "react";
import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { usePathname } from "next/navigation";
import { useProfile } from "@/entities/user/useProfile";
import Image from "next/image";
import { useLogout } from "@/features/auth";

const navLinks = [
  { name: "Дэшборд", href: "/dashboard" },
  { name: "Подписки", href: "/subscriptions" },
  { name: "Календарь", href: "/calendar" },
];

export const Header = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { data: user, isPending } = useProfile();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();

  return (
    <header className="bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800 sticky top-0 z-50 w-full h-16">
      <div className="flex items-center justify-between px-4 sm:px-12 lg:px-16 relative w-full h-full">
        <div className="flex items-center gap-2 font-semibold text-lg flex-shrink-0">
          <div className="bg-[#2cfc73] p-1.5 rounded-lg flex items-center justify-center">
            <span className="text-zinc-950 text-sm font-bold">SG</span>
          </div>
          <span className="text-white">SubGuard</span>
        </div>

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
                  ${isActive ? "text-white" : "text-zinc-400 hover:text-white"}
                `}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                    transition={{
                      type: "tween",
                      duration: 0.3,
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

          <div className="flex items-center gap-3">
            {isPending ? (
              <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
            ) : (
              <Link
                href="/settings"
                className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
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

          <button disabled={isLogoutPending} onClick={() => logout()}>
            <LogOut />
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
