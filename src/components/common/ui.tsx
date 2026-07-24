"use client";
import { useState, type ReactNode } from "react";
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight, X, AlertTriangle } from "lucide-react";

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const BADGE_STYLES: Record<string, string> = {
  Available: "bg-success/10 text-success",
  Active: "bg-success/10 text-success",
  Stored: "bg-success/10 text-success",
  Completed: "bg-success/10 text-success",
  Accepted: "bg-success/10 text-success",
  Confirmed: "bg-success/10 text-success",
  Delivered: "bg-success/10 text-success",
  Pending: "bg-warning/10 text-warning",
  Growing: "bg-warning/10 text-warning",
  Harvested: "bg-warning/10 text-warning",
  Reserved: "bg-primary/10 text-primary",
  "In Transit": "bg-primary/10 text-primary",
  Assigned: "bg-primary/10 text-primary",
  Processing: "bg-primary/10 text-primary",
  "Out of Stock": "bg-danger/10 text-danger",
  Rejected: "bg-danger/10 text-danger",
  Released: "bg-muted text-muted-foreground",
  Inactive: "bg-muted text-muted-foreground",
  Maintenance: "bg-warning/10 text-warning",
  Cancelled: "bg-danger/10 text-danger",
  "Low Stock": "bg-warning/10 text-warning",
  "In Stock": "bg-success/10 text-success",
  Sold: "bg-muted text-muted-foreground",
  "Pending Approval": "bg-warning/10 text-warning",
  Request: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = BADGE_STYLES[status] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────

export function KpiCard({
  label, value, sub, icon: Icon, tone = "default",
}: {
  label: string; value: string | number; sub?: string;
  icon?: React.ComponentType<{ className?: string }>; tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneMap = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <div className="rounded-xl border border-border bg-background p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && (
          <div className={`grid h-8 w-8 place-items-center rounded-lg ${toneMap[tone]}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

export function EmptyState({ title, description, action }: {
  title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background py-16 text-center">
      <div className="text-sm font-medium text-foreground">{title}</div>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────

export function ConfirmDialog({
  title, message, confirmLabel = "Delete", onConfirm, onCancel, danger = true,
}: {
  title: string; message: string; confirmLabel?: string;
  onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-danger/10">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} className="h-9 rounded-lg border border-border bg-background px-4 text-sm hover:bg-surface">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`h-9 rounded-lg px-4 text-sm font-medium text-white ${danger ? "bg-danger hover:bg-danger/90" : "bg-primary hover:bg-primary-hover"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FormModal ────────────────────────────────────────────────────────────────

export function FormModal({
  title, onClose, children, wide = false,
}: {
  title: string; onClose: () => void; children: ReactNode; wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className={`w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-2xl border border-border bg-background shadow-xl my-4`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-surface">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── DataTable ────────────────────────────────────────────────────────────────

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
};

export function DataTable<T extends { id: string }>({
  columns, rows, searchKeys, pageSize = 10, actions,
}: {
  columns: Column<T>[];
  rows: T[];
  searchKeys?: (keyof T)[];
  pageSize?: number;
  actions?: (row: T) => ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = rows.filter(row => {
    if (!query) return true;
    const q = query.toLowerCase();
    const keys = searchKeys ?? (columns.map(c => c.key) as (keyof T)[]);
    return keys.some(k => String((row as Record<string, unknown>)[k as string] ?? "").toLowerCase().includes(q));
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? "");
        const bv = String((b as Record<string, unknown>)[sortKey] ?? "");
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      })
    : filtered;

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search…"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} records</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 text-left ${col.sortable !== false ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                  onClick={() => col.sortable !== false && toggleSort(String(col.key))}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable !== false && sortKey === String(col.key) && (
                      sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.length === 0 && (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            )}
            {paged.map(row => (
              <tr key={row.id} className="hover:bg-surface/50">
                {columns.map(col => (
                  <td key={String(col.key)} className="px-4 py-3">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? "—")}
                  </td>
                ))}
                {actions && <td className="px-4 py-3">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-surface disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-surface disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Field helper ─────────────────────────────────────────────────────────────

export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">
        {label}{required && <span className="ml-0.5 text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}

export const inputCls = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
export const textareaCls = "min-h-20 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
export const primaryBtn = "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50";
export const secondaryBtn = "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-surface disabled:opacity-50";
export const dangerBtn = "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-danger/10 px-3 text-xs font-medium text-danger hover:bg-danger/20";
export const ghostBtn = "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-surface";
