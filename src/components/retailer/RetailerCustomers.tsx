"use client";

import { useState } from "react";
import { Search, Users, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  totalPurchases: number;
  lastPurchase: string;
  customerType: "regular" | "vip" | "new";
}

const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "Jean Baptiste",
    phone: "+250 788 123 456",
    email: "jb@example.com",
    location: "Musanze",
    totalPurchases: 1250000,
    lastPurchase: "2024-01-15",
    customerType: "vip",
  },
  {
    id: "CUST-002",
    name: "Marie Claire",
    phone: "+250 788 234 567",
    location: "Kigali",
    totalPurchases: 450000,
    lastPurchase: "2024-01-14",
    customerType: "regular",
  },
  {
    id: "CUST-003",
    name: "Patrick K.",
    phone: "+250 788 345 678",
    email: "patrick@example.com",
    location: "Huye",
    totalPurchases: 125000,
    lastPurchase: "2024-01-16",
    customerType: "new",
  },
];

export default function RetailerCustomers() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer relationships</p>
        </div>
        <Button size="sm">Add Customer</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold">{mockCustomers.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">VIP Customers</p>
          <p className="text-2xl font-bold text-purple-600">
            {mockCustomers.filter((c) => c.customerType === "vip").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">New This Month</p>
          <p className="text-2xl font-bold text-green-600">
            {mockCustomers.filter((c) => c.customerType === "new").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">
            {mockCustomers.reduce((sum, c) => sum + c.totalPurchases, 0).toLocaleString()} RWF
          </p>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <EmptyState icon={<Users className="h-10 w-10" />} title="No customers found" description="Try adjusting your search" />
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{customer.name}</h3>
                    <Badge
                      className={
                        customer.customerType === "vip"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900"
                          : customer.customerType === "new"
                          ? "bg-green-100 text-green-700 dark:bg-green-900"
                          : ""
                      }
                    >
                      {customer.customerType}
                    </Badge>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {customer.location}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <div>
                      <span className="font-medium">Total Purchases:</span>{" "}
                      {customer.totalPurchases.toLocaleString()} RWF
                    </div>
                    <div>
                      <span className="font-medium">Last Purchase:</span> {customer.lastPurchase}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact
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
