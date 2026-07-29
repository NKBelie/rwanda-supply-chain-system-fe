"use client";

import { useState } from "react";
import { Search, Building, Filter, Shield, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";

interface Business {
  id: string;
  name: string;
  type: "cooperative" | "transport" | "warehouse" | "supplier" | "manufacturer" | "retailer";
  owner: string;
  phone: string;
  email: string;
  location: string;
  district: string;
  registrationNumber: string;
  status: "active" | "pending" | "suspended";
  verified: boolean;
  joinedDate: string;
}

const mockBusinesses: Business[] = [
  {
    id: "BUS-001",
    name: "Musanze Coffee Cooperative",
    type: "cooperative",
    owner: "Jean Baptiste Mugisha",
    phone: "+250 788 123 456",
    email: "info@musanzecoffee.rw",
    location: "Musanze",
    district: "Musanze",
    registrationNumber: "RCA-2023-001",
    status: "active",
    verified: true,
    joinedDate: "2023-01-15",
  },
  {
    id: "BUS-002",
    name: "AgriSupply Ltd",
    type: "supplier",
    owner: "Marie Claire Uwera",
    phone: "+250 788 234 567",
    email: "contact@agrisupply.rw",
    location: "Kigali",
    district: "Gasabo",
    registrationNumber: "RCA-2022-089",
    status: "active",
    verified: true,
    joinedDate: "2022-06-20",
  },
  {
    id: "BUS-003",
    name: "Rwanda Fertilizers Co.",
    type: "manufacturer",
    owner: "Patrick Niyonzima",
    phone: "+250 788 345 678",
    email: "info@rwfertilizers.rw",
    location: "Kigali",
    district: "Kicukiro",
    registrationNumber: "RCA-2021-045",
    status: "active",
    verified: true,
    joinedDate: "2021-03-10",
  },
  {
    id: "BUS-004",
    name: "Swift Transport Services",
    type: "transport",
    owner: "Grace Mukamana",
    phone: "+250 788 456 789",
    email: "info@swifttransport.rw",
    location: "Kigali",
    district: "Nyarugenge",
    registrationNumber: "RCA-2023-112",
    status: "pending",
    verified: false,
    joinedDate: "2024-01-10",
  },
];

export default function AdminBusinesses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const types = ["all", "cooperative", "transport", "warehouse", "supplier", "manufacturer", "retailer"];
  const statuses = ["all", "active", "pending", "suspended"];

  const filteredBusinesses = mockBusinesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || business.type === selectedType;
    const matchesStatus = selectedStatus === "all" || business.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: mockBusinesses.length,
    active: mockBusinesses.filter((b) => b.status === "active").length,
    verified: mockBusinesses.filter((b) => b.verified).length,
    pending: mockBusinesses.filter((b) => b.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Management</h1>
          <p className="text-muted-foreground">Manage registered businesses on the platform</p>
        </div>
        <Button size="sm">Add Business</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Businesses</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Verified</p>
          <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-2 text-sm font-medium">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                >
                  {type === "all" ? "All Types" : type}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Status</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === "all" ? "All Status" : status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Business List */}
      {filteredBusinesses.length === 0 ? (
        <EmptyState icon={<Building className="h-10 w-10" />} title="No businesses found" description="Try adjusting your search" />
      ) : (
        <div className="grid gap-4">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{business.name}</h3>
                    <StatusBadge status={business.status} />
                    <Badge>{business.type}</Badge>
                    {business.verified && (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="font-medium">Owner:</span> {business.owner}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {business.phone}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {business.email}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {business.location}, {business.district}
                    </div>
                    <div>
                      <span className="font-medium">Reg. No:</span> {business.registrationNumber}
                    </div>
                    <div>
                      <span className="font-medium">Joined:</span> {business.joinedDate}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {business.status === "pending" && <Button size="sm">Verify</Button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
