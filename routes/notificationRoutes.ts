import express from "express";
import { getNotifications, setAutomatedAlerts } from "../controllers/notificationController";
import { authenticate } from "../middlewares/authMiddleware";
import { roleBasedAccess } from "../middlewares/authorization";

const router = express.Router();

router.get("/notifications«", authenticate, roleBasedAccess("admin"), getNotifications);

router.post("/alerts", authenticate, roleBasedAccess("admin"), setAutomatedAlerts);

export default router;
