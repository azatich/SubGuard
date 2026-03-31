import { Subscription } from "@/entities/subscriptions";
import { useExchangeRates } from "@/shared/lib/useExchangeRates";
import { Wallet, Activity, CreditCard } from "lucide-react";

interface SummaryCardsProps {
  subscriptions: Subscription[];
  baseCurrency: string;
}

export const SummaryCards = ({
  subscriptions,
  baseCurrency,
}: SummaryCardsProps) => {
  const { data: rates, isPending } = useExchangeRates(baseCurrency);

  if (isPending) {
    return <div className="animate-pulse bg-[#18181b] h-[120px] rounded-2xl" />;
  }

  const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
    const monthlyCost = sub.cycle === "Yearly" ? sub.cost / 12 : sub.cost;

    const exchangeRate = rates?.[sub.currency] || 1;

    const convertedCost = monthlyCost / exchangeRate;

    return acc + convertedCost;
  }, 0);

  const maxConvertedCost = subscriptions.reduce((max, sub) => {
    const exchangeRate = rates?.[sub.currency] || 1;
    const convertedCost = sub.cost / exchangeRate;
    
    return convertedCost > max ? convertedCost : max;
  }, 0);

  const currencySymbol =
    baseCurrency === "KZT"
      ? "₸"
      : baseCurrency === "RUB"
        ? "₽"
        : baseCurrency === "EUR"
          ? "€"
          : "$";

  const cards = [
    {
      title: "Ежемесячные траты",
      value: `${currencySymbol}${totalMonthlySpend.toFixed(2)}`,
      icon: <Wallet className="w-5 h-5 text-[#2cfc73]" />,
      description: "Ваш средний расход в месяц",
    },
    {
      title: "Активные подписки",
      value: subscriptions.length,
      icon: <Activity className="w-5 h-5 text-blue-400" />,
      description: "Количество используемых сервисов",
    },
    {
      title: "Самая дорогая",
      value: subscriptions.length 
        ? `${currencySymbol}${maxConvertedCost.toFixed(2)}` 
        : `${currencySymbol}0.00`,
      icon: <CreditCard className="w-5 h-5 text-rose-400" />,
      description: "Максимальный разовый платеж",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="relative bg-[#18181b] border border-zinc-800 rounded-2xl p-6 shadow-lg"
        >
          {/* <div className="absolute w-32 h-32 bg-green-500/15 rounded-full top-0 right-0 blur-[120px]" /> */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-400">{card.title}</h3>
            <div className="p-2 bg-zinc-900 rounded-lg">{card.icon}</div>
          </div>
          <div className="text-3xl font-bold text-white">{card.value}</div>
          <p className="text-xs text-zinc-500 mt-2">{card.description}</p>
        </div>
      ))}
    </div>
  );
};
