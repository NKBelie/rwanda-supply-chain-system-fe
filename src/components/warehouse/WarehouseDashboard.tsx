"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Package, PackageOpen, PackageCheck, ClipboardList, Plus } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { KpiCard, StatusBadge, EmptyState } from "@/components/common/ui";
import { warehouseService, batchService, storageRequestService, reservationService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { Warehouse, WarehouseBatch, StorageRequest } from "@/lib/storage";

export default function WarehouseDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const ownerId = session?.claims.sub ?? "";

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [batches, setBatches] = useState<WarehouseBatch[]>([]);
  const [requests, setRequests] = useState<StorageRequest[]>([]);

  useEffect(() => {
    if (!ownerId) return;
    const whs = warehouseService.getByOwner(ownerId);
    setWarehouses(whs);
    const whIds = whs.map(w => w.id);
    setBatches(batchService.getAll().filter(b => whIds.includes(b.warehouseId)));
    setRequests(storageRequestService.getAll().filter(r => whIds.includes(r.warehouseId)));
  }, [ownerId]);

  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
  const totalAvailable = warehouses.reduce((s, w) => s + w.availableSpace, 0);
  const occupied = totalCapacity - totalAvailable;
  const pendingRequests = requests.filter(r => r.status === "Pending").length;
  const storedBatches = batches.filter(b => b.status === "Stored").length;
  const reservations = reservationService.getAll().filter(r => warehouses.some(w => w.id === r.warehouseId));

  return (
    <>
      <PageHeader
        title={`Warehouse Control — ${session?.claims.name?.split(" ")[0] ?? "Manager"}`}
        description="Capacity, inbound and outbound flow."
        actions={
          <div className="flex gap-2">
            <button onClick={() => router.push("/warehouse/facilities")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
              <Plus className="h-4 w-4" /> Add Warehouse
            </button>
            <button onClick={() => router.push("/warehouse/requests")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface">
              <ClipboardList className="h-4 w-4" /> Storage Requests {pendingRequests > 0 && <span className="ml-1 rounded-full bg-warning px-1.5 text-[10px] font-semibold text-white">{pendingRequests}</span>}
            </button>
          </div>
        }
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Total Warehouses" value={warehouses.length} icon={Building2} />
          <KpiCard label="Total Capacity" value={`${totalCapacity.toLocaleString()} tons`} icon={Package} />
          <KpiCard label="Available Space" value={`${totalAvailable.toLocaleString()} tons`} icon={PackageOpen} tone="success" />
          <KpiCard label="Occupied Space" value={`${occupied.toLocaleString()} tons`} icon={PackageCheck} tone={occupied / (totalCapacity || 1) > 0.8 ? "danger" : "default"} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Stored Batches" value={storedBatches} />
          <KpiCard label="Pending Requests" value={pendingRequests} tone={pendingRequests > 0 ? "warning" : "default"} />
          <KpiCard label="Active Reservations" value={reservations.filter(r => r.status === "Active" || r.status === "Confirmed").length} />
          <KpiCard label="Occupancy Rate" value={`${totalCapacity > 0 ? Math.round((occupied / totalCapacity) * 100) : 0}%`} tone={occupied / (totalCapacity || 1) > 0.8 ? "danger" : "success"} />
        </div>

        {/* Warehouses overview */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">My Warehouses</h2>
              <button onClick={() => router.push("/warehouse/facilities")} className="text-xs text-primary hover:underline">Manage</button>
            </div>
            {warehouses.length === 0
              ? <EmptyState title="No warehouses" description="Add your first warehouse." action={
                  <button onClick={() => router.push("/warehouse/facilities")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                    <Plus className="h-4 w-4" /> Add Warehouse
                  </button>
                } />
              : <ul className="divide-y divide-border">
                  {warehouses.map(w => (
                    <li key={w.id} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <div className="font-medium">{w.name}</div>
                        <div className="text-xs text-muted-foreground">{w.type} · {w.district}</div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={w.status} />
                        <div className="mt-0.5 text-xs text-muted-foreground">{w.availableSpace}/{w.capacity} tons free</div>
                      </div>
                    </li>
                  ))}
                </ul>
            }
          </div>

          <div className="rounded-xl border border-border bg-background p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Pending Storage Requests</h2>
              <button onClick={() => router.push("/warehouse/requests")} className="text-xs text-primary hover:underline">View all</button>
            </div>
            {requests.filter(r => r.status === "Pending").length === 0
              ? <EmptyState title="No pending requests" description="Storage requests from farmers will appear here." />
              : <ul className="divide-y divide-border">
                  {requests.filter(r => r.status === "Pending").slice(0, 5).map(r => (
                    <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <div className="font-medium">{r.id}</div>
                        <div className="text-xs text-muted-foreground">Qty: {r.quantity} · {r.duration} days</div>
                      </div>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
            }
          </div>
        </div>
      </PageBody>
    </>
  );
}
