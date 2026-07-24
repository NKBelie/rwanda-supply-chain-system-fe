"use client";
import { useMemo, useState } from "react";
import { Download, Eye, Plus, Search, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { statusColor } from "../shared/data";

type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Dispatched" | "Delivered" | "Cancelled";

type ManufOrder = {
  id: string; customer: string; product: string; sku: string;
  qty: string; unit: string; amount: string; status: OrderStatus;
  orderDate: string; deliveryDate: string; paymentStatus: "Paid" | "Unpaid" | "Partial";
};

const orders: ManufOrder[] = [
  { id: "ORD-5501", customer: "Kigali Retail Ltd", product: "Roasted Arabica Coffee 500g", sku: "FG-CF-001", qty: "500", unit: "packs", amount: "RWF 2,100,000", status: "Dispatched", orderDate: "2026-07-20", deliveryDate: "2026-07-24", paymentStatus: "Partial" },
  { id: "ORD-5500", customer: "East Retail Chain", product: "Maize Flour 1kg bags", sku: "FG-MF-001", qty: "1,200", unit: "bags", amount: "RWF 2,160,000", status: "Processing", orderDate: "2026-07-21", deliveryDate: "2026-07-26", paymentStatus: "Unpaid" },
  { id: "ORD-5499", customer: "Musanze Union", product: "Roasted Arabica Coffee 500g", sku: "FG-CF-001", qty: "300", unit: "packs", amount: "RWF 1,260,000", status: "Delivered", orderDate: "2026-07-15", deliveryDate: "2026-07-18", paymentStatus: "Paid" },
  { id: "ORD-5498", customer: "AgriFinance Coop", product: "Tomato Paste 400g tins", sku: "FG-TM-001", qty: "800", unit: "tins", amount: "RWF 1,440,000", status: "Confirmed", orderDate: "2026-07-22", deliveryDate: "2026-07-28", paymentStatus: "Unpaid" },
  { id: "ORD-5497", customer: "Rwanda Foods Ltd", product: "Maize Flour 1kg bags", sku: "FG-MF-001", qty: "2,000", unit: "bags", amount: "RWF 3,600,000", status: "Pending", orderDate: "2026-07-23", deliveryDate: "2026-07-29", paymentStatus: "Unpaid" },
  { id: "ORD-5496", customer: "MINAGRI Stores", product: "Rice Bran Oil 1L", sku: "FG-RB-001", qty: "400", unit: "bottles", amount: "RWF 960,000", status: "Cancelled", orderDate: "2026-07-10", deliveryDate: "—", paymentStatus: "Unpaid" },
];

const TABS = ["All", "Pending", "Confirmed", "Processing", "Dispatched", "Delivered", "Cancelled"] as const;
const payColor = (s: string) => s === "Paid" ? "bg-emerald-500/10 text-emerald-700" : s === "Partial" ? "bg-amber-500/10 text-amber-700" : "bg-rose-500/10 text-rose-700";

export function OrdersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [search, setSearch] = useState("");
  const [orderList, setOrderList] = useState(orders);
  const [viewOrder, setViewOrder] = useState<ManufOrder | null>(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return orderList.filter((o) => {
      const matchTab = tab === "All" || o.status === tab;
      const matchSearch = !term || [o.id, o.customer, o.product, o.sku].some((v) => v.toLowerCase().includes(term));
      return matchTab && matchSearch;
    });
  }, [orderList, tab, search]);

  const totalRevenue = orderList.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + Number(o.amount.replace(/[^0-9]/g, "")), 0);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage outbound customer orders, track fulfillment and payment status."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Orders" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline"><Download className="mr-1.5 h-4 w-4" />Export</Button>
            <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />New Order</Button>
          </div>
        }
      />
      <PageBody>
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Orders", value: orderList.length },
            { label: "Active", value: orderList.filter((o) => ["Pending","Confirmed","Processing","Dispatched"].includes(o.status)).length },
            { label: "Delivered", value: orderList.filter((o) => o.status === "Delivered").length },
            { label: "Total Revenue", value: `RWF ${(totalRevenue / 1_000_000).toFixed(1)}M` },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface")}>{t}</button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders…" className="h-9 w-56 rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <Card className="border-border/80 bg-background shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Product</th>
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
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">No orders found.</td></tr>
                ) : filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary">{o.id}</td>
                    <td className="px-4 py-3 font-medium">{o.customer}</td>
                    <td className="px-4 py-3"><p className="text-foreground">{o.product}</p><p className="text-xs text-muted-foreground font-mono">{o.sku}</p></td>
                    <td className="px-4 py-3">{o.qty} {o.unit}</td>
                    <td className="px-4 py-3 font-medium">{o.amount}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColor(o.status))}>{o.status}</span></td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", payColor(o.paymentStatus))}>{o.paymentStatus}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.deliveryDate}</td>
                    <td className="px-4 py-3"><button onClick={() => setViewOrder(o)} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-surface flex items-center gap-1"><Eye className="h-3 w-3" />View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageBody>

      {viewOrder && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setViewOrder(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div><h2 className="text-lg font-semibold">{viewOrder.id}</h2><p className="text-sm text-muted-foreground">{viewOrder.customer}</p></div>
              <button onClick={() => setViewOrder(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[["Product", viewOrder.product], ["SKU", viewOrder.sku], ["Quantity", `${viewOrder.qty} ${viewOrder.unit}`], ["Amount", viewOrder.amount], ["Order Date", viewOrder.orderDate], ["Delivery Date", viewOrder.deliveryDate]].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-border bg-surface p-3">
                    <p className="text-xs text-muted-foreground">{l}</p>
                    <p className="font-medium mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-border bg-surface p-3 text-center">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusColor(viewOrder.status))}>{viewOrder.status}</span>
                  <p className="text-xs text-muted-foreground mt-1">Order Status</p>
                </div>
                <div className="flex-1 rounded-xl border border-border bg-surface p-3 text-center">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", payColor(viewOrder.paymentStatus))}>{viewOrder.paymentStatus}</span>
                  <p className="text-xs text-muted-foreground mt-1">Payment</p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setViewOrder(null)}>Close</Button>
              <Button>Update Status</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
