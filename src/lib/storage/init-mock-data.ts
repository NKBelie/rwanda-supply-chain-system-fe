/**
 * Initialize Mock Data
 * 
 * This script populates localStorage with comprehensive mock data
 * for testing and development purposes.
 * 
 * Run this once to populate the database with realistic test data.
 */

import { storageService, STORAGE_KEYS } from "./index";
import { MOCK_DATA } from "./mock-data";

export function initializeMockData(force: boolean = false): void {
  // Check if data already exists
  const existingUsers = storageService.get(STORAGE_KEYS.USERS);
  
  if (existingUsers && existingUsers.length > 0 && !force) {
    console.log("Mock data already initialized. Use force=true to reinitialize.");
    return;
  }

  console.log("Initializing mock data...");

  // Initialize all data
  storageService.save(STORAGE_KEYS.USERS, MOCK_DATA.users);
  storageService.save(STORAGE_KEYS.PRODUCTS, MOCK_DATA.products);
  storageService.save(STORAGE_KEYS.WAREHOUSES, MOCK_DATA.warehouses);
  storageService.save(STORAGE_KEYS.WAREHOUSE_BATCHES, MOCK_DATA.warehouseBatches);
  storageService.save(STORAGE_KEYS.FARMER_ORDERS, MOCK_DATA.orders);
  storageService.save(STORAGE_KEYS.STORAGE_REQUESTS, MOCK_DATA.storageRequests);
  storageService.save(STORAGE_KEYS.RESERVATIONS, MOCK_DATA.reservations);
  storageService.save(STORAGE_KEYS.TRANSPORT_REQUESTS, MOCK_DATA.transportRequests);

  console.log("✅ Mock data initialized successfully!");
  console.log(`   - ${MOCK_DATA.users.length} users`);
  console.log(`   - ${MOCK_DATA.products.length} products`);
  console.log(`   - ${MOCK_DATA.warehouses.length} warehouses`);
  console.log(`   - ${MOCK_DATA.warehouseBatches.length} warehouse batches`);
  console.log(`   - ${MOCK_DATA.orders.length} orders`);
  console.log(`   - ${MOCK_DATA.storageRequests.length} storage requests`);
  console.log(`   - ${MOCK_DATA.reservations.length} reservations`);
  console.log(`   - ${MOCK_DATA.transportRequests.length} transport requests`);
}

// Auto-initialize on import in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Check if we should auto-initialize
  const existingUsers = storageService.get(STORAGE_KEYS.USERS);
  if (!existingUsers || existingUsers.length === 0) {
    console.log("🚀 Auto-initializing mock data...");
    initializeMockData();
  }
}
