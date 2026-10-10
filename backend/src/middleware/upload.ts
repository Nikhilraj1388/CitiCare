import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

// Resolve upload directory dynamically
const getUploadDir = (): string => {
  const dir = path.resolve(
    fs.existsSync(path.join(process.cwd(), "src"))
      ? path.join(process.cwd(), "uploads")
      : path.join(__dirname, "../../uploads")
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

// Initial check on load
getUploadDir();

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    try {
      const dir = getUploadDir();
      cb(null, dir);
    } catch (err) {
      cb(err as Error, "");
    }
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `complaint-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg", "image/pjpeg"];
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype.toLowerCase()) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 3 }, // 5MB per file, max 3
});

