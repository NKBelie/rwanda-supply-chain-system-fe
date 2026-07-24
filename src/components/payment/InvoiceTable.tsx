import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentInvoices } from "./data";

export function InvoiceTable({ filter, onViewInvoice, onPayNow }: { filter: string; onViewInvoice: (invoiceId: string) => void; onPayNow: (invoiceId: string) => void }) {
  const rows = paymentInvoices.filter((invoice) => filter === "All" || invoice.status === filter);

  return (
    <Card className="border-border/80 bg-background shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Invoices</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto px-4 pb-4">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Invoice</th>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2">Products</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((invoice) => (
              <tr key={invoice.id} className="border-t border-border/70">
                <td className="px-3 py-3 font-medium">{invoice.id}</td>
                <td className="px-3 py-3">{invoice.supplier}</td>
                <td className="px-3 py-3">{invoice.products}</td>
                <td className="px-3 py-3">{invoice.amount}</td>
                <td className="px-3 py-3">{invoice.status}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => onViewInvoice(invoice.id)}>View</Button>
                    <Button variant="outline" size="sm" onClick={() => onPayNow(invoice.id)}>Pay</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
