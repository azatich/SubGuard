import dotenv from "dotenv";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/connect.js";
import cron from 'node-cron'

import authRouter from './routes/auth.js'
import subscriptionRouter from './routes/subscription.js'
import settingsRouter from './routes/settings.js';
import receiptRouter from './routes/receipt.js';
import notificationRouter from './routes/notification.js';
import { NotificationController } from "./controllers/NotificationsController.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

const supabase = connectDb(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", 'https://subsguard.vercel.app'],
    credentials: true,
  }),
);
app.use(express.json({limit: '10mb'}));
app.use(cookieParser())

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.disable('etag');

app.use('/api/auth', authRouter)
app.use('/api/subscription', subscriptionRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/receipt', receiptRouter)
app.use('/api/notification', notificationRouter)

cron.schedule('0 9 * * *', () => {
  NotificationController.processDailyReminders()
})


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log("⏰ Планировщик уведомлений активирован.");
});


export { supabase };
