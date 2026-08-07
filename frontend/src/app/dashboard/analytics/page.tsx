"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { adminService } from "@/services/admin.service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatCard } from "@/components/stat-card";
import { PageLoader } from "@/components/page-loader";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Eye,
} from "lucide-react";
import type { ComplaintStatus } from "@/types";

interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  reopened: number;
  resolutionRate: number;
  categoryStats: { category: string; count: number }[];
  recentComplaints: {
    id: string;
    complaintNumber: string;
    title: string;
    status: string;
    createdAt: string;
    citizen?: { fullName: string };
    category?: { name: string };
    department?: { name: string };
  }[];
}

export default function AnalyticsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !["OFFICIAL", "ADMIN"].includes(user?.role || ""))) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && ["OFFICIAL", "ADMIN"].includes(user?.role || "")) {
      adminService
        .getStats()
        .then((res) => setStats(res.data as DashboardStats))
        .catch(() => toast.error("Failed to load stats"))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);

  if (authLoading || !user || loading) return <PageLoader />;
  if (!stats) return <PageLoader text="No data available" />;

  return (
    <DashboardLayout
      role={user.role as "CITIZEN" | "OFFICIAL" | "ADMIN"}
      userName={user.fullName}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Platform performance overview</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Complaints"
            value={stats.totalComplaints}
            icon={ClipboardList}
            variant="emerald"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle2}
            variant="blue"
            subtitle={`${stats.resolutionRate}% resolution rate`}
          />
          <StatCard
            title="Pending"
            value={stats.submitted + stats.underReview + stats.inProgress}
            icon={Clock}
            variant="amber"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            variant="default"
          />
        </div>

        {/* Status Breakdown + Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Status Breakdown
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Submitted", value: stats.submitted, color: "bg-blue-500" },
                { label: "Under Review", value: stats.underReview, color: "bg-amber-500" },
                { label: "In Progress", value: stats.inProgress, color: "bg-indigo-500" },
                { label: "Resolved", value: stats.resolved, color: "bg-emerald-500" },
                { label: "Reopened", value: stats.reopened, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600">{item.label}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{
                        width: `${stats.totalComplaints > 0 ? (item.value / stats.totalComplaints) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                By Category
              </h2>
            </div>
            <div className="space-y-3">
              {stats.categoryStats
                .sort((a, b) => b.count - a.count)
                .map((cat) => (
                  <div key={cat.category} className="flex items-center gap-3">
                    <div className="w-36 text-sm text-gray-600 truncate">
                      {cat.category}
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${stats.totalComplaints > 0 ? (cat.count / stats.totalComplaints) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                      {cat.count}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Complaints
            </h2>
          </div>
          <div className="space-y-3">
            {stats.recentComplaints.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">
                      {c.complaintNumber}
                    </span>
                    <StatusBadge
                      status={c.status as ComplaintStatus}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {c.title}
                  </p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{c.citizen?.fullName}</p>
                  <p>{new Date(c.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
              </div>
            ))}
            {stats.recentComplaints.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No complaints yet
              </p>
            )}
          </div>
        </div>

        {/* Resolution Rate Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Resolution Rate</p>
              <p className="text-5xl font-bold mt-1">{stats.resolutionRate}%</p>
              <p className="text-emerald-200 text-sm mt-2">
                {stats.resolved} out of {stats.totalComplaints} complaints
                resolved
              </p>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
