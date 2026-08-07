import { Request, Response, NextFunction } from "express";
import { ComplaintService } from "../services/complaint.service";
import { sendSuccess } from "../utils/apiResponse";

export class ComplaintController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, title, description, latitude, longitude, address, imageUrls } = req.body;
      const complaint = await ComplaintService.create({
        citizenId: req.user!.id,
        categoryId,
        title,
        description,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        address,
        imageUrls,
      });
      sendSuccess(res, "Complaint submitted successfully", complaint, 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMyComplaints(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const result = await ComplaintService.getByCitizen(req.user!.id, page, limit, status);
      sendSuccess(res, "Complaints retrieved", result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const complaint = await ComplaintService.getById(req.params.id as string, req.user!.id);
      sendSuccess(res, "Complaint retrieved", complaint);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ComplaintService.getAll({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        status: req.query.status as string,
        categoryId: req.query.categoryId as string,
        departmentId: req.query.departmentId as string,
        search: req.query.search as string,
      });
      sendSuccess(res, "Complaints retrieved", result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, remarks } = req.body;
      const complaint = await ComplaintService.updateStatus(
        req.params.id as string,
        req.user!.id,
        status,
        remarks
      );
      sendSuccess(res, "Status updated", complaint);
    } catch (error) {
      next(error);
    }
  }

  static async submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, comment } = req.body;
      const feedback = await ComplaintService.submitFeedback(
        req.params.id as string,
        req.user!.id,
        rating,
        comment
      );
      sendSuccess(res, "Feedback submitted", feedback);
    } catch (error) {
      next(error);
    }
  }

  static async getByDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const result = await ComplaintService.getByDepartment(
        req.params.departmentId as string,
        page,
        limit,
        status
      );
      sendSuccess(res, "Department complaints retrieved", result);
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ComplaintService.getCategories();
      sendSuccess(res, "Categories retrieved", categories);
    } catch (error) {
      next(error);
    }
  }

  static async getMapData(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ComplaintService.getMapData();
      sendSuccess(res, "Map data retrieved", data);
    } catch (error) {
      next(error);
    }
  }
}
