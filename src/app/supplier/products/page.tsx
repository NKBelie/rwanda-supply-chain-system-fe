"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, Package, Plus, TrendingUp } from "lucide-react";
import { productService } from "@/services/data.service";

export default function SupplierProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allProducts = useMemo(() => productService.getAll(), []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch = searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "" || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allProducts, searchQuery, categoryFilter, statusFilter]);

  const categories = Array.from(new Set(allProducts.map(p => p.category)));
  const totalProducts = allProducts.length;
  const availableProducts = allProducts.filter(p => p.status === "available").length;
  const totalValue = allProducts.reduce((sum, p) => sum + (p.price * (p.stock || 100)), 0);

  const handleAddProduct = () => {
    window.location.href = "/supplier/products/add";
  };

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your product inventory"
        action={{
          label: "Add Product",
          onClick: handleAddProduct,
          icon: Plus
        }}
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Products</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalProducts}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 text-green-500" />
              <span>Available</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{availableProducts}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Inventory Value</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              RWF {(totalValue / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md cursor-pointer"
                onClick={() => window.location.href = `/supplier/products/${product.id}`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <StatusBadge status={product.status} />
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {product.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {product.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-lg font-bold">
                      RWF {product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p className="text-lg font-bold">
                      {product.stock || 0} {product.unit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            description="No products match your search criteria."
            icon={Package}
          />
        )}
      </PageBody>
    </>
  );
}
