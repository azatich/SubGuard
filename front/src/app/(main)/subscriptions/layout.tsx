import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'SubGuard | Subscriptions',
    description: ''
} 

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}