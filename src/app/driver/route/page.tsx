"use client";

import React from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { MapPin, Navigation, Clock, ArrowRight } from "lucide-react";

export default function DriverRoutePage() {
  // Mock route data
  const route = {
    totalDistance: 95,
    estimatedTime: "2h",
    waypoints: [
      {
        id: 1,
        name: "Start - Your Location",
        address: "Current Position",
        district: "Musanze",
        eta: "Now",
        type: "start"
      },
      {
        id: 2,
        name: "Highland Tea Estate",
        address: "RN4 Highway, Musanze",
        district: "Musanze",
        eta: "11:15 AM",
        type: "pickup",
        distance: 5
      },
      {
        id: 3,
        name: "RN4 Checkpoint",
        address: "Kigali-Musanze Highway",
        district: "Rulindo",
        eta: "11:45 AM",
        type: "waypoint",
        distance: 35
      },
      {
        id: 4,
        name: "Tea Processing Plant",
        address: "KK 15 Ave, Kicukiro",
        district: "Kigali",
        eta: "1:30 PM",
        type: "delivery",
        distance: 55
      }
    ]
  };

  const getWaypointColor = (type: string) => {
    switch (type) {
      case "start":
        return "bg-gray-500/10 text-gray-500";
      case "pickup":
        return "bg-blue-500/10 text-blue-500";
      case "waypoint":
        return "bg-yellow-500/10 text-yellow-500";
      case "delivery":
        return "bg-green-500/10 text-green-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <PageHeader
        title="Route Details"
        description="View your delivery route and waypoints"
      />
      <PageBody>
        {/* Route Summary */}
        <div className="mb-6 rounded-lg border bg-card p-5">
          <h2 className="mb-4 font-semibold">Route Summary</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <Navigation className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Distance</p>
                <p className="text-xl font-bold">{route.totalDistance} km</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="text-xl font-bold">{route.estimatedTime}</p>
              </div>
            </div>
          </div>

          <button className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Navigation className="h-4 w-4" />
            Start Navigation
          </button>
        </div>

        {/* Waypoints */}
        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 font-semibold">Route Waypoints</h2>

          <div className="relative">
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />
            <div className="space-y-4">
              {route.waypoints.map((waypoint, index) => (
                <div key={waypoint.id} className="relative flex gap-4">
                  <div
                    className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getWaypointColor(
                      waypoint.type
                    )}`}
                  >
                    {waypoint.type === "start" && <Navigation className="h-4 w-4" />}
                    {waypoint.type === "pickup" && <MapPin className="h-4 w-4" />}
                    {waypoint.type === "waypoint" && <ArrowRight className="h-4 w-4" />}
                    {waypoint.type === "delivery" && <MapPin className="h-4 w-4" />}
                  </div>

                  <div className="flex-1 rounded-lg border bg-card p-4 hover:bg-accent/50">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-medium">{waypoint.name}</p>
                        <p className="text-sm text-muted-foreground">{waypoint.address}</p>
                        <p className="text-sm text-muted-foreground">{waypoint.district}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{waypoint.eta}</p>
                        {waypoint.distance && (
                          <p className="text-xs text-muted-foreground">
                            {waypoint.distance} km from previous
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getWaypointColor(
                          waypoint.type
                        )}`}
                      >
                        {waypoint.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h2 className="mb-4 font-semibold">Route Map</h2>
          <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
            <div className="text-center">
              <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Interactive map view would be displayed here
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Integration with mapping service (Google Maps, Mapbox, etc.)
              </p>
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
