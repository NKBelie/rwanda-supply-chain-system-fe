import { create } from "zustand";
import { Warehouse, WarehouseBatch, StorageRequest, Reservation } from "@/lib/storage";
import { storageService, STORAGE_KEYS } from "@/lib/storage";

interface WarehouseStore {
  warehouses: Warehouse[];
  batches: WarehouseBatch[];
  storageRequests: StorageRequest[];
  reservations: Reservation[];
  isLoading: boolean;

  // Warehouse operations
  fetchWarehouses: (ownerId?: string) => void;
  addWarehouse: (warehouse: Warehouse) => void;
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  getWarehouseById: (id: string) => Warehouse | undefined;

  // Batch operations
  fetchBatches: (warehouseId?: string) => void;
  addBatch: (batch: WarehouseBatch) => void;
  updateBatch: (id: string, updates: Partial<WarehouseBatch>) => void;
  getBatchesForWarehouse: (warehouseId: string) => WarehouseBatch[];

  // Storage request operations
  fetchStorageRequests: (warehouseId?: string) => void;
  addStorageRequest: (request: StorageRequest) => void;
  updateStorageRequest: (id: string, updates: Partial<StorageRequest>) => void;

  // Reservation operations
  fetchReservations: (warehouseId?: string) => void;
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;

  // Analytics
  getCapacityUtilization: (warehouseId: string) => number;
}

export const useWarehouseStore = create<WarehouseStore>((set, get) => ({
  warehouses: [],
  batches: [],
  storageRequests: [],
  reservations: [],
  isLoading: false,

  // Warehouse operations
  fetchWarehouses: (ownerId?: string) => {
    set({ isLoading: true });
    let warehouses = storageService.get<Warehouse[]>(STORAGE_KEYS.WAREHOUSES) || [];
    if (ownerId) {
      warehouses = warehouses.filter((w) => w.ownerId === ownerId);
    }
    set({ warehouses, isLoading: false });
  },

  addWarehouse: (warehouse: Warehouse) => {
    const updated = storageService.addToArray(STORAGE_KEYS.WAREHOUSES, warehouse);
    set({ warehouses: updated });
  },

  updateWarehouse: (id: string, updates: Partial<Warehouse>) => {
    const updated = storageService.updateInArray(STORAGE_KEYS.WAREHOUSES, id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    set({ warehouses: updated });
  },

  deleteWarehouse: (id: string) => {
    const updated = storageService.removeFromArray<Warehouse>(STORAGE_KEYS.WAREHOUSES, id);
    set({ warehouses: updated as Warehouse[] });
  },

  getWarehouseById: (id: string) => {
    return get().warehouses.find((w) => w.id === id);
  },

  // Batch operations
  fetchBatches: (warehouseId?: string) => {
    let batches = storageService.get<WarehouseBatch[]>(STORAGE_KEYS.WAREHOUSE_BATCHES) || [];
    if (warehouseId) {
      batches = batches.filter((b) => b.warehouseId === warehouseId);
    }
    set({ batches });
  },

  addBatch: (batch: WarehouseBatch) => {
    const updated = storageService.addToArray(STORAGE_KEYS.WAREHOUSE_BATCHES, batch);
    set({ batches: updated });
  },

  updateBatch: (id: string, updates: Partial<WarehouseBatch>) => {
    const updated = storageService.updateInArray(STORAGE_KEYS.WAREHOUSE_BATCHES, id, updates);
    set({ batches: updated });
  },

  getBatchesForWarehouse: (warehouseId: string) => {
    return get().batches.filter((b) => b.warehouseId === warehouseId);
  },

  // Storage request operations
  fetchStorageRequests: (warehouseId?: string) => {
    let requests = storageService.get<StorageRequest[]>(STORAGE_KEYS.STORAGE_REQUESTS) || [];
    if (warehouseId) {
      requests = requests.filter((r) => r.warehouseId === warehouseId);
    }
    set({ storageRequests: requests });
  },

  addStorageRequest: (request: StorageRequest) => {
    const updated = storageService.addToArray(STORAGE_KEYS.STORAGE_REQUESTS, request);
    set({ storageRequests: updated });
  },

  updateStorageRequest: (id: string, updates: Partial<StorageRequest>) => {
    const updated = storageService.updateInArray(STORAGE_KEYS.STORAGE_REQUESTS, id, updates);
    set({ storageRequests: updated });
  },

  // Reservation operations
  fetchReservations: (warehouseId?: string) => {
    let reservations = storageService.get<Reservation[]>(STORAGE_KEYS.RESERVATIONS) || [];
    if (warehouseId) {
      reservations = reservations.filter((r) => r.warehouseId === warehouseId);
    }
    set({ reservations });
  },

  addReservation: (reservation: Reservation) => {
    const updated = storageService.addToArray(STORAGE_KEYS.RESERVATIONS, reservation);
    set({ reservations: updated });
  },

  updateReservation: (id: string, updates: Partial<Reservation>) => {
    const updated = storageService.updateInArray(STORAGE_KEYS.RESERVATIONS, id, updates);
    set({ reservations: updated });
  },

  // Analytics
  getCapacityUtilization: (warehouseId: string) => {
    const warehouse = get().getWarehouseById(warehouseId);
    if (!warehouse) return 0;
    const used = warehouse.capacity - warehouse.availableSpace;
    return (used / warehouse.capacity) * 100;
  },
}));
