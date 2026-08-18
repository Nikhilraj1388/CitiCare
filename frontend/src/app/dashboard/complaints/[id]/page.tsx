"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { complaintService } from "@/services/complaint.service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StatusBadge } from "@/components/status-badge";
import { CategoryIcon } from "@/components/category-icon";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  User,
  Star,
} from "lucide-react";
import type { Complaint, ComplaintStatus } from "@/types";

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const isAdminOrOfficial = user?.role === "ADMIN" || user?.role === "OFFICIAL";
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      complaintService
        .getById(id)
        .then((res) => setComplaint(res.data as Complaint))
        .catch(() => toast.error("Failed to load complaint"))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  const handleFeedback = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmittingFeedback(true);
    try {
      await complaintService.submitFeedback(id, rating, feedbackComment || undefined);
      toast.success("Feedback submitted!");
      // Refresh complaint
      const res = await complaintService.getById(id);
      setComplaint(res.data as Complaint);
    } catch {
      toast.error("Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (authLoading || !user || loading) return <PageLoader />;
  if (!complaint) return <PageLoader text="Complaint not found" />;

  return (
    <DashboardLayout
      role={user.role as "CITIZEN" | "OFFICIAL" | "ADMIN"}
      userName={user.fullName}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2 text-gray-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <CategoryIcon
              category={complaint.category?.name || "Other"}
              size="lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-mono text-gray-400">
                  {complaint.complaintNumber}
                </span>
                <StatusBadge
                  status={complaint.status as ComplaintStatus}
                />
                {isAdminOrOfficial && (
                  <Select
                    value={complaint.status}
                    onValueChange={async (v) => {
                      setUpdatingStatus(true);
                      try {
                        await api.put(`/complaints/${complaint.id}/status`, {
                          status: v,
                          remarks: `Status updated to ${v.replace("_", " ").toLowerCase()}`,
                        });
                        setComplaint({ ...complaint, status: v as ComplaintStatus });
                        toast.success("Status updated");
                      } catch {
                        toast.error("Failed to update status");
                      } finally {
                        setUpdatingStatus(false);
                      }
                    }}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-[160px] h-8 text-xs">
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
                )}
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {complaint.title}
              </h1>
              <p className="text-gray-600 mt-2 leading-relaxed">
                {complaint.description}
              </p>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                {complaint.department && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Building2 className="h-4 w-4" />
                    {complaint.department.name}
                  </div>
                )}
                {complaint.address && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    {complaint.address}
                  </div>
                )}
                {complaint.citizen && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="h-4 w-4" />
                    {complaint.citizen.fullName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Map */}
        {complaint.latitude && complaint.longitude && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Complaint Location
            </h2>
            {complaint.address && (
              <p className="text-gray-600 mb-3 text-sm">{complaint.address}</p>
            )}
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '300px' }}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${complaint.longitude - 0.005},${complaint.latitude - 0.005},${complaint.longitude + 0.005},${complaint.latitude + 0.005}&layer=mapnik&marker=${complaint.latitude},${complaint.longitude}`}
              />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.latitude},${complaint.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
              <span className="text-xs text-gray-400">
                {complaint.latitude.toFixed(6)}, {complaint.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        )}

        {/* Images */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Attached Images
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {complaint.images.map((img) => (
                <div
                  key={img.id}
                  className="aspect-video rounded-xl bg-gray-100 overflow-hidden"
                >
                  <img
                    src={img.imageUrl}
                    alt="Complaint"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Status Timeline
          </h2>
          <div className="space-y-0">
            {complaint.statusHistory?.map((entry, index) => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      index === (complaint.statusHistory?.length ?? 0) - 1
                        ? "bg-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                  {index < (complaint.statusHistory?.length ?? 0) - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 min-h-[40px]" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={entry.currentStatus as ComplaintStatus}
                      size="sm"
                    />
                    <span className="text-xs text-gray-400">
                      {new Date(entry.updatedAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {entry.remarks && (
                    <p className="text-sm text-gray-600 mt-1">
                      {entry.remarks}
                    </p>
                  )}
                  {entry.updatedBy && (
                    <p className="text-xs text-gray-400 mt-1">
                      by {entry.updatedBy.fullName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback (only for resolved complaints owned by current user) */}
        {complaint.status === "RESOLVED" &&
          complaint.citizenId === user.id &&
          !complaint.feedback && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Rate Resolution
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Optional comment..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  onClick={handleFeedback}
                  disabled={submittingFeedback}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}

        {/* Existing Feedback */}
        {complaint.feedback && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Your Feedback
            </h2>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= complaint.feedback!.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {complaint.feedback.comment && (
              <p className="text-sm text-gray-600">
                {complaint.feedback.comment}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
