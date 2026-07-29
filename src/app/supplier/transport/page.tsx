"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge } from "@/components/common";
import { Truck, MapPin, Calendar, DollarSign, Plus } from "lucide-react";

export default function SupplierTransportPage() {
  const transportRequests = [
    {
      id: "TRP-001",
      orderId: "ORD-12345",
      pickup: { location: "Main Warehouse", address: "KN 4 Ave, Kigali", district: "Kigali" },
      delivery: { location: "Green Valley Farm", address: "Rural Area", district: "Musanze" },
      cargo: "Agricultural Supplies",
      weight: 500,
      distance: 95,
      scheduledDate: "2026-07-30",
      status: "scheduled",
      cost: 65000,
      transportCompany: "Swift Transport Ltd"
    },
    {
      id: "TRP-002",
      orderId: "ORD-12346",
      pickup: { location: "Storage Facility", address: "KG 7 Ave, Kigali", district: "Kigali" },
      delivery: { location: "Highland Cooperative", address: "Butare", district: "Huye" },
      cargo: "Fertilizers and Seeds",
      weight: 800,
      distance: 135,
      scheduledDate: "2026-07-28",
      status: "in_transit",
      cost: 85000,
      transportCompany: "Express Logistics"
    }
  ];

  const handleCreateRequest = () => {
    alert("Create transport request form would open here");
  };

  return (
    <>
      <PageHeader
        title="Transport"
        description="Manage delivery logistics"
        actions={
          <button
            onClick={handleCreateRequest}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        }
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Total Requests</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{transportRequests.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>In Transit</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {transportRequests.filter(t => t.status === "in_transit").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Transport Costs</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(transportRequests.reduce((sum, t) => sum + t.cost, 0) / 1000).toFixed(0)}K RWF
            </p>
          </div>
        </div>

        {/* Transport List */}
        <div className="space-y-4">
          {transportRequests.map((transport) => (
            <div
              key={transport.id}
              className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{transport.id}</h3>
                    <StatusBadge status={transport.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Order: {transport.orderId} • {transport.transportCompany}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    RWF {transport.cost.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{transport.distance} km</p>
                </div>
              </div>

              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>Pickup</span>
                  </div>
                  <p className="font-medium">{transport.pickup.location}</p>
                  <p className="text-sm text-muted-foreground">{transport.pickup.address}</p>
                  <p className="text-sm text-muted-foreground">{transport.pickup.district}</p>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span>Delivery</span>
                  </div>
                  <p className="font-medium">{transport.delivery.location}</p>
                  <p className="text-sm text-muted-foreground">{transport.delivery.address}</p>
                  <p className="text-sm text-muted-foreground">{transport.delivery.district}</p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Cargo</p>
                  <p className="font-medium">{transport.cargo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weight</p>
                  <p className="font-medium">{transport.weight} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Scheduled</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <p className="font-medium">
                      {new Date(transport.scheduledDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
