"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Building2, MapPin, Phone, CheckCircle } from "lucide-react";

interface Business {
  id: string;
  name: string;
  type: string;
  district: string;
  registrationNumber: string;
  status: "active" | "pending" | "suspended";
  registeredDate: string;
  employees: number;
  contact: string;
}

export default function GovernmentBusinessesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allBusinesses = useMemo<Business[]>(() => [
    {
      id: "BUS-001",
      name: "Green Valley Agro Ltd",
      type: "Farm",
      district: "Kigali",
      registrationNumber: "RW-BN-2023-001",
      status: "active",
      registeredDate: "2023-03-15",
      employees: 45,
      contact: "+250 788 123 456"
    },
    {
      id: "BUS-002",
      name: "Highland Tea Processing",
      type: "Manufacturer",
      district: "Musanze",
      registrationNumber: "RW-BN-2022-089",
      status: "active",
      registeredDate: "2022-08-20",
      employees: 120,
      contact: "+250 788 234 567"
    },
    {
      id: "BUS-003",
      name: "Central Storage Solutions",
      type: "Warehouse",
      district: "Kigali",
      registrationNumber: "RW-BN-2024-015",
      status: "pending",
      registeredDate: "2024-01-10",
      employees: 25,
      contact: "+250 788 345 678"
    }
  ], []);

  const filteredBusinesses = useMemo(() => {
    return allBusinesses.filter(business => {
      const matchesSearch = searchQuery === "" ||
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "" || business.type === typeFilter;
      const matchesStatus = statusFilter === "" || business.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allBusinesses, searchQuery, typeFilter, statusFilter]);

  const businessTypes = Array.from(new Set(allBusinesses.map(b => b.type)));
  const activeCount = allBusinesses.filter(b => b.status === "active").length;
  const pendingCount = allBusinesses.filter(b => b.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Registered Businesses"
        description="Monitor registered agricultural businesses"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Total Businesses</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{allBusinesses.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-yellow-500" />
              <span>Pending Verification</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Types</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Businesses List */}
        {filteredBusinesses.length > 0 ? (
          <div className="space-y-4">
            {filteredBusinesses.map((business) => (
              <div
                key={business.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{business.name}</h3>
                      <StatusBadge status={business.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {business.registrationNumber}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{business.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <p className="font-medium">{business.district}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employees</p>
                    <p className="font-medium">{business.employees}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Registered</p>
                    <p className="font-medium">
                      {new Date(business.registeredDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{business.contact}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No businesses found"
            description="No businesses match your search criteria."
            icon={<Building2 className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
