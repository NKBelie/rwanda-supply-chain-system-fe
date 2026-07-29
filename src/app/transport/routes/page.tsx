"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, MapPin, Navigation, Plus, Clock } from "lucide-react";

interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedDuration: string;
  waypoints: number;
  frequency: string;
  status: "active" | "inactive";
}

export default function TransportRoutesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allRoutes = useMemo<Route[]>(() => [
    {
      id: "RT-001",
      name: "Kigali-Musanze Express",
      origin: "Kigali",
      destination: "Musanze",
      distance: 95,
      estimatedDuration: "2h",
      waypoints: 3,
      frequency: "Daily",
      status: "active"
    },
    {
      id: "RT-002",
      name: "Kigali-Huye Route",
      origin: "Kigali",
      destination: "Huye",
      distance: 135,
      estimatedDuration: "2h 30min",
      waypoints: 4,
      frequency: "Daily",
      status: "active"
    },
    {
      id: "RT-003",
      name: "Kigali City Loop",
      origin: "Kigali (Kicukiro)",
      destination: "Kigali (Nyarugenge)",
      distance: 12,
      estimatedDuration: "45min",
      waypoints: 5,
      frequency: "Multiple times daily",
      status: "active"
    },
    {
      id: "RT-004",
      name: "Eastern Corridor",
      origin: "Kigali",
      destination: "Rwamagana",
      distance: 52,
      estimatedDuration: "1h 15min",
      waypoints: 2,
      frequency: "Weekly",
      status: "inactive"
    }
  ], []);

  const filteredRoutes = useMemo(() => {
    return allRoutes.filter(route => {
      const matchesSearch = searchQuery === "" ||
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || route.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allRoutes, searchQuery, statusFilter]);

  const activeRoutes = allRoutes.filter(r => r.status === "active").length;
  const totalDistance = allRoutes.reduce((sum, r) => sum + r.distance, 0);

  const handleAddRoute = () => {
    alert("Add new route form would open here");
  };

  return (
    <>
      <PageHeader
        title="Routes"
        description="Manage transportation routes"
        actions={
          <button
            onClick={handleAddRoute}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Route
          </button>
        }
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Navigation className="h-4 w-4" />
              <span>Total Routes</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{allRoutes.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Navigation className="h-4 w-4 text-green-500" />
              <span>Active Routes</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeRoutes}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Total Distance</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalDistance} km</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search routes..."
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
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Routes List */}
        {filteredRoutes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{route.name}</h3>
                    <p className="text-sm text-muted-foreground">{route.id}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      route.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {route.status}
                  </span>
                </div>

                <div className="mb-4 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{route.origin}</span>
                    </div>
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{route.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-semibold">{route.distance} km</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Est. Duration</p>
                    <p className="font-semibold">{route.estimatedDuration}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Waypoints</p>
                    <p className="font-semibold">{route.waypoints}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Frequency</p>
                    <p className="font-semibold">{route.frequency}</p>
                  </div>
                </div>

                <button className="mt-4 flex h-9 w-full items-center justify-center rounded-md border bg-background text-sm font-medium hover:bg-accent">
                  View Route Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No routes found"
            description="No routes match your search criteria."
            icon={<Navigation className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
