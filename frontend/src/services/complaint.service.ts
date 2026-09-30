import api from "@/lib/axios";
import type {
  ApiResponse,
  Complaint,
  ComplaintCategory,
  ComplaintListResponse,
  MapComplaint,
} from "@/types";

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

  async getAll(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<ApiResponse<ComplaintListResponse>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append("status", status);
    const res = await api.get(`/complaints?${params}`);
    return res.data;
  },

  async getMap(): Promise<ApiResponse<MapComplaint[]>> {
    const res = await api.get("/complaints/map");
    return res.data;
  },

  async updateStatus(
    id: string,
    status: string,
    remarks?: string
  ): Promise<ApiResponse<unknown>> {
    const res = await api.put(`/complaints/${id}/status`, { status, remarks });
    return res.data;
  },

  async uploadImages(formData: FormData): Promise<ApiResponse<{ urls: string[] }>> {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

