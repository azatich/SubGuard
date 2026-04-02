import React, { useState } from "react";
import { Check, CheckCheck, Loader2, Mail, Trash2, X } from "lucide-react";
import {
  useNotifications,
  useMarkNotificationsAsRead,
} from "@/features/notifications";
import { Notification } from "@/entities/notifications";

export const Notifications = () => {
  const { data: notifications, isPending } = useNotifications();
  const { mutate: markAsReadMutation } = useMarkNotificationsAsRead();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const safeNotifications: Notification[] = notifications || [];
  const unreadCount = safeNotifications.filter((n) => !n.is_read).length;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const markAllAsRead = () => {
    const unreadIds = safeNotifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);
    if (unreadIds.length > 0) {
      markAsReadMutation(unreadIds);
    }
  };

  const markSelectedAsRead = () => {
    markAsReadMutation(selectedIds);
    setSelectedIds([]);
  };

  const deleteSelected = () => {
    // Здесь позже добавишь мутацию для удаления
    console.log("Удаляем:", selectedIds);
    setSelectedIds([]);
  };

  // Простой хелпер для форматирования даты (чтобы было похоже на макет)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isPending) {
    return (
      <div className="w-full h-64 bg-[#0a0a0a] rounded-xl flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#2cfc73] animate-spin" />
        <span className="text-zinc-500 text-sm">Загрузка уведомлений...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* --- ШАПКА --- */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-zinc-400 text-sm">
            У вас {unreadCount} непрочитанн{unreadCount == 1 ? "ая" : "ых"}{" "}
            уведомлений.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          title="Отметить все как прочитанные"
          aria-label="Отметить все как прочитанные"
          className="flex items-center gap-2 text-sm font-medium text-zinc-900 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-800 transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          Все
        </button>
      </div>

      {/* --- СПИСОК УВЕДОМЛЕНИЙ --- */}
      <div className="flex flex-col gap-3">
        {safeNotifications.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            У вас нет уведомлений.
          </div>
        ) : (
          safeNotifications.map((notification) => {
            const isSelected = selectedIds.includes(notification.id);

            return (
              <div
                key={notification.id}
                onClick={() => toggleSelection(notification.id)}
                className={`group relative p-5 rounded-xl border flex items-start gap-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-[#0A1F11] border-green-500/50"
                    : notification.is_read
                      ? "bg-[#0d0d0d] border-zinc-800/40 opacity-60 hover:opacity-80 hover:border-zinc-700"
                      : "bg-[#121214] border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                {/* Кастомный чекбокс */}
                <div
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-green-500 border-green-500 text-black"
                      : "border-zinc-600 group-hover:border-zinc-500"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                {/* Контент */}
                <div className="flex-1 pr-6">
                  <p
                    className={`text-[14px] leading-relaxed ${
                      notification.is_read ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span
                      className={`text-sm ${
                        notification.is_read ? "text-zinc-700" : "text-zinc-500"
                      }`}
                    >
                      {formatTime(notification.sent_at)}
                    </span>

                    {notification.is_read && (
                      <span className="flex items-center gap-1 text-xs text-zinc-700">
                        <CheckCheck className="w-3 h-3" />
                        Прочитано
                      </span>
                    )}
                  </div>
                </div>

                {/* Зеленая точка (Индикатор непрочитанного) */}
                {!notification.is_read && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- ПЛАВАЮЩАЯ ПАНЕЛЬ ДЕЙСТВИЙ (Floating Action Bar) --- */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#1C1C1E] border border-zinc-700 rounded-full px-5 py-3.5 flex items-center gap-5 shadow-2xl z-50 animate-in slide-in-from-bottom-8 fade-in duration-200">
          <div className="text-zinc-100 font-medium text-sm flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 bg-green-500/20 text-green-500 rounded-full text-xs">
              {selectedIds.length}
            </span>
            выбрано
          </div>

          <div className="w-px h-5 bg-zinc-700" />

          <button
            aria-label="Отметить как прочитанные"
            onClick={markSelectedAsRead}
            className="flex items-center gap-2 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Прочитать
          </button>

          <button
            aria-label="Удалить выбранные"
            onClick={deleteSelected}
            className="flex items-center gap-2 text-[#FF6B6B] hover:text-red-400 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>

          <div className="w-px h-5 bg-zinc-700" />

          <button
            aria-label="Отменить выбор"
            onClick={() => setSelectedIds([])}
            className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
