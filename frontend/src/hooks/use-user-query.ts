"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-keys";
import type { User } from "@/types";

export function useProfileQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: async () => {
      const res = await authService.getProfile();
      return (res.data || null) as User | null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { fullName?: string; phone?: string }) =>
      authService.updateProfile(data),
    onSuccess: (res) => {
      if (res.data) {
        queryClient.setQueryData(queryKeys.auth.profile(), res.data);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(data),
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authService.login(data),
    onSuccess: (res) => {
      const authData = res.data as { user: User; token: string };
      localStorage.setItem("token", authData.token);
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth.profile(), authData.user);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      phone: string;
      password: string;
    }) => authService.register(data),
    onSuccess: (res) => {
      const authData = res.data as { user: User; token: string };
      localStorage.setItem("token", authData.token);
      queryClient.clear();
      queryClient.setQueryData(queryKeys.auth.profile(), authData.user);
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      authService.resetPassword(data),
  });
}
