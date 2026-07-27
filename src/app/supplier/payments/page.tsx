"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge } from "@/components/common";
import { DollarSign, Download, CheckCircle, Clock, Calendar } from "lucide-react";

export default function SupplierPaymentsPage() {
  const payments = [
    {
      id: "PAY-001",
      orderId: "ORD-12345",
      customerName: "Green Valley Farm",
      amount: 2500000,
      method: "Bank Transfer",
      status: "paid",
      dueDate: "2026-07-25",
      paidDate: "2026-07-24",
      transactionId: "TXN-ABC123"
    },
    {
      id: "PAY-002",
      orderId: "ORD-12346",
      customerName: "Highland Cooperative",
      amount: 4250000,
      method: "Mobile Money",
      status: "paid",
      dueDate: "2026-07-26",
      paidDate: "2026-07-26",
      transactionId: "TXN-DEF456"
    },
    {
      id: "PAY-003",
      orderId: "ORD-12347",
      customerName: "Sunrise Processing",
      amount: 3200000,
      method: "Bank Transfer",
      status: "pending",
      dueDate: "2026-07-30",
      paidDate: null,
      transactionId: null
    }
  ];

  const totalPayments = payments.length;
  const paidAmount = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  const handleExport = () => {
    alert("Export payments report");
  };

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track customer payments"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Payments</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalPayments}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Paid</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(paidAmount / 1000000).toFixed(1)}M RWF
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>Pending</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(pendingAmount / 1000000).toFixed(1)}M RWF
            </p>
          </div>
        </div>

        {/* Export Button */}
        <div className="mb-6">
          <button
            onClick={handleExport}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>

        {/* Payments Table */}
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Payment ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-mono">{payment.id}</td>
                    <td className="px-4 py-3 text-sm font-mono">{payment.orderId}</td>
                    <td className="px-4 py-3 text-sm font-medium">{payment.customerName}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      RWF {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{payment.method}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageBody>
    </>
  );
}
