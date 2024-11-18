import express from "express";
import { getAllPosts, approvePost, deletePost } from "../controllers/adminController";
import { authenticate } from "../middlewares/authMiddleware";
import { roleBasedAccess } from "../middlewares/authorization";

const router = express.Router();

router.get("/posts", authenticate, roleBasedAccess("admin"), getAllPosts);

router.put("/posts/:post_id/approve", authenticate, roleBasedAccess("admin"), approvePost);

router.delete("/posts/:post_id", authenticate, roleBasedAccess("admin"), deletePost);

export default router;
