"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { TrendingUp, Package, Users, DollarSign, BarChart3, Calendar } from "lucide-react";

export default function GovernmentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("year");

  const analyticsData = {
    totalProduction: 45600,
    productionGrowth: 12.5,
    registeredEntities: 1247,
    entitiesGrowth: 8.2,
    totalRevenue: 156000000,
    revenueGrowth: 15.3,
    exportValue: 89000000,
    exportGrowth: 18.7
  };

  const sectorPerformance = [
    { sector: "Coffee", value: 35, growth: 15, color: "bg-blue-500" },
    { sector: "Tea", value: 28, growth: 12, color: "bg-green-500" },
    { sector: "Horticulture", value: 22, growth: 20, color: "bg-yellow-500" },
    { sector: "Grains", value: 15, growth: 8, color: "bg-purple-500" }
  ];

  const monthlyTrends = [
    { month: "Jan", production: 3500, revenue: 12000000 },
    { month: "Feb", production: 3800, revenue: 13500000 },
    { month: "Mar", production: 4200, revenue: 15000000 },
    { month: "Apr", production: 4500, revenue: 16200000 },
    { month: "May", production: 4100, revenue: 14800000 },
    { month: "Jun", production: 4400, revenue: 15800000 }
  ];

  return (
    <>
      <PageHeader
        title="Analytics & Insights"
        description="Agricultural sector performance analytics"
      />
      <PageBody>
        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Production</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{analyticsData.totalProduction.toLocaleString()} MT</p>
            <div className="mt-1 flex items-center text-sm text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+{analyticsData.productionGrowth}%</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Registered Entities</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{analyticsData.registeredEntities.toLocaleString()}</p>
            <div className="mt-1 flex items-center text-sm text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+{analyticsData.entitiesGrowth}%</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(analyticsData.totalRevenue / 1000000).toFixed(0)}M RWF
            </p>
            <div className="mt-1 flex items-center text-sm text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+{analyticsData.revenueGrowth}%</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Export Value</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(analyticsData.exportValue / 1000000).toFixed(0)}M RWF
            </p>
            <div className="mt-1 flex items-center text-sm text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+{analyticsData.exportGrowth}%</span>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sector Performance */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 font-semibold">Sector Performance</h3>
            <div className="space-y-4">
              {sectorPerformance.map((sector) => (
                <div key={sector.sector}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{sector.sector}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{sector.value}%</span>
                      <span className="text-xs text-green-500">+{sector.growth}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${sector.color} transition-all`}
                      style={{ width: `${sector.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 font-semibold">Production & Revenue Trends</h3>
            <div className="space-y-3">
              {monthlyTrends.map((month) => (
                <div key={month.month} className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{month.month}</span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Production</p>
                      <p className="font-semibold">{month.production.toLocaleString()} MT</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold">
                        {(month.revenue / 1000000).toFixed(1)}M RWF
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Comparison */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h3 className="mb-4 font-semibold">Regional Performance Comparison</h3>
          <div className="grid gap-4 md:grid-cols-5">
            {["Kigali", "Northern", "Southern", "Eastern", "Western"].map((region) => (
              <div key={region} className="rounded-lg bg-muted/50 p-4">
                <p className="mb-3 font-medium">{region}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Farmers</span>
                    <span className="font-semibold">{Math.floor(Math.random() * 200 + 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-semibold">{Math.floor(Math.random() * 30 + 20)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Growth</span>
                    <span className="font-semibold text-green-500">
                      +{Math.floor(Math.random() * 15 + 5)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
}
