import { storageService, STORAGE_KEYS } from "@/lib/storage";
import {
  MOCK_USERS,
  MOCK_PRODUCTS,
  MOCK_WAREHOUSES,
  MOCK_BUYERS,
  MOCK_DRIVERS,
  MOCK_MARKET_PRICES,
  MOCK_NOTIFICATIONS,
} from "./data";

export function initializeMockData() {
  if (typeof window === "undefined") return;

  // Only seed if data doesn't exist
  const existingUser = storageService.get(STORAGE_KEYS.USER);
  if (existingUser) return;

  // Seed users
  storageService.save(STORAGE_KEYS.USER, MOCK_USERS.farmer);
  storageService.save(STORAGE_KEYS.TOKEN, "mock_token_" + Math.random().toString(36).substr(2, 9));

  // Seed products
  storageService.save(STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);

  // Seed warehouses
  storageService.save(STORAGE_KEYS.WAREHOUSES, MOCK_WAREHOUSES);

  // Seed buyers
  storageService.save(STORAGE_KEYS.BUYERS, MOCK_BUYERS);

  // Seed drivers
  storageService.save(STORAGE_KEYS.DRIVERS, MOCK_DRIVERS);

  // Seed market prices
  storageService.save(STORAGE_KEYS.MARKET_PRICES, MOCK_MARKET_PRICES);

  // Seed notifications
  storageService.save(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);

  // Initialize empty arrays
  storageService.save(STORAGE_KEYS.INVENTORY, []);
  storageService.save(STORAGE_KEYS.FARMER_ORDERS, []);
  storageService.save(STORAGE_KEYS.FARMER_BATCHES, []);
  storageService.save(STORAGE_KEYS.TRANSPORT_REQUESTS, []);
  storageService.save(STORAGE_KEYS.STORAGE_REQUESTS, []);
  storageService.save(STORAGE_KEYS.RESERVATIONS, []);
  storageService.save(STORAGE_KEYS.WAREHOUSE_PRODUCTS, []);
  storageService.save(STORAGE_KEYS.WAREHOUSE_BATCHES, []);
  storageService.save(STORAGE_KEYS.MESSAGES, []);
}

/**
 * Reset all RSCN data - useful for development
 */
export function resetAllData() {
  if (typeof window === "undefined") return;
  storageService.clearAll();
  console.log("All RSCN data has been cleared");
}

/**
 * Log all RSCN data to console - useful for debugging
 */
export function logAllData() {
  if (typeof window === "undefined") return;
  const data = storageService.getAllRscnData();
  console.table(data);
  return data;
}
