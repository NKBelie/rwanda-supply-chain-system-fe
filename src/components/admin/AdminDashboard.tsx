"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, Shield, Activity, AlertTriangle, CheckCircle2,
  UserCheck, UserX, Clock, TrendingUp, Database,
  Settings, FileText, Bell, Lock, BarChart3
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common/ui";
import { userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";
import type { User } from "@/lib/storage";

// Mock data for admin operations
interface PendingApproval {
  id: string;
  userId: string;
  userName: string;
  role: string;
  requestType: "KYC" | "Registration" | "Role Change";
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface SystemAlert {
  id: string;
  type: "Security" | "Performance" | "Error" | "Warning";
  message: string;
  timestamp: string;
  severity: "Critical" | "High" | "Medium" | "Low";
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: string;
  status: "Success" | "Failed";
}

export default function AdminDashboardPage() {
  const session = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedTab, setSelectedTab] = useState<"approvals" | "users" | "alerts" | "logs">("approvals");

  useEffect(() => {
    // Get all users
    const allUsers = userService.getAll();
    setUsers(allUsers);
    
    // Mock pending approvals
    setPendingApprovals([
      { id: "A001", userId: "U001", userName: "Jean Mugabo", role: "Farmer", requestType: "KYC", submittedAt: "2026-07-26T10:30:00", status: "Pending" },
      { id: "A002", userId: "U002", userName: "Alice Uwase", role: "Retailer", requestType: "Registration", submittedAt: "2026-07-26T09:15:00", status: "Pending" },
      { id: "A003", userId: "U003", userName: "Patrick Nkusi", role: "Warehouse", requestType: "Role Change", submittedAt: "2026-07-25T16:45:00", status: "Pending" },
      { id: "A004", userId: "U004", userName: "Grace Kanyana", role: "Supplier", requestType: "KYC", submittedAt: "2026-07-25T14:20:00", status: "Pending" },
      { id: "A005", userId: "U005", userName: "Eric Habimana", role: "Buyer", requestType: "Registration", submittedAt: "2026-07-25T11:00:00", status: "Pending" },
    ]);
    
    // Mock system alerts
    setSystemAlerts([
      { id: "AL001", type: "Security", message: "Multiple failed login attempts detected from IP 197.243.x.x", timestamp: "2026-07-26T11:45:00", severity: "High" },
      { id: "AL002", type: "Performance", message: "Database query response time above threshold (2.5s)", timestamp: "2026-07-26T10:30:00", severity: "Medium" },
      { id: "AL003", type: "Warning", message: "Storage capacity at 85% - consider scaling", timestamp: "2026-07-26T09:15:00", severity: "Medium" },
      { id: "AL004", type: "Error", message: "Email service temporarily unavailable", timestamp: "2026-07-25T18:20:00", severity: "High" },
    ]);
    
    // Mock audit logs
    setAuditLogs([
      { id: "L001", userId: "U100", userName: "Admin User", action: "Approved KYC", resource: "User: Jean Mugabo", timestamp: "2026-07-26T11:30:00", status: "Success" },
      { id: "L002", userId: "U100", userName: "Admin User", action: "Updated Role", resource: "User: Alice Uwase", timestamp: "2026-07-26T10:15:00", status: "Success" },
      { id: "L003", userId: "U101", userName: "Admin Staff", action: "Suspended Account", resource: "User: John Doe", timestamp: "2026-07-26T09:45:00", status: "Success" },
      { id: "L004", userId: "U100", userName: "Admin User", action: "System Settings", resource: "Email Configuration", timestamp: "2026-07-26T08:30:00", status: "Failed" },
      { id: "L005", userId: "U101", userName: "Admin Staff", action: "Data Export", resource: "Users Report", timestamp: "2026-07-25T17:20:00", status: "Success" },
    ]);
  }, []);

  // Calculate KPIs
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "Active").length;
  const pendingUsers = users.filter(u => u.status === "Pending").length;
  const suspendedUsers = users.filter(u => u.status === "Suspended").length;
  
  const pendingApprovalsCount = pendingApprovals.filter(a => a.status === "Pending").length;
  const criticalAlerts = systemAlerts.filter(a => a.severity === "Critical" || a.severity === "High").length;
  const todayActions = auditLogs.filter(log => {
    const logDate = new Date(log.timestamp).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;

  // User role distribution
  const roleDistribution = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleApproval = (approvalId: string, action: "approve" | "reject") => {
    setPendingApprovals(prev => 
      prev.map(a => a.id === approvalId ? { ...a, status: action === "approve" ? "Approved" : "Rejected" } : a)
    );
    // In real app: API call to approve/reject
  };

  return (
    <>
      <PageHeader
        title={`Admin Dashboard — ${session?.claims.name?.split(" ")[0] ?? "Administrator"}`}
        description="Manage users, approvals, system health, and monitor platform activity."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/admin/users")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <Users className="h-4 w-4" /> Manage Users
            </button>
            <button 
              onClick={() => router.push("/admin/settings")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
            >
              <Settings className="h-4 w-4" /> Settings
            </button>
          </div>
        }
      />
      <PageBody>
        {/* KPI Stats */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-semibold text-foreground">{totalUsers}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-semibold text-emerald-600">{activeUsers}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-semibold text-amber-600">{pendingApprovalsCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-semibold text-red-600">{criticalAlerts}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setSelectedTab("approvals")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "approvals"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Approvals ({pendingApprovalsCount})
          </button>
          <button
            onClick={() => setSelectedTab("users")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "users"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Users ({totalUsers})
          </button>
          <button
            onClick={() => setSelectedTab("alerts")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "alerts"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            System Alerts ({criticalAlerts})
          </button>
          <button
            onClick={() => setSelectedTab("logs")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === "logs"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audit Logs
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {selectedTab === "approvals" && (
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Pending Approvals</h3>
                <p className="text-sm text-muted-foreground">{pendingApprovalsCount} requiring action</p>
              </div>
              
              {pendingApprovals.filter(a => a.status === "Pending").length === 0 ? (
                <EmptyState 
                  title="No pending approvals" 
                  description="All approval requests have been processed."
                />
              ) : (
                <div className="space-y-3">
                  {pendingApprovals.filter(a => a.status === "Pending").map((approval) => (
                    <div 
                      key={approval.id} 
                      className="flex items-center gap-4 rounded-lg border border-border bg-surface/50 p-4"
                    >
                      <div className="rounded-full bg-amber-500/10 p-3">
                        <UserCheck className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{approval.userName}</p>
                        <p className="text-sm text-muted-foreground">
                          {approval.requestType} · {approval.role} · Submitted {new Date(approval.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproval(approval.id, "approve")}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleApproval(approval.id, "reject")}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-600 bg-background px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <UserX className="h-4 w-4" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === "users" && (
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">User Management</h3>
                  <p className="text-sm text-muted-foreground">
                    {activeUsers} active, {pendingUsers} pending, {suspendedUsers} suspended
                  </p>
                </div>
                <button 
                  onClick={() => router.push("/admin/users")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View All Users
                </button>
              </div>
              
              {/* Role Distribution */}
              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(roleDistribution).map(([role, count]) => (
                  <div key={role} className="rounded-lg border border-border bg-surface/50 p-3">
                    <p className="text-sm text-muted-foreground">{role}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{count}</p>
                  </div>
                ))}
              </div>

              {/* Recent Users */}
              <div className="space-y-2">
                {users.slice(0, 5).map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <div className={`rounded-full p-2 ${
                      user.status === "Active" ? "bg-emerald-500/10" :
                      user.status === "Pending" ? "bg-amber-500/10" :
                      "bg-red-500/10"
                    }`}>
                      <Users className={`h-4 w-4 ${
                        user.status === "Active" ? "text-emerald-600" :
                        user.status === "Pending" ? "text-amber-600" :
                        "text-red-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email} · {user.role}</p>
                    </div>
                    <StatusBadge status={user.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === "alerts" && (
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">System Alerts</h3>
                <p className="text-sm text-muted-foreground">{criticalAlerts} critical/high priority</p>
              </div>
              
              {systemAlerts.length === 0 ? (
                <EmptyState 
                  title="No alerts" 
                  description="System running smoothly."
                />
              ) : (
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`rounded-lg border p-4 ${
                        alert.severity === "Critical" || alert.severity === "High"
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                          : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.severity === "Critical" || alert.severity === "High"
                            ? "text-red-600"
                            : "text-amber-600"
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              alert.severity === "Critical" || alert.severity === "High"
                                ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                                : "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                            }`}>
                              {alert.severity}
                            </span>
                            <span className="text-xs text-muted-foreground">{alert.type}</span>
                          </div>
                          <p className="mt-1 font-medium text-foreground">{alert.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === "logs" && (
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Audit Logs</h3>
                <p className="text-sm text-muted-foreground">{todayActions} actions today</p>
              </div>
              
              {auditLogs.length === 0 ? (
                <EmptyState 
                  title="No audit logs" 
                  description="No administrative actions recorded."
                />
              ) : (
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                    >
                      <div className={`rounded-full p-2 ${
                        log.status === "Success" ? "bg-emerald-500/10" : "bg-red-500/10"
                      }`}>
                        {log.status === "Success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">
                          {log.userName} · {log.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.resource} · {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={log.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push("/admin/users")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
          >
            <Users className="h-4 w-4" /> User Management
          </button>
          <button
            onClick={() => router.push("/admin/roles")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
          >
            <Shield className="h-4 w-4" /> Roles & Permissions
          </button>
          <button
            onClick={() => router.push("/admin/settings")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
          >
            <Settings className="h-4 w-4" /> System Settings
          </button>
        </div>
      </PageBody>
    </>
  );
}
