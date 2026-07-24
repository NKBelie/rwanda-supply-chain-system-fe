import { create } from "zustand";
import type { Notification } from "@/lib/comms-store";
import { commsStore } from "@/lib/comms-store";

// Re-export for consumers that import Notification from here
export type { Notification };

export type NotificationState = {
  notifications: Notification[];
};

export const initialNotificationState: NotificationState = {
  notifications: [],
};

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  fetchNotifications: (userId: string) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: (_userId: string) => {
    set({ isLoading: true });
    const notifications = commsStore.getState().notifications;
    set({ notifications, isLoading: false });
  },

  addNotification: (notification: Notification) => {
    set((s) => ({ notifications: [...s.notifications, notification] }));
  },

  markAsRead: (id: string) => {
    commsStore.markRead(id);
    set((s) => ({
      notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    }));
  },

  markAllAsRead: (_userId: string) => {
    commsStore.markAllRead();
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },

  deleteNotification: (id: string) => {
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
  },

  getUnreadCount: (_userId: string) => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
