"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Eye } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSignup } from "../model/use-signup";

const signupSchema = z.object({
  full_name: z.string().min(3, "Имя должно содержать минимум 3 символа"),
  email: z.string().email("Введите корректный email адрес"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
});

type Inputs = z.infer<typeof signupSchema>;

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(signupSchema) });

  const { mutate: signup, isPending, error, isError } = useSignup();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signup(data);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Создать аккаунт</h2>
        <p className="text-zinc-400">
          Начните легко отслеживать свои подписки.
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          variant="outline"
          className="h-12 bg-transparent border-neutral-800 text-white hover:bg-neutral-900 hover:text-white rounded-full"
        >
          <span className="mr-2 text-lg">G</span> Google
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
          <Label className="text-zinc-400 font-normal">Полное имя</Label>
          <Input
            placeholder="Azat Frontend"
            {...register("full_name")}
            className={`bg-neutral-900 border-neutral-800 text-white rounded-xl placeholder:text-zinc-600 focus-visible:ring-green-500 ${
              errors.full_name
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

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
              {error?.response?.data?.message  ||
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
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <Eye className="w-4 h-4" />
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
          className={`disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2 bg-[#2cfc73] hover:bg-[#25db63] text-black font-semibold rounded-full py-6 text-base transition-all`}
        >
          {isPending ? "Создание..." : "Создать аккаунт"}
        </Button>
      </form>

      <p className="text-center text-zinc-400 text-sm mt-4">
        Уже есть аккаунт?{" "}
        <a
          href="/login"
          className="text-white hover:text-green-400 transition-colors font-medium"
        >
          Войти
        </a>
      </p>
    </div>
  );
};
