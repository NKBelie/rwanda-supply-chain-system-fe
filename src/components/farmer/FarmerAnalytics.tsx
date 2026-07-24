"use client";
import { useState } from "react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingCart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  productsChange: number;
  averageOrderValue: number;
  aovChange: number;
}

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
}

interface ProductPerformance {
  name: string;
  category: string;
  sales: number;
  revenue: number;
  orders: number;
}

interface CategoryBreakdown {
  category: string;
  revenue: number;
  percentage: number;
  color: string;
}

const mockAnalytics: AnalyticsData = {
  totalRevenue: 4850000,
  revenueChange: 12.5,
  totalOrders: 89,
  ordersChange: 8.2,
  totalProducts: 24,
  productsChange: 4.3,
  averageOrderValue: 54494,
  aovChange: 3.9,
};

const mockSalesData: SalesData[] = [
  { month: "Jul", revenue: 3200000, orders: 58 },
  { month: "Aug", revenue: 3800000, orders: 67 },
  { month: "Sep", revenue: 4100000, orders: 72 },
  { month: "Oct", revenue: 4500000, orders: 81 },
  { month: "Nov", revenue: 4200000, orders: 76 },
  { month: "Dec", revenue: 4850000, orders: 89 },
];

const mockProductPerformance: ProductPerformance[] = [
  { name: "Premium Maize", category: "Cereals", sales: 2500, revenue: 2000000, orders: 25 },
  { name: "Coffee Beans", category: "Cash Crops", sales: 450, revenue: 1575000, orders: 15 },
  { name: "Organic Tomatoes", category: "Vegetables", sales: 850, revenue: 1020000, orders: 18 },
  { name: "Fresh Milk", category: "Dairy", sales: 600, revenue: 300000, orders: 12 },
  { name: "Rice", category: "Cereals", sales: 320, revenue: 480000, orders: 8 },
  { name: "Bananas", category: "Fruits", sales: 450, revenue: 270000, orders: 11 },
];

const mockCategoryBreakdown: CategoryBreakdown[] = [
  { category: "Cereals", revenue: 2480000, percentage: 51.1, color: "bg-emerald-500" },
  { category: "Cash Crops", revenue: 1575000, percentage: 32.5, color: "bg-sky-500" },
  { category: "Vegetables", revenue: 1020000, percentage: 21.0, color: "bg-amber-500" },
  { category: "Dairy", revenue: 300000, percentage: 6.2, color: "bg-purple-500" },
  { category: "Fruits", revenue: 270000, percentage: 5.6, color: "bg-pink-500" },
];

export default function FarmerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  const timeRangeLabels = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "Last Year",
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Track your sales performance, product insights, and revenue trends."
        crumbs={[{ label: "Farmer", href: "/farmer/dashboard" }, { label: "Analytics" }]}
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
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {(mockAnalytics.totalRevenue / 1000000).toFixed(2)}M
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.revenueChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.revenueChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {mockAnalytics.revenueChange > 0 && "+"}
                      {mockAnalytics.revenueChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{mockAnalytics.totalOrders}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.ordersChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.ordersChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {mockAnalytics.ordersChange > 0 && "+"}
                      {mockAnalytics.ordersChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <ShoppingCart className="h-8 w-8 text-sky-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Active Products</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{mockAnalytics.totalProducts}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.productsChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.productsChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {mockAnalytics.productsChange > 0 && "+"}
                      {mockAnalytics.productsChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-amber-500/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Avg. Order Value</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {(mockAnalytics.averageOrderValue / 1000).toFixed(0)}k
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {mockAnalytics.aovChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "font-medium",
                        mockAnalytics.aovChange > 0 ? "text-emerald-600" : "text-red-600"
                      )}
                    >
                      {mockAnalytics.aovChange > 0 && "+"}
                      {mockAnalytics.aovChange}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Trend Chart */}
        <Card className="mb-6 border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Revenue & Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-2" style={{ height: "200px" }}>
                {mockSalesData.map((data, idx) => {
                  const maxRevenue = Math.max(...mockSalesData.map((d) => d.revenue));
                  const height = (data.revenue / maxRevenue) * 100;

                  return (
                    <div key={idx} className="group relative flex flex-1 flex-col items-center gap-2">
                      <div className="relative w-full">
                        <div
                          className="w-full rounded-t bg-primary transition-all group-hover:bg-primary-hover"
                          style={{ height: `${height}px` }}
                        />
                        {/* Tooltip */}
                        <div className="invisible absolute -top-20 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-background p-2 text-xs shadow-lg group-hover:visible">
                          <p className="font-medium">{data.month}</p>
                          <p className="text-muted-foreground">
                            Revenue: RWF {(data.revenue / 1000000).toFixed(2)}M
                          </p>
                          <p className="text-muted-foreground">Orders: {data.orders}</p>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">{data.month}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Revenue</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Performance & Category Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Products */}
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockProductPerformance.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-surface/80"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category} · {product.sales} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        RWF {(product.revenue / 1000).toFixed(0)}k
                      </p>
                      <p className="text-xs text-muted-foreground">{product.orders} orders</p>
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
                Revenue by Category
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
                        <p className="text-sm font-medium text-foreground">
                          RWF {(cat.revenue / 1000).toFixed(0)}k
                        </p>
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
            <CardTitle className="text-lg">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Revenue increased by 12.5% compared to last period
                  </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Strong performance driven by increased orders and higher average order value.
              </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-sky-700 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-sky-700">
                    Premium Maize is your best-selling product
                  </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Generating RWF 2M in revenue with 2,500 units sold across 25 orders.
              </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <PieChart className="h-4 w-4 text-amber-700 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Cereals category dominates your revenue (51.1%)
                  </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Consider diversifying into high-margin categories like cash crops.
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
