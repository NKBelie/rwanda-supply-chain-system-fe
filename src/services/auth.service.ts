// Temporary localStorage authentication.
// Replace with backend API and JWT authentication before production.

// Force load mock data immediately
import "@/lib/storage/force-init";

import { storageService, STORAGE_KEYS } from "@/lib/storage";
import type { RegisteredUser, OtpRecord } from "@/lib/storage";
import type { Role } from "@/lib/auth/roles";
import { ROLE_DASHBOARDS, hasCompletedProfile, type RegistrationRole } from "@/lib/auth/onboarding";
import type { Session } from "@/lib/auth/session";
import { signCookiePayload, SESSION_COOKIE } from "@/lib/auth/session-cookie";

const OTP_TTL_MS = 5 * 60 * 1000;

function generateOtp(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1_000_000).padStart(6, "0");
}

function generateId(): string {
  return `USR${Date.now().toString(36).toUpperCase()}`;
}

function generateToken(): string {
  return `jwt_${crypto.randomUUID().replaceAll("-", "")}`;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`rscn:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getUsers(): RegisteredUser[] {
  return storageService.get<RegisteredUser[]>(STORAGE_KEYS.USERS) ?? [];
}

function saveUsers(users: RegisteredUser[]): void {
  storageService.save(STORAGE_KEYS.USERS, users);
}

function getOtps(): OtpRecord[] {
  return storageService.get<OtpRecord[]>(STORAGE_KEYS.OTPS) ?? [];
}

function saveOtps(otps: OtpRecord[]): void {
  storageService.save(STORAGE_KEYS.OTPS, otps);
}

function buildSession(user: RegisteredUser, remember: boolean): Session {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24);
  const profileCompleted = hasCompletedProfile(user.role, user.profileCompleted);
  return {
    claims: {
      sub: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      role: user.role,
      org: "RSCN",
      iat: now,
      exp,
    },
    expiresAt: exp,
    emailVerified: user.verified,
    profileComplete: profileCompleted,
    profileCompleted,
    requiresProfileSetup: !profileCompleted,
  };
}

async function persistSession(session: Session, remember: boolean): Promise<void> {
  if (typeof window === "undefined") return;
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
  const token = generateToken();
  storage.setItem(STORAGE_KEYS.TOKEN, token);
  const cookiePayload = {
    claims: session.claims,
    expiresAt: session.expiresAt,
    emailVerified: session.emailVerified,
    profileComplete: session.profileComplete,
    profileCompleted: session.profileCompleted,
    refreshVersion: 1,
    remember,
  };
  const signed = await signCookiePayload(cookiePayload);
  document.cookie = `${SESSION_COOKIE}=${signed}; path=/; max-age=${remember ? 2592000 : 86400}; SameSite=Lax`;
}

export type RegisterInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: RegistrationRole;
  acceptedTerms: boolean;
};

export type RegisterResult = {
  ok: boolean;
  email: string;
  devOtp: string;
  expiresAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
  remember: boolean;
};

export type AuthResult = {
  ok: boolean;
  session: Session;
  nextPath: string;
};

export type OtpResult = {
  ok: boolean;
  devOtp: string;
  expiresAt: string;
};

export const authService = {
  async register(input: RegisterInput): Promise<RegisterResult> {
    const email = input.email.trim().toLowerCase();
    const phone = input.phone.trim();

    if (input.password !== input.confirmPassword) throw new Error("Passwords do not match.");
    if (input.password.length < 8) throw new Error("Password must be at least 8 characters.");
    if (!input.acceptedTerms) throw new Error("You must accept the Terms and Conditions.");

    const users = getUsers();
    if (users.some((u) => u.email === email)) throw new Error("An account with this email already exists.");
    if (users.some((u) => u.phone === phone)) throw new Error("An account with this phone number already exists.");

    const [firstName, ...rest] = input.fullName.trim().split(" ");
    const lastName = rest.join(" ") || firstName;
    const passwordHash = await hashPassword(input.password);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();

    const user: RegisteredUser = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      role: input.role as Role,
      verified: false,
      profileCompleted: false,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, user]);
    const otps = getOtps().filter((o) => o.email !== email);
    saveOtps([...otps, { email, otp, expiresAt }]);

    return { ok: true, email, devOtp: otp, expiresAt };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    const users = getUsers();
    
    // Auto-initialize mock data if no users exist
    if (users.length === 0 && typeof window !== "undefined") {
      const { initializeMockData } = await import("@/lib/storage/init-mock-data");
      initializeMockData(true);
      // Re-fetch users after initialization
      const updatedUsers = getUsers();
      const user = updatedUsers.find((u) => u.email === email);
      if (!user) throw new Error("No account found with this email address.");
      
      // For development: Accept mock passwords directly
      if (process.env.NODE_ENV === "development") {
        const mockPasswords: Record<string, string> = {
          "admin@rscn.rw": "Admin@2024",
          "jean.baptiste@farmer.rw": "Farmer@2024",
          "marie.claire@farmer.rw": "Farmer@2024",
          "patrick.n@driver.rw": "Driver@2024",
          "grace.m@warehouse.rw": "Warehouse@2024",
          "emmanuel.h@buyer.rw": "Buyer@2024",
          "sarah.u@farmer.rw": "Farmer@2024",
          "david.m@driver.rw": "Driver@2024",
          "agnes.i@government.rw": "Government@2024",
          "eric.m@warehouse.rw": "Warehouse@2024",
          "alice.k@buyer.rw": "Buyer@2024",
          "joseph.n@farmer.rw": "Farmer@2024",
          "claudine.u@farmer.rw": "Farmer@2024",
        };
        
        if (mockPasswords[email] && input.password === mockPasswords[email]) {
          // Auto-verify mock users
          if (!user.verified) {
            const userIndex = updatedUsers.findIndex((u) => u.email === email);
            updatedUsers[userIndex] = { ...updatedUsers[userIndex], verified: true };
            saveUsers(updatedUsers);
          }
          
          const session = buildSession(user, input.remember);
          await persistSession(session, input.remember);
          const nextPath = session.requiresProfileSetup ? "/auth/profile-setup" : ROLE_DASHBOARDS[user.role];
          return { ok: true, session, nextPath };
        }
      }
      
      // Fall through to regular password check
      const passwordHash = await hashPassword(input.password);
      if (passwordHash !== user.passwordHash) throw new Error("Invalid email or password.");
      
      const session = buildSession(user, input.remember);
      await persistSession(session, input.remember);
      const nextPath = session.requiresProfileSetup ? "/auth/profile-setup" : ROLE_DASHBOARDS[user.role];
      return { ok: true, session, nextPath };
    }
    
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error("No account found with this email address.");

    // For development: Accept mock passwords directly
    if (process.env.NODE_ENV === "development") {
      const mockPasswords: Record<string, string> = {
        "admin@rscn.rw": "Admin@2024",
        "jean.baptiste@farmer.rw": "Farmer@2024",
        "marie.claire@farmer.rw": "Farmer@2024",
        "patrick.n@driver.rw": "Driver@2024",
        "grace.m@warehouse.rw": "Warehouse@2024",
        "emmanuel.h@buyer.rw": "Buyer@2024",
        "sarah.u@farmer.rw": "Farmer@2024",
        "david.m@driver.rw": "Driver@2024",
        "agnes.i@government.rw": "Government@2024",
        "eric.m@warehouse.rw": "Warehouse@2024",
        "alice.k@buyer.rw": "Buyer@2024",
        "joseph.n@farmer.rw": "Farmer@2024",
        "claudine.u@farmer.rw": "Farmer@2024",
      };
      
      if (mockPasswords[email] && input.password === mockPasswords[email]) {
        // Auto-verify mock users
        if (!user.verified) {
          const userIndex = users.findIndex((u) => u.email === email);
          users[userIndex] = { ...users[userIndex], verified: true };
          saveUsers(users);
        }
        
        const session = buildSession(user, input.remember);
        await persistSession(session, input.remember);
        const nextPath = session.requiresProfileSetup ? "/auth/profile-setup" : ROLE_DASHBOARDS[user.role];
        return { ok: true, session, nextPath };
      }
    }

    const passwordHash = await hashPassword(input.password);
    if (passwordHash !== user.passwordHash) throw new Error("Invalid email or password.");

    if (!user.verified) {
      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
      const otps = getOtps().filter((o) => o.email !== email);
      saveOtps([...otps, { email, otp, expiresAt }]);
      throw new Error(`__UNVERIFIED__:${email}:${otp}`);
    }

    const session = buildSession(user, input.remember);
    await persistSession(session, input.remember);
    const nextPath = session.requiresProfileSetup ? "/auth/profile-setup" : ROLE_DASHBOARDS[user.role];
    return { ok: true, session, nextPath };
  },

  async verifyOtp(email: string, otp: string): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const otps = getOtps();
    const record = otps.find((o) => o.email === normalizedEmail);

    if (!record) throw new Error("No OTP found for this email. Please register or request a new code.");
    if (new Date(record.expiresAt) < new Date()) {
      saveOtps(otps.filter((o) => o.email !== normalizedEmail));
      throw new Error("OTP has expired. Please request a new code.");
    }
    if (record.otp !== otp.trim()) throw new Error("Invalid OTP. Please check the code and try again.");

    saveOtps(otps.filter((o) => o.email !== normalizedEmail));

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.email === normalizedEmail);
    if (userIndex === -1) throw new Error("Account not found. Please register again.");

    users[userIndex] = { ...users[userIndex], verified: true };
    saveUsers(users);

    const session = buildSession(users[userIndex], false);
    await persistSession(session, false);
    const nextPath = session.requiresProfileSetup ? "/auth/profile-setup" : ROLE_DASHBOARDS[users[userIndex].role];
    return { ok: true, session, nextPath };
  },

  async resendOtp(email: string): Promise<OtpResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    if (!users.some((u) => u.email === normalizedEmail)) throw new Error("No account found for this email.");

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
    const otps = getOtps().filter((o) => o.email !== normalizedEmail);
    saveOtps([...otps, { email: normalizedEmail, otp, expiresAt }]);
    return { ok: true, devOtp: otp, expiresAt };
  },

  getCurrentUser(): Session | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) ?? sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw) as Session;
      if (!session?.claims?.email) return null;
      if (session.expiresAt <= Math.floor(Date.now() / 1000)) {
        authService.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  logout(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  },

  async completeProfile(email: string, profileData: Record<string, unknown>): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.email === normalizedEmail);
    if (userIndex === -1) throw new Error("Account not found.");

    users[userIndex] = { ...users[userIndex], profileCompleted: true };
    saveUsers(users);

    const session = buildSession(users[userIndex], false);
    const updatedSession = { ...session, profileComplete: true, profileCompleted: true, requiresProfileSetup: false };
    await persistSession(updatedSession, false);

    void profileData;
    return { ok: true, session: updatedSession, nextPath: ROLE_DASHBOARDS[users[userIndex].role] };
  },

  updateProfile(updates: Partial<Session["claims"]>): Session | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) ?? sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw) as Session;
      const updated = { ...session, claims: { ...session.claims, ...updates } };
      const storage = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
      return updated;
    } catch {
      return null;
    }
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Mock Google Sign-In for Development
// ──────────────────────────────────────────────────────────────────────────────

export type GoogleSignInResult = {
  success: boolean;
  redirectUrl: string;
  session?: Session;
};

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In development, auto-login as admin for testing
  if (process.env.NODE_ENV === "development") {
    const users = getUsers();
    
    // Auto-initialize mock data if no users exist
    if (users.length === 0 && typeof window !== "undefined") {
      const { initializeMockData } = await import("@/lib/storage/init-mock-data");
      initializeMockData(true);
    }
    
    // Use admin account for mock Google login
    const adminUser = getUsers().find(u => u.email === "admin@rscn.rw");
    
    if (!adminUser) {
      throw new Error("Mock data not loaded. Please refresh the page.");
    }
    
    // Auto-verify admin user if not already verified
    if (!adminUser.verified) {
      const allUsers = getUsers();
      const userIndex = allUsers.findIndex(u => u.email === "admin@rscn.rw");
      allUsers[userIndex] = { ...allUsers[userIndex], verified: true };
      saveUsers(allUsers);
    }
    
    // Create session
    const session = buildSession(adminUser, true);
    await persistSession(session, true);
    
    const redirectUrl = session.requiresProfileSetup 
      ? "/auth/profile-setup" 
      : ROLE_DASHBOARDS[adminUser.role];
    
    return {
      success: true,
      redirectUrl,
      session,
    };
  }
  
  // In production, this would redirect to actual Google OAuth
  throw new Error("Google OAuth not configured. Please contact your administrator.");
}

// Helper function for the login page
export async function signInWithCredentials(input: LoginInput): Promise<AuthResult> {
  return authService.login(input);
}
