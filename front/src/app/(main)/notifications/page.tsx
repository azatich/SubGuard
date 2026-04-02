"use client";

import { Notifications, useNotifications } from "@/features/notifications";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Уведомления
          </h1>
        </div>

        <Notifications />
      </div>
    </div>
  );
}
