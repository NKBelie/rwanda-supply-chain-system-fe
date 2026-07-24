"use client";
import { use } from "react";
import { RoleHome } from "@/components/app/shells/RoleHome";
import { ROLE_HOME_SPEC } from "@/components/app/shells/roleHomeSpecs";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function TransportSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary) return <RoleHome role="transport" spec={ROLE_HOME_SPEC.transport} />;
  if (primary === "messages") return <RoleMessagesPage role="transport" />;
  if (primary === "notifications") return <RoleNotificationsPage role="transport" />;
  return <RoleModulePage role="transport" slug={slug!.join("/")} />;
}
