"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Truck, Plus, Search, MapPin, Calendar, Package } from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { useSession } from "@/lib/auth/session";

// Mock transport request data
type TransportRequest = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pickupLocation: string;
  deliveryLocation: string;
  requestDate: string;
  preferredDate: string;
  status: "Pending" | "Assigned" | "In Transit" | "Delivered" | "Cancelled";
  transportId?: string;
  driverId?: string;
  estimatedCost: number;
};

const mockTransportRequests: TransportRequest[] = [
  {
    id: "TR-001",
    productId: "PRD-001",
    productName: "Coffee Beans",
    quantity: 500,
    unit: "kg",
    pickupLocation: "Gasabo District, Kigali",
    deliveryLocation: "Nyarugenge District, Kigali",
    requestDate: "2024-01-20",
    preferredDate: "2024-01-25",
    status: "Pending",
    estimatedCost: 50000,
  },
  {
    id: "TR-002",
    productId: "PRD-002",
    productName: "Tea Leaves",
    quantity: 300,
    unit: "kg",
    pickupLocation: "Rulindo District, Northern Province",
    deliveryLocation: "Gasabo District, Kigali",
    requestDate: "2024-01-18",
    preferredDate: "2024-01-22",
    status: "Assigned",
    transportId: "TRANS-001",
    driverId: "DRV-001",
    estimatedCost: 75000,
  },
];

export default function FarmerTransportPage() {
  const router = useRouter();
  const session = useSession();
  const farmerId = session?.claims.sub ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const allRequests = useMemo(() => mockTransportRequests, []);

  const filteredRequests = useMemo(() => {
    return allRequests.filter(request => {
      const matchesSearch =
        !searchQuery ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !filterStatus || request.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [allRequests, searchQuery, filterStatus]);

  const totalRequests = allRequests.length;
  const pendingRequests = allRequests.filter(r => r.status === "Pending").length;
  const activeRequests = allRequests.filter(r => r.status === "Assigned" || r.status === "In Transit").length;
  const completedRequests = allRequests.filter(r => r.status === "Delivered").length;

  const handleNewRequest = () => {
    router.push("/farmer/transport/new");
  };

  const handleViewRequest = (id: string) => {
    router.push(`/farmer/transport/${id}`);
  };

  return (
    <>
      <PageHeader
        title="Transport Requests"
        description="Manage transportation for your products"
        actions={
          <button
            onClick={handleNewRequest}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        }
      />

      <PageBody>
        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-semibold text-foreground">{totalRequests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-amber-600">{pendingRequests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold text-blue-600">{activeRequests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold text-emerald-600">{completedRequests}</p>
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
                placeholder="Search transport requests..."
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
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
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

        {/* Transport Requests */}
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={<Truck className="h-12 w-12" />}
            title="No transport requests found"
            description={
              searchQuery || filterStatus
                ? "Try adjusting your filters"
                : "Request transportation for your products"
            }
            action={
              !searchQuery && !filterStatus ? (
                <button
                  onClick={handleNewRequest}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Create First Request
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Request #{request.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {request.productName}
                        </p>
                      </div>
                      <StatusBadge status={request.status} size="sm" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-start gap-2">
                        <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium text-foreground">
                            {request.quantity} {request.unit}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="font-medium text-foreground">
                            {request.pickupLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">To</p>
                          <p className="font-medium text-foreground">
                            {request.deliveryLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Preferred Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(request.preferredDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Estimated Cost</p>
                        <p className="font-medium text-foreground">
                          RWF {request.estimatedCost.toLocaleString()}
                        </p>
                      </div>

                      {request.transportId && (
                        <div>
                          <p className="text-xs text-muted-foreground">Transport ID</p>
                          <p className="font-medium text-foreground">
                            {request.transportId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewRequest(request.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
