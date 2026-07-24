import { create } from "zustand";
import { Message } from "@/lib/storage";
import { storageService, STORAGE_KEYS } from "@/lib/storage";

interface MessageStore {
  messages: Message[];
  isLoading: boolean;
  
  fetchMessages: (userId: string) => void;
  fetchConversation: (userId: string, partnerId: string) => Message[];
  addMessage: (message: Message) => void;
  markAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  getConversationPartners: (userId: string) => Array<{ id: string; name: string }>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  isLoading: false,

  fetchMessages: (userId: string) => {
    set({ isLoading: true });
    const messages = storageService.filterArray<Message>(
      STORAGE_KEYS.MESSAGES,
      (m) => m.senderId === userId || m.receiverId === userId
    );
    set({ messages, isLoading: false });
  },

  fetchConversation: (userId: string, partnerId: string) => {
    return get().messages.filter(
      (m) =>
        (m.senderId === userId && m.receiverId === partnerId) ||
        (m.senderId === partnerId && m.receiverId === userId)
    );
  },

  addMessage: (message: Message) => {
    const updated = storageService.addToArray(STORAGE_KEYS.MESSAGES, message);
    set({ messages: updated });
  },

  markAsRead: (id: string) => {
    const updated = storageService.updateInArray<Message>(STORAGE_KEYS.MESSAGES, id, {
      read: true,
    });
    set({ messages: updated as Message[] });
  },

  deleteMessage: (id: string) => {
    const updated = storageService.removeFromArray<Message>(STORAGE_KEYS.MESSAGES, id);
    set({ messages: updated as Message[] });
  },

  getUnreadCount: (userId: string) => {
    return get().messages.filter((m) => m.receiverId === userId && !m.read).length;
  },

  getConversationPartners: (userId: string) => {
    const messages = get().messages;
    const partners = new Map<string, string>();

    messages.forEach((m) => {
      if (m.senderId === userId && !partners.has(m.receiverId)) {
        partners.set(m.receiverId, m.receiverRole);
      } else if (m.receiverId === userId && !partners.has(m.senderId)) {
        partners.set(m.senderId, m.senderRole);
      }
    });

    return Array.from(partners.entries()).map(([id, role]) => ({
      id,
      name: role,
    }));
  },
}));
