import { Router, Request, Response, NextFunction } from "express";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { sendSuccess, sendError } from "../utils/apiResponse";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.array("images", 3),
  (req: Request, res: Response, _next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        sendError(res, "No files uploaded", 400);
        return;
      }

      const urls = files.map(
        (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
      );

      sendSuccess(res, "Images uploaded successfully", { urls }, 201);
    } catch {
      sendError(res, "Upload failed", 500);
    }
  }
);

export default router;
