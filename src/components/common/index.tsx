import { ReactNode, type ComponentType } from "react";
import { cn } from "@/utils";
import { Badge, Spinner } from "@/components/ui";
import type { Tone } from "@/types";
import { SearchField } from "@/components/forms";
import { Inbox, AlertCircle, WifiOff, Construction, RefreshCw } from "lucide-react";
import { t } from "@/lib/i18n";

// ─── PageContainer ────────────────────────────────────────────────────────────
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex min-h-full flex-col", className)}>{children}</div>;
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
export function SectionHeader({ title, description, actions }: {
  title: string; description?: string; actions?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-background">
      <div className="flex flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

// ─── ContentSection ───────────────────────────────────────────────────────────
export function ContentSection({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-4 md:p-6", className)}>{children}</div>;
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ title, description, action, icon: Icon = Inbox }: {
  title?: string; description?: string;
  action?: ReactNode; icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <Icon className="mb-3 h-10 w-10 text-muted-foreground/50" />
      <h3 className="font-semibold text-foreground">{title ?? t("common.noData")}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── LoadingState ─────────────────────────────────────────────────────────────
export function LoadingState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <Spinner className="mb-3" />
      <span className="text-sm">{message ?? t("common.loading")}</span>
    </div>
  );
}

// ─── ErrorState ───────────────────────────────────────────────────────────────
export function ErrorState({ title, description, onRetry }: {
  title?: string; description?: string; onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-danger/20 bg-danger/5 px-6 py-16 text-center">
      <AlertCircle className="mb-3 h-10 w-10 text-danger" />
      <h3 className="font-semibold">{title ?? t("common.error")}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface">
          <RefreshCw className="h-4 w-4" /> {t("common.retry")}
        </button>
      )}
    </div>
  );
}

// ─── NoData ───────────────────────────────────────────────────────────────────
export function NoData({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-muted-foreground">
      <WifiOff className="mb-2 h-8 w-8 opacity-40" />
      <span className="text-sm">{message ?? t("table.noResults")}</span>
    </div>
  );
}

// ─── ComingSoon ───────────────────────────────────────────────────────────────
export function ComingSoon({ feature }: { feature?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <Construction className="mb-3 h-10 w-10 text-muted-foreground/50" />
      <h3 className="font-semibold">{feature ?? t("common.comingSoon")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">This feature is under development.</p>
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status, tone, size }: { status: string; tone?: Tone; size?: "sm" | "md" | "lg" }) {
  const toneMap: Record<string, Tone> = {
    // Active states
    "active": "success", "Active": "success", "Confirmed": "success", "Delivered": "success", 
    "Available": "success", "verified": "success", "completed": "success", "paid": "success",
    "in-stock": "success", "Good": "success",
    
    // Pending/Warning states
    "pending": "warning", "Pending": "warning", "low-stock": "warning", "Low": "warning",
    "expiring-soon": "warning",
    
    // Info/In Progress states
    "in-transit": "info", "In Transit": "info", "On Trip": "info", "in-progress": "info",
    "shipped": "info", "scheduled": "info", "arrived": "info", "unloading": "info",
    "reserved": "info", "processing": "info", "confirmed": "info",
    
    // Inactive/Muted states
    "inactive": "muted", "Inactive": "muted", "Off Duty": "muted",
    
    // Danger states
    "cancelled": "danger", "Cancelled": "danger", "suspended": "danger", "Suspended": "danger",
    "out-of-stock": "danger", "Critical": "danger", "delayed": "danger",
  };
  return <Badge tone={tone ?? toneMap[status] ?? "muted"} size={size}>{status}</Badge>;
}

// ─── SearchBar ────────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return <SearchField value={value} onChange={onChange} placeholder={placeholder ?? t("table.search")} className={cn("max-w-sm", className)} />;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
export function Logo({ size = "md", showName = true }: { size?: "sm" | "md" | "lg"; showName?: boolean }) {
  const sizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-11 w-11 text-base" };
  return (
    <div className="flex items-center gap-2">
      <div className={cn("grid place-items-center rounded-md bg-primary font-bold text-primary-foreground", sizes[size])}>R</div>
      {showName && <span className="font-semibold tracking-tight">RSCN</span>}
    </div>
  );
}
