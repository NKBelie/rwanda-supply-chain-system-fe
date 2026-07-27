"use client";
import { useMemo, useState } from "react";
import { Download, Eye, Plus, Search, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { statusColor } from "../shared/data";

type POStatus = "Draft" | "Pending" | "Confirmed" | "Delivered" | "Cancelled";

type PurchaseOrder = {
  id: string; supplier: string; material: string; qty: string; unit: string;
  amount: string; status: POStatus; issueDate: string; deliveryDate: string;
  paymentStatus: "Unpaid" | "Paid" | "Partial"; contact: string;
};

const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-3392", supplier: "Musanze Cooperative", material: "Arabica Coffee Beans", qty: "500", unit: "kg", amount: "RWF 1,750,000", status: "Confirmed", issueDate: "2026-07-20", deliveryDate: "2026-07-25", paymentStatus: "Partial", contact: "Jean Habimana" },
  { id: "PO-3391", supplier: "Kigali Grain Hub", material: "Maize (Dried)", qty: "2,000", unit: "kg", amount: "RWF 1,600,000", status: "Delivered", issueDate: "2026-07-15", deliveryDate: "2026-07-19", paymentStatus: "Paid", contact: "Alice Uwera" },
  { id: "PO-3390", supplier: "AgriChemicals Ltd", material: "Packaging Film (Food Grade)", qty: "50", unit: "rolls", amount: "RWF 320,000", status: "Pending", issueDate: "2026-07-22", deliveryDate: "2026-07-28", paymentStatus: "Unpaid", contact: "Paul Nzeyimana" },
  { id: "PO-3389", supplier: "Rwanda Chemicals", material: "Citric Acid", qty: "100", unit: "kg", amount: "RWF 480,000", status: "Confirmed", issueDate: "2026-07-21", deliveryDate: "2026-07-26", paymentStatus: "Unpaid", contact: "Eric Habimana" },
  { id: "PO-3388", supplier: "Nyagatare Farms", material: "Fresh Tomatoes", qty: "800", unit: "kg", amount: "RWF 640,000", status: "Draft", issueDate: "2026-07-23", deliveryDate: "2026-07-29", paymentStatus: "Unpaid", contact: "Marie Mukamana" },
  { id: "PO-3387", supplier: "East Africa Oils", material: "Palm Oil (Refined)", qty: "200", unit: "litres", amount: "RWF 380,000", status: "Cancelled", issueDate: "2026-07-10", deliveryDate: "—", paymentStatus: "Unpaid", contact: "Grace Ingabire" },
];

const TABS = ["All", "Draft", "Pending", "Confirmed", "Delivered", "Cancelled"] as const;
const payColor = (s: string) => s === "Paid" ? "bg-emerald-500/10 text-emerald-700" : s === "Partial" ? "bg-amber-500/10 text-amber-700" : "bg-rose-500/10 text-rose-700";

export function ProcurementPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(purchaseOrders);
  const [viewPO, setViewPO] = useState<PurchaseOrder | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return orders.filter((o) => {
      const matchTab = tab === "All" || o.status === tab;
      const matchSearch = !term || [o.supplier, o.material].some((v) => v.toLowerCase().includes(term));
      return matchTab && matchSearch;
    });
  }, [orders, tab, search]);

  const totalPending = orders.filter((o) => ["Draft","Pending","Confirmed"].includes(o.status)).reduce((s, o) => s + Number(o.amount.replace(/[^0-9]/g, "")), 0);

  const createPO = () => {
    if (!newSupplier.trim() || !newMaterial.trim()) return;
    setOrders((prev) => [{
      id: `PO-${3393 + prev.length}`, supplier: newSupplier.trim(), material: newMaterial.trim(),
      qty: newQty || "—", unit: "kg", amount: newAmount ? `RWF ${Number(newAmount).toLocaleString()}` : "TBD",
      status: "Draft", issueDate: new Date().toISOString().slice(0, 10), deliveryDate: "TBD",
      paymentStatus: "Unpaid", contact: "—",
    }, ...prev]);
    setCreateSuccess(true);
    setTimeout(() => { setCreateOpen(false); setCreateSuccess(false); setNewSupplier(""); setNewMaterial(""); setNewQty(""); setNewAmount(""); }, 1400);
  };

  return (
    <>
      <PageHeader
        title="Procurement"
        description="Manage purchase orders, track raw material deliveries and monitor supplier payments."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Procurement" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline"><Download className="mr-1.5 h-4 w-4" />Export</Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="mr-1.5 h-4 w-4" />Create PO</Button>
          </div>
        }
      />
      <PageBody>
        {/* KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total POs", value: orders.length },
            { label: "Open POs", value: orders.filter((o) => ["Pending","Confirmed"].includes(o.status)).length },
            { label: "Delivered", value: orders.filter((o) => o.status === "Delivered").length },
            { label: "Total Pending Value", value: `RWF ${(totalPending / 1_000_000).toFixed(1)}M` },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{k.value}</p>
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search POs…" className="h-9 w-56 rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <Card className="border-border/80 bg-background shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
                  <th className="px-4 py-3 text-left">Material</th>
                  <th className="px-4 py-3 text-left">Qty</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Delivery</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No purchase orders found.</td></tr>
                ) : filtered.map((po) => (
                  <tr key={po.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{po.issueDate}</td>
                    <td className="px-4 py-3 font-medium">{po.supplier}</td>
                    <td className="px-4 py-3 text-muted-foreground">{po.material}</td>
                    <td className="px-4 py-3">{po.qty} {po.unit}</td>
                    <td className="px-4 py-3 font-medium">{po.amount}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColor(po.status))}>{po.status}</span></td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", payColor(po.paymentStatus))}>{po.paymentStatus}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{po.deliveryDate}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setViewPO(po)} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-surface flex items-center gap-1">
                        <Eye className="h-3 w-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageBody>

      {/* PO detail */}
      {viewPO && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setViewPO(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div><h2 className="text-lg font-semibold">{viewPO.material}</h2><p className="text-sm text-muted-foreground">{viewPO.supplier}</p></div>
              <button onClick={() => setViewPO(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Material", viewPO.material], ["Quantity", `${viewPO.qty} ${viewPO.unit}`],
                  ["Amount", viewPO.amount], ["Contact", viewPO.contact],
                  ["Issue Date", viewPO.issueDate], ["Delivery Date", viewPO.deliveryDate],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-border bg-surface p-3">
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className="font-medium mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-border bg-surface p-3 text-center">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColor(viewPO.status))}>{viewPO.status}</span>
                  <p className="text-xs text-muted-foreground mt-1">Order Status</p>
                </div>
                <div className="flex-1 rounded-xl border border-border bg-surface p-3 text-center">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", payColor(viewPO.paymentStatus))}>{viewPO.paymentStatus}</span>
                  <p className="text-xs text-muted-foreground mt-1">Payment</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              {viewPO.status === "Draft" && <Button variant="outline" className="flex-1">Submit PO</Button>}
              {viewPO.paymentStatus !== "Paid" && viewPO.status === "Delivered" && <Button className="flex-1">Pay Now</Button>}
              <Button variant="outline" className="flex-1" onClick={() => setViewPO(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Create PO */}
      {createOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setCreateOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Purchase Order</h2>
              <button onClick={() => setCreateOpen(false)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            {createSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center text-sm font-medium text-emerald-700">✓ PO created as Draft!</div>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Supplier *", val: newSupplier, set: setNewSupplier, ph: "e.g. Musanze Cooperative" },
                  { label: "Material *", val: newMaterial, set: setNewMaterial, ph: "e.g. Coffee Beans" },
                  { label: "Quantity (kg)", val: newQty, set: setNewQty, ph: "e.g. 500" },
                  { label: "Amount (RWF)", val: newAmount, set: setNewAmount, ph: "e.g. 1750000" },
                ].map(({ label, val, set, ph }) => (
                  <label key={label} className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
                    <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                ))}
                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" className="flex-1" onClick={() => setCreateOpen(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={createPO} disabled={!newSupplier.trim() || !newMaterial.trim()}>Create PO</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
