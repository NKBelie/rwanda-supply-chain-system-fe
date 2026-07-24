'use client';

import { useEffect } from 'react';
import { useAuthStore, initializeAuthStore } from '@/store/auth.store';
import { useNotificationStore } from '@/store/notification.store';
import { commsStore } from '@/lib/comms-store';

export function useAppInitialize() {
  useEffect(() => {
    initializeAuthStore();
  }, []);
}

export function useAuth() {
  const { session, isAuthenticated, isLoading, error, login, logout } = useAuthStore();
  const claims = session?.claims;

  return {
    user: claims
      ? {
          id: claims.sub,
          name: claims.name,
          email: claims.email,
          role: claims.role,
        }
      : null,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}

export function useNotifications() {
  const store = useNotificationStore();
  const { session } = useAuthStore();

  useEffect(() => {
    if (session?.claims.sub) {
      store.fetchNotifications(session.claims.sub);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.claims.sub]);

  return {
    ...store,
    getUnreadCount: (_userId: string) =>
      store.notifications.filter((n) => !n.read).length,
  };
}

export function useMessages() {
  const threads = commsStore.getState().threads;

  return {
    getUnreadCount: (_userId: string) =>
      threads.reduce((sum, t) => sum + t.unread, 0),
  };
}
