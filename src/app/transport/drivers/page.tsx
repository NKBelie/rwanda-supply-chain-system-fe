"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, User, Phone, Mail, Truck, Star, Plus } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  rating: number;
  totalDeliveries: number;
  status: "available" | "on_delivery" | "off_duty";
  vehicleType: string;
  joinedDate: string;
}

export default function TransportDriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allDrivers = useMemo<Driver[]>(() => [
    {
      id: "DRV-001",
      name: "Jean Paul Uwimana",
      phone: "+250 788 123 456",
      email: "jp.uwimana@example.com",
      licenseNumber: "RW-DL-12345",
      rating: 4.8,
      totalDeliveries: 156,
      status: "available",
      vehicleType: "Pickup Truck",
      joinedDate: "2025-03-15"
    },
    {
      id: "DRV-002",
      name: "Marie Claire Mukandori",
      phone: "+250 788 234 567",
      email: "mc.mukandori@example.com",
      licenseNumber: "RW-DL-23456",
      rating: 4.9,
      totalDeliveries: 203,
      status: "on_delivery",
      vehicleType: "Box Truck",
      joinedDate: "2024-11-20"
    },
    {
      id: "DRV-003",
      name: "Emmanuel Nkurunziza",
      phone: "+250 788 345 678",
      email: "e.nkurunziza@example.com",
      licenseNumber: "RW-DL-34567",
      rating: 4.7,
      totalDeliveries: 98,
      status: "available",
      vehicleType: "Van",
      joinedDate: "2025-06-10"
    },
    {
      id: "DRV-004",
      name: "Claudine Umutoni",
      phone: "+250 788 456 789",
      email: "c.umutoni@example.com",
      licenseNumber: "RW-DL-45678",
      rating: 5.0,
      totalDeliveries: 187,
      status: "off_duty",
      vehicleType: "Flatbed Truck",
      joinedDate: "2025-01-05"
    }
  ], []);

  const filteredDrivers = useMemo(() => {
    return allDrivers.filter(driver => {
      const matchesSearch = searchQuery === "" ||
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone.includes(searchQuery) ||
        driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || driver.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allDrivers, searchQuery, statusFilter]);

  const availableDrivers = allDrivers.filter(d => d.status === "available").length;
  const onDeliveryDrivers = allDrivers.filter(d => d.status === "on_delivery").length;
  const avgRating = allDrivers.reduce((sum, d) => sum + d.rating, 0) / allDrivers.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500/10 text-green-500";
      case "on_delivery":
        return "bg-blue-500/10 text-blue-500";
      case "off_duty":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleAddDriver = () => {
    alert("Add new driver form would open here");
  };

  return (
    <>
      <PageHeader
        title="Drivers"
        description="Manage your driver fleet"
        action={{
          label: "Add Driver",
          onClick: handleAddDriver,
          icon: Plus
        }}
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Total Drivers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{allDrivers.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-green-500" />
              <span>Available</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{availableDrivers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Average Rating</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{avgRating.toFixed(1)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search drivers..."
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
            <option value="on_delivery">On Delivery</option>
            <option value="off_duty">Off Duty</option>
          </select>
        </div>

        {/* Drivers Grid */}
        {filteredDrivers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{driver.name}</h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusColor(
                        driver.status
                      )}`}
                    >
                      {driver.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{driver.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5" />
                    <span>{driver.vehicleType}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>Rating</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold">{driver.rating}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="h-3 w-3" />
                      <span>Deliveries</span>
                    </div>
                    <p className="mt-1 text-lg font-semibold">{driver.totalDeliveries}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Joined: {new Date(driver.joinedDate).toLocaleDateString()}
                </div>

                <button className="mt-4 flex h-9 w-full items-center justify-center rounded-md border bg-background text-sm font-medium hover:bg-accent">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No drivers found"
            description="No drivers match your search criteria."
            icon={User}
          />
        )}
      </PageBody>
    </>
  );
}
