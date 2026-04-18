import React from "react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { GoogleAuthButton } from "./GoogleAuthButton";

/* ─── Card Components ─────────────────────────────────────────────── */

function MonthlySpendCard() {
  return (
    <div className="bg-[#121214] border border-zinc-800 rounded-xl p-4 lg:p-5 w-full shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 bg-green-500/10 rounded-lg shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M12 20V10M18 20V4M6 20v-4" />
          </svg>
        </div>
        <h3 className="text-zinc-100 font-medium text-sm lg:text-[15px]">Ежемесячные траты</h3>
      </div>
      <div className="h-14 lg:h-20 mb-3">
        <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none" className="text-green-500">
          <path d="M0,18 C20,2 40,16 60,6 C80,10 100,2 100,2" fill="none" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      </div>
      <p className="text-zinc-500 text-xs mb-1 tracking-wider">ОБЩИЙ ОТТОК</p>
      <p className="text-zinc-100 font-bold text-2xl lg:text-4xl leading-none">USD 4,265.0</p>
    </div>
  );
}

function ActiveSubsCard() {
  return (
    <div className="bg-[#121214] border border-zinc-800 rounded-xl p-4 lg:p-5 w-full shadow-2xl">
      <div className="flex items-end justify-between mb-3">
        <p className="text-zinc-500 text-xs tracking-wider">АКТИВНЫЕ ПОДПИСКИ</p>
        <div className="relative w-14 h-14 lg:w-20 lg:h-20 flex items-center justify-center shrink-0">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#1a1a1c" strokeWidth="6" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="#22C55E" strokeWidth="6" fill="none" strokeDasharray="251" strokeDashoffset="60" />
          </svg>
          <p className="absolute text-zinc-100 font-bold text-xl lg:text-3xl">$142</p>
        </div>
      </div>
      <div className="flex items-end gap-2 mb-1 flex-wrap">
        <p className="text-zinc-100 font-bold text-xl lg:text-3xl leading-none">12 Подписок</p>
        <span className="text-zinc-500 text-xs">(+3 новые)</span>
      </div>
      <p className="text-zinc-400 text-xs lg:text-sm leading-relaxed mt-1">
        Netflix, Spotify, AWS, Figma, Zoom, Dropbox, Adobe CC...
      </p>
    </div>
  );
}

function LeakageCard() {
  return (
    <div className="bg-[#121214]/80 border border-zinc-800 rounded-xl p-4 lg:p-5 w-full text-zinc-400 shadow-2xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-9 h-9 bg-green-500/10 rounded-lg shrink-0">
          <ShieldCheck className="text-green-500 w-5 h-5 stroke-[3]" />
        </div>
        <h3 className="font-medium text-sm">Защита от утечек</h3>
      </div>
      <p className="text-xs lg:text-[14px] leading-relaxed">
        SubGuard автоматически обнаруживает и нейтрализует неиспользуемые подписки, скрытые в вашей банковской выписке.
      </p>
    </div>
  );
}

function UnwantedCard() {
  return (
    <div className="bg-[#121214]/80 border border-zinc-800 rounded-xl p-4 lg:p-5 w-full text-zinc-400 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">Нежелательные списания</h3>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 shrink-0">
          <path d="M12 20V10M18 20V4M6 20v-4" />
        </svg>
      </div>
      <div className="h-8 mb-3 relative">
        <span className="w-2 h-2 bg-green-500 rounded-full absolute left-8 top-1 blur-[1px]" />
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full absolute left-16 bottom-1 blur-[1px]" />
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full absolute left-28 top-3 blur-[1px]" />
        <span className="w-2 h-2 bg-green-500 rounded-full absolute left-36 top-1 blur-[1px]" />
      </div>
      <p className="text-xs lg:text-[14px] leading-relaxed">Подписки за Adobe CC, Canva, Dropbox, Figma...</p>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */

export default function SubGuardHomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col overflow-hidden">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 w-full bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg">
              <ShieldCheck className="text-green-500 w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            </div>
            <span className="text-lg sm:text-2xl font-bold tracking-tight text-white">SubGuard</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/login" className="text-xs sm:text-sm font-medium text-zinc-500 hover:text-zinc-100 transition-colors">
              Войти
            </Link>
            <Link href="/signup" className="text-xs sm:text-sm font-medium text-black bg-green-500 rounded-lg px-3 py-1.5 sm:px-5 sm:py-2 hover:bg-green-600 transition-all whitespace-nowrap">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN STAGE ── */}
      <main className="relative flex-1 flex items-center justify-center min-h-screen">

        {/* ── HERO — centered, highest z-index ── */}
        <div className="relative z-30 flex flex-col items-center text-center px-5 max-w-[280px] sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
          <div className="flex items-center gap-2 mb-6 sm:mb-10 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-500 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
            ОНЛАЙН
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 sm:mb-8 leading-tight">
            Перестаньте терять деньги из-за забытых подписок.
          </h2>

          <GoogleAuthButton />
        </div>

        {/* ───────────────────────────────────────────────────────────
            FLOATING CARDS — absolute on ALL breakpoints.
            Mobile: small (w-36~44), peeking from edges.
            Tablet: medium (w-52~60), partially visible.
            Desktop: full size (w-72~96), fully visible.
        ─────────────────────────────────────────────────────────── */}

        {/* Card 1 — Monthly Spend | left-center | SHARP */}
        <div className="
          absolute z-20 pointer-events-none
          w-40 sm:w-60 md:w-72 lg:w-80 xl:w-96
          -left-24 sm:-left-6 md:left-2 lg:left-10 xl:left-20
          top-1/2 -translate-y-[65%]
          rotate-[-2deg]
          hover:scale-105 transition-transform duration-300
        ">
          <MonthlySpendCard />
        </div>

        {/* Card 2 — Active Subs | right-lower | SHARP */}
        <div className="
          absolute z-20 pointer-events-none
          w-40 sm:w-60 md:w-72 lg:w-80 xl:w-96
          -right-24 sm:-right-6 md:right-2 lg:right-10 xl:right-20
          top-1/2 translate-y-[8%]
          rotate-[2deg]
          hover:scale-105 transition-transform duration-300
        ">
          <ActiveSubsCard />
        </div>

        {/* Card 3 — Leakage Protection | bottom-left | BLURRED */}
        <div className="
          absolute z-10 pointer-events-none
          w-36 sm:w-52 md:w-64 lg:w-72 xl:w-80
          -left-10 sm:left-4 md:left-[6%] lg:left-[20%]
          bottom-10 sm:bottom-14 md:bottom-20
          blur-[3px]
          opacity-75
          rotate-[-4deg]
        ">
          <LeakageCard />
        </div>

        {/* Card 4 — Unwanted Charges | top-right | BLURRED */}
        <div className="
          absolute z-0 pointer-events-none
          w-36 sm:w-52 md:w-56 lg:w-64 xl:w-72
          -right-10 sm:right-4 md:right-[6%] lg:right-[20%]
          top-16 sm:top-20 md:top-28
          blur-[3px]
          opacity-65
          rotate-[5deg]
        ">
          <UnwantedCard />
        </div>

      </main>
    </div>
  );
}