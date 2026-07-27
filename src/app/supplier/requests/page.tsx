"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge } from "@/components/common";
import { ShoppingBag, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function SupplierRequestsPage() {
  const requests = [
    {
      id: "REQ-001",
      requesterName: "Green Valley Farm",
      productName: "Organic Fertilizer",
      quantity: 500,
      unit: "kg",
      requestedPrice: 1200,
      message: "Need for upcoming planting season",
      requestDate: "2026-07-25",
      status: "pending"
    },
    {
      id: "REQ-002",
      requesterName: "Highland Tea Cooperative",
      productName: "Agricultural Equipment",
      quantity: 3,
      unit: "units",
      requestedPrice: 5000000,
      message: "Bulk order for cooperative members",
      requestDate: "2026-07-24",
      status: "pending"
    }
  ];

  const handleAccept = (id: string) => {
    alert(`Accepting request ${id}`);
  };

  const handleReject = (id: string) => {
    alert(`Rejecting request ${id}`);
  };

  return (
    <>
      <PageHeader
        title="Product Requests"
        description="Manage incoming product requests"
      />
      <PageBody>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>Total Requests</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{requests.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Pending</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {requests.filter(r => r.status === "pending").length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>This Week</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{requests.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-lg border bg-card p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{request.id}</h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{request.requesterName}</p>
                </div>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="mb-3 grid gap-3 md:grid-cols-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Product</p>
                  <p className="font-medium">{request.productName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantity</p>
                  <p className="font-medium">{request.quantity} {request.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Requested Price</p>
                  <p className="font-medium">RWF {request.requestedPrice.toLocaleString()}</p>
                </div>
              </div>

              {request.message && (
                <div className="mb-3 rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium mb-1">Message</p>
                  <p className="text-sm text-muted-foreground">{request.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Requested: {new Date(request.requestDate).toLocaleDateString()}
                </p>
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-accent"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
