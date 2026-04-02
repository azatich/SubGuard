import express from 'express'
import { NotificationController } from '../controllers/NotificationsController.js'
import { requireAuth } from '../middlewares/AuthMiddleware.js'

const router = express.Router()


router.post('/send-daily-reminders', NotificationController.processDailyReminders)

router.get('/', requireAuth, NotificationController.getNotifications)

router.patch('/mark-as-read', requireAuth, NotificationController.markAsRead)

export default router;