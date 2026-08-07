"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageLoader } from "@/components/page-loader";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BellOff, Check, CheckCheck, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/axios";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "SUCCESS" | "INFO" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt: string;
}

const typeConfig = {
  SUCCESS: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  INFO: { icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
  WARNING: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  ERROR: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export default function NotificationsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      const data = res.data.data as {
        notifications: NotificationItem[];
        unreadCount: number;
      };
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // silently handle
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silently handle
    }
  };

  if (authLoading || !user) return <PageLoader />;

  return (
    <DashboardLayout
      role={user.role as "CITIZEN" | "OFFICIAL" | "ADMIN"}
      userName={user.fullName}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-500 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={markAllRead}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <PageLoader text="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="No notifications yet"
            description="You'll receive notifications when there are updates on your complaints."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const config = typeConfig[n.type] || typeConfig.INFO;
              const Icon = config.icon;
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    n.isRead
                      ? "bg-white border-gray-100"
                      : "bg-emerald-50/30 border-emerald-100 shadow-sm"
                  }`}
                >
                  <div className={`p-2 rounded-xl ${config.bg} shrink-0`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm">{n.title}</p>
                      {!n.isRead && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => markAsRead(n.id)}
                    >
                      <Check className="h-4 w-4 text-gray-400" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
