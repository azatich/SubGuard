import express from 'express'
import { requireAuth } from '../middlewares/AuthMiddleware.js';
import { ReceiptController } from '../controllers/ReceiptController.js';

const router = express.Router();

router.post('/scan', requireAuth, ReceiptController.ScanReceipt)

export default router;