import { create } from "zustand";
import { Order } from "@/lib/storage";
import { storageService, STORAGE_KEYS } from "@/lib/storage";

interface OrderStore {
  orders: Order[];
  isLoading: boolean;

  fetchOrders: (farmerId?: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: string) => Order[];
  getOrdersByFarmer: (farmerId: string) => Order[];
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,

  fetchOrders: (farmerId?: string) => {
    set({ isLoading: true });
    try {
      let orders = storageService.get<Order[]>(STORAGE_KEYS.FARMER_ORDERS) || [];

      if (farmerId) {
        orders = orders.filter((o) => o.farmerId === farmerId);
      }

      set({ orders, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addOrder: (order: Order) => {
    try {
      const updated = storageService.addToArray(STORAGE_KEYS.FARMER_ORDERS, order);
      set({ orders: updated });
    } catch (error) {
      console.error("Failed to add order:", error);
    }
  },

  updateOrder: (id: string, updates: Partial<Order>) => {
    try {
      const updated = storageService.updateInArray(STORAGE_KEYS.FARMER_ORDERS, id, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      set({ orders: updated });
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  },

  deleteOrder: (id: string) => {
    try {
      const updated = storageService.removeFromArray(STORAGE_KEYS.FARMER_ORDERS, id);
      set({ orders: updated });
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  },

  getOrderById: (id: string) => {
    return get().orders.find((o) => o.id === id);
  },

  getOrdersByStatus: (status: string) => {
    return get().orders.filter((o) => o.status === status);
  },

  getOrdersByFarmer: (farmerId: string) => {
    return get().orders.filter((o) => o.farmerId === farmerId);
  },
}));
