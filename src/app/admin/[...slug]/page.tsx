"use client";
import { use } from "react";
import AdminDashboardPage from "@/components/admin/AdminDashboard";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function AdminSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary || primary === "dashboard") return <AdminDashboardPage />;
  if (primary === "messages") return <RoleMessagesPage role="super_admin" />;
  if (primary === "notifications") return <RoleNotificationsPage role="super_admin" />;
  return <RoleModulePage role="super_admin" slug={slug!.join("/")} />;
}
