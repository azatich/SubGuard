import type { NextFunction, Request, Response } from "express";
import { supabase } from "../index.js";
import { type User } from "@supabase/supabase-js";

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const {data: {user}, error} = await supabase.auth.getUser(token);

    if (!user || error) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
}