"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminUsersQuery,
  useDepartmentsQuery,
  useToggleUserStatusMutation,
  useChangeUserRoleMutation,
  useAssignDepartmentMutation,
  useCreateUserMutation,
} from "@/hooks/use-admin-query";
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Users, ShieldCheck, ShieldOff, Plus } from "lucide-react";
import type { UserRow } from "@/types";

export default function AdminUsersPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [userDepartments, setUserDepartments] = useState<Record<string, string>>({});
  const [assigningDept, setAssigningDept] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "CITIZEN",
    departmentId: "",
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const { data: usersData, isLoading: usersLoading } = useAdminUsersQuery(
    { page, limit: 10, role: roleFilter, search },
    { enabled: isAuthenticated && user?.role === "ADMIN" }
  );

  const { data: departments = [] } = useDepartmentsQuery({
    enabled: isAuthenticated && user?.role === "ADMIN",
  });

  const toggleStatusMutation = useToggleUserStatusMutation();
  const changeRoleMutation = useChangeUserRoleMutation();
  const assignDeptMutation = useAssignDepartmentMutation();
  const createUserMutation = useCreateUserMutation();

  const users = usersData?.users || [];
  const totalPages = usersData?.pagination?.totalPages || 1;
  const loading = usersLoading;

  const handleToggleStatus = (userId: string) => {
    toggleStatusMutation.mutate(userId, {
      onSuccess: () => toast.success("User status updated"),
      onError: () => toast.error("Failed to update status"),
    });
  };

  const handleRoleChange = (userId: string, role: string) => {
    changeRoleMutation.mutate(
      { userId, role },
      {
        onSuccess: () => toast.success("Role updated"),
        onError: () => toast.error("Failed to update role"),
      }
    );
  };

  const handleAssignDepartment = (userId: string, departmentId: string) => {
    setAssigningDept(userId);
    const currentDeptId =
      userDepartments[userId] ||
      users.find((u) => u.id === userId)?.departmentUsers?.[0]?.department?.id;
    assignDeptMutation.mutate(
      { userId, departmentId, currentDepartmentId: currentDeptId },
      {
        onSuccess: () => {
          setUserDepartments((prev) => ({ ...prev, [userId]: departmentId }));
          toast.success("Department assigned successfully");
          setAssigningDept(null);
        },
        onError: () => {
          toast.error("Failed to assign department");
          setAssigningDept(null);
        },
      }
    );
  };

  const getDepartmentName = (u: UserRow): string | null => {
    const deptId = userDepartments[u.id] || u.departmentUsers?.[0]?.department?.id;
    if (!deptId) return null;
    const dept = departments.find((d) => d.id === deptId);
    return dept?.name || u.departmentUsers?.[0]?.department?.name || null;
  };

  const getDepartmentId = (u: UserRow): string | undefined => {
    return userDepartments[u.id] || u.departmentUsers?.[0]?.department?.id || undefined;
  };

  const handleCreateUser = () => {
    if (!newUser.fullName || !newUser.email || !newUser.password) {
      toast.error("Please fill all required fields");
      return;
    }
    createUserMutation.mutate(
      {
        ...newUser,
        departmentId:
          newUser.role === "OFFICIAL" && newUser.departmentId
            ? newUser.departmentId
            : undefined,
      },
      {
        onSuccess: () => {
          toast.success("User created successfully");
          setAddDialogOpen(false);
          setNewUser({
            fullName: "",
            email: "",
            phone: "",
            password: "",
            role: "CITIZEN",
            departmentId: "",
          });
        },
        onError: (err: unknown) => {
          const error = err as { response?: { data?: { message?: string } } };
          toast.error(error.response?.data?.message || "Failed to create user");
        },
      }
    );
  };

  if (authLoading || !user) return <PageLoader />;


  return (
    <DashboardLayout role="ADMIN" userName={user.fullName}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage all registered users</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={newUser.fullName} onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} placeholder="Enter phone number" />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} placeholder="Enter password" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={newUser.role} onValueChange={(v) => setNewUser({...newUser, role: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CITIZEN">Citizen</SelectItem>
                      <SelectItem value="OFFICIAL">Official</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === 'OFFICIAL' && (
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={newUser.departmentId || undefined} onValueChange={(v) => setNewUser({...newUser, departmentId: v})}>
                      <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCreateUser} disabled={createUserMutation.isPending}>
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
                          {getDepartmentName(u) && (
                            <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs w-fit"
                            >
                              {getDepartmentName(u)}
                            </Badge>
                          )}
                          <Select
                            value={getDepartmentId(u)}
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
