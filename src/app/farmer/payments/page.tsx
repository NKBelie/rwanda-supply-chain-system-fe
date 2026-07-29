"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { 
  Search, 
  DollarSign, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle,
  CreditCard,
  Wallet
} from "lucide-react";
import { orderService } from "@/services/data.service";

interface Payment {
  id: string;
  orderId: string;
  buyerName: string;
  amount: number;
  paymentMethod: string;
  status: "paid" | "pending" | "failed";
  date: string;
  transactionId: string;
  receiptUrl?: string;
}

export default function FarmerPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  // Generate payment records from orders
  const allPayments = useMemo<Payment[]>(() => {
    const orders = orderService.getAll();
    
    return orders.map(order => {
      // Generate mock buyer name from ID
      const buyerNumber = order.buyerId.split('-').pop() || '001';
      
      return {
        id: `PAY-${order.id.slice(0, 8)}`,
        orderId: order.id,
        buyerName: `Buyer ${buyerNumber}`,
        amount: order.totalPrice || 0,
        paymentMethod: ["Mobile Money", "Bank Transfer", "Cash", "Credit Card"][
          Math.floor(Math.random() * 4)
        ],
        status: order.status === "Completed" 
          ? "paid" 
          : order.status === "Request" 
          ? "pending" 
          : Math.random() > 0.9 
          ? "failed" 
          : "pending",
        date: order.createdAt,
        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        receiptUrl: order.status === "Completed" ? "#" : undefined
      };
    });
  }, []);

  const filteredPayments = useMemo(() => {
    return allPayments.filter(payment => {
      const matchesSearch = searchQuery === "" ||
        payment.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "" || payment.status === statusFilter;
      const matchesMethod = methodFilter === "" || payment.paymentMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [allPayments, searchQuery, statusFilter, methodFilter]);

  // Calculate stats
  const totalPayments = filteredPayments.length;
  const paidAmount = filteredPayments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const paidCount = filteredPayments.filter(p => p.status === "paid").length;

  const paymentMethods = Array.from(new Set(allPayments.map(p => p.paymentMethod)));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMethodIcon = (method: string) => {
    if (method.includes("Mobile") || method.includes("Wallet")) {
      return <Wallet className="h-3.5 w-3.5" />;
    }
    return <CreditCard className="h-3.5 w-3.5" />;
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // In real app, download actual receipt
    alert(`Downloading receipt for payment ${payment.id}`);
  };

  return (
    <>
      <PageHeader
        title="Payments"
        description="Track payment transactions and receipts"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
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
            <div className="mt-2">
              <p className="text-2xl font-bold">RWF {paidAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{paidCount} transactions</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>Pending</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">RWF {pendingAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {filteredPayments.filter(p => p.status === "pending").length} transactions
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>Failed</span>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {filteredPayments.filter(p => p.status === "failed").length}
              </p>
              <p className="text-xs text-muted-foreground">transactions</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by buyer, order ID, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Methods</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
              setMethodFilter("");
            }}
            className="h-10 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
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
                    <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Buyer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Method</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-mono">
                        {payment.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {payment.orderId.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {payment.buyerName}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm">
                          {getMethodIcon(payment.paymentMethod)}
                          <span>{payment.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        RWF {payment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-4 py-3">
                        {payment.status === "paid" && payment.receiptUrl ? (
                          <button
                            onClick={() => handleDownloadReceipt(payment)}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Receipt
                          </button>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
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
            description="No payments match your current filters. Try adjusting your search criteria."
            icon={<DollarSign className="h-10 w-10" />}
          />
        )}

        {/* Transaction ID Note */}
        {filteredPayments.length > 0 && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Keep transaction IDs for your records. You can use them to track payments with your payment provider.
            </p>
          </div>
        )}
      </PageBody>
    </>
  );
}
