// Temporary localStorage service layer.
// Replace with backend API calls before production.
import { storageService, STORAGE_KEYS } from "@/lib/storage";
import type {
  Product, Warehouse, WarehouseBatch, Order,
  StorageRequest, Reservation, TransportRequest, InventoryItem,
  RegisteredUser,} from "@/lib/storage";

// ─── helpers ────────────────────────────────────────────────────────────────

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function now() { return new Date().toISOString(); }

function list<T>(key: string): T[] {
  return storageService.get<T[]>(key) ?? [];
}

function save<T>(key: string, items: T[]): void {
  storageService.save(key, items);
}

// ─── Users ───────────────────────────────────────────────────────────────────

export const userService = {
  getAll(): RegisteredUser[] { return list<RegisteredUser>(STORAGE_KEYS.USERS); },
  getById(id: string): RegisteredUser | null {
    return this.getAll().find(u => u.id === id) ?? null;
  },
  getUserName(id: string): string {
    const user = this.getById(id);
    if (!user) return id;
    return `${user.firstName} ${user.lastName}`.trim();
  },
  getUsersByRole(role: RegisteredUser["role"]): RegisteredUser[] {
    return this.getAll().filter(u => u.role === role);
  },
};

// ─── Products ────────────────────────────────────────────────────────────────

export const productService = {
  getAll(): Product[] { return list<Product>(STORAGE_KEYS.PRODUCTS); },
  getByFarmer(farmerId: string): Product[] {
    return this.getAll().filter(p => p.farmerId === farmerId);
  },
  getById(id: string): Product | null {
    return this.getAll().find(p => p.id === id) ?? null;
  },
  create(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
    const product: Product = { ...data, id: uid("PRD"), createdAt: now(), updatedAt: now() };
    const all = this.getAll();
    save(STORAGE_KEYS.PRODUCTS, [...all, product]);
    return product;
  },
  update(id: string, data: Partial<Product>): Product | null {
    const all = this.getAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data, updatedAt: now() };
    save(STORAGE_KEYS.PRODUCTS, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(p => p.id !== id);
    if (filtered.length === all.length) return false;
    save(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },
};

// ─── Warehouses ──────────────────────────────────────────────────────────────

export const warehouseService = {
  getAll(): Warehouse[] { return list<Warehouse>(STORAGE_KEYS.WAREHOUSES); },
  getByOwner(ownerId: string): Warehouse[] {
    return this.getAll().filter(w => w.ownerId === ownerId);
  },
  getById(id: string): Warehouse | null {
    return this.getAll().find(w => w.id === id) ?? null;
  },
  create(data: Omit<Warehouse, "id" | "createdAt" | "updatedAt">): Warehouse {
    const wh: Warehouse = { ...data, id: uid("WH"), createdAt: now(), updatedAt: now() };
    save(STORAGE_KEYS.WAREHOUSES, [...this.getAll(), wh]);
    return wh;
  },
  update(id: string, data: Partial<Warehouse>): Warehouse | null {
    const all = this.getAll();
    const idx = all.findIndex(w => w.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data, updatedAt: now() };
    save(STORAGE_KEYS.WAREHOUSES, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(w => w.id !== id);
    if (filtered.length === all.length) return false;
    save(STORAGE_KEYS.WAREHOUSES, filtered);
    return true;
  },
  adjustSpace(id: string, delta: number): void {
    const wh = this.getById(id);
    if (!wh) return;
    this.update(id, { availableSpace: Math.max(0, wh.availableSpace + delta) });
  },
};

// ─── Batches ─────────────────────────────────────────────────────────────────

export const batchService = {
  getAll(): WarehouseBatch[] { return list<WarehouseBatch>(STORAGE_KEYS.WAREHOUSE_BATCHES); },
  getByWarehouse(warehouseId: string): WarehouseBatch[] {
    return this.getAll().filter(b => b.warehouseId === warehouseId);
  },
  getByFarmer(farmerId: string): WarehouseBatch[] {
    return this.getAll().filter(b => b.farmerId === farmerId);
  },
  getById(id: string): WarehouseBatch | null {
    return this.getAll().find(b => b.id === id) ?? null;
  },
  create(data: Omit<WarehouseBatch, "id">): WarehouseBatch {
    const batch: WarehouseBatch = { ...data, id: uid("BTH") };
    save(STORAGE_KEYS.WAREHOUSE_BATCHES, [...this.getAll(), batch]);
    warehouseService.adjustSpace(data.warehouseId, -data.quantity);
    return batch;
  },
  update(id: string, data: Partial<WarehouseBatch>): WarehouseBatch | null {
    const all = this.getAll();
    const idx = all.findIndex(b => b.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    save(STORAGE_KEYS.WAREHOUSE_BATCHES, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const batch = all.find(b => b.id === id);
    if (!batch) return false;
    save(STORAGE_KEYS.WAREHOUSE_BATCHES, all.filter(b => b.id !== id));
    warehouseService.adjustSpace(batch.warehouseId, batch.quantity);
    return true;
  },
  release(id: string): boolean {
    const batch = this.getById(id);
    if (!batch) return false;
    this.update(id, { status: "Released" });
    warehouseService.adjustSpace(batch.warehouseId, batch.quantity);
    return true;
  },
};

// ─── Inventory ───────────────────────────────────────────────────────────────

export const inventoryService = {
  getAll(): InventoryItem[] { return list<InventoryItem>(STORAGE_KEYS.INVENTORY); },
  getByFarmer(farmerId: string): InventoryItem[] {
    return this.getAll().filter(i => i.farmerId === farmerId);
  },
  getByWarehouse(warehouseId: string): InventoryItem[] {
    return this.getAll().filter(i => i.warehouseId === warehouseId);
  },
  upsert(data: Omit<InventoryItem, "id" | "lastUpdated"> & { id?: string }): InventoryItem {
    const all = this.getAll();
    const existing = data.id ? all.find(i => i.id === data.id) : null;
    if (existing) {
      const idx = all.findIndex(i => i.id === data.id);
      all[idx] = { ...existing, ...data, lastUpdated: now() };
      save(STORAGE_KEYS.INVENTORY, all);
      return all[idx];
    }
    const item: InventoryItem = { ...data, id: uid("INV"), lastUpdated: now() };
    save(STORAGE_KEYS.INVENTORY, [...all, item]);
    return item;
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(i => i.id !== id);
    if (filtered.length === all.length) return false;
    save(STORAGE_KEYS.INVENTORY, filtered);
    return true;
  },
};

// ─── Orders ──────────────────────────────────────────────────────────────────

export const orderService = {
  getAll(): Order[] { return list<Order>(STORAGE_KEYS.FARMER_ORDERS); },
  getByFarmer(farmerId: string): Order[] {
    return this.getAll().filter(o => o.farmerId === farmerId);
  },
  getById(id: string): Order | null {
    return this.getAll().find(o => o.id === id) ?? null;
  },
  create(data: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
    const order: Order = { ...data, id: uid("ORD"), createdAt: now(), updatedAt: now() };
    save(STORAGE_KEYS.FARMER_ORDERS, [...this.getAll(), order]);
    return order;
  },
  updateStatus(id: string, status: Order["status"]): Order | null {
    const all = this.getAll();
    const idx = all.findIndex(o => o.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], status, updatedAt: now() };
    save(STORAGE_KEYS.FARMER_ORDERS, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(o => o.id !== id);
    if (filtered.length === all.length) return false;
    save(STORAGE_KEYS.FARMER_ORDERS, filtered);
    return true;
  },
};

// ─── Transport Requests ───────────────────────────────────────────────────────

export const transportService = {
  getAll(): TransportRequest[] { return list<TransportRequest>(STORAGE_KEYS.TRANSPORT_REQUESTS); },
  getByFarmer(farmerId: string): TransportRequest[] {
    return this.getAll().filter(t => t.farmerId === farmerId);
  },
  getById(id: string): TransportRequest | null {
    return this.getAll().find(t => t.id === id) ?? null;
  },
  create(data: Omit<TransportRequest, "id" | "createdAt">): TransportRequest {
    const req: TransportRequest = { ...data, id: uid("TRP"), createdAt: now() };
    save(STORAGE_KEYS.TRANSPORT_REQUESTS, [...this.getAll(), req]);
    return req;
  },
  update(id: string, data: Partial<TransportRequest>): TransportRequest | null {
    const all = this.getAll();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    save(STORAGE_KEYS.TRANSPORT_REQUESTS, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(t => t.id !== id);
    if (filtered.length === all.length) return false;
    save(STORAGE_KEYS.TRANSPORT_REQUESTS, filtered);
    return true;
  },
};

// ─── Storage Requests ─────────────────────────────────────────────────────────

export const storageRequestService = {
  getAll(): StorageRequest[] { return list<StorageRequest>(STORAGE_KEYS.STORAGE_REQUESTS); },
  getByFarmer(farmerId: string): StorageRequest[] {
    return this.getAll().filter(r => r.farmerId === farmerId);
  },
  getByWarehouse(warehouseId: string): StorageRequest[] {
    return this.getAll().filter(r => r.warehouseId === warehouseId);
  },
  getById(id: string): StorageRequest | null {
    return this.getAll().find(r => r.id === id) ?? null;
  },
  create(data: Omit<StorageRequest, "id">): StorageRequest {
    const req: StorageRequest = { ...data, id: uid("SRQ") };
    save(STORAGE_KEYS.STORAGE_REQUESTS, [...this.getAll(), req]);
    return req;
  },
  updateStatus(id: string, status: StorageRequest["status"]): StorageRequest | null {
    const all = this.getAll();
    const idx = all.findIndex(r => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], status };
    save(STORAGE_KEYS.STORAGE_REQUESTS, all);
    if (status === "Accepted") {
      const req = all[idx];
      batchService.create({
        warehouseId: req.warehouseId,
        productId: req.productId,
        farmerId: req.farmerId,
        quantity: req.quantity,
        storageDate: now(),
        quality: "Grade A",
        status: "Stored",
      });
    }
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(r => r.id !== id);
    if (filtered.length === all.length) return false;
    save(STORAGE_KEYS.STORAGE_REQUESTS, filtered);
    return true;
  },
};

// ─── Reservations ─────────────────────────────────────────────────────────────

export const reservationService = {
  getAll(): Reservation[] { return list<Reservation>(STORAGE_KEYS.RESERVATIONS); },
  getByWarehouse(warehouseId: string): Reservation[] {
    return this.getAll().filter(r => r.warehouseId === warehouseId);
  },
  getById(id: string): Reservation | null {
    return this.getAll().find(r => r.id === id) ?? null;
  },
  create(data: Omit<Reservation, "id">): Reservation {
    const res: Reservation = { ...data, id: uid("RSV") };
    save(STORAGE_KEYS.RESERVATIONS, [...this.getAll(), res]);
    return res;
  },
  update(id: string, data: Partial<Reservation>): Reservation | null {
    const all = this.getAll();
    const idx = all.findIndex(r => r.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    save(STORAGE_KEYS.RESERVATIONS, all);
    return all[idx];
  },
  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(r => r.id !== id);
    if (filtered.length === all.length) return false;
    save(STORAGE_KEYS.RESERVATIONS, filtered);
    return true;
  },
};
