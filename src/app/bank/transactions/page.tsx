"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, DollarSign, ArrowUpRight, ArrowDownLeft, Calendar, Download } from "lucide-react";

interface Transaction {
  id: string;
  customerName: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  category: string;
  date: string;
  status: "completed" | "pending" | "failed";
  balance: number;
}

export default function BankTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allTransactions = useMemo<Transaction[]>(() => [
    {
      id: "TXN-001",
      customerName: "Green Valley Agro Ltd",
      type: "credit",
      amount: 2500000,
      description: "Product sales payment",
      category: "Revenue",
      date: "2026-07-26",
      status: "completed",
      balance: 15000000
    },
    {
      id: "TXN-002",
      customerName: "Highland Tea Cooperative",
      type: "debit",
      amount: 750000,
      description: "Loan payment",
      category: "Loan Repayment",
      date: "2026-07-25",
      status: "completed",
      balance: 12000000
    },
    {
      id: "TXN-003",
      customerName: "Sunrise Coffee Processing",
      type: "credit",
      amount: 3200000,
      description: "Export proceeds",
      category: "Revenue",
      date: "2026-07-24",
      status: "pending",
      balance: 18500000
    }
  ], []);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(txn => {
      const matchesSearch = searchQuery === "" ||
        txn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "" || txn.type === typeFilter;
      const matchesStatus = statusFilter === "" || txn.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allTransactions, searchQuery, typeFilter, statusFilter]);

  const totalTransactions = allTransactions.length;
  const totalCredits = allTransactions.filter(t => t.type === "credit").reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = allTransactions.filter(t => t.type === "debit").reduce((sum, t) => sum + t.amount, 0);
  const netFlow = totalCredits - totalDebits;

  const handleExport = () => {
    alert("Export transactions report");
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Monitor customer transactions"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Transactions</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalTransactions}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowDownLeft className="h-4 w-4 text-green-500" />
              <span>Total Credits</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalCredits / 1000000).toFixed(1)}M RWF
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-red-500" />
              <span>Total Debits</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalDebits / 1000000).toFixed(1)}M RWF
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Net Flow</span>
            </div>
            <p className={`mt-2 text-2xl font-bold ${netFlow >= 0 ? "text-green-500" : "text-red-500"}`}>
              {netFlow >= 0 ? "+" : ""}{(netFlow / 1000000).toFixed(1)}M RWF
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={handleExport}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      txn.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {txn.type === "credit" ? (
                      <ArrowDownLeft className="h-6 w-6 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{txn.description}</p>
                      <StatusBadge status={txn.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{txn.customerName}</p>
                    <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{txn.id}</span>
                      <span>•</span>
                      <span>{txn.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(txn.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      txn.type === "credit" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {txn.type === "credit" ? "+" : "-"}RWF {txn.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Balance: RWF {txn.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No transactions found"
            description="No transactions match your search criteria."
            icon={DollarSign}
          />
        )}
      </PageBody>
    </>
  );
}
