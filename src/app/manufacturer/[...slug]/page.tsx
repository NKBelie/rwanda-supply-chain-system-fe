"use client";
import { use } from "react";
import ManufacturerDashboardPage from "@/components/manufacturer/ManufacturerDashboard";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function ManufacturerSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary || primary === "dashboard") return <ManufacturerDashboardPage />;
  if (primary === "messages") return <RoleMessagesPage role="manufacturer" />;
  if (primary === "notifications") return <RoleNotificationsPage role="manufacturer" />;
  return <RoleModulePage role="manufacturer" slug={slug!.join("/")} />;
}
