"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { complaintService } from "@/services/complaint.service";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageLoader, LoadingSpinner } from "@/components/page-loader";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Send, ImagePlus, X } from "lucide-react";
import type { ComplaintCategory } from "@/types";
import api from "@/lib/axios";

const complaintSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  address: z.string().optional(),
});

type ComplaintForm = z.infer<typeof complaintSchema>;

export default function ReportPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ComplaintForm>({
    resolver: zodResolver(complaintSchema),
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    complaintService.getCategories().then((res) => {
      setCategories(res.data as ComplaintCategory[]);
    });
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLocation(false);
        toast.success("Location detected!");
      },
      () => {
        setLoadingLocation(false);
        toast.error("Unable to detect location");
      }
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    setImagePreviews(
      newFiles.map((f) => URL.createObjectURL(f))
    );
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const onSubmit = async (data: ComplaintForm) => {
    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];

      // Upload images first if any
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        const formData = new FormData();
        imageFiles.forEach((f) => formData.append("images", f));
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrls = (uploadRes.data.data as { urls: string[] }).urls;
        setUploadingImages(false);
      }

      await complaintService.create({
        categoryId: data.categoryId,
        title: data.title,
        description: data.description,
        address: data.address,
        latitude: location?.lat,
        longitude: location?.lng,
        imageUrls,
      });
      toast.success("Complaint submitted successfully!");
      router.push("/dashboard/complaints");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  if (authLoading || !user) return <PageLoader />;

  return (
    <DashboardLayout
      role={user.role as "CITIZEN" | "OFFICIAL" | "ADMIN"}
      userName={user.fullName}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Report an Issue
          </h1>
          <p className="text-gray-500 mt-1">
            Help improve your city by reporting civic issues
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white rounded-2xl border border-gray-100 p-6"
        >
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Category *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setValue("categoryId", cat.id);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedCategory === cat.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <CategoryIcon category={cat.name} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Large pothole on Main Street"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe the issue in detail — location, size, severity, etc."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={detectLocation}
                disabled={loadingLocation}
                className="gap-2"
              >
                {loadingLocation ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {location ? "Location Detected ✓" : "Detect My Location"}
              </Button>
              {location && (
                <span className="text-sm text-gray-500">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address (optional)</Label>
            <Input
              id="address"
              placeholder="Enter the street address or landmark"
              {...register("address")}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <Label>Photos (optional, max 3)</Label>
            <div className="flex items-center gap-3 flex-wrap">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imageFiles.length < 3 && (
                <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-emerald-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">Add</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 gap-2"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="text-white" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Complaint
              </>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
