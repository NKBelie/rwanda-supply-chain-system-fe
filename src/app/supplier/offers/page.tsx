"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge } from "@/components/common";
import { Package, Calendar, DollarSign, Plus } from "lucide-react";

export default function SupplierOffersPage() {
  const offers = [
    {
      id: "OFFER-001",
      productName: "Organic Fertilizer - Premium Grade",
      quantity: 1000,
      unit: "kg",
      pricePerUnit: 1000,
      totalValue: 1000000,
      validUntil: "2026-08-15",
      status: "active",
      views: 45,
      interested: 12
    },
    {
      id: "OFFER-002",
      productName: "Agricultural Tools Bundle",
      quantity: 50,
      unit: "sets",
      pricePerUnit: 85000,
      totalValue: 4250000,
      validUntil: "2026-08-10",
      status: "active",
      views: 28,
      interested: 8
    },
    {
      id: "OFFER-003",
      productName: "Irrigation Equipment",
      quantity: 20,
      unit: "units",
      pricePerUnit: 250000,
      totalValue: 5000000,
      validUntil: "2026-07-30",
      status: "expired",
      views: 67,
      interested: 15
    }
  ];

  const activeOffers = offers.filter(o => o.status === "active").length;
  const totalValue = offers.filter(o => o.status === "active").reduce((sum, o) => sum + o.totalValue, 0);
  const totalInterested = offers.reduce((sum, o) => sum + o.interested, 0);

  const handleCreateOffer = () => {
    alert("Create new offer form would open here");
  };

  return (
    <>
      <PageHeader
        title="Special Offers"
        description="Manage promotional offers and deals"
        action={{
          label: "Create Offer",
          onClick: handleCreateOffer,
          icon: Plus
        }}
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Active Offers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeOffers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Value</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalValue / 1000000).toFixed(1)}M RWF
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4 text-blue-500" />
              <span>Interested Buyers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalInterested}</p>
          </div>
        </div>

        {/* Offers List */}
        <div className="space-y-4">
          {offers.map((offer) => {
            const daysRemaining = Math.ceil(
              (new Date(offer.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={offer.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{offer.productName}</h3>
                      <StatusBadge status={offer.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{offer.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      RWF {offer.totalValue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      RWF {offer.pricePerUnit.toLocaleString()} per {offer.unit}
                    </p>
                  </div>
                </div>

                <div className="mb-3 grid gap-3 md:grid-cols-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{offer.quantity} {offer.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{offer.views}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interested</p>
                    <p className="font-semibold text-blue-500">{offer.interested}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid Until</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <p className="font-semibold">
                        {new Date(offer.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {offer.status === "active" && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      {daysRemaining > 0 ? `${daysRemaining} days remaining` : "Expiring today"}
                    </span>
                    <div className="flex gap-2">
                      <button className="h-9 rounded-md border px-4 text-sm font-medium hover:bg-accent">
                        Edit
                      </button>
                      <button className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                        View Interested
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
