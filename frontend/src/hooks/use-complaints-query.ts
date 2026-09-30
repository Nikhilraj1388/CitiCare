"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { complaintService } from "@/services/complaint.service";
import { queryKeys } from "@/lib/query-keys";
import type { ComplaintCategory, MapComplaint } from "@/types";

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.complaints.categories(),
    queryFn: async () => {
      const res = await complaintService.getCategories();
      return (res.data || []) as ComplaintCategory[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMapComplaintsQuery() {
  return useQuery({
    queryKey: queryKeys.complaints.map(),
    queryFn: async () => {
      const res = await complaintService.getMap();
      return (res.data || []) as MapComplaint[];
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useMyComplaintsQuery(
  filters: { page?: number; limit?: number; status?: string } = {},
  options?: { enabled?: boolean }
) {
  const { page = 1, limit = 10, status } = filters;
  return useQuery({
    queryKey: queryKeys.complaints.my({ page, limit, status }),
    queryFn: async () => {
      const res = await complaintService.getMyComplaints(page, limit, status);
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useAllComplaintsQuery(
  filters: { page?: number; limit?: number; status?: string } = {},
  options?: { enabled?: boolean }
) {
  const { page = 1, limit = 10, status } = filters;
  return useQuery({
    queryKey: queryKeys.complaints.list({ page, limit, status }),
    queryFn: async () => {
      const res = await complaintService.getAll(page, limit, status);
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useComplaintDetailQuery(
  id: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.complaints.detail(id),
    queryFn: async () => {
      const res = await complaintService.getById(id);
      return res.data;
    },
    staleTime: 30 * 1000,
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useCreateComplaintMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: complaintService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
}

export function useUpdateComplaintStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      remarks,
    }: {
      id: string;
      status: string;
      remarks?: string;
    }) => {
      return complaintService.updateStatus(id, status, remarks);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
}

export function useSubmitFeedbackMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      complaintId,
      rating,
      comment,
    }: {
      complaintId: string;
      rating: number;
      comment?: string;
    }) => {
      return complaintService.submitFeedback(complaintId, rating, comment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.complaints.detail(variables.complaintId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.complaints.all });
    },
  });
}

export function useUploadImagesMutation() {
  return useMutation({
    mutationFn: (formData: FormData) => complaintService.uploadImages(formData),
  });
}
