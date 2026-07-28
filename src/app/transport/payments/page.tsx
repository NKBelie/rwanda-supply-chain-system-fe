"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, DollarSign, Download, CheckCircle, Clock, Calendar } from "lucide-react";

interface Payment {
  id: string;
  requestId: string;
  clientName: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "pending" | "overdue";
  dueDate: string;
  paidDate?: string;
  transactionId?: string;
}

export default function TransportPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allPayments = useMemo<Payment[]>(() => [
    {
      id: "PAY-001",
      requestId: "REQ-001",
      clientName: "Green Valley Farm",
      amount: 15000,
      paymentMethod: "Mobile Money",
      status: "paid",
      dueDate: "2026-07-26",
      paidDate: "2026-07-26",
      transactionId: "TXN-ABC123"
    },
    {
      id: "PAY-002",
      requestId: "REQ-002",
      clientName: "Highland Tea Estate",
      amount: 65000,
      paymentMethod: "Bank Transfer",
      status: "paid",
      dueDate: "2026-07-25",
      paidDate: "2026-07-25",
      transactionId: "TXN-DEF456"
    },
    {
      id: "PAY-003",
      requestId: "REQ-003",
      clientName: "Sunrise Coffee Cooperative",
      amount: 85000,
      paymentMethod: "Bank Transfer",
      status: "pending",
      dueDate: "2026-07-29"
    }
  ], []);

  const filteredPayments = useMemo(() => {
    return allPayments.filter(payment => {
      const matchesSearch = searchQuery === "" ||
        payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.requestId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || payment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allPayments, searchQuery, statusFilter]);

  const totalPayments = filteredPayments.length;
  const paidAmount = filteredPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  const handleExport = () => {
    alert("Export payments report");
  };

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track transport service payments"
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
            <p className="mt-2 text-2xl font-bold">RWF {paidAmount.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>Pending</span>
            </div>
            <p className="mt-2 text-2xl font-bold">RWF {pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            onClick={handleExport}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Payments Table */}
        {filteredPayments.length > 0 ? (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Payment ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Request ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-mono">{payment.id}</td>
                      <td className="px-4 py-3 text-sm font-mono">{payment.requestId}</td>
                      <td className="px-4 py-3 text-sm font-medium">{payment.clientName}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        RWF {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">{payment.paymentMethod}</td>
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
        ) : (
          <EmptyState
            title="No payments found"
            description="No payments match your search criteria."
            icon={DollarSign}
          />
        )}
      </PageBody>
    </>
  );
}
