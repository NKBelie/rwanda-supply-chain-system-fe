"use client";

import { useState } from "react";
import { Search, Plus, Package, Filter, AlertTriangle, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon";
}

const mockInventory: InventoryItem[] = [
  {
    id: "INV-001",
    name: "Maize Seeds (Premium)",
    sku: "MS-001",
    category: "Seeds",
    quantity: 150,
    unit: "kg",
    reorderLevel: 50,
    costPrice: 2500,
    sellingPrice: 3000,
    supplier: "AgriSupply Ltd",
    lastRestocked: "2024-01-10",
    status: "in-stock",
  },
  {
    id: "INV-002",
    name: "NPK Fertilizer 17:17:17",
    sku: "FT-045",
    category: "Fertilizers",
    quantity: 25,
    unit: "bags",
    reorderLevel: 20,
    costPrice: 45000,
    sellingPrice: 50000,
    supplier: "Rwanda Fertilizers",
    lastRestocked: "2024-01-05",
    status: "low-stock",
  },
  {
    id: "INV-003",
    name: "Pesticide Spray",
    sku: "PS-112",
    category: "Pesticides",
    quantity: 0,
    unit: "liters",
    reorderLevel: 10,
    costPrice: 8000,
    sellingPrice: 9500,
    supplier: "ChemAgro Rwanda",
    lastRestocked: "2023-12-20",
    status: "out-of-stock",
  },
  {
    id: "INV-004",
    name: "Organic Fertilizer",
    sku: "OF-078",
    category: "Fertilizers",
    quantity: 80,
    unit: "bags",
    reorderLevel: 30,
    costPrice: 30000,
    sellingPrice: 35000,
    supplier: "BioAgro Rwanda",
    lastRestocked: "2024-01-12",
    expiryDate: "2024-02-15",
    status: "expiring-soon",
  },
];

export default function RetailerInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Seeds", "Fertilizers", "Pesticides", "Equipment", "Tools"];

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalItems: mockInventory.length,
    inStock: mockInventory.filter((i) => i.status === "in-stock").length,
    lowStock: mockInventory.filter((i) => i.status === "low-stock").length,
    outOfStock: mockInventory.filter((i) => i.status === "out-of-stock").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage store inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search inventory by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </Card>

      {/* Inventory List */}
      {filteredInventory.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="No inventory items found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid gap-4">
          {filteredInventory.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{item.name}</h3>
                    <StatusBadge status={item.status} />
                    <Badge>{item.category}</Badge>
                    {item.expiryDate && (
                      <Badge className="gap-1 bg-red-100 text-red-700">
                        <AlertTriangle className="h-3 w-3" />
                        Expires {item.expiryDate}
                      </Badge>
                    )}
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
                    <div>
                      <span className="font-medium">SKU:</span> {item.sku}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                    </div>
                    <div>
                      <span className="font-medium">Reorder Level:</span> {item.reorderLevel} {item.unit}
                    </div>
                    <div>
                      <span className="font-medium">Supplier:</span> {item.supplier}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="font-medium">Cost Price:</span> {item.costPrice.toLocaleString()} RWF
                    </div>
                    <div>
                      <span className="font-medium">Selling Price:</span> {item.sellingPrice.toLocaleString()}{" "}
                      RWF
                    </div>
                    <div>
                      <span className="font-medium">Last Restocked:</span> {item.lastRestocked}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Restock
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
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
