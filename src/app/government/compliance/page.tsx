"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge } from "@/components/common";
import { Shield, AlertTriangle, CheckCircle, FileText, Clock } from "lucide-react";

export default function GovernmentCompliancePage() {
  const [viewType, setViewType] = useState("overview");

  const complianceStats = {
    totalEntities: 1247,
    compliant: 1089,
    pending: 98,
    nonCompliant: 60,
    complianceRate: 87.3
  };

  const recentInspections = [
    {
      id: "INS-001",
      entity: "Highland Tea Processing",
      type: "Safety Inspection",
      date: "2026-07-25",
      status: "passed",
      score: 95
    },
    {
      id: "INS-002",
      entity: "Green Valley Farm",
      type: "Quality Audit",
      date: "2026-07-24",
      status: "passed",
      score: 88
    },
    {
      id: "INS-003",
      entity: "Central Storage Facility",
      type: "Health Inspection",
      date: "2026-07-23",
      status: "pending",
      score: null
    },
    {
      id: "INS-004",
      entity: "Valley Foods Processing",
      type: "Environmental Audit",
      date: "2026-07-22",
      status: "failed",
      score: 62
    }
  ];

  const complianceRequirements = [
    { category: "Food Safety", compliant: 92, total: 100 },
    { category: "Environmental", compliant: 85, total: 100 },
    { category: "Labor Standards", compliant: 95, total: 100 },
    { category: "Quality Control", compliant: 88, total: 100 }
  ];

  return (
    <>
      <PageHeader
        title="Compliance Monitoring"
        description="Monitor regulatory compliance across the sector"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Total Entities</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{complianceStats.totalEntities}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Compliant</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{complianceStats.compliant}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>Pending Review</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{complianceStats.pending}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Non-Compliant</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{complianceStats.nonCompliant}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Compliance Rate</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{complianceStats.complianceRate}%</p>
          </div>
        </div>

        {/* View Selector */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setViewType("overview")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              viewType === "overview"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewType("inspections")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              viewType === "inspections"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            Recent Inspections
          </button>
        </div>

        {viewType === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Compliance Requirements */}
            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-4 font-semibold">Compliance by Category</h3>
              <div className="space-y-4">
                {complianceRequirements.map((req) => {
                  const percentage = (req.compliant / req.total) * 100;

                  return (
                    <div key={req.category}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">{req.category}</span>
                        <span className="text-muted-foreground">
                          {req.compliant}/{req.total}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full transition-all ${
                            percentage >= 90
                              ? "bg-green-500"
                              : percentage >= 75
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compliance Alerts */}
            <div className="rounded-lg border bg-card p-5">
              <h3 className="mb-4 font-semibold">Compliance Alerts</h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Expired Certifications</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        12 entities have certifications expiring within 30 days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Pending Inspections</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        23 scheduled inspections this month
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Documentation Updates</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        8 entities pending document verification
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewType === "inspections" && (
          <div className="rounded-lg border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Entity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentInspections.map((inspection) => (
                    <tr key={inspection.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-mono">{inspection.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{inspection.entity}</td>
                      <td className="px-4 py-3 text-sm">{inspection.type}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(inspection.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        {inspection.score !== null ? `${inspection.score}/100` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inspection.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageBody>
    </>
  );
}
