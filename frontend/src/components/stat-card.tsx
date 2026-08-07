import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "emerald" | "teal" | "blue" | "amber" | "rose";
  className?: string;
}

const variantStyles = {
  default: {
    card: "bg-white border border-gray-100",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    iconBg: "bg-white/20",
    iconColor: "text-white",
  },
  teal: {
    card: "bg-gradient-to-br from-teal-500 to-teal-600 text-white",
    iconBg: "bg-white/20",
    iconColor: "text-white",
  },
  blue: {
    card: "bg-white border border-blue-100",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  amber: {
    card: "bg-white border border-amber-100",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  rose: {
    card: "bg-white border border-rose-100",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const style = variantStyles[variant];
  const isGradient = variant === "emerald" || variant === "teal";

  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300",
        style.card,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              isGradient ? "text-white/80" : "text-gray-500"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-sm",
                isGradient ? "text-white/70" : "text-gray-400"
              )}
            >
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-semibold",
                  trend.isPositive
                    ? isGradient
                      ? "text-white"
                      : "text-emerald-600"
                    : isGradient
                      ? "text-red-200"
                      : "text-red-500"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span
                className={cn(
                  "text-xs",
                  isGradient ? "text-white/60" : "text-gray-400"
                )}
              >
                vs last month
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-2.5",
            style.iconBg
          )}
        >
          <Icon className={cn("w-5 h-5", style.iconColor)} />
        </div>
      </div>
    </div>
  );
}
