"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, MapPin, Truck, CheckCircle2, Clock, Navigation, 
  Fuel, AlertCircle, Phone, FileText, Camera, TrendingUp 
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common/ui";
import { transportService, productService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { TransportRequest } from "@/lib/storage";

export default function DriverDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const driverId = session?.claims.sub ?? "";

  const [deliveries, setDeliveries] = useState<TransportRequest[]>([]);
  const [currentDelivery, setCurrentDelivery] = useState<TransportRequest | null>(null);

  useEffect(() => {
    if (!driverId) return;
    // Get deliveries assigned to this driver
    const allTransport = transportService.getAll();
    const driverDeliveries = allTransport.filter(t => t.driverId === driverId);
    setDeliveries(driverDeliveries);
    // Set current active delivery
    const active = driverDeliveries.find(d => d.status === "In Transit" || d.status === "Assigned");
    setCurrentDelivery(active || null);
  }, [driverId]);

  const completedToday = deliveries.filter(d => 
    d.status === "Completed" || d.status === "Delivered"
  ).length;
  const pendingDeliveries = deliveries.filter(d => 
    d.status === "Pending" || d.status === "Assigned"
  ).length;
  const inTransit = deliveries.filter(d => d.status === "In Transit").length;
  const totalDistance = deliveries.length * 45; // Mock calculation

  // Mock fuel and vehicle data
  const fuelLevel = 72;
  const vehicleStatus = "Good";

  return (
    <>
      <PageHeader
        title={`Ready to roll, ${session?.claims.name?.split(" ")[0] ?? "Driver"}`}
        description="Your assigned trips and delivery status for today."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/driver/map")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <Navigation className="h-4 w-4" /> Navigate
            </button>
            {currentDelivery && (
              <button 
                onClick={() => router.push("/driver/proof")}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
              >
                <Camera className="h-4 w-4" /> Upload Proof
              </button>
            )}
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Deliveries Today</p>
              <p className="text-2xl font-semibold text-foreground">{deliveries.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <p className="text-2xl font-semibold text-emerald-600">{currentDelivery ? "Active" : "Idle"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distance Covered</p>
              <p className="text-2xl font-semibold text-foreground">{totalDistance} km</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fuel Level</p>
              <p className="text-2xl font-semibold text-foreground">{fuelLevel}%</p>
            </div>
          </div>
        </div>

        {/* Current Active Delivery */}
        {currentDelivery && (
          <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Active Delivery</h2>
                <p className="text-sm text-muted-foreground">Delivery #{currentDelivery.id}</p>
              </div>
            </div>
            
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Pickup Location
                </div>
                <p className="mt-2 font-semibold text-foreground">{currentDelivery.pickupLocation}</p>
              </div>
              
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  Destination
                </div>
                <p className="mt-2 font-semibold text-foreground">{currentDelivery.destination}</p>
              </div>
              
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Package className="h-4 w-4" />
                  Product & Quantity
                </div>
                <p className="mt-2 font-semibold text-foreground">
                  {productService.getById(currentDelivery.productId)?.name ?? "Product"} · {currentDelivery.quantity} units
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  transportService.update(currentDelivery.id, { status: "In Transit" });
                  window.location.reload();
                }}
                disabled={currentDelivery.status === "In Transit"}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              >
                <TrendingUp className="h-4 w-4" /> Start Delivery
              </button>
              <button
                onClick={() => router.push("/driver/map")}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm hover:bg-surface"
              >
                <Navigation className="h-4 w-4" /> View Route
              </button>
              <button
                onClick={() => router.push("/driver/proof")}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm hover:bg-surface"
              >
                <Camera className="h-4 w-4" /> Upload Proof
              </button>
              <button
                onClick={() => {
                  transportService.update(currentDelivery.id, { status: "Completed" });
                  window.location.reload();
                }}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark Complete
              </button>
            </div>
          </div>
        )}

        {/* All Deliveries List */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Today's Deliveries</h3>
              <p className="text-sm text-muted-foreground">All assigned trips for today</p>
            </div>
            <button 
              onClick={() => router.push("/driver/history")}
              className="text-sm font-medium text-primary hover:underline"
            >
              View History
            </button>
          </div>

          {deliveries.length === 0 ? (
            <EmptyState 
              title="No deliveries assigned" 
              description="Assigned deliveries will appear here." 
            />
          ) : (
            <div className="space-y-3">
              {deliveries.map((delivery) => {
                const product = productService.getById(delivery.productId);
                const farmer = userService.getUserName(delivery.farmerId);
                
                return (
                  <div 
                    key={delivery.id} 
                    className="flex items-center gap-4 rounded-lg border border-border bg-surface/50 p-4 transition-all hover:bg-surface"
                  >
                    <div className={`rounded-full p-3 ${
                      delivery.status === "Completed" || delivery.status === "Delivered" ? "bg-emerald-500/10" :
                      delivery.status === "In Transit" ? "bg-blue-500/10" :
                      delivery.status === "Assigned" ? "bg-amber-500/10" : "bg-gray-500/10"
                    }`}>
                      {delivery.status === "Completed" || delivery.status === "Delivered" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : delivery.status === "In Transit" ? (
                        <Truck className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {delivery.pickupLocation} → {delivery.destination}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {product?.name ?? "Product"} · {delivery.quantity} units · From {farmer}
                          </p>
                        </div>
                        <StatusBadge status={delivery.status} />
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {delivery.preferredDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {delivery.vehicleType}
                        </span>
                        {delivery.estimatedCost && (
                          <span>Est. Cost: RWF {delivery.estimatedCost.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => router.push("/driver/map")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-blue-500/10 p-3">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">GPS Navigation</p>
              <p className="text-xs text-muted-foreground">View route map</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/driver/proof")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <Camera className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Proof of Delivery</p>
              <p className="text-xs text-muted-foreground">Upload photos</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/driver/timeline")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-purple-500/10 p-3">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Delivery Timeline</p>
              <p className="text-xs text-muted-foreground">View schedule</p>
            </div>
          </button>
        </div>

        {/* Fuel Warning */}
        {fuelLevel < 30 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              Low fuel warning - Please refuel soon ({fuelLevel}% remaining)
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
