"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { Warehouse, Package, MapPin, TrendingUp } from "lucide-react";

export default function SupplierWarehousesPage() {
  const warehouses = [
    {
      id: "WH-001",
      name: "Main Distribution Center",
      location: "Kigali, Kicukiro",
      capacity: 5000,
      currentStock: 3200,
      products: 45,
      temperature: "Climate Controlled",
      status: "active"
    },
    {
      id: "WH-002",
      name: "Northern Regional Storage",
      location: "Musanze",
      capacity: 3000,
      currentStock: 1800,
      products: 28,
      temperature: "Ambient",
      status: "active"
    },
    {
      id: "WH-003",
      name: "Southern Depot",
      location: "Huye",
      capacity: 2500,
      currentStock: 2100,
      products: 32,
      temperature: "Refrigerated",
      status: "active"
    }
  ];

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0);
  const utilization = (totalStock / totalCapacity) * 100;

  return (
    <>
      <PageHeader
        title="Warehouses"
        description="Monitor storage facilities"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Warehouse className="h-4 w-4" />
              <span>Total Warehouses</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{warehouses.length}</p>
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
            <p className="mt-2 text-2xl font-bold">{utilization.toFixed(1)}%</p>
          </div>
        </div>

        {/* Warehouses Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {warehouses.map((warehouse) => {
            const warehouseUtilization = (warehouse.currentStock / warehouse.capacity) * 100;

            return (
              <div
                key={warehouse.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{warehouse.name}</h3>
                    <p className="text-sm text-muted-foreground">{warehouse.id}</p>
                  </div>
                  <Warehouse className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="mb-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{warehouse.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{warehouse.capacity.toLocaleString()} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Stock</span>
                    <span className="font-medium">{warehouse.currentStock.toLocaleString()} MT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-medium">{warehouse.products}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temperature</span>
                    <span className="font-medium">{warehouse.temperature}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium">{warehouseUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full transition-all ${
                        warehouseUtilization >= 90
                          ? "bg-red-500"
                          : warehouseUtilization >= 70
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${warehouseUtilization}%` }}
                    />
                  </div>
                </div>

                <button className="h-9 w-full rounded-md border bg-background text-sm font-medium hover:bg-accent">
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
