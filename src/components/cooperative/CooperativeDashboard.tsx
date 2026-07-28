"use client";

import { Users, Package, TrendingUp, DollarSign, Calendar, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";

export default function CooperativeDashboard() {
  const stats = [
    { label: "Total Members", value: "156", change: "+12 this month", icon: Users, color: "text-blue-600" },
    { label: "Collections (Month)", value: "45", change: "+8 from last month", icon: Package, color: "text-green-600" },
    { label: "Revenue (Month)", value: "RWF 8.5M", change: "+15% growth", icon: TrendingUp, color: "text-purple-600" },
    { label: "Total Shares", value: "1,240", change: "Active members", icon: DollarSign, color: "text-orange-600" },
  ];

  const recentCollections = [
    { id: "COL-045", member: "Jean Baptiste", product: "Maize", qty: "500 kg", value: "RWF 200,000", status: "verified" },
    { id: "COL-044", member: "Marie Claire", product: "Coffee", qty: "250 kg", value: "RWF 500,000", status: "processed" },
    { id: "COL-043", member: "Patrick N.", product: "Beans", qty: "300 kg", value: "RWF 105,000", status: "pending" },
  ];

  const upcomingEvents = [
    { date: "Jan 20", title: "Monthly General Meeting", time: "10:00 AM", location: "Cooperative Hall" },
    { date: "Jan 25", title: "Training: Modern Farming", time: "2:00 PM", location: "Community Center" },
    { date: "Jan 30", title: "Dividend Distribution", time: "9:00 AM", location: "Cooperative Office" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cooperative Dashboard</h1>
        <p className="text-muted-foreground">Overview of cooperative activities and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
        {/* Recent Collections */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Collections</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {recentCollections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{collection.id}</p>
                    <StatusBadge status={collection.status} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {collection.member} · {collection.product} · {collection.qty}
                  </p>
                </div>
                <p className="font-semibold">{collection.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Button variant="outline" size="sm">View Calendar</Button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex gap-4 rounded-lg border border-border p-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold">
                  <span className="text-xs text-muted-foreground">{event.date.split(" ")[0]}</span>
                  <span>{event.date.split(" ")[1]}</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    <Calendar className="mr-1 inline h-3 w-3" />
                    {event.time} · {event.location}
                  </p>
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
            <span>Add Member</span>
          </Button>
          <Button className="h-auto flex-col gap-2 py-6" variant="outline">
            <Package className="h-6 w-6" />
            <span>Record Collection</span>
          </Button>
          <Button className="h-auto flex-col gap-2 py-6" variant="outline">
            <Calendar className="h-6 w-6" />
            <span>Schedule Event</span>
          </Button>
          <Button className="h-auto flex-col gap-2 py-6" variant="outline">
            <TrendingUp className="h-6 w-6" />
            <span>View Reports</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
