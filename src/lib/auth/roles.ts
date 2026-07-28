export type Role =
  | "super_admin" | "government" | "farmer" | "cooperative" | "manufacturer"
  | "supplier" | "buyer" | "retailer" | "warehouse" | "transport" | "driver" | "bank";
export const ALL_ROLES: Role[] = [
  "super_admin", "government", "farmer", "cooperative", "manufacturer",
  "supplier", "buyer", "retailer", "warehouse", "transport", "driver", "bank",
];
export type RoleMeta = {
  label: string; short: string; home: string; orgType: string; accent: string; description: string;
};
const BRAND = "#166534";
export const ROLE_META: Record<Role, RoleMeta> = {
  super_admin:  { label: "Super Administrator", short: "Admin",        home: "/admin",        orgType: "Platform",         accent: BRAND, description: "Full platform governance." },
  government:   { label: "Government Officer",  short: "Government",   home: "/government",   orgType: "MINAGRI / MINICOM", accent: BRAND, description: "National oversight & policy." },
  farmer:       { label: "Farmer",              short: "Farmer",       home: "/farmer",       orgType: "Farm",             accent: BRAND, description: "Grow, list and sell produce." },
  cooperative:  { label: "Cooperative",         short: "Coop",         home: "/cooperative",  orgType: "Cooperative",      accent: BRAND, description: "Aggregate member supply." },
  manufacturer: { label: "Manufacturer",        short: "Manufacturer", home: "/manufacturer", orgType: "Factory",          accent: BRAND, description: "Production & procurement." },
  supplier:     { label: "Supplier",            short: "Supplier",     home: "/supplier",     orgType: "Supplier",         accent: BRAND, description: "Catalogue, RFQs, deliveries." },
  buyer:        { label: "Buyer / Client",      short: "Buyer",        home: "/buyer",        orgType: "Business",         accent: BRAND, description: "Source and track orders." },
  retailer:     { label: "Retailer",            short: "Retailer",     home: "/retailer",     orgType: "Retail",           accent: BRAND, description: "Shop-floor stock & sales." },
  warehouse:    { label: "Warehouse Manager",   short: "Warehouse",    home: "/warehouse",    orgType: "Warehouse",        accent: BRAND, description: "Capacity, inbound, outbound." },
  transport:    { label: "Transport Company",   short: "Transport",    home: "/transport",    orgType: "Logistics",        accent: BRAND, description: "Fleet, routes, deliveries." },
  driver:       { label: "Driver",              short: "Driver",       home: "/driver",       orgType: "Driver",           accent: BRAND, description: "On-the-road delivery ops." },
  bank:         { label: "Financial Institution", short: "Bank",       home: "/bank",         orgType: "Bank",             accent: BRAND, description: "Loans, risk & verification." },
};
export const roleHome = (r: Role) => ROLE_META[r].home;
export const roleDashboard = (r: Role) => `${ROLE_META[r].home}/dashboard`;