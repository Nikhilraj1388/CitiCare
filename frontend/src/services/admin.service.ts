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

  async assignDepartment(userId: string, departmentId: string): Promise<ApiResponse<unknown>> {
    const res = await api.post(`/admin/departments/assign`, { userId, departmentId });
    return res.data;
  },

  async removeDepartment(userId: string, departmentId: string): Promise<ApiResponse<unknown>> {
    const res = await api.delete(`/admin/departments/assign`, { data: { userId, departmentId } });
    return res.data;
  },

  async getUserDepartments(userId: string): Promise<ApiResponse<unknown>> {
    const res = await api.get(`/admin/users/${userId}/departments`);
    return res.data;
  },

  async createUser(data: {
    fullName: string; email: string; phone: string;
    password: string; role: string; departmentId?: string;
  }): Promise<ApiResponse<unknown>> {
    const res = await api.post('/admin/users', data);
    return res.data;
  },
};
