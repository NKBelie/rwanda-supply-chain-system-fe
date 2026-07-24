// ─── Shared status helpers ────────────────────────────────────────────────────

export type StatusVariant =
  | "Active" | "Completed" | "Pending" | "Draft" | "Rejected"
  | "In Production" | "QA Check" | "Dispatched" | "Paused"
  | "Low Stock" | "In Transit" | "Delivered" | "Confirmed" | "Cancelled"
  | "Overdue" | "Paid" | "Partial";

export function statusColor(s: StatusVariant | string): string {
  const map: Record<string, string> = {
    Active:         "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Completed:      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Delivered:      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Paid:           "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Confirmed:      "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    "In Production":"bg-sky-500/10 text-sky-700 dark:text-sky-400",
    "In Transit":   "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    "QA Check":     "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    Pending:        "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Partial:        "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    "Low Stock":    "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Dispatched:     "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Draft:          "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    Paused:         "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    Rejected:       "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    Cancelled:      "bg-rose-500/10 text-rose-700 dark:text-rose-400",
    Overdue:        "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  };
  return map[s] ?? "bg-slate-500/10 text-slate-600";
}
