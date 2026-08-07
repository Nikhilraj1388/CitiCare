import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";
import { sendSuccess } from "../utils/apiResponse";

export class AdminController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getUsers({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        role: req.query.role as string,
        search: req.query.search as string,
      });
      sendSuccess(res, "Users retrieved", result);
    } catch (error) { next(error); }
  }

  static async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.toggleUserStatus(req.params.id as string);
      sendSuccess(res, `User ${user.isActive ? "activated" : "deactivated"}`, user);
    } catch (error) { next(error); }
  }

  static async changeUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.changeUserRole(req.params.id as string, req.body.role);
      sendSuccess(res, "Role updated", user);
    } catch (error) { next(error); }
  }

  static async getDepartments(_req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await AdminService.getDepartments();
      sendSuccess(res, "Departments retrieved", departments);
    } catch (error) { next(error); }
  }

  static async assignUserToDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.assignUserToDepartment(req.body.userId, req.body.departmentId);
      sendSuccess(res, "User assigned to department", result);
    } catch (error) { next(error); }
  }

  static async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats();
      sendSuccess(res, "Dashboard stats", stats);
    } catch (error) { next(error); }
  }
}
