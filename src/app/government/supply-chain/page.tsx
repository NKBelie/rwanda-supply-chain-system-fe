"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { TrendingUp, Package, Truck, Warehouse, AlertTriangle } from "lucide-react";

export default function GovernmentSupplyChainPage() {
  const [timeRange, setTimeRange] = useState("month");

  const supplyChainStats = {
    totalTransactions: 1247,
    activeShipments: 34,
    warehousesOperating: 23,
    averageDeliveryTime: "2.5 days",
    supplyChainEfficiency: 87
  };

  const recentAlerts = [
    { id: 1, type: "delay", message: "Coffee shipment delayed in Huye district", severity: "medium" },
    { id: 2, type: "shortage", message: "Low stock of fertilizer in Northern Province", severity: "high" },
    { id: 3, type: "quality", message: "Quality inspection required for Tea batch #TB-2045", severity: "low" }
  ];

  const supplyChainFlow = [
    { stage: "Production", value: 1200, status: "healthy" },
    { stage: "Collection", value: 1150, status: "healthy" },
    { stage: "Processing", value: 1100, status: "warning" },
    { stage: "Storage", value: 1080, status: "healthy" },
    { stage: "Distribution", value: 1050, status: "healthy" },
    { stage: "Retail", value: 1000, status: "healthy" }
  ];

  return (
    <>
      <PageHeader
        title="Supply Chain Monitoring"
        description="Monitor agricultural supply chain operations across Rwanda"
      />
      <PageBody>
        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Transactions</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{supplyChainStats.totalTransactions.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>Active Shipments</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{supplyChainStats.activeShipments}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Warehouse className="h-4 w-4 text-green-500" />
              <span>Warehouses</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{supplyChainStats.warehousesOperating}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Avg Delivery</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{supplyChainStats.averageDeliveryTime}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>⚡</span>
              <span>Efficiency</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{supplyChainStats.supplyChainEfficiency}%</p>
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
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Supply Chain Flow */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 font-semibold">Supply Chain Flow</h3>
            <div className="space-y-4">
              {supplyChainFlow.map((stage, index) => {
                const maxValue = Math.max(...supplyChainFlow.map(s => s.value));
                const percentage = (stage.value / maxValue) * 100;
                const dropoff = index > 0 ? supplyChainFlow[index - 1].value - stage.value : 0;

                return (
                  <div key={stage.stage}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{stage.value} units</span>
                        {dropoff > 0 && (
                          <span className="text-xs text-red-500">-{dropoff}</span>
                        )}
                      </div>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full transition-all ${
                          stage.status === "healthy"
                            ? "bg-green-500"
                            : stage.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 font-semibold">Recent Alerts</h3>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-lg p-3 ${
                    alert.severity === "high"
                      ? "bg-red-500/10 border border-red-500/20"
                      : alert.severity === "medium"
                      ? "bg-yellow-500/10 border border-yellow-500/20"
                      : "bg-blue-500/10 border border-blue-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`h-5 w-5 mt-0.5 ${
                        alert.severity === "high"
                          ? "text-red-500"
                          : alert.severity === "medium"
                          ? "text-yellow-500"
                          : "text-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          alert.severity === "high"
                            ? "bg-red-500/20 text-red-600 dark:text-red-400"
                            : alert.severity === "medium"
                            ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                            : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {alert.severity} priority
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Overview */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h3 className="mb-4 font-semibold">Regional Supply Chain Activity</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {["Kigali City", "Northern Province", "Southern Province", "Eastern Province"].map(
              (region) => (
                <div key={region} className="rounded-lg bg-muted/50 p-4">
                  <p className="mb-2 font-medium">{region}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 50 + 50)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="font-semibold">{Math.floor(Math.random() * 20 + 75)}%</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}
