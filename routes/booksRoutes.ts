import express from "express";
import {
  getAllBooks,
  postBook,
  getBookById,
  deleteBookById,
  updateBookById,
} from "../controllers/booksController";
import multer from "multer";
import path from "path";
import { authenticate } from "../middlewares/authMiddleware";
import { roleBasedAccess } from "../middlewares/authorization";

const router = express.Router();

const upload = multer({
  dest: path.join(__dirname, "../uploads"),
});

router.use(authenticate);

router.get("/", roleBasedAccess("admin"), getAllBooks);
router.post("/", upload.single("image"), roleBasedAccess("admin"), postBook);
router.get("/:id", roleBasedAccess("admin"), getBookById);
router.delete("/:id", roleBasedAccess("admin"), deleteBookById);
router.put("/:id", roleBasedAccess("admin"), updateBookById);

export default router;
