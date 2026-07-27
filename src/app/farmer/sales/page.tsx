"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, DollarSign, ShoppingBag, TrendingUp, Download } from "lucide-react";
import { orderService } from "@/services/data.service";

export default function FarmerSalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month

  const allSales = useMemo(() => orderService.getAll(), []);

  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const matchesSearch = searchQuery === "" ||
        sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sale.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "" || sale.status === statusFilter;

      // Date filtering (simplified for demo)
      let matchesDate = true;
      if (dateFilter !== "all") {
        const saleDate = new Date(sale.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dateFilter === "today") matchesDate = daysDiff === 0;
        else if (dateFilter === "week") matchesDate = daysDiff <= 7;
        else if (dateFilter === "month") matchesDate = daysDiff <= 30;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [allSales, searchQuery, statusFilter, dateFilter]);

  // Calculate stats
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales
    .filter(s => s.status === "completed")
    .reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
  const completedSales = filteredSales.filter(s => s.status === "completed").length;
  const avgSaleValue = completedSales > 0 ? totalRevenue / completedSales : 0;

  const handleExport = () => {
    // In real app, generate CSV/PDF
    alert("Export functionality would generate CSV/PDF of sales data");
  };

  return (
    <>
      <PageHeader
        title="Sales"
        description="Track your sales transactions and revenue"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>Total Sales</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalSales}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Revenue</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              RWF {totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Completed</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{completedSales}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Avg Sale Value</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              RWF {avgSaleValue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by buyer or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="processing">Processing</option>
            <option value="in_transit">In Transit</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <button
            onClick={handleExport}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Sales Table */}
        {filteredSales.length > 0 ? (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Buyer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-mono">
                        {sale.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">{sale.buyerName}</p>
                          <p className="text-xs text-muted-foreground">{sale.buyerPhone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        RWF {(sale.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={sale.status} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => window.location.href = `/farmer/orders/${sale.id}`}
                          className="text-primary hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No sales found"
            description="No sales match your current filters. Try adjusting your search criteria."
            icon={ShoppingBag}
          />
        )}
      </PageBody>
    </>
  );
}
