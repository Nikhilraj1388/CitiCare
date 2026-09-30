"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import type { DashboardStats, DepartmentWithCount } from "@/types";

export function useAdminStatsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: async () => {
      const res = await adminService.getStats();
      return res.data as DashboardStats;
    },
    staleTime: 45 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useAdminUsersQuery(
  filters: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  } = {},
  options?: { enabled?: boolean }
) {
  const { page = 1, limit = 10, role, search } = filters;
  return useQuery({
    queryKey: queryKeys.admin.users({ page, limit, role, search }),
    queryFn: async () => {
      const res = await adminService.getUsers(
        page,
        limit,
        role === "ALL" ? undefined : role,
        search || undefined
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    enabled: options?.enabled ?? true,
  });
}

export function useDepartmentsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.admin.departments(),
    queryFn: async () => {
      const res = await adminService.getDepartments();
      return (res.data || []) as DepartmentWithCount[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

export function useUserDepartmentsQuery(userId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.admin.userDepartments(userId),
    queryFn: async () => {
      const res = await adminService.getUserDepartments(userId);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!userId && (options?.enabled ?? true),
  });
}

export function useToggleUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.toggleUserStatus(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
  });
}

export function useChangeUserRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminService.changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
    },
  });
}

export function useAssignDepartmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      departmentId,
      currentDepartmentId,
    }: {
      userId: string;
      departmentId: string;
      currentDepartmentId?: string;
    }) => {
      if (currentDepartmentId) {
        await adminService.removeDepartment(userId, currentDepartmentId);
      }
      return adminService.assignDepartment(userId, departmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
      role: string;
      departmentId?: string;
    }) => adminService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats() });
    },
  });
}
