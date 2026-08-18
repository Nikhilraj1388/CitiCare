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

  static async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboardStats(req.user!.id, req.user!.role);
      sendSuccess(res, "Dashboard stats", stats);
    } catch (error) { next(error); }
  }

  static async removeUserFromDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.removeUserFromDepartment(req.body.userId, req.body.departmentId);
      sendSuccess(res, "User removed from department", result);
    } catch (error) { next(error); }
  }

  static async getUserDepartments(req: Request, res: Response, next: NextFunction) {
    try {
      const departments = await AdminService.getUserDepartments(req.params.id as string);
      sendSuccess(res, "User departments retrieved", departments);
    } catch (error) { next(error); }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.createUser(req.body);
      sendSuccess(res, "User created", user);
    } catch (error) { next(error); }
  }
}
