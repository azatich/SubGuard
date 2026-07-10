"use client";

import { FileSearch } from "lucide-react";

import { PdfSubscriptionScanner } from "@/features/subscriptions";

const StatementAnalysisPage = () => {
  return (
    <div className="px-4 py-8 sm:px-12 lg:px-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Анализ выписки
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Загрузите PDF банковскую выписку, чтобы ИИ нашел регулярные списания.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#2cfc73]/30 bg-[#0A1F11] text-[#2cfc73]">
            <FileSearch className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 sm:p-6">
          <PdfSubscriptionScanner />
        </div>
      </div>
    </div>
  );
};

export default StatementAnalysisPage;
