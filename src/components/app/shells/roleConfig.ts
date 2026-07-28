import {
  LayoutDashboard, Package, Boxes, Store, ShoppingCart, Warehouse, Truck,
  ClipboardList, CreditCard, BarChart3, FileText, Bell, Users, Settings,
  LifeBuoy, Shield, Landmark, Sprout, Factory, User as UserIcon,
  Leaf, MapPin, Route as RouteIcon, Wrench, Fuel, Award, Heart, MessageSquare,
  Search, Star, PackageCheck, PackageOpen, CircleDollarSign, ShieldCheck,
  Building2, Handshake, FileSignature, ScrollText, Activity, Database,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Role } from "@/lib/auth/roles";
import { Permission } from "@/lib/auth/permissions";

export type NavItem = {
  slug: string;      // "" = index, else sub-module (matches splat)
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  perm?: Permission;
  group?: string;
};

export type QuickAction = { label: string; slug: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

export type RoleConfig = {
  brandLabel: string;
  nav: NavItem[];
  quickActions: QuickAction[];
  searchScope: string;
};

const dash = (label = "Dashboard"): NavItem => ({ slug: "dashboard", label, icon: LayoutDashboard });

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  super_admin: {
    brandLabel: "Platform Admin",
    searchScope: "users, accounts, logs…",
    nav: [
      dash(),
      { slug: "users", label: "Users", icon: Users, perm: "users:manage" },
      { slug: "government-accounts", label: "Government Accounts", icon: Landmark, perm: "users:manage" },
      { slug: "roles", label: "Roles & Permissions", icon: Shield, perm: "roles:manage" },
      { slug: "analytics", label: "System Analytics", icon: BarChart3, perm: "analytics:view" },
      { slug: "reports", label: "Reports", icon: FileText, perm: "reports:view" },
      { slug: "audit", label: "Audit Logs", icon: ScrollText, perm: "audit:view" },
      { slug: "monitoring", label: "System Monitoring", icon: Activity, perm: "platform:manage" },
      { slug: "settings", label: "Platform Settings", icon: Settings, perm: "settings:manage" },
      { slug: "support", label: "Support Tickets", icon: LifeBuoy },
    ],
    quickActions: [
      { label: "Invite user", slug: "users", icon: Users },
      { label: "Approve account", slug: "government-accounts", icon: ShieldCheck },
      { label: "View audit", slug: "audit", icon: ScrollText },
    ],
  },
  government: {
    brandLabel: "Government Portal",
    searchScope: "districts, sectors, commodities…",
    nav: [
      dash("National Dashboard"),
      { slug: "national-stats", label: "National Statistics", icon: BarChart3, perm: "national:view" },
      { slug: "warehouses", label: "Warehouse Occupancy", icon: Warehouse, perm: "warehouse:view" },
      { slug: "transport", label: "Transport Activity", icon: Truck, perm: "fleet:view" },
      { slug: "market", label: "Market Intelligence", icon: Store, perm: "national:view" },
      { slug: "analytics", label: "Analytics", icon: Activity, perm: "analytics:view" },
      { slug: "reports", label: "National Reports", icon: FileText, perm: "reports:national" },
      { slug: "policy", label: "Policy Reports", icon: ScrollText, perm: "policy:manage" },
      { slug: "settings", label: "Settings", icon: Settings, perm: "settings:manage" },
    ],
    quickActions: [
      { label: "Publish report", slug: "reports", icon: FileText },
      { label: "Export dataset", slug: "national-stats", icon: Database },
    ],
  },
  farmer: {
    brandLabel: "Farmer Workspace",
    searchScope: "products, orders, buyers…",
    nav: [
      dash("My Farm"),
      { slug: "products", label: "My Products", icon: Package, perm: "products:view" },
      { slug: "inventory", label: "Inventory", icon: Boxes, perm: "inventory:view" },
      { slug: "warehouse", label: "Warehouse Batches", icon: Warehouse, perm: "warehouse:view" },
      { slug: "orders", label: "Orders", icon: ShoppingCart, perm: "orders:view" },
      { slug: "transport", label: "Transport Requests", icon: Truck, perm: "fleet:view" },
      { slug: "marketplace", label: "Marketplace", icon: Store },
      { slug: "market-prices", label: "Market Prices", icon: CreditCard },
      { slug: "analytics", label: "Analytics", icon: BarChart3 },
      { slug: "messages", label: "Messages", icon: MessageSquare },
      { slug: "notifications", label: "Notifications", icon: Bell },
    ],
    quickActions: [
      { label: "Add product", slug: "products", icon: Package },
      { label: "Request transport", slug: "transport", icon: Truck },
      { label: "Book warehouse", slug: "warehouse", icon: Warehouse },
      { label: "View orders", slug: "orders", icon: ShoppingCart },
    ],
  },
  cooperative: {
    brandLabel: "Cooperative Portal",
    searchScope: "members, lots, orders…",
    nav: [
      dash(),
      { slug: "members", label: "Members", icon: Users, perm: "members:manage" },
      { slug: "products", label: "Aggregated Products", icon: Package },
      { slug: "inventory", label: "Inventory", icon: Boxes },
      { slug: "orders", label: "Orders", icon: ShoppingCart },
      { slug: "warehouses", label: "Warehouses", icon: Warehouse },
      { slug: "reports", label: "Reports", icon: FileText },
      { slug: "payments", label: "Payments", icon: CreditCard },
    ],
    quickActions: [
      { label: "Register member", slug: "members", icon: Users },
      { label: "Aggregate lot", slug: "inventory", icon: Boxes },
    ],
  },
  manufacturer: {
    brandLabel: "Manufacturer Portal",
    searchScope: "SKUs, POs, suppliers…",
    nav: [
      dash(),
      { slug: "production", label: "Production", icon: Factory },
      { slug: "suppliers", label: "Suppliers", icon: Handshake, perm: "suppliers:manage" },
      { slug: "procurement", label: "Procurement", icon: ClipboardList, perm: "procurement:view" },
      { slug: "inventory", label: "Inventory", icon: Boxes },
      { slug: "orders", label: "Orders", icon: ShoppingCart },
      { slug: "warehouses", label: "Warehouses", icon: Warehouse },
      { slug: "transport", label: "Transport", icon: Truck },
      { slug: "analytics", label: "Analytics", icon: BarChart3 },
    ],
    quickActions: [
      { label: "Create PO", slug: "procurement", icon: ClipboardList },
      { label: "New production run", slug: "production", icon: Factory },
    ],
  },
  supplier: {
    brandLabel: "Supplier Portal",
    searchScope: "catalogue, RFQs, POs…",
    nav: [
      dash(),
      { slug: "catalog", label: "Product Catalog", icon: Package },
      { slug: "rfqs", label: "RFQs", icon: FileSignature, perm: "rfq:view" },
      { slug: "purchase-orders", label: "Purchase Orders", icon: ClipboardList },
      { slug: "deliveries", label: "Deliveries", icon: Truck },
      { slug: "contracts", label: "Contracts", icon: ScrollText, perm: "contracts:manage" },
      { slug: "payments", label: "Payments", icon: CreditCard },
      { slug: "reviews", label: "Customer Reviews", icon: Star },
    ],
    quickActions: [
      { label: "Respond to RFQ", slug: "rfqs", icon: FileSignature },
      { label: "Add product", slug: "catalog", icon: Package },
    ],
  },
  buyer: {
    brandLabel: "Buyer Portal",
    searchScope: "products, sellers…",
    nav: [
      dash(),
      { slug: "marketplace", label: "Marketplace", icon: Store, perm: "marketplace:browse" },
      { slug: "orders", label: "My Orders", icon: ShoppingCart },
      { slug: "tracking", label: "Order Tracking", icon: MapPin },
      { slug: "wishlist", label: "Wishlist", icon: Heart },
      { slug: "messages", label: "Messages", icon: MessageSquare },
      { slug: "notifications", label: "Notifications", icon: Bell },
      { slug: "payments", label: "Payments", icon: CreditCard },
      { slug: "reviews", label: "Reviews", icon: Star },
    ],
    quickActions: [
      { label: "Browse marketplace", slug: "marketplace", icon: Search },
      { label: "Track order", slug: "tracking", icon: MapPin },
    ],
  },
  retailer: {
    brandLabel: "Retailer Portal",
    searchScope: "SKUs, sales, suppliers…",
    nav: [
      dash(),
      { slug: "inventory", label: "Inventory", icon: Boxes },
      { slug: "sales", label: "Sales", icon: CircleDollarSign },
      { slug: "suppliers", label: "Suppliers", icon: Handshake, perm: "suppliers:manage" },
      { slug: "orders", label: "Orders", icon: ShoppingCart },
      { slug: "analytics", label: "Analytics", icon: BarChart3 },
      { slug: "payments", label: "Payments", icon: CreditCard },
    ],
    quickActions: [
      { label: "Record sale", slug: "sales", icon: CircleDollarSign },
      { label: "Reorder stock", slug: "orders", icon: ShoppingCart },
    ],
  },
  warehouse: {
    brandLabel: "Warehouse Ops",
    searchScope: "batches, reservations, requests…",
    nav: [
      dash("Warehouse Control"),
      { slug: "facilities", label: "My Warehouses", icon: Building2 },
      { slug: "batches", label: "Warehouse Batches", icon: Boxes },
      { slug: "requests", label: "Storage Requests", icon: ClipboardList },
      { slug: "reservations", label: "Reservations", icon: PackageCheck },
      { slug: "incoming", label: "Incoming Goods", icon: PackageOpen },
      { slug: "outgoing", label: "Outgoing Goods", icon: PackageCheck, perm: "warehouse:dispatch" },
      { slug: "analytics", label: "Analytics", icon: BarChart3 },
      { slug: "messages", label: "Messages", icon: MessageSquare },
      { slug: "notifications", label: "Notifications", icon: Bell },
    ],
    quickActions: [
      { label: "Add warehouse", slug: "facilities", icon: Building2 },
      { label: "Storage requests", slug: "requests", icon: ClipboardList },
      { label: "New batch", slug: "batches", icon: Boxes },
    ],
  },
  transport: {
    brandLabel: "Transport Ops",
    searchScope: "vehicles, drivers, routes…",
    nav: [
      dash(),
      { slug: "fleet", label: "Fleet", icon: Truck },
      { slug: "drivers", label: "Drivers", icon: UserIcon },
      { slug: "vehicles", label: "Vehicles", icon: Truck },
      { slug: "routes", label: "Routes", icon: RouteIcon },
      { slug: "deliveries", label: "Deliveries", icon: PackageCheck },
      { slug: "fuel", label: "Fuel Reports", icon: Fuel },
      { slug: "maintenance", label: "Maintenance", icon: Wrench },
      { slug: "payments", label: "Payments", icon: CreditCard },
    ],
    quickActions: [
      { label: "Assign trip", slug: "deliveries", icon: PackageCheck },
      { label: "Add vehicle", slug: "fleet", icon: Truck },
    ],
  },
  driver: {
    brandLabel: "Driver App",
    searchScope: "deliveries…",
    nav: [
      dash("Today"),
      { slug: "deliveries", label: "Assigned Deliveries", icon: PackageCheck },
      { slug: "map", label: "GPS Map", icon: MapPin },
      { slug: "timeline", label: "Delivery Timeline", icon: RouteIcon },
      { slug: "proof", label: "Proof of Delivery", icon: FileSignature },
      { slug: "history", label: "History", icon: ScrollText },
    ],
    quickActions: [
      { label: "Start delivery", slug: "deliveries", icon: PackageCheck },
      { label: "Navigate", slug: "map", icon: MapPin },
      { label: "Upload proof", slug: "proof", icon: FileSignature },
    ],
  },
  bank: {
    brandLabel: "Finance Portal",
    searchScope: "applicants, loans…",
    nav: [
      dash(),
      { slug: "applications", label: "Loan Applications", icon: ClipboardList, perm: "loans:view" },
      { slug: "verification", label: "Customer Verification", icon: ShieldCheck },
      { slug: "risk", label: "Risk Assessment", icon: Shield },
      { slug: "analytics", label: "Business Analytics", icon: BarChart3 },
      { slug: "reports", label: "Financial Reports", icon: FileText },
    ],
    quickActions: [
      { label: "Review application", slug: "applications", icon: ClipboardList },
      { label: "Verify customer", slug: "verification", icon: ShieldCheck },
    ],
  },
};
