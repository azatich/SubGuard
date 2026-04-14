import { type Request, type Response } from "express";
import { supabase } from "../index.js";
import { createClient } from "@supabase/supabase-js";

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
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updatePassword(req: Request, res: Response) {
    try {
      const token = req.cookies.access_token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { newPassword, oldPassword } = req.body;

      // 1. Базовая валидация данных
      if (!oldPassword) {
        return res.status(400).json({ message: "Старый пароль обязателен" });
      }

      if (!newPassword || newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Пароль должен быть не менее 6 символов" });
      }

      // 2. Получаем email юзера по его токену из кук
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(token);

      if (userError || !user || !user.email) {
        return res
          .status(401)
          .json({ message: "Пользователь не найден или токен недействителен" });
      }

      // 🔥 3. СОЗДАЕМ ВРЕМЕННЫЙ КЛИЕНТ (защита от утечки сессий на сервере)
      const tempSupabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } },
      );

      // 4. Пытаемся "войти" со старым паролем для проверки
      const { error: signInError } = await tempSupabase.auth.signInWithPassword(
        {
          email: user.email,
          password: oldPassword,
        },
      );

      if (signInError) {
        // Если ошибка — значит, старый пароль не подошел
        return res.status(400).json({ message: "Неверный текущий пароль" });
      }

      // 5. Старый пароль верный! Обновляем его на новый через временный клиент
      const { error: updateError } = await tempSupabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return res.status(400).json({ message: updateError.message });
      }

      return res.status(200).json({ message: "Пароль успешно обновлен" });
    } catch (error) {
      console.error("Update Password Error:", error);
      return res.status(500).json({ message: `Internal server error: ${error}` });
    }
  }

  static async getGoogleAuthUrl(req: Request, res: Response) {
    try {
      const redirectUrl = req.query.redirectUrl as string || 'http://localhost:3000/auth/callback';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true
        }
      });

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(200).json({ url: data.url });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async setSession(req: Request, res: Response) {
    try {
      const { access_token, refresh_token } = req.body;

      if (!access_token || !refresh_token) {
        return res.status(400).json({ message: "Tokens are required" });
      }

      // Check if session is valid by retrieving the user
      const { data: { user }, error } = await supabase.auth.getUser(access_token);
      
      if (error || !user) {
        return res.status(401).json({ message: "Invalid session" });
      }

      res.cookie("access_token", access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ user: user });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

