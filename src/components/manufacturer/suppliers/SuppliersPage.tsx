"use client";
import { useMemo, useState } from "react";
import { Building2, CheckCircle2, Clock, Mail, MapPin, Phone, Plus, Search, Star, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { statusColor } from "../shared/data";

type SupplierStatus = "Active" | "Pending" | "Suspended" | "Under Review";

type Supplier = {
  id: string; name: string; category: string; location: string;
  contact: string; phone: string; email: string;
  status: SupplierStatus; rating: number; onTimeRate: number;
  activeOrders: number; totalOrders: number; lastOrder: string;
  materials: string[];
};

const suppliers: Supplier[] = [
  { id: "SUP-001", name: "Musanze Cooperative", category: "Raw Materials", location: "Musanze", contact: "Jean Habimana", phone: "+250 782 111 001", email: "musanze@coop.rw", status: "Active", rating: 4.8, onTimeRate: 94, activeOrders: 3, totalOrders: 47, lastOrder: "2026-07-22", materials: ["Coffee Beans", "Arabica Green"] },
  { id: "SUP-002", name: "Kigali Grain Hub", category: "Grains", location: "Kigali", contact: "Alice Uwera", phone: "+250 788 222 002", email: "grain@kgh.rw", status: "Active", rating: 4.6, onTimeRate: 91, activeOrders: 2, totalOrders: 33, lastOrder: "2026-07-21", materials: ["Maize", "Rice", "Sorghum"] },
  { id: "SUP-003", name: "AgriChemicals Ltd", category: "Packaging", location: "Rubavu", contact: "Paul Nzeyimana", phone: "+250 783 333 003", email: "pack@agri.rw", status: "Active", rating: 4.3, onTimeRate: 88, activeOrders: 1, totalOrders: 21, lastOrder: "2026-07-18", materials: ["Packaging Film", "Labels", "Bottles"] },
  { id: "SUP-004", name: "Nyagatare Farms", category: "Raw Materials", location: "Nyagatare", contact: "Marie Mukamana", phone: "+250 786 444 004", email: "farm@nyagatare.rw", status: "Pending", rating: 4.1, onTimeRate: 82, activeOrders: 0, totalOrders: 8, lastOrder: "2026-06-30", materials: ["Tomatoes", "Soybeans"] },
  { id: "SUP-005", name: "Rwanda Chemicals", category: "Food Grade Chemicals", location: "Kigali", contact: "Eric Habimana", phone: "+250 784 555 005", email: "chem@rwandachem.rw", status: "Active", rating: 4.5, onTimeRate: 96, activeOrders: 2, totalOrders: 29, lastOrder: "2026-07-20", materials: ["Citric Acid", "Preservatives", "Enzymes"] },
  { id: "SUP-006", name: "East Africa Oils", category: "Oils & Fats", location: "Huye", contact: "Grace Ingabire", phone: "+250 787 666 006", email: "oils@eao.rw", status: "Under Review", rating: 3.9, onTimeRate: 77, activeOrders: 0, totalOrders: 14, lastOrder: "2026-07-05", materials: ["Palm Oil", "Sunflower Oil"] },
];

const TABS = ["All", "Active", "Pending", "Under Review", "Suspended"] as const;

export function SuppliersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);
  const [supplierList, setSupplierList] = useState(suppliers);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return supplierList.filter((s) => {
      const matchTab = tab === "All" || s.status === tab;
      const matchSearch = !term || [s.id, s.name, s.category, s.location].some((v) => v.toLowerCase().includes(term));
      return matchTab && matchSearch;
    });
  }, [supplierList, tab, search]);

  const addSupplier = () => {
    if (!newName.trim()) return;
    setSupplierList((prev) => [{
      id: `SUP-00${prev.length + 1}`, name: newName.trim(), category: newCategory || "General",
      location: newLocation || "Rwanda", contact: "TBD", phone: "—", email: "—",
      status: "Pending", rating: 0, onTimeRate: 0, activeOrders: 0, totalOrders: 0,
      lastOrder: "—", materials: [],
    }, ...prev]);
    setAddSuccess(true);
    setTimeout(() => { setAddOpen(false); setAddSuccess(false); setNewName(""); setNewCategory(""); setNewLocation(""); }, 1400);
  };

  return (
    <>
      <PageHeader
        title="Suppliers"
        description="Manage raw material suppliers, track performance and onboard new partners."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Suppliers" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Export</Button>
            <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="mr-1.5 h-4 w-4" /> New Supplier</Button>
          </div>
        }
      />
      <PageBody>
        {/* KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Suppliers", value: supplierList.length },
            { label: "Active", value: supplierList.filter((s) => s.status === "Active").length },
            { label: "Avg. On-Time Rate", value: `${Math.round(supplierList.filter((s) => s.onTimeRate > 0).reduce((a, s) => a + s.onTimeRate, 0) / supplierList.filter((s) => s.onTimeRate > 0).length)}%` },
            { label: "Pending Approval", value: supplierList.filter((s) => s.status === "Pending" || s.status === "Under Review").length },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-background p-4 shadow-sm text-center">
              <p className="text-2xl font-semibold text-foreground">{k.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + search */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface")}>
                {t}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers…" className="h-9 w-56 rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-3 rounded-2xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">No suppliers found.</div>
          ) : filtered.map((s) => (
            <Card key={s.id} className="border-border/80 bg-background shadow-sm hover:shadow-elevated transition-shadow">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground leading-tight">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.category}</p>
                    </div>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", statusColor(s.status))}>{s.status}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {s.location}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-surface p-2">
                    <p className="text-sm font-semibold text-foreground">{s.rating > 0 ? s.rating : "—"}</p>
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                  </div>
                  <div className="rounded-lg bg-surface p-2">
                    <p className="text-sm font-semibold text-foreground">{s.onTimeRate > 0 ? `${s.onTimeRate}%` : "—"}</p>
                    <p className="text-[10px] text-muted-foreground">On-Time</p>
                  </div>
                  <div className="rounded-lg bg-surface p-2">
                    <p className="text-sm font-semibold text-foreground">{s.totalOrders}</p>
                    <p className="text-[10px] text-muted-foreground">Orders</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.materials.slice(0, 3).map((m) => (
                    <span key={m} className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">{m}</span>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={() => setViewSupplier(s)}>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageBody>

      {/* Supplier detail modal */}
      {viewSupplier && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setViewSupplier(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{viewSupplier.name}</h2>
                <p className="text-sm text-muted-foreground">{viewSupplier.id} · {viewSupplier.category}</p>
              </div>
              <button onClick={() => setViewSupplier(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MapPin, label: "Location", value: viewSupplier.location },
                  { icon: Building2, label: "Contact", value: viewSupplier.contact },
                  { icon: Phone, label: "Phone", value: viewSupplier.phone },
                  { icon: Mail, label: "Email", value: viewSupplier.email },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-surface p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Icon className="h-3.5 w-3.5" />{label}</div>
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-border bg-surface p-3">
                  <div className="flex items-center justify-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="text-lg font-semibold">{viewSupplier.rating || "—"}</span></div>
                  <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                  <div className="flex items-center justify-center gap-1"><Clock className="h-4 w-4 text-primary" /><span className="text-lg font-semibold">{viewSupplier.onTimeRate > 0 ? `${viewSupplier.onTimeRate}%` : "—"}</span></div>
                  <p className="text-xs text-muted-foreground mt-0.5">On-Time</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-3">
                  <div className="flex items-center justify-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="text-lg font-semibold">{viewSupplier.totalOrders}</span></div>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Orders</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs text-muted-foreground mb-2">Materials supplied</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewSupplier.materials.length > 0 ? viewSupplier.materials.map((m) => (
                    <span key={m} className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-foreground">{m}</span>
                  )) : <span className="text-xs text-muted-foreground">Not specified</span>}
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="outline" className="flex-1">Create PO</Button>
              <Button className="flex-1">Send Message</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add supplier modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setAddOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Add New Supplier</h2>
              <button onClick={() => setAddOpen(false)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            {addSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">✓ Supplier added for review!</div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Supplier name *", val: newName, set: setNewName, ph: "e.g. Ruzizi Farms Ltd" },
                  { label: "Category", val: newCategory, set: setNewCategory, ph: "e.g. Raw Materials" },
                  { label: "Location", val: newLocation, set: setNewLocation, ph: "e.g. Kigali" },
                ].map(({ label, val, set, ph }) => (
                  <label key={label} className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
                    <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                ))}
                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={addSupplier} disabled={!newName.trim()}>Add Supplier</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
