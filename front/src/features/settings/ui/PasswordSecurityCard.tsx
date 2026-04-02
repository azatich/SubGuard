import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useUpdatePassword } from "../model/useUpdatePassword";

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  newPassword: z.string().min(6, "Новый пароль должен содержать минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});
type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordSecurityCard = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const onSubmit = (data: PasswordFormValues) => {
    if (data.newPassword === data.currentPassword) return;
    updatePassword(
      { newPassword: data.newPassword, oldPassword: data.currentPassword},
      {
        onSuccess: () => reset(), // Очищаем форму только при успехе
      }
    );
  };

  return (
    <div className="w-full bg-[#18181b] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl mt-8">
      <div className="p-6 border-b border-zinc-800/50">
        <h2 className="text-xl font-bold text-white">Безопасность</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="p-6 flex flex-col gap-5 max-w-md">
          
          {/* Текущий пароль */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-200">Текущий пароль</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="••••••••"
                className={`w-full bg-[#0a0a0a] border ${errors.currentPassword ? "border-red-500" : "border-zinc-800"} rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors`}
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors outline-none">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.currentPassword && <span className="text-xs text-red-500">{errors.currentPassword.message}</span>}
          </div>

          {/* Новый пароль */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-200">Новый пароль</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
                placeholder="••••••••"
                className={`w-full bg-[#0a0a0a] border ${errors.newPassword ? "border-red-500" : "border-zinc-800"} rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors`}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors outline-none">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>}
          </div>

          {/* Подтверждение пароля */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-200">Подтверждение пароля</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="••••••••"
                className={`w-full bg-[#0a0a0a] border ${errors.confirmPassword ? "border-red-500" : "border-zinc-800"} rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors outline-none">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
          </div>

        </div>

        {/* Подвал */}
        <div className="p-6 pt-4 border-t border-zinc-800/50 bg-[#121212] flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-white hover:bg-zinc-200 text-black text-sm font-semibold rounded-lg px-6 py-2.5 transition-colors disabled:opacity-50"
          >
            {isPending ? <Loader2  className="w-4 h-4 text-black animate-spin"/> : "Обновить пароль"}
          </button>
        </div>
      </form>
    </div>
  );
};