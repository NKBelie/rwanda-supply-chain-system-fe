"use client";
import { useMemo, useState } from "react";
import { AlertTriangle, Package, Plus, Search, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { statusColor } from "../shared/data";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Overstocked";
type ItemType = "Raw Material" | "Finished Good" | "Packaging" | "Chemical";

type InventoryItem = {
  id: string; sku: string; name: string; type: ItemType;
  qty: number; unit: string; minStock: number; maxStock: number;
  location: string; supplier: string; lastUpdated: string;
  status: StockStatus; unitCost: string;
};

const inventory: InventoryItem[] = [
  { id: "INV-001", sku: "RM-CF-001", name: "Arabica Coffee Beans (Green)", type: "Raw Material", qty: 840, unit: "kg", minStock: 500, maxStock: 3000, location: "WH-01 Bay A", supplier: "Musanze Cooperative", lastUpdated: "2026-07-22", status: "In Stock", unitCost: "RWF 2,800/kg" },
  { id: "INV-002", sku: "RM-MZ-002", name: "Dried Maize (Grade A)", type: "Raw Material", qty: 420, unit: "kg", minStock: 1000, maxStock: 6000, location: "WH-01 Bay B", supplier: "Kigali Grain Hub", lastUpdated: "2026-07-21", status: "Low Stock", unitCost: "RWF 800/kg" },
  { id: "INV-003", sku: "FG-CF-001", name: "Roasted Coffee (500g packs)", type: "Finished Good", qty: 1840, unit: "packs", minStock: 200, maxStock: 5000, location: "WH-02 Finished", supplier: "—", lastUpdated: "2026-07-22", status: "In Stock", unitCost: "RWF 4,200/pack" },
  { id: "INV-004", sku: "PK-FL-001", name: "Food-Grade Packaging Film", type: "Packaging", qty: 12, unit: "rolls", minStock: 15, maxStock: 100, location: "WH-01 Storage", supplier: "AgriChemicals Ltd", lastUpdated: "2026-07-18", status: "Low Stock", unitCost: "RWF 6,400/roll" },
  { id: "INV-005", sku: "CH-CA-001", name: "Citric Acid (Food Grade)", type: "Chemical", qty: 0, unit: "kg", minStock: 50, maxStock: 300, location: "WH-01 Chemicals", supplier: "Rwanda Chemicals", lastUpdated: "2026-07-10", status: "Out of Stock", unitCost: "RWF 4,800/kg" },
  { id: "INV-006", sku: "FG-MF-001", name: "Maize Flour (1kg bags)", type: "Finished Good", qty: 3200, unit: "bags", minStock: 500, maxStock: 8000, location: "WH-02 Finished", supplier: "—", lastUpdated: "2026-07-22", status: "In Stock", unitCost: "RWF 1,800/bag" },
  { id: "INV-007", sku: "RM-TM-001", name: "Fresh Tomatoes", type: "Raw Material", qty: 95, unit: "kg", minStock: 200, maxStock: 1000, location: "WH-01 Cold", supplier: "Nyagatare Farms", lastUpdated: "2026-07-23", status: "Low Stock", unitCost: "RWF 800/kg" },
];

const stockBg: Record<StockStatus, string> = {
  "In Stock": "bg-emerald-500/10 text-emerald-700",
  "Low Stock": "bg-amber-500/10 text-amber-700",
  "Out of Stock": "bg-rose-500/10 text-rose-700",
  "Overstocked": "bg-sky-500/10 text-sky-700",
};

const TABS = ["All", "Raw Material", "Finished Good", "Packaging", "Chemical"] as const;

export function InventoryPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(inventory);
  const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [adjustSuccess, setAdjustSuccess] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return items.filter((i) => {
      const matchTab = tab === "All" || i.type === tab;
      const matchSearch = !term || [i.id, i.sku, i.name, i.supplier, i.location].some((v) => v.toLowerCase().includes(term));
      return matchTab && matchSearch;
    });
  }, [items, tab, search]);

  const stockBar = (qty: number, min: number, max: number) => {
    const pct = Math.min((qty / max) * 100, 100);
    const color = qty === 0 ? "bg-rose-500" : qty < min ? "bg-amber-500" : "bg-emerald-500";
    return (
      <div className="h-1.5 w-full rounded-full bg-border">
        <div className={cn("h-1.5 rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  const saveAdjust = () => {
    if (!adjustQty.trim() || !adjustTarget) return;
    setItems((prev) => prev.map((i) => {
      if (i.id !== adjustTarget.id) return i;
      const newQty = Number(adjustQty);
      const status: StockStatus = newQty === 0 ? "Out of Stock" : newQty < i.minStock ? "Low Stock" : newQty > i.maxStock ? "Overstocked" : "In Stock";
      return { ...i, qty: newQty, status, lastUpdated: new Date().toISOString().slice(0, 10) };
    }));
    setAdjustSuccess(true);
    setTimeout(() => { setAdjustTarget(null); setAdjustSuccess(false); setAdjustQty(""); setAdjustNote(""); }, 1400);
  };

  const lowStockCount = items.filter((i) => i.status === "Low Stock" || i.status === "Out of Stock").length;

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track raw materials, finished goods and packaging levels across all warehouses."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Inventory" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Export</Button>
            <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add SKU</Button>
          </div>
        }
      />
      <PageBody>
        {/* Alert banner */}
        {lowStockCount > 0 && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">{lowStockCount} items</span> need restocking — review Low Stock and Out of Stock items below.
            </p>
          </div>
        )}

        {/* KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total SKUs", value: items.length, icon: Package },
            { label: "In Stock", value: items.filter((i) => i.status === "In Stock").length, icon: Package },
            { label: "Low Stock", value: items.filter((i) => i.status === "Low Stock").length, icon: AlertTriangle },
            { label: "Out of Stock", value: items.filter((i) => i.status === "Out of Stock").length, icon: AlertTriangle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs + search */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface")}>{t}</button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SKUs…" className="h-9 w-56 rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <Card className="border-border/80 bg-background shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Stock Level</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Unit Cost</th>
                  <th className="px-4 py-3 text-left">Updated</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No items found.</td></tr>
                ) : filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.supplier !== "—" ? item.supplier : "In-house"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.type}</td>
                    <td className="px-4 py-3 w-40">
                      {stockBar(item.qty, item.minStock, item.maxStock)}
                      <p className="text-xs text-muted-foreground mt-0.5">{item.qty.toLocaleString()} / {item.maxStock.toLocaleString()} {item.unit}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", stockBg[item.status])}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.location}</td>
                    <td className="px-4 py-3 text-xs">{item.unitCost}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.lastUpdated}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setAdjustTarget(item); setAdjustQty(String(item.qty)); }} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-surface">Adjust</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageBody>

      {/* Adjust stock modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setAdjustTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div><h2 className="text-lg font-semibold">Adjust Stock</h2><p className="text-sm text-muted-foreground">{adjustTarget.name}</p></div>
              <button onClick={() => setAdjustTarget(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            {adjustSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">✓ Stock level updated!</div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-surface p-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Current qty</span><span className="font-medium">{adjustTarget.qty} {adjustTarget.unit}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Min stock</span><span>{adjustTarget.minStock} {adjustTarget.unit}</span></div>
                  <div className="flex justify-between mt-1"><span className="text-muted-foreground">Max stock</span><span>{adjustTarget.maxStock} {adjustTarget.unit}</span></div>
                </div>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">New quantity ({adjustTarget.unit}) *</span>
                  <input value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">Reason / note</span>
                  <input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder="e.g. Received PO-3392" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                </label>
                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" className="flex-1" onClick={() => setAdjustTarget(null)}>Cancel</Button>
                  <Button className="flex-1" onClick={saveAdjust} disabled={!adjustQty.trim()}>Save</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
