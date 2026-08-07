"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FileWarning,
  ClipboardList,
  Bell,
  Map,
  User,
  Settings,
  BarChart3,
  Users,
  Building2,
  FileText,
  Shield,
  Timer,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const citizenLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Report Issue", href: "/dashboard/report", icon: FileWarning },
  { label: "My Complaints", href: "/dashboard/complaints", icon: ClipboardList },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Public Map", href: "/map", icon: Map },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const officialLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Assigned Complaints", href: "/dashboard/assigned", icon: ClipboardList },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const adminLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Complaints", href: "/dashboard/assigned", icon: ClipboardList },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const linksByRole: Record<UserRole, SidebarLink[]> = {
  CITIZEN: citizenLinks,
  OFFICIAL: officialLinks,
  ADMIN: adminLinks,
};

interface SidebarProps {
  role: UserRole;
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({ role, collapsed = false, className }: SidebarProps) {
  const pathname = usePathname();
  const links = linksByRole[role];

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-gray-100 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]",
        className
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-gray-100 shrink-0",
          collapsed ? "justify-center px-2" : "px-5"
        )}
      >
        <Logo size="sm" showText={!collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          const Icon = link.icon;

          const linkContent = (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-50 text-emerald-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon
                className={cn(
                  "shrink-0 w-5 h-5",
                  isActive ? "text-emerald-600" : "text-gray-400"
                )}
              />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={link.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  {link.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Role Badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="px-3 py-2 rounded-lg bg-gray-50 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {role === "CITIZEN"
                ? "Citizen"
                : role === "OFFICIAL"
                  ? "Department Official"
                  : "Administrator"}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
