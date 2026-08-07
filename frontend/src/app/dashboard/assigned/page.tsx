"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { complaintService } from "@/services/complaint.service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatusBadge } from "@/components/status-badge";
import { CategoryIcon } from "@/components/category-icon";
import { PageLoader } from "@/components/page-loader";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ClipboardList, ChevronRight, Clock, User } from "lucide-react";
import type { Complaint, ComplaintStatus } from "@/types";
import api from "@/lib/axios";

const statusOptions = [
  { label: "All", value: "ALL" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Reopened", value: "REOPENED" },
];

export default function OfficialAssignedPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !["OFFICIAL", "ADMIN"].includes(user?.role || ""))) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await api.get(`/complaints?${params}`);
      const data = res.data.data as {
        complaints: Complaint[];
        pagination: { totalPages: number };
      };
      setComplaints(data.complaints);
      setTotalPages(data.pagination.totalPages);
    } catch {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    if (isAuthenticated && ["OFFICIAL", "ADMIN"].includes(user?.role || "")) {
      fetchComplaints();
    }
  }, [isAuthenticated, user, fetchComplaints]);

  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    setUpdatingId(complaintId);
    try {
      await api.put(`/complaints/${complaintId}/status`, {
        status: newStatus,
        remarks: `Status updated to ${newStatus.replace("_", " ").toLowerCase()}`,
      });
      toast.success("Status updated");
      fetchComplaints();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || !user) return <PageLoader />;

  return (
    <DashboardLayout
      role={user.role as "CITIZEN" | "OFFICIAL" | "ADMIN"}
      userName={user.fullName}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === "ADMIN" ? "All Complaints" : "Assigned Complaints"}
          </h1>
          <p className="text-gray-500 mt-1">
            Review and update complaint statuses
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {loading ? (
          <PageLoader text="Loading complaints..." />
        ) : complaints.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No complaints found"
            description="No complaints match the selected filter."
          />
        ) : (
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 transition-all"
              >
                <CategoryIcon
                  category={complaint.category?.name || "Other"}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">
                      {complaint.complaintNumber}
                    </span>
                    <StatusBadge
                      status={complaint.status as ComplaintStatus}
                      size="sm"
                    />
                    {complaint.department && (
                      <Badge variant="secondary" className="text-xs">
                        {complaint.department.name}
                      </Badge>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/complaints/${complaint.id}`}
                    className="font-medium text-gray-900 hover:text-emerald-600 truncate block"
                  >
                    {complaint.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(complaint.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    {complaint.citizen && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {(complaint.citizen as { fullName: string }).fullName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status Update Dropdown */}
                <Select
                  value={complaint.status}
                  onValueChange={(v) => handleStatusUpdate(complaint.id, v)}
                  disabled={updatingId === complaint.id}
                >
                  <SelectTrigger className="w-[150px] h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="REOPENED">Reopened</SelectItem>
                  </SelectContent>
                </Select>

                <Link href={`/dashboard/complaints/${complaint.id}`}>
                  <ChevronRight className="h-4 w-4 text-gray-300 hover:text-emerald-500" />
                </Link>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
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
