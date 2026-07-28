"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, BriefcaseBusiness, CreditCard, PackageCheck, SearchCheck, ShoppingCart, Truck, UserCircle2, Wallet, MessageSquareText, Eye } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { StatCard } from "./StatCard";
import { SearchBar } from "./SearchBar";
import { ProductCard } from "./ProductCard";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productService, orderService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, Order } from "@/lib/storage";
import { Modal } from "@/components/modals";

export function BuyerPortal() {
  const session = useSession();
  const router = useRouter();
  const buyerId = session?.claims.sub ?? "";
  
  const [query, setQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTab, setSelectedTab] = useState<"All" | "Pending" | "Processing" | "Shipping" | "Completed" | "Cancelled">("All");

  useEffect(() => {
    // Load products from marketplace
    setProducts(productService.getAll());
    
    // Load buyer's orders
    if (buyerId) {
      const allOrders = orderService.getAll();
      setOrders(allOrders.filter(o => o.buyerId === buyerId));
    }
  }, [buyerId]);

  const filteredProducts = useMemo(() => {
    const term = query.toLowerCase();
    return products.filter((product) => {
      return !term || [product.name, product.category].some((value) => value.toLowerCase().includes(term));
    });
  }, [query, products]);

  const visibleOrders = useMemo(() => {
    if (selectedTab === "All") return orders;
    if (selectedTab === "Completed") return orders.filter((order) => order.status === "Completed" || order.status === "Delivered");
    if (selectedTab === "Pending") return orders.filter((order) => order.status === "Request");
    if (selectedTab === "Processing") return orders.filter((order) => order.status === "Processing" || order.status === "Accepted");
    if (selectedTab === "Shipping") return orders.filter((order) => order.status === "Transport");
    return orders.filter((order) => order.status === "Cancelled" as any); // Note: Cancelled not in Order type
  }, [selectedTab, orders]);

  const toggleWishlist = (id: string) => {
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "Request").length;
  const deliveredOrders = orders.filter(o => o.status === "Completed" || o.status === "Delivered").length;
  const totalSpending = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <>
      <PageHeader
        title="Smart Buyer Portal"
        description="Manage sourcing, orders, tracking, payments and communications in one workspace."
        actions={
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted-foreground">Welcome, Jean Uwimana</div>
            <button className="rounded-full border border-border bg-background p-2">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-border bg-background p-2">
              <UserCircle2 className="h-4 w-4" />
            </button>
          </div>
        }
      />
      <PageBody>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Rwanda Supply Chain Network</p>
                  <h2 className="mt-1 text-2xl font-semibold text-foreground">Your procurement command center</h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Discover suppliers, manage purchase orders, track deliveries and keep payments on schedule.</p>
                </div>
                <div className="w-full max-w-md">
                  <SearchBar value={query} onChange={setQuery} placeholder="Search products, suppliers or locations" />
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Orders" value={String(totalOrders)} detail={`From ${new Set(orders.map(o => o.farmerId)).size} suppliers`} icon={ShoppingCart} trend={`${totalOrders} this month`} />
              <StatCard label="Pending Orders" value={String(pendingOrders)} detail="Awaiting confirmation" icon={PackageCheck} trend={pendingOrders > 0 ? `${pendingOrders} awaiting` : "None pending"} />
              <StatCard label="Delivered Orders" value={String(deliveredOrders)} detail="Last 30 days" icon={Truck} trend={`${deliveredOrders} completed`} />
              <StatCard label="Total Spending" value={`RWF ${(totalSpending / 1000000).toFixed(1)}M`} detail="Total order value" icon={Wallet} trend={`${orders.length} orders`} />
            </section>

            <section className="grid gap-4 lg:grid-cols-4">
              <Link href="/buyer/marketplace" className="rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:border-primary/40 hover:bg-surface">
                <div className="flex items-center gap-3"><SearchCheck className="h-5 w-5 text-primary" /> <span className="font-medium">Browse Marketplace</span></div>
              </Link>
              <Link href="/buyer/orders" className="rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:border-primary/40 hover:bg-surface">
                <div className="flex items-center gap-3"><BriefcaseBusiness className="h-5 w-5 text-primary" /> <span className="font-medium">Create Order</span></div>
              </Link>
              <Link href="/buyer/tracking" className="rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:border-primary/40 hover:bg-surface">
                <div className="flex items-center gap-3"><Truck className="h-5 w-5 text-primary" /> <span className="font-medium">Track Shipment</span></div>
              </Link>
              <Link href="/buyer/payments" className="rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:border-primary/40 hover:bg-surface">
                <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-primary" /> <span className="font-medium">Make Payment</span></div>
              </Link>
            </section>

            <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recent orders</h3>
                  <p className="text-sm text-muted-foreground">Monitor active purchase activity and fulfillment progress.</p>
                </div>
                <Link href="/buyer/orders" className="text-sm font-medium text-primary">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Product</th>
                      <th className="px-3 py-2">Supplier</th>
                      <th className="px-3 py-2">Qty</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.slice(0, 5).map((order) => {
                      const product = productService.getById(order.productId);
                      const farmer = userService.getUserName(order.farmerId);
                      return (
                        <tr key={order.id} className="border-t border-border/70">
                          <td className="px-3 py-3 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-3 py-3">{product?.name ?? "Product"}</td>
                          <td className="px-3 py-3">{farmer}</td>
                          <td className="px-3 py-3">{order.quantity} {product?.unit ?? "units"}</td>
                          <td className="px-3 py-3">RWF {order.totalPrice.toLocaleString()}</td>
                          <td className="px-3 py-3"><StatusBadge status={order.status} /></td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface"
                              >
                                <Eye className="h-3 w-3" /> View
                              </button>
                              <button 
                                onClick={() => router.push(`/buyer/orders/${order.id}`)}
                                className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface"
                              >
                                Track
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="border-border/80 bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Order status overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <span>Pending</span>
                  <span className="font-semibold text-foreground">{orders.filter(o => o.status === "Request").length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <span>Processing</span>
                  <span className="font-semibold text-foreground">{orders.filter(o => o.status === "Processing" || o.status === "Accepted").length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold text-foreground">{orders.filter(o => o.status === "Transport").length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                  <span>Delivered</span>
                  <span className="font-semibold text-foreground">{orders.filter(o => o.status === "Completed" || o.status === "Delivered").length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recommended products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredProducts.slice(0, 2).map((product) => (
                  <div key={product.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category} · {userService.getUserName(product.farmerId)}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        RWF {product.price.toLocaleString()}/{product.unit}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <span>Avail. {product.quantity} {product.unit}</span>
                      <span className="text-amber-500">★ {product.quality}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Notifications preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">{item.title}</span>
                      {!item.read ? <span className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
                    </div>
                    <p className="mt-1 text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
                <Link href="/buyer/notifications" className="inline-flex text-sm font-medium text-primary">View all notifications</Link>
              </CardContent>
            </Card>

            <Card className="border-border/80 bg-background shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent orders summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orders.slice(0, 3).map((order) => {
                  const product = productService.getById(order.productId);
                  return (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{product?.name ?? "Product"}</p>
                        <p className="text-muted-foreground">RWF {order.totalPrice.toLocaleString()}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-background p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Marketplace</h3>
              <p className="text-sm text-muted-foreground">Browse verified products, request quotes and add favorites.</p>
            </div>
            <Link href="/buyer/marketplace" className="text-sm font-medium text-primary">Open marketplace</Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onWishlist={toggleWishlist} wishlist={wishlist} />
            ))}
          </div>
        </section>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <Modal
            size="lg"
            title={`Order #${selectedOrder.id}`}
            onClose={() => setSelectedOrder(null)}
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium text-foreground">
                    {productService.getById(selectedOrder.productId)?.name ?? "Product"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium text-foreground">
                    {userService.getUserName(selectedOrder.farmerId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium text-foreground">
                    {selectedOrder.quantity} {productService.getById(selectedOrder.productId)?.unit ?? "units"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="font-medium text-foreground">
                    RWF {selectedOrder.totalPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {selectedOrder.deliveryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    router.push(`/buyer/orders/${selectedOrder.id}`);
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
                >
                  Track Order
                </button>
              </div>
            </div>
          </Modal>
        )}
      </PageBody>
    </>
  );
}
