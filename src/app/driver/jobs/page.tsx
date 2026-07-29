"use client";

import React, { useState, useMemo } from "react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { 
  Search, 
  Truck, 
  MapPin, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface Job {
  id: string;
  orderId: string;
  pickup: {
    location: string;
    district: string;
    address: string;
  };
  delivery: {
    location: string;
    district: string;
    address: string;
  };
  distance: number;
  estimatedDuration: string;
  payment: number;
  scheduledDate: string;
  cargo: string;
  weight: number;
  status: "available" | "accepted" | "declined";
  priority: "normal" | "urgent";
}

export default function DriverJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  // Mock job data
  const allJobs = useMemo<Job[]>(() => [
    {
      id: "JOB-001",
      orderId: "ORD-12345",
      pickup: {
        location: "Green Valley Farm",
        district: "Kigali",
        address: "KN 4 Ave, Kicukiro"
      },
      delivery: {
        location: "City Market Hub",
        district: "Kigali",
        address: "KG 11 Ave, Nyarugenge"
      },
      distance: 12.5,
      estimatedDuration: "45 min",
      payment: 15000,
      scheduledDate: "2026-07-28",
      cargo: "Fresh Vegetables (Tomatoes, Potatoes)",
      weight: 250,
      status: "available",
      priority: "normal"
    },
    {
      id: "JOB-002",
      orderId: "ORD-12346",
      pickup: {
        location: "Sunrise Coffee Cooperative",
        district: "Huye",
        address: "Butare Town Center"
      },
      delivery: {
        location: "Export Processing Facility",
        district: "Kigali",
        address: "KG 7 Ave, Gasabo"
      },
      distance: 135,
      estimatedDuration: "2h 30min",
      payment: 85000,
      scheduledDate: "2026-07-29",
      cargo: "Coffee Beans (Arabica)",
      weight: 500,
      status: "available",
      priority: "urgent"
    },
    {
      id: "JOB-003",
      orderId: "ORD-12347",
      pickup: {
        location: "Highland Tea Estate",
        district: "Musanze",
        address: "RN4 Highway, Musanze"
      },
      delivery: {
        location: "Tea Processing Plant",
        district: "Kigali",
        address: "KK 15 Ave, Kicukiro"
      },
      distance: 95,
      estimatedDuration: "2h",
      payment: 65000,
      scheduledDate: "2026-07-28",
      cargo: "Tea Leaves",
      weight: 300,
      status: "accepted",
      priority: "normal"
    },
    {
      id: "JOB-004",
      orderId: "ORD-12348",
      pickup: {
        location: "Valley Grain Storage",
        district: "Kigali",
        address: "KN 8 Ave, Kicukiro"
      },
      delivery: {
        location: "Nyabugogo Wholesale Market",
        district: "Kigali",
        address: "Nyabugogo, Gasabo"
      },
      distance: 8,
      estimatedDuration: "30 min",
      payment: 10000,
      scheduledDate: "2026-07-27",
      cargo: "Maize and Rice",
      weight: 400,
      status: "available",
      priority: "normal"
    }
  ], []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchesSearch = searchQuery === "" ||
        job.pickup.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.delivery.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "" || job.status === statusFilter;
      const matchesDistrict = districtFilter === "" || 
        job.pickup.district === districtFilter || 
        job.delivery.district === districtFilter;

      return matchesSearch && matchesStatus && matchesDistrict;
    });
  }, [allJobs, searchQuery, statusFilter, districtFilter]);

  const availableJobs = allJobs.filter(j => j.status === "available").length;
  const acceptedJobs = allJobs.filter(j => j.status === "accepted").length;
  const totalEarnings = allJobs
    .filter(j => j.status === "accepted")
    .reduce((sum, j) => sum + j.payment, 0);

  const districts = Array.from(
    new Set([...allJobs.map(j => j.pickup.district), ...allJobs.map(j => j.delivery.district)])
  ).sort();

  const handleAcceptJob = (jobId: string) => {
    alert(`Accepting job ${jobId}. In real app, this would update the job status.`);
  };

  const handleDeclineJob = (jobId: string) => {
    alert(`Declining job ${jobId}. In real app, this would update the job status.`);
  };

  return (
    <>
      <PageHeader
        title="Available Jobs"
        description="Browse and accept delivery jobs"
      />
      <PageBody>
        {/* Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Available Jobs</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{availableJobs}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Accepted Jobs</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{acceptedJobs}</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Potential Earnings</span>
            </div>
            <p className="mt-2 text-2xl font-bold">RWF {totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs by location or cargo..."
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
            <option value="available">Available</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("");
              setDistrictFilter("");
            }}
            className="h-10 rounded-md border border-input bg-background px-4 text-sm font-medium hover:bg-accent"
          >
            Clear Filters
          </button>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className={`rounded-lg border bg-card p-5 transition-all hover:shadow-md ${
                  job.priority === "urgent" ? "border-orange-500 border-l-4" : ""
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{job.id}</h3>
                      <StatusBadge status={job.status} />
                      {job.priority === "urgent" && (
                        <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Order: {job.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      RWF {job.payment.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{job.distance} km</p>
                  </div>
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  {/* Pickup */}
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <span>Pickup</span>
                    </div>
                    <p className="font-medium">{job.pickup.location}</p>
                    <p className="text-sm text-muted-foreground">{job.pickup.address}</p>
                    <p className="text-sm text-muted-foreground">{job.pickup.district}</p>
                  </div>

                  {/* Delivery */}
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                        <MapPin className="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <span>Delivery</span>
                    </div>
                    <p className="font-medium">{job.delivery.location}</p>
                    <p className="text-sm text-muted-foreground">{job.delivery.address}</p>
                    <p className="text-sm text-muted-foreground">{job.delivery.district}</p>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Est. {job.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>{job.weight} kg</span>
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-secondary/50 p-3">
                  <p className="text-sm font-medium">Cargo Details</p>
                  <p className="text-sm text-muted-foreground">{job.cargo}</p>
                </div>

                {job.status === "available" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAcceptJob(job.id)}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept Job
                    </button>
                    <button
                      onClick={() => handleDeclineJob(job.id)}
                      className="flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-6 text-sm font-medium hover:bg-accent"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </button>
                  </div>
                )}

                {job.status === "accepted" && (
                  <div className="rounded-lg bg-green-500/10 p-3 text-center">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      ✓ Job Accepted - Check Delivery page for details
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No jobs found"
            description="No jobs match your current filters. Try adjusting your search criteria."
            icon={<Truck className="h-10 w-10" />}
          />
        )}
      </PageBody>
    </>
  );
}
