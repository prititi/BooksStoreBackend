import { Router } from "express";
import {
  addItemToCart,
  removeItemFromCart,
  getCart,
} from "../controllers/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router: Router = Router();

router.use(authenticate);

router.post("/add", addItemToCart);

router.delete("/remove/:itemId", removeItemFromCart);

router.get("/:userId", getCart);

export default router;
