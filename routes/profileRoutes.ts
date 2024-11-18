import { Router } from "express";
import { createOrUpdateProfile, getProfile, deleteProfile, uploadProfilePhoto, uploadBannerPhoto } from "../controllers/profileController";
import { authenticate } from "../middlewares/authMiddleware";

const router: Router = Router();

router.use(authenticate);

router.put("/:userId/profile", createOrUpdateProfile);

router.get("/:userId", getProfile);

router.delete("/:userId/profile", deleteProfile);

router.post("/:userId/profile-photo", uploadProfilePhoto);

router.post("/:userId/banner-photo", uploadBannerPhoto);

export default router;
