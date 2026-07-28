"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge } from "@/components/common";
import { 
  MapPin, 
  Navigation, 
  Phone, 
  CheckCircle, 
  Package,
  Clock,
  AlertCircle
} from "lucide-react";

export default function DriverDeliveryPage() {
  const [deliveryStatus, setDeliveryStatus] = useState<"pickup" | "in_transit" | "delivered">("in_transit");

  // Mock current delivery
  const currentDelivery = {
    id: "JOB-003",
    orderId: "ORD-12347",
    pickup: {
      location: "Highland Tea Estate",
      district: "Musanze",
      address: "RN4 Highway, Musanze",
      contact: "+250 788 123 456",
      contactName: "Jean Paul Uwimana"
    },
    delivery: {
      location: "Tea Processing Plant",
      district: "Kigali",
      address: "KK 15 Ave, Kicukiro",
      contact: "+250 788 654 321",
      contactName: "Marie Claire Mukandori"
    },
    cargo: "Tea Leaves",
    weight: 300,
    distance: 95,
    payment: 65000,
    scheduledDate: "2026-07-28",
    estimatedArrival: "2026-07-28T14:30:00",
    pickupTime: "2026-07-28T11:15:00",
    specialInstructions: "Handle with care. Keep cargo dry. Delivery must be made before 3 PM."
  };

  const handleStatusUpdate = (status: "pickup" | "in_transit" | "delivered") => {
    setDeliveryStatus(status);
    // In real app, update backend
  };

  const handleEmergency = () => {
    alert("Emergency services contacted. Support will reach out shortly.");
  };

  const progressSteps = [
    { key: "pickup", label: "Pickup Complete", completed: deliveryStatus !== "pickup" },
    { key: "in_transit", label: "In Transit", completed: deliveryStatus === "delivered" },
    { key: "delivered", label: "Delivered", completed: deliveryStatus === "delivered" }
  ];

  return (
    <>
      <PageHeader
        title="Current Delivery"
        description="Track and manage your active delivery"
      />
      <PageBody>
        {/* Status Progress */}
        <div className="mb-6 rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Delivery Progress</h2>
            <StatusBadge status={deliveryStatus === "delivered" ? "completed" : "in_transit"} />
          </div>

          <div className="relative">
            <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />
            <div className="space-y-6">
              {progressSteps.map((step, index) => (
                <div key={step.key} className="relative flex items-start gap-4">
                  <div
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      step.completed
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {deliveryStatus === "pickup" && (
              <button
                onClick={() => handleStatusUpdate("in_transit")}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm Pickup
              </button>
            )}
            {deliveryStatus === "in_transit" && (
              <button
                onClick={() => handleStatusUpdate("delivered")}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm Delivery
              </button>
            )}
            {deliveryStatus === "delivered" && (
              <div className="flex-1 rounded-lg bg-green-500/10 p-3 text-center">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Delivery Completed Successfully
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pickup Details */}
          <div className="rounded-lg border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                <MapPin className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="font-semibold">Pickup Location</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{currentDelivery.pickup.location}</p>
                <p className="text-sm text-muted-foreground">{currentDelivery.pickup.address}</p>
                <p className="text-sm text-muted-foreground">{currentDelivery.pickup.district}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{currentDelivery.pickup.contactName}</p>
                <a
                  href={`tel:${currentDelivery.pickup.contact}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {currentDelivery.pickup.contact}
                </a>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Pickup Time</p>
                <p className="font-medium">
                  {new Date(currentDelivery.pickupTime).toLocaleString()}
                </p>
              </div>

              <button className="flex h-9 w-full items-center justify-center gap-2 rounded-md border bg-background text-sm font-medium hover:bg-accent">
                <Navigation className="h-4 w-4" />
                Navigate to Pickup
              </button>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="rounded-lg border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                <MapPin className="h-4 w-4 text-green-500" />
              </div>
              <h3 className="font-semibold">Delivery Location</h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{currentDelivery.delivery.location}</p>
                <p className="text-sm text-muted-foreground">{currentDelivery.delivery.address}</p>
                <p className="text-sm text-muted-foreground">{currentDelivery.delivery.district}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{currentDelivery.delivery.contactName}</p>
                <a
                  href={`tel:${currentDelivery.delivery.contact}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {currentDelivery.delivery.contact}
                </a>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estimated Arrival</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(currentDelivery.estimatedArrival).toLocaleString()}
                  </p>
                </div>
              </div>

              <button className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Navigation className="h-4 w-4" />
                Navigate to Delivery
              </button>
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            <h3 className="font-semibold">Cargo Details</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Cargo Type</p>
              <p className="font-medium">{currentDelivery.cargo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-medium">{currentDelivery.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distance</p>
              <p className="font-medium">{currentDelivery.distance} km</p>
            </div>
          </div>

          {currentDelivery.specialInstructions && (
            <div className="mt-4 rounded-lg bg-yellow-500/10 p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Special Instructions
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {currentDelivery.specialInstructions}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <h3 className="mb-3 font-semibold">Payment Information</h3>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="text-2xl font-bold text-primary">
              RWF {currentDelivery.payment.toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Payment will be processed after successful delivery confirmation
          </p>
        </div>

        {/* Emergency Button */}
        <div className="mt-6">
          <button
            onClick={handleEmergency}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md border-2 border-red-500 bg-red-500/10 text-sm font-medium text-red-600 hover:bg-red-500/20 dark:text-red-400"
          >
            <AlertCircle className="h-5 w-5" />
            Report Emergency or Issue
          </button>
        </div>
      </PageBody>
    </>
  );
}
