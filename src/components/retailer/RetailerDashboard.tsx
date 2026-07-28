"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, Store, TrendingUp, AlertTriangle, ShoppingCart, 
  Users, CircleDollarSign, Boxes, Plus, RefreshCw, BarChart3,
  TrendingDown, CheckCircle2
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common/ui";
import { productService, orderService, inventoryService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, InventoryItem, Order } from "@/lib/storage";

export default function RetailerDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const retailerId = session?.claims.sub ?? "";

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!retailerId) return;
    // Get retailer's inventory
    const inv = inventoryService.getAll(); // In reality, would filter by retailer
    setInventory(inv.slice(0, 10)); // Mock data
    
    // Get orders (as a buyer in the system)
    const allOrders = orderService.getAll();
    setOrders(allOrders.filter(o => o.buyerId === retailerId || Math.random() > 0.7)); // Mock
    
    // Get available products for ordering
    setProducts(productService.getAll());
  }, [retailerId]);

  // Calculate KPIs
  const todaySales = 812000; // Mock
  const lowStockCount = inventory.filter(i => i.status === "Low Stock" || i.quantity < 10).length;
  const activeSuppliers = new Set(orders.map(o => o.farmerId)).size;
  const refundsCount = 2; // Mock

  // Sales by category (mock data)
  const salesByCategory = [
    { category: "Grains", amount: 320000, percentage: 39 },
    { category: "Produce", amount: 210000, percentage: 26 },
    { category: "Dairy", amount: 180000, percentage: 22 },
    { category: "Meat", amount: 102000, percentage: 13 },
  ];

  // Low stock items
  const lowStockItems = inventory.filter(i => i.status === "Low Stock" || i.quantity < 10).slice(0, 5);

  // Recent sales (mock)
  const recentSales = [
    { id: "SALE-001", product: "Maize Flour 5kg", quantity: 42, amount: 126000, time: "10m ago" },
    { id: "SALE-002", product: "Rice 25kg", quantity: 18, amount: 504000, time: "25m ago" },
    { id: "SALE-003", product: "Cooking Oil 1L", quantity: 35, amount: 87500, time: "45m ago" },
  ];

  const comparisonLastMonth = 9; // percentage

  return (
    <>
      <PageHeader
        title={`Store Performance — ${session?.claims.name?.split(" ")[0] ?? "Manager"}`}
        description="Real-time sales, inventory, and reorder management."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/retailer/orders")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <ShoppingCart className="h-4 w-4" /> Create Order
            </button>
            <button 
              onClick={() => router.push("/retailer/sales")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
            >
              <CircleDollarSign className="h-4 w-4" /> Record Sale
            </button>
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Today's Sales</p>
              <p className="text-2xl font-semibold text-emerald-600">RWF {(todaySales / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-semibold text-amber-600">{lowStockCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Suppliers</p>
              <p className="text-2xl font-semibold text-foreground">{activeSuppliers}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Refunds</p>
              <p className="text-2xl font-semibold text-foreground">{refundsCount}</p>
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Sales by Category</h3>
              <p className="text-sm text-muted-foreground">Today's revenue breakdown</p>
            </div>
            <button 
              onClick={() => router.push("/retailer/analytics")}
              className="text-sm font-medium text-primary hover:underline"
            >
              View Analytics
            </button>
          </div>
          <div className="space-y-3">
            {salesByCategory.map((cat) => (
              <div key={cat.category} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{cat.category}</span>
                  <span className="text-muted-foreground">RWF {(cat.amount / 1000).toFixed(0)}K ({cat.percentage}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div 
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert + Recent Sales */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Low Stock Items */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-5">
            <div className="mb-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Reorder Soon
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  {lowStockCount} items running low on stock
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              {lowStockItems.length === 0 ? (
                <li className="text-sm text-amber-700 dark:text-amber-400">All items well stocked</li>
              ) : (
                lowStockItems.map((item) => {
                  const product = productService.getById(item.productId);
                  return (
                    <li 
                      key={item.id} 
                      className="flex items-center justify-between rounded-lg border border-amber-300 bg-white dark:bg-amber-950/30 p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-foreground">{product?.name ?? "Product"}</p>
                        <p className="text-xs text-muted-foreground">{item.location ?? "Store"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-700 dark:text-amber-400">{item.quantity} left</p>
                        <button 
                          onClick={() => router.push("/retailer/orders")}
                          className="text-xs text-primary hover:underline"
                        >
                          Reorder
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Recent Sales */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Recent Sales</h3>
                <p className="text-xs text-muted-foreground">Latest transactions</p>
              </div>
              <button 
                onClick={() => router.push("/retailer/sales")}
                className="text-xs font-medium text-primary hover:underline"
              >
                View all
              </button>
            </div>
            <ul className="space-y-3">
              {recentSales.map((sale) => (
                <li 
                  key={sale.id} 
                  className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{sale.product}</p>
                    <p className="text-xs text-muted-foreground">{sale.quantity} units · {sale.time}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">+RWF {(sale.amount / 1000).toFixed(0)}K</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => router.push("/retailer/sales")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <CircleDollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Record Sale</p>
              <p className="text-xs text-muted-foreground">Add transaction</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/retailer/orders")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-blue-500/10 p-3">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Reorder Stock</p>
              <p className="text-xs text-muted-foreground">Place new order</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/retailer/inventory")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Boxes className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Manage Inventory</p>
              <p className="text-xs text-muted-foreground">View stock levels</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/retailer/analytics")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-amber-500/10 p-3">
              <BarChart3 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">View Analytics</p>
              <p className="text-xs text-muted-foreground">Sales reports</p>
            </div>
          </button>
        </div>

        {/* Orders Overview */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Purchase Orders</h3>
              <p className="text-sm text-muted-foreground">Orders from suppliers</p>
            </div>
            <button 
              onClick={() => router.push("/retailer/orders")}
              className="text-sm font-medium text-primary hover:underline"
            >
              View all orders
            </button>
          </div>
          
          {orders.length === 0 ? (
            <EmptyState 
              title="No orders yet" 
              description="Purchase orders from suppliers will appear here."
              action={
                <button 
                  onClick={() => router.push("/retailer/orders")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  <Plus className="h-4 w-4" /> Create Order
                </button>
              }
            />
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order) => {
                const product = productService.getById(order.productId);
                return (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">{product?.name ?? "Product"}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.quantity} units · RWF {order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
