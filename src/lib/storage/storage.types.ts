import type { Role } from "@/lib/auth/roles";

// Auth
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "FARMER" | "WAREHOUSE_MANAGER" | "BUYER" | "DRIVER" | "GOVERNMENT" | "ADMIN";
  avatar?: string;
  profileCompleted: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Registered user stored in rscn_users
export interface RegisteredUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  verified: boolean;
  profileCompleted: boolean;
  createdAt: string;
}

// OTP record stored in rscn_otps
export interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: string;
}

// Products
export interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: "Crops" | "Livestock" | "Dairy" | "Fruits" | "Vegetables" | "Seeds";
  unit: "Kg" | "Ton" | "Bag" | "Liter" | "Box" | "Piece";
  price: number;
  status: "Available" | "Growing" | "Harvested" | "Out of Stock" | "Pending Approval";
  batchId?: string;
  quality: "Premium" | "Grade A" | "Grade B" | "Standard";
  quantity: number;
  description?: string;
  images: string[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

// Inventory
export interface InventoryItem {
  id: string;
  productId: string;
  farmerId?: string;
  warehouseId?: string;
  quantity: number;
  location?: string;
  status: "In Stock" | "Low Stock" | "Reserved" | "Sold";
  warehouseBatchId?: string;
  lastUpdated: string;
}

// Warehouse
export interface Warehouse {
  id: string;
  ownerId: string;
  name: string;
  type: "Cold Storage" | "Dry Storage" | "Agricultural Warehouse" | "Manufacturing Storage" | "Distribution Center";
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  capacity: number;
  availableSpace: number;
  conditions: string[];
  productsAllowed: string[];
  images: string[];
  status: "Active" | "Inactive" | "Maintenance";
  createdAt: string;
  updatedAt: string;
}

// Warehouse Batches
export interface WarehouseBatch {
  id: string;
  warehouseId: string;
  productId: string;
  farmerId: string;
  quantity: number;
  storageDate: string;
  expiryDate?: string;
  quality: "Premium" | "Grade A" | "Grade B" | "Standard";
  zone?: string;
  rackNumber?: string;
  status: "Stored" | "Reserved" | "Released";
}

// Orders
export interface Order {
  id: string;
  farmerId: string;
  buyerId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: "Request" | "Accepted" | "Processing" | "Transport" | "Delivered" | "Completed";
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Storage Requests
export interface StorageRequest {
  id: string;
  farmerId: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  duration: number; // days
  requestDate: string;
  status: "Pending" | "Accepted" | "Rejected" | "Active" | "Completed";
  price?: number;
}

// Reservations
export interface Reservation {
  id: string;
  warehouseId: string;
  customerId: string;
  product: string;
  quantity: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: "Pending" | "Confirmed" | "Active" | "Completed" | "Cancelled";
  totalPrice?: number;
}

// Transport
export interface TransportRequest {
  id: string;
  farmerId: string;
  pickupLocation: string;
  destination: string;
  productId: string;
  quantity: number;
  preferredDate: string;
  vehicleType: string;
  status: "Pending" | "Assigned" | "In Transit" | "Delivered" | "Completed";
  driverId?: string;
  estimatedCost?: number;
  createdAt: string;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "ORDER" | "TRANSPORT" | "WAREHOUSE" | "PRICE" | "SYSTEM";
  read: boolean;
  link?: string;
  createdAt: string;
}

// Messages
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderRole: string;
  receiverRole: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

// Market Prices
export interface MarketPrice {
  id: string;
  product: string;
  region: string;
  currentPrice: number;
  previousPrice: number;
  trend: "up" | "down" | "stable";
  unit: string;
  lastUpdated: string;
}

// Buyer
export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  location: string;
  rating: number;
  verified: boolean;
}

// Driver
export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  capacity: number;
  rating: number;
  location: string;
  available: boolean;
  costPerKm?: number;
}
