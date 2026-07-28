"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, Users, MapPin, TrendingUp, Package } from "lucide-react";
import { DistrictSelector } from "@/components/common";

interface Farmer {
  id: string;
  name: string;
  district: string;
  farmSize: number;
  crops: string[];
  productsListed: number;
  totalSales: number;
  verified: boolean;
}

export default function GovernmentFarmersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const allFarmers = useMemo<Farmer[]>(() => [
    {
      id: "FRM-001",
      name: "Jean Paul Uwimana",
      district: "Kigali",
      farmSize: 5.5,
      crops: ["Vegetables", "Maize"],
      productsListed: 12,
      totalSales: 2500000,
      verified: true
    },
    {
      id: "FRM-002",
      name: "Marie Mukandori",
      district: "Musanze",
      farmSize: 12,
      crops: ["Tea", "Coffee"],
      productsListed: 8,
      totalSales: 5600000,
      verified: true
    },
    {
      id: "FRM-003",
      name: "Emmanuel Nkurunziza",
      district: "Huye",
      farmSize: 8,
      crops: ["Coffee", "Bananas"],
      productsListed: 15,
      totalSales: 3200000,
      verified: false
    }
  ], []);

  const filteredFarmers = useMemo(() => {
    return allFarmers.filter(farmer => {
      const matchesSearch = searchQuery === "" ||
        farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDistrict = districtFilter === "" || farmer.district === districtFilter;
      return matchesSearch && matchesDistrict;
    });
  }, [allFarmers, searchQuery, districtFilter]);

  const totalFarmers = allFarmers.length;
  const verifiedFarmers = allFarmers.filter(f => f.verified).length;
  const totalFarmland = allFarmers.reduce((sum, f) => sum + f.farmSize, 0);
  const totalRevenue = allFarmers.reduce((sum, f) => sum + f.totalSales, 0);

  return (
    <>
      <PageHeader
        title="Registered Farmers"
        description="Monitor farmer registrations and activities"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Farmers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalFarmers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-green-500" />
              <span>Verified</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{verifiedFarmers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Total Farmland</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalFarmland} ha</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalRevenue / 1000000).toFixed(1)}M RWF
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <DistrictSelector
            value={districtFilter}
            onChange={setDistrictFilter}
            placeholder="All Districts"
          />
        </div>

        {/* Farmers Grid */}
        {filteredFarmers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{farmer.name}</h3>
                    <p className="text-sm text-muted-foreground">{farmer.id}</p>
                  </div>
                  {farmer.verified && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                      Verified
                    </span>
                  )}
                </div>

                <div className="mb-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{farmer.district}</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Farm Size</p>
                    <p className="font-medium">{farmer.farmSize} hectares</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Crops</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {farmer.crops.map(crop => (
                        <span
                          key={crop}
                          className="rounded-full bg-secondary px-2 py-0.5 text-xs"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t pt-3">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="h-3 w-3" />
                      <span>Products</span>
                    </div>
                    <p className="mt-1 font-semibold">{farmer.productsListed}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>Sales</span>
                    </div>
                    <p className="mt-1 font-semibold">
                      {(farmer.totalSales / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No farmers found"
            description="No farmers match your search criteria."
            icon={Users}
          />
        )}
      </PageBody>
    </>
  );
}
