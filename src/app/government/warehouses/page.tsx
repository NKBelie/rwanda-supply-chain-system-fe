"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Warehouse, Package, MapPin, TrendingUp } from "lucide-react";

interface WarehouseInfo {
  id: string;
  name: string;
  district: string;
  capacity: number;
  currentStock: number;
  status: "active" | "maintenance" | "full";
  temperature: string;
  certification: string;
}

export default function GovernmentWarehousesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allWarehouses = useMemo<WarehouseInfo[]>(() => [
    {
      id: "WH-001",
      name: "Central Storage Facility",
      district: "Kigali",
      capacity: 5000,
      currentStock: 3200,
      status: "active",
      temperature: "Climate Controlled",
      certification: "ISO 9001"
    },
    {
      id: "WH-002",
      name: "Northern Regional Warehouse",
      district: "Musanze",
      capacity: 3000,
      currentStock: 2850,
      status: "active",
      temperature: "Ambient",
      certification: "HACCP"
    },
    {
      id: "WH-003",
      name: "Export Processing Zone Storage",
      district: "Kigali",
      capacity: 8000,
      currentStock: 8000,
      status: "full",
      temperature: "Refrigerated",
      certification: "ISO 22000"
    }
  ], []);

  const filteredWarehouses = useMemo(() => {
    return allWarehouses.filter(wh => {
      const matchesSearch = searchQuery === "" ||
        wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wh.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || wh.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allWarehouses, searchQuery, statusFilter]);

  const totalCapacity = allWarehouses.reduce((sum, wh) => sum + wh.capacity, 0);
  const totalStock = allWarehouses.reduce((sum, wh) => sum + wh.currentStock, 0);
  const utilizationRate = (totalStock / totalCapacity) * 100;
  const activeCount = allWarehouses.filter(w => w.status === "active").length;

  return (
    <>
      <PageHeader
        title="Warehouses"
        description="Monitor warehouse facilities and capacity"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Warehouse className="h-4 w-4" />
              <span>Total Warehouses</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{allWarehouses.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Capacity</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalCapacity.toLocaleString()} MT</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 text-blue-500" />
              <span>Current Stock</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalStock.toLocaleString()} MT</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Utilization</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{utilizationRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search warehouses..."
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
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="full">Full</option>
          </select>
        </div>

        {/* Warehouses Grid */}
        {filteredWarehouses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredWarehouses.map((wh) => {
              const utilization = (wh.currentStock / wh.capacity) * 100;

              return (
                <div
                  key={wh.id}
                  className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{wh.name}</h3>
                        <StatusBadge status={wh.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{wh.id}</p>
                    </div>
                    <Warehouse className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="mb-4 grid gap-3 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <p className="font-medium">{wh.district}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temperature</p>
                      <p className="font-medium">{wh.temperature}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium">{wh.capacity.toLocaleString()} MT</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Stock</p>
                      <p className="font-medium">{wh.currentStock.toLocaleString()} MT</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium">{utilization.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full transition-all ${
                          utilization >= 90
                            ? "bg-red-500"
                            : utilization >= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                      {wh.certification}
                    </span>
                    <span className="text-muted-foreground">
                      {wh.capacity - wh.currentStock} MT available
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No warehouses found"
            description="No warehouses match your search criteria."
            icon={Warehouse}
          />
        )}
      </PageBody>
    </>
  );
}
