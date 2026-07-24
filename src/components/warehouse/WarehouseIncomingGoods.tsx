"use client";
import { useState } from "react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import {
  Download,
  Upload,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  User,
  Calendar,
  MapPin,
  Search,
  X,
  Eye,
  MoreVertical,
  ArrowUpDown,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface IncomingShipment {
  id: string;
  batchId: string;
  supplier: string;
  product: string;
  quantity: number;
  unit: string;
  expectedDate: string;
  actualDate?: string;
  status: "Scheduled" | "In Transit" | "Arrived" | "Inspecting" | "Completed" | "Delayed";
  priority: "Low" | "Medium" | "High" | "Critical";
  location: string;
  driver?: string;
  vehicle?: string;
  temperature?: string;
  quality?: string;
}

const shipments: IncomingShipment[] = [
  { id: "IN-2025-001", batchId: "BTH-1001", supplier: "Green Valley Farms", product: "Fresh Tomatoes", quantity: 500, unit: "kg", 
    expectedDate: "2025-01-25T09:00", actualDate: "2025-01-25T08:45", status: "Completed", priority: "High", 
    location: "Bay 3", driver: "John Doe", vehicle: "TRK-001", temperature: "4°C", quality: "Grade A" },
  { id: "IN-2025-002", batchId: "BTH-1002", supplier: "Sunrise Dairy Co.", product: "Organic Milk", quantity: 300, unit: "liters",
    expectedDate: "2025-01-25T10:30", status: "In Transit", priority: "Critical",
    location: "Bay 1", driver: "Jane Smith", vehicle: "TRK-002", temperature: "2°C" },
  { id: "IN-2025-003", batchId: "BTH-1003", supplier: "Mountain Coffee", product: "Arabica Beans", quantity: 200, unit: "kg",
    expectedDate: "2025-01-25T14:00", status: "Scheduled", priority: "Medium",
    location: "Warehouse A" },
  { id: "IN-2025-004", batchId: "BTH-1004", supplier: "Fresh Harvest Ltd", product: "Bananas", quantity: 400, unit: "kg",
    expectedDate: "2025-01-25T11:00", actualDate: "2025-01-25T11:15", status: "Inspecting", priority: "High",
    location: "Bay 2", driver: "Mike Johnson", vehicle: "TRK-003", temperature: "15°C" },
  { id: "IN-2025-005", batchId: "BTH-1005", supplier: "Quality Grains", product: "Rice", quantity: 600, unit: "kg",
    expectedDate: "2025-01-25T15:30", status: "Delayed", priority: "Low",
    location: "Warehouse B" },
];

export default function WarehouseIncomingGoodsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedShipment, setSelectedShipment] = useState<IncomingShipment | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "priority" | "supplier">("date");

  const getStatusColor = (status: IncomingShipment["status"]) => {
    const colors = {
      Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      "In Transit": "bg-amber-100 text-amber-700 border-amber-200",
      Arrived: "bg-purple-100 text-purple-700 border-purple-200",
      Inspecting: "bg-sky-100 text-sky-700 border-sky-200",
      Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Delayed: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status];
  };

  const getPriorityColor = (priority: IncomingShipment["priority"]) => {
    const colors = {
      Low: "text-slate-600",
      Medium: "text-yellow-600",
      High: "text-orange-600",
      Critical: "text-red-600",
    };
    return colors[priority];
  };

  const filtered = shipments.filter((s) => {
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    const matchSearch = !search || 
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.supplier.toLowerCase().includes(search.toLowerCase()) ||
      s.product.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: shipments.length,
    inTransit: shipments.filter(s => s.status === "In Transit").length,
    arrived: shipments.filter(s => s.status === "Arrived").length,
    inspecting: shipments.filter(s => s.status === "Inspecting").length,
  };

  return (
    <>
      <PageHeader
        title="Incoming Shipments"
        description="Real-time tracking and management of incoming warehouse deliveries"
        crumbs={[{ label: "Warehouse", href: "/warehouse/dashboard" }, { label: "Incoming" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
            <Button size="sm" variant="outline">
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
          </div>
        }
      />

      <PageBody>
        {/* Stats Row */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:from-blue-950/30 dark:to-blue-900/20">
            <div className="rounded-full bg-blue-500/20 p-2">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Shipments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 dark:from-amber-950/30 dark:to-amber-900/20">
            <div className="rounded-full bg-amber-500/20 p-2">
              <Truck className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inTransit}</p>
              <p className="text-xs text-muted-foreground">In Transit</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 dark:from-purple-950/30 dark:to-purple-900/20">
            <div className="rounded-full bg-purple-500/20 p-2">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.arrived}</p>
              <p className="text-xs text-muted-foreground">Arrived</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <div className="rounded-full bg-emerald-500/20 p-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.inspecting}</p>
              <p className="text-xs text-muted-foreground">Inspecting</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, supplier, or product..."
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-10 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {["All", "In Transit", "Arrived", "Inspecting", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                      statusFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-muted-foreground hover:bg-surface/80"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-surface/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      ID <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Expected</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Priority</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-surface/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/10 p-1.5">
                          <Upload className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{shipment.id}</p>
                          <p className="text-xs text-muted-foreground">{shipment.batchId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{shipment.supplier}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-foreground">{shipment.product}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">
                        {shipment.quantity} {shipment.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(shipment.expectedDate).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                        getStatusColor(shipment.status)
                      )}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-sm font-semibold", getPriorityColor(shipment.priority))}>
                        {shipment.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedShipment(shipment)}
                          className="rounded-lg p-1.5 hover:bg-surface"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="rounded-lg p-1.5 hover:bg-surface">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </PageBody>

      {/* Detail Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setSelectedShipment(null)}>
          <div className="w-full max-w-3xl rounded-2xl border border-border bg-background shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border bg-surface/50 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedShipment.id}</h2>
                  <p className="text-sm text-muted-foreground">Batch: {selectedShipment.batchId}</p>
                </div>
                <button onClick={() => setSelectedShipment(null)} className="rounded-lg p-2 hover:bg-surface">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/30 p-3">
                    <User className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Supplier</p>
                      <p className="font-semibold text-foreground">{selectedShipment.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/30 p-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Product</p>
                      <p className="font-semibold text-foreground">{selectedShipment.product}</p>
                      <p className="text-sm text-muted-foreground">{selectedShipment.quantity} {selectedShipment.unit}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/30 p-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground">{selectedShipment.location}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedShipment.driver && (
                    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/30 p-3">
                      <Truck className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Driver & Vehicle</p>
                        <p className="font-semibold text-foreground">{selectedShipment.driver}</p>
                        <p className="text-sm text-muted-foreground">{selectedShipment.vehicle}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/30 p-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expected Arrival</p>
                      <p className="font-semibold text-foreground">
                        {new Date(selectedShipment.expectedDate).toLocaleString()}
                      </p>
                      {selectedShipment.actualDate && (
                        <>
                          <p className="text-xs text-muted-foreground mt-1">Actual Arrival</p>
                          <p className="text-sm text-emerald-600 font-medium">
                            {new Date(selectedShipment.actualDate).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedShipment.temperature && (
                    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface/30 p-3">
                      <div className="text-primary text-lg mt-0.5">🌡️</div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p className="font-semibold text-foreground">{selectedShipment.temperature}</p>
                        {selectedShipment.quality && (
                          <p className="text-sm text-emerald-600 font-medium">{selectedShipment.quality}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button className="flex-1" variant="outline">Reject</Button>
                <Button className="flex-1">Approve & Store</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
