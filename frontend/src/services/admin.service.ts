import api from "@/lib/axios";
import type { ApiResponse } from "@/types";

interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  reopened: number;
  resolutionRate: number;
  categoryStats: { category: string; count: number }[];
  recentComplaints: unknown[];
}

interface UserListResponse {
  users: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    _count: { complaints: number };
  }[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const adminService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const res = await api.get("/admin/stats");
    return res.data;
  },

  async getUsers(
    page: number = 1,
    limit: number = 10,
    role?: string,
    search?: string
  ): Promise<ApiResponse<UserListResponse>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) params.append("role", role);
    if (search) params.append("search", search);
    const res = await api.get(`/admin/users?${params}`);
    return res.data;
  },

  async toggleUserStatus(userId: string): Promise<ApiResponse<unknown>> {
    const res = await api.put(`/admin/users/${userId}/toggle-status`);
    return res.data;
  },

  async changeUserRole(
    userId: string,
    role: string
  ): Promise<ApiResponse<unknown>> {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },

  async getDepartments(): Promise<ApiResponse<unknown[]>> {
    const res = await api.get("/admin/departments");
    return res.data;
  },
};
