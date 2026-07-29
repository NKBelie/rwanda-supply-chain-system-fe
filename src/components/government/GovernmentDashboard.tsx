"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, Users, Building2, Package, DollarSign,
  FileText, BarChart3, Download, Eye, CheckCircle2,
  AlertCircle, MapPin, Activity, Globe
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common/ui";
import { productService, orderService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";

// Mock data for government oversight
interface ComplianceReport {
  id: string;
  entityName: string;
  entityType: string;
  reportType: string;
  status: "Compliant" | "Non-Compliant" | "Under Review";
  submittedAt: string;
  reviewedAt?: string;
}

interface TradeActivity {
  id: string;
  region: string;
  productsTraded: number;
  totalValue: number;
  growthRate: number;
}

export default function GovernmentDashboardPage() {
  const session = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [tradeActivity, setTradeActivity] = useState<TradeActivity[]>([]);

  useEffect(() => {
    // Get platform data
    const allUsers = userService.getAll();
    const allProducts = productService.getAll();
    const allOrders = orderService.getAll();
    
    setUsers(allUsers);
    setProducts(allProducts);
    setOrders(allOrders);
    
    // Mock compliance reports
    setComplianceReports([
      { id: "CR001", entityName: "Green Valley Farmers Coop", entityType: "Cooperative", reportType: "Food Safety", status: "Compliant", submittedAt: "2026-07-20T10:00:00", reviewedAt: "2026-07-22T14:30:00" },
      { id: "CR002", entityName: "Kigali Central Warehouse", entityType: "Warehouse", reportType: "Storage Standards", status: "Under Review", submittedAt: "2026-07-24T09:15:00" },
      { id: "CR003", entityName: "Fresh Foods Processing Ltd", entityType: "Manufacturer", reportType: "Quality Control", status: "Compliant", submittedAt: "2026-07-18T11:45:00", reviewedAt: "2026-07-19T16:20:00" },
      { id: "CR004", entityName: "Express Transport Services", entityType: "Transport", reportType: "Vehicle Inspection", status: "Non-Compliant", submittedAt: "2026-07-15T08:30:00", reviewedAt: "2026-07-16T10:00:00" },
    ]);
    
    // Mock trade activity by region
    setTradeActivity([
      { id: "R1", region: "Kigali City", productsTraded: 2500, totalValue: 45000000, growthRate: 12.5 },
      { id: "R2", region: "Eastern Province", productsTraded: 1800, totalValue: 32000000, growthRate: 8.3 },
      { id: "R3", region: "Southern Province", productsTraded: 2100, totalValue: 38000000, growthRate: 15.7 },
      { id: "R4", region: "Western Province", productsTraded: 1500, totalValue: 27000000, growthRate: 6.2 },
      { id: "R5", region: "Northern Province", productsTraded: 1200, totalValue: 22000000, growthRate: 9.8 },
    ]);
  }, []);

  // Calculate KPIs
  const totalEntities = users.length;
  const activeEntities = users.filter(u => u.status === "Active").length;
  const pendingApprovals = users.filter(u => u.status === "Pending").length;
  
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "Completed" || o.status === "Delivered").length;
  
  const totalTradeValue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const avgOrderValue = totalTradeValue / orders.length;
  
  const compliantReports = complianceReports.filter(r => r.status === "Compliant").length;
  const nonCompliantReports = complianceReports.filter(r => r.status === "Non-Compliant").length;
  const underReview = complianceReports.filter(r => r.status === "Under Review").length;

  // Entity distribution by role
  const entityDistribution = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportData = (type: string) => {
    // Mock export function
    console.log(`Exporting ${type} data...`);
    alert(`${type} data export started. Download will begin shortly.`);
  };

  return (
    <>
      <PageHeader
        title={`Government Oversight — ${session?.claims.name?.split(" ")[0] ?? "Officer"}`}
        description="Monitor supply chain activity, compliance, trade statistics, and regulatory oversight."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => exportData("All Data")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <Download className="h-4 w-4" /> Export Report
            </button>
            <button 
              onClick={() => router.push("/government/analytics")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
            >
              <BarChart3 className="h-4 w-4" /> Analytics
            </button>
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Registered Entities</p>
              <p className="text-2xl font-semibold text-foreground">{activeEntities}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Trade Value</p>
              <p className="text-2xl font-semibold text-foreground">RWF {(totalTradeValue / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products Tracked</p>
              <p className="text-2xl font-semibold text-foreground">{totalProducts}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compliance Rate</p>
              <p className="text-2xl font-semibold text-emerald-600">{((compliantReports / complianceReports.length) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Entity Distribution & Trade Activity */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Entity Distribution */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Entity Distribution</h3>
                <p className="text-sm text-muted-foreground">{totalEntities} total registered</p>
              </div>
              <button 
                onClick={() => exportData("Entities")}
                className="text-sm font-medium text-primary hover:underline"
              >
                Export
              </button>
            </div>
            
            <div className="space-y-3">
              {Object.entries(entityDistribution).map(([role, count]) => {
                const percentage = ((count as number) / totalEntities * 100).toFixed(1);
                return (
                  <div key={role}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-foreground capitalize">{role}</span>
                      <span className="text-muted-foreground">{count as number} ({percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Trade Activity */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Regional Trade Activity</h3>
                <p className="text-sm text-muted-foreground">By province</p>
              </div>
              <button 
                onClick={() => router.push("/government/map")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View Map
              </button>
            </div>
            
            <div className="space-y-2">
              {tradeActivity.map((region) => (
                <div 
                  key={region.id} 
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                >
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{region.region}</p>
                    <p className="text-xs text-muted-foreground">
                      {region.productsTraded} products · RWF {(region.totalValue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      region.growthRate > 10 ? "text-emerald-600" :
                      region.growthRate > 5 ? "text-blue-600" :
                      "text-muted-foreground"
                    }`}>
                      +{region.growthRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Growth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Reports */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Compliance Reports</h3>
              <p className="text-sm text-muted-foreground">
                {compliantReports} compliant, {nonCompliantReports} non-compliant, {underReview} under review
              </p>
            </div>
            <button 
              onClick={() => router.push("/government/compliance")}
              className="text-sm font-medium text-primary hover:underline"
            >
              View All
            </button>
          </div>
          
          {complianceReports.length === 0 ? (
            <EmptyState 
              title="No compliance reports" 
              description="Compliance reports will appear here."
            />
          ) : (
            <div className="space-y-2">
              {complianceReports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                >
                  <div className={`rounded-full p-2 ${
                    report.status === "Compliant" ? "bg-emerald-500/10" :
                    report.status === "Non-Compliant" ? "bg-red-500/10" :
                    "bg-amber-500/10"
                  }`}>
                    {report.status === "Compliant" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : report.status === "Non-Compliant" ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{report.entityName}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.reportType} · {report.entityType} · Submitted {new Date(report.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
              ))}
            </div>
          )}
        </div>

      </PageBody>
    </>
  );
}
