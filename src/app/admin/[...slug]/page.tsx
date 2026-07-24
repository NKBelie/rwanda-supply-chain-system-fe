"use client";
import { use } from "react";
import { RoleHome } from "@/components/app/shells/RoleHome";
import { ROLE_HOME_SPEC } from "@/components/app/shells/roleHomeSpecs";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function AdminSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary) return <RoleHome role="super_admin" spec={ROLE_HOME_SPEC.super_admin} />;
  if (primary === "messages") return <RoleMessagesPage role="super_admin" />;
  if (primary === "notifications") return <RoleNotificationsPage role="super_admin" />;
  return <RoleModulePage role="super_admin" slug={slug!.join("/")} />;
}
