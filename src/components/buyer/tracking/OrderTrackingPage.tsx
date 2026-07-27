"use client";
import { useState } from "react";
import { CheckCircle2, Circle, Clock, MapPin, Package, Search, Truck } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { shipments, type TrackingShipment } from "./data";

function statusColor(status: TrackingShipment["status"]) {
  if (status === "In Transit") return "bg-sky-500/10 text-sky-700";
  if (status === "Delivered") return "bg-emerald-500/10 text-emerald-700";
  if (status === "Delayed") return "bg-rose-500/10 text-rose-700";
  return "bg-amber-500/10 text-amber-700";
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-border overflow-hidden">
      <div
        className={cn("h-2 rounded-full transition-all", value === 100 ? "bg-emerald-500" : "bg-primary")}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function OrderTrackingPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TrackingShipment>(shipments[0]);

  const filtered = shipments.filter((s) => {
    const term = search.toLowerCase();
    return !term || [s.trackingRef, s.product, s.supplier].some((v) => v.toLowerCase().includes(term));
  });

  return (
    <>
      <PageHeader
        title="Order Tracking"
        description="Real-time visibility on your shipments and delivery milestones."
        crumbs={[{ label: "Buyer", href: "/buyer/dashboard" }, { label: "Order Tracking" }]}
      />
      <PageBody>
        <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
          {/* Left: shipment list */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product or tracking ref…"
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-background p-6 text-center text-sm text-muted-foreground">
                No shipments found.
              </div>
            ) : filtered.map((s) => (
              <button
                key={s.trackingRef}
                onClick={() => setSelected(s)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition",
                  selected.trackingRef === s.trackingRef
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-surface"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{s.product}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.supplier}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", statusColor(s.status))}>
                    {s.status}
                  </span>
                </div>
                <div className="mt-3">
                  <ProgressBar value={s.progress} />
                  <p className="text-xs text-muted-foreground mt-1.5">{s.distance}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Right: tracking detail */}
          {selected && (
            <div className="space-y-4">
              {/* Header card */}
              <Card className="border-border/80 bg-background shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-foreground">{selected.product}</h2>
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusColor(selected.status))}>
                          {selected.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{selected.supplier} → {selected.destination}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Tracking ref</p>
                      <p className="font-semibold text-foreground font-mono">{selected.trackingRef}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ProgressBar value={selected.progress} />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{selected.supplier}</span>
                      <span>{selected.destination}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: MapPin, label: "Current Location", value: selected.currentLocation },
                  { icon: Clock, label: "ETA", value: selected.estimatedArrival },
                  { icon: Truck, label: "Vehicle", value: selected.vehicle },
                  { icon: Package, label: "Driver", value: selected.driver },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-border bg-background p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <Card className="border-border/80 bg-background shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Shipment Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-0">
                    {selected.events.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        {/* Line + dot */}
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2",
                            event.done
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground"
                          )}>
                            {event.done
                              ? <CheckCircle2 className="h-4 w-4" />
                              : <Circle className="h-4 w-4" />
                            }
                          </div>
                          {idx < selected.events.length - 1 && (
                            <div className={cn("mt-1 mb-1 w-0.5 flex-1", event.done ? "bg-primary/30" : "bg-border")} style={{ minHeight: 28 }} />
                          )}
                        </div>
                        {/* Content */}
                        <div className="pb-6">
                          <div className="flex items-center gap-2">
                            <p className={cn("text-sm font-semibold", event.done ? "text-foreground" : "text-muted-foreground")}>
                              {event.label}
                            </p>
                            <span className="text-xs text-muted-foreground">{event.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{event.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card className="border-border/80 bg-background shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Live Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-48 rounded-xl bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-50 dark:from-emerald-950/30 dark:via-sky-950/30 dark:to-blue-950/30 border border-border flex items-center justify-center overflow-hidden">
                    {/* Simple visual map representation */}
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="absolute border-b border-primary" style={{ top: `${i * 14}%`, left: 0, right: 0 }} />
                      ))}
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="absolute border-r border-primary" style={{ left: `${i * 14}%`, top: 0, bottom: 0 }} />
                      ))}
                    </div>
                    <div className="text-center z-10">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg">
                        <Truck className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-foreground">{selected.currentLocation}</p>
                      <p className="text-xs text-muted-foreground">{selected.distance}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-center text-muted-foreground">
                    Live GPS updates every 5 minutes · Connect to logistics API for real-time map
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
