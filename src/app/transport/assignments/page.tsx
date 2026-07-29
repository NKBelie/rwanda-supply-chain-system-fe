"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, UserCheck, Truck, Calendar, MapPin } from "lucide-react";

interface Assignment {
  id: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  vehicleType: string;
  routeName: string;
  pickup: string;
  delivery: string;
  scheduledDate: string;
  status: "scheduled" | "active" | "completed";
  cargo: string;
}

export default function TransportAssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allAssignments = useMemo<Assignment[]>(() => [
    {
      id: "ASG-001",
      driverName: "Jean Paul Uwimana",
      driverPhone: "+250 788 123 456",
      vehiclePlate: "RAD 123 A",
      vehicleType: "Pickup Truck",
      routeName: "Kigali City Loop",
      pickup: "Kigali, Kicukiro",
      delivery: "Kigali, Nyarugenge",
      scheduledDate: "2026-07-28T09:00:00",
      status: "scheduled",
      cargo: "Fresh Vegetables"
    },
    {
      id: "ASG-002",
      driverName: "Marie Claire Mukandori",
      driverPhone: "+250 788 234 567",
      vehiclePlate: "RAD 456 B",
      vehicleType: "Box Truck",
      routeName: "Kigali-Musanze Express",
      pickup: "Musanze",
      delivery: "Kigali, Gasabo",
      scheduledDate: "2026-07-28T11:00:00",
      status: "active",
      cargo: "Tea Leaves"
    },
    {
      id: "ASG-003",
      driverName: "Emmanuel Nkurunziza",
      driverPhone: "+250 788 345 678",
      vehiclePlate: "RAD 789 C",
      vehicleType: "Van",
      routeName: "Kigali-Huye Route",
      pickup: "Huye, Butare",
      delivery: "Kigali, Kicukiro",
      scheduledDate: "2026-07-27T08:00:00",
      status: "completed",
      cargo: "Coffee Beans"
    }
  ], []);

  const filteredAssignments = useMemo(() => {
    return allAssignments.filter(assignment => {
      const matchesSearch = searchQuery === "" ||
        assignment.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.routeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || assignment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allAssignments, searchQuery, statusFilter]);

  const scheduledCount = allAssignments.filter(a => a.status === "scheduled").length;
  const activeCount = allAssignments.filter(a => a.status === "active").length;
  const completedCount = allAssignments.filter(a => a.status === "completed").length;

  return (
    <>
      <PageHeader
        title="Assignments"
        description="Manage driver and vehicle assignments"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Scheduled</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{scheduledCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-green-500" />
              <span>Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <span>Completed Today</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{completedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search assignments..."
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
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Assignments List */}
        {filteredAssignments.length > 0 ? (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{assignment.id}</h3>
                      <StatusBadge status={assignment.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{assignment.routeName}</p>
                  </div>
                  <UserCheck className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Driver</p>
                    <p className="font-semibold">{assignment.driverName}</p>
                    <p className="text-sm text-muted-foreground">{assignment.driverPhone}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Vehicle</p>
                    <p className="font-semibold">{assignment.vehiclePlate}</p>
                    <p className="text-sm text-muted-foreground">{assignment.vehicleType}</p>
                  </div>
                </div>

                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="text-sm font-medium">{assignment.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="text-sm font-medium">{assignment.delivery}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Scheduled: {new Date(assignment.scheduledDate).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    <span>{assignment.cargo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No assignments found"
            description="No assignments match your search criteria."
            icon={<UserCheck className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
