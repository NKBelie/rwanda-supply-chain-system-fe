"use client";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { DataTable, Column, StatusBadge, ConfirmDialog, KpiCard, EmptyState, ghostBtn } from "@/components/common/ui";
import { storageRequestService, warehouseService, productService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { StorageRequest, Warehouse, Product } from "@/lib/storage";

export default function WarehouseRequestsPage() {
  const session = useSession();
  const ownerId = session?.claims.sub ?? "";

  const [requests, setRequests] = useState<StorageRequest[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [acting, setActing] = useState<{ req: StorageRequest; action: "Accepted" | "Rejected" } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function load() {
    const whs = warehouseService.getByOwner(ownerId);
    setWarehouses(whs);
    const whIds = whs.map(w => w.id);
    setRequests(storageRequestService.getAll().filter(r => whIds.includes(r.warehouseId)));
    setProducts(productService.getAll());
  }

  useEffect(() => { if (ownerId) load(); }, [ownerId]);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function handleAction() {
    if (!acting) return;
    storageRequestService.updateStatus(acting.req.id, acting.action);
    showToast(acting.action === "Accepted" ? "Request accepted. Batch created." : "Request rejected.");
    setActing(null); load();
  }

  const pending = requests.filter(r => r.status === "Pending").length;
  const accepted = requests.filter(r => r.status === "Accepted").length;

  const columns: Column<StorageRequest>[] = [
    { key: "id", label: "Request ID" },
    { key: "farmerId", label: "Farmer ID" },
    { key: "warehouseId", label: "Warehouse", render: r => warehouses.find(w => w.id === r.warehouseId)?.name ?? r.warehouseId },
    { key: "productId", label: "Product", render: r => products.find(p => p.id === r.productId)?.name ?? r.productId },
    { key: "quantity", label: "Quantity" },
    { key: "duration", label: "Duration", render: r => `${r.duration} days` },
    { key: "requestDate", label: "Requested", render: r => new Date(r.requestDate).toLocaleDateString() },
    { key: "status", label: "Status", render: r => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <PageHeader
        title="Storage Requests"
        description="Review and respond to farmer storage requests."
        crumbs={[{ label: "Warehouse", href: "/warehouse" }, { label: "Storage Requests" }]}
      />
      <PageBody>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <KpiCard label="Pending" value={pending} tone={pending > 0 ? "warning" : "default"} />
          <KpiCard label="Accepted" value={accepted} tone="success" />
          <KpiCard label="Total" value={requests.length} />
        </div>

        {requests.length === 0
          ? <EmptyState title="No storage requests" description="Farmer storage requests will appear here." />
          : <DataTable columns={columns} rows={requests} searchKeys={["id", "farmerId", "status"]}
              actions={r => r.status === "Pending" ? (
                <div className="flex gap-1">
                  <button onClick={() => setActing({ req: r, action: "Accepted" })} className="inline-flex h-8 items-center gap-1 rounded-lg bg-success/10 px-2 text-xs font-medium text-success hover:bg-success/20">
                    <CheckCircle className="h-3.5 w-3.5" /> Accept
                  </button>
                  <button onClick={() => setActing({ req: r, action: "Rejected" })} className="inline-flex h-8 items-center gap-1 rounded-lg bg-danger/10 px-2 text-xs font-medium text-danger hover:bg-danger/20">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              ) : <span className="text-xs text-muted-foreground">—</span>}
            />
        }
      </PageBody>

      {acting && (
        <ConfirmDialog
          title={acting.action === "Accepted" ? "Accept Storage Request" : "Reject Storage Request"}
          message={acting.action === "Accepted"
            ? `Accept request ${acting.req.id}? A warehouse batch will be automatically created.`
            : `Reject request ${acting.req.id}? The farmer will be notified.`}
          confirmLabel={acting.action === "Accepted" ? "Accept" : "Reject"}
          danger={acting.action === "Rejected"}
          onConfirm={handleAction}
          onCancel={() => setActing(null)}
        />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-pop">{toast}</div>}
    </>
  );
}
