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
  (req: Request, res: Response, next: NextFunction) => {
    upload.array("images", 3)(req, res, (err) => {
      if (err) {
        console.error("[Multer Error]:", err);
        return sendError(res, err.message || "Invalid file upload", 400);
      }
      next();
    });
  },
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return sendError(res, "No files uploaded", 400);
      }

      let urls: string[] = [];

      if (CloudinaryService.isConfigured()) {
        try {
          // Upload to Cloudinary and clean up local files
          urls = await Promise.all(
            files.map(async (f) => {
              const url = await CloudinaryService.uploadImage(f.path);
              fs.unlink(f.path, () => {});
              return url;
            })
          );
        } catch (cloudinaryError) {
          console.error("[Cloudinary Error, falling back to local storage]:", cloudinaryError);
          // Fallback to local files if Cloudinary fails
          urls = files.map(
            (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
          );
        }
      } else {
        // Fallback to local URLs
        urls = files.map(
          (f) => `${req.protocol}://${req.get("host")}/uploads/${f.filename}`
        );
      }

      return sendSuccess(res, "Images uploaded successfully", { urls }, 201);
    } catch (error) {
      console.error("[Upload Route Error]:", error);
      return sendError(
        res,
        error instanceof Error ? error.message : "Upload failed",
        500
      );
    }
  }
);

export default router;
