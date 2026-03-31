import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";
import { supabase } from "../index.js";

export class SettingsController {
  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { fullName, baseCurrency, reminderDays } = req.body;
      let avatarUrl: string | undefined = undefined;

      if (req.file) {
        const file = req.file;

        const fileExt = file.originalname.split(".").pop();
        const filePath = `${user.id}.${fileExt}`;

        const { error: uploadAvatarError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
            cacheControl: "3600",
          });

        if (uploadAvatarError) {
          return res.status(400).json({
            message: "Ошибка загрузки картинки: " + uploadAvatarError.message,
          });
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
      }

      const updateData: any = {};

      if (fullName) updateData.full_name = fullName;
      if (baseCurrency) updateData.base_currency = baseCurrency;
      if (reminderDays) updateData.reminder_days = reminderDays;
      if (avatarUrl) updateData.avatar_url = avatarUrl;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "Нет данных для обновления" });
      }

      const { data: updatedProfile, error: dbError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (dbError) {
        return res.status(400).json({ message: dbError.message });
      }
      return res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("Settings Update Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(200).json({
        id: profile.id,
        full_name: profile.full_name,
        base_currency: profile.base_currency,
        avatar_url: profile.avatar_url,
        email: profile.email,
        updated_at: profile.updated_at,
      });
    } catch (error) {}
  }

  static async deleteAvatar(req: AuthenticatedRequest, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile?.avatar_url) {
      const urlParts = profile.avatar_url.split("/");
      const fileName = urlParts[urlParts.length - 1].split("?")[0];

      await supabase.storage
        .from("avatars")
        .remove([fileName]);
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    return res.status(200).json({ message: "Avatar deleted successfully", data });
  } catch (error) {
    console.error("Delete Avatar Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
}
