"use client";

import { useState } from "react";
import { Search, Plus, Package, Filter, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  location: string;
  zone: string;
  shelf: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "reserved";
  lastUpdated: string;
  supplier: string;
  value: number;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Maize Seeds (Premium)",
    sku: "MS-001",
    category: "Seeds",
    quantity: 5000,
    unit: "kg",
    reorderLevel: 1000,
    location: "Warehouse A",
    zone: "Z-1",
    shelf: "S-12",
    status: "in-stock",
    lastUpdated: "2024-01-15",
    supplier: "AgriSupply Ltd",
    value: 15000000,
  },
  {
    id: "2",
    name: "NPK Fertilizer 17:17:17",
    sku: "FT-045",
    category: "Fertilizers",
    quantity: 500,
    unit: "bags",
    reorderLevel: 200,
    location: "Warehouse B",
    zone: "Z-3",
    shelf: "S-08",
    status: "low-stock",
    lastUpdated: "2024-01-14",
    supplier: "Rwanda Fertilizers",
    value: 25000000,
  },
  {
    id: "3",
    name: "Pesticide Spray",
    sku: "PS-112",
    category: "Pesticides",
    quantity: 0,
    unit: "liters",
    reorderLevel: 50,
    location: "Warehouse A",
    zone: "Z-2",
    shelf: "S-05",
    status: "out-of-stock",
    lastUpdated: "2024-01-13",
    supplier: "ChemAgro Rwanda",
    value: 0,
  },
  {
    id: "4",
    name: "Coffee Beans (Arabica)",
    sku: "CB-089",
    category: "Produce",
    quantity: 2500,
    unit: "kg",
    reorderLevel: 500,
    location: "Warehouse C",
    zone: "Z-4",
    shelf: "S-20",
    status: "reserved",
    lastUpdated: "2024-01-15",
    supplier: "Musanze Coffee Coop",
    value: 12500000,
  },
];

export default function WarehouseProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Seeds", "Fertilizers", "Pesticides", "Produce", "Equipment"];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalProducts: mockProducts.length,
    inStock: mockProducts.filter((p) => p.status === "in-stock").length,
    lowStock: mockProducts.filter((p) => p.status === "low-stock").length,
    outOfStock: mockProducts.filter((p) => p.status === "out-of-stock").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage warehouse inventory products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
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
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
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

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10" />}
          title="No products found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{product.name}</h3>
                    <StatusBadge status={product.status} />
                    <Badge>{product.category}</Badge>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
                    <div>
                      <span className="font-medium">SKU:</span> {product.sku}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {product.quantity.toLocaleString()}{" "}
                      {product.unit}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {product.location} - {product.zone} -{" "}
                      {product.shelf}
                    </div>
                    <div>
                      <span className="font-medium">Value:</span> {product.value.toLocaleString()} RWF
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="font-medium">Supplier:</span> {product.supplier}
                    </div>
                    <div>
                      <span className="font-medium">Reorder Level:</span> {product.reorderLevel} {product.unit}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {product.lastUpdated}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
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
