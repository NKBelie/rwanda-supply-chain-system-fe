"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { MapPin, Truck, Navigation, Layers, ZoomIn, ZoomOut } from "lucide-react";

export default function TransportMapPage() {
  const [mapView, setMapView] = useState<"normal" | "satellite" | "terrain">("normal");

  const activeVehicles = [
    { id: "V1", plate: "RAD 123 A", driver: "Jean Paul", status: "delivering", location: "Kicukiro" },
    { id: "V2", plate: "RAD 456 B", driver: "Marie Claire", status: "returning", location: "Musanze" },
    { id: "V3", plate: "RAD 789 C", driver: "Emmanuel", status: "idle", location: "Depot" }
  ];

  return (
    <>
      <PageHeader
        title="Fleet Map"
        description="Track all vehicles in real-time"
      />
      <PageBody>
        {/* Active Vehicles Summary */}
        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-green-500" />
              <span>Delivering</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {activeVehicles.filter(v => v.status === "delivering").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>Returning</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {activeVehicles.filter(v => v.status === "returning").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-gray-500" />
              <span>Idle</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {activeVehicles.filter(v => v.status === "idle").length}
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative rounded-lg border bg-card overflow-hidden">
          {/* Map Controls */}
          <div className="absolute left-4 top-4 z-10 space-y-2">
            <div className="rounded-lg border bg-background shadow-lg">
              <button className="flex h-10 w-10 items-center justify-center border-b hover:bg-accent">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center hover:bg-accent">
                <ZoomOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Map View Selector */}
          <div className="absolute right-4 top-4 z-10">
            <div className="rounded-lg border bg-background shadow-lg p-2">
              <div className="flex items-center gap-1">
                {["normal", "satellite", "terrain"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setMapView(view as any)}
                    className={`flex h-8 items-center gap-2 rounded px-3 text-sm font-medium transition-colors ${
                      mapView === view
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {view === "normal" && <Layers className="h-3.5 w-3.5" />}
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="flex h-[500px] items-center justify-center bg-muted/50">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-16 w-16 text-muted-foreground" />
              <p className="text-lg font-medium">Fleet Tracking Map</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Real-time GPS tracking of all active vehicles with route visualization
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Map View: {mapView.charAt(0).toUpperCase() + mapView.slice(1)}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 rounded-lg border bg-background shadow-lg p-3">
            <p className="mb-2 text-sm font-medium">Vehicle Status</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Delivering</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Returning</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-gray-500" />
                <span>Idle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Vehicles List */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h3 className="mb-4 font-semibold">Active Vehicles</h3>
          <div className="space-y-3">
            {activeVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-2 w-2 rounded-full ${
                      vehicle.status === "delivering"
                        ? "bg-green-500"
                        : vehicle.status === "returning"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{vehicle.plate}</p>
                    <p className="text-sm text-muted-foreground">Driver: {vehicle.driver}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium capitalize">{vehicle.status}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
}
