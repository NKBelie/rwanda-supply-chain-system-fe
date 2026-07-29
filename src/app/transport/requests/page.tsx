"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Truck, MapPin, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";

interface TransportRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  pickup: { location: string; district: string; address: string };
  delivery: { location: string; district: string; address: string };
  cargo: string;
  weight: number;
  distance: number;
  requestedDate: string;
  estimatedCost: number;
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
  priority: "normal" | "urgent";
}

export default function TransportRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allRequests = useMemo<TransportRequest[]>(() => [
    {
      id: "REQ-001",
      clientName: "Green Valley Farm",
      clientPhone: "+250 788 123 456",
      pickup: { location: "Farm Warehouse", district: "Kigali", address: "KN 4 Ave, Kicukiro" },
      delivery: { location: "City Market", district: "Kigali", address: "KG 11 Ave, Nyarugenge" },
      cargo: "Fresh Vegetables",
      weight: 250,
      distance: 12.5,
      requestedDate: "2026-07-28",
      estimatedCost: 15000,
      status: "pending",
      priority: "normal"
    },
    {
      id: "REQ-002",
      clientName: "Highland Tea Estate",
      clientPhone: "+250 788 234 567",
      pickup: { location: "Tea Processing", district: "Musanze", address: "RN4 Highway" },
      delivery: { location: "Export Facility", district: "Kigali", address: "KG 7 Ave, Gasabo" },
      cargo: "Tea Leaves",
      weight: 300,
      distance: 95,
      requestedDate: "2026-07-28",
      estimatedCost: 65000,
      status: "assigned",
      priority: "urgent"
    },
    {
      id: "REQ-003",
      clientName: "Sunrise Coffee Cooperative",
      clientPhone: "+250 788 345 678",
      pickup: { location: "Coffee Station", district: "Huye", address: "Butare Town" },
      delivery: { location: "Processing Plant", district: "Kigali", address: "KK 15 Ave" },
      cargo: "Coffee Beans",
      weight: 500,
      distance: 135,
      requestedDate: "2026-07-29",
      estimatedCost: 85000,
      status: "in_progress",
      priority: "normal"
    }
  ], []);

  const filteredRequests = useMemo(() => {
    return allRequests.filter(req => {
      const matchesSearch = searchQuery === "" ||
        req.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allRequests, searchQuery, statusFilter]);

  const pendingRequests = allRequests.filter(r => r.status === "pending").length;
  const assignedRequests = allRequests.filter(r => r.status === "assigned").length;
  const totalRevenue = allRequests
    .filter(r => r.status === "completed")
    .reduce((sum, r) => sum + r.estimatedCost, 0);

  const handleAssign = (id: string) => {
    alert(`Assigning driver to request ${id}`);
  };

  const handleCancel = (id: string) => {
    alert(`Cancelling request ${id}`);
  };

  return (
    <>
      <PageHeader
        title="Transport Requests"
        description="Manage incoming transport requests"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Pending Requests</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{pendingRequests}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Assigned</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{assignedRequests}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">RWF {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search requests..."
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
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Requests List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className={`rounded-lg border bg-card p-5 ${
                  req.priority === "urgent" ? "border-orange-500 border-l-4" : ""
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{req.id}</h3>
                      <StatusBadge status={req.status} />
                      {req.priority === "urgent" && (
                        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{req.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      RWF {req.estimatedCost.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{req.distance} km</p>
                  </div>
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>Pickup</span>
                    </div>
                    <p className="font-medium">{req.pickup.location}</p>
                    <p className="text-sm text-muted-foreground">{req.pickup.address}, {req.pickup.district}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span>Delivery</span>
                    </div>
                    <p className="font-medium">{req.delivery.location}</p>
                    <p className="text-sm text-muted-foreground">{req.delivery.address}, {req.delivery.district}</p>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Requested: {new Date(req.requestedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>{req.weight} kg - {req.cargo}</span>
                  </div>
                </div>

                {req.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAssign(req.id)}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Assign Driver
                    </button>
                    <button
                      onClick={() => handleCancel(req.id)}
                      className="flex h-10 items-center gap-2 rounded-md border px-6 text-sm font-medium hover:bg-accent"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No transport requests found"
            description="No requests match your current filters."
            icon={<Truck className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
