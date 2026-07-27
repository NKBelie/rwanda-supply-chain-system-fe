"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, TrendingUp, Users, Truck, ShoppingCart, Factory,
  Boxes, AlertCircle, CheckCircle2, Clock, BarChart3, DollarSign
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common/ui";
import { productService, orderService, inventoryService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, Order, InventoryItem } from "@/lib/storage";

export default function ManufacturerDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const manufacturerId = session?.claims.sub ?? "";

  const [rawMaterials, setRawMaterials] = useState<InventoryItem[]>([]);
  const [finishedGoods, setFinishedGoods] = useState<Product[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<Order[]>([]);
  const [salesOrders, setSalesOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!manufacturerId) return;
    
    // Get raw materials inventory (as buyer)
    const inv = inventoryService.getAll();
    setRawMaterials(inv.slice(0, 10)); // Mock: would filter by manufacturer
    
    // Get finished products (as seller)
    const allProducts = productService.getAll();
    setFinishedGoods(allProducts.filter(p => p.farmerId === manufacturerId || Math.random() > 0.7)); // Mock
    
    // Get purchase orders (buying raw materials)
    const allOrders = orderService.getAll();
    setPurchaseOrders(allOrders.filter(o => o.buyerId === manufacturerId));
    
    // Get sales orders (selling finished goods)
    setSalesOrders(allOrders.filter(o => o.farmerId === manufacturerId));
  }, [manufacturerId]);

  // Calculate KPIs
  const totalProduction = finishedGoods.length;
  const activeOrders = purchaseOrders.filter(o => o.status === "Processing" || o.status === "Accepted").length;
  const lowStockMaterials = rawMaterials.filter(i => i.status === "Low Stock" || i.quantity < 50).length;
  const pendingDeliveries = salesOrders.filter(o => o.status === "Transport").length;

  // Production capacity (mock)
  const productionCapacity = 85; // percentage
  const suppliersCount = new Set(purchaseOrders.map(o => o.farmerId)).size;

  return (
    <>
      <PageHeader
        title={`Manufacturing Operations — ${session?.claims.name?.split(" ")[0] ?? "Manager"}`}
        description="Manage production, procurement, inventory, and supplier relationships."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/manufacturer/procurement")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <ShoppingCart className="h-4 w-4" /> Procure Materials
            </button>
            <button 
              onClick={() => router.push("/manufacturer/production")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
            >
              <Factory className="h-4 w-4" /> Production Orders
            </button>
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Production Capacity</p>
              <p className="text-2xl font-semibold text-foreground">{productionCapacity}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Orders</p>
              <p className="text-2xl font-semibold text-emerald-600">{activeOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Alert</p>
              <p className="text-2xl font-semibold text-amber-600">{lowStockMaterials}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Suppliers</p>
              <p className="text-2xl font-semibold text-foreground">{suppliersCount}</p>
            </div>
          </div>
        </div>

        {/* Production Overview */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Raw Materials Inventory */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Raw Materials</h3>
                <p className="text-sm text-muted-foreground">Current inventory status</p>
              </div>
              <button 
                onClick={() => router.push("/manufacturer/inventory")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {rawMaterials.length === 0 ? (
              <EmptyState 
                title="No raw materials" 
                description="Inventory will appear here once materials are procured."
              />
            ) : (
              <div className="space-y-2">
                {rawMaterials.slice(0, 5).map((item) => {
                  const product = productService.getById(item.productId);
                  return (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3 text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product?.name ?? "Material"}</p>
                        <p className="text-xs text-muted-foreground">{item.location ?? "Warehouse"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{item.quantity} {product?.unit ?? "units"}</p>
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Finished Goods */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Finished Goods</h3>
                <p className="text-sm text-muted-foreground">Ready for distribution</p>
              </div>
              <button 
                onClick={() => router.push("/manufacturer/products")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {finishedGoods.length === 0 ? (
              <EmptyState 
                title="No finished goods" 
                description="Completed products will appear here."
              />
            ) : (
              <div className="space-y-2">
                {finishedGoods.slice(0, 5).map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category} · {product.quality}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{product.quantity} {product.unit}</p>
                      <StatusBadge status={product.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Purchase & Sales Orders */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Purchase Orders (Procurement) */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Purchase Orders</h3>
                <p className="text-sm text-muted-foreground">Raw material procurement</p>
              </div>
              <button 
                onClick={() => router.push("/manufacturer/procurement")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {purchaseOrders.length === 0 ? (
              <EmptyState 
                title="No purchase orders" 
                description="Orders from suppliers will appear here."
                action={
                  <button 
                    onClick={() => router.push("/manufacturer/procurement")}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                  >
                    <ShoppingCart className="h-4 w-4" /> New Order
                  </button>
                }
              />
            ) : (
              <div className="space-y-2">
                {purchaseOrders.slice(0, 4).map((order) => {
                  const product = productService.getById(order.productId);
                  const supplier = userService.getUserName(order.farmerId);
                  return (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3 text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product?.name ?? "Material"}</p>
                        <p className="text-xs text-muted-foreground">
                          From {supplier} · {order.quantity} {product?.unit ?? "units"}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={order.status} />
                        <p className="mt-1 text-xs text-muted-foreground">
                          RWF {order.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sales Orders */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Sales Orders</h3>
                <p className="text-sm text-muted-foreground">Finished goods distribution</p>
              </div>
              <button 
                onClick={() => router.push("/manufacturer/orders")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {salesOrders.length === 0 ? (
              <EmptyState 
                title="No sales orders" 
                description="Customer orders will appear here."
              />
            ) : (
              <div className="space-y-2">
                {salesOrders.slice(0, 4).map((order) => {
                  const product = productService.getById(order.productId);
                  const customer = userService.getUserName(order.buyerId);
                  return (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3 text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product?.name ?? "Product"}</p>
                        <p className="text-xs text-muted-foreground">
                          To {customer} · {order.quantity} {product?.unit ?? "units"}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={order.status} />
                        <p className="mt-1 text-xs text-muted-foreground">
                          RWF {order.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => router.push("/manufacturer/procurement")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-blue-500/10 p-3">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Procurement</p>
              <p className="text-xs text-muted-foreground">Order materials</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/manufacturer/production")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <Factory className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Production</p>
              <p className="text-xs text-muted-foreground">Manage orders</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/manufacturer/inventory")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-purple-500/10 p-3">
              <Boxes className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Inventory</p>
              <p className="text-xs text-muted-foreground">Track stock</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/manufacturer/suppliers")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-amber-500/10 p-3">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Suppliers</p>
              <p className="text-xs text-muted-foreground">Manage relationships</p>
            </div>
          </button>
        </div>

        {/* Low Stock Warning */}
        {lowStockMaterials > 0 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              {lowStockMaterials} raw material{lowStockMaterials > 1 ? 's' : ''} running low - Consider reordering soon
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
