"use client";

import { useState } from "react";
import { Search, Plus, Users, Filter, Shield, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, EmptyState } from "@/components/common";
import type { Role } from "@/lib/auth/roles";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: "active" | "inactive" | "suspended";
  joinedDate: string;
  lastLogin: string;
  location: string;
  verified: boolean;
}

const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "Jean Baptiste Mugisha",
    email: "jb.mugisha@example.com",
    phone: "+250 788 123 456",
    role: "farmer",
    status: "active",
    joinedDate: "2023-01-15",
    lastLogin: "2024-01-16 10:30",
    location: "Musanze",
    verified: true,
  },
  {
    id: "USR-002",
    name: "Marie Claire Uwera",
    email: "mc.uwera@example.com",
    phone: "+250 788 234 567",
    role: "buyer",
    status: "active",
    joinedDate: "2023-03-20",
    lastLogin: "2024-01-16 09:15",
    location: "Kigali",
    verified: true,
  },
  {
    id: "USR-003",
    name: "Patrick Niyonzima",
    email: "p.niyonzima@example.com",
    phone: "+250 788 345 678",
    role: "driver",
    status: "active",
    joinedDate: "2023-05-10",
    lastLogin: "2024-01-15 18:45",
    location: "Kigali",
    verified: true,
  },
  {
    id: "USR-004",
    name: "Grace Mukamana",
    email: "g.mukamana@example.com",
    phone: "+250 788 456 789",
    role: "cooperative",
    status: "inactive",
    joinedDate: "2022-11-05",
    lastLogin: "2024-01-10 14:20",
    location: "Huye",
    verified: false,
  },
  {
    id: "USR-005",
    name: "Emmanuel Habimana",
    email: "e.habimana@example.com",
    phone: "+250 788 567 890",
    role: "supplier",
    status: "suspended",
    joinedDate: "2023-07-12",
    lastLogin: "2024-01-05 11:00",
    location: "Rubavu",
    verified: true,
  },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const roles = ["all", "farmer", "buyer", "driver", "transport", "warehouse", "supplier", "manufacturer", "cooperative", "retailer", "bank", "government", "admin"];
  const statuses = ["all", "active", "inactive", "suspended"];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter((u) => u.status === "active").length,
    verifiedUsers: mockUsers.filter((u) => u.verified).length,
    suspendedUsers: mockUsers.filter((u) => u.status === "suspended").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage platform users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="mt-2 text-3xl font-bold">{stats.totalUsers}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.activeUsers}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Pending Approvals</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">{stats.verifiedUsers}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{stats.suspendedUsers}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-2 text-sm font-medium">Role</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                >
                  {role === "all" ? "All Roles" : role}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Status</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status === "all" ? "All Status" : status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <EmptyState icon={<Users className="h-10 w-10" />} title="No users found" description="Try adjusting your search or filters" />
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{user.name}</h3>
                    <StatusBadge status={user.status} />
                    <Badge>{user.role}</Badge>
                    {user.verified && (
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {user.phone}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {user.location}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <div>
                      <span className="font-medium">User ID:</span> {user.id}
                    </div>
                    <div>
                      <span className="font-medium">Joined:</span> {user.joinedDate}
                    </div>
                    <div>
                      <span className="font-medium">Last Login:</span> {user.lastLogin}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  {user.status !== "suspended" && (
                    <Button variant="danger" size="sm">
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
