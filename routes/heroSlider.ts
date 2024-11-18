import express from "express";
import multer from "multer";
import { addSliderImage, updateSliderSettings } from "../controllers/heroSliderController";
import { authenticate } from "../middlewares/authMiddleware";
import { roleBasedAccess } from "../middlewares/authorization";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authenticate, roleBasedAccess("admin"), upload.single("image"), addSliderImage);

router.put("/settings", authenticate, roleBasedAccess("admin"), updateSliderSettings);

export default router;
