"use client";

import React, { useState } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { FileText, Download, Upload, Calendar, AlertCircle, CheckCircle } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  status: "valid" | "expiring" | "expired";
  uploadDate: string;
  expiryDate?: string;
  fileUrl?: string;
}

export default function DriverDocumentsPage() {
  const [documents] = useState<Document[]>([
    {
      id: "DOC-001",
      name: "Driver's License",
      type: "License",
      status: "valid",
      uploadDate: "2025-01-15",
      expiryDate: "2028-01-15",
      fileUrl: "#"
    },
    {
      id: "DOC-002",
      name: "Vehicle Registration",
      type: "Registration",
      status: "valid",
      uploadDate: "2025-03-20",
      expiryDate: "2027-03-20",
      fileUrl: "#"
    },
    {
      id: "DOC-003",
      name: "Insurance Certificate",
      type: "Insurance",
      status: "expiring",
      uploadDate: "2024-08-01",
      expiryDate: "2026-08-01",
      fileUrl: "#"
    },
    {
      id: "DOC-004",
      name: "Vehicle Inspection Report",
      type: "Inspection",
      status: "valid",
      uploadDate: "2026-06-10",
      expiryDate: "2027-06-10",
      fileUrl: "#"
    }
  ]);

  const validDocs = documents.filter(d => d.status === "valid").length;
  const expiringDocs = documents.filter(d => d.status === "expiring").length;
  const expiredDocs = documents.filter(d => d.status === "expired").length;

  const handleUpload = () => {
    alert("File upload dialog would open here");
  };

  const handleDownload = (doc: Document) => {
    alert(`Downloading ${doc.name}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "text-green-500";
      case "expiring":
        return "text-yellow-500";
      case "expired":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const days = Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <>
      <PageHeader
        title="Documents"
        description="Manage your driver and vehicle documents"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Valid Documents</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{validDocs}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span>Expiring Soon</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{expiringDocs}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>Expired</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{expiredDocs}</p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="mb-6">
          <button
            onClick={handleUpload}
            className="flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" />
            Upload New Document
          </button>
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc) => {
              const daysUntilExpiry = getDaysUntilExpiry(doc.expiryDate);

              return (
                <div
                  key={doc.id}
                  className="rounded-lg border bg-card p-5 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                          {doc.expiryDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={doc.status} />
                      {daysUntilExpiry !== null && daysUntilExpiry < 90 && daysUntilExpiry > 0 && (
                        <p className={`text-xs ${getStatusColor(doc.status)}`}>
                          {daysUntilExpiry} days remaining
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex h-9 items-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-accent"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                    {doc.status === "expiring" || doc.status === "expired" && (
                      <button
                        onClick={handleUpload}
                        className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload Updated
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No documents uploaded"
            description="Upload your driver and vehicle documents to get started."
            icon={FileText}
          />
        )}

        {/* Important Notice */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Important:</strong> Keep your documents up to date. Expired documents may prevent you from accepting delivery jobs.
          </p>
        </div>
      </PageBody>
    </>
  );
}
