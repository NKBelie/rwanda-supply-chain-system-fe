/**
 * Force initialize mock data immediately
 * Import this at the top of any file to ensure data is loaded
 */

import { storageService, STORAGE_KEYS } from "./index";
import { MOCK_DATA } from "./mock-data";

// Check if running in browser
if (typeof window !== "undefined") {
  // Check if data exists
  const existingUsers = storageService.get(STORAGE_KEYS.USERS);
  
  if (!existingUsers || existingUsers.length === 0) {
    console.log("🔧 Force loading mock data...");
    
    // Load all data immediately
    storageService.save(STORAGE_KEYS.USERS, MOCK_DATA.users);
    storageService.save(STORAGE_KEYS.PRODUCTS, MOCK_DATA.products);
    storageService.save(STORAGE_KEYS.WAREHOUSES, MOCK_DATA.warehouses);
    storageService.save(STORAGE_KEYS.WAREHOUSE_BATCHES, MOCK_DATA.warehouseBatches);
    storageService.save(STORAGE_KEYS.FARMER_ORDERS, MOCK_DATA.orders);
    storageService.save(STORAGE_KEYS.STORAGE_REQUESTS, MOCK_DATA.storageRequests);
    storageService.save(STORAGE_KEYS.RESERVATIONS, MOCK_DATA.reservations);
    storageService.save(STORAGE_KEYS.TRANSPORT_REQUESTS, MOCK_DATA.transportRequests);
    
    console.log("✅ Mock data force loaded!");
    console.log(`   - ${MOCK_DATA.users.length} users (including admin@rscn.rw)`);
    
    // Verify admin exists
    const users = storageService.get(STORAGE_KEYS.USERS);
    const admin = users?.find((u: any) => u.email === "admin@rscn.rw");
    console.log("   - Admin account:", admin ? "✅ Found" : "❌ Not found");
  } else {
    console.log("ℹ️ Mock data already loaded:", existingUsers.length, "users");
  }
}

export {}; // Make it a module
