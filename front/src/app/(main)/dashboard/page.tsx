"use client";

import { Loader2 } from "lucide-react";
import { useSubscriptionsQuery } from "@/features/subscriptions";
import {
  ExpenseChart,
  SummaryCards,
  UpcomingPayments,
} from "@/widgets/dashboard-metrics";
import { useProfile } from "@/entities/user/useProfile";

export default function DashboardPage() {
  const { data: subscriptions = [], isPending } = useSubscriptionsQuery();
  const { data: user } = useProfile();

  const baseCurrency = user?.base_currency || "USD";

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2cfc73]" />
      </div>
    );
  }

  const activeSubs = subscriptions.filter((sub) => sub.status === "Active");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-8 px-4 sm:px-8 relative overflow-hidden flex justify-center">
      {/* Background glowing blurred circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#2cfc73]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#2cfc73]/5 blur-[150px] pointer-events-none" />


      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Дэшборд</h1>
          <p className="text-zinc-400 mt-1">
            Обзор ваших подписок и ежемесячных расходов.
          </p>
        </div>

        <SummaryCards subscriptions={activeSubs} baseCurrency={baseCurrency} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExpenseChart subscriptions={activeSubs} baseCurrency={baseCurrency} />
          </div>
          <div className="lg:col-span-1">
            <UpcomingPayments subscriptions={activeSubs} />
          </div>
        </div>
      </div>
    </div>
  );
}
