"use client";
import { use } from "react";
import BankDashboardPage from "@/components/bank/BankDashboard";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function BankSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary || primary === "dashboard") return <BankDashboardPage />;
  if (primary === "messages") return <RoleMessagesPage role="bank" />;
  if (primary === "notifications") return <RoleNotificationsPage role="bank" />;
  return <RoleModulePage role="bank" slug={slug!.join("/")} />;
}
