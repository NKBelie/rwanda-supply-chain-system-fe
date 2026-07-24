"use client";
import { useState } from "react";
import { AlertTriangle, Package, Warehouse, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WhStatus = "Operational" | "Near Capacity" | "Full" | "Maintenance";

type Warehouse = {
  id: string; name: string; location: string; type: string;
  capacity: number; used: number; unit: string; status: WhStatus;
  zones: { name: string; used: number; total: number }[];
  temperature?: string; manager: string;
};

const warehouses: Warehouse[] = [
  {
    id: "WH-01", name: "Main Production Store", location: "Kigali Industrial Zone", type: "General + Cold",
    capacity: 10000, used: 7400, unit: "kg", status: "Operational",
    zones: [{ name: "Bay A — Raw Materials", used: 2840, total: 4000 }, { name: "Bay B — Grains", used: 2200, total: 3000 }, { name: "Cold Zone", used: 2360, total: 3000 }],
    temperature: "2–8°C (cold zone)", manager: "Jean Uwimana",
  },
  {
    id: "WH-02", name: "Finished Goods Store", location: "Remera, Kigali", type: "Dry Storage",
    capacity: 8000, used: 7200, unit: "packs/bags", status: "Near Capacity",
    zones: [{ name: "Coffee Products", used: 1840, total: 2500 }, { name: "Flour Products", used: 3200, total: 3500 }, { name: "Other FGs", used: 2160, total: 2000 }],
    manager: "Alice Ingabire",
  },
  {
    id: "WH-03", name: "Chemicals & Packaging", location: "Kigali CBD", type: "Secure Storage",
    capacity: 2000, used: 380, unit: "units", status: "Operational",
    zones: [{ name: "Chemical Drums", used: 120, total: 800 }, { name: "Packaging Materials", used: 260, total: 1200 }],
    manager: "Paul Nkurunziza",
  },
];

const statusStyle: Record<WhStatus, string> = {
  "Operational": "bg-emerald-500/10 text-emerald-700",
  "Near Capacity": "bg-amber-500/10 text-amber-700",
  "Full": "bg-rose-500/10 text-rose-700",
  "Maintenance": "bg-slate-500/10 text-slate-600",
};

function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min((used / total) * 100, 100);
  const color = pct > 90 ? "bg-rose-500" : pct > 75 ? "bg-amber-500" : "bg-primary";
  return (
    <div className="h-2 w-full rounded-full bg-border">
      <div className={cn("h-2 rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function WarehousesPage() {
  const [selected, setSelected] = useState<Warehouse | null>(null);

  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
  const totalUsed = warehouses.reduce((s, w) => s + w.used, 0);

  return (
    <>
      <PageHeader
        title="Warehouses"
        description="Monitor storage capacity, zone allocation and stock distribution."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Warehouses" }]}
      />
      <PageBody>
        {/* Alert */}
        {warehouses.some((w) => w.status === "Near Capacity" || w.status === "Full") && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">WH-02</span> is near capacity. Consider dispatching finished goods or booking additional storage.
            </p>
          </div>
        )}

        {/* KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Warehouses", value: warehouses.length },
            { label: "Overall Utilization", value: `${Math.round((totalUsed / totalCapacity) * 100)}%` },
            { label: "Operational", value: warehouses.filter((w) => w.status === "Operational").length },
            { label: "Near/At Capacity", value: warehouses.filter((w) => ["Near Capacity", "Full"].includes(w.status)).length },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-background p-4 shadow-sm text-center">
              <p className="text-2xl font-semibold text-foreground">{k.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Warehouse cards */}
        <div className="grid gap-4 lg:grid-cols-3">
          {warehouses.map((wh) => (
            <Card key={wh.id} className="border-border/80 bg-background shadow-sm hover:shadow-elevated transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Warehouse className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{wh.id}</p>
                      <p className="text-xs text-muted-foreground">{wh.name}</p>
                    </div>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle[wh.status])}>{wh.status}</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>📍 {wh.location}</p>
                  <p>Type: {wh.type}</p>
                  <p>Manager: {wh.manager}</p>
                  {wh.temperature && <p>Temp: {wh.temperature}</p>}
                </div>
                <div>
                  <CapacityBar used={wh.used} total={wh.capacity} />
                  <p className="mt-1 text-xs text-muted-foreground">{wh.used.toLocaleString()} / {wh.capacity.toLocaleString()} {wh.unit} used ({Math.round((wh.used / wh.capacity) * 100)}%)</p>
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => setSelected(wh)}>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageBody>

      {/* Warehouse detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div><h2 className="text-lg font-semibold">{selected.id} — {selected.name}</h2><p className="text-sm text-muted-foreground">{selected.location}</p></div>
              <button onClick={() => setSelected(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-surface p-3">
                <CapacityBar used={selected.used} total={selected.capacity} />
                <p className="text-xs text-muted-foreground mt-1.5">Overall: {selected.used.toLocaleString()} / {selected.capacity.toLocaleString()} {selected.unit}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Zone breakdown</p>
                {selected.zones.map((z) => (
                  <div key={z.name} className="rounded-xl border border-border bg-surface p-3">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-foreground">{z.name}</span>
                      <span className="text-muted-foreground text-xs">{z.used.toLocaleString()} / {z.total.toLocaleString()}</span>
                    </div>
                    <CapacityBar used={z.used} total={z.total} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
