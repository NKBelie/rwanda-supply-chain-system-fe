"use client";
import { useState, ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Download, Filter, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui";
import { InputField } from "@/components/forms";
import { useSearch, usePagination, useSorting } from "@/hooks";
import { useT } from "@/lib/i18n";
import { cn } from "@/utils";
import type { TableColumn, Tone } from "@/types";

// Helper to convert tone to badge className
const getToneClass = (tone: Tone): string => {
  const toneClasses: Record<Tone, string> = {
    success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    danger: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    muted: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  };
  return toneClasses[tone] || "";
};

interface DataTableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[];
  rows: T[];
  keyField?: keyof T;
  loading?: boolean;
  empty?: ReactNode;
  searchKeys?: (keyof T)[];
  tabs?: { label: string; filter?: (row: T) => boolean }[];
  actions?: (row: T) => ReactNode;
  pageSize?: number;
  onExport?: () => void;
  onRefresh?: () => void;
}

export function DataTable<T extends Record<string, unknown>>({
  columns, rows, keyField, loading, empty, searchKeys = [], tabs, actions, pageSize = 10, onExport, onRefresh,
}: DataTableProps<T>) {
  const [activeTab, setActiveTab] = useState(0);
  const t = useT();

  const tabRows = tabs ? (tabs[activeTab]?.filter ? rows.filter(tabs[activeTab].filter!) : rows) : rows;
  const { query, setQuery, results: searched } = useSearch(tabRows, searchKeys);
  const { sort, sorted, toggleSort } = useSorting(searched);
  const { paginated, state, totalPages, prev, next, goTo } = usePagination(sorted, pageSize);

  return (
    <div className="rounded-xl border border-border bg-background shadow-card">
      {/* Tabs */}
      {tabs && (
        <div className="flex flex-wrap gap-1 border-b border-border px-3 pt-2">
          {tabs.map((tab, i) => (
            <button key={tab.label} onClick={() => setActiveTab(i)}
              className={cn("h-9 rounded-t-md border-b-2 px-3 text-sm font-medium transition",
                i === activeTab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
        <InputField type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("table.search")} className="min-w-48 flex-1" />
        {onRefresh && (
          <button onClick={onRefresh} title={t("common.refresh")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface">
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
        {onExport && (
          <button onClick={onExport} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface">
            <Download className="h-4 w-4" /> {t("table.exportCsv")}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-muted-foreground">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  <button onClick={() => toggleSort(col.key as keyof T)}
                    className="inline-flex items-center gap-1 hover:text-foreground">
                    {col.label}
                    {sort?.key === col.key
                      ? sort.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      : <ChevronsUpDown className="h-3 w-3 opacity-40" />}
                  </button>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-medium">{t("table.actions")}</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center">
                <div className="flex justify-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
                <p className="mt-2 text-xs text-muted-foreground">{t("table.loading")}</p>
              </td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-muted-foreground">
                {query ? t("table.noResults") : (empty ?? t("module.empty"))}
              </td></tr>
            ) : paginated.map((row, i) => (
              <tr key={keyField ? String(row[keyField]) : i}
                className="border-b border-border last:border-0 hover:bg-surface/60">
                {columns.map((col) => {
                  const val = row[col.key];
                  const tone = col.badge?.(val);
                  return (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(val, row)
                        : tone ? <Badge className={getToneClass(tone as Tone)}>{String(val)}</Badge>
                        : <span className="text-foreground">{String(val ?? "—")}</span>}
                    </td>
                  );
                })}
                {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border p-3 text-xs text-muted-foreground">
        <span>
          {t("table.showing")} {state.total === 0 ? 0 : Math.min((state.page - 1) * state.pageSize + 1, state.total)}–{Math.min(state.page * state.pageSize, state.total)} {t("table.of")} {state.total} {t("table.rows")}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => goTo(1)} disabled={state.page === 1}
            className="h-8 rounded-md border border-border px-2 hover:bg-surface disabled:opacity-40">{t("table.first")}</button>
          <button onClick={prev} disabled={state.page === 1}
            className="h-8 rounded-md border border-border px-2 hover:bg-surface disabled:opacity-40">{t("table.previous")}</button>
          <span className="px-2">{state.page} / {totalPages}</span>
          <button onClick={next} disabled={state.page === totalPages}
            className="h-8 rounded-md border border-border px-2 hover:bg-surface disabled:opacity-40">{t("table.next")}</button>
          <button onClick={() => goTo(totalPages)} disabled={state.page === totalPages}
            className="h-8 rounded-md border border-border px-2 hover:bg-surface disabled:opacity-40">{t("table.last")}</button>
        </div>
      </div>
    </div>
  );
}
