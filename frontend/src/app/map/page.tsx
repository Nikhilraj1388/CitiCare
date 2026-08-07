"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { StatusBadge } from "@/components/status-badge";
import { PageLoader } from "@/components/page-loader";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import api from "@/lib/axios";
import type { ComplaintStatus } from "@/types";

// Dynamically import Leaflet to avoid SSR issues
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

export default function MapPage() {
  const [complaints, setComplaints] = useState<MapComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Import leaflet CSS
    import("leaflet/dist/leaflet.css");

    // Fix default marker icon
    import("leaflet").then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    });

    api
      .get("/complaints/map")
      .then((res) => setComplaints(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-emerald-600" />
                Civic Issues Map
              </h1>
              <p className="text-gray-500 mt-1">
                View reported issues across the city
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {complaints.length} issues plotted
            </Badge>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <PageLoader text="Loading map data..." />
          ) : complaints.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <EmptyState
                icon={MapPin}
                title="No geo-located complaints yet"
                description="Complaints with GPS coordinates will appear on this map. Report an issue with location to see it here."
              />
            </div>
          ) : (
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: "calc(100vh - 140px)", width: "100%" }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {complaints.map((c) => (
                <Marker
                  key={c.id}
                  position={[c.latitude, c.longitude]}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <p className="text-xs font-mono text-gray-400 mb-1">
                        {c.complaintNumber}
                      </p>
                      <p className="font-semibold text-sm mb-1">{c.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge
                          status={c.status as ComplaintStatus}
                          size="sm"
                        />
                      </div>
                      {c.category && (
                        <p className="text-xs text-gray-500">
                          📁 {c.category.name}
                        </p>
                      )}
                      {c.department && (
                        <p className="text-xs text-gray-500">
                          🏢 {c.department.name}
                        </p>
                      )}
                      {c.address && (
                        <p className="text-xs text-gray-500">
                          📍 {c.address}
                        </p>
                      )}
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
