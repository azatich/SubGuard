import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useUpdateProfile } from "../model/useUpdateProfile";
import { useProfile } from "@/entities/user/useProfile";
import { useDeleteProfileAvatar } from "../model/useDeleteProfileAvatar";

const formatDaysLabel = (days: string) => {
  const d = parseInt(days, 10);
  if (d === 1) return "За 1 день";
  if (d >= 2 && d <= 4) return `За ${d} дня`;
  return `За ${d} дней`;
};

const profileSchema = z.object({
  fullName: z.string().min(2, "Полное имя должно содержать минимум 2 символа"),
  baseCurrency: z.string().min(1, "Пожалуйста, выберите валюту"),
  reminderDays: z.string().min(1, "Выберите срок напоминания"), 
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileInfoCard = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { data: user, isPending: isLoadingUserProfile } = useProfile();
  const { mutate: deleteAvatar, isPending: isLoadingDeleteAvatar } =
    useDeleteProfileAvatar();
    
    const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.full_name || "",
      baseCurrency: user?.base_currency || 'USD',
      reminderDays: user?.reminder_days?.toString() || '3',
    },
  });

  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar_url || '');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("baseCurrency", data.baseCurrency);
      formData.append("reminderDays", data.reminderDays); 
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      
      await updateProfile(formData);
      setAvatarFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full bg-[#18181b] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-zinc-800/50">
        <h2 className="text-xl font-bold text-white">Базовый профиль</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Обновите настройки профиля, уведомления или аватарку
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="p-6 flex flex-col gap-8">
          
          {/* Аватар (без изменений) */}
          <div className="flex items-center gap-6">
            <div
              className={`${!avatarPreview ? 'animate-pulse' : '' } relative w-24 h-24 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center group cursor-pointer`}
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <User className="w-8 h-8 text-zinc-600" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Загрузить новое фото
              </button>
              {user?.avatar_url && (
                <button
                  type="button"
                  onClick={() => deleteAvatar()}
                  disabled={isLoadingDeleteAvatar}
                  className="disabled:bg-red-700 px-4 py-2 bg-red-500 hover:bg-red-700 text-red-950 text-sm font-medium rounded-lg transition-colors"
                >
                  Удалить аватарку
                </button>
              )}
            </div>
          </div>

          {/* 🔥 ПЕРЕГРУППИРОВАННЫЕ ПОЛЯ НАСТРОЕК */}
          <div className="flex flex-col gap-6">
            
            {/* Полное имя (теперь на всю ширину) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-200">
                Полное имя
              </label>
              <input
                {...register("fullName")}
                placeholder="John Doe"
                className={`w-full bg-[#0a0a0a] border ${errors.fullName ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors`}
              />
              {errors.fullName && (
                <span className="text-xs text-red-500">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Валюта и Уведомления (в две колонки) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Базовая валюта */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-200">
                  Базовая валюта
                </label>
                <Controller
                  control={control}
                  name="baseCurrency"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full h-[46px] bg-[#0a0a0a] border ${errors.baseCurrency ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 text-sm text-white focus:ring-0 focus:ring-offset-0 focus:border-zinc-600 transition-colors hover:bg-[#121212]`}
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-zinc-800 text-zinc-300 rounded-xl shadow-2xl">
                        <SelectGroup>
                          <SelectItem value="USD" className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2.5 px-3 my-0.5 outline-none">
                            USD ($) - US Dollar
                          </SelectItem>
                          <SelectItem value="EUR" className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2.5 px-3 my-0.5 outline-none">
                            EUR (€) - Euro
                          </SelectItem>
                          <SelectItem value="RUB" className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2.5 px-3 my-0.5 outline-none">
                            RUB (₽) - Russian Ruble
                          </SelectItem>
                          <SelectItem value="KZT" className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2.5 px-3 my-0.5 outline-none">
                            KZT (₸) - Kazakhstani Tenge
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <span className="text-xs text-zinc-500">
                  Эта валюта будет использоваться для расчетов.
                </span>
              </div>

              {/* 🔥 НОВОЕ ПОЛЕ: Уведомления по умолчанию */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-200">
                  Дефолтные уведомления
                </label>
                <Controller
                  control={control}
                  name="reminderDays"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full h-[46px] bg-[#0a0a0a] border ${errors.reminderDays ? "border-red-500" : "border-zinc-800"} rounded-xl px-4 text-sm text-white focus:ring-0 focus:ring-offset-0 focus:border-zinc-600 transition-colors hover:bg-[#121212]`}
                      >
                        <SelectValue placeholder="Выберите время">
                          {field.value ? formatDaysLabel(field.value) : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-[#18181b] border-zinc-800 text-zinc-300 rounded-xl shadow-2xl">
                        <SelectGroup>
                          {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                            const dayStr = day.toString();
                            return (
                              <SelectItem
                                key={dayStr}
                                value={dayStr}
                                className="focus:bg-zinc-800 focus:text-white cursor-pointer rounded-lg py-2.5 px-3 my-0.5 outline-none"
                              >
                                {formatDaysLabel(dayStr)}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <span className="text-xs text-zinc-500">
                  За сколько дней предупреждать о новых подписках.
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Подвал */}
        <div className="p-6 pt-4 border-t border-zinc-800/50 bg-[#121212] flex justify-end">
          <button
            type="submit"
            disabled={(!isDirty && !avatarFile) || isSubmitting || isPending}
            className="bg-[#2cfc73] hover:bg-[#25db63] text-black text-sm font-semibold rounded-lg px-6 py-2.5 transition-all shadow-[0_0_15px_rgba(44,252,115,0.15)] hover:shadow-[0_0_20px_rgba(44,252,115,0.25)] disabled:opacity-50 disabled:shadow-none"
          >
            {isSubmitting || isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              "Сохранить"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};