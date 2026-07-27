"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MapPin,
  Calendar
} from "lucide-react";
import { DistrictSelector } from "@/components/common";
import { districts } from "@/constants/locations";

interface MarketPrice {
  id: string;
  productName: string;
  category: string;
  currentPrice: number;
  previousPrice: number;
  district: string;
  market: string;
  unit: string;
  lastUpdated: string;
  trend: "up" | "down" | "stable";
}

export default function FarmerPricesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Mock market price data
  const allPrices = useMemo<MarketPrice[]>(() => [
    {
      id: "1",
      productName: "Coffee Beans (Arabica)",
      category: "Coffee",
      currentPrice: 3500,
      previousPrice: 3200,
      district: "Kigali",
      market: "Kimironko Market",
      unit: "kg",
      lastUpdated: "2026-07-26",
      trend: "up"
    },
    {
      id: "2",
      productName: "Tea Leaves",
      category: "Tea",
      currentPrice: 1200,
      previousPrice: 1200,
      district: "Kigali",
      market: "Kimironko Market",
      unit: "kg",
      lastUpdated: "2026-07-26",
      trend: "stable"
    },
    {
      id: "3",
      productName: "Irish Potatoes",
      category: "Vegetables",
      currentPrice: 450,
      previousPrice: 500,
      district: "Musanze",
      market: "Musanze Market",
      unit: "kg",
      lastUpdated: "2026-07-25",
      trend: "down"
    },
    {
      id: "4",
      productName: "Maize",
      category: "Grains",
      currentPrice: 600,
      previousPrice: 550,
      district: "Kigali",
      market: "Nyabugogo Market",
      unit: "kg",
      lastUpdated: "2026-07-26",
      trend: "up"
    },
    {
      id: "5",
      productName: "Bananas",
      category: "Fruits",
      currentPrice: 800,
      previousPrice: 850,
      district: "Huye",
      market: "Butare Market",
      unit: "bunch",
      lastUpdated: "2026-07-25",
      trend: "down"
    },
    {
      id: "6",
      productName: "Rice",
      category: "Grains",
      currentPrice: 1100,
      previousPrice: 1100,
      district: "Kigali",
      market: "Kimironko Market",
      unit: "kg",
      lastUpdated: "2026-07-26",
      trend: "stable"
    },
    {
      id: "7",
      productName: "Tomatoes",
      category: "Vegetables",
      currentPrice: 700,
      previousPrice: 650,
      district: "Musanze",
      market: "Musanze Market",
      unit: "kg",
      lastUpdated: "2026-07-25",
      trend: "up"
    },
    {
      id: "8",
      productName: "Cassava Flour",
      category: "Grains",
      currentPrice: 550,
      previousPrice: 600,
      district: "Huye",
      market: "Butare Market",
      unit: "kg",
      lastUpdated: "2026-07-25",
      trend: "down"
    }
  ], []);

  const categories = useMemo(() => {
    return Array.from(new Set(allPrices.map(p => p.category))).sort();
  }, [allPrices]);

  const filteredPrices = useMemo(() => {
    return allPrices.filter(price => {
      const matchesSearch = searchQuery === "" || 
        price.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        price.market.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDistrict = selectedDistrict === "" || price.district === selectedDistrict;
      const matchesCategory = selectedCategory === "" || price.category === selectedCategory;

      return matchesSearch && matchesDistrict && matchesCategory;
    });
  }, [allPrices, searchQuery, selectedDistrict, selectedCategory]);

  const avgPrice = useMemo(() => {
    if (filteredPrices.length === 0) return 0;
    return filteredPrices.reduce((sum, p) => sum + p.currentPrice, 0) / filteredPrices.length;
  }, [filteredPrices]);

  const pricesUp = filteredPrices.filter(p => p.trend === "up").length;
  const pricesDown = filteredPrices.filter(p => p.trend === "down").length;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getPriceChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <>
      <PageHeader
        title="Market Prices"
        description="View current market prices and trends across Rwanda"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Average Price</p>
            <p className="mt-1 text-2xl font-bold">
              RWF {avgPrice.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Prices Up</p>
            <div className="mt-1 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <p className="text-2xl font-bold">{pricesUp}</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Prices Down</p>
            <div className="mt-1 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <p className="text-2xl font-bold">{pricesDown}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products or markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <DistrictSelector
            value={selectedDistrict}
            onChange={setSelectedDistrict}
            placeholder="All Districts"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDistrict("");
              setSelectedCategory("");
            }}
            className="h-10 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
          </button>
        </div>

        {/* Price List */}
        {filteredPrices.length > 0 ? (
          <div className="space-y-3">
            {filteredPrices.map((price) => {
              const priceChange = getPriceChange(price.currentPrice, price.previousPrice);
              
              return (
                <div
                  key={price.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="font-semibold">{price.productName}</h3>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                        {price.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{price.market}, {price.district}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Updated {new Date(price.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        RWF {price.currentPrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per {price.unit}
                      </div>
                    </div>

                    <div className="flex min-w-[100px] items-center justify-end gap-2">
                      {getTrendIcon(price.trend)}
                      {price.trend !== "stable" && (
                        <span className={`text-sm font-medium ${getTrendColor(price.trend)}`}>
                          {priceChange > 0 ? "+" : ""}{priceChange.toFixed(1)}%
                        </span>
                      )}
                      {price.trend === "stable" && (
                        <span className="text-sm text-muted-foreground">No change</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No market prices found"
            description="Try adjusting your filters or check back later for updated prices."
            icon={Search}
          />
        )}
      </PageBody>
    </>
  );
}
