"use client";

import { useAuth } from "@/hooks/useAuth";

export function useCurrentUser() {
  return useAuth().session;
}
