import { cn } from "@/lib/utils";

/**
 * Standardized StatusBadge Component
 * 
 * Supports both status strings and tone values for consistent status display
 * across all dashboards and roles.
 */

export type StatusTone = "success" | "warning" | "danger" | "info" | "muted" | "processing";

export type StatusBadgeProps = {
  status?: string;
  tone?: StatusTone;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
};

// Status string to tone mapping
const STATUS_TONE_MAP: Record<string, StatusTone> = {
  // Success states
  Active: "success",
  Confirmed: "success",
  Delivered: "success",
  Available: "success",
  Completed: "success",
  Approved: "success",
  Verified: "success",
  Accepted: "success",
  
  // Warning states
  Pending: "warning",
  Review: "warning",
  "In Review": "warning",
  "Awaiting Approval": "warning",
  Request: "warning",
  
  // Processing states
  Processing: "processing",
  Shipping: "processing",
  "In Transit": "processing",
  "In Progress": "processing",
  Transport: "processing",
  
  // Danger states
  Cancelled: "danger",
  Suspended: "danger",
  Rejected: "danger",
  Failed: "danger",
  Inactive: "danger",
  Expired: "danger",
  
  // Info states
  Draft: "info",
  Scheduled: "info",
  Reserved: "info",
};

// Tone to Tailwind classes mapping
const TONE_STYLES: Record<StatusTone, string> = {
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  processing: "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20",
  muted: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/20",
};

const SIZE_STYLES = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function StatusBadge({
  status,
  tone,
  children,
  className,
  size = "md",
}: StatusBadgeProps) {
  // Determine the tone
  const derivedTone = tone || (status ? STATUS_TONE_MAP[status] : undefined) || "muted";
  
  // Get the appropriate styles
  const toneClass = TONE_STYLES[derivedTone];
  const sizeClass = SIZE_STYLES[size];
  
  // Display text
  const displayText = children || status || "Unknown";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold",
        toneClass,
        sizeClass,
        className
      )}
    >
      {displayText}
    </span>
  );
}
