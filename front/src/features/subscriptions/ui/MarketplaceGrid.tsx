"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { 
  POPULAR_SUBSCRIPTIONS, 
  SUBSCRIPTION_CATEGORIES, 
  SubscriptionTemplate 
} from "@/entities/subscriptions"; 
import { ParsedReceiptData, ReceiptScannerButton } from "./ReceiptScannerButton";
import { SubscriptionBrandIcon } from "@/entities/subscriptions/ui/SubscriptionBrandIcon";

interface MarketplaceGridProps {
  onSelectTemplate: (template: SubscriptionTemplate) => void;
  setValue: (field: any, value: any) => void;
  setSelectedTemplate: (template: SubscriptionTemplate | null) => void;
}

export const MarketplaceGrid = ({ 
  onSelectTemplate,
  setValue,
  setSelectedTemplate
}: MarketplaceGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const availableCategories = useMemo(() => {
    const categories = new Set(POPULAR_SUBSCRIPTIONS.map((sub) => sub.category));
    return Array.from(categories);
  }, []);

  const filteredSubscriptions = useMemo(() => {
    return POPULAR_SUBSCRIPTIONS.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? sub.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleScanSuccess = (data: ParsedReceiptData) => {
    // 1. Устанавливаем фиктивный шаблон, чтобы переключить модалку на Шаг 2 (Форму)
    setSelectedTemplate({
      name: data.merchant || "",
      category: data.categoryFallback || "Software",
      color: "#18181b",
      logoUrl: "",
    });

    if (data.merchant) setValue("name", data.merchant);
    if (data.totalCost) setValue("cost", data.totalCost);
    if (data.currencyISO) setValue("currency", data.currencyISO);
    if (data.categoryFallback) setValue("category", data.categoryFallback);
    if (data.paymentDate) setValue("date", data.paymentDate);
  };

  return (
    <div className="w-full flex flex-col relative">
      
      {/* 🔥 ЛИПКАЯ ШАПКА */}
      <div className="sticky top-0 z-20 bg-[#18181b] px-6 py-4 border-b border-zinc-800/80 shadow-md">
        <div className="flex flex-col gap-4">
          
          {/* Поиск и Сканер сгруппированы вместе */}
          <div className="flex flex-col gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Найти сервис..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>
            
            <ReceiptScannerButton onScanSuccess={handleScanSuccess} />
          </div>

          {/* Фильтры категорий */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-zinc-200 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-black hover:bg-[#2cfc73]"
              }`}
            >
              Все
            </button>
            {availableCategories.map((categoryKey) => (
              <button
                key={categoryKey}
                onClick={() => setSelectedCategory(categoryKey)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === categoryKey
                    ? "bg-zinc-200 text-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-black hover:bg-[#2cfc73]"
                }`}
              >
                {SUBSCRIPTION_CATEGORIES[categoryKey]?.label || categoryKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🗂 СЕТКА КАРТОЧЕК */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6 pt-5">
        
        {/* Кнопка "Свой вариант" */}
        <button
          onClick={() => onSelectTemplate({ name: "", category: "Entertainment", color: "#3f3f46", logoUrl: "" })}
          className="flex flex-col items-center justify-center gap-2.5 p-4 bg-[#0a0a0a] border border-dashed border-zinc-700 rounded-2xl hover:bg-zinc-800/50 transition-all hover:border-zinc-500 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#18181b] border border-zinc-800 flex items-center justify-center transition-colors group-hover:border-zinc-600">
            <span className="text-xl text-zinc-500 group-hover:text-white transition-colors">+</span>
          </div>
          <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors text-center">
            Другой сервис
          </span>
        </button>

        {/* Остальные шаблоны */}
        {filteredSubscriptions.map((sub) => (
          <button
            key={sub.name}
            onClick={() => onSelectTemplate(sub)}
            className="flex flex-col items-center justify-center gap-2.5 p-4 bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl hover:bg-zinc-800/50 transition-all hover:border-zinc-700 group"
          >
            {/* 🔥 МАГИЯ: Используем наш компонент. Никаких битых картинок больше не будет! */}
            <div className="transition-transform group-hover:-translate-y-1">
              <SubscriptionBrandIcon 
                name={sub.name} 
                category={sub.category} 
                size="lg" 
              />
            </div>
            <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors text-center">
              {sub.name}
            </span>
          </button>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center pb-6 text-sm text-zinc-500 px-6">
          Мы не нашли сервис <b>«{searchQuery}»</b>.<br />
          Нажмите «Другой сервис», чтобы добавить его вручную.
        </div>
      )}
    </div>
  );
};