"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { Search, DollarSign, Calendar, TrendingUp, Plus } from "lucide-react";

interface Loan {
  id: string;
  customerName: string;
  loanType: string;
  amount: number;
  disbursedAmount: number;
  outstandingBalance: number;
  interestRate: number;
  term: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "completed" | "defaulted";
  nextPaymentDate: string;
  nextPaymentAmount: number;
}

export default function BankLoansPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const allLoans = useMemo<Loan[]>(() => [
    {
      id: "LOAN-001",
      customerName: "Green Valley Agro Ltd",
      loanType: "Agricultural Expansion",
      amount: 10000000,
      disbursedAmount: 10000000,
      outstandingBalance: 5000000,
      interestRate: 12,
      term: 24,
      startDate: "2024-01-15",
      endDate: "2026-01-15",
      status: "active",
      nextPaymentDate: "2026-08-15",
      nextPaymentAmount: 500000
    },
    {
      id: "LOAN-002",
      customerName: "Highland Tea Cooperative",
      loanType: "Equipment Purchase",
      amount: 25000000,
      disbursedAmount: 25000000,
      outstandingBalance: 12000000,
      interestRate: 10,
      term: 36,
      startDate: "2023-06-01",
      endDate: "2026-06-01",
      status: "active",
      nextPaymentDate: "2026-08-01",
      nextPaymentAmount: 750000
    },
    {
      id: "LOAN-003",
      customerName: "Sunrise Coffee Processing",
      loanType: "Working Capital",
      amount: 15000000,
      disbursedAmount: 0,
      outstandingBalance: 15000000,
      interestRate: 15,
      term: 12,
      startDate: "2026-08-01",
      endDate: "2027-08-01",
      status: "pending",
      nextPaymentDate: "2026-09-01",
      nextPaymentAmount: 1350000
    }
  ], []);

  const filteredLoans = useMemo(() => {
    return allLoans.filter(loan => {
      const matchesSearch = searchQuery === "" ||
        loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "" || loan.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allLoans, searchQuery, statusFilter]);

  const totalLoans = allLoans.length;
  const activeLoans = allLoans.filter(l => l.status === "active").length;
  const totalDisbursed = allLoans.reduce((sum, l) => sum + l.disbursedAmount, 0);
  const totalOutstanding = allLoans.reduce((sum, l) => sum + l.outstandingBalance, 0);

  const handleNewLoan = () => {
    alert("New loan application form would open here");
  };

  return (
    <>
      <PageHeader
        title="Loans"
        description="Manage agricultural loans and financing"
        actions={
          <button
            onClick={handleNewLoan}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Loan
          </button>
        }
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Loans</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalLoans}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Active Loans</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeLoans}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span>Total Disbursed</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalDisbursed / 1000000).toFixed(0)}M RWF
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <span>Outstanding</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalOutstanding / 1000000).toFixed(0)}M RWF
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search loans..."
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>

        {/* Loans List */}
        {filteredLoans.length > 0 ? (
          <div className="space-y-4">
            {filteredLoans.map((loan) => {
              const repaymentProgress = ((loan.amount - loan.outstandingBalance) / loan.amount) * 100;

              return (
                <div
                  key={loan.id}
                  className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{loan.id}</h3>
                        <StatusBadge status={loan.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{loan.customerName}</p>
                      <p className="text-sm text-muted-foreground">{loan.loanType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        RWF {(loan.amount / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-muted-foreground">{loan.interestRate}% interest</p>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-3 md:grid-cols-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Disbursed</p>
                      <p className="font-semibold">
                        RWF {(loan.disbursedAmount / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Outstanding</p>
                      <p className="font-semibold">
                        RWF {(loan.outstandingBalance / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Term</p>
                      <p className="font-semibold">{loan.term} months</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Payment</p>
                      <p className="font-semibold">
                        RWF {(loan.nextPaymentAmount / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Repayment Progress</span>
                      <span className="font-medium">{repaymentProgress.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${repaymentProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(loan.startDate).toLocaleDateString()} - {new Date(loan.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {loan.status === "active" && (
                      <span>
                        Next payment: {new Date(loan.nextPaymentDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No loans found"
            description="No loans match your search criteria."
            icon={<DollarSign className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
