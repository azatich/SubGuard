"use client";

import { PasswordSecurityCard, ProfileInfoCard } from "@/features/settings";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Управление аккаунтом</h1>
        </div>

        <ProfileInfoCard />
        <PasswordSecurityCard />
      </div>
    </div>
  );
}