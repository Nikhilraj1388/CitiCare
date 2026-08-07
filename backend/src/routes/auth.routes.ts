import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator";

const router = Router();

// Public routes
router.post("/register", registerValidator, validate, AuthController.register);
router.post("/login", loginValidator, validate, AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// Protected routes
router.get("/profile", authenticate, AuthController.getProfile);
router.put("/profile", authenticate, AuthController.updateProfile);
router.put("/change-password", authenticate, AuthController.changePassword);

// One-time admin promotion (use via browser/curl then remove)
router.post("/promote-admin", async (req, res) => {
  const { email, secret } = req.body;
  if (secret !== "citicare-admin-setup-2026") {
    return res.status(403).json({ success: false, message: "Invalid secret" });
  }
  const { PrismaClient } = await import("../generated/prisma/client.js");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
  return res.json({ success: true, message: `${user.fullName} is now ADMIN` });
});

export default router;
