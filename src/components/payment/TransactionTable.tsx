import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentTransactions } from "./data";

export function TransactionTable() {
  return (
    <Card className="border-border/80 bg-background shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent transactions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto px-4 pb-4">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Transaction ID</th>
              <th className="px-3 py-2">Invoice</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Method</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-border/70">
                <td className="px-3 py-3 font-medium">{transaction.id}</td>
                <td className="px-3 py-3">{transaction.invoiceId}</td>
                <td className="px-3 py-3">{transaction.orderId}</td>
                <td className="px-3 py-3">{transaction.amount}</td>
                <td className="px-3 py-3">{transaction.method}</td>
                <td className="px-3 py-3">{transaction.status}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">View</Button>
                    <Button variant="outline" size="sm">Receipt</Button>
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
