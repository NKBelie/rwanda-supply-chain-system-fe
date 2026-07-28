"use client";

import { useState } from "react";
import { Truck, Plus, Search, Filter, MapPin, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";

interface Transport {
  id: string;
  type: "inbound" | "outbound" | "transfer";
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  cargo: string;
  quantity: string;
  scheduledDate: string;
  scheduledTime: string;
  actualDate?: string;
  actualTime?: string;
  status: "scheduled" | "in-transit" | "arrived" | "unloading" | "completed" | "delayed";
  loadingBay?: string;
}

const mockTransports: Transport[] = [
  {
    id: "1",
    type: "inbound",
    vehicleNumber: "RAD 123 C",
    driverName: "Jean Baptiste",
    driverPhone: "+250 788 123 456",
    origin: "Musanze Cooperative",
    destination: "Warehouse A",
    cargo: "Maize Seeds",
    quantity: "5,000 kg",
    scheduledDate: "2024-01-16",
    scheduledTime: "08:00",
    status: "scheduled",
    loadingBay: "Bay A",
  },
  {
    id: "2",
    type: "outbound",
    vehicleNumber: "RAE 456 D",
    driverName: "Marie Claire",
    driverPhone: "+250 788 234 567",
    origin: "Warehouse B",
    destination: "Kigali Retailers",
    cargo: "NPK Fertilizer",
    quantity: "200 bags",
    scheduledDate: "2024-01-16",
    scheduledTime: "10:00",
    actualDate: "2024-01-16",
    actualTime: "10:15",
    status: "in-transit",
    loadingBay: "Bay B",
  },
  {
    id: "3",
    type: "inbound",
    vehicleNumber: "RAB 789 A",
    driverName: "Patrick Mugisha",
    driverPhone: "+250 788 345 678",
    origin: "Huye District",
    destination: "Warehouse C",
    cargo: "Coffee Beans",
    quantity: "3,000 kg",
    scheduledDate: "2024-01-16",
    scheduledTime: "12:00",
    actualDate: "2024-01-16",
    actualTime: "12:10",
    status: "arrived",
    loadingBay: "Bay C",
  },
  {
    id: "4",
    type: "transfer",
    vehicleNumber: "RAC 321 B",
    driverName: "Emmanuel Niyonzima",
    driverPhone: "+250 788 456 789",
    origin: "Warehouse A",
    destination: "Warehouse B",
    cargo: "Pesticides",
    quantity: "100 liters",
    scheduledDate: "2024-01-16",
    scheduledTime: "14:00",
    status: "scheduled",
    loadingBay: "Bay D",
  },
  {
    id: "5",
    type: "outbound",
    vehicleNumber: "RAD 654 C",
    driverName: "Grace Uwera",
    driverPhone: "+250 788 567 890",
    origin: "Warehouse B",
    destination: "Rubavu District",
    cargo: "Equipment",
    quantity: "50 units",
    scheduledDate: "2024-01-15",
    scheduledTime: "15:00",
    actualDate: "2024-01-15",
    actualTime: "15:30",
    status: "delayed",
    loadingBay: "Bay A",
  },
];

export default function WarehouseTransport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = ["all", "inbound", "outbound", "transfer"];

  const filteredTransports = mockTransports.filter((transport) => {
    const matchesSearch =
      transport.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transport.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transport.cargo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || transport.type === selectedType;
    return matchesSearch && matchesType;
  });

  const stats = {
    scheduled: mockTransports.filter((t) => t.status === "scheduled").length,
    inTransit: mockTransports.filter((t) => t.status === "in-transit").length,
    arrived: mockTransports.filter((t) => t.status === "arrived").length,
    completed: mockTransports.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transport Management</h1>
          <p className="text-muted-foreground">Track incoming and outgoing shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Transport
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold">{stats.scheduled}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Transit</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inTransit}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Arrived</p>
              <p className="text-2xl font-bold text-green-600">{stats.arrived}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
            </div>
            <Package className="h-8 w-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by vehicle, driver, or cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type === "all" ? "All Types" : type}
            </Button>
          ))}
        </div>
      </Card>

      {/* Transport List */}
      {filteredTransports.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No transport records found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid gap-4">
          {filteredTransports.map((transport) => (
            <Card key={transport.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        transport.type === "inbound"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : transport.type === "outbound"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      }
                    >
                      {transport.type}
                    </Badge>
                    <h3 className="font-semibold">{transport.vehicleNumber}</h3>
                    <StatusBadge status={transport.status} />
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <div>
                      <span className="font-medium">Driver:</span> {transport.driverName} (
                      {transport.driverPhone})
                    </div>
                    <div>
                      <span className="font-medium">Cargo:</span> {transport.cargo} ({transport.quantity})
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <div>
                      <span className="font-medium">Origin:</span> {transport.origin}
                    </div>
                    <div>
                      <span className="font-medium">Destination:</span> {transport.destination}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="font-medium">Scheduled:</span> {transport.scheduledDate}{" "}
                      {transport.scheduledTime}
                    </div>
                    {transport.actualDate && (
                      <div>
                        <span className="font-medium">Actual:</span> {transport.actualDate}{" "}
                        {transport.actualTime}
                      </div>
                    )}
                    {transport.loadingBay && (
                      <div>
                        <span className="font-medium">Loading Bay:</span> {transport.loadingBay}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Track
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
