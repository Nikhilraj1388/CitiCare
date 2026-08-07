import { cn } from "@/lib/utils";
import type { ComplaintStatus } from "@/types";

const statusConfig: Record<
  ComplaintStatus,
  { label: string; className: string; dotColor: string }
> = {
  SUBMITTED: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotColor: "bg-indigo-500",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  REOPENED: {
    label: "Reopened",
    className: "bg-red-50 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
};

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        config.className,
        className
      )}
    >
      <span
        className={cn("rounded-full shrink-0", config.dotColor, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")}
      />
      {config.label}
    </span>
  );
}
