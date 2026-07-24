export const STORAGE_KEYS = {
  // Auth
  USER: "rscn_user",
  TOKEN: "rscn_token",
  AUTH_STATE: "rscn_auth_state",
  USERS: "rscn_users",
  OTPS: "rscn_otps",
  CURRENT_USER: "rscn_current_user",

  // Farmer Data
  PRODUCTS: "rscn_products",
  INVENTORY: "rscn_inventory",
  FARMER_ORDERS: "rscn_farmer_orders",
  FARMER_BATCHES: "rscn_farmer_batches",
  TRANSPORT_REQUESTS: "rscn_transport_requests",

  // Warehouse Data
  WAREHOUSES: "rscn_warehouses",
  WAREHOUSE_PRODUCTS: "rscn_warehouse_products",
  STORAGE_REQUESTS: "rscn_storage_requests",
  RESERVATIONS: "rscn_reservations",
  WAREHOUSE_BATCHES: "rscn_warehouse_batches",

  // Shared
  NOTIFICATIONS: "rscn_notifications",
  MESSAGES: "rscn_messages",
  BUYERS: "rscn_buyers",
  DRIVERS: "rscn_drivers",
  MARKET_PRICES: "rscn_market_prices",

  // App
  THEME: "rscn_theme",
  LANGUAGE: "rscn_language",
} as const;
