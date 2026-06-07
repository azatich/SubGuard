import express from "express";
import { TelegramController } from "../controllers/TelegramController.js";
import { requireAuth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/setup", TelegramController.setupWebhookEndpoint);
router.post("/webhook", TelegramController.handleWebhook);
router.post("/save-id", requireAuth, TelegramController.saveTelegramId);
router.get("/id", requireAuth, TelegramController.getTelegramId);

export default router;
