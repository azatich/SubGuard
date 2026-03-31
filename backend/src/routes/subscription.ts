import express from 'express'
import { requireAuth } from '../middlewares/AuthMiddleware.js';
import { SubscriptionController } from '../controllers/SubscriptionController.js';

const router = express.Router();

router.post('/subscription', requireAuth, SubscriptionController.AddSubscription)

router.patch('/subscription/:id', requireAuth, SubscriptionController.EditSubscription)
router.patch('/subscription/toggle-status/:id', requireAuth, SubscriptionController.ToggleSubscriptionStatus)

router.get('/', requireAuth, SubscriptionController.GetSubscriptions)

router.delete('/subscription/:id', requireAuth, SubscriptionController.DeleteSubscription);

export default router;