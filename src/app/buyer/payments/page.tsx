import { BuyerPaymentCenter } from "@/components/payment/BuyerPaymentCenter";
import { PageBody, PageHeader } from "@/components/app/PageChrome";

export default function BuyerPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Manage invoices, payments and supplier liquidity."
        crumbs={[{ label: "Buyer", href: "/buyer/dashboard" }, { label: "Payments" }]}
      />
      <PageBody>
        <BuyerPaymentCenter />
      </PageBody>
    </>
  );
}
