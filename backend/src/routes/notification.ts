import express from 'express'
import { NotificationController } from '../controllers/NotificationsController.js'

const router = express.Router()


router.post('/send-daily-reminders', NotificationController.processDailyReminders)

export default router;