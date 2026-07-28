"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Locate } from "lucide-react";

export default function DriverMapPage() {
  const [mapView, setMapView] = useState<"normal" | "satellite" | "terrain">("normal");

  const currentLocation = {
    lat: -1.9441,
    lng: 30.0619,
    address: "RN4 Highway, Rulindo"
  };

  const markers = [
    { id: 1, name: "Your Location", lat: -1.9441, lng: 30.0619, type: "current" },
    { id: 2, name: "Pickup Point", lat: -1.5000, lng: 29.6333, type: "pickup" },
    { id: 3, name: "Delivery Point", lat: -1.9697, lng: 30.1044, type: "delivery" }
  ];

  return (
    <>
      <PageHeader
        title="Live Map"
        description="Track your location and delivery route in real-time"
      />
      <PageBody>
        {/* Current Location Info */}
        <div className="mb-4 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Locate className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Current Location</p>
                <p className="text-sm text-muted-foreground">{currentLocation.address}</p>
              </div>
            </div>
            <button className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Navigation className="h-4 w-4" />
              Navigate
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative rounded-lg border bg-card overflow-hidden">
          {/* Map Controls */}
          <div className="absolute left-4 top-4 z-10 space-y-2">
            <div className="rounded-lg border bg-background shadow-lg">
              <button
                className="flex h-10 w-10 items-center justify-center border-b hover:bg-accent"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                className="flex h-10 w-10 items-center justify-center hover:bg-accent"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background shadow-lg hover:bg-accent"
              title="Center on Location"
            >
              <Locate className="h-4 w-4" />
            </button>
          </div>

          {/* Map View Selector */}
          <div className="absolute right-4 top-4 z-10">
            <div className="rounded-lg border bg-background shadow-lg p-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMapView("normal")}
                  className={`flex h-8 items-center gap-2 rounded px-3 text-sm font-medium transition-colors ${
                    mapView === "normal"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  Normal
                </button>
                <button
                  onClick={() => setMapView("satellite")}
                  className={`flex h-8 items-center gap-2 rounded px-3 text-sm font-medium transition-colors ${
                    mapView === "satellite"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapView("terrain")}
                  className={`flex h-8 items-center gap-2 rounded px-3 text-sm font-medium transition-colors ${
                    mapView === "terrain"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  Terrain
                </button>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="flex h-[600px] items-center justify-center bg-muted/50">
            <div className="text-center">
              <MapPin className="mx-auto mb-3 h-16 w-16 text-muted-foreground" />
              <p className="text-lg font-medium">Interactive Map View</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                Live GPS tracking with route visualization would be displayed here
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Map View: {mapView.charAt(0).toUpperCase() + mapView.slice(1)}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 rounded-lg border bg-background shadow-lg p-3">
            <p className="mb-2 text-sm font-medium">Map Legend</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Your Location</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Delivery Point</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>Pickup Point</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Markers Info */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {markers.map((marker) => (
            <div key={marker.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin
                  className={`h-5 w-5 ${
                    marker.type === "current"
                      ? "text-blue-500"
                      : marker.type === "pickup"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                />
                <p className="font-medium">{marker.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
              </p>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
