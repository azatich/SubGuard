import express from "express";
import multer from "multer";
import { SettingsController } from "../controllers/SettingsController.js";
import { requireAuth } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "avatar" && !file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

router.post(
  "/update",
  requireAuth,
  upload.single('avatar'),
  SettingsController.updateProfile,
);
router.delete('/avatar', requireAuth, SettingsController.deleteAvatar)

router.get("/profile", requireAuth, SettingsController.getProfile);

export default router;
