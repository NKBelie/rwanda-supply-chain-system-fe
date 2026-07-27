"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { DollarSign, TrendingUp, Calendar, Download, Package } from "lucide-react";

interface Earning {
  id: string;
  deliveryId: string;
  date: string;
  amount: number;
  distance: number;
  status: "paid" | "pending";
}

export default function DriverEarningsPage() {
  const [dateFilter, setDateFilter] = useState("month");

  // Mock earnings data
  const allEarnings = useMemo<Earning[]>(() => [
    { id: "E001", deliveryId: "DEL-001", date: "2026-07-20", amount: 15000, distance: 12.5, status: "paid" },
    { id: "E002", deliveryId: "DEL-002", date: "2026-07-18", amount: 65000, distance: 95, status: "paid" },
    { id: "E003", deliveryId: "DEL-003", date: "2026-07-15", amount: 85000, distance: 135, status: "paid" },
    { id: "E004", deliveryId: "DEL-004", date: "2026-07-12", amount: 10000, distance: 8, status: "paid" },
    { id: "E005", deliveryId: "DEL-005", date: "2026-07-10", amount: 90000, distance: 140, status: "pending" }
  ], []);

  const filteredEarnings = useMemo(() => {
    const now = new Date();
    return allEarnings.filter(earning => {
      const earningDate = new Date(earning.date);
      const daysDiff = Math.floor((now.getTime() - earningDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === "week") return daysDiff <= 7;
      if (dateFilter === "month") return daysDiff <= 30;
      if (dateFilter === "year") return daysDiff <= 365;
      return true;
    });
  }, [allEarnings, dateFilter]);

  const totalEarnings = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);
  const paidEarnings = filteredEarnings.filter(e => e.status === "paid").reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = filteredEarnings.filter(e => e.status === "pending").reduce((sum, e) => sum + e.amount, 0);
  const totalDeliveries = filteredEarnings.length;
  const avgEarning = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

  const handleExport = () => {
    alert("Earnings report would be exported as PDF/CSV");
  };

  return (
    <>
      <PageHeader
        title="Earnings"
        description="Track your delivery earnings and payment history"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Earnings</span>
            </div>
            <p className="mt-2 text-2xl font-bold">RWF {totalEarnings.toLocaleString()}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>Paid</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
              RWF {paidEarnings.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <span>Pending</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              RWF {pendingEarnings.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Avg per Delivery</span>
            </div>
            <p className="mt-2 text-2xl font-bold">RWF {avgEarning.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handleExport}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {/* Earnings Table */}
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Delivery ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Distance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredEarnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(earning.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">{earning.deliveryId}</td>
                    <td className="px-4 py-3 text-sm">{earning.distance} km</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      RWF {earning.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          earning.status === "paid"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {earning.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h3 className="mb-4 font-semibold">Earnings Summary</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Deliveries</p>
                <p className="text-xl font-bold">{totalDeliveries}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p className="text-xl font-bold capitalize">{dateFilter}</p>
              </div>
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
