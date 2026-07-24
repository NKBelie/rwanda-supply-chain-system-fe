"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, Banknote, CreditCard, Landmark, ReceiptText, ShieldCheck, Sparkles, Wallet2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceTable } from "./InvoiceTable";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { PaymentModal } from "./PaymentModal";
import { PaymentSummaryCard } from "./PaymentSummaryCard";
import { ReceiptModal } from "./ReceiptModal";
import { RefundTable } from "./RefundTable";
import { TransactionTable } from "./TransactionTable";
import { InvoiceDetailsModal } from "./InvoiceDetailsModal";
import { paymentInvoices, paymentMethods, paymentTransactions, type PaymentInvoice, type PaymentTransaction } from "./data";

const tabs = ["Overview", "Pending", "Invoices", "Transactions", "Methods", "Wallet", "Refunds", "Reports"] as const;

type TabKey = (typeof tabs)[number];

export function BuyerPaymentCenter() {
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");
  const [invoiceFilter, setInvoiceFilter] = useState("All");
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentInvoice | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [confirmInvoice, setConfirmInvoice] = useState<PaymentInvoice | null>(null);
  const [feedback, setFeedback] = useState("Payments are synced with your supplier ledger.");

  const summary = useMemo(() => {
    const pendingAmount = paymentInvoices.filter((invoice) => invoice.status === "Pending").reduce((sum, invoice) => sum + Number(invoice.amount.replace(/[^\d]/g, "")), 0);
    const overdueCount = paymentInvoices.filter((invoice) => invoice.status === "Overdue").length;
    const paidCount = paymentInvoices.filter((invoice) => invoice.status === "Paid").length;
    return {
      pendingAmount,
      overdueCount,
      paidCount,
    };
  }, []);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PaymentSummaryCard label="Outstanding balance" value={`RWF ${summary.pendingAmount.toLocaleString()}`} detail="Across 3 active invoices" icon={Banknote} trend="2.3% below plan" />
        <PaymentSummaryCard label="Past due" value={`${summary.overdueCount} invoices`} detail="Needs follow-up" icon={Landmark} trend="Immediate action" />
        <PaymentSummaryCard label="Completed this month" value={`${summary.paidCount} payments`} detail="Processed successfully" icon={ReceiptText} trend="+12% vs last month" />
        <PaymentSummaryCard label="Available credit" value="RWF 3.2M" detail="Reserved for urgent orders" icon={Wallet2} trend="Healthy buffer" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="border-border/80 bg-background shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Supplier invoice health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
                <div>
                  <div className="font-medium text-foreground">{invoice.id}</div>
                  <div className="text-sm text-muted-foreground">{invoice.supplier} • {invoice.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{invoice.amount}</div>
                  <div className="text-sm text-muted-foreground">{invoice.status}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-background shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Smart payment tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border bg-surface p-3">Use bank transfer for large invoices to reduce processing time.</div>
            <div className="rounded-xl border border-border bg-surface p-3">Schedule payment reminders for overdue invoices before the due date.</div>
            <div className="rounded-xl border border-border bg-surface p-3">Keep a backup mobile money method for urgent supplier confirmations.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPending = () => (
    <div className="space-y-4">
      <Card className="border-border/80 bg-background shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Pending payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentInvoices.filter((invoice) => invoice.status !== "Paid").map((invoice) => (
            <div key={invoice.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-foreground">{invoice.id}</div>
                <div className="text-sm text-muted-foreground">{invoice.supplier} • {invoice.products}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Due {invoice.dueDate}</span>
                <Button variant="secondary" onClick={() => setConfirmInvoice(invoice)}>Pay now</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Paid', 'Overdue'].map((filter) => (
          <Button key={filter} variant={invoiceFilter === filter ? 'default' : 'outline'} size="sm" onClick={() => setInvoiceFilter(filter)}>{filter}</Button>
        ))}
      </div>
      <InvoiceTable filter={invoiceFilter} onViewInvoice={(invoiceId) => {
        const invoice = paymentInvoices.find((item) => item.id === invoiceId) ?? null;
        setSelectedInvoice(invoice);
      }} onPayNow={(invoiceId) => {
        const invoice = paymentInvoices.find((item) => item.id === invoiceId) ?? null;
        setConfirmInvoice(invoice);
      }} />
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      <TransactionTable />
    </div>
  );

  const renderMethods = () => (
    <div className="space-y-4">
      <Card className="border-border/80 bg-background shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Saved payment methods</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.id} method={method} onEdit={() => setFeedback(`Editing ${method.name}`)} onRemove={() => setFeedback(`${method.name} removed from your preferred methods.`)} />
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderWallet = () => (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="border-border/80 bg-background shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Wallet & credit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-primary/10 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-primary"><Wallet2 className="h-4 w-4" /> Available wallet balance</div>
            <div className="mt-3 text-3xl font-semibold text-foreground">RWF 1.4M</div>
            <div className="mt-2 text-sm text-muted-foreground">Ready for same-day supplier payouts and urgent purchases.</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-4 text-sm">
              <div className="font-semibold text-foreground">Credit limit</div>
              <div className="mt-1 text-muted-foreground">RWF 5.0M</div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4 text-sm">
              <div className="font-semibold text-foreground">Utilization</div>
              <div className="mt-1 text-muted-foreground">38% used</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/80 bg-background shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Protection & controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"><ShieldCheck className="h-4 w-4 text-primary" /> Two-factor verification enabled for all transfers.</div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"><Sparkles className="h-4 w-4 text-primary" /> Smart approval routing is active for large payments.</div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"><CreditCard className="h-4 w-4 text-primary" /> Auto-reconciliation with your bank and ERP is enabled.</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRefunds = () => (
    <div className="space-y-4">
      <RefundTable />
    </div>
  );

  const renderReports = () => (
    <Card className="border-border/80 bg-background shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Finance reports</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="font-semibold text-foreground">Weekly cash flow</div>
          <div className="mt-2 text-sm text-muted-foreground">Net inflow of RWF 4.8M with strong supplier liquidity.</div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="font-semibold text-foreground">Dispute trend</div>
          <div className="mt-2 text-sm text-muted-foreground">Only 1 unresolved issue this month across 24 transactions.</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-surface px-4 py-3">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowDownToLine className="h-4 w-4" /> Payments synced with supplier ledger
        </div>
        <div className="text-sm text-muted-foreground">{feedback}</div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-background p-1.5 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-xl px-3 py-2 text-sm font-medium transition ${activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && renderOverview()}
      {activeTab === "Pending" && renderPending()}
      {activeTab === "Invoices" && renderInvoices()}
      {activeTab === "Transactions" && renderTransactions()}
      {activeTab === "Methods" && renderMethods()}
      {activeTab === "Wallet" && renderWallet()}
      {activeTab === "Refunds" && renderRefunds()}
      {activeTab === "Reports" && renderReports()}

      <PaymentModal invoice={confirmInvoice ? { id: confirmInvoice.id, supplier: confirmInvoice.supplier, amount: confirmInvoice.amount } : undefined} onClose={() => setConfirmInvoice(null)} onConfirm={() => {
        setFeedback(`Payment request for ${confirmInvoice?.id} has been queued.`);
        setConfirmInvoice(null);
      }} />
      <InvoiceDetailsModal invoice={selectedInvoice ? { id: selectedInvoice.id, supplier: selectedInvoice.supplier, amount: selectedInvoice.amount, products: selectedInvoice.products, date: selectedInvoice.date, status: selectedInvoice.status } : undefined} onClose={() => setSelectedInvoice(null)} />
      <ReceiptModal transaction={selectedTransaction ? { id: selectedTransaction.id, amount: selectedTransaction.amount, method: selectedTransaction.method, date: selectedTransaction.date } : undefined} onClose={() => setSelectedTransaction(null)} />
    </div>
  );
}
