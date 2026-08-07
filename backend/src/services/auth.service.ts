import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config";
import prisma from "../config/database";
import { ApiError } from "../middleware/errorHandler";
import { EmailService } from "./email.service";

export class AuthService {
  static generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as unknown as number,
    });
  }

  static async register(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ApiError(409, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "CITIZEN",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.role);

    // Send welcome email (non-blocking)
    EmailService.sendWelcome(user.email, user.fullName).catch(() => {});

    return { user, token };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new ApiError(401, "Invalid email or password");
    if (!user.isActive) throw new ApiError(403, "Account is deactivated");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    const token = this.generateToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, fullName: true, email: true, phone: true,
        role: true, avatar: true, isActive: true, createdAt: true, updatedAt: true,
      },
    });
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  static async updateProfile(
    userId: string,
    data: { fullName?: string; phone?: string; avatar?: string }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, fullName: true, email: true, phone: true,
        role: true, avatar: true, updatedAt: true,
      },
    });
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new ApiError(400, "Current password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    return { message: "Password changed successfully" };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: "If the email exists, a reset link has been sent" };

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: `reset:${resetTokenHash}:${Date.now() + 3600000}` },
    });

    await EmailService.sendPasswordReset(user.email, user.fullName, resetToken);
    return { message: "If the email exists, a reset link has been sent" };
  }

  static async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const users = await prisma.user.findMany({
      where: { avatar: { startsWith: `reset:${tokenHash}:` } },
    });

    if (users.length === 0) throw new ApiError(400, "Invalid or expired reset token");

    const user = users[0];
    const parts = user.avatar?.split(":") || [];
    const expiry = parseInt(parts[2], 10);
    if (Date.now() > expiry) throw new ApiError(400, "Reset token has expired");

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, avatar: null },
    });

    return { message: "Password reset successfully" };
  }
}
