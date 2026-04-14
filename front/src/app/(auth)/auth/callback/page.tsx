"use client";

import { api } from "@/shared/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const hash = window.location.hash;
    if (!hash) {
        setError("Токены авторизации не найдены.");
        return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      processed.current = true;
      api
        .post("/auth/session", { access_token, refresh_token })
        .then(() => {
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error("Session saving error:", err);
          setError("Ошибка при сохранении сессии.");
        });
    } else {
        setError("Не удалось получить токены авторизации.");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      {error ? (
        <div className="text-red-500">
            <h2 className="text-2xl font-bold mb-2">Ошибка авторизации</h2>
            <p>{error}</p>
            <button 
                onClick={() => router.push('/login')}
                className="mt-4 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full transition-colors"
            >
                Вернуться на страницу входа
            </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Авторизация...</h2>
          <p className="text-zinc-400">Подождите, мы настраиваем вашу сессию.</p>
        </div>
      )}
    </div>
  );
}
