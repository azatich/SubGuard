import { type Request, type Response } from "express";
import { supabase } from "../index.js";

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { full_name, email, password } = req.body;

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: full_name,
          },
        },
      });

      if (error) {
        return res.status(500).json({
          message: error.message,
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        return res.status(401).json({
          message: error.message,
        });
      }

      const access_token = data.session.access_token;
      const refresh_token = data.session.refresh_token;

      res.cookie("access_token", access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ user: data.user });
    } catch (error) {
      return res.status(500).json({message: 'Internal server error'})
    }

  }

  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(500).json({message: 'Internal server error'})
    }
  } 

  static async updatePassword(req: Request, res: Response) {
    try {
      const token = req.cookies.access_token;
      
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      // Supabase requires the user's JWT to update their own password
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Update Password Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
