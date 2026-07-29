"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, Truck, Plus, Wrench, Calendar } from "lucide-react";

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  brand: string;
  model: string;
  capacity: number;
  status: "available" | "in_use" | "maintenance";
  driverAssigned?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  mileage: number;
}

export default function TransportVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allVehicles = useMemo<Vehicle[]>(() => [
    {
      id: "VEH-001",
      plateNumber: "RAD 123 A",
      type: "Pickup Truck",
      brand: "Toyota",
      model: "Hilux 2023",
      capacity: 1000,
      status: "available",
      lastMaintenance: "2026-06-15",
      nextMaintenance: "2026-09-15",
      mileage: 45000
    },
    {
      id: "VEH-002",
      plateNumber: "RAD 456 B",
      type: "Box Truck",
      brand: "Isuzu",
      model: "NPR 2022",
      capacity: 3000,
      status: "in_use",
      driverAssigned: "Jean Paul Uwimana",
      lastMaintenance: "2026-05-20",
      nextMaintenance: "2026-08-20",
      mileage: 78000
    },
    {
      id: "VEH-003",
      plateNumber: "RAD 789 C",
      type: "Van",
      brand: "Mercedes-Benz",
      model: "Sprinter 2024",
      capacity: 1500,
      status: "available",
      lastMaintenance: "2026-07-01",
      nextMaintenance: "2026-10-01",
      mileage: 32000
    },
    {
      id: "VEH-004",
      plateNumber: "RAD 234 D",
      type: "Flatbed Truck",
      brand: "Mitsubishi",
      model: "Fuso 2021",
      capacity: 5000,
      status: "maintenance",
      lastMaintenance: "2026-07-20",
      nextMaintenance: "2026-10-20",
      mileage: 95000
    }
  ], []);

  const filteredVehicles = useMemo(() => {
    return allVehicles.filter(vehicle => {
      const matchesSearch = searchQuery === "" ||
        vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || vehicle.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allVehicles, searchQuery, statusFilter]);

  const availableVehicles = allVehicles.filter(v => v.status === "available").length;
  const inUseVehicles = allVehicles.filter(v => v.status === "in_use").length;
  const maintenanceVehicles = allVehicles.filter(v => v.status === "maintenance").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-500";
      case "in_use":
        return "bg-blue-500/10 text-blue-500";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleAddVehicle = () => {
    alert("Add new vehicle form would open here");
  };

  return (
    <>
      <PageHeader
        title="Vehicles"
        description="Manage your vehicle fleet"
        actions={
          <button
            onClick={handleAddVehicle}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Vehicle
          </button>
        }
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Total Vehicles</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{allVehicles.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-green-500" />
              <span>Available</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{availableVehicles}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>In Use</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{inUseVehicles}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4 text-yellow-500" />
              <span>Maintenance</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{maintenanceVehicles}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vehicles..."
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
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{vehicle.plateNumber}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.type}</p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                        vehicle.status
                      )}`}
                    >
                      {vehicle.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{vehicle.capacity} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mileage</span>
                    <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                  </div>
                  {vehicle.driverAssigned && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver</span>
                      <span className="font-medium">{vehicle.driverAssigned}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Last Service: {new Date(vehicle.lastMaintenance).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wrench className="h-3 w-3" />
                    <span>Next Service: {new Date(vehicle.nextMaintenance).toLocaleDateString()}</span>
                  </div>
                </div>

                <button className="mt-4 flex h-9 w-full items-center justify-center rounded-md border bg-background text-sm font-medium hover:bg-accent">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No vehicles found"
            description="No vehicles match your search criteria."
            icon={<Truck className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
