"use client";

import React, { useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingCart,
  Calendar,
  BarChart3
} from "lucide-react";
import { productService, orderService } from "@/services/data.service";

export default function FarmerAnalyticsPage() {
  const products = useMemo(() => productService.getAll(), []);
  const orders = useMemo(() => orderService.getAll(), []);

  // Calculate analytics
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.status === "completed")
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  // Top products by revenue
  const topProducts = useMemo(() => {
    const productRevenue: Record<string, { name: string; revenue: number; orders: number }> = {};

    orders
      .filter(o => o.status === "completed")
      .forEach(order => {
        order.items.forEach(item => {
          if (!productRevenue[item.productId]) {
            const product = products.find(p => p.id === item.productId);
            productRevenue[item.productId] = {
              name: product?.name || "Unknown Product",
              revenue: 0,
              orders: 0
            };
          }
          productRevenue[item.productId].revenue += item.quantity * item.price;
          productRevenue[item.productId].orders += 1;
        });
      });

    return Object.entries(productRevenue)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders, products]);

  // Sales by category
  const salesByCategory = useMemo(() => {
    const categoryRevenue: Record<string, number> = {};

    orders
      .filter(o => o.status === "completed")
      .forEach(order => {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          const category = product?.category || "Other";
          categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.quantity * item.price);
        });
      });

    return Object.entries(categoryRevenue)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [orders, products]);

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const trend = months.map((month, index) => {
      // Simulate monthly revenue (in real app, filter by actual date)
      const baseRevenue = totalRevenue / 6;
      const variance = (Math.random() - 0.5) * baseRevenue * 0.4;
      return {
        month,
        revenue: Math.max(0, baseRevenue + variance),
        orders: Math.floor(completedOrders / 6 + (Math.random() - 0.5) * 5)
      };
    });
    return trend;
  }, [totalRevenue, completedOrders]);

  const revenueChange = monthlyTrend.length >= 2 
    ? ((monthlyTrend[monthlyTrend.length - 1].revenue - monthlyTrend[monthlyTrend.length - 2].revenue) / monthlyTrend[monthlyTrend.length - 2].revenue) * 100
    : 0;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="View your sales performance and business insights"
      />
      <PageBody>
        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">RWF {totalRevenue.toLocaleString()}</p>
              <div className="mt-1 flex items-center text-sm">
                {revenueChange >= 0 ? (
                  <>
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-green-500">+{revenueChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-red-500">{revenueChange.toFixed(1)}%</span>
                  </>
                )}
                <span className="ml-1 text-muted-foreground">vs last month</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{totalOrders}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {completedOrders} completed
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">RWF {averageOrderValue.toLocaleString()}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Per completed order
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Products Listed</p>
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {products.filter(p => p.status === "available").length} available
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Monthly Revenue Trend */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Revenue Trend</h3>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {monthlyTrend.map((month, index) => {
                const maxRevenue = Math.max(...monthlyTrend.map(m => m.revenue));
                const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={index}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-muted-foreground">
                        RWF {month.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-6">
              <h3 className="font-semibold">Top Selling Products</h3>
              <p className="text-sm text-muted-foreground">By revenue generated</p>
            </div>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => {
                  const maxRevenue = topProducts[0]?.revenue || 1;
                  const percentage = (product.revenue / maxRevenue) * 100;

                  return (
                    <div key={product.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {index + 1}
                          </span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          RWF {product.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {product.orders} orders
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No product sales data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-semibold">Sales by Category</h3>
            <p className="text-sm text-muted-foreground">Revenue distribution across product categories</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {salesByCategory.length > 0 ? (
              salesByCategory.map((item) => {
                const totalCategoryRevenue = salesByCategory.reduce((sum, cat) => sum + cat.revenue, 0);
                const percentage = totalCategoryRevenue > 0 ? (item.revenue / totalCategoryRevenue) * 100 : 0;

                return (
                  <div key={item.category} className="rounded-lg border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mb-2 text-lg font-semibold">
                      RWF {item.revenue.toLocaleString()}
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No category sales data available
              </div>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}
