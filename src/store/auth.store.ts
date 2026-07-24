// Temporary localStorage authentication.
// Replace with backend API and JWT authentication before production.
import { create } from "zustand";
import { authService } from "@/services/auth.service";
import type { Session } from "@/lib/auth/session";

export type AuthState = {
  session: Session | null;
};

export const initialAuthState: AuthState = {
  session: null,
};

interface AuthStore {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  setSession: (session: Session) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password, remember = false) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.login({ email, password, remember });
      set({ session: result.session, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Login failed.", isLoading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ session: null, isAuthenticated: false, error: null });
  },

  setSession: (session) => set({ session, isAuthenticated: true }),
}));

export function initializeAuthStore() {
  const session = authService.getCurrentUser();
  if (session) {
    useAuthStore.setState({ session, isAuthenticated: true });
  }
}
