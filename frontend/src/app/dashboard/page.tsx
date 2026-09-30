"use client";

import { useEffect, useMemo } from "react";
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
import { useMyComplaintsQuery, useAllComplaintsQuery } from "@/hooks/use-complaints-query";
import { useAdminStatsQuery } from "@/hooks/use-admin-query";
import type { ComplaintStatus } from "@/types";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  const isCitizen = user?.role === "CITIZEN";
  const isOfficial = user?.role === "OFFICIAL";
  const isAdmin = user?.role === "ADMIN";

  const { data: citizenData, isLoading: citizenLoading } = useMyComplaintsQuery(
    { page: 1, limit: 100 },
    { enabled: isAuthenticated && isCitizen }
  );

  const { data: officialData, isLoading: officialLoading } = useAllComplaintsQuery(
    { page: 1, limit: 100 },
    { enabled: isAuthenticated && isOfficial }
  );

  const { data: adminStats, isLoading: adminLoading } = useAdminStatsQuery({
    enabled: isAuthenticated && isAdmin,
  });

  const loading = isCitizen
    ? citizenLoading
    : isOfficial
    ? officialLoading
    : adminLoading;

  const { complaints, stats } = useMemo(() => {
    if (isCitizen) {
      const all = citizenData?.complaints || [];
      return {
        complaints: all.slice(0, 5),
        stats: {
          total: all.length,
          pending: all.filter((c) => ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"].includes(c.status)).length,
          resolved: all.filter((c) => c.status === "RESOLVED").length,
          reopened: all.filter((c) => c.status === "REOPENED").length,
        },
      };
    } else if (isOfficial) {
      const all = officialData?.complaints || [];
      return {
        complaints: all.slice(0, 5),
        stats: {
          total: all.length,
          pending: all.filter((c) => ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"].includes(c.status)).length,
          resolved: all.filter((c) => c.status === "RESOLVED").length,
          reopened: all.filter((c) => c.status === "REOPENED").length,
        },
      };
    } else if (isAdmin && adminStats) {
      return {
        complaints: adminStats.recentComplaints || [],
        stats: {
          total: adminStats.totalComplaints,
          pending: adminStats.submitted + adminStats.underReview + adminStats.inProgress,
          resolved: adminStats.resolved,
          reopened: adminStats.reopened,
        },
      };
    }
    return {
      complaints: [],
      stats: { total: 0, pending: 0, resolved: 0, reopened: 0 },
    };
  }, [isCitizen, isOfficial, isAdmin, citizenData, officialData, adminStats]);

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
