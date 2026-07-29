"use client";

import type { Permission } from "@/constants/permissions";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

export function usePermissions() {
  const { session, can } = useAuth();

  return {
    can,
  };
}
