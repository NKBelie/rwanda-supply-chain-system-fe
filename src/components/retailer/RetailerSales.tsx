"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, ShoppingCart, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RetailerSales() {
  const stats = [
    { label: "Today's Sales", value: "RWF 450,000", change: "+12.5%", icon: DollarSign },
    { label: "This Month", value: "RWF 8.5M", change: "+18%", icon: TrendingUp },
    { label: "Transactions", value: "124", change: "+8", icon: ShoppingCart },
    { label: "Customers", value: "67", change: "+5", icon: Users },
  ];

  const recentSales = [
    { id: "SALE-124", time: "14:30", customer: "John Doe", items: "3 items", amount: "RWF 45,000" },
    { id: "SALE-123", time: "13:15", customer: "Jane Smith", items: "5 items", amount: "RWF 78,000" },
    { id: "SALE-122", time: "12:00", customer: "Peter K.", items: "2 items", amount: "RWF 32,000" },
    { id: "SALE-121", time: "11:45", customer: "Mary W.", items: "4 items", amount: "RWF 56,000" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Track sales performance and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button size="sm">New Sale</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Sales */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Sales</h2>
        <div className="space-y-3">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium">{sale.id}</p>
                  <span className="text-sm text-muted-foreground">{sale.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {sale.customer} · {sale.items}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{sale.amount}</p>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
