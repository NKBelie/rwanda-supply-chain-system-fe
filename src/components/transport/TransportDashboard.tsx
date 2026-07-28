"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Truck, Users, MapPin, TrendingUp, AlertCircle, 
  Clock, CheckCircle2, Fuel, Wrench, Calendar,
  DollarSign, Package, Navigation
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common/ui";
import { transportService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { TransportRequest } from "@/lib/storage";

// Mock data for fleet and drivers
interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  capacity: number;
  status: "Available" | "In Use" | "Maintenance";
  fuelLevel: number;
  lastService: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicleId?: string;
  status: "Available" | "On Trip" | "Off Duty";
  rating: number;
  tripsCompleted: number;
}

export default function TransportDashboardPage() {
  const session = useSession();
  const router = useRouter();
  const companyId = session?.claims.sub ?? "";

  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    if (!companyId) return;
    
    // Get transport requests (mock: all requests)
    const allRequests = transportService.getAll();
    setTransportRequests(allRequests);
    
    // Mock fleet data
    setVehicles([
      { id: "V001", plateNumber: "RAC 123 A", type: "Truck", capacity: 5000, status: "In Use", fuelLevel: 75, lastService: "2026-07-15" },
      { id: "V002", plateNumber: "RAC 456 B", type: "Van", capacity: 2000, status: "Available", fuelLevel: 90, lastService: "2026-07-10" },
      { id: "V003", plateNumber: "RAC 789 C", type: "Truck", capacity: 10000, status: "Available", fuelLevel: 85, lastService: "2026-07-20" },
      { id: "V004", plateNumber: "RAC 012 D", type: "Pickup", capacity: 1000, status: "Maintenance", fuelLevel: 20, lastService: "2026-06-28" },
      { id: "V005", plateNumber: "RAC 345 E", type: "Truck", capacity: 7500, status: "In Use", fuelLevel: 60, lastService: "2026-07-18" },
    ]);
    
    // Mock driver data
    setDrivers([
      { id: "D001", name: "Jean Mugabo", phone: "+250 788 123 456", licenseNumber: "DL-2024-001", vehicleId: "V001", status: "On Trip", rating: 4.8, tripsCompleted: 156 },
      { id: "D002", name: "Alice Uwase", phone: "+250 788 234 567", licenseNumber: "DL-2024-002", status: "Available", rating: 4.9, tripsCompleted: 203 },
      { id: "D003", name: "Patrick Nkusi", phone: "+250 788 345 678", licenseNumber: "DL-2024-003", vehicleId: "V005", status: "On Trip", rating: 4.7, tripsCompleted: 128 },
      { id: "D004", name: "Grace Kanyana", phone: "+250 788 456 789", licenseNumber: "DL-2024-004", status: "Off Duty", rating: 4.6, tripsCompleted: 95 },
    ]);
  }, [companyId]);

  // Calculate KPIs
  const activeVehicles = vehicles.filter(v => v.status === "In Use").length;
  const availableVehicles = vehicles.filter(v => v.status === "Available").length;
  const maintenanceVehicles = vehicles.filter(v => v.status === "Maintenance").length;
  
  const activeDrivers = drivers.filter(d => d.status === "On Trip").length;
  const availableDrivers = drivers.filter(d => d.status === "Available").length;
  
  const pendingRequests = transportRequests.filter(r => r.status === "Pending").length;
  const activeTrips = transportRequests.filter(r => r.status === "In Transit" || r.status === "Assigned").length;
  const completedToday = transportRequests.filter(r => r.status === "Completed" || r.status === "Delivered").length;
  
  const totalRevenue = transportRequests.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);
  const avgFuelLevel = vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / vehicles.length;

  return (
    <>
      <PageHeader
        title={`Fleet Management — ${session?.claims.name?.split(" ")[0] ?? "Manager"}`}
        description="Manage your fleet, drivers, transport requests, and logistics operations."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/transport/vehicles")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <Truck className="h-4 w-4" /> Add Vehicle
            </button>
            <button 
              onClick={() => router.push("/transport/drivers")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
            >
              <Users className="h-4 w-4" /> Add Driver
            </button>
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Active Vehicles</p>
              <p className="text-2xl font-semibold text-foreground">{activeVehicles}/{vehicles.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Drivers</p>
              <p className="text-2xl font-semibold text-foreground">{activeDrivers}/{drivers.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Trips</p>
              <p className="text-2xl font-semibold text-foreground">{activeTrips}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-semibold text-foreground">RWF {(totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        {/* Fleet & Drivers Overview */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Fleet Status */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Fleet Status</h3>
                <p className="text-sm text-muted-foreground">{vehicles.length} total vehicles</p>
              </div>
              <button 
                onClick={() => router.push("/transport/vehicles")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Manage Fleet
              </button>
            </div>
            
            {vehicles.length === 0 ? (
              <EmptyState 
                title="No vehicles" 
                description="Add vehicles to start fleet operations."
              />
            ) : (
              <div className="space-y-2">
                {vehicles.slice(0, 4).map((vehicle) => (
                  <div 
                    key={vehicle.id} 
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <div className={`rounded-full p-2 ${
                      vehicle.status === "In Use" ? "bg-blue-500/10" :
                      vehicle.status === "Available" ? "bg-emerald-500/10" :
                      "bg-amber-500/10"
                    }`}>
                      <Truck className={`h-4 w-4 ${
                        vehicle.status === "In Use" ? "text-blue-600" :
                        vehicle.status === "Available" ? "text-emerald-600" :
                        "text-amber-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{vehicle.plateNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.type} · {vehicle.capacity}kg capacity
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        vehicle.status === "In Use" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
                        vehicle.status === "Available" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                        "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}>
                        {vehicle.status}
                      </span>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Fuel className="h-3 w-3" />
                        {vehicle.fuelLevel}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Driver Status */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Driver Status</h3>
                <p className="text-sm text-muted-foreground">{drivers.length} total drivers</p>
              </div>
              <button 
                onClick={() => router.push("/transport/drivers")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Manage Drivers
              </button>
            </div>
            
            {drivers.length === 0 ? (
              <EmptyState 
                title="No drivers" 
                description="Add drivers to your fleet."
              />
            ) : (
              <div className="space-y-2">
                {drivers.map((driver) => (
                  <div 
                    key={driver.id} 
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <div className={`rounded-full p-2 ${
                      driver.status === "On Trip" ? "bg-blue-500/10" :
                      driver.status === "Available" ? "bg-emerald-500/10" :
                      "bg-gray-500/10"
                    }`}>
                      <Users className={`h-4 w-4 ${
                        driver.status === "On Trip" ? "text-blue-600" :
                        driver.status === "Available" ? "text-emerald-600" :
                        "text-gray-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ⭐ {driver.rating} · {driver.tripsCompleted} trips
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        driver.status === "On Trip" ? "bg-blue-500/10 text-blue-700 dark:text-blue-400" :
                        driver.status === "Available" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                        "bg-gray-500/10 text-gray-700 dark:text-gray-400"
                      }`}>
                        {driver.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transport Requests */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Transport Requests</h3>
              <p className="text-sm text-muted-foreground">{pendingRequests} pending assignment</p>
            </div>
            <button 
              onClick={() => router.push("/transport/requests")}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </button>
          </div>
          
          {transportRequests.length === 0 ? (
            <EmptyState 
              title="No transport requests" 
              description="Transport requests will appear here."
            />
          ) : (
            <div className="space-y-2">
              {transportRequests.slice(0, 5).map((request) => {
                const farmer = userService.getUserName(request.farmerId);
                return (
                  <div 
                    key={request.id} 
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <div className={`rounded-full p-2 ${
                      request.status === "Completed" || request.status === "Delivered" ? "bg-emerald-500/10" :
                      request.status === "In Transit" ? "bg-blue-500/10" :
                      request.status === "Assigned" ? "bg-purple-500/10" :
                      "bg-amber-500/10"
                    }`}>
                      {request.status === "Completed" || request.status === "Delivered" ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : request.status === "In Transit" ? (
                        <Truck className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {request.pickupLocation} → {request.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From {farmer} · {request.quantity} units · {request.vehicleType}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={request.status} />
                      {request.estimatedCost && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          RWF {request.estimatedCost.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => router.push("/transport/vehicles")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-blue-500/10 p-3">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Fleet Management</p>
              <p className="text-xs text-muted-foreground">Manage vehicles</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/transport/drivers")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drivers</p>
              <p className="text-xs text-muted-foreground">Assign & track</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/transport/maintenance")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-amber-500/10 p-3">
              <Wrench className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Maintenance</p>
              <p className="text-xs text-muted-foreground">Schedule service</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/transport/routes")}
            className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/40 hover:bg-surface"
          >
            <div className="rounded-lg bg-purple-500/10 p-3">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">Route Planning</p>
              <p className="text-xs text-muted-foreground">Optimize routes</p>
            </div>
          </button>
        </div>

        {/* Alerts */}
        {(maintenanceVehicles > 0 || avgFuelLevel < 50) && (
          <div className="mt-6 space-y-3">
            {maintenanceVehicles > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <Wrench className="h-4 w-4" />
                  {maintenanceVehicles} vehicle{maintenanceVehicles > 1 ? 's' : ''} in maintenance - Fleet capacity reduced
                </div>
              </div>
            )}
            {avgFuelLevel < 50 && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  Average fleet fuel level low ({avgFuelLevel.toFixed(0)}%) - Schedule refueling
                </div>
              </div>
            )}
          </div>
        )}
      </PageBody>
    </>
  );
}
