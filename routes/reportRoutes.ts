import express from "express";
import {
  generateSalesReport,
  getUserActivityReport,
  getContentPerformanceReport
} from "../controllers/reportController";
import { authenticate } from "../middlewares/authMiddleware";
import { roleBasedAccess } from "../middlewares/authorization";

const router = express.Router();

router.get("/sales", authenticate, roleBasedAccess("admin"), generateSalesReport);

router.get("/user-activity", authenticate, roleBasedAccess("admin"), getUserActivityReport);

router.get("/content-performance", authenticate, roleBasedAccess("admin"), getContentPerformanceReport);

export default router;
