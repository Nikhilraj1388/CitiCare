"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { PageLoader } from "@/components/page-loader";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Filter } from "lucide-react";
import api from "@/lib/axios";
import type { ComplaintStatus } from "@/types";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface MapComplaint {
  id: string;
  complaintNumber: string;
  title: string;
  status: string;
  latitude: number;
  longitude: number;
  address?: string;
  createdAt: string;
  category?: { name: string; icon: string };
  department?: { name: string };
}

const statusOptions = ["ALL", "SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "REOPENED"];
const categoryOptions = [
  "All Categories", "Road Damage", "Garbage", "Street Light",
  "Water Leakage", "Sewage", "Tree Hazard", "Public Facility Damage", "Encroachment", "Other",
];

export default function MapPage() {
  const [complaints, setComplaints] = useState<MapComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    setMounted(true);
    import("leaflet/dist/leaflet.css");
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    });
    api.get("/complaints/map")
      .then((res) => setComplaints(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (categoryFilter !== "All Categories" && c.category?.name !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.complaintNumber.toLowerCase().includes(q) ||
          (c.address || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complaints, statusFilter, categoryFilter, searchQuery]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        {/* Header + Filters */}
        <div className="bg-white border-b px-4 sm:px-6 py-4 space-y-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-emerald-600" />
                Civic Issues Map
              </h1>
              <p className="text-gray-500 mt-0.5 text-sm">
                View reported issues across the city
              </p>
            </div>
            <Badge variant="secondary" className="text-sm self-start">
              {filtered.length} / {complaints.length} issues shown
            </Badge>
          </div>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, CRN, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 pl-9 pr-3 rounded-md border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s === "ALL" ? "All Status" : s.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 px-3 rounded-md border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <PageLoader text="Loading map data..." />
          ) : filtered.length === 0 && complaints.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <EmptyState
                icon={MapPin}
                title="No geo-located complaints yet"
                description="Complaints with GPS coordinates will appear on this map."
              />
            </div>
          ) : (
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "calc(100vh - 200px)", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map((c) => (
                <Marker key={c.id} position={[c.latitude, c.longitude]}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <p className="text-xs font-mono text-gray-400 mb-1">{c.complaintNumber}</p>
                      <p className="font-semibold text-sm mb-1">{c.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={c.status as ComplaintStatus} size="sm" />
                      </div>
                      {c.category && <p className="text-xs text-gray-500">📁 {c.category.name}</p>}
                      {c.department && <p className="text-xs text-gray-500">🏢 {c.department.name}</p>}
                      {c.address && <p className="text-xs text-gray-500">📍 {c.address}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}
