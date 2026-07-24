"use client";
import { useState } from "react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  PackageCheck,
  Target,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  totalCapacity: number;
  usedCapacity: number;
  capacityChange: number;
  incomingGoods: number;
  incomingChange: number;
  outgoingGoods: number;
  outgoingChange: number;
  averageTurnaround: number;
  turnaroundChange: number;
}

interface StorageData {
  month: string;
  incoming: number;
  outgoing: number;
  capacity: number;
}

interface ProductStorage {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  percentage: number;
}

interface CategoryBreakdown {
  category: string;
  quantity: number;
  percentage: number;
  color: string;
}

const mockAnalytics: AnalyticsData = {
  totalCapacity: 5000,
  usedCapacity: 3750,
  capacityChange: 8.5,
  incomingGoods: 45,
  incomingChange: 12.3,
  outgoingGoods: 38,
  outgoingChange: -5.2,
  averageTurnaround: 3.5,
  turnaroundChange: -15.4,
};

const mockStorageData: StorageData[] = [
  { month: "Jul", incoming: 42, outgoing: 38, capacity: 3200 },
  { month: "Aug", incoming: 48, outgoing: 41, capacity: 3450 },
  { month: "Sep", incoming: 45, outgoing: 43, capacity: 3600 },
  { month: "Oct", incoming: 52, outgoing: 45, capacity: 3800 },
  { month: "Nov", incoming: 47, outgoing: 40, capacity: 3650 },
  { month: "Dec", incoming: 45, outgoing: 38, capacity: 3750 },
];

const mockProductStorage: ProductStorage[] = [
  { name: "Premium Maize", category: "Cereals", quantity: 1200, unit: "kg", percentage: 32 },
  { name: "Coffee Beans", category: "Cash Crops", quantity: 800, unit: "kg", percentage: 21.3 },
  { name: "Tomatoes", category: "Vegetables", quantity: 600, unit: "kg", percentage: 16 },
  { name: "Rice", category: "Cereals", quantity: 500, unit: "kg", percentage: 13.3 },
  { name: "Milk", category: "Dairy", quantity: 400, unit: "liters", percentage: 10.7 },
  { name: "Bananas", category: "Fruits", quantity: 250, unit: "kg", percentage: 6.7 },
];

const mockCategoryBreakdown: CategoryBreakdown[] = [
  { category: "Cereals", quantity: 1700, percentage: 45.3, color: "bg-emerald-500" },
  { category: "Cash Crops", quantity: 800, percentage: 21.3, color: "bg-sky-500" },
  { category: "Vegetables", quantity: 600, percentage: 16.0, color: "bg-amber-500" },
  { category: "Dairy", quantity: 400, percentage: 10.7, color: "bg-purple-500" },
  { category: "Fruits", quantity: 250, percentage: 6.7, color: "bg-pink-500" },
];

export default function WarehouseAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const timeRangeLabels = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
  };

  const capacityPercentage = (mockAnalytics.usedCapacity / mockAnalytics.totalCapacity) * 100;

  return (
    <>
      <PageHeader
        title="Warehouse Analytics"
        description="Track warehouse performance, capacity utilization, and inventory trends."
        crumbs={[{ label: "Warehouse", href: "/warehouse/dashboard" }, { label: "Analytics" }]}
        actions={
          <div className="flex gap-2">
            {(["7d", "30d", "90d", "1y"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                  timeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-surface"
                )}
              >
                {timeRangeLabels[range]}
              </button>
            ))}
          </div>
        }
      />
      <PageBody>
        {/* Key Metrics */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Capacity Used</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {capacityPercentage.toFixed(1)}%
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.capacityChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.capacityChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {mockAnalytics.capacityChange > 0 && "+"}
                      {mockAnalytics.capacityChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Incoming Goods</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{mockAnalytics.incomingGoods}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.incomingChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.incomingChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {mockAnalytics.incomingChange > 0 && "+"}
                      {mockAnalytics.incomingChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-sky-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Outgoing Goods</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{mockAnalytics.outgoingGoods}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.outgoingChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.outgoingChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {mockAnalytics.outgoingChange > 0 && "+"}
                      {mockAnalytics.outgoingChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <Truck className="h-8 w-8 text-amber-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Avg. Turnaround</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {mockAnalytics.averageTurnaround}d
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.turnaroundChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-red-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-emerald-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.turnaroundChange > 0 ? "text-red-600" : "text-emerald-600"
                      )}
                    >
                      {mockAnalytics.turnaroundChange > 0 && "+"}
                      {mockAnalytics.turnaroundChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-purple-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Trend Chart */}
        <Card className="mb-6 border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Storage Activity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
                {mockStorageData.map((data, idx) => {
                  const maxValue = Math.max(...mockStorageData.map((d) => Math.max(d.incoming, d.outgoing)));
                  const incomingHeight = (data.incoming / maxValue) * 100;
                  const outgoingHeight = (data.outgoing / maxValue) * 100;

                  return (
                    <div key={idx} className="group relative flex flex-1 flex-col items-center gap-2">
                      <div className="relative w-full flex gap-1 items-end" style={{ height: "160px" }}>
                        <div
                          className="flex-1 rounded-t bg-sky-500 transition-all group-hover:bg-sky-600"
                          style={{ height: `${incomingHeight}%` }}
                        />
                        <div
                          className="flex-1 rounded-t bg-amber-500 transition-all group-hover:bg-amber-600"
                          style={{ height: `${outgoingHeight}%` }}
                        />
                        {/* Tooltip */}
                        <div className="invisible absolute -top-20 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-background p-2 text-xs shadow-lg group-hover:visible whitespace-nowrap z-10">
                          <p className="font-medium">{data.month}</p>
                          <p className="text-sky-600">Incoming: {data.incoming}</p>
                          <p className="text-amber-600">Outgoing: {data.outgoing}</p>
                          <p className="text-muted-foreground">Capacity: {data.capacity}kg</p>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">{data.month}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-sky-500" />
                  <span className="text-muted-foreground">Incoming</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Outgoing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Storage & Category Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Products */}
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Products in Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockProductStorage.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-surface/80"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} · {product.quantity} {product.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{product.percentage}%</p>
                      <p className="text-xs text-muted-foreground">of capacity</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PieChart className="h-5 w-5" />
                Storage by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Visual representation */}
                <div className="flex h-8 overflow-hidden rounded-full">
                  {mockCategoryBreakdown.map((cat, idx) => (
                    <div
                      key={idx}
                      className={cn(cat.color, "transition-all hover:opacity-80")}
                      style={{ width: `${cat.percentage}%` }}
                      title={`${cat.category}: ${cat.percentage}%`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {mockCategoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(cat.color, "h-3 w-3 rounded-full")} />
                        <span className="text-sm text-foreground">{cat.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{cat.quantity} kg</p>
                        <p className="text-xs text-muted-foreground">{cat.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights */}
        <Card className="mt-6 border-border/80">
          <CardHeader>
            <CardTitle className="text-lg">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="flex items-start gap-2">
                <Zap className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Turnaround time improved by 15.4%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Average processing time reduced to 3.5 days. Efficient warehouse operations are maintaining fast delivery times.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Capacity utilization at 75%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Warehouse is operating at optimal capacity. Consider planning for expansion if growth trend continues.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
              <div className="flex items-start gap-2">
                <Target className="h-5 w-5 text-sky-600 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-sky-700">
                    Incoming goods increased by 12.3%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Higher supplier activity indicates strong supply chain. Ensure adequate processing capacity.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageBody>
    </>
  );
}
