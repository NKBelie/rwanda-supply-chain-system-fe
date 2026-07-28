"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, TrendingUp, Users, CreditCard, AlertTriangle,
  CheckCircle2, Clock, BarChart3, FileText, Eye,
  ShieldCheck, TrendingDown, Activity, Wallet
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { StatusBadge, EmptyState } from "@/components/common";
import { orderService, userService } from "@/services/data.service";
import { useSession } from "@/lib/auth/session";

// Mock data for bank operations
interface LoanApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantType: string;
  amount: number;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected" | "Under Review";
  submittedAt: string;
  creditScore: number;
}

interface Transaction {
  id: string;
  fromEntity: string;
  toEntity: string;
  amount: number;
  type: "Payment" | "Loan Disbursement" | "Repayment" | "Transfer";
  status: "Completed" | "Pending" | "Failed";
  timestamp: string;
}

interface CreditProfile {
  userId: string;
  userName: string;
  role: string;
  creditScore: number;
  totalBorrowed: number;
  repaymentRate: number;
  riskLevel: "Low" | "Medium" | "High";
}

export default function BankDashboardPage() {
  const session = useSession();
  const router = useRouter();

  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [creditProfiles, setCreditProfiles] = useState<CreditProfile[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Get order data for transaction value
    const allOrders = orderService.getAll();
    setOrders(allOrders);
    
    // Mock loan applications
    setLoanApplications([
      { id: "LA001", applicantId: "U001", applicantName: "Green Valley Cooperative", applicantType: "Cooperative", amount: 5000000, purpose: "Equipment Purchase", status: "Under Review", submittedAt: "2026-07-25T10:00:00", creditScore: 720 },
      { id: "LA002", applicantId: "U002", applicantName: "Fresh Foods Ltd", applicantType: "Manufacturer", amount: 8000000, purpose: "Facility Expansion", status: "Pending", submittedAt: "2026-07-24T14:30:00", creditScore: 680 },
      { id: "LA003", applicantId: "U003", applicantName: "Express Transport", applicantType: "Transport", amount: 3000000, purpose: "Fleet Upgrade", status: "Approved", submittedAt: "2026-07-22T09:15:00", creditScore: 750 },
      { id: "LA004", applicantId: "U004", applicantName: "City Warehouse Co", applicantType: "Warehouse", amount: 6000000, purpose: "Cold Storage Construction", status: "Under Review", submittedAt: "2026-07-20T16:45:00", creditScore: 695 },
    ]);
    
    // Mock transactions
    setTransactions([
      { id: "TX001", fromEntity: "Retailer Shop A", toEntity: "Farmer John", amount: 450000, type: "Payment", status: "Completed", timestamp: "2026-07-26T11:30:00" },
      { id: "TX002", fromEntity: "RSCN Bank", toEntity: "Express Transport", amount: 3000000, type: "Loan Disbursement", status: "Completed", timestamp: "2026-07-26T10:00:00" },
      { id: "TX003", fromEntity: "Manufacturer Co", toEntity: "Supplier Ltd", amount: 1200000, type: "Payment", status: "Pending", timestamp: "2026-07-26T09:15:00" },
      { id: "TX004", fromEntity: "Green Valley Coop", toEntity: "RSCN Bank", amount: 250000, type: "Repayment", status: "Completed", timestamp: "2026-07-25T16:20:00" },
      { id: "TX005", fromEntity: "Buyer Corp", toEntity: "Warehouse Central", amount: 850000, type: "Payment", status: "Completed", timestamp: "2026-07-25T14:45:00" },
    ]);
    
    // Mock credit profiles
    setCreditProfiles([
      { userId: "U001", userName: "Green Valley Cooperative", role: "Cooperative", creditScore: 720, totalBorrowed: 5000000, repaymentRate: 98.5, riskLevel: "Low" },
      { userId: "U002", userName: "Fresh Foods Ltd", role: "Manufacturer", creditScore: 680, totalBorrowed: 8000000, repaymentRate: 95.0, riskLevel: "Medium" },
      { userId: "U003", userName: "Express Transport", role: "Transport", creditScore: 750, totalBorrowed: 3000000, repaymentRate: 99.2, riskLevel: "Low" },
      { userId: "U004", userName: "City Warehouse Co", role: "Warehouse", creditScore: 695, totalBorrowed: 6000000, repaymentRate: 96.8, riskLevel: "Low" },
      { userId: "U005", userName: "Supplier Network", role: "Supplier", creditScore: 640, totalBorrowed: 4000000, repaymentRate: 92.5, riskLevel: "Medium" },
    ]);
  }, []);

  // Calculate KPIs
  const pendingLoans = loanApplications.filter(l => l.status === "Pending" || l.status === "Under Review").length;
  const approvedLoans = loanApplications.filter(l => l.status === "Approved").length;
  const totalLoanValue = loanApplications.reduce((sum, l) => sum + l.amount, 0);
  const approvedLoanValue = loanApplications.filter(l => l.status === "Approved").reduce((sum, l) => sum + l.amount, 0);
  
  const completedTransactions = transactions.filter(t => t.status === "Completed").length;
  const totalTransactionValue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingTransactions = transactions.filter(t => t.status === "Pending").length;
  
  const avgCreditScore = creditProfiles.reduce((sum, p) => sum + p.creditScore, 0) / creditProfiles.length;
  const lowRiskProfiles = creditProfiles.filter(p => p.riskLevel === "Low").length;
  const highRiskProfiles = creditProfiles.filter(p => p.riskLevel === "High").length;

  const handleLoanAction = (loanId: string, action: "approve" | "reject") => {
    setLoanApplications(prev => 
      prev.map(l => l.id === loanId ? { ...l, status: action === "approve" ? "Approved" : "Rejected" } : l)
    );
    // In real app: API call to approve/reject loan
  };

  return (
    <>
      <PageHeader
        title={`Bank Operations — ${session?.claims.name?.split(" ")[0] ?? "Officer"}`}
        description="Manage loan applications, monitor transactions, assess credit risk, and oversee financial operations."
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => router.push("/bank/loans")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
            >
              <CreditCard className="h-4 w-4" /> Loan Applications
            </button>
            <button 
              onClick={() => router.push("/bank/analytics")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
            >
              <BarChart3 className="h-4 w-4" /> Financial Reports
            </button>
          </div>
        }
      />
      <PageBody>
        {/* Summary Statistics */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Loan Portfolio</p>
              <p className="text-2xl font-semibold text-foreground">RWF {(totalLoanValue / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transaction Volume</p>
              <p className="text-2xl font-semibold text-foreground">RWF {(totalTransactionValue / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Credit Score</p>
              <p className="text-2xl font-semibold text-foreground">{avgCreditScore.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
              <p className="text-2xl font-semibold text-amber-600">{pendingLoans}</p>
            </div>
          </div>
        </div>

        {/* Loan Applications & Transactions */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Pending Loan Applications */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Loan Applications</h3>
                <p className="text-sm text-muted-foreground">{pendingLoans} pending review</p>
              </div>
              <button 
                onClick={() => router.push("/bank/loans")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {loanApplications.filter(l => l.status === "Pending" || l.status === "Under Review").length === 0 ? (
              <EmptyState 
                title="No pending applications" 
                description="All loan applications have been processed."
              />
            ) : (
              <div className="space-y-3">
                {loanApplications.filter(l => l.status === "Pending" || l.status === "Under Review").map((loan) => (
                  <div 
                    key={loan.id} 
                    className="rounded-lg border border-border bg-surface/50 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{loan.applicantName}</p>
                        <p className="text-sm text-muted-foreground">{loan.applicantType} · {loan.purpose}</p>
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-sm">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="ml-1 font-semibold text-foreground">RWF {(loan.amount / 1000000).toFixed(1)}M</span>
                          </span>
                          <span className={`text-sm ${
                            loan.creditScore >= 700 ? "text-emerald-600" :
                            loan.creditScore >= 650 ? "text-blue-600" :
                            "text-amber-600"
                          }`}>
                            Credit: {loan.creditScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoanAction(loan.id, "approve")}
                        className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve
                      </button>
                      <button
                        onClick={() => router.push(`/bank/loans/${loan.id}`)}
                        className="flex-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm hover:bg-surface"
                      >
                        <Eye className="h-4 w-4" /> Review
                      </button>
                      <button
                        onClick={() => handleLoanAction(loan.id, "reject")}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-600 bg-background px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                <p className="text-sm text-muted-foreground">{pendingTransactions} pending</p>
              </div>
              <button 
                onClick={() => router.push("/bank/transactions")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </button>
            </div>
            
            {transactions.length === 0 ? (
              <EmptyState 
                title="No transactions" 
                description="Transactions will appear here."
              />
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <div className={`rounded-full p-2 ${
                      tx.status === "Completed" ? "bg-emerald-500/10" :
                      tx.status === "Pending" ? "bg-amber-500/10" :
                      "bg-red-500/10"
                    }`}>
                      <DollarSign className={`h-4 w-4 ${
                        tx.status === "Completed" ? "text-emerald-600" :
                        tx.status === "Pending" ? "text-amber-600" :
                        "text-red-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{tx.fromEntity} → {tx.toEntity}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.type} · {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        RWF {(tx.amount / 1000).toFixed(0)}K
                      </p>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Credit Risk Profiles */}
        <div className="mt-6 rounded-xl border border-border bg-background p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Credit Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">
                {lowRiskProfiles} low risk, {highRiskProfiles} high risk profiles
              </p>
            </div>
            <button 
              onClick={() => router.push("/bank/credit-analysis")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Full Analysis
            </button>
          </div>
          
          {creditProfiles.length === 0 ? (
            <EmptyState 
              title="No credit profiles" 
              description="Credit profiles will appear here."
            />
          ) : (
            <div className="space-y-2">
              {creditProfiles.map((profile) => (
                <div 
                  key={profile.userId} 
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 p-3"
                >
                  <div className={`rounded-full p-2 ${
                    profile.riskLevel === "Low" ? "bg-emerald-500/10" :
                    profile.riskLevel === "Medium" ? "bg-amber-500/10" :
                    "bg-red-500/10"
                  }`}>
                    <ShieldCheck className={`h-4 w-4 ${
                      profile.riskLevel === "Low" ? "text-emerald-600" :
                      profile.riskLevel === "Medium" ? "text-amber-600" :
                      "text-red-600"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{profile.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {profile.role} · Score: {profile.creditScore} · Repayment: {profile.repaymentRate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                      profile.riskLevel === "Low" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                      profile.riskLevel === "Medium" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400" :
                      "bg-red-500/10 text-red-700 dark:text-red-400"
                    }`}>
                      {profile.riskLevel} Risk
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">
                      RWF {(profile.totalBorrowed / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </PageBody>
    </>
  );
}
