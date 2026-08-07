"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Settings, Building2, Globe, Clock } from "lucide-react";
import { adminService } from "@/services/admin.service";

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  _count: { departmentUsers: number; complaints: number };
}

export default function SettingsPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      adminService
        .getDepartments()
        .then((res) => setDepartments(res.data as Department[]))
        .catch(() => toast.error("Failed to load departments"))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user]);

  if (authLoading || !user) return <PageLoader />;

  return (
    <DashboardLayout role="ADMIN" userName={user.fullName}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-emerald-600" />
            Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage departments and platform configuration
          </p>
        </div>

        {/* Platform Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-600" />
            Platform
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Input value="CitiCare" disabled />
            </div>
            <div className="space-y-2">
              <Label>Version</Label>
              <Input value="1.0.0" disabled />
            </div>
            <div className="space-y-2">
              <Label>Backend URL</Label>
              <Input value={process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"} disabled />
            </div>
            <div className="space-y-2">
              <Label>Environment</Label>
              <Input value={process.env.NODE_ENV || "development"} disabled />
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Departments
          </h2>

          {loading ? (
            <PageLoader text="Loading departments..." />
          ) : (
            <div className="space-y-3">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {dept.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{dept.name}</p>
                    <p className="text-sm text-gray-500">{dept.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {dept._count.complaints} complaints
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {dept._count.departmentUsers} officials
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SLA Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            SLA Configuration
          </h2>
          <p className="text-sm text-gray-500">
            SLA rules are configured per complaint category and define the
            maximum resolution time in hours. These are set during database
            seeding and can be updated via the database directly.
          </p>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-emerald-50 text-center">
              <p className="font-bold text-emerald-700 text-lg">72h</p>
              <p className="text-emerald-600">Road Damage</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-center">
              <p className="font-bold text-amber-700 text-lg">24h</p>
              <p className="text-amber-600">Garbage</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-center">
              <p className="font-bold text-blue-700 text-lg">48h</p>
              <p className="text-blue-600">Street Light</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
