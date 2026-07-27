"use client";

import { Users, Building, TrendingUp, DollarSign, Package, Truck, ShoppingCart, Factory } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminAnalytics() {
  const platformStats = [
    { label: "Total Users", value: "12,456", change: "+245 this month", icon: Users, color: "text-blue-600" },
    { label: "Active Businesses", value: "3,234", change: "+89 verified", icon: Building, color: "text-green-600" },
    { label: "Total Transactions", value: "RWF 2.4B", change: "+18% from last month", icon: TrendingUp, color: "text-purple-600" },
    { label: "Platform Revenue", value: "RWF 45M", change: "+12% growth", icon: DollarSign, color: "text-orange-600" },
  ];

  const roleDistribution = [
    { role: "Farmers", count: 5234, icon: Package, color: "bg-green-100 text-green-700 dark:bg-green-900" },
    { role: "Buyers", count: 2145, icon: ShoppingCart, color: "bg-blue-100 text-blue-700 dark:bg-blue-900" },
    { role: "Drivers", count: 876, icon: Truck, color: "bg-purple-100 text-purple-700 dark:bg-purple-900" },
    { role: "Manufacturers", count: 456, icon: Factory, color: "bg-orange-100 text-orange-700 dark:bg-orange-900" },
  ];

  const regionActivity = [
    { region: "Kigali", users: 4532, transactions: "RWF 980M", growth: "+15%" },
    { region: "Northern Province", users: 2876, transactions: "RWF 540M", growth: "+22%" },
    { region: "Southern Province", users: 1987, transactions: "RWF 420M", growth: "+18%" },
    { region: "Eastern Province", users: 1654, transactions: "RWF 320M", growth: "+12%" },
    { region: "Western Province", users: 1407, transactions: "RWF 140M", growth: "+8%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground">Monitor platform performance and user activity</p>
      </div>

      {/* Platform Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Role Distribution */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">User Distribution by Role</h2>
          <div className="space-y-3">
            {roleDistribution.map((item) => (
              <div key={item.role} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{item.role}</span>
                </div>
                <span className="text-xl font-bold">{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Activity */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Activity by Region</h2>
            <Button variant="outline" size="sm">
              View Map
            </Button>
          </div>
          <div className="space-y-3">
            {regionActivity.map((region) => (
              <div key={region.region} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{region.region}</p>
                    <p className="text-sm text-muted-foreground">
                      {region.users.toLocaleString()} users · {region.transactions}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-green-600">{region.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Button className="h-auto flex-col gap-2 py-6">
            <Users className="h-6 w-6" />
            <span>User Report</span>
          </Button>
          <Button className="h-auto flex-col gap-2 py-6" variant="outline">
            <Building className="h-6 w-6" />
            <span>Business Report</span>
          </Button>
          <Button className="h-auto flex-col gap-2 py-6" variant="outline">
            <TrendingUp className="h-6 w-6" />
            <span>Transaction Report</span>
          </Button>
          <Button className="h-auto flex-col gap-2 py-6" variant="outline">
            <DollarSign className="h-6 w-6" />
            <span>Revenue Report</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
