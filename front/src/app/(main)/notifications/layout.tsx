import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'SubGuard | Notifications',
    description: ''
} 

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}