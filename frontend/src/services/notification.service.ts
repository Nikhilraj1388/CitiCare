import api from "@/lib/axios";
import type { ApiResponse, NotificationListResponse } from "@/types";

export const notificationService = {
  async getAll(page: number = 1, limit: number = 20): Promise<ApiResponse<NotificationListResponse>> {
    const res = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return res.data;
  },

  async markAsRead(id: string): Promise<ApiResponse<unknown>> {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },

  async markAllAsRead(): Promise<ApiResponse<unknown>> {
    const res = await api.put("/notifications/read-all");
    return res.data;
  },
};
