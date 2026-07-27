"use client";
import { useState } from "react";
import { MapPin, Package, Truck, X } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { statusColor } from "../shared/data";

type TripStatus = "In Transit" | "Delivered" | "Scheduled" | "Delayed" | "Cancelled";

type Trip = {
  id: string; orderId: string; cargo: string; qty: string;
  origin: string; destination: string; driver: string; vehicle: string;
  status: TripStatus; departureDate: string; eta: string; progress: number;
};

const trips: Trip[] = [
  { id: "TRIP-801", orderId: "ORD-5501", cargo: "Roasted Arabica Coffee", qty: "500 packs", origin: "WH-02 Remera", destination: "Kigali Retail Ltd, CBD", driver: "Jean Uwimana", vehicle: "KGL-282 · Toyota Hiace", status: "In Transit", departureDate: "2026-07-23", eta: "Today 14:30", progress: 75 },
  { id: "TRIP-800", orderId: "ORD-5499", cargo: "Roasted Arabica Coffee", qty: "300 packs", origin: "WH-02 Remera", destination: "Musanze Union", driver: "Alice Ingabire", vehicle: "KGL-307 · Isuzu NPR", status: "Delivered", departureDate: "2026-07-18", eta: "Delivered", progress: 100 },
  { id: "TRIP-802", orderId: "ORD-5500", cargo: "Maize Flour 1kg bags", qty: "1,200 bags", origin: "WH-02 Remera", destination: "East Retail Chain, Nyabugogo", driver: "Paul Nkurunziza", vehicle: "KGL-415 · Refrigerated Van", status: "Scheduled", departureDate: "2026-07-25", eta: "2026-07-26", progress: 0 },
  { id: "TRIP-803", orderId: "ORD-5498", cargo: "Tomato Paste tins", qty: "800 tins", origin: "WH-01 Industrial Zone", destination: "AgriFinance Coop, Huye", driver: "Marie Mukamana", vehicle: "KGL-190 · Mitsubishi Canter", status: "Scheduled", departureDate: "2026-07-27", eta: "2026-07-28", progress: 0 },
];

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-1.5 w-full rounded-full bg-border">
    <div className={cn("h-1.5 rounded-full", value === 100 ? "bg-emerald-500" : "bg-primary")} style={{ width: `${value}%` }} />
  </div>
);

export function TransportPage() {
  const [selected, setSelected] = useState<Trip | null>(null);

  return (
    <>
      <PageHeader
        title="Transport"
        description="Track outgoing shipments and coordinate delivery logistics."
        crumbs={[{ label: "Manufacturer", href: "/manufacturer/dashboard" }, { label: "Transport" }]}
        actions={<Button size="sm"><Truck className="mr-1.5 h-4 w-4" />Schedule Trip</Button>}
      />
      <PageBody>
        {/* KPIs */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Trips", value: trips.length },
            { label: "In Transit", value: trips.filter((t) => t.status === "In Transit").length },
            { label: "Delivered", value: trips.filter((t) => t.status === "Delivered").length },
            { label: "Scheduled", value: trips.filter((t) => t.status === "Scheduled").length },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-background p-4 shadow-sm text-center">
              <p className="text-2xl font-semibold text-foreground">{k.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Active shipments */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Active & Upcoming Shipments</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {trips.filter((t) => t.status !== "Delivered").map((trip) => (
              <div key={trip.id} className="rounded-xl border border-border bg-background p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{trip.cargo}</p>
                    <p className="text-xs text-muted-foreground">{trip.origin} → {trip.destination}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", statusColor(trip.status))}>{trip.status}</span>
                </div>
                {trip.status === "In Transit" && (
                  <div className="mb-2">
                    <ProgressBar value={trip.progress} />
                    <p className="text-xs text-muted-foreground mt-1">ETA: {trip.eta}</p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{trip.origin} → {trip.destination}</div>
                  <div className="flex items-center gap-1.5"><Truck className="h-3 w-3" />{trip.vehicle}</div>
                  <div className="flex items-center gap-1.5"><Package className="h-3 w-3" />{trip.qty}</div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => setSelected(trip)}>View Details</Button>
              </div>
            ))}
          </div>
        </div>

        {/* All trips table */}
        <Card className="border-border/80 bg-background shadow-sm">
          <CardHeader><CardTitle className="text-base">All Trips</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Route</th>
                  <th className="px-4 py-3 text-left">Cargo</th>
                  <th className="px-4 py-3 text-left">Driver</th>
                  <th className="px-4 py-3 text-left">Departure</th>
                  <th className="px-4 py-3 text-left">ETA</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{trip.origin} → {trip.destination}</td>
                    <td className="px-4 py-3"><p className="font-medium">{trip.cargo}</p><p className="text-xs text-muted-foreground">{trip.qty}</p></td>
                    <td className="px-4 py-3 text-muted-foreground">{trip.driver}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{trip.departureDate}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{trip.eta}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColor(trip.status))}>{trip.status}</span></td>
                    <td className="px-4 py-3"><button onClick={() => setSelected(trip)} className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-surface">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageBody>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div><h2 className="text-lg font-semibold">{selected.cargo}</h2><p className="text-sm text-muted-foreground">{selected.origin} → {selected.destination}</p></div>
              <button onClick={() => setSelected(null)} className="rounded-lg border border-border p-1.5 hover:bg-surface"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[["Origin", selected.origin], ["Destination", selected.destination], ["Driver", selected.driver], ["Vehicle", selected.vehicle], ["Departure", selected.departureDate], ["ETA", selected.eta]].map(([l, v]) => (
                  <div key={l} className="rounded-xl border border-border bg-surface p-3"><p className="text-xs text-muted-foreground">{l}</p><p className="font-medium mt-0.5">{v}</p></div>
                ))}
              </div>
              {selected.status === "In Transit" && (
                <div className="rounded-xl border border-border bg-surface p-3">
                  <ProgressBar value={selected.progress} />
                  <p className="text-xs text-muted-foreground mt-1">{selected.progress}% complete</p>
                </div>
              )}
              <div className="flex items-center justify-center">
                <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", statusColor(selected.status))}>{selected.status}</span>
              </div>
            </div>
            <div className="mt-5 flex justify-end"><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button></div>
          </div>
        </div>
      )}
    </>
  );
}
