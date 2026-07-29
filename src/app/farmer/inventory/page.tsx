"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Package, TrendingDown, TrendingUp, AlertTriangle, Search } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState, LoadingState } from "@/components/common";
import { inventoryService, productService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";

export default function FarmerInventoryPage() {
  const router = useRouter();
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Get inventory data
  const allInventory = useMemo(() => {
    return inventoryService.getAll().filter(item => {
      const product = productService.getById(item.productId);
      return product?.farmerId === farmerId;
    });
  }, [farmerId]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return allInventory.filter(item => {
      const product = productService.getById(item.productId);
      if (!product) return false;

      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filterStatus || item.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [allInventory, searchQuery, filterStatus]);

  // Calculate stats
  const totalItems = allInventory.length;
  const lowStockItems = allInventory.filter(item => {
    const product = productService.getById(item.productId);
    return product && item.quantity < (product.quantity * 0.2); // Less than 20% of original
  }).length;
  const totalValue = allInventory.reduce((sum, item) => {
    const product = productService.getById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const getStockStatus = (item: any) => {
    const product = productService.getById(item.productId);
    if (!product) return "Unknown";
    
    const percentage = (item.quantity / product.quantity) * 100;
    if (percentage <= 10) return "Critical";
    if (percentage <= 30) return "Low";
    return "Good";
  };

  return (
    <>
      <PageHeader
        title="Inventory Management"
        description="Monitor stock levels and manage your agricultural inventory"
      />

      <PageBody>
        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-semibold text-foreground">{totalItems}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-2xl font-semibold text-amber-600">{lowStockItems}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Inventory Value</p>
              <p className="text-2xl font-semibold text-foreground">
                RWF {(totalValue / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-border bg-background p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Stock Levels</option>
              <option value="Good">Good Stock</option>
              <option value="Low">Low Stock</option>
              <option value="Critical">Critical Stock</option>
            </select>

            {(searchQuery || filterStatus) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        {filteredInventory.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No inventory items found"
            description={
              searchQuery || filterStatus
                ? "Try adjusting your filters"
                : "Your inventory will appear here once you add products"
            }
          />
        ) : (
          <div className="rounded-lg border border-border bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-surface/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Current Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Max Capacity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Stock Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Last Updated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.map((item) => {
                    const product = productService.getById(item.productId);
                    if (!product) return null;

                    const stockStatus = getStockStatus(item);
                    const percentage = Math.round((item.quantity / product.quantity) * 100);
                    const value = product.price * item.quantity;

                    return (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-surface/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Package className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">
                            {item.quantity} {product.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {product.quantity} {product.unit}
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-surface">
                                <div
                                  className={`h-full ${
                                    percentage <= 10
                                      ? "bg-red-500"
                                      : percentage <= 30
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-muted-foreground">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          RWF {value.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            status={stockStatus}
                            tone={
                              stockStatus === "Critical"
                                ? "danger"
                                : stockStatus === "Low"
                                ? "warning"
                                : "success"
                            }
                            size="sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Low Stock Alerts */}
        {lowStockItems > 0 && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-400">
                  Low Stock Alert
                </h4>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  You have {lowStockItems} item{lowStockItems !== 1 ? "s" : ""} with low stock levels.
                  Consider restocking soon to avoid running out.
                </p>
              </div>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
