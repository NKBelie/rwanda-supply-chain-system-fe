"use client";

import { useState } from "react";
import { Search, Package, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge, EmptyState } from "@/components/common";

interface Order {
  id: string;
  date: string;
  supplier: string;
  products: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  expectedDelivery: string;
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    supplier: "AgriSupply Ltd",
    products: 5,
    totalAmount: 450000,
    status: "delivered",
    expectedDelivery: "2024-01-18",
  },
  {
    id: "ORD-002",
    date: "2024-01-14",
    supplier: "Rwanda Fertilizers",
    products: 3,
    totalAmount: 600000,
    status: "shipped",
    expectedDelivery: "2024-01-17",
  },
  {
    id: "ORD-003",
    date: "2024-01-13",
    supplier: "BioAgro Rwanda",
    products: 4,
    totalAmount: 320000,
    status: "confirmed",
    expectedDelivery: "2024-01-19",
  },
];

export default function RetailerOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">Track orders from suppliers</p>
        </div>
        <Button size="sm">New Order</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold">{mockOrders.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-green-600">
            {mockOrders.filter((o) => o.status === "delivered").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">In Transit</p>
          <p className="text-2xl font-bold text-blue-600">
            {mockOrders.filter((o) => o.status === "shipped").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold">
            {mockOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()} RWF
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status === "all" ? "All Status" : status}
            </Button>
          ))}
        </div>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState icon={Package} title="No orders found" description="Try adjusting your search" />
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{order.id}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
                    <div>
                      <span className="font-medium">Supplier:</span> {order.supplier}
                    </div>
                    <div>
                      <span className="font-medium">Products:</span> {order.products} items
                    </div>
                    <div>
                      <span className="font-medium">Order Date:</span> {order.date}
                    </div>
                    <div>
                      <span className="font-medium">Expected:</span> {order.expectedDelivery}
                    </div>
                  </div>
                  <div className="text-lg font-semibold">{order.totalAmount.toLocaleString()} RWF</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
