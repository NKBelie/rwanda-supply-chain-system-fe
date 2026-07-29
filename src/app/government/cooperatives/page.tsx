"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, Users, MapPin, TrendingUp } from "lucide-react";

interface Cooperative {
  id: string;
  name: string;
  district: string;
  members: number;
  type: string;
  registrationNumber: string;
  established: string;
  totalRevenue: number;
  verified: boolean;
}

export default function GovernmentCooperativesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const allCooperatives = useMemo<Cooperative[]>(() => [
    {
      id: "COOP-001",
      name: "Sunrise Coffee Cooperative",
      district: "Huye",
      members: 156,
      type: "Coffee",
      registrationNumber: "RW-COOP-2020-045",
      established: "2020-05-15",
      totalRevenue: 45000000,
      verified: true
    },
    {
      id: "COOP-002",
      name: "Highland Tea Growers",
      district: "Musanze",
      members: 203,
      type: "Tea",
      registrationNumber: "RW-COOP-2019-089",
      established: "2019-08-20",
      totalRevenue: 67000000,
      verified: true
    },
    {
      id: "COOP-003",
      name: "Valley Fruits Association",
      district: "Kigali",
      members: 87,
      type: "Fruits",
      registrationNumber: "RW-COOP-2022-012",
      established: "2022-02-10",
      totalRevenue: 23000000,
      verified: false
    }
  ], []);

  const filteredCooperatives = useMemo(() => {
    return allCooperatives.filter(coop => {
      const matchesSearch = searchQuery === "" ||
        coop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coop.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "" || coop.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allCooperatives, searchQuery, typeFilter]);

  const cooperativeTypes = Array.from(new Set(allCooperatives.map(c => c.type)));
  const totalCooperatives = allCooperatives.length;
  const totalMembers = allCooperatives.reduce((sum, c) => sum + c.members, 0);
  const verifiedCount = allCooperatives.filter(c => c.verified).length;

  return (
    <>
      <PageHeader
        title="Cooperatives"
        description="Monitor registered agricultural cooperatives"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Cooperatives</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalCooperatives}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Total Members</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalMembers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-green-500" />
              <span>Verified</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{verifiedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cooperatives..."
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
            {cooperativeTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Cooperatives List */}
        {filteredCooperatives.length > 0 ? (
          <div className="space-y-4">
            {filteredCooperatives.map((coop) => (
              <div
                key={coop.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{coop.name}</h3>
                      {coop.verified && (
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {coop.registrationNumber}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {coop.type}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <p className="font-medium">{coop.district}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Members</p>
                    <p className="font-medium">{coop.members}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Established</p>
                    <p className="font-medium">
                      {new Date(coop.established).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <p className="font-medium">
                        {(coop.totalRevenue / 1000000).toFixed(1)}M RWF
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No cooperatives found"
            description="No cooperatives match your search criteria."
            icon={<Users className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
