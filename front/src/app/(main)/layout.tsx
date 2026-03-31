import { Header } from "@/widgets/header";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-950 min-h-screen">
      <Header />
      {children}
    </div>
  );
}
