import { cn } from "@/lib/utils";
import {
  Construction,
  Trash2,
  Lightbulb,
  Droplets,
  PipetteIcon,
  TreePine,
  Building2,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import type { ComponentType } from "react";

interface IconConfig {
  icon: ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
}

const categoryIcons: Record<string, IconConfig> = {
  "Road Damage": {
    icon: Construction,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  Garbage: {
    icon: Trash2,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  "Street Light": {
    icon: Lightbulb,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  "Water Leakage": {
    icon: Droplets,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  Sewage: {
    icon: PipetteIcon,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  "Tree Hazard": {
    icon: TreePine,
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  "Public Facility Damage": {
    icon: Building2,
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
  },
  Encroachment: {
    icon: ShieldAlert,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
  Other: {
    icon: HelpCircle,
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
  },
};

interface CategoryIconProps {
  category: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", icon: "w-4 h-4" },
  md: { container: "w-10 h-10", icon: "w-5 h-5" },
  lg: { container: "w-14 h-14", icon: "w-7 h-7" },
};

export function CategoryIcon({ category, size = "md", className }: CategoryIconProps) {
  const config = categoryIcons[category] || categoryIcons["Other"];
  const s = sizeMap[size];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "rounded-xl flex items-center justify-center shrink-0",
        s.container,
        config.bgColor,
        className
      )}
    >
      <IconComponent className={cn(s.icon, config.iconColor)} />
    </div>
  );
}

export { categoryIcons };
