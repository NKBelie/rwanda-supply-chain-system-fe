"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { FileText, Download, Calendar, TrendingUp } from "lucide-react";

export default function GovernmentReportsPage() {
  const [reportType, setReportType] = useState("all");

  const reports = [
    {
      id: "RPT-001",
      title: "Monthly Production Report",
      type: "Production",
      period: "June 2026",
      generatedDate: "2026-07-01",
      size: "2.4 MB"
    },
    {
      id: "RPT-002",
      title: "Compliance Audit Summary",
      type: "Compliance",
      period: "Q2 2026",
      generatedDate: "2026-07-05",
      size: "1.8 MB"
    },
    {
      id: "RPT-003",
      title: "Supply Chain Analytics",
      type: "Analytics",
      period: "June 2026",
      generatedDate: "2026-07-03",
      size: "3.1 MB"
    },
    {
      id: "RPT-004",
      title: "Export Performance Report",
      type: "Trade",
      period: "June 2026",
      generatedDate: "2026-07-02",
      size: "1.5 MB"
    }
  ];

  const reportTypes = ["All Reports", "Production", "Compliance", "Analytics", "Trade"];

  const handleGenerateReport = () => {
    alert("Generate new report dialog would open here");
  };

  const handleDownload = (reportId: string) => {
    alert(`Downloading report ${reportId}`);
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description="Generate and download sector reports"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Total Reports</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{reports.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>This Month</span>
            </div>
            <p className="mt-2 text-2xl font-bold">4</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>Total Downloads</span>
            </div>
            <p className="mt-2 text-2xl font-bold">1,247</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {reportTypes.map(type => (
              <option key={type} value={type.toLowerCase().replace(" ", "_")}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerateReport}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <FileText className="h-4 w-4" />
            Generate New Report
          </button>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between rounded-lg border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {report.period} • {report.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-sm text-muted-foreground">
                  <p>Generated</p>
                  <p>{new Date(report.generatedDate).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDownload(report.id)}
                  className="flex h-9 items-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-accent"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
