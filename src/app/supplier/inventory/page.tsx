"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, Package, AlertTriangle, TrendingUp, Download } from "lucide-react";
import { productService } from "@/services/data.service";

export default function SupplierInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [alertFilter, setAlertFilter] = useState("");

  const allProducts = useMemo(() => productService.getAll(), []);

  const inventoryItems = useMemo(() => {
    return allProducts.map(product => ({
      ...product,
      stock: product.quantity || Math.floor(Math.random() * 500) + 100,
      minStock: 50,
      maxStock: 1000,
      reorderPoint: 100,
      lastRestocked: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }, [allProducts]);

  const filteredInventory = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (alertFilter === "low") {
        return matchesSearch && item.stock <= item.reorderPoint;
      } else if (alertFilter === "out") {
        return matchesSearch && item.stock === 0;
      }
      return matchesSearch;
    });
  }, [inventoryItems, searchQuery, alertFilter]);

  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter(i => i.stock <= i.reorderPoint && i.stock > 0).length;
  const outOfStockItems = inventoryItems.filter(i => i.stock === 0).length;
  const totalValue = inventoryItems.reduce((sum, i) => sum + (i.price * i.stock), 0);

  const handleExport = () => {
    alert("Export inventory report");
  };

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Monitor stock levels and inventory"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Total Items</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalItems}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Low Stock</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{lowStockItems}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Out of Stock</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{outOfStockItems}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Inventory Value</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalValue / 1000000).toFixed(1)}M RWF
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Items</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <button
            onClick={handleExport}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Inventory Table */}
        {filteredInventory.length > 0 ? (
          <div className="space-y-3">
            {filteredInventory.map((item) => {
              const stockPercentage = (item.stock / item.maxStock) * 100;
              const isLowStock = item.stock <= item.reorderPoint && item.stock > 0;
              const isOutOfStock = item.stock === 0;

              return (
                <div
                  key={item.id}
                  className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        {isOutOfStock && (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                            Out of Stock
                          </span>
                        )}
                        {isLowStock && (
                          <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-500">
                            Low Stock
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {item.stock} {item.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {item.maxStock} {item.unit}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock Level</span>
                      <span className="font-medium">{stockPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full transition-all ${
                          isOutOfStock
                            ? "bg-red-500"
                            : isLowStock
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold">RWF {item.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Value</p>
                      <p className="font-semibold">
                        RWF {(item.price * item.stock).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reorder Point</p>
                      <p className="font-semibold">{item.reorderPoint} {item.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Restocked</p>
                      <p className="font-semibold">
                        {new Date(item.lastRestocked).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No inventory items found"
            description="No items match your search criteria."
            icon={<Package className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
