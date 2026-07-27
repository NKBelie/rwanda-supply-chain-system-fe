"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, ShoppingBag, Calendar, DollarSign } from "lucide-react";
import { orderService } from "@/services/data.service";

export default function SupplierOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allOrders = useMemo(() => orderService.getAll(), []);

  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      const matchesSearch = searchQuery === "" ||
        order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allOrders, searchQuery, statusFilter]);

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === "pending").length;
  const completedOrders = allOrders.filter(o => o.status === "completed").length;
  const totalRevenue = allOrders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage incoming orders"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>Total Orders</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4 text-yellow-500" />
              <span>Pending</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{pendingOrders}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4 text-green-500" />
              <span>Completed</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{completedOrders}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalRevenue / 1000000).toFixed(1)}M RWF
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="processing">Processing</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md cursor-pointer"
                onClick={() => window.location.href = `/supplier/orders/${order.id}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{order.id}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.buyerName} • {order.buyerPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      RWF {(order.totalAmount || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} items
                    </p>
                  </div>
                </div>

                <div className="mb-3 rounded-lg bg-muted/50 p-3">
                  <p className="mb-2 text-sm font-medium">Order Items</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.productName} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          RWF {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span>Deliver to: {order.deliveryDistrict}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No orders found"
            description="No orders match your search criteria."
            icon={ShoppingBag}
          />
        )}
      </PageBody>
    </>
  );
}
