import express, { Request, Response, NextFunction } from "express";
import {
  uploadFile,
  getPresignedUrl,
  uploadMiddleware,
} from "../controllers/uploaderController";

const router = express.Router();

router.post(
  "/upload",
  uploadMiddleware,
  (req: Request, res: Response) => {
    uploadFile(req, res);
  }
);

router.get("/static/:id", (req: Request, res: Response) => {
  getPresignedUrl(req, res);
});

export default router;
