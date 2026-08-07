import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phone, password } = req.body;
      const result = await AuthService.register({ fullName, email, phone, password });
      sendSuccess(res, "Registration successful", result, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      sendSuccess(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getProfile(req.user!.id);
      sendSuccess(res, "Profile retrieved", user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, phone, avatar } = req.body;
      const user = await AuthService.updateProfile(req.user!.id, {
        fullName,
        phone,
        avatar,
      });
      sendSuccess(res, "Profile updated", user);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(
        req.user!.id,
        currentPassword,
        newPassword
      );
      sendSuccess(res, result.message);
    } catch (error) {
      next(error);
    }
  }
}
