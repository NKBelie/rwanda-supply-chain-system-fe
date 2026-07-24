"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, Download } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { DataTable, Column, StatusBadge, KpiCard, EmptyState } from "@/components/common/ui";
import { productService, inventoryService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Product, InventoryItem } from "@/lib/storage";

export default function FarmerInventoryPage() {
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (!farmerId) return;
    setProducts(productService.getByFarmer(farmerId));
    setInventory(inventoryService.getByFarmer(farmerId));
  }, [farmerId]);

  const totalStock = products.reduce((s, p) => s + p.quantity, 0);
  const lowStock = products.filter(p => p.quantity < 50);
  const available = products.filter(p => p.status === "Available").length;

  function exportCSV() {
    const rows = products.map(p => [p.id, p.name, p.category, p.quantity, p.unit, p.status, p.quality].join(","));
    const csv = ["ID,Name,Category,Quantity,Unit,Status,Quality", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "inventory.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const columns: Column<Product>[] = [
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Stock", render: p => `${p.quantity} ${p.unit}` },
    { key: "quality", label: "Quality", render: p => <StatusBadge status={p.quality} /> },
    { key: "status", label: "Status", render: p => <StatusBadge status={p.status} /> },
    { key: "updatedAt", label: "Last Updated", render: p => new Date(p.updatedAt).toLocaleDateString() },
  ];

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Track your stock levels and product movements."
        crumbs={[{ label: "Farmer", href: "/farmer" }, { label: "Inventory" }]}
        actions={
          <button onClick={exportCSV} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <KpiCard label="Total Stock" value={`${totalStock} units`} />
          <KpiCard label="Available Products" value={available} tone="success" />
          <KpiCard label="Low Stock Items" value={lowStock.length} tone={lowStock.length > 0 ? "danger" : "default"} />
        </div>

        {lowStock.length > 0 && (
          <div className="mb-4 rounded-xl border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-warning mb-2">
              <AlertTriangle className="h-4 w-4" /> Low Stock Alert
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <span>{p.name}</span>
                  <span className="font-medium text-warning">{p.quantity} {p.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {products.length === 0
          ? <EmptyState title="No inventory data" description="Add products to see your inventory." />
          : <DataTable columns={columns} rows={products} searchKeys={["name", "category", "status"]} />
        }
      </PageBody>
    </>
  );
}
