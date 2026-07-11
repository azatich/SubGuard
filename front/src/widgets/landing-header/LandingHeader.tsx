"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, ShieldCheck, User } from "lucide-react";

import { useProfile } from "@/entities/user/useProfile";
import { useLogout } from "@/features/auth";

export function LandingHeader() {
  const { data: user, isPending } = useProfile({ redirectOnUnauthorized: false });
  const { mutate: logout, isPending: isLoggingOut } = useLogout({ redirectTo: "/" });

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-3" aria-label="SubGuard — главная">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 sm:h-10 sm:w-10">
            <ShieldCheck className="h-5 w-5 stroke-[3] text-green-500 sm:h-6 sm:w-6" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white sm:text-2xl">SubGuard</span>
        </Link>

        {isPending ? (
          <div className="h-10 w-28 animate-pulse rounded-full bg-zinc-800" aria-label="Проверка сессии" />
        ) : user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/settings" className="group flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-zinc-900 sm:pr-3" aria-label="Открыть профиль">
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 group-hover:border-green-500">
                {user.avatar_url ? (
                  <Image src={user.avatar_url} alt="" fill sizes="36px" className="object-cover" />
                ) : (
                  <User className="h-4 w-4 text-zinc-400" />
                )}
              </span>
              <span className="hidden max-w-36 truncate text-sm font-medium text-zinc-200 sm:block">
                {user.full_name || "Профиль"}
              </span>
            </Link>
            <button type="button" onClick={() => logout()} disabled={isLoggingOut} className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Выйти из аккаунта">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/login" className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-100 sm:text-sm">Войти</Link>
            <Link href="/signup" className="whitespace-nowrap rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-black transition-colors hover:bg-green-600 sm:px-5 sm:py-2 sm:text-sm">Зарегистрироваться</Link>
          </div>
        )}
      </div>
    </header>
  );
}
