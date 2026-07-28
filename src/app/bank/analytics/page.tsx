"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { TrendingUp, Users, DollarSign, BarChart3, Calendar } from "lucide-react";

export default function BankAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  const portfolioMetrics = {
    totalCustomers: 1247,
    activeLoans: 456,
    loanPortfolio: 156000000,
    defaultRate: 2.3,
    avgLoanSize: 12500000,
    portfolioGrowth: 18.5
  };

  const loanCategories = [
    { category: "Agricultural Expansion", value: 45, amount: 70200000 },
    { category: "Equipment Purchase", value: 28, amount: 43680000 },
    { category: "Working Capital", value: 18, amount: 28080000 },
    { category: "Other", value: 9, amount: 14040000 }
  ];

  const monthlyPerformance = [
    { month: "Jan", disbursed: 12000000, repaid: 8500000 },
    { month: "Feb", disbursed: 15000000, repaid: 9200000 },
    { month: "Mar", disbursed: 13500000, repaid: 10100000 },
    { month: "Apr", disbursed: 18000000, repaid: 11500000 },
    { month: "May", disbursed: 16500000, repaid: 12800000 },
    { month: "Jun", disbursed: 19000000, repaid: 13200000 }
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Loan portfolio performance and insights"
      />
      <PageBody>
        {/* Key Metrics */}
        <div className="mb-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{portfolioMetrics.totalCustomers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Active Loans</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{portfolioMetrics.activeLoans}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Portfolio</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(portfolioMetrics.loanPortfolio / 1000000).toFixed(0)}M
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Default Rate</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{portfolioMetrics.defaultRate}%</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Avg Loan</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(portfolioMetrics.avgLoanSize / 1000000).toFixed(1)}M
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Growth</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-500">+{portfolioMetrics.portfolioGrowth}%</p>
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
          {/* Loan Categories */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 font-semibold">Loan Portfolio by Category</h3>
            <div className="space-y-4">
              {loanCategories.map((cat) => (
                <div key={cat.category}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-muted-foreground">
                      RWF {(cat.amount / 1000000).toFixed(1)}M ({cat.value}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${cat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 font-semibold">Monthly Disbursement vs Repayment</h3>
            <div className="space-y-3">
              {monthlyPerformance.map((month) => (
                <div key={month.month} className="rounded-lg bg-muted/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{month.month}</span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Disbursed</p>
                      <p className="font-semibold text-blue-500">
                        {(month.disbursed / 1000000).toFixed(1)}M RWF
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Repaid</p>
                      <p className="font-semibold text-green-500">
                        {(month.repaid / 1000000).toFixed(1)}M RWF
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h3 className="mb-4 font-semibold">Customer Segments</h3>
          <div className="grid gap-4 md:grid-cols-4">
            {["Farmers", "Cooperatives", "Manufacturers", "Suppliers"].map((segment) => (
              <div key={segment} className="rounded-lg bg-muted/50 p-4">
                <p className="mb-2 font-medium">{segment}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Count</span>
                    <span className="font-semibold">{Math.floor(Math.random() * 200 + 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Portfolio</span>
                    <span className="font-semibold">{Math.floor(Math.random() * 40 + 20)}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Default %</span>
                    <span className="font-semibold">{(Math.random() * 3 + 1).toFixed(1)}%</span>
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
