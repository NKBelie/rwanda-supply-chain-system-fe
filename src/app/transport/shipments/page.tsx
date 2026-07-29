"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Package, MapPin, Truck, Calendar } from "lucide-react";

interface Shipment {
  id: string;
  orderId: string;
  clientName: string;
  pickup: string;
  delivery: string;
  cargo: string;
  weight: number;
  driverName: string;
  vehiclePlate: string;
  status: "pending" | "picked_up" | "in_transit" | "delivered";
  departureDate: string;
  estimatedArrival: string;
  trackingUrl?: string;
}

export default function TransportShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allShipments = useMemo<Shipment[]>(() => [
    {
      id: "SHIP-001",
      orderId: "ORD-12345",
      clientName: "Green Valley Farm",
      pickup: "Kigali, Kicukiro",
      delivery: "Kigali, Nyarugenge",
      cargo: "Fresh Vegetables",
      weight: 250,
      driverName: "Jean Paul Uwimana",
      vehiclePlate: "RAD 123 A",
      status: "in_transit",
      departureDate: "2026-07-27T09:00:00",
      estimatedArrival: "2026-07-27T10:30:00",
      trackingUrl: "#"
    },
    {
      id: "SHIP-002",
      orderId: "ORD-12346",
      clientName: "Highland Tea Estate",
      pickup: "Musanze",
      delivery: "Kigali, Gasabo",
      cargo: "Tea Leaves",
      weight: 300,
      driverName: "Marie Claire Mukandori",
      vehiclePlate: "RAD 456 B",
      status: "picked_up",
      departureDate: "2026-07-27T11:15:00",
      estimatedArrival: "2026-07-27T13:45:00",
      trackingUrl: "#"
    },
    {
      id: "SHIP-003",
      orderId: "ORD-12347",
      clientName: "Sunrise Coffee Cooperative",
      pickup: "Huye, Butare",
      delivery: "Kigali, Kicukiro",
      cargo: "Coffee Beans",
      weight: 500,
      driverName: "Emmanuel Nkurunziza",
      vehiclePlate: "RAD 789 C",
      status: "delivered",
      departureDate: "2026-07-26T08:00:00",
      estimatedArrival: "2026-07-26T10:30:00",
      trackingUrl: "#"
    }
  ], []);

  const filteredShipments = useMemo(() => {
    return allShipments.filter(shipment => {
      const matchesSearch = searchQuery === "" ||
        shipment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.driverName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || shipment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allShipments, searchQuery, statusFilter]);

  const inTransitCount = allShipments.filter(s => s.status === "in_transit").length;
  const deliveredCount = allShipments.filter(s => s.status === "delivered").length;
  const totalWeight = allShipments.reduce((sum, s) => sum + s.weight, 0);

  return (
    <>
      <PageHeader
        title="Shipments"
        description="Track active and completed shipments"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>In Transit</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{inTransitCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 text-green-500" />
              <span>Delivered Today</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{deliveredCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Weight</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalWeight} kg</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search shipments..."
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
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Shipments List */}
        {filteredShipments.length > 0 ? (
          <div className="space-y-4">
            {filteredShipments.map((shipment) => (
              <div
                key={shipment.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{shipment.id}</h3>
                      <StatusBadge status={shipment.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Order: {shipment.orderId} • {shipment.clientName}
                    </p>
                  </div>
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="mb-4 grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="text-sm font-medium">{shipment.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="text-sm font-medium">{shipment.delivery}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 grid gap-3 rounded-lg bg-muted/50 p-3 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Cargo</p>
                    <p className="font-medium">{shipment.cargo}</p>
                    <p className="text-xs text-muted-foreground">{shipment.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Driver</p>
                    <p className="font-medium">{shipment.driverName}</p>
                    <p className="text-xs text-muted-foreground">{shipment.vehiclePlate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Est. Arrival</p>
                    <p className="font-medium">
                      {new Date(shipment.estimatedArrival).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(shipment.estimatedArrival).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Departed: {new Date(shipment.departureDate).toLocaleString()}</span>
                  </div>
                  {shipment.trackingUrl && (
                    <button className="text-primary hover:underline">
                      Track Shipment →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No shipments found"
            description="No shipments match your search criteria."
            icon={<Package className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
