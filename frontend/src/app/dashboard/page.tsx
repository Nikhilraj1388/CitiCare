"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { CategoryIcon } from "@/components/category-icon";
import { PageLoader } from "@/components/page-loader";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ChevronRight,
} from "lucide-react";
import { complaintService } from "@/services/complaint.service";
import { adminService } from "@/services/admin.service";
import type { Complaint, ComplaintStatus } from "@/types";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, reopened: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadData = async () => {
      try {
        if (user.role === "CITIZEN") {
          const res = await complaintService.getMyComplaints(1, 5);
          const data = res.data as { complaints: Complaint[]; pagination: { total: number } };
          setComplaints(data.complaints);

          // Calculate stats from complaints
          const allRes = await complaintService.getMyComplaints(1, 100);
          const all = (allRes.data as { complaints: Complaint[] }).complaints;
          setStats({
            total: all.length,
            pending: all.filter((c) => ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"].includes(c.status)).length,
            resolved: all.filter((c) => c.status === "RESOLVED").length,
            reopened: all.filter((c) => c.status === "REOPENED").length,
          });
        } else if (user.role === "OFFICIAL") {
          // Official — use assigned complaints list
          const res = await complaintService.getAll(1, 100);
          const data = res.data as { complaints: Complaint[] };
          const all = data.complaints || [];
          setComplaints(all.slice(0, 5));
          setStats({
            total: all.length,
            pending: all.filter((c) => ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"].includes(c.status)).length,
            resolved: all.filter((c) => c.status === "RESOLVED").length,
            reopened: all.filter((c) => c.status === "REOPENED").length,
          });
        } else {
          // Admin — use admin stats
          const res = await adminService.getStats();
          const data = res.data as {
            totalComplaints: number;
            submitted: number;
            underReview: number;
            inProgress: number;
            resolved: number;
            reopened: number;
            recentComplaints: Complaint[];
          };
          setStats({
            total: data.totalComplaints,
            pending: data.submitted + data.underReview + data.inProgress,
            resolved: data.resolved,
            reopened: data.reopened,
          });
          setComplaints(data.recentComplaints || []);
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  if (isLoading || !user) return <PageLoader />;

  return (
    <DashboardLayout
      role={user.role as "CITIZEN" | "OFFICIAL" | "ADMIN"}
      userName={user.fullName}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.fullName.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              {user.role === "CITIZEN"
                ? "Here's an overview of your complaints."
                : "Platform overview and recent activity."}
            </p>
          </div>
          {user.role === "CITIZEN" && (
            <Button
              onClick={() => router.push("/dashboard/report")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Report Issue
            </Button>
          )}
        </div>

        {/* Stats */}
        {loading ? (
          <PageLoader text="Loading stats..." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Complaints"
                value={stats.total}
                icon={ClipboardList}
                variant="emerald"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={Clock}
                variant="amber"
              />
              <StatCard
                title="Resolved"
                value={stats.resolved}
                icon={CheckCircle2}
                variant="blue"
              />
              <StatCard
                title="Reopened"
                value={stats.reopened}
                icon={AlertTriangle}
                variant="rose"
              />
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Complaints
                </h2>
                <Link
                  href={user.role === "CITIZEN" ? "/dashboard/complaints" : "/dashboard/assigned"}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View all →
                </Link>
              </div>

              {complaints.length === 0 ? (
                <EmptyState
                  title="No complaints yet"
                  description={
                    user.role === "CITIZEN"
                      ? "Report your first civic issue to get started."
                      : "No complaints in the system yet."
                  }
                  action={
                    user.role === "CITIZEN"
                      ? { label: "Report Issue", onClick: () => router.push("/dashboard/report") }
                      : undefined
                  }
                />
              ) : (
                <div className="space-y-3">
                  {complaints.slice(0, 5).map((c) => (
                    <Link
                      key={c.id}
                      href={`/dashboard/complaints/${c.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <CategoryIcon category={c.category?.name || "Other"} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {c.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {c.complaintNumber} •{" "}
                          {new Date(c.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <StatusBadge status={c.status as ComplaintStatus} size="sm" />
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
