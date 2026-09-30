export const queryKeys = {
  complaints: {
    all: ["complaints"] as const,
    categories: () => ["complaints", "categories"] as const,
    map: () => ["complaints", "map"] as const,
    my: (filters?: { page?: number; limit?: number; status?: string }) =>
      ["complaints", "my", filters] as const,
    list: (filters?: { page?: number; limit?: number; status?: string }) =>
      ["complaints", "list", filters] as const,
    detail: (id: string) => ["complaints", "detail", id] as const,
  },
  admin: {
    all: ["admin"] as const,
    stats: () => ["admin", "stats"] as const,
    users: (filters?: {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    }) => ["admin", "users", filters] as const,
    departments: () => ["admin", "departments"] as const,
    userDepartments: (userId: string) =>
      ["admin", "userDepartments", userId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params?: { page?: number; limit?: number }) =>
      ["notifications", "list", params] as const,
  },
  auth: {
    all: ["auth"] as const,
    profile: () => ["auth", "profile"] as const,
  },
};
