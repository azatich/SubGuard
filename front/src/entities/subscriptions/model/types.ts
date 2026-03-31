import { LucideIcon } from "lucide-react";

export type SubscriptionStatus = "Active" | "Cancelled";
export type SubscriptionCycle = "Monthly" | "Yearly";
export type SubscriptionCurrency = "USD" | "EUR" | "RUB" | "KZT";

export interface Subscription {
  id: string;
  user_id?: string;
  
  name: string;
  category: string;
  cycle: SubscriptionCycle;
  currency: SubscriptionCurrency | string;
  cost: number;
  
  first_payment_date: string;
  created_at?: string;
  
  status: SubscriptionStatus;
}

export type SubscriptionTemplate = {
  name: string;
  category: string;
  color: string;
  logoUrl: string;
};

export interface CategoryConfig {
  label: string;
  icon: any;
  colorClass: string;
}