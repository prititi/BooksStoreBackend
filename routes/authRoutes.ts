import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.use(authenticate);

router.post("/verifyEmail", verifyEmail);

router.post("/refresh-token", refreshAccessToken);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
