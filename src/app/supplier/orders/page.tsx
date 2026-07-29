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
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyerId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allOrders, searchQuery, statusFilter]);

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === "Request").length;
  const completedOrders = allOrders.filter(o => o.status === "Completed").length;
  const totalRevenue = allOrders
    .filter(o => o.status === "Completed")
    .reduce((sum, o) => sum + o.totalPrice, 0);

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
            <option value="Request">Request</option>
            <option value="Accepted">Accepted</option>
            <option value="Processing">Processing</option>
            <option value="Transport">Transport</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              // Generate mock buyer name from buyerId
              const buyerName = `Buyer ${order.buyerId.slice(-4)}`;
              
              return (
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
                        {buyerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        RWF {order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {order.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3 rounded-lg bg-muted/50 p-3">
                    <p className="mb-2 text-sm font-medium">Order Details</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Product ID</span>
                        <span className="font-medium">{order.productId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Quantity</span>
                        <span className="font-medium">{order.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Price</span>
                        <span className="font-medium">RWF {order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Ordered: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {order.deliveryDate && (
                      <span>Deliver by: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No orders found"
            description="No orders match your search criteria."
            icon={<ShoppingBag className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
