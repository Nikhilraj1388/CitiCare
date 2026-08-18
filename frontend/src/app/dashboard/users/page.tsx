"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { adminService } from "@/services/admin.service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageLoader } from "@/components/page-loader";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Users, ShieldCheck, ShieldOff } from "lucide-react";

interface UserRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: { complaints: number };
  departmentUsers?: { department: { id: string; name: string } }[];
}

interface Department {
  id: string;
  name: string;
}

export default function AdminUsersPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userDepartments, setUserDepartments] = useState<Record<string, string>>({});
  const [assigningDept, setAssigningDept] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Load departments once on mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await adminService.getDepartments();
        setDepartments(res.data as Department[]);
      } catch {
        // Departments will just be empty if this fails
      }
    };
    if (isAuthenticated && user?.role === "ADMIN") {
      loadDepartments();
    }
  }, [isAuthenticated, user]);

  // Fetch departments for all OFFICIAL users
  const fetchUserDepartments = useCallback(async (usersList: UserRow[]) => {
    const officials = usersList.filter((u) => u.role === "OFFICIAL");
    const deptMap: Record<string, string> = {};
    await Promise.allSettled(
      officials.map(async (u) => {
        try {
          const res = await adminService.getUserDepartments(u.id);
          const data = res.data as { department: { id: string; name: string } }[];
          if (Array.isArray(data) && data.length > 0) {
            deptMap[u.id] = data[0].department.id;
          }
        } catch {
          // ignore individual failures
        }
      })
    );
    setUserDepartments(deptMap);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers(
        page, 10,
        roleFilter === "ALL" ? undefined : roleFilter,
        search || undefined
      );
      const data = res.data as { users: UserRow[]; pagination: { totalPages: number } };
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
      fetchUserDepartments(data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search, fetchUserDepartments]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") fetchUsers();
  }, [isAuthenticated, user, fetchUsers]);

  const handleToggleStatus = async (userId: string) => {
    try {
      await adminService.toggleUserStatus(userId);
      toast.success("User status updated");
      fetchUsers();
    } catch { toast.error("Failed to update status"); }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await adminService.changeUserRole(userId, role);
      toast.success("Role updated");
      fetchUsers();
    } catch { toast.error("Failed to update role"); }
  };

  const handleAssignDepartment = async (userId: string, departmentId: string) => {
    setAssigningDept(userId);
    try {
      // If user already has a department, remove it first
      const currentDeptId = userDepartments[userId];
      if (currentDeptId) {
        await adminService.removeDepartment(userId, currentDeptId);
      }
      await adminService.assignDepartment(userId, departmentId);
      setUserDepartments((prev) => ({ ...prev, [userId]: departmentId }));
      toast.success("Department assigned successfully");
    } catch {
      toast.error("Failed to assign department");
    } finally {
      setAssigningDept(null);
    }
  };

  const getDepartmentName = (userId: string): string | null => {
    const deptId = userDepartments[userId];
    if (!deptId) return null;
    const dept = departments.find((d) => d.id === deptId);
    return dept?.name || null;
  };

  if (authLoading || !user) return <PageLoader />;

  return (
    <DashboardLayout role="ADMIN" userName={user.fullName}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="CITIZEN">Citizens</SelectItem>
              <SelectItem value="OFFICIAL">Officials</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <PageLoader text="Loading users..." />
        ) : users.length === 0 ? (
          <EmptyState icon={Users} title="No users found" />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Complaints</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell className="text-gray-500">{u.email}</TableCell>
                    <TableCell>
                      <Select
                        value={u.role}
                        onValueChange={(role) => handleRoleChange(u.id, role)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CITIZEN">Citizen</SelectItem>
                          <SelectItem value="OFFICIAL">Official</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {u.role === "OFFICIAL" ? (
                        <div className="flex flex-col gap-1.5">
                          {getDepartmentName(u.id) && (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs w-fit"
                            >
                              {getDepartmentName(u.id)}
                            </Badge>
                          )}
                          <Select
                            value={userDepartments[u.id] || ""}
                            onValueChange={(deptId) => handleAssignDepartment(u.id, deptId)}
                            disabled={assigningDept === u.id}
                          >
                            <SelectTrigger className="w-[160px] h-8 text-xs">
                              <SelectValue placeholder="Assign department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u._count.complaints}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.isActive ? "default" : "destructive"}
                        className={u.isActive ? "bg-emerald-100 text-emerald-700" : ""}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.isActive ? (
                          <ShieldOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <span className="flex items-center text-sm text-gray-500 px-3">
                  Page {page} of {totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
