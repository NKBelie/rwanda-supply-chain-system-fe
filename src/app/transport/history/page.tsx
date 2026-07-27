"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Package, Calendar, DollarSign, TrendingUp } from "lucide-react";

interface TransportHistory {
  id: string;
  requestId: string;
  clientName: string;
  driverName: string;
  vehiclePlate: string;
  route: string;
  distance: number;
  revenue: number;
  completedDate: string;
  rating?: number;
}

export default function TransportHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const allHistory = useMemo<TransportHistory[]>(() => [
    {
      id: "TH-001",
      requestId: "REQ-001",
      clientName: "Green Valley Farm",
      driverName: "Jean Paul Uwimana",
      vehiclePlate: "RAD 123 A",
      route: "Kigali - Kigali",
      distance: 12.5,
      revenue: 15000,
      completedDate: "2026-07-26",
      rating: 5
    },
    {
      id: "TH-002",
      requestId: "REQ-002",
      clientName: "Highland Tea Estate",
      driverName: "Marie Claire Mukandori",
      vehiclePlate: "RAD 456 B",
      route: "Musanze - Kigali",
      distance: 95,
      revenue: 65000,
      completedDate: "2026-07-25",
      rating: 4
    },
    {
      id: "TH-003",
      requestId: "REQ-003",
      clientName: "Sunrise Coffee Cooperative",
      driverName: "Emmanuel Nkurunziza",
      vehiclePlate: "RAD 789 C",
      route: "Huye - Kigali",
      distance: 135,
      revenue: 85000,
      completedDate: "2026-07-24",
      rating: 5
    }
  ], []);

  const filteredHistory = useMemo(() => {
    return allHistory.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.route.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (dateFilter !== "all") {
        const itemDate = new Date(item.completedDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dateFilter === "week") matchesDate = daysDiff <= 7;
        else if (dateFilter === "month") matchesDate = daysDiff <= 30;
      }

      return matchesSearch && matchesDate;
    });
  }, [allHistory, searchQuery, dateFilter]);

  const totalDeliveries = allHistory.length;
  const totalRevenue = allHistory.reduce((sum, item) => sum + item.revenue, 0);
  const totalDistance = allHistory.reduce((sum, item) => sum + item.distance, 0);
  const avgRating = allHistory.reduce((sum, item) => sum + (item.rating || 0), 0) / allHistory.length;

  return (
    <>
      <PageHeader
        title="Transport History"
        description="View completed transport operations"
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
              <span>Total Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">RWF {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
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
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
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
                    <p className="mt-1 text-sm text-muted-foreground">
                      Request: {item.requestId} • {item.clientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      RWF {item.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.distance} km</p>
                  </div>
                </div>

                <div className="mb-3 grid gap-3 rounded-lg bg-muted/50 p-3 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Route</p>
                    <p className="font-medium">{item.route}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver</p>
                    <p className="font-medium">{item.driverName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vehicle</p>
                    <p className="font-medium">{item.vehiclePlate}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Completed: {new Date(item.completedDate).toLocaleDateString()}</span>
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
            title="No history found"
            description="No transport history matches your search criteria."
            icon={Package}
          />
        )}
      </PageBody>
    </>
  );
}
