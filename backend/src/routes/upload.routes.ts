import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { CloudinaryService } from "../services/cloudinary.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.array("images", 3),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        sendError(res, "No files uploaded", 400);
        return;
      }

      let urls: string[];

      if (CloudinaryService.isConfigured()) {
        // Upload to Cloudinary and clean up local files
        urls = await Promise.all(
          files.map(async (f) => {
            const url = await CloudinaryService.uploadImage(f.path);
            // Remove local file after upload
            fs.unlink(f.path, () => {});
            return url;
          })
        );
      } else {
        // Fallback to local URLs
        urls = files.map(
          (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
        );
      }

      sendSuccess(res, "Images uploaded successfully", { urls }, 201);
    } catch {
      sendError(res, "Upload failed", 500);
    }
  }
);

export default router;
