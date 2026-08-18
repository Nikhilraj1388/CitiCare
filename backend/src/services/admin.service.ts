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

  /** Dashboard stats - scoped by department for officials */
  static async getDashboardStats(userId?: string, userRole?: string) {
    // For officials, get their department IDs
    let departmentFilter: Record<string, unknown> = {};
    let departmentName = "";
    if (userRole === "OFFICIAL" && userId) {
      const deptUsers = await prisma.departmentUser.findMany({
        where: { userId },
        include: { department: true },
      });
      const deptIds = deptUsers.map((du) => du.departmentId);
      if (deptIds.length > 0) {
        departmentFilter = { departmentId: { in: deptIds } };
        departmentName = deptUsers[0]?.department?.name || "";
      }
    }

    const complaintWhere = departmentFilter;

    const [totalUsers, totalComplaints, statusCounts, categoryStats, recentComplaints] =
      await Promise.all([
        userRole === "OFFICIAL" ? 0 : prisma.user.count(),
        prisma.complaint.count({ where: complaintWhere }),
        prisma.complaint.groupBy({
          by: ["status"],
          where: complaintWhere,
          _count: { status: true },
        }),
        prisma.complaint.groupBy({
          by: ["categoryId"],
          where: complaintWhere,
          _count: { categoryId: true },
        }),
        prisma.complaint.findMany({
          where: complaintWhere,
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
      departmentName: departmentName || undefined,
    };
  }

  /** Admin creates a user with any role */
  static async createUser(data: {
    fullName: string; email: string; phone: string;
    password: string; role: string; departmentId?: string;
  }) {
    const bcrypt = await import("bcryptjs");
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ApiError(409, "Email already registered");

    const hashedPassword = await bcrypt.default.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role as "CITIZEN" | "OFFICIAL" | "ADMIN",
      },
      select: { id: true, fullName: true, email: true, role: true },
    });

    if (data.role === "OFFICIAL" && data.departmentId) {
      await prisma.departmentUser.create({
        data: { userId: user.id, departmentId: data.departmentId },
      });
    }

    return user;
  }

  /** Remove user from department */
  static async removeUserFromDepartment(userId: string, departmentId: string) {
    const record = await prisma.departmentUser.findUnique({
      where: { userId_departmentId: { userId, departmentId } },
    });
    if (!record) throw new ApiError(404, "User is not assigned to this department");

    await prisma.departmentUser.delete({
      where: { userId_departmentId: { userId, departmentId } },
    });
    return { userId, departmentId };
  }

  /** Get departments a user is assigned to */
  static async getUserDepartments(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ApiError(404, "User not found");

    const departmentUsers = await prisma.departmentUser.findMany({
      where: { userId },
      include: {
        department: true,
      },
    });
    return departmentUsers.map((du) => du.department);
  }
}
