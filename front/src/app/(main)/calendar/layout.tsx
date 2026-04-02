import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: 'SubGuard | Calendar',
    description: ''
} 

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}