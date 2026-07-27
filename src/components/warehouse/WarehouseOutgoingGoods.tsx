"use client";
import { useState } from "react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import {
  Send,
  Package2,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Search,
  X,
  FileText,
  ArrowRight,
  Building2,
  BarChart2,
  Calendar,
  Filter as FilterIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OutgoingOrder {
  id: string;
  orderRef: string;
  customer: string;
  customerType: "Retailer" | "Wholesaler" | "Restaurant" | "Export";
  product: string;
  quantity: number;
  unit: string;
  destination: string;
  contactPerson: string;
  contactPhone: string;
  scheduledDate: string;
  status: "Preparing" | "Packed" | "Loading" | "Dispatched" | "Delivered";
  priority: "Standard" | "Express" | "Urgent";
  trackingId?: string;
  notes?: string;
}

const orders: OutgoingOrder[] = [
  { id: "OUT-2025-001", orderRef: "ORD-5432", customer: "Fresh Mart Supermarket", customerType: "Retailer",
    product: "Organic Tomatoes", quantity: 250, unit: "kg", destination: "Downtown Kigali",
    contactPerson: "Alice Mugabe", contactPhone: "+250 788 111 222",
    scheduledDate: "2025-01-25 08:00", status: "Dispatched", priority: "Express",
    trackingId: "TRK-9876", notes: "Handle with care - fragile items" },
  { id: "OUT-2025-002", orderRef: "ORD-5433", customer: "Premium Hotels Ltd", customerType: "Restaurant",
    product: "Fresh Milk", quantity: 150, unit: "liters", destination: "Hotel District",
    contactPerson: "Bob Uwase", contactPhone: "+250 788 333 444",
    scheduledDate: "2025-01-25 09:30", status: "Packed", priority: "Urgent",
    notes: "Morning delivery required" },
  { id: "OUT-2025-003", orderRef: "ORD-5434", customer: "City Wholesale", customerType: "Wholesaler",
    product: "Rice", quantity: 500, unit: "kg", destination: "Industrial Zone",
    contactPerson: "Carol Niyonsenga", contactPhone: "+250 788 555 666",
    scheduledDate: "2025-01-25 14:00", status: "Packed", priority: "Standard" },
  { id: "OUT-2025-004", orderRef: "ORD-5435", customer: "Export Global", customerType: "Export",
    product: "Coffee Beans", quantity: 300, unit: "kg", destination: "Airport Cargo",
    contactPerson: "David Kamanzi", contactPhone: "+250 788 777 888",
    scheduledDate: "2025-01-25 16:00", status: "Preparing", priority: "Express" },
];

export default function WarehouseOutgoingGoodsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<OutgoingOrder | null>(null);
  const [newOrderModal, setNewOrderModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    customer: "",
    customerType: "Retailer" as OutgoingOrder["customerType"],
    product: "",
    quantity: "",
    unit: "kg",
    destination: "",
    contactPerson: "",
    contactPhone: "",
    scheduledDate: "",
    priority: "Standard" as OutgoingOrder["priority"],
    notes: ""
  });

  const getStatusConfig = (status: OutgoingOrder["status"]) => {
    const configs = {
      Preparing: { color: "bg-yellow-100 text-yellow-700 border-yellow-300", icon: Clock },
      Packed: { color: "bg-blue-100 text-blue-700 border-blue-300", icon: Package2 },
      Loading: { color: "bg-purple-100 text-purple-700 border-purple-300", icon: Truck },
      Dispatched: { color: "bg-orange-100 text-orange-700 border-orange-300", icon: Send },
      Delivered: { color: "bg-green-100 text-green-700 border-green-300", icon: CheckCircle },
    };
    return configs[status];
  };

  const getCustomerTypeBadge = (type: OutgoingOrder["customerType"]) => {
    const colors = {
      Retailer: "bg-blue-100 text-blue-700",
      Wholesaler: "bg-purple-100 text-purple-700",
      Restaurant: "bg-pink-100 text-pink-700",
      Export: "bg-indigo-100 text-indigo-700",
    };
    return colors[type];
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    preparing: orders.filter(o => o.status === "Preparing").length,
    packed: orders.filter(o => o.status === "Packed").length,
    dispatched: orders.filter(o => o.status === "Dispatched").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
  };

  return (
    <>
      <PageHeader
        title="Outgoing Orders"
        description="Manage and track outgoing shipments to customers"
        crumbs={[{ label: "Warehouse", href: "/warehouse/dashboard" }, { label: "Outgoing" }]}
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <BarChart2 className="mr-1.5 h-4 w-4" /> Reports
            </Button>
            <Button size="sm" onClick={() => setNewOrderModal(true)}>
              <Send className="mr-1.5 h-4 w-4" /> New Order
            </Button>
          </div>
        }
      />

      <PageBody>
        {/* Dashboard Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Preparing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-foreground">{stats.preparing}</p>
                <Clock className="h-8 w-8 text-yellow-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Packed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-foreground">{stats.packed}</p>
                <Package2 className="h-8 w-8 text-blue-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dispatched</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-foreground">{stats.dispatched}</p>
                <Truck className="h-8 w-8 text-orange-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-bold text-foreground">{stats.delivered}</p>
                <CheckCircle className="h-8 w-8 text-green-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-10 text-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["All", "Preparing", "Packed", "Dispatched", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition",
                  statusFilter === status
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-surface hover:bg-surface/80"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <Card
                key={order.id}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
                <CardContent className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-foreground">{order.id}</h3>
                      <p className="text-xs text-muted-foreground">{order.orderRef}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <StatusIcon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="mb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">{order.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package2 className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">{order.product}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground truncate">{order.destination}</span>
                    </div>
                  </div>

                  <div className="mb-3 flex items-center justify-between rounded-lg bg-surface p-2">
                    <span className="text-xs text-muted-foreground">Quantity</span>
                    <span className="text-sm font-bold text-foreground">{order.quantity} {order.unit}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", getCustomerTypeBadge(order.customerType))}>
                      {order.customerType}
                    </span>
                    <span className={cn("rounded-full border px-2 py-1 text-xs font-medium", statusConfig.color)}>
                      {order.status}
                    </span>
                  </div>

                  {order.priority === "Urgent" && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                      <Clock className="h-3 w-3" />
                      Urgent Priority
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="mt-8">
            <CardContent className="py-12 text-center">
              <Send className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-3 text-lg font-medium text-foreground">No orders found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </PageBody>


      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">Order Details</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-2 hover:bg-surface transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Status */}
              <div className="rounded-lg border p-4 bg-surface/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Status</span>
                  <span className={cn("rounded-full border px-3 py-1 text-sm font-medium", getStatusConfig(selectedOrder.status).color)}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Priority</span>
                  <span className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold",
                    selectedOrder.priority === "Urgent" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                  )}>
                    {selectedOrder.priority}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  Customer Information
                </h3>
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium text-foreground">{selectedOrder.customer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", getCustomerTypeBadge(selectedOrder.customerType))}>
                      {selectedOrder.customerType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contact Person</span>
                    <span className="text-sm font-medium text-foreground">{selectedOrder.contactPerson}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Phone</span>
                    <span className="text-sm font-medium text-foreground">{selectedOrder.contactPhone}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-muted-foreground">Destination</span>
                    <span className="text-sm font-medium text-foreground text-right max-w-xs">{selectedOrder.destination}</span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Package2 className="h-4 w-4 text-primary" />
                  Product Details
                </h3>
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Order Reference</span>
                    <span className="text-sm font-mono font-medium text-foreground">{selectedOrder.orderRef}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Product</span>
                    <span className="text-sm font-medium text-foreground">{selectedOrder.product}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quantity</span>
                    <span className="text-sm font-bold text-foreground">{selectedOrder.quantity} {selectedOrder.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Scheduled Date</span>
                    <span className="text-sm font-medium text-foreground">{selectedOrder.scheduledDate}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Truck className="h-4 w-4 text-primary" />
                  Shipping Details
                </h3>
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Destination</span>
                    <span className="text-sm font-medium text-foreground">{selectedOrder.destination}</span>
                  </div>
                  {selectedOrder.trackingId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tracking ID</span>
                      <span className="text-sm font-mono font-medium text-foreground">{selectedOrder.trackingId}</span>
                    </div>
                  )}
                  {selectedOrder.notes && (
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-muted-foreground">Notes</span>
                      <span className="text-sm font-medium text-foreground text-right max-w-xs">{selectedOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                {selectedOrder.status === "Preparing" && (
                  <button className="flex-1 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition flex items-center justify-center gap-2">
                    <Package2 className="h-4 w-4" />
                    Mark as Packed
                  </button>
                )}
                {selectedOrder.status === "Packed" && (
                  <button className="flex-1 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition flex items-center justify-center gap-2">
                    <Truck className="h-4 w-4" />
                    Mark as Dispatched
                  </button>
                )}
                {selectedOrder.status === "Dispatched" && (
                  <button className="flex-1 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600 transition flex items-center justify-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirm Delivery
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-surface transition"
                >
                  Close
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
