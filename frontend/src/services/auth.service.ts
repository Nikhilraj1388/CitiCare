import api from "@/lib/axios";
import type { ApiResponse, User } from "@/types";

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const res = await api.get("/auth/profile");
    return res.data;
  },

  async updateProfile(data: {
    fullName?: string;
    phone?: string;
  }): Promise<ApiResponse<User>> {
    const res = await api.put("/auth/profile", data);
    return res.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    const res = await api.put("/auth/change-password", data);
    return res.data;
  },
};
