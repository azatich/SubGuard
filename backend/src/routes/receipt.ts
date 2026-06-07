import express from 'express'
import multer from 'multer';
import { requireAuth } from '../middlewares/AuthMiddleware.js';
import { ReceiptController } from '../controllers/ReceiptController.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const router = express.Router();

router.post('/scan', requireAuth, ReceiptController.ScanReceipt)
router.post('/scan-subscriptions', requireAuth, upload.single('file'), ReceiptController.ScanSubscriptions)

export default router;