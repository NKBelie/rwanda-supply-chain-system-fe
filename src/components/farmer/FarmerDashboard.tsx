"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Boxes, ShoppingCart, TrendingUp, Warehouse, Truck, AlertTriangle, Plus } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { KpiCard, StatusBadge, EmptyState } from "@/components/common/ui";
import { productService, orderService, transportService, batchService, storageRequestService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, Order, TransportRequest } from "@/lib/storage";

export default function FarmerDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const farmerId = session?.claims.sub ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transport, setTransport] = useState<TransportRequest[]>([]);

  useEffect(() => {
    if (!farmerId) return;
    setProducts(productService.getByFarmer(farmerId));
    setOrders(orderService.getByFarmer(farmerId));
    setTransport(transportService.getByFarmer(farmerId));
  }, [farmerId]);

  const totalStock = products.reduce((s, p) => s + p.quantity, 0);
  const activeOrders = orders.filter(o => !["Completed", "Delivered"].includes(o.status)).length;
  const revenue = orders.filter(o => o.status === "Completed").reduce((s, o) => s + o.totalPrice, 0);
  const pendingTransport = transport.filter(t => t.status === "Pending").length;
  const lowStock = products.filter(p => p.quantity < 50).length;
  const batches = batchService.getByFarmer(farmerId);
  const storageReqs = storageRequestService.getByFarmer(farmerId);

  const recentProducts = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome, ${session?.claims.name?.split(" ")[0] ?? "Farmer"}`}
        description="Your farm activity at a glance."
        actions={
          <div className="flex gap-2">
            <button onClick={() => router.push("/farmer/products/add")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
              <Plus className="h-4 w-4" /> Add Product
            </button>
            <button onClick={() => router.push("/farmer/transport")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface">
              <Truck className="h-4 w-4" /> Request Transport
            </button>
          </div>
        }
      />
      <PageBody>
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total Products" value={products.length} sub={`${totalStock} units in stock`} icon={Package} />
          <KpiCard label="Active Orders" value={activeOrders} sub={`${orders.length} total orders`} icon={ShoppingCart} tone={activeOrders > 0 ? "success" : "default"} />
          <KpiCard label="Revenue (Completed)" value={`RWF ${revenue.toLocaleString()}`} icon={TrendingUp} tone="success" />
          <KpiCard label="Warehouse Batches" value={batches.length} sub={`${storageReqs.filter(r => r.status === "Pending").length} pending requests`} icon={Warehouse} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard label="Pending Transport" value={pendingTransport} sub={`${transport.length} total requests`} icon={Truck} tone={pendingTransport > 0 ? "warning" : "default"} />
          <KpiCard label="Available Stock" value={`${totalStock} units`} sub={`${products.filter(p => p.status === "Available").length} available products`} icon={Boxes} />
          <KpiCard label="Low Stock Alerts" value={lowStock} sub="Products below 50 units" icon={AlertTriangle} tone={lowStock > 0 ? "danger" : "default"} />
        </div>

        {/* Recent Products + Orders */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent Products</h2>
              <button onClick={() => router.push("/farmer/products")} className="text-xs text-primary hover:underline">View all</button>
            </div>
            {recentProducts.length === 0
              ? <EmptyState title="No products yet" description="Add your first product to get started." action={
                  <button onClick={() => router.push("/farmer/products/add")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                    <Plus className="h-4 w-4" /> Add Product
                  </button>
                } />
              : <ul className="divide-y divide-border">
                  {recentProducts.map(p => (
                    <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.category} · {p.quantity} {p.unit}</div>
                      </div>
                      <StatusBadge status={p.status} />
                    </li>
                  ))}
                </ul>
            }
          </div>

          <div className="rounded-xl border border-border bg-background p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent Orders</h2>
              <button onClick={() => router.push("/farmer/orders")} className="text-xs text-primary hover:underline">View all</button>
            </div>
            {recentOrders.length === 0
              ? <EmptyState title="No orders yet" description="Orders from buyers will appear here." />
              : <ul className="divide-y divide-border">
                  {recentOrders.map(o => (
                    <li key={o.id} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <div className="font-medium">{o.id}</div>
                        <div className="text-xs text-muted-foreground">Qty: {o.quantity} · RWF {o.totalPrice.toLocaleString()}</div>
                      </div>
                      <StatusBadge status={o.status} />
                    </li>
                  ))}
                </ul>
            }
          </div>
        </div>

        {/* Low stock warning */}
        {lowStock > 0 && (
          <div className="mt-4 rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-warning">
              <AlertTriangle className="h-4 w-4" /> {lowStock} product{lowStock > 1 ? "s" : ""} running low on stock
            </div>
            <ul className="mt-2 space-y-1">
              {products.filter(p => p.quantity < 50).map(p => (
                <li key={p.id} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.name}</span>
                  <span className="font-medium text-warning">{p.quantity} {p.unit} left</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PageBody>
    </>
  );
}
