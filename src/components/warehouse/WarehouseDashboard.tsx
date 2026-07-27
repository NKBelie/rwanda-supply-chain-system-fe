"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Package, PackageOpen, PackageCheck, ClipboardList, Plus, ArrowDownCircle, ArrowUpCircle, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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

  // Additional statistics
  const completedDeliveries = 28; // Mock data
  const inTransitDeliveries = 5;
  const scheduledDeliveries = 8;
  
  // Storage trends (mock data for visualization)
  const storageTrends = [
    { day: "Mon", incoming: 12, outgoing: 8 },
    { day: "Tue", incoming: 15, outgoing: 10 },
    { day: "Wed", incoming: 10, outgoing: 12 },
    { day: "Thu", incoming: 18, outgoing: 9 },
    { day: "Fri", incoming: 14, outgoing: 15 },
    { day: "Sat", incoming: 8, outgoing: 6 },
    { day: "Sun", incoming: 5, outgoing: 4 },
  ];

  // Capacity alerts
  const nearCapacityWarehouses = warehouses.filter(w => {
    const occupancyRate = ((w.capacity - w.availableSpace) / w.capacity) * 100;
    return occupancyRate > 80;
  });

  // Mock data for incoming/outgoing flow
  const incomingGoods = [
    { id: "IN-001", supplier: "Green Valley Farms", product: "Maize", quantity: 500, unit: "kg", eta: "Today 2:00 PM", status: "In Transit" as const },
    { id: "IN-002", supplier: "Fresh Harvest Co.", product: "Tomatoes", quantity: 200, unit: "kg", eta: "Today 4:30 PM", status: "Scheduled" as const },
    { id: "IN-003", supplier: "Dairy Best", product: "Milk", quantity: 300, unit: "liters", eta: "Tomorrow 9:00 AM", status: "Scheduled" as const },
  ];

  const outgoingGoods = [
    { id: "OUT-001", customer: "City Mart", product: "Rice", quantity: 400, unit: "kg", delivery: "In Progress", status: "Dispatched" as const },
    { id: "OUT-002", customer: "Premium Hotels", product: "Coffee", quantity: 150, unit: "kg", delivery: "Preparing", status: "Packing" as const },
    { id: "OUT-003", customer: "Export Global", product: "Beans", quantity: 600, unit: "kg", delivery: "Completed", status: "Delivered" as const },
  ];

  return (
    <>
      <PageHeader
        title={`Warehouse Control — ${session?.claims.name?.split(" ")[0] ?? "Manager"}`}
        description="Real-time capacity and logistics flow management."
        actions={
          <div className="flex gap-2">
            <button onClick={() => router.push("/warehouse/facilities")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
              <Plus className="h-4 w-4" /> Add Warehouse
            </button>
            <button onClick={() => router.push("/warehouse/requests")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface">
              <ClipboardList className="h-4 w-4" /> Requests {pendingRequests > 0 && <span className="ml-1 rounded-full bg-warning px-1.5 text-[10px] font-semibold text-white">{pendingRequests}</span>}
            </button>
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Warehouses</p>
              <p className="text-2xl font-semibold text-foreground">{warehouses.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
              <p className="text-2xl font-semibold text-foreground">{totalCapacity.toLocaleString()} tons</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Space</p>
              <p className="text-2xl font-semibold text-emerald-600">{totalAvailable.toLocaleString()} tons</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              <p className="text-2xl font-semibold text-foreground">{totalCapacity > 0 ? Math.round((occupied / totalCapacity) * 100) : 0}%</p>
            </div>
          </div>
        </div>

        {/* Incoming/Outgoing Flow Section */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Incoming Goods */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <ArrowDownCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Incoming Goods</h2>
                  <p className="text-sm text-muted-foreground">Expected arrivals</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/warehouse/incoming")}
                className="text-sm font-medium text-emerald-600 hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {incomingGoods.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3">
                  <div className={`rounded-full p-2 ${item.status === "In Transit" ? "bg-orange-500/10" : "bg-blue-500/10"}`}>
                    {item.status === "In Transit" ? (
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.product}</p>
                        <p className="text-xs text-muted-foreground">{item.supplier}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-semibold ${item.status === "In Transit" ? "text-orange-600" : "text-blue-600"}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{item.quantity} {item.unit}</span>
                      <span>•</span>
                      <span>ETA: {item.eta}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outgoing Goods */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <ArrowUpCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Outgoing Goods</h2>
                  <p className="text-sm text-muted-foreground">Active deliveries</p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/warehouse/outgoing")}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View all →
              </button>
            </div>
            <div className="space-y-3">
              {outgoingGoods.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition-all hover:border-blue-500/30 hover:shadow-sm">
                  <div className={`rounded-full p-2 ${
                    item.status === "Delivered" ? "bg-emerald-500/10" : 
                    item.status === "Dispatched" ? "bg-orange-500/10" : "bg-yellow-500/10"
                  }`}>
                    {item.status === "Delivered" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : item.status === "Dispatched" ? (
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.product}</p>
                        <p className="text-xs text-muted-foreground">{item.customer}</p>
                      </div>
                      <span className={`shrink-0 text-xs font-semibold ${
                        item.status === "Delivered" ? "text-emerald-600" : 
                        item.status === "Dispatched" ? "text-orange-600" : "text-yellow-600"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{item.quantity} {item.unit}</span>
                      <span>•</span>
                      <span>{item.delivery}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
            <div className="rounded-lg bg-purple-500/10 p-2.5">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stored Batches</p>
              <p className="text-xl font-bold text-foreground">{storedBatches}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
            <div className="rounded-lg bg-amber-500/10 p-2.5">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Requests</p>
              <p className="text-xl font-bold text-foreground">{pendingRequests}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
            <div className="rounded-lg bg-blue-500/10 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Reservations</p>
              <p className="text-xl font-bold text-foreground">{reservations.filter(r => r.status === "Active" || r.status === "Confirmed").length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2.5">
              <PackageOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Free Capacity</p>
              <p className="text-xl font-bold text-foreground">{((totalAvailable / (totalCapacity || 1)) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Storage Activity Trends */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Weekly Activity</h3>
              <p className="text-sm text-muted-foreground">Incoming vs Outgoing shipments</p>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2" style={{ height: "180px" }}>
            {storageTrends.map((day, idx) => {
              const maxValue = Math.max(...storageTrends.flatMap(d => [d.incoming, d.outgoing]));
              const incomingHeight = (day.incoming / maxValue) * 100;
              const outgoingHeight = (day.outgoing / maxValue) * 100;
              
              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex gap-1 items-end" style={{ height: "140px" }}>
                    <div className="flex-1 relative group">
                      <div
                        className="w-full rounded-t bg-emerald-500 transition-all hover:bg-emerald-600"
                        style={{ height: `${incomingHeight}%` }}
                      />
                      <div className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-[10px] text-white whitespace-nowrap">
                        In: {day.incoming}
                      </div>
                    </div>
                    <div className="flex-1 relative group">
                      <div
                        className="w-full rounded-t bg-blue-500 transition-all hover:bg-blue-600"
                        style={{ height: `${outgoingHeight}%` }}
                      />
                      <div className="invisible group-hover:visible absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-[10px] text-white whitespace-nowrap">
                        Out: {day.outgoing}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-muted-foreground">{day.day}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Incoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Outgoing</span>
            </div>
          </div>
        </div>

        {/* Delivery Status Overview */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Delivery Status Overview</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Completed</p>
                  <p className="mt-1 text-3xl font-bold text-green-800 dark:text-green-300">{completedDeliveries}</p>
                  <p className="mt-1 text-xs text-green-600 dark:text-green-500">This week</p>
                </div>
                <div className="rounded-full bg-green-200 dark:bg-green-900/50 p-3">
                  <CheckCircle2 className="h-6 w-6 text-green-700 dark:text-green-400" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-400">In Transit</p>
                  <p className="mt-1 text-3xl font-bold text-orange-800 dark:text-orange-300">{inTransitDeliveries}</p>
                  <p className="mt-1 text-xs text-orange-600 dark:text-orange-500">Active now</p>
                </div>
                <div className="rounded-full bg-orange-200 dark:bg-orange-900/50 p-3">
                  <TrendingUp className="h-6 w-6 text-orange-700 dark:text-orange-400" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Scheduled</p>
                  <p className="mt-1 text-3xl font-bold text-blue-800 dark:text-blue-300">{scheduledDeliveries}</p>
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-500">Upcoming</p>
                </div>
                <div className="rounded-full bg-blue-200 dark:bg-blue-900/50 p-3">
                  <Clock className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity Alerts */}
        {nearCapacityWarehouses.length > 0 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Capacity Warning
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                  {nearCapacityWarehouses.length} warehouse{nearCapacityWarehouses.length > 1 ? "s are" : " is"} near capacity {`(>80%)`}
                </p>
                <ul className="mt-3 space-y-2">
                  {nearCapacityWarehouses.map(w => {
                    const occupancyRate = ((w.capacity - w.availableSpace) / w.capacity) * 100;
                    return (
                      <li key={w.id} className="flex items-center justify-between rounded-lg border border-amber-300 bg-white dark:bg-amber-950/30 p-3 text-sm">
                        <div>
                          <p className="font-medium text-foreground">{w.name}</p>
                          <p className="text-xs text-muted-foreground">{w.district}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-amber-700 dark:text-amber-400">{occupancyRate.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">{w.availableSpace} tons left</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

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
                        <div className="font-medium">Storage Request</div>
                        <div className="text-xs text-muted-foreground">{r.quantity} units · {r.duration} days · {new Date(r.requestDate).toLocaleDateString()}</div>
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
