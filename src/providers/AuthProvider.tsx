"use client";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { initSession, useSession, signInWithCredentials, signOut, refreshSession } from "@/lib/auth/session";
import type { LoginInput, Session } from "@/lib/auth/session";
import type { Role } from "@/lib/auth/roles";
import { hasPermission, type Permission } from "@/lib/auth/permissions";

type AuthContextValue = {
  session: Session | null;
  isAuthenticated: boolean;
  role: Role | undefined;
  signIn: (input: LoginInput) => Promise<{ session: Session; nextPath: string }>;
  signOut: () => void;
  can: (permission: Permission) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession();

  useEffect(() => {
    void initSession();
  }, []);

  useEffect(() => {
    if (!session) return;
    const msUntilRefresh = (session.expiresAt - Math.floor(Date.now() / 1000) - 60) * 1000;
    if (msUntilRefresh <= 0) {
      void refreshSession();
      return;
    }
    const timer = setTimeout(() => void refreshSession(), msUntilRefresh);
    return () => clearTimeout(timer);
  }, [session]);

  const value: AuthContextValue = {
    session,
    isAuthenticated: session !== null,
    role: session?.claims.role,
    signIn: signInWithCredentials,
    signOut,
    can: (permission: Permission) => hasPermission(session?.claims.role, permission),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
