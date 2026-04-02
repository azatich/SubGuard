import type { Request, Response } from "express";
import { supabase } from "../index.js";
import type { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";

export class SubscriptionController {
  static async GetSubscriptions(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error("GetSubscriptions Server Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async AddSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { name, category, cycle, currency, date, cost } = req.body;

      if (!name || !category || !cycle || !currency || !date || !cost) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const nextPaymentDate = calculateNextPaymentDate(date, cycle);

      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          name,
          category,
          cycle,
          currency,
          first_payment_date: date,
          next_payment_date: nextPaymentDate,
          cost,
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error("AddSubscription Server Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async EditSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Subscription ID is required" });
      }

      const { name, category, cycle, currency, cost, date } = req.body;

      const updateFields: any = {};

      if (name) updateFields.name = name;
      if (category) updateFields.category = category;
      if (cycle) updateFields.cycle = cycle;
      if (currency) updateFields.currency = currency;
      if (cost !== undefined) updateFields.cost = cost;
      if (date) {
        updateFields.first_payment_date = date;
        const nextPaymentDate = calculateNextPaymentDate(date, cycle);
        updateFields.next_payment_date = nextPaymentDate; 
      }

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No data to update" });
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .update(updateFields)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error("Edit Subscription Server Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async DeleteSubscription(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const id = req.params.id;

      const { data, error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error("Delete Subscription Server Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async ToggleSubscriptionStatus(
    req: AuthenticatedRequest,
    res: Response,
  ) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const id = req.params.id;
      const { status } = req.body;

      if (status && !["Active", "Cancelled"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Недопустимый статус подписки" });
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .update({ status })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error("Delete Subscription Server Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

const calculateNextPaymentDate = (startDate: string, cycle: string): string => {
  let nextDate = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Пока дата в прошлом, прибавляем цикл, пока не выйдем в будущее или на сегодня
  while (nextDate < today) {
    if (cycle === "Monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (cycle === "Yearly") {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else {
      break;
    }
  }

  return nextDate.toISOString().substring(0, 10);
};
