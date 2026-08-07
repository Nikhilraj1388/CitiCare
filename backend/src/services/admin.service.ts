import prisma from "../config/database";
import { ApiError } from "../middleware/errorHandler";

export class AdminService {
  /** List all users with pagination and filters */
  static async getUsers(filters: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, fullName: true, email: true, phone: true,
          role: true, isActive: true, createdAt: true,
          _count: { select: { complaints: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  /** Toggle user active status */
  static async toggleUserStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: { id: true, fullName: true, email: true, isActive: true },
    });
    return updated;
  }

  /** Change user role */
  static async changeUserRole(userId: string, role: "CITIZEN" | "OFFICIAL" | "ADMIN") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, fullName: true, email: true, role: true },
    });
  }

  /** Get all departments with user counts */
  static async getDepartments() {
    return prisma.department.findMany({
      include: {
        _count: { select: { departmentUsers: true, complaints: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  /** Assign user to department */
  static async assignUserToDepartment(userId: string, departmentId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");
    if (user.role !== "OFFICIAL") throw new ApiError(400, "User must be an official");

    return prisma.departmentUser.upsert({
      where: { userId_departmentId: { userId, departmentId } },
      update: {},
      create: { userId, departmentId },
    });
  }

  /** Dashboard stats */
  static async getDashboardStats() {
    const [totalUsers, totalComplaints, statusCounts, categoryStats, recentComplaints] =
      await Promise.all([
        prisma.user.count(),
        prisma.complaint.count(),
        prisma.complaint.groupBy({
          by: ["status"],
          _count: { status: true },
        }),
        prisma.complaint.groupBy({
          by: ["categoryId"],
          _count: { categoryId: true },
        }),
        prisma.complaint.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            citizen: { select: { fullName: true } },
            category: { select: { name: true } },
            department: { select: { name: true } },
          },
        }),
      ]);

    // Fetch category names for stats
    const categories = await prisma.complaintCategory.findMany();
    const categoryStatsWithNames = categoryStats.map((s) => ({
      category: categories.find((c) => c.id === s.categoryId)?.name || "Unknown",
      count: s._count.categoryId,
    }));

    const statusMap = Object.fromEntries(
      statusCounts.map((s) => [s.status, s._count.status])
    );

    return {
      totalUsers,
      totalComplaints,
      submitted: statusMap["SUBMITTED"] || 0,
      underReview: statusMap["UNDER_REVIEW"] || 0,
      inProgress: statusMap["IN_PROGRESS"] || 0,
      resolved: statusMap["RESOLVED"] || 0,
      reopened: statusMap["REOPENED"] || 0,
      resolutionRate: totalComplaints > 0
        ? Math.round(((statusMap["RESOLVED"] || 0) / totalComplaints) * 100)
        : 0,
      categoryStats: categoryStatsWithNames,
      recentComplaints,
    };
  }
}
