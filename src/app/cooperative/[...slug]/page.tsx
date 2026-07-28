"use client";
import { use } from "react";
import CooperativeDashboardPage from "@/components/cooperative/CooperativeDashboard";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function CooperativeSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary || primary === "dashboard") return <CooperativeDashboardPage />;
  if (primary === "messages") return <RoleMessagesPage role="cooperative" />;
  if (primary === "notifications") return <RoleNotificationsPage role="cooperative" />;
  return <RoleModulePage role="cooperative" slug={slug!.join("/")} />;
}
