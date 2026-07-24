"use client";
import { use } from "react";
import FarmerDashboardPage from "@/components/farmer/FarmerDashboard";
import FarmerProductsPage from "@/components/farmer/FarmerProducts";
import FarmerOrdersPage from "@/components/farmer/FarmerOrders";
import FarmerTransportPage from "@/components/farmer/FarmerTransport";
import FarmerInventoryPage from "@/components/farmer/FarmerInventory";
import FarmerWarehousePage from "@/components/farmer/FarmerWarehouse";
import FarmerMarketPricesPage from "@/components/farmer/FarmerMarketPrices";
import FarmerAnalyticsPage from "@/components/farmer/FarmerAnalytics";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function FarmerSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = use(params);
  const primary = slug[0] ?? "";

  switch (primary) {
    case "": case "dashboard": return <FarmerDashboardPage />;
    case "products": return <FarmerProductsPage />;
    case "orders": return <FarmerOrdersPage />;
    case "transport": return <FarmerTransportPage />;
    case "inventory": return <FarmerInventoryPage />;
    case "warehouse": return <FarmerWarehousePage />;
    case "prices": return <FarmerMarketPricesPage />;
    case "analytics": return <FarmerAnalyticsPage />;
    case "messages": return <RoleMessagesPage role="farmer" />;
    case "notifications": return <RoleNotificationsPage role="farmer" />;
    default: return <RoleModulePage role="farmer" slug={slug.join("/")} />;
  }
}
