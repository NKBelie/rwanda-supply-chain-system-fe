"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { EmptyState } from "@/components/common";
import { Search, Users, DollarSign, TrendingUp, Phone, Mail, MapPin } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  type: string;
  district: string;
  accountNumber: string;
  phone: string;
  email: string;
  loanBalance: number;
  totalTransactions: number;
  creditScore: number;
  joinedDate: string;
  status: "active" | "inactive";
}

export default function BankCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const allCustomers = useMemo<Customer[]>(() => [
    {
      id: "CUST-001",
      name: "Green Valley Agro Ltd",
      type: "Farm",
      district: "Kigali",
      accountNumber: "ACC-789456123",
      phone: "+250 788 123 456",
      email: "contact@greenvalley.rw",
      loanBalance: 5000000,
      totalTransactions: 156,
      creditScore: 750,
      joinedDate: "2023-03-15",
      status: "active"
    },
    {
      id: "CUST-002",
      name: "Highland Tea Cooperative",
      type: "Cooperative",
      district: "Musanze",
      accountNumber: "ACC-789456124",
      phone: "+250 788 234 567",
      email: "info@highlandtea.rw",
      loanBalance: 12000000,
      totalTransactions: 203,
      creditScore: 820,
      joinedDate: "2022-08-20",
      status: "active"
    },
    {
      id: "CUST-003",
      name: "Sunrise Coffee Processing",
      type: "Manufacturer",
      district: "Huye",
      accountNumber: "ACC-789456125",
      phone: "+250 788 345 678",
      email: "contact@sunrisecoffee.rw",
      loanBalance: 8500000,
      totalTransactions: 187,
      creditScore: 780,
      joinedDate: "2023-01-10",
      status: "active"
    }
  ], []);

  const filteredCustomers = useMemo(() => {
    return allCustomers.filter(customer => {
      const matchesSearch = searchQuery === "" ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.accountNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "" || customer.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allCustomers, searchQuery, typeFilter]);

  const customerTypes = Array.from(new Set(allCustomers.map(c => c.type)));
  const totalCustomers = allCustomers.length;
  const activeCustomers = allCustomers.filter(c => c.status === "active").length;
  const totalLoanBalance = allCustomers.reduce((sum, c) => sum + c.loanBalance, 0);
  const avgCreditScore = allCustomers.reduce((sum, c) => sum + c.creditScore, 0) / allCustomers.length;

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage banking customers and accounts"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Customers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalCustomers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-green-500" />
              <span>Active Accounts</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{activeCustomers}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Total Loan Balance</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(totalLoanBalance / 1000000).toFixed(1)}M RWF
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Avg Credit Score</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{avgCreditScore.toFixed(0)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search customers..."
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
            {customerTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Customers Grid */}
        {filteredCustomers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.accountNumber}</p>
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {customer.type}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      customer.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="mb-3 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{customer.district}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Loan Balance</p>
                    <p className="font-semibold">
                      {(customer.loanBalance / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Credit Score</p>
                    <p className="font-semibold">{customer.creditScore}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Customer since {new Date(customer.joinedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No customers found"
            description="No customers match your search criteria."
            icon={Users}
          />
        )}
      </PageBody>
    </>
  );
}
