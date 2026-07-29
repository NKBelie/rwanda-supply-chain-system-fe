"use client";

import { useState } from "react";
import { Search, Plus, Package, Filter, Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";

interface Collection {
  id: string;
  date: string;
  memberName: string;
  memberId: string;
  product: string;
  quantity: number;
  unit: string;
  quality: "Grade A" | "Grade B" | "Grade C";
  pricePerUnit: number;
  totalValue: number;
  location: string;
  collectedBy: string;
  status: "pending" | "verified" | "processed" | "paid";
}

const mockCollections: Collection[] = [
  {
    id: "COL-001",
    date: "2024-01-15",
    memberName: "Jean Baptiste",
    memberId: "M-001",
    product: "Maize",
    quantity: 500,
    unit: "kg",
    quality: "Grade A",
    pricePerUnit: 400,
    totalValue: 200000,
    location: "Collection Point A",
    collectedBy: "Inspector John",
    status: "verified",
  },
  {
    id: "COL-002",
    date: "2024-01-15",
    memberName: "Marie Claire",
    memberId: "M-002",
    product: "Coffee Beans",
    quantity: 250,
    unit: "kg",
    quality: "Grade A",
    pricePerUnit: 2000,
    totalValue: 500000,
    location: "Collection Point B",
    collectedBy: "Inspector Sarah",
    status: "processed",
  },
  {
    id: "COL-003",
    date: "2024-01-16",
    memberName: "Patrick Niyonzima",
    memberId: "M-003",
    product: "Beans",
    quantity: 300,
    unit: "kg",
    quality: "Grade B",
    pricePerUnit: 350,
    totalValue: 105000,
    location: "Collection Point A",
    collectedBy: "Inspector John",
    status: "pending",
  },
  {
    id: "COL-004",
    date: "2024-01-16",
    memberName: "Grace Mukamana",
    memberId: "M-004",
    product: "Tomatoes",
    quantity: 150,
    unit: "kg",
    quality: "Grade A",
    pricePerUnit: 600,
    totalValue: 90000,
    location: "Collection Point C",
    collectedBy: "Inspector Mary",
    status: "verified",
  },
];

export default function CooperativeCollections() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = ["all", "pending", "verified", "processed", "paid"];

  const filteredCollections = mockCollections.filter((collection) => {
    const matchesSearch =
      collection.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || collection.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalCollections: mockCollections.length,
    totalValue: mockCollections.reduce((sum, c) => sum + c.totalValue, 0),
    pending: mockCollections.filter((c) => c.status === "pending").length,
    verified: mockCollections.filter((c) => c.status === "verified").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Collections</h1>
          <p className="text-muted-foreground">Track member product collections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Collections</p>
              <p className="text-2xl font-bold">{stats.totalCollections}</p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">{stats.totalValue.toLocaleString()} RWF</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by collection ID, member, or product..."
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
              variant={selectedStatus === status ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status === "all" ? "All Status" : status}
            </Button>
          ))}
        </div>
      </Card>

      {/* Collections List */}
      {filteredCollections.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="No collections found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid gap-4">
          {filteredCollections.map((collection) => (
            <Card key={collection.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{collection.id}</h3>
                    <StatusBadge status={collection.status} />
                    <Badge
                      className={
                        collection.quality === "Grade A"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : collection.quality === "Grade B"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    >
                      {collection.quality}
                    </Badge>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {collection.memberName} ({collection.memberId})
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {collection.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {collection.location}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
                    <div>
                      <span className="font-medium">Product:</span> {collection.product}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {collection.quantity} {collection.unit}
                    </div>
                    <div>
                      <span className="font-medium">Price/Unit:</span> {collection.pricePerUnit} RWF
                    </div>
                    <div>
                      <span className="font-medium">Total Value:</span> {collection.totalValue.toLocaleString()}{" "}
                      RWF
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Collected by:</span> {collection.collectedBy}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {collection.status === "pending" && (
                    <Button size="sm">Verify</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
