"use client";
import { use } from "react";
import { RoleHome } from "@/components/app/shells/RoleHome";
import { ROLE_HOME_SPEC } from "@/components/app/shells/roleHomeSpecs";
import { RoleModulePage } from "@/components/app/shells/RoleModulePage";
import { RoleMessagesPage } from "@/components/app/modules/MessagesPage";
import { RoleNotificationsPage } from "@/components/app/modules/NotificationsPage";

export default function BankSlugPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = use(params);
  const primary = slug?.[0] ?? "";
  if (!primary) return <RoleHome role="bank" spec={ROLE_HOME_SPEC.bank} />;
  if (primary === "messages") return <RoleMessagesPage role="bank" />;
  if (primary === "notifications") return <RoleNotificationsPage role="bank" />;
  return <RoleModulePage role="bank" slug={slug!.join("/")} />;
}
