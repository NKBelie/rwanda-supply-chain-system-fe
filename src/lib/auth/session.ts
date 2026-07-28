// Temporary localStorage authentication.
// Replace with backend API and JWT authentication before production.
"use client";

// Force load mock data before any auth operations
if (typeof window !== "undefined") {
  import("@/lib/storage/force-init").catch(console.error);
}

import { useSyncExternalStore } from "react";
import { ROLE_DASHBOARDS, type RegistrationRole } from "./onboarding";
import { SESSION_COOKIE, signCookiePayload } from "./session-cookie";
import type { Role } from "./roles";
import { authService, type RegisterInput, type LoginInput } from "@/services/auth.service";
import { STORAGE_KEYS } from "@/lib/storage";

export type SessionClaims = {
  sub: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  org: string;
  iat: number;
  exp: number;
};

export type Session = {
  claims: SessionClaims;
  expiresAt: number;
  emailVerified: boolean;
  profileComplete: boolean;
  profileCompleted: boolean;
  requiresProfileSetup: boolean;
};

export type { LoginInput, RegisterInput };

export type OtpResponse = {
  ok: boolean;
  email: string;
  expiresAt: number;
  resendAvailableAt: number;
  message: string;
  devOtp?: string;
};

export type AuthResult = {
  ok: boolean;
  session: Session;
  nextPath: string;
};

const listeners = new Set<() => void>();
let current: Session | null = null;
let initialized = false;

const emit = () => listeners.forEach((l) => l());

export async function initSession() {
  if (initialized) return current;
  initialized = true;
  return loadSession();
}

export function getSession(): Session | null {
  return current;
}

export function useSession(): Session | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => null,
  );
}

export async function loadSession(): Promise<Session | null> {
  const restored = authService.getCurrentUser();
  if (restored) {
    current = restored;
    emit();
  }
  return current;
}

export async function signInWithCredentials(input: LoginInput): Promise<AuthResult> {
  try {
    const result = await authService.login(input);
    current = result.session;
    emit();
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    // Unverified user — redirect to OTP page
    if (message.startsWith("__UNVERIFIED__:")) {
      const [, email, devOtp] = message.split(":");
      throw Object.assign(new Error("Please verify your email before logging in."), { unverified: true, email, devOtp });
    }
    throw error;
  }
}

export async function registerAccount(input: RegisterInput): Promise<OtpResponse> {
  const result = await authService.register(input);
  return {
    ok: true,
    email: result.email,
    expiresAt: Math.floor(new Date(result.expiresAt).getTime() / 1000),
    resendAvailableAt: Math.floor(new Date(result.expiresAt).getTime() / 1000) - 4 * 60,
    message: "OTP generated.",
    devOtp: result.devOtp,
  };
}

export async function verifyEmailOtp(email: string, otp: string): Promise<AuthResult> {
  const result = await authService.verifyOtp(email, otp);
  current = result.session;
  emit();
  return result;
}

export async function resendEmailOtp(email: string): Promise<OtpResponse & { retryAfter?: number }> {
  const result = await authService.resendOtp(email);
  return {
    ok: true,
    email,
    expiresAt: Math.floor(new Date(result.expiresAt).getTime() / 1000),
    resendAvailableAt: Math.floor(Date.now() / 1000) + 60,
    message: "New OTP generated.",
    devOtp: result.devOtp,
  };
}

export async function completeProfileSetup(email: string, input: Record<string, unknown>): Promise<AuthResult> {
  const result = await authService.completeProfile(email, input);
  current = result.session;
  emit();
  return result;
}

export async function refreshSession(): Promise<Session | null> {
  const restored = authService.getCurrentUser();
  current = restored;
  emit();
  return current;
}

export async function beginGoogleAuth(_input: { intent: "login" | "register"; role?: RegistrationRole }) {
  // Google OAuth is not available without a backend.
  throw new Error("Google login is not available yet. Backend integration pending.");
}

export function signOut() {
  authService.logout();
  current = null;
  emit();
}

export async function signInAs(role: Role): Promise<{ redirectUrl: string }> {
  // Mock function for role selection during onboarding
  // In production, this would update the user's role on the backend
  const redirectUrl = ROLE_DASHBOARDS[role];
  return { redirectUrl };
}

// Keep signCookiePayload and SESSION_COOKIE re-exported for session-cookie usage
export { signCookiePayload, SESSION_COOKIE, STORAGE_KEYS };
