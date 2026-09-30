"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useProfileQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/hooks/use-user-query";
import { queryKeys } from "@/lib/query-keys";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    const savedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const timer = setTimeout(() => {
      setToken(savedToken);
      setTokenLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError,
  } = useProfileQuery({
    enabled: tokenLoaded && !!token,
  });

  useEffect(() => {
    if (isError && token) {
      localStorage.removeItem("token");
      queryClient.setQueryData(queryKeys.auth.profile(), null);
      const timer = setTimeout(() => setToken(null), 0);
      return () => clearTimeout(timer);
    }
  }, [isError, token, queryClient]);

  const user = token ? (profileData ?? null) : null;
  const isLoading = !tokenLoaded || (!!token && isProfileLoading);

  const login = async (email: string, password: string) => {
    const res = await loginMutation.mutateAsync({ email, password });
    const { token: newToken } = res.data as {
      user: User;
      token: string;
    };
    setToken(newToken);
    router.push("/dashboard");
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const res = await registerMutation.mutateAsync(data);
    const { token: newToken } = res.data as {
      user: User;
      token: string;
    };
    setToken(newToken);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.clear();
    queryClient.setQueryData(queryKeys.auth.profile(), null);
    router.push("/login");
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

