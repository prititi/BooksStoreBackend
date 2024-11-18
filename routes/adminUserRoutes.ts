import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} from "../controllers/adminUserController";
import { authenticate } from "../middlewares/authMiddleware";
import { roleBasedAccess } from "../middlewares/authorization";

const router = express.Router();

router.get("/", authenticate, roleBasedAccess("admin"), getAllUsers);

router.get("/:user_id", authenticate, roleBasedAccess("admin"), getUserById);

router.put("/:user_id/role", authenticate, roleBasedAccess("admin"), updateUserRole);

router.delete("/:user_id", authenticate, roleBasedAccess("admin"), deleteUser);

export default router;
