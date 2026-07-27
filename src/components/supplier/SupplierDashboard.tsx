"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, TrendingUp, Users, ShoppingBag, FileText, 
  CheckCircle2, Clock, AlertCircle, DollarSign, Star,
  MessageSquare, Truck
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common/ui";
import { productService, orderService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, Order } from "@/lib/storage";

export default function SupplierDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const supplierId = session?.claims.sub ?? "";

  const [catalog, setCatalog] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]); // Mock RFQs

  useEffect(() => {
    if (!supplierId) return;
    
    // Get supplier's product catalog
    const allProducts = productService.getAll();
    setCatalog(allProducts.filter(p => p.farmerId === supplierId));
    
    // Get orders (as seller/supplier)
    const allOrders = orderService.getAll();
    setOrders(allOrders.filter(o => o.farmerId === supplierId));
    
    // Mock RFQs (Request for Quotations)
    setRfqs([
      { id: "RFQ-001", product: "Rice 25kg", quantity: 500, buyer: "Kigali Retail Co.", status: "Pending", date: "2026-07-24" },
      { id: "RFQ-002", product: "Maize Flour", quantity: 1000, buyer: "Gasabo Stores", status: "Quoted", date: "2026-07-23" },
      { id: "RFQ-003", product: "Cooking Oil", quantity: 200, buyer: "Rwanda Foods", status: "Accepted", date: "2026-07-22" },
    ]);
  }, [supplierId]);

  // Calculate KPIs
  const activeProducts = catalog.filter(p => p.status === "Available").length;
  const pendingOrders = orders.filter(o => o.status === "Request" || o.status === "Accepted").length;
  const completedOrders = orders.filter(o => o.status === "Completed" || o.status === "Delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const activeCustomers = new Set(orders.map(o => o.buyerId)).size;
  const pendingRfqs = rfqs.filter(r => r.status === "Pending").length;

  // Calculate rating (mock)
  const supplierRating = 4.7;
  const totalReviews = 156;

  return (
    <>
      <PageHeader
        title={`Supplier Portal — ${session?.claims.name?.split(" ")[0] ?? "Supplier"}`}
        description="Manage your product catalog, orders, RFQs, and customer relationships."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/supplier/products")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <Package className="h-4 w-4" /> Add Product
            </button>
            <button 
              onClick={() => router.push("/supplier/rfqs")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
            >
              <FileText className="h-4 w-4" /> View RFQs
            </button>
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Products</p>
              <p className="text-2xl font-semibold text-foreground">{activeProducts}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-semibold text-emerald-600">{pendingOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-semibold text-foreground">RWF {(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="text-2xl font-semibold text-foreground">{supplierRating} ⭐</p>
            </div>
          </div>
        </div>

        {/* RFQs & Orders Section */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Pending RFQs */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Request for Quotations</h3>
                <p className="text-sm text-muted-foreground">{pendingRfqs} pending quotes</p>
              </div>
              <button 
                onClick={() => router.push("/supplier/rfqs")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {rfqs.length === 0 ? (
              <EmptyState 
                title="No RFQs" 
                description="Quote requests will appear here."
              />
            ) : (
              <div className="space-y-2">
                {rfqs.slice(0, 4).map((rfq) => (
                  <div 
                    key={rfq.id} 
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-3 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{rfq.product}</p>
                      <p className="text-xs text-muted-foreground">
                        {rfq.buyer} · {rfq.quantity} units · {rfq.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        rfq.status === "Pending" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" :
                        rfq.status === "Quoted" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
                        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      }`}>
                        {rfq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
                <p className="text-sm text-muted-foreground">{pendingOrders} pending fulfillment</p>
              </div>
              <button 
                onClick={() => router.push("/supplier/orders")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {orders.length === 0 ? (
              <EmptyState 
                title="No orders yet" 
                description="Customer orders will appear here."
              />
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 4).map((order) => {
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
                          {customer} · {order.quantity} {product?.unit ?? "units"}
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

        {/* Product Catalog Preview */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Product Catalog</h3>
              <p className="text-sm text-muted-foreground">{catalog.length} products listed</p>
            </div>
            <button 
              onClick={() => router.push("/supplier/products")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Manage Catalog
            </button>
          </div>
          
          {catalog.length === 0 ? (
            <EmptyState 
              title="No products in catalog" 
              description="Add products to start selling."
              action={
                <button 
                  onClick={() => router.push("/supplier/products")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  <Package className="h-4 w-4" /> Add Product
                </button>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {catalog.slice(0, 4).map((product) => (
                <div 
                  key={product.id} 
                  className="rounded-lg border border-border bg-surface/50 p-3"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <StatusBadge status={product.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">
                      RWF {product.price.toLocaleString()}/{product.unit}
                    </span>
                    <span className="text-muted-foreground">
                      {product.quantity} {product.unit}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <button 
                      onClick={() => router.push(`/supplier/products/${product.id}`)}
                      className="flex-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-surface"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => router.push("/supplier/products")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Manage Catalog</p>
              <p className="text-xs text-muted-foreground">Add/edit products</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/supplier/rfqs")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-blue-500/10 p-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Quote Requests</p>
              <p className="text-xs text-muted-foreground">Respond to RFQs</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/supplier/orders")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-purple-500/10 p-3">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Orders</p>
              <p className="text-xs text-muted-foreground">Fulfill orders</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/supplier/customers")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-amber-500/10 p-3">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Customers</p>
              <p className="text-xs text-muted-foreground">Manage relationships</p>
            </div>
          </button>
        </div>

        {/* Performance Stats */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Performance Overview</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Completed Orders
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{completedOrders}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {orders.length > 0 ? ((completedOrders / orders.length) * 100).toFixed(0) : 0}% completion rate
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-blue-600" />
                Active Customers
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{activeCustomers}</p>
              <p className="mt-1 text-xs text-muted-foreground">Repeat customers: 68%</p>
            </div>

            <div className="rounded-lg border border-border bg-surface/50 p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-purple-600" />
                On-Time Delivery
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">94%</p>
              <p className="mt-1 text-xs text-muted-foreground">Above industry avg</p>
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
