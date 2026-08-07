import prisma from "../config/database";
import { generateCRN } from "../utils/generateCRN";
import { ApiError } from "../middleware/errorHandler";
import { EmailService } from "./email.service";
import { NotificationService } from "./notification.service";

export class ComplaintService {
  /**
   * Create a new complaint with auto-department routing
   */
  static async create(data: {
    citizenId: string;
    categoryId: string;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    imageUrls?: string[];
  }) {
    // Verify category exists
    const category = await prisma.complaintCategory.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Auto-route: find department for this category
    const mapping = await prisma.categoryDepartmentMapping.findFirst({
      where: { categoryId: data.categoryId },
    });

    const complaintNumber = await generateCRN();

    // Calculate priority score based on category severity
    const priorityScore = category.severity;

    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber,
        citizenId: data.citizenId,
        categoryId: data.categoryId,
        departmentId: mapping?.departmentId || null,
        title: data.title,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        priorityScore,
        status: "SUBMITTED",
        // Create images if provided
        images: data.imageUrls?.length
          ? {
              create: data.imageUrls.map((url) => ({ imageUrl: url })),
            }
          : undefined,
        // Create initial status history
        statusHistory: {
          create: {
            previousStatus: "SUBMITTED",
            currentStatus: "SUBMITTED",
            remarks: "Complaint submitted by citizen",
            updatedById: data.citizenId,
          },
        },
      },
      include: {
        category: true,
        department: true,
        images: true,
        statusHistory: { orderBy: { updatedAt: "desc" } },
      },
    });

    // Send email + in-app notification (non-blocking)
    const citizen = await prisma.user.findUnique({ where: { id: data.citizenId }, select: { email: true, fullName: true } });
    if (citizen) {
      EmailService.sendComplaintCreated(
        citizen.email, citizen.fullName, complaintNumber, data.title,
        complaint.department?.name || "Pending Assignment"
      ).catch(() => {});
      NotificationService.notifyComplaintCreated(data.citizenId, complaintNumber).catch(() => {});
    }

    return complaint;
  }

  /**
   * Get complaints by citizen ID with pagination
   */
  static async getByCitizen(
    citizenId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ) {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { citizenId };
    if (status) {
      where.status = status;
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          category: true,
          department: true,
          images: true,
          _count: { select: { statusHistory: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      complaints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single complaint by ID
   */
  static async getById(complaintId: string, userId?: string) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        citizen: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        category: true,
        department: true,
        images: true,
        statusHistory: {
          include: {
            updatedBy: { select: { id: true, fullName: true, role: true } },
          },
          orderBy: { updatedAt: "asc" },
        },
        feedback: true,
      },
    });

    if (!complaint) {
      throw new ApiError(404, "Complaint not found");
    }

    return complaint;
  }

  /**
   * Get all complaints (for officials/admin) with filters
   */
  static async getAll(filters: {
    page?: number;
    limit?: number;
    status?: string;
    categoryId?: string;
    departmentId?: string;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.departmentId) where.departmentId = filters.departmentId;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { complaintNumber: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          citizen: { select: { id: true, fullName: true, email: true } },
          category: true,
          department: true,
          images: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      complaints,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Update complaint status (for officials)
   */
  static async updateStatus(
    complaintId: string,
    updatedById: string,
    status: "UNDER_REVIEW" | "IN_PROGRESS" | "RESOLVED" | "REOPENED",
    remarks?: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) {
      throw new ApiError(404, "Complaint not found");
    }

    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status,
        statusHistory: {
          create: {
            previousStatus: complaint.status,
            currentStatus: status,
            remarks,
            updatedById,
          },
        },
      },
      include: {
        category: true,
        department: true,
        statusHistory: { orderBy: { updatedAt: "desc" }, take: 1 },
      },
    });

    // Send email + in-app notification to citizen (non-blocking)
    const citizen = await prisma.user.findUnique({
      where: { id: complaint.citizenId },
      select: { email: true, fullName: true },
    });
    if (citizen) {
      if (status === "RESOLVED") {
        EmailService.sendComplaintResolved(citizen.email, citizen.fullName, complaint.complaintNumber, complaint.title).catch(() => {});
        NotificationService.notifyResolved(complaint.citizenId, complaint.complaintNumber).catch(() => {});
      } else {
        EmailService.sendStatusUpdate(
          citizen.email, citizen.fullName, complaint.complaintNumber, complaint.title,
          complaint.status, status, remarks
        ).catch(() => {});
        NotificationService.notifyStatusUpdate(complaint.citizenId, complaint.complaintNumber, status).catch(() => {});
      }
    }

    return updated;
  }

  /**
   * Submit feedback for a resolved complaint
   */
  static async submitFeedback(
    complaintId: string,
    citizenId: string,
    rating: number,
    comment?: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
    });

    if (!complaint) throw new ApiError(404, "Complaint not found");
    if (complaint.citizenId !== citizenId)
      throw new ApiError(403, "Not your complaint");
    if (complaint.status !== "RESOLVED")
      throw new ApiError(400, "Complaint must be resolved to give feedback");

    const feedback = await prisma.complaintFeedback.upsert({
      where: { complaintId },
      update: { rating, comment },
      create: { complaintId, citizenId, rating, comment },
    });

    return feedback;
  }

  /**
   * Get complaints by department (for officials)
   */
  static async getByDepartment(
    departmentId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ) {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { departmentId };
    if (status) where.status = status;

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          citizen: { select: { id: true, fullName: true, email: true, phone: true } },
          category: true,
          department: true,
          images: true,
        },
        orderBy: [{ priorityScore: "desc" }, { createdAt: "asc" }],
        skip,
        take: limit,
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      complaints,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get categories list
   */
  static async getCategories() {
    return prisma.complaintCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get complaints with location data for public map
   */
  static async getMapData() {
    return prisma.complaint.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        complaintNumber: true,
        title: true,
        status: true,
        latitude: true,
        longitude: true,
        address: true,
        createdAt: true,
        category: { select: { name: true, icon: true } },
        department: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  }
}
