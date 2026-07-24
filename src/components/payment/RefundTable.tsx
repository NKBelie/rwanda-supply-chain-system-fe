import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { refundItems } from "./data";

export function RefundTable() {
  return (
    <Card className="border-border/80 bg-background shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Refund requests</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto px-4 pb-4">
        <table className="min-w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Refund ID</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {refundItems.map((refund) => (
              <tr key={refund.id} className="border-t border-border/70">
                <td className="px-3 py-3 font-medium">{refund.id}</td>
                <td className="px-3 py-3">{refund.orderId}</td>
                <td className="px-3 py-3">{refund.product}</td>
                <td className="px-3 py-3">{refund.amount}</td>
                <td className="px-3 py-3">{refund.status}</td>
                <td className="px-3 py-3"><Button variant="secondary" size="sm">View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
