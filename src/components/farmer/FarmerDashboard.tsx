"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Boxes, ShoppingCart, TrendingUp, TrendingDown, Warehouse, Truck, AlertTriangle, Plus } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { KpiCard, StatusBadge, EmptyState } from "@/components/common/ui";
import { productService, orderService, transportService, batchService, storageRequestService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, Order, TransportRequest } from "@/lib/storage";
import MarketPriceWidget from "./MarketPriceWidget";

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

  // Additional statistics
  const completedOrders = orders.filter(o => o.status === "Completed").length;
  const pendingOrders = orders.filter(o => o.status === "Request").length;
  const inProgressOrders = orders.filter(o => o.status === "Processing" || o.status === "Accepted").length;
  
  // Revenue by period
  const thisMonthRevenue = orders
    .filter(o => o.status === "Completed" && new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, o) => s + o.totalPrice, 0);
  
  const lastMonthRevenue = orders
    .filter(o => {
      const orderDate = new Date(o.createdAt);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return o.status === "Completed" && orderDate.getMonth() === lastMonth.getMonth();
    })
    .reduce((s, o) => s + o.totalPrice, 0);
  
  const revenueChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

  // Top selling products
  const productSales = products.map(p => ({
    ...p,
    totalOrders: orders.filter(o => o.productId === p.id).length,
    totalRevenue: orders.filter(o => o.productId === p.id && o.status === "Completed").reduce((s, o) => s + o.totalPrice, 0)
  })).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 3);

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
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-semibold text-foreground">{products.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-semibold text-emerald-600">{activeOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-semibold text-foreground">RWF {(revenue / 1000).toFixed(1)}K</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Storage Batches</p>
              <p className="text-2xl font-semibold text-foreground">{batches.length}</p>
            </div>
          </div>
        </div>

        {/* Market Price Trends - Enhanced Widget */}
        <div className="mt-6">
          <MarketPriceWidget />
        </div>

        {/* Revenue Statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="mt-1 text-2xl font-bold text-foreground">RWF {(thisMonthRevenue / 1000).toFixed(1)}K</p>
              <p className="mt-1 text-xs text-muted-foreground">{completedOrders} orders completed</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Last Month</p>
              <p className="mt-1 text-2xl font-bold text-muted-foreground">RWF {(lastMonthRevenue / 1000).toFixed(1)}K</p>
              <p className="mt-1 text-xs text-muted-foreground">Historical data</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                RWF {completedOrders > 0 ? (thisMonthRevenue / completedOrders).toFixed(0) : "0"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Per completed order</p>
            </div>
          </div>

        {/* Top Performing Products */}
        {productSales.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Top Selling Products</h3>
                <p className="text-sm text-muted-foreground">Your best performers this period</p>
              </div>
            </div>
            <div className="space-y-3">
              {productSales.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4 rounded-lg border border-border bg-surface/50 p-4 transition-all hover:bg-surface">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-2xl font-bold text-primary">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category} · {product.quantity} {product.unit} in stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">RWF {(product.totalRevenue / 1000).toFixed(1)}K</p>
                    <p className="text-xs text-muted-foreground">{product.totalOrders} orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Status Overview */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Order Status Overview</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Completed</p>
                  <p className="mt-1 text-3xl font-bold text-green-800 dark:text-green-300">{completedOrders}</p>
                </div>
                <div className="rounded-full bg-green-200 dark:bg-green-900/50 p-3">
                  <TrendingUp className="h-6 w-6 text-green-700 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">In Progress</p>
                  <p className="mt-1 text-3xl font-bold text-blue-800 dark:text-blue-300">{inProgressOrders}</p>
                </div>
                <div className="rounded-full bg-blue-200 dark:bg-blue-900/50 p-3">
                  <Package className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Pending</p>
                  <p className="mt-1 text-3xl font-bold text-amber-800 dark:text-amber-300">{pendingOrders}</p>
                </div>
                <div className="rounded-full bg-amber-200 dark:bg-amber-900/50 p-3">
                  <AlertTriangle className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-4">
            <div className="rounded-lg bg-orange-500/10 p-3">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transport Pending</p>
              <p className="text-2xl font-bold text-foreground">{pendingTransport}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-4">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Boxes className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Stock</p>
              <p className="text-2xl font-bold text-foreground">{totalStock}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border bg-background p-4">
            <div className={`rounded-lg p-3 ${lowStock > 0 ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
              <AlertTriangle className={`h-6 w-6 ${lowStock > 0 ? "text-red-600" : "text-emerald-600"}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-foreground">{lowStock}</p>
            </div>
          </div>
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
