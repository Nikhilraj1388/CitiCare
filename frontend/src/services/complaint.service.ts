import api from "@/lib/axios";
import type { ApiResponse, Complaint, ComplaintCategory } from "@/types";

interface ComplaintListResponse {
  complaints: Complaint[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const complaintService = {
  async getCategories(): Promise<ApiResponse<ComplaintCategory[]>> {
    const res = await api.get("/complaints/categories");
    return res.data;
  },

  async create(data: {
    categoryId: string;
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    imageUrls?: string[];
  }): Promise<ApiResponse<Complaint>> {
    const res = await api.post("/complaints", data);
    return res.data;
  },

  async getMyComplaints(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ApiResponse<ComplaintListResponse>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append("status", status);
    const res = await api.get(`/complaints/my?${params}`);
    return res.data;
  },

  async getById(id: string): Promise<ApiResponse<Complaint>> {
    const res = await api.get(`/complaints/${id}`);
    return res.data;
  },

  async submitFeedback(
    complaintId: string,
    rating: number,
    comment?: string
  ): Promise<ApiResponse<unknown>> {
    const res = await api.post(`/complaints/${complaintId}/feedback`, {
      rating,
      comment,
    });
    return res.data;
  },
};
