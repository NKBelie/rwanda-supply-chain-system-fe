"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Layers, Search, Eye, Calendar } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { productService, warehouseService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";

// Mock batch data structure
type Batch = {
  id: string;
  batchNumber: string;
  productId: string;
  quantity: number;
  warehouseId: string;
  status: "Active" | "Dispatched" | "Completed";
  entryDate: string;
  exitDate?: string;
  createdAt: string;
};

// Mock batch data
const mockBatches: Batch[] = [
  {
    id: "BATCH-001",
    batchNumber: "WB-2024-001",
    productId: "PRD-001",
    quantity: 500,
    warehouseId: "WH-001",
    status: "Active",
    entryDate: "2024-01-15",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "BATCH-002",
    batchNumber: "WB-2024-002",
    productId: "PRD-002",
    quantity: 300,
    warehouseId: "WH-002",
    status: "Dispatched",
    entryDate: "2024-01-10",
    exitDate: "2024-01-20",
    createdAt: "2024-01-10T10:00:00Z",
  },
];

export default function FarmerBatchesPage() {
  const router = useRouter();
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Get batches (filtered by farmer's products)
  const allBatches = useMemo(() => {
    return mockBatches.filter(batch => {
      const product = productService.getById(batch.productId);
      return product?.farmerId === farmerId;
    });
  }, [farmerId]);

  // Filter batches
  const filteredBatches = useMemo(() => {
    return allBatches.filter(batch => {
      const product = productService.getById(batch.productId);
      
      const matchesSearch =
        !searchQuery ||
        batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filterStatus || batch.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [allBatches, searchQuery, filterStatus]);

  // Calculate stats
  const totalBatches = allBatches.length;
  const activeBatches = allBatches.filter(b => b.status === "Active").length;
  const dispatchedBatches = allBatches.filter(b => b.status === "Dispatched").length;

  const handleViewBatch = (id: string) => {
    router.push(`/farmer/batches/${id}`);
  };

  return (
    <>
      <PageHeader
        title="Warehouse Batches"
        description="Track your products stored in warehouses"
      />

      <PageBody>
        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Batches</p>
              <p className="text-2xl font-semibold text-foreground">{totalBatches}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active in Warehouse</p>
              <p className="text-2xl font-semibold text-blue-600">{activeBatches}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dispatched</p>
              <p className="text-2xl font-semibold text-emerald-600">{dispatchedBatches}</p>
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
                placeholder="Search batches..."
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
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Completed">Completed</option>
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

        {/* Batches List */}
        {filteredBatches.length === 0 ? (
          <EmptyState
            icon={<Layers className="h-12 w-12" />}
            title="No batches found"
            description={
              searchQuery || filterStatus
                ? "Try adjusting your filters"
                : "Your warehouse batches will appear here"
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredBatches.map((batch) => {
              const product = productService.getById(batch.productId);
              const warehouse = warehouseService.getById(batch.warehouseId);

              return (
                <div
                  key={batch.id}
                  className="rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Batch {batch.batchNumber}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product?.name || "Unknown Product"}
                          </p>
                        </div>
                        <StatusBadge status={batch.status} size="sm" />
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium text-foreground">
                            {batch.quantity} {product?.unit || "units"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Warehouse</p>
                          <p className="font-medium text-foreground">
                            {warehouse?.name || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(batch.entryDate).toLocaleDateString()}
                          </p>
                        </div>
                        {batch.exitDate && (
                          <div>
                            <p className="text-xs text-muted-foreground">Exit Date</p>
                            <p className="font-medium text-foreground">
                              {new Date(batch.exitDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewBatch(batch.id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
