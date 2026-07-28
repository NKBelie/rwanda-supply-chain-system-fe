"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { orderService, productService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Order } from "@/lib/storage";

export default function FarmerOrdersPage() {
  const router = useRouter();
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"All" | "Request" | "Accepted" | "Processing" | "Transport" | "Completed">("All");

  // Get orders
  const allOrders = useMemo(() => {
    return orderService.getAll().filter(order => order.farmerId === farmerId);
  }, [farmerId]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Tab filter
    if (selectedTab !== "All") {
      filtered = filtered.filter(order => order.status === selectedTab);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order => {
        const product = productService.getById(order.productId);
        const buyer = userService.getUserName(order.buyerId);
        return (
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          buyer.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  }, [allOrders, selectedTab, searchQuery]);

  // Calculate stats
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === "Request").length;
  const activeOrders = allOrders.filter(o => 
    ["Accepted", "Processing", "Transport"].includes(o.status)
  ).length;
  const completedOrders = allOrders.filter(o => o.status === "Completed").length;

  const handleViewOrder = (id: string) => {
    router.push(`/farmer/orders/${id}`);
  };

  const handleAcceptOrder = (orderId: string) => {
    if (confirm("Accept this order?")) {
      // In real app, call API
      console.log("Accepting order:", orderId);
    }
  };

  const handleRejectOrder = (orderId: string) => {
    if (confirm("Are you sure you want to reject this order?")) {
      // In real app, call API
      console.log("Rejecting order:", orderId);
    }
  };

  const tabs = [
    { key: "All" as const, label: "All Orders", count: allOrders.length },
    { key: "Request" as const, label: "Pending", count: pendingOrders },
    { key: "Accepted" as const, label: "Accepted", count: allOrders.filter(o => o.status === "Accepted").length },
    { key: "Processing" as const, label: "Processing", count: allOrders.filter(o => o.status === "Processing").length },
    { key: "Transport" as const, label: "In Transit", count: allOrders.filter(o => o.status === "Transport").length },
    { key: "Completed" as const, label: "Completed", count: completedOrders },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage incoming orders from buyers"
      />

      <PageBody>
        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-semibold text-foreground">{totalOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-amber-600">{pendingOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold text-blue-600">{activeOrders}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-emerald-600">{completedOrders}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-2 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                selectedTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, product, or buyer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-12 w-12" />}
            title="No orders found"
            description={
              searchQuery
                ? "Try adjusting your search"
                : selectedTab === "All"
                ? "You haven't received any orders yet"
                : `No ${selectedTab.toLowerCase()} orders`
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const product = productService.getById(order.productId);
              const buyer = userService.getUserName(order.buyerId);

              return (
                <div
                  key={order.id}
                  className="rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">
                          Order #{order.id}
                        </h3>
                        <StatusBadge status={order.status} size="sm" />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Product</p>
                          <p className="font-medium text-foreground">
                            {product?.name || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Buyer</p>
                          <p className="font-medium text-foreground">{buyer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium text-foreground">
                            {order.quantity} {product?.unit || "units"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Amount</p>
                          <p className="font-medium text-foreground">
                            RWF {order.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        Ordered on {new Date(order.createdAt).toLocaleDateString("en-RW", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>

                      {order.status === "Request" && (
                        <>
                          <button
                            onClick={() => handleAcceptOrder(order.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectOrder(order.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-600 bg-background px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
