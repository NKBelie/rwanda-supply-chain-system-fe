"use client";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { AlertCircle, CheckCircle2, Factory, PauseCircle, Plus, Search, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { statusColor } from "../shared/data";
import { dailyOutputData, productionBatches, type ProductionBatch, type ProductionStatus } from "./data";

const STATUS_TABS = ["All", "In Production", "QA Check", "Completed", "Draft", "Paused"] as const;

function ProgressBar({ value, status }: { value: number; status: ProductionStatus }) {
  const color = status === "Completed" ? "bg-emerald-500" : status === "QA Check" ? "bg-violet-500" : status === "Paused" ? "bg-slate-400" : "bg-primary";
  return (
    <div className="h-1.5 w-full rounded-full bg-border">
      <div className={cn("h-1.5 rounded-full transition-all", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

export function ProductionPage() {
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [viewBatch, setViewBatch] = useState<ProductionBatch | null>(null);
  const [newRunOpen, setNewRunOpen] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newLine, setNewLine] = useState("Line A");
  const [batches, setBatches] = useState(productionBatches);
  const [runSuccess, setRunSuccess] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return batches.filter((b) => {
      const matchTab = tab === "All" || b.status === tab;
      const matchSearch = !term || [b.product, b.sku, b.supervisor].some((v) => v.toLowerCase().includes(term));
      return matchTab && matchSearch;
    });
  }, [batches, tab, search]);

  const kpis = useMemo(() => ({
    active: batches.filter((b) => b.status === "In Production").length,
    qaCheck: batches.filter((b) => b.status === "QA Check").length,
    completed: batches.filter((b) => b.status === "Completed").length,
    avgYield: (batches.filter((b) => b.yieldRate > 0).reduce((s, b) => s + b.yieldRate, 0) / batches.filter((b) => b.yieldRate > 0).length).toFixed(1),
  }), [batches]);

  const createRun = () => {
    if (!newProduct.trim() || !newQty.trim()) return;
    const newBatch: ProductionBatch = {
      id: `BATCH-${7822 + batches.length}`,
      sku: `SKU-NEW-00${batches.length + 1}`,
      product: newProduct.trim(),
      category: "General",
      targetQty: newQty.trim(),
      producedQty: "0",
      unit: "kg",
      progress: 0,
      status: "Draft",
      startDate: new Date().toISOString().slice(0, 10),
      expectedEnd: "",
      line: newLine,
      supervisor: "Unassigned",
      yieldRate: 0,
    };
    setBatches((prev) => [newBatch, ...prev]);
    setRunSuccess(true);
    setTimeout(() => { setNewRunOpen(false); setRunSuccess(false); setNewProduct(""); setNewQty(""); }, 1500);
  };

  return (
    <>
      <PageHeader
        title="Production"
        description="Monitor batches, production lines and yield across all manufacturing runs."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Production" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Export</Button>
            <Button size="sm" onClick={() => setNewRunOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New Production Run
            </Button>
          </div>
        }
      />
      <PageBody>
        {/* KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Active Batches", value: kpis.active, icon: Factory, color: "text-sky-600", bg: "bg-sky-500/10" },
            { label: "In QA Check", value: kpis.qaCheck, icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-500/10" },
            { label: "Completed", value: kpis.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Avg. Yield Rate", value: `${kpis.avgYield}%`, icon: AlertCircle, color: "text-primary", bg: "bg-primary/10" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1.5 text-2xl font-semibold text-foreground">{value}</p>
                </div>
                <div className={cn("rounded-xl p-2", bg)}>
                  <Icon className={cn("h-5 w-5", color)} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_340px]">
          {/* Output chart */}
          <Card className="border-border/80 bg-background shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Daily Production Output (Last 30 days)</CardTitle>
              <span className="text-xs text-muted-foreground">kg/day</span>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dailyOutputData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--color-background)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`${v} kg`, "Output"]}
                  />
                  <Bar dataKey="output" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line status */}
          <Card className="border-border/80 bg-background shadow-sm">
            <CardHeader><CardTitle className="text-base">Production Lines</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Line A", "Line B", "Line C"].map((line) => {
                const lineBatches = batches.filter((b) => b.line === line && b.status === "In Production");
                const active = lineBatches.length > 0;
                return (
                  <div key={line} className="rounded-xl border border-border bg-surface p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2.5 w-2.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-300")} />
                        <span className="text-sm font-medium text-foreground">{line}</span>
                      </div>
                      <span className={cn("text-xs font-medium", active ? "text-emerald-700" : "text-muted-foreground")}>
                        {active ? "Running" : "Idle"}
                      </span>
                    </div>
                    {active && lineBatches.map((b) => (
                      <div key={b.id} className="mt-2">
                        <p className="text-xs text-muted-foreground truncate">{b.product}</p>
                        <ProgressBar value={b.progress} status={b.status} />
                        <p className="text-[10px] text-muted-foreground mt-0.5">{b.progress}% · ETA {b.expectedEnd}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Tabs + search */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface")}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search batches…" className="h-9 w-56 rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {/* Batches table */}
        <Card className="border-border/80 bg-background shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Line</th>
                  <th className="px-4 py-3 text-left">Progress</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Yield</th>
                  <th className="px-4 py-3 text-left">Start Date</th>
                  <th className="px-4 py-3 text-left">ETA</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">No batches found.</td></tr>
                ) : filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{b.product}</p>
                      <p className="text-xs text-muted-foreground">{b.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.line}</td>
                    <td className="px-4 py-3 w-36">
                      <ProgressBar value={b.progress} status={b.status} />
                      <p className="text-xs text-muted-foreground mt-0.5">{b.producedQty}/{b.targetQty} {b.unit}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColor(b.status))}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {b.yieldRate > 0 ? <span className={cn("text-sm font-medium", b.yieldRate >= 95 ? "text-emerald-600" : "text-amber-600")}>{b.yieldRate}%</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{b.expectedEnd || "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewBatch(b)} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-surface">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageBody>

      {/* Batch detail modal */}
      {viewBatch && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setViewBatch(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{viewBatch.id}</h2>
                <p className="text-sm text-muted-foreground">{viewBatch.product} · {viewBatch.sku}</p>
              </div>
              <button onClick={() => setViewBatch(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-border bg-surface p-3 grid grid-cols-2 gap-2">
                <div><p className="text-xs text-muted-foreground">Status</p><span className={cn("mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusColor(viewBatch.status))}>{viewBatch.status}</span></div>
                <div><p className="text-xs text-muted-foreground">Line</p><p className="font-medium mt-0.5">{viewBatch.line}</p></div>
                <div><p className="text-xs text-muted-foreground">Supervisor</p><p className="font-medium mt-0.5">{viewBatch.supervisor}</p></div>
                <div><p className="text-xs text-muted-foreground">Yield Rate</p><p className={cn("font-medium mt-0.5", viewBatch.yieldRate >= 95 ? "text-emerald-600" : "text-amber-600")}>{viewBatch.yieldRate > 0 ? `${viewBatch.yieldRate}%` : "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Start Date</p><p className="font-medium mt-0.5">{viewBatch.startDate}</p></div>
                <div><p className="text-xs text-muted-foreground">Expected End</p><p className="font-medium mt-0.5">{viewBatch.expectedEnd || "—"}</p></div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs text-muted-foreground mb-2">Production progress</p>
                <ProgressBar value={viewBatch.progress} status={viewBatch.status} />
                <p className="text-xs text-muted-foreground mt-1">{viewBatch.producedQty} / {viewBatch.targetQty} {viewBatch.unit} produced ({viewBatch.progress}%)</p>
              </div>
              {viewBatch.notes && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  <span className="font-semibold">Note:</span> {viewBatch.notes}
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setViewBatch(null)}>Close</Button>
              <Button>Edit Batch</Button>
            </div>
          </div>
        </div>
      )}

      {/* New run modal */}
      {newRunOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setNewRunOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">New Production Run</h2>
              <button onClick={() => setNewRunOpen(false)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            {runSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">✓ Production run created successfully!</div>
            ) : (
              <div className="space-y-3">
                <label className="block"><span className="mb-1 block text-xs font-medium text-muted-foreground">Product name *</span>
                  <input value={newProduct} onChange={(e) => setNewProduct(e.target.value)} placeholder="e.g. Arabica Coffee Roasted" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </label>
                <label className="block"><span className="mb-1 block text-xs font-medium text-muted-foreground">Target quantity (kg) *</span>
                  <input value={newQty} onChange={(e) => setNewQty(e.target.value)} placeholder="e.g. 1,000" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </label>
                <label className="block"><span className="mb-1 block text-xs font-medium text-muted-foreground">Production line</span>
                  <select value={newLine} onChange={(e) => setNewLine(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option>Line A</option><option>Line B</option><option>Line C</option>
                  </select>
                </label>
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="secondary" onClick={() => setNewRunOpen(false)}>Cancel</Button>
                  <Button onClick={createRun} disabled={!newProduct.trim() || !newQty.trim()}>Create Run</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
