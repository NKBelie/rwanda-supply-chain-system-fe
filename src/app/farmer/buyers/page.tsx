"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, Users, Phone, Mail, MapPin, ShoppingBag, DollarSign } from "lucide-react";
import { orderService } from "@/services/data.service";

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "active" | "inactive";
}

export default function FarmerBuyersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Generate buyer list from orders
  const allBuyers = useMemo<Buyer[]>(() => {
    const orders = orderService.getAll();
    const buyerMap = new Map<string, Buyer>();

    orders.forEach(order => {
      const buyerId = order.buyerName.toLowerCase().replace(/\s+/g, '-');
      
      if (!buyerMap.has(buyerId)) {
        buyerMap.set(buyerId, {
          id: buyerId,
          name: order.buyerName,
          email: order.buyerEmail || `${buyerId}@example.com`,
          phone: order.buyerPhone,
          location: order.deliveryDistrict,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          status: "active"
        });
      }

      const buyer = buyerMap.get(buyerId)!;
      buyer.totalOrders += 1;
      buyer.totalSpent += order.totalAmount || 0;
      
      // Update last order date if this order is more recent
      if (new Date(order.createdAt) > new Date(buyer.lastOrderDate)) {
        buyer.lastOrderDate = order.createdAt;
      }

      // Mark as inactive if last order was more than 30 days ago
      const daysSinceLastOrder = Math.floor(
        (new Date().getTime() - new Date(buyer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      buyer.status = daysSinceLastOrder > 30 ? "inactive" : "active";
    });

    return Array.from(buyerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, []);

  const filteredBuyers = useMemo(() => {
    return allBuyers.filter(buyer => {
      const matchesSearch = searchQuery === "" ||
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.phone.includes(searchQuery);

      const matchesStatus = statusFilter === "" || buyer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allBuyers, searchQuery, statusFilter]);

  const totalBuyers = allBuyers.length;
  const activeBuyers = allBuyers.filter(b => b.status === "active").length;
  const totalRevenue = allBuyers.reduce((sum, b) => sum + b.totalSpent, 0);

  return (
    <>
      <PageHeader
        title="Buyers"
        description="Manage your regular buyers and customer relationships"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Buyers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalBuyers}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Active Buyers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeBuyers}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              RWF {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search buyers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Buyers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
            }}
            className="h-10 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
          </button>
        </div>

        {/* Buyers Grid */}
        {filteredBuyers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuyers.map((buyer) => (
              <div
                key={buyer.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{buyer.name}</h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                        buyer.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {buyer.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{buyer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{buyer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{buyer.location}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ShoppingBag className="h-3 w-3" />
                      <span>Orders</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold">{buyer.totalOrders}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>Total Spent</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold">
                      {(buyer.totalSpent / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Last order: {new Date(buyer.lastOrderDate).toLocaleDateString()}
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${buyer.phone}`}
                    className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md border bg-background text-sm font-medium hover:bg-accent"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                  <a
                    href={`mailto:${buyer.email}`}
                    className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No buyers found"
            description="No buyers match your search criteria. Try adjusting your filters."
            icon={Users}
          />
        )}
      </PageBody>
    </>
  );
}
