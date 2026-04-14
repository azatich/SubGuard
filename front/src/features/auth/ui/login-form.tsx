"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { useLogin } from "../model/use-login";
import { useSignupWithGoogle } from "../model/use-signup-google";
import { translateAuthError } from "@/shared/lib/error-mapper";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email адрес"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
});

type Inputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending, error, isError } = useLogin();
  const { mutate: loginWithGoogle, isPending: isGooglePending } = useSignupWithGoogle();

  const onSubmit = (data: Inputs) => {
    login(data);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Войти в аккаунт</h2>
        <p className="text-zinc-400">
          Начните легко отслеживать свои подписки.
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          type="button"
          onClick={() => loginWithGoogle()}
          disabled={isGooglePending}
          variant="outline"
          className="h-12 bg-transparent border-neutral-800 text-white hover:bg-neutral-900 hover:text-white rounded-full disabled:opacity-50"
        >
          {isGooglePending ? (
            <span className="mr-2 text-lg animate-pulse">...</span>
          ) : (
            <span className="mr-2 text-lg">G</span>
          )}
          Google
        </Button>
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-zinc-800"></div>
        <span className="px-4 text-xs text-zinc-500 uppercase tracking-wider bg-zinc-950">
          Или
        </span>
        <div className="flex-grow border-t border-zinc-800"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="space-y-2">
          <Label className="text-zinc-400 font-normal">Эл. почта</Label>
          <Input
            type="email"
            placeholder="neymarjr@example.com"
            {...register("email")}
            className={`bg-neutral-900 border-neutral-800 text-white rounded-xl placeholder:text-zinc-600 focus-visible:ring-green-500 ${
              errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          {isError && (
            <p className="text-red-500 text-sm mt-1">
              {translateAuthError(error?.response?.data?.message) ||
                "Произошла непредвиденная ошибка"}
            </p>
          )}
        </div>

        <div className="space-y-2 relative">
          <Label className="text-zinc-400 font-normal">Пароль</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`bg-neutral-900 border-neutral-800 text-white rounded-xl placeholder:text-zinc-600 focus-visible:ring-green-500 pr-10 ${
                errors.password
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Eye
                onClick={() => setShowPassword((prev) => !prev)}
                className="w-4 h-4"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          disabled={isPending}
          type="submit"
          className="disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2 bg-[#2cfc73] hover:bg-[#25db63] text-black font-semibold rounded-full py-6 text-base transition-all"
        >
          {isPending ? "Вход..." : "Войти"}
        </Button>
      </form>

      {/* Ссылка на логин */}
      <p className="text-center text-zinc-400 text-sm mt-4">
        Нету аккаунта?{" "}
        <a
          href="/signup"
          className="text-white hover:text-green-400 transition-colors font-medium"
        >
          Зарегистрироваться
        </a>
      </p>
    </div>
  );
};
