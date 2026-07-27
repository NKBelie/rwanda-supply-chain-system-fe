"use client";
import { use } from "react";
import RetailerDashboardPage from "@/components/retailer/RetailerDashboard";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function RetailerSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary || primary === "dashboard") return <RetailerDashboardPage />;
  if (primary === "messages") return <RoleMessagesPage role="retailer" />;
  if (primary === "notifications") return <RoleNotificationsPage role="retailer" />;
  return <RoleModulePage role="retailer" slug={slug!.join("/")} />;
}
