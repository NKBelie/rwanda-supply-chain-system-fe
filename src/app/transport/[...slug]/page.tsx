"use client";
import { use } from "react";
import TransportDashboardPage from "@/components/transport/TransportDashboard";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function TransportSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary || primary === "dashboard") return <TransportDashboardPage />;
  if (primary === "messages") return <RoleMessagesPage role="transport" />;
  if (primary === "notifications") return <RoleNotificationsPage role="transport" />;
  return <RoleModulePage role="transport" slug={slug!.join("/")} />;
}
