import express from 'express'
import { AuthController } from '../controllers/AuthController.js'
import { requireAuth } from '../middlewares/AuthMiddleware.js'

const router = express.Router()

router.post('/signup', AuthController.signup)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/update-password', requireAuth, AuthController.updatePassword)
router.get('/google/url', AuthController.getGoogleAuthUrl)
router.post('/session', AuthController.setSession)

export default router