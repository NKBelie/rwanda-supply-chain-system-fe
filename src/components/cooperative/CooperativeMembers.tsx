"use client";

import { useState } from "react";
import { Search, Plus, Users, Filter, Download, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";

interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  farmSize: number;
  farmLocation: string;
  district: string;
  sector: string;
  crops: string[];
  joinDate: string;
  status: "active" | "inactive" | "suspended";
  contribution: number;
  shares: number;
  role?: string;
}

const mockMembers: Member[] = [
  {
    id: "M-001",
    name: "Jean Baptiste Mugisha",
    phone: "+250 788 123 456",
    email: "jb.mugisha@example.com",
    farmSize: 2.5,
    farmLocation: "Musanze",
    district: "Musanze",
    sector: "Kinigi",
    crops: ["Maize", "Beans", "Potatoes"],
    joinDate: "2022-01-15",
    status: "active",
    contribution: 50000,
    shares: 5,
    role: "Committee Member",
  },
  {
    id: "M-002",
    name: "Marie Claire Uwera",
    phone: "+250 788 234 567",
    email: "mc.uwera@example.com",
    farmSize: 1.8,
    farmLocation: "Musanze",
    district: "Musanze",
    sector: "Muhoza",
    crops: ["Coffee", "Bananas"],
    joinDate: "2021-06-20",
    status: "active",
    contribution: 75000,
    shares: 8,
    role: "Chairperson",
  },
  {
    id: "M-003",
    name: "Patrick Niyonzima",
    phone: "+250 788 345 678",
    farmSize: 3.2,
    farmLocation: "Musanze",
    district: "Musanze",
    sector: "Kinigi",
    crops: ["Maize", "Wheat", "Vegetables"],
    joinDate: "2023-03-10",
    status: "active",
    contribution: 40000,
    shares: 4,
  },
  {
    id: "M-004",
    name: "Grace Mukamana",
    phone: "+250 788 456 789",
    farmSize: 1.5,
    farmLocation: "Musanze",
    district: "Musanze",
    sector: "Muhoza",
    crops: ["Vegetables", "Herbs"],
    joinDate: "2023-08-05",
    status: "active",
    contribution: 30000,
    shares: 3,
  },
  {
    id: "M-005",
    name: "Emmanuel Habimana",
    phone: "+250 788 567 890",
    farmSize: 2.0,
    farmLocation: "Musanze",
    district: "Musanze",
    sector: "Gataraga",
    crops: ["Beans", "Sorghum"],
    joinDate: "2020-11-12",
    status: "inactive",
    contribution: 60000,
    shares: 6,
  },
];

export default function CooperativeMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = ["all", "active", "inactive", "suspended"];

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery) ||
      member.farmLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || member.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalMembers: mockMembers.length,
    activeMembers: mockMembers.filter((m) => m.status === "active").length,
    totalShares: mockMembers.reduce((sum, m) => sum + m.shares, 0),
    totalContributions: mockMembers.reduce((sum, m) => sum + m.contribution, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cooperative Members</h1>
          <p className="text-muted-foreground">Manage member information and activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Members</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeMembers}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Shares</p>
              <p className="text-2xl font-bold">{stats.totalShares}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Contributions</p>
              <p className="text-2xl font-bold">{stats.totalContributions.toLocaleString()} RWF</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members by name, ID, phone, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
            >
              {status === "all" ? "All Members" : status}
            </Button>
          ))}
        </div>
      </Card>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No members found"
          description="Try adjusting your search or filters"
        />
      ) : (
        <div className="grid gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{member.name}</h3>
                    <StatusBadge status={member.status} />
                    <Badge>{member.id}</Badge>
                    {member.role && (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        {member.role}
                      </Badge>
                    )}
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {member.phone}
                    </div>
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {member.district}, {member.sector}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-4">
                    <div>
                      <span className="font-medium">Farm Size:</span> {member.farmSize} hectares
                    </div>
                    <div>
                      <span className="font-medium">Crops:</span> {member.crops.join(", ")}
                    </div>
                    <div>
                      <span className="font-medium">Shares:</span> {member.shares}
                    </div>
                    <div>
                      <span className="font-medium">Contribution:</span> {member.contribution.toLocaleString()} RWF
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Member since:</span> {member.joinDate}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
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
