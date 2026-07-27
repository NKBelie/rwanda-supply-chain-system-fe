"use client";
import { useMemo, useState } from "react";
import { Download, Eye, MapPin, Plus, Search, ShoppingCart, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { buyerOrders, ORDER_STATUSES, paymentColor, statusColor, type BuyerOrder, type OrderStatus } from "./data";

const TABS = ["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

export function MyOrdersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const [orders, setOrders] = useState<BuyerOrder[]>(buyerOrders);
  const [viewOrder, setViewOrder] = useState<BuyerOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<BuyerOrder | null>(null);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return orders.filter((o) => {
      const matchTab = tab === "All" || o.status === tab;
      const matchSearch = !term || [o.product, o.supplier].some((v) => v.toLowerCase().includes(term));
      return matchTab && matchSearch;
    });
  }, [search, tab, orders]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length };
    ORDER_STATUSES.forEach((s) => { c[s] = orders.filter((o) => o.status === s).length; });
    return c;
  }, [orders]);

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "Cancelled" as OrderStatus } : o));
    setCancelTarget(null);
    setViewOrder(null);
  };

  const totalSpend = useMemo(() =>
    orders.filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + Number(o.amount.replace(/[^0-9]/g, "")), 0),
  [orders]);

  return (
    <>
      <PageHeader
        title="My Orders"
        description="Track, manage and review all your purchase orders."
        crumbs={[{ label: "Buyer", href: "/buyer/dashboard" }, { label: "My Orders" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setNewOrderOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> New Order
            </Button>
          </div>
        }
      />
      <PageBody>
        {/* KPI row */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Orders", value: orders.length, sub: "All time" },
            { label: "Active", value: orders.filter((o) => ["Pending","Confirmed","Processing","Shipped"].includes(o.status)).length, sub: "In progress" },
            { label: "Delivered", value: counts["Delivered"] ?? 0, sub: "Completed" },
            { label: "Total Spend", value: `RWF ${(totalSpend / 1_000_000).toFixed(1)}M`, sub: "Excl. cancelled" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                tab === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-surface"
              )}
            >
              {t} <span className="ml-1 opacity-70">{counts[t] ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, supplier…"
            className="h-10 w-full max-w-sm rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {search && <button onClick={() => setSearch("")} className="absolute left-[calc(50%-1rem)] top-1/2 -translate-y-1/2 text-muted-foreground"><X className="h-4 w-4" /></button>}
        </div>

        {/* Orders table */}
        <Card className="border-border/80 bg-background shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Supplier</th>
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
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                      No orders match your search.
                    </td>
                  </tr>
                ) : filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{order.date}</td>
                    <td className="px-4 py-3">{order.product}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.supplier}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3 font-medium">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColor(order.status))}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", paymentColor(order.paymentStatus))}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{order.expectedDelivery}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface"
                        >
                          <Eye className="h-3 w-3 inline mr-1" />View
                        </button>
                        {(order.status === "Shipped" || order.status === "Processing") && (
                          <a href="/buyer/tracking" className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface">
                            <MapPin className="h-3 w-3 inline mr-1" />Track
                          </a>
                        )}
                        {order.status === "Pending" && (
                          <button
                            onClick={() => setCancelTarget(order)}
                            className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageBody>

      {/* Order detail modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setViewOrder(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{viewOrder.product}</h2>
                <p className="text-sm text-muted-foreground">{viewOrder.supplier} · {viewOrder.supplierLocation}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between rounded-xl border border-border bg-surface p-3">
                <span className="text-muted-foreground">Status</span>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", statusColor(viewOrder.status))}>{viewOrder.status}</span>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Order date</span><span>{viewOrder.date}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Expected delivery</span><span>{viewOrder.expectedDelivery}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tracking ref</span><span className="font-medium">{viewOrder.trackingRef}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", paymentColor(viewOrder.paymentStatus))}>{viewOrder.paymentStatus}</span>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Order lines</p>
                {viewOrder.lines.map((line, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                    <span>{line.product} × {line.qty}</span>
                    <span className="font-medium">{line.lineTotal}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{viewOrder.amount}</span>
                </div>
              </div>
              {viewOrder.notes && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  <span className="font-semibold">Note:</span> {viewOrder.notes}
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-2">
              {viewOrder.status === "Pending" && (
                <Button variant="outline" className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => setCancelTarget(viewOrder)}>
                  Cancel Order
                </Button>
              )}
              {(viewOrder.status === "Shipped" || viewOrder.status === "Processing") && (
                <a href="/buyer/tracking" className="flex-1">
                  <Button className="w-full"><MapPin className="mr-1.5 h-4 w-4" />Track Shipment</Button>
                </a>
              )}
              <Button variant={viewOrder.status === "Pending" ? "primary" : "outline"} className="flex-1" onClick={() => setViewOrder(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setCancelTarget(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground">Cancel Order?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to cancel your order for <span className="font-medium text-foreground">{cancelTarget.product}</span> from {cancelTarget.supplier}? This cannot be undone.
            </p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setCancelTarget(null)}>Keep Order</Button>
              <Button variant="outline" className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => cancelOrder(cancelTarget.id)}>
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New order modal — redirects to marketplace */}
      {newOrderOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setNewOrderOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-pop text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl mb-3 flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-primary/40" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Start a new order</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse the marketplace to discover products and place orders from verified suppliers.</p>
            <div className="mt-5 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setNewOrderOpen(false)}>Close</Button>
              <a href="/buyer/marketplace" className="flex-1">
                <Button className="w-full">Browse Marketplace</Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
