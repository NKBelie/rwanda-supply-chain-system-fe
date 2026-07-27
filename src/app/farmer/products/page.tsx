"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Package, Edit2, Eye, Trash2 } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState, LoadingState } from "@/components/common";
import { DistrictSelector } from "@/components/common";
import { productService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product } from "@/lib/storage";

export default function FarmerProductsPage() {
  const router = useRouter();
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Get products (in real app, this would be from API)
  const allProducts = useMemo(() => {
    return productService.getAll().filter(p => p.farmerId === farmerId);
  }, [farmerId]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesStatus = !selectedStatus || product.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allProducts, searchQuery, selectedCategory, selectedStatus]);

  const handleAddProduct = () => {
    router.push("/farmer/products/add");
  };

  const handleViewProduct = (id: string) => {
    router.push(`/farmer/products/${id}`);
  };

  const handleEditProduct = (id: string) => {
    router.push(`/farmer/products/${id}/edit`);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // In real app, call delete API
      console.log("Delete product:", id);
    }
  };

  // Calculate stats
  const totalProducts = allProducts.length;
  const availableProducts = allProducts.filter(p => p.status === "Available").length;
  const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  const categories = ["Crops", "Livestock", "Dairy", "Fruits", "Vegetables", "Seeds"];
  const statuses = ["Available", "Growing", "Harvested", "Out of Stock", "Pending Approval"];

  return (
    <>
      <PageHeader
        title="My Products"
        description="Manage your agricultural products and inventory"
        actions={
          <button
            onClick={handleAddProduct}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        }
      />

      <PageBody>
        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-semibold text-foreground">{totalProducts}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-semibold text-emerald-600">{availableProducts}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-semibold text-foreground">
                RWF {(totalValue / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-border bg-background p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSelectedStatus("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Products List */}
        {isLoading ? (
          <LoadingState label="Loading products..." />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No products found"
            description={
              searchQuery || selectedCategory || selectedStatus
                ? "Try adjusting your filters"
                : "Start by adding your first product"
            }
            action={
              !searchQuery && !selectedCategory && !selectedStatus ? (
                <button
                  onClick={handleAddProduct}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Product
                </button>
              ) : undefined
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
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Quality
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-surface/50"
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-medium text-foreground">{product.quantity}</span>
                        <span className="text-muted-foreground"> {product.unit}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">
                        RWF {product.price.toLocaleString()}/{product.unit}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                          {product.quality}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={product.status} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewProduct(product.id)}
                            className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="rounded-lg border border-border bg-background p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="rounded-lg border border-red-200 bg-background p-1.5 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/20"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
