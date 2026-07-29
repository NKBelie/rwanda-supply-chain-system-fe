"use client";

import { useState } from "react";
import { Calendar, Plus, Clock, MapPin, User, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";

interface Schedule {
  id: string;
  type: "receiving" | "dispatch" | "maintenance" | "inventory-check" | "transfer";
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  assignedTo: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  notes?: string;
}

const mockSchedules: Schedule[] = [
  {
    id: "1",
    type: "receiving",
    title: "Incoming Maize Shipment",
    date: "2024-01-16",
    time: "08:00",
    duration: "2 hours",
    location: "Loading Bay A",
    assignedTo: "John Doe",
    status: "scheduled",
    priority: "high",
    notes: "5 tons from Musanze Coop",
  },
  {
    id: "2",
    type: "dispatch",
    title: "Fertilizer Dispatch to Retailer",
    date: "2024-01-16",
    time: "10:00",
    duration: "1.5 hours",
    location: "Loading Bay B",
    assignedTo: "Jane Smith",
    status: "in-progress",
    priority: "medium",
    notes: "200 bags NPK fertilizer",
  },
  {
    id: "3",
    type: "inventory-check",
    title: "Monthly Inventory Audit",
    date: "2024-01-16",
    time: "14:00",
    duration: "4 hours",
    location: "Zone A",
    assignedTo: "Mike Johnson",
    status: "scheduled",
    priority: "high",
    notes: "Full stock count of Zone A",
  },
  {
    id: "4",
    type: "maintenance",
    title: "Forklift Maintenance",
    date: "2024-01-17",
    time: "09:00",
    duration: "3 hours",
    location: "Maintenance Area",
    assignedTo: "Tom Wilson",
    status: "scheduled",
    priority: "medium",
  },
  {
    id: "5",
    type: "transfer",
    title: "Inter-warehouse Transfer",
    date: "2024-01-17",
    time: "11:00",
    duration: "2 hours",
    location: "Warehouse C",
    assignedTo: "Sarah Brown",
    status: "scheduled",
    priority: "low",
    notes: "Transfer seeds to Warehouse B",
  },
];

const typeColors = {
  receiving: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  dispatch: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  maintenance: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  "inventory-check": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  transfer: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
};

export default function WarehouseSchedules() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = ["all", "receiving", "dispatch", "maintenance", "inventory-check", "transfer"];

  const filteredSchedules = mockSchedules.filter((schedule) => {
    const matchesType = selectedType === "all" || schedule.type === selectedType;
    return matchesType;
  });

  const groupedByDate = filteredSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.date]) {
      acc[schedule.date] = [];
    }
    acc[schedule.date].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedules</h1>
          <p className="text-muted-foreground">Manage warehouse operations schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Tasks</p>
              <p className="text-2xl font-bold">
                {mockSchedules.filter((s) => s.date === "2024-01-16").length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">
                {mockSchedules.filter((s) => s.status === "in-progress").length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold">
                {mockSchedules.filter((s) => s.status === "scheduled").length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl font-bold">
                {mockSchedules.filter((s) => s.priority === "high").length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900" />
          </div>
        </Card>
      </div>

      {/* Type Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type === "all" ? "All Types" : type.replace("-", " ")}
            </Button>
          ))}
        </div>
      </Card>

      {/* Schedules by Date */}
      {Object.keys(groupedByDate).length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-10 w-10" />}
          title="No schedules found"
          description="No scheduled activities for the selected criteria"
        />
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedByDate)
            .sort()
            .map((date) => (
              <div key={date}>
                <h2 className="mb-4 text-lg font-semibold">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <div className="grid gap-4">
                  {groupedByDate[date].map((schedule) => (
                    <Card key={schedule.id} className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge className={typeColors[schedule.type]}>{schedule.type}</Badge>
                            <h3 className="font-semibold">{schedule.title}</h3>
                            <StatusBadge status={schedule.status} />
                            {schedule.priority === "high" && (
                              <Badge className="bg-red-100 text-red-700">High Priority</Badge>
                            )}
                          </div>
                          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {schedule.time} ({schedule.duration})
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {schedule.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {schedule.assignedTo}
                            </div>
                          </div>
                          {schedule.notes && (
                            <p className="text-sm text-muted-foreground">{schedule.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
