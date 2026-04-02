"use client";

import { Loader2, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Subscription,
  SUBSCRIPTION_CATEGORIES,
  SUBSCRIPTION_CYCLES,
} from "@/entities/subscriptions";
import { useEditSubscription } from "../model/use-edit-subscription";

const subscriptionSchema = z.object({
  name: z.string().min(2, "Введите название сервиса"),
  category: z.string().min(1, "Выберите категорию"),
  cycle: z.string().min(1, "Выберите цикл оплаты"),
  currency: z.string().min(1, "Выберите валюту"),
  cost: z
    .number({ error: "Введите сумму" })
    .positive("Сумма должна быть больше 0"),
  date: z.string().min(1, "Выберите дату"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface EditSubscriptionModal {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
}

export const EditSubscriptionModal = ({
  isOpen,
  onClose,
  subscription,
}: EditSubscriptionModal) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    values: {
      name: subscription.name,
      category: subscription.category,
      cycle: subscription.cycle,
      currency: subscription.currency,
      date: subscription.first_payment_date,
      cost: subscription.cost,
    },
  });

  const { mutate: editSubscription, isPending } = useEditSubscription();

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      await editSubscription({
        id: subscription.id,
        ...data,
      });
      handleClose();
    } catch (error) {
      console.log("Ошибка обновления");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-120 bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-6 pb-4 border-b border-zinc-800/50">
          <div>
            <h2 className="text-xl font-bold text-white">
              Редактировать подписку
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Введите данные о вашем регулярном расходе.
            </p>
          </div>
          <Button
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-zinc-200">
                Название сервиса
              </Label>
              <input
                {...register("name")}
                placeholder="напр., Netflix, Spotify"
                className={`bg-[#0a0a0a] border ${errors.name ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors`}
              />
              {errors.name && (
                <span className="text-xs text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Категория */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-200">
                  Категория
                </Label>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    // ФИКС ОШИБКИ: Используем value вместо defaultValue
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full h-12.5 bg-[#0a0a0a] border ${
                          errors.category ? "border-red-500" : "border-zinc-800"
                        } rounded-xl px-4 text-sm text-white focus:ring-0 focus:ring-offset-0 focus:border-zinc-600 transition-colors hover:bg-[#121212]`}
                      >
                        <SelectValue placeholder="Выберите категорию">
                          {field.value
                            ? SUBSCRIPTION_CATEGORIES[field.value].label
                            : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-zinc-800 text-zinc-300 rounded-xl shadow-2xl">
                        <SelectGroup>
                          {Object.entries(SUBSCRIPTION_CATEGORIES).map(
                            ([key, obj]) => (
                              <SelectItem
                                key={key}
                                value={key}
                                className="focus:bg-zinc-800 focus:text-white  cursor-pointer rounded-lg py-2.5 px-3 my-0.5 outline-none transition-colors"
                              >
                                {obj.label}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <span className="text-xs text-red-500">
                    {errors.category.message}
                  </span>
                )}
              </div>

              {/* Цикл оплаты */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-200">
                  Цикл оплаты
                </label>
                <Controller
                  control={control}
                  name="cycle"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full h-12.5 bg-[#0a0a0a] border ${
                          errors.cycle ? "border-red-500" : "border-zinc-800"
                        } rounded-xl px-4 text-sm text-white focus:ring-0 focus:ring-offset-0 focus:border-zinc-600 transition-colors hover:bg-[#121212]`}
                      >
                        <SelectValue placeholder="напр., Ежемесячно">
                          {field.value
                            ? SUBSCRIPTION_CYCLES[field.value]
                            : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-zinc-800 text-zinc-300 rounded-xl shadow-2xl">
                        <SelectGroup>
                          {Object.entries(SUBSCRIPTION_CYCLES).map(
                            ([key, label]) => (
                              <SelectItem
                                key={key}
                                value={key}
                                className="focus:bg-zinc-800 focus:text-white  cursor-pointer rounded-lg py-2.5 px-3 my-0.5 outline-none transition-colors"
                              >
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.cycle && (
                  <span className="text-xs text-red-500">
                    {errors.cycle.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-200">
                  Сумма
                </Label>
                <div
                  className={`flex flex-row items-center bg-[#0a0a0a] border ${errors.cost ? "border-red-500" : "border-zinc-800"} rounded-xl overflow-hidden focus-within:border-zinc-600 transition-colors`}
                >
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {/* Триггер (Кнопка) */}
                        <SelectTrigger className="w-25 h-12.5 border-0 border-r border-zinc-800 rounded-none bg-transparent text-zinc-400 hover:text-white focus:ring-0 focus:ring-offset-0 px-3 shadow-none transition-colors outline-none">
                          <SelectValue placeholder="USD ($)" />
                        </SelectTrigger>

                        {/* Выпадающее меню */}
                        <SelectContent className="bg-[#18181b] border-zinc-800 text-zinc-300 rounded-xl shadow-2xl min-w-27.5">
                          <SelectGroup>
                            <SelectItem
                              value="USD"
                              className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2 px-3 my-0.5 outline-none transition-colors"
                            >
                              USD ($)
                            </SelectItem>
                            <SelectItem
                              value="EUR"
                              className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2 px-3 my-0.5 outline-none transition-colors"
                            >
                              EUR (€)
                            </SelectItem>
                            <SelectItem
                              value="RUB"
                              className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2 px-3 my-0.5 outline-none transition-colors"
                            >
                              RUB (₽)
                            </SelectItem>
                            <SelectItem
                              value="KZT"
                              className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2 px-3 my-0.5 outline-none transition-colors"
                            >
                              KZT (₸)
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <input
                    type="number"
                    step="0.01"
                    {...register("cost", { valueAsNumber: true })}
                    placeholder="15.99"
                    className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder:text-zinc-600 outline-none border-none"
                  />
                </div>
                {errors.cost && (
                  <span className="text-xs text-red-500">
                    {errors.cost.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-200">
                  Первый платеж
                </Label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("date")}
                    className={`w-full appearance-none h-12.5 bg-[#0a0a0a] border ${errors.date ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50`}
                  />
                </div>
                {errors.date && (
                  <span className="text-xs text-red-500">
                    {errors.date.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 pt-4 border-t border-zinc-800/50 flex items-center justify-end gap-3 bg-[#18181b]">
            <Button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#2cfc73] hover:bg-[#25db63] text-black text-sm font-semibold rounded-lg px-6 py-2.5 transition-all shadow-[0_0_15px_rgba(44,252,115,0.15)] hover:shadow-[0_0_20px_rgba(44,252,115,0.25)] disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-8 h-8 text-[#2cfc73] animate-spin" />
              ) : (
                "Сохранить"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
