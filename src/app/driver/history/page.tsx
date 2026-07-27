"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Package, MapPin, Calendar, DollarSign } from "lucide-react";

interface DeliveryHistory {
  id: string;
  orderId: string;
  pickup: string;
  delivery: string;
  distance: number;
  payment: number;
  completedDate: string;
  cargo: string;
  rating?: number;
}

export default function DriverHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Mock delivery history
  const allHistory = useMemo<DeliveryHistory[]>(() => [
    {
      id: "DEL-001",
      orderId: "ORD-11201",
      pickup: "Green Valley Farm, Kigali",
      delivery: "City Market Hub, Kigali",
      distance: 12.5,
      payment: 15000,
      completedDate: "2026-07-20",
      cargo: "Fresh Vegetables",
      rating: 5
    },
    {
      id: "DEL-002",
      orderId: "ORD-11198",
      pickup: "Highland Tea Estate, Musanze",
      delivery: "Tea Processing Plant, Kigali",
      distance: 95,
      payment: 65000,
      completedDate: "2026-07-18",
      cargo: "Tea Leaves",
      rating: 4
    },
    {
      id: "DEL-003",
      orderId: "ORD-11195",
      pickup: "Sunrise Coffee Cooperative, Huye",
      delivery: "Export Processing, Kigali",
      distance: 135,
      payment: 85000,
      completedDate: "2026-07-15",
      cargo: "Coffee Beans",
      rating: 5
    },
    {
      id: "DEL-004",
      orderId: "ORD-11190",
      pickup: "Valley Grain Storage, Kigali",
      delivery: "Nyabugogo Market, Kigali",
      distance: 8,
      payment: 10000,
      completedDate: "2026-07-12",
      cargo: "Maize and Rice",
      rating: 4
    },
    {
      id: "DEL-005",
      orderId: "ORD-11185",
      pickup: "Banana Plantation, Huye",
      delivery: "Wholesale Market, Kigali",
      distance: 140,
      payment: 90000,
      completedDate: "2026-07-10",
      cargo: "Bananas",
      rating: 5
    }
  ], []);

  const filteredHistory = useMemo(() => {
    return allHistory.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.delivery.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (dateFilter !== "all") {
        const itemDate = new Date(item.completedDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dateFilter === "week") matchesDate = daysDiff <= 7;
        else if (dateFilter === "month") matchesDate = daysDiff <= 30;
        else if (dateFilter === "year") matchesDate = daysDiff <= 365;
      }

      return matchesSearch && matchesDate;
    });
  }, [allHistory, searchQuery, dateFilter]);

  const totalDeliveries = allHistory.length;
  const totalEarnings = allHistory.reduce((sum, item) => sum + item.payment, 0);
  const totalDistance = allHistory.reduce((sum, item) => sum + item.distance, 0);
  const avgRating = allHistory.reduce((sum, item) => sum + (item.rating || 0), 0) / allHistory.length;

  return (
    <>
      <PageHeader
        title="Delivery History"
        description="View your completed deliveries and earnings"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Deliveries</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalDeliveries}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Earnings</span>
            </div>
            <p className="mt-2 text-2xl font-bold">RWF {totalEarnings.toLocaleString()}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Total Distance</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalDistance.toFixed(0)} km</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>⭐</span>
              <span>Average Rating</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{avgRating.toFixed(1)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setDateFilter("all");
            }}
            className="h-10 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
          </button>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{item.id}</h3>
                      <StatusBadge status="completed" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Order: {item.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      RWF {item.payment.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.distance} km</p>
                  </div>
                </div>

                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="text-sm font-medium">{item.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="text-sm font-medium">{item.delivery}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{item.cargo}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {new Date(item.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{item.rating}.0</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No delivery history found"
            description="No deliveries match your current filters."
            icon={Package}
          />
        )}
      </PageBody>
    </>
  );
}
