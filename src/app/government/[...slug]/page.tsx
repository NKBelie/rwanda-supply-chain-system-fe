"use client";
import { use } from "react";
import GovernmentDashboardPage from "@/components/government/GovernmentDashboard";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function GovernmentSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary || primary === "dashboard") return <GovernmentDashboardPage />;
  if (primary === "messages") return <RoleMessagesPage role="government" />;
  if (primary === "notifications") return <RoleNotificationsPage role="government" />;
  return <RoleModulePage role="government" slug={slug!.join("/")} />;
}
