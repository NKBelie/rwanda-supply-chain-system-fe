"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Warehouse, Search, MapPin, Package, DollarSign } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { DistrictSelector } from "@/components/common";
import { warehouseService } from "@/services/data.service";
import { findNearestDistricts } from "@/constants/locations";

export default function FarmerWarehousePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>();
  const [sortBy, setSortBy] = useState<"distance" | "price" | "rating">("distance");

  // Get all warehouses
  const allWarehouses = useMemo(() => warehouseService.getAll(), []);

  // Filter and sort warehouses
  const filteredWarehouses = useMemo(() => {
    let filtered = allWarehouses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(warehouse =>
        warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.sector?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // District filter
    if (selectedDistrict) {
      filtered = filtered.filter(warehouse =>
        warehouse.district === selectedDistrict
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
        case "rating":
        case "distance":
        default:
          // Simple alphabetical sort by name/district as proxy
          return a.name.localeCompare(b.name);
      }
    });
  }, [allWarehouses, searchQuery, selectedDistrict, sortBy]);

  const handleBookWarehouse = (id: string) => {
    router.push(`/farmer/warehouse/${id}/book`);
  };

  const handleViewWarehouse = (id: string) => {
    router.push(`/farmer/warehouse/${id}`);
  };

  const getAvailabilityPercentage = (warehouse: any) => {
    if (!warehouse.capacity) return 0;
    const available = warehouse.availableSpace || 0;
    return Math.round((available / warehouse.capacity) * 100);
  };

  return (
    <>
      <PageHeader
        title="Find Warehouse"
        description="Search and book warehouse space for your products"
      />

      <PageBody>
        {/* Search and Filters */}
        <div className="mb-6 rounded-lg border border-border bg-background p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search warehouses by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* District Filter */}
            <DistrictSelector
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              placeholder="Filter by District"
              showAllOption
            />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="distance">Sort by Distance</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>

          {(searchQuery || selectedDistrict) && (
            <div className="mt-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDistrict(undefined);
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Found {filteredWarehouses.length} warehouse{filteredWarehouses.length !== 1 ? "s" : ""}
            {selectedDistrict && " in selected district"}
          </p>
        </div>

        {/* Warehouses Grid */}
        {filteredWarehouses.length === 0 ? (
          <EmptyState
            icon={<Warehouse className="h-12 w-12" />}
            title="No warehouses found"
            description={
              searchQuery || selectedDistrict
                ? "Try adjusting your search or filters"
                : "No warehouses available at the moment"
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWarehouses.map((warehouse) => {
              const availabilityPercentage = getAvailabilityPercentage(warehouse);

              return (
                <div
                  key={warehouse.id}
                  className="rounded-lg border border-border bg-background shadow-sm transition-all hover:shadow-md"
                >
                  {/* Header */}
                  <div className="border-b border-border p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Warehouse className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {warehouse.name}
                          </h3>
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {warehouse.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {[warehouse.district, warehouse.sector, warehouse.cell].filter(Boolean).join(", ")}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-3">
                    {/* Capacity */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Availability</span>
                        <span className={`font-medium ${
                          availabilityPercentage > 50
                            ? "text-emerald-600"
                            : availabilityPercentage > 20
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}>
                          {availabilityPercentage}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div
                          className={`h-full ${
                            availabilityPercentage > 50
                              ? "bg-emerald-500"
                              : availabilityPercentage > 20
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${availabilityPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Storage Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Capacity</p>
                        <p className="font-medium text-foreground">
                          {warehouse.capacity?.toLocaleString()} m³
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available</p>
                        <p className="font-medium text-foreground">
                          {warehouse.availableSpace?.toLocaleString()} m³
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 rounded-lg bg-surface/50 p-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Contact for pricing
                      </span>
                    </div>

                    {/* Conditions */}
                    {warehouse.conditions && warehouse.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {warehouse.conditions.slice(0, 3).map((condition, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {condition}
                          </span>
                        ))}
                        {warehouse.conditions.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            +{warehouse.conditions.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-border p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewWarehouse(warehouse.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleBookWarehouse(warehouse.id)}
                        disabled={availabilityPercentage === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Package className="h-4 w-4" />
                        Book Space
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
