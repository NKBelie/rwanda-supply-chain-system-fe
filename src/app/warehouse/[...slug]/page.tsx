"use client";
import { use } from "react";
import WarehouseDashboardPage from "@/components/warehouse/WarehouseDashboard";
import WarehouseFacilitiesPage from "@/components/warehouse/WarehouseFacilities";
import WarehouseBatchesPage from "@/components/warehouse/WarehouseBatches";
import WarehouseRequestsPage from "@/components/warehouse/WarehouseRequests";
import WarehouseReservationsPage from "@/components/warehouse/WarehouseReservations";
import WarehouseIncomingGoodsPage from "@/components/warehouse/WarehouseIncomingGoods";
import WarehouseOutgoingGoodsPage from "@/components/warehouse/WarehouseOutgoingGoods";
import WarehouseAnalyticsPage from "@/components/warehouse/WarehouseAnalytics";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function WarehouseSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = use(params);
  const primary = slug[0] ?? "";

  switch (primary) {
    case "": case "dashboard": return <WarehouseDashboardPage />;
    case "facilities": return <WarehouseFacilitiesPage />;
    case "batches": return <WarehouseBatchesPage />;
    case "requests": return <WarehouseRequestsPage />;
    case "reservations": return <WarehouseReservationsPage />;
    case "incoming": return <WarehouseIncomingGoodsPage />;
    case "outgoing": return <WarehouseOutgoingGoodsPage />;
    case "analytics": return <WarehouseAnalyticsPage />;
    case "messages": return <RoleMessagesPage role="warehouse" />;
    case "notifications": return <RoleNotificationsPage role="warehouse" />;
    default: return <RoleModulePage role="warehouse" slug={slug.join("/")} />;
  }
}
