"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Building2, Package, TrendingUp, MapPin } from "lucide-react";

interface Manufacturer {
  id: string;
  name: string;
  district: string;
  type: string;
  capacity: number;
  productsManufactured: number;
  status: "active" | "maintenance" | "inactive";
  certifications: string[];
  employees: number;
}

export default function GovernmentManufacturersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allManufacturers = useMemo<Manufacturer[]>(() => [
    {
      id: "MFG-001",
      name: "Highland Tea Processing Plant",
      district: "Musanze",
      type: "Tea Processing",
      capacity: 5000,
      productsManufactured: 45,
      status: "active",
      certifications: ["ISO 9001", "HACCP"],
      employees: 120
    },
    {
      id: "MFG-002",
      name: "Sunrise Coffee Roastery",
      district: "Huye",
      type: "Coffee Processing",
      capacity: 3000,
      productsManufactured: 28,
      status: "active",
      certifications: ["Fair Trade", "Organic"],
      employees: 85
    },
    {
      id: "MFG-003",
      name: "Valley Foods Processing",
      district: "Kigali",
      type: "Food Processing",
      capacity: 8000,
      productsManufactured: 67,
      status: "maintenance",
      certifications: ["ISO 22000"],
      employees: 200
    }
  ], []);

  const filteredManufacturers = useMemo(() => {
    return allManufacturers.filter(mfg => {
      const matchesSearch = searchQuery === "" ||
        mfg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mfg.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || mfg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allManufacturers, searchQuery, statusFilter]);

  const activeCount = allManufacturers.filter(m => m.status === "active").length;
  const totalCapacity = allManufacturers.reduce((sum, m) => sum + m.capacity, 0);
  const totalEmployees = allManufacturers.reduce((sum, m) => sum + m.employees, 0);

  return (
    <>
      <PageHeader
        title="Manufacturers"
        description="Monitor manufacturing facilities"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Total Facilities</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{allManufacturers.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-green-500" />
              <span>Active</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Capacity</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalCapacity.toLocaleString()} MT</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total Employees</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalEmployees}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search manufacturers..."
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
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Manufacturers List */}
        {filteredManufacturers.length > 0 ? (
          <div className="space-y-4">
            {filteredManufacturers.map((mfg) => (
              <div
                key={mfg.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{mfg.name}</h3>
                      <StatusBadge status={mfg.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{mfg.id}</p>
                  </div>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="mb-3 grid gap-3 md:grid-cols-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{mfg.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <p className="font-medium">{mfg.district}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-medium">{mfg.capacity.toLocaleString()} MT/month</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employees</p>
                    <p className="font-medium">{mfg.employees}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Certifications</p>
                    <div className="flex flex-wrap gap-1">
                      {mfg.certifications.map(cert => (
                        <span
                          key={cert}
                          className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Products</p>
                    <p className="text-lg font-bold">{mfg.productsManufactured}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No manufacturers found"
            description="No manufacturers match your search criteria."
            icon={<Building2 className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
