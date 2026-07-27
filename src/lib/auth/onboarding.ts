import type { Role } from "./roles";

export type RegistrationRole = Exclude<Role, "super_admin">;

export const REGISTRATION_ROLES: RegistrationRole[] = [
  "farmer",
  "cooperative",
  "manufacturer",
  "supplier",
  "warehouse",
  "transport",
  "driver",
  "retailer",
  "buyer",
  "government",
  "bank",
];

export function hasCompletedProfile(role: Role, profileCompleted: boolean) {
  return role === "buyer" || role === "super_admin" || profileCompleted;
}

export function requiresProfileSetupForRole(role: Role, profileComplete: boolean) {
  return !hasCompletedProfile(role, profileComplete);
}

export const ROLE_DASHBOARDS: Record<Role, string> = {
  super_admin: "/admin/dashboard",
  government: "/government/dashboard",
  farmer: "/farmer/dashboard",
  cooperative: "/cooperative/dashboard",
  manufacturer: "/manufacturer/dashboard",
  supplier: "/supplier/dashboard",
  buyer: "/buyer/dashboard",
  retailer: "/retailer/dashboard",
  warehouse: "/warehouse/dashboard",
  transport: "/transport/dashboard",
  driver: "/driver/dashboard",
  bank: "/bank/dashboard",
};

export type ProfileFieldType = "text" | "number" | "textarea" | "select";

export type ProfileField = {
  name: string;
  label: string;
  type: ProfileFieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type ProfileDocument = {
  key: string;
  label: string;
  required?: boolean;
};

export type RoleProfileConfig = {
  title: string;
  description: string;
  fields: ProfileField[];
  documents: ProfileDocument[];
  requiresBusinessProfile: boolean;
};

const businessTypes = ["Individual", "SME", "Cooperative", "Company", "Institution"];
const industryTypes = ["Agro-processing", "Manufacturing", "Food production", "Packaging", "Export"];
const supplierTypes = ["Input supplier", "Raw materials", "Packaging", "Equipment", "Services"];
const storageTypes = ["Dry storage", "Cold storage", "Silo", "Bonded warehouse", "Mixed storage"];
const vehicleTypes = ["Motorcycle", "Pickup", "Van", "Box truck", "Refrigerated truck", "Trailer"];

const addressFields: ProfileField[] = [
  { name: "province", label: "Province", type: "select", required: true },
  { name: "district", label: "District", type: "select", required: true },
  { name: "sector", label: "Sector", type: "select", required: true },
  { name: "cell", label: "Cell", type: "select", required: true },
  { name: "village", label: "Village", type: "select", required: true },
];

export const ROLE_PROFILE_CONFIG: Record<RegistrationRole, RoleProfileConfig> = {
  farmer: {
    title: "Farmer profile setup",
    description: "Add farm and location details so buyers, cooperatives, warehouses, and transport providers can match with you.",
    fields: [
      { name: "businessName", label: "Business Name", type: "text", required: true },
      { name: "farmerName", label: "Farmer Name", type: "text", required: true },
      { name: "tin", label: "TIN", type: "text", placeholder: "Optional if unavailable" },
      { name: "farmerRegistrationNumber", label: "Farmer Registration Number", type: "text" },
      { name: "businessType", label: "Business Type", type: "select", options: businessTypes, required: true },
      ...addressFields,
      { name: "aboutBusiness", label: "About Business", type: "textarea", required: true },
    ],
    documents: [
      { key: "nationalId", label: "National ID", required: true },
      { key: "farmerCertificate", label: "Farmer Certificate", required: true },
      { key: "cooperativeCertificate", label: "Cooperative Certificate" },
      { key: "taxCertificate", label: "Tax Certificate" },
      { key: "profilePicture", label: "Profile Picture" },
    ],
    requiresBusinessProfile: true,
  },
  cooperative: {
    title: "Cooperative profile setup",
    description: "Register cooperative identity and location details for member aggregation and market access.",
    fields: [
      { name: "cooperativeName", label: "Cooperative Name", type: "text", required: true },
      { name: "registrationNumber", label: "Registration Number", type: "text", required: true },
      ...addressFields,
    ],
    documents: [{ key: "cooperativeRegistrationCertificate", label: "Cooperative Registration Certificate", required: true }],
    requiresBusinessProfile: true,
  },
  manufacturer: {
    title: "Manufacturer profile setup",
    description: "Create a verified manufacturing profile for procurement, production, warehousing, and distribution.",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", required: true },
      { name: "registrationNumber", label: "Registration Number", type: "text", required: true },
      { name: "tin", label: "TIN", type: "text", required: true },
      { name: "industryType", label: "Industry Type", type: "select", options: industryTypes, required: true },
      ...addressFields,
      { name: "companyDescription", label: "Company Description", type: "textarea", required: true },
    ],
    documents: [
      { key: "registrationCertificate", label: "Registration Certificate", required: true },
      { key: "tradingLicense", label: "Trading License", required: true },
      { key: "taxCertificate", label: "Tax Certificate", required: true },
      { key: "companyLogo", label: "Company Logo" },
    ],
    requiresBusinessProfile: true,
  },
  supplier: {
    title: "Supplier profile setup",
    description: "Add supplier identity and coverage details for RFQs, marketplace listings, and fulfilment.",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", required: true },
      { name: "supplierType", label: "Supplier Type", type: "select", options: supplierTypes, required: true },
      { name: "tin", label: "TIN", type: "text", required: true },
      ...addressFields,
    ],
    documents: [
      { key: "registrationCertificate", label: "Registration Certificate", required: true },
      { key: "tradingLicense", label: "Trading License", required: true },
      { key: "taxCertificate", label: "Tax Certificate", required: true },
    ],
    requiresBusinessProfile: true,
  },
  warehouse: {
    title: "Warehouse manager profile setup",
    description: "Add warehouse capacity, storage type, and location data for smart bookings.",
    fields: [
      { name: "warehouseName", label: "Warehouse Name", type: "text", required: true },
      { name: "storageCapacity", label: "Storage Capacity", type: "number", required: true },
      { name: "storageType", label: "Storage Type", type: "select", options: storageTypes, required: true },
      ...addressFields,
    ],
    documents: [
      { key: "warehouseLicense", label: "Warehouse License", required: true },
      { key: "registrationCertificate", label: "Registration Certificate", required: true },
      { key: "safetyCertificate", label: "Safety Certificate", required: true },
    ],
    requiresBusinessProfile: true,
  },
  transport: {
    title: "Transport company profile setup",
    description: "Add fleet and coverage data for delivery matching, routing, and ETA estimates.",
    fields: [
      { name: "companyName", label: "Company Name", type: "text", required: true },
      { name: "fleetSize", label: "Fleet Size", type: "number", required: true },
      { name: "vehicleTypes", label: "Vehicle Types", type: "select", options: vehicleTypes, required: true },
      { name: "tin", label: "TIN", type: "text", required: true },
      ...addressFields,
    ],
    documents: [
      { key: "transportLicense", label: "Transport License", required: true },
      { key: "businessRegistration", label: "Business Registration", required: true },
      { key: "insuranceCertificate", label: "Insurance Certificate", required: true },
    ],
    requiresBusinessProfile: true,
  },
  driver: {
    title: "Driver profile setup",
    description: "Add license, vehicle, and operating location details for assigned deliveries.",
    fields: [
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "nationalId", label: "National ID", type: "text", required: true },
      { name: "drivingLicenseNumber", label: "Driving License Number", type: "text", required: true },
      { name: "vehicleType", label: "Vehicle Type", type: "select", options: vehicleTypes, required: true },
      ...addressFields,
    ],
    documents: [
      { key: "nationalIdDocument", label: "National ID", required: true },
      { key: "drivingLicense", label: "Driving License", required: true },
    ],
    requiresBusinessProfile: true,
  },
  retailer: {
    title: "Retailer profile setup",
    description: "Add retail business location and license data for local sourcing recommendations.",
    fields: [
      { name: "businessName", label: "Business Name", type: "text", required: true },
      { name: "businessType", label: "Business Type", type: "select", options: businessTypes, required: true },
      { name: "tin", label: "TIN", type: "text", required: true },
      ...addressFields,
    ],
    documents: [
      { key: "businessRegistration", label: "Business Registration", required: true },
      { key: "tradingLicense", label: "Trading License", required: true },
    ],
    requiresBusinessProfile: true,
  },
  government: {
    title: "Government officer profile setup",
    description: "Confirm institution, department, and jurisdiction before entering the government dashboard.",
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "province", label: "Province", type: "select", required: true },
      { name: "district", label: "District", type: "select", required: true },
      { name: "sector", label: "Sector", type: "select", required: true },
    ],
    documents: [
      { key: "governmentStaffId", label: "Government Staff ID", required: true },
      { key: "authorizationLetter", label: "Authorization Letter", required: true },
    ],
    requiresBusinessProfile: true,
  },
  bank: {
    title: "Bank profile setup",
    description: "Confirm institution and authorization details for financing and verification workflows.",
    fields: [
      { name: "institutionName", label: "Institution Name", type: "text", required: true },
      { name: "branch", label: "Branch", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
    ],
    documents: [
      { key: "staffId", label: "Staff ID", required: true },
      { key: "authorizationLetter", label: "Authorization Letter", required: true },
    ],
    requiresBusinessProfile: true,
  },
  buyer: {
    title: "Buyer profile",
    description: "Buyers use their account details and skip business profile setup.",
    fields: [
      { name: "firstName", label: "First Name", type: "text", required: true },
      { name: "lastName", label: "Last Name", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
    ],
    documents: [],
    requiresBusinessProfile: false,
  },
};

export type RwandaLocation = {
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  latitude?: number;
  longitude?: number;
};

export const RWANDA_PROVINCES = ["Kigali City", "Eastern Province", "Northern Province", "Southern Province", "Western Province"] as const;

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Kigali City": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern Province": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern Province": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  "Western Province": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
};

export const DISTRICT_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  Gasabo: { latitude: -1.8922, longitude: 30.1194 },
  Kicukiro: { latitude: -1.9791, longitude: 30.1056 },
  Nyarugenge: { latitude: -1.9441, longitude: 30.0619 },
  Bugesera: { latitude: -2.2193, longitude: 30.2285 },
  Gatsibo: { latitude: -1.6047, longitude: 30.4567 },
  Kayonza: { latitude: -1.8627, longitude: 30.6515 },
  Kirehe: { latitude: -2.2565, longitude: 30.7324 },
  Ngoma: { latitude: -2.1518, longitude: 30.5427 },
  Nyagatare: { latitude: -1.2989, longitude: 30.3251 },
  Rwamagana: { latitude: -1.9487, longitude: 30.4347 },
  Burera: { latitude: -1.4826, longitude: 29.8563 },
  Gakenke: { latitude: -1.6933, longitude: 29.7856 },
  Gicumbi: { latitude: -1.6167, longitude: 30.1167 },
  Musanze: { latitude: -1.4998, longitude: 29.6349 },
  Rulindo: { latitude: -1.7308, longitude: 29.9759 },
  Gisagara: { latitude: -2.6164, longitude: 29.8468 },
  Huye: { latitude: -2.5967, longitude: 29.7394 },
  Kamonyi: { latitude: -2.0028, longitude: 29.9192 },
  Muhanga: { latitude: -2.0845, longitude: 29.7527 },
  Nyamagabe: { latitude: -2.4653, longitude: 29.5822 },
  Nyanza: { latitude: -2.3519, longitude: 29.7509 },
  Nyaruguru: { latitude: -2.7603, longitude: 29.6289 },
  Ruhango: { latitude: -2.2227, longitude: 29.7806 },
  Karongi: { latitude: -2.1639, longitude: 29.3675 },
  Ngororero: { latitude: -1.8611, longitude: 29.6281 },
  Nyabihu: { latitude: -1.6566, longitude: 29.5266 },
  Nyamasheke: { latitude: -2.3222, longitude: 29.1478 },
  Rubavu: { latitude: -1.6792, longitude: 29.2610 },
  Rusizi: { latitude: -2.4836, longitude: 28.9075 },
  Rutsiro: { latitude: -1.9467, longitude: 29.3275 },
};

export const SECTORS_BY_DISTRICT: Record<string, string[]> = {
  Gasabo: ["Bumbogo", "Gatsata", "Gikomero", "Gisozi", "Jabana", "Jali", "Kacyiru", "Kimihurura", "Kimironko", "Kinyinya", "Ndera", "Nduba", "Remera", "Rusororo", "Rutunga"],
  Kicukiro: ["Gahanga", "Gatenga", "Gikondo", "Kagarama", "Kanombe", "Kicukiro", "Kigarama", "Masaka", "Niboye", "Nyarugunga"],
  Nyarugenge: ["Gitega", "Kanyinya", "Kigali", "Kimisagara", "Mageregere", "Muhima", "Nyakabanda", "Nyamirambo", "Nyarugenge", "Rwezamenyo"],
  Huye: ["Gishamvu", "Huye", "Karama", "Kigoma", "Kinazi", "Maraba", "Mbazi", "Mukura", "Ngoma", "Ruhashya", "Rusatira", "Rwaniro", "Simbi", "Tumba"],
  Musanze: ["Busogo", "Cyuve", "Gacaca", "Gashaki", "Gataraga", "Kimonyi", "Kinigi", "Muhoza", "Muko", "Musanze", "Nkotsi", "Nyange", "Remera", "Rwaza", "Shingiro"],
  Rubavu: ["Bugeshi", "Busasamana", "Cyanzarwe", "Gisenyi", "Kanama", "Kanzenze", "Mudende", "Nyakiliba", "Nyamyumba", "Nyundo", "Rubavu", "Rugerero"],
};

export function getDistricts(province: string) {
  return DISTRICTS_BY_PROVINCE[province] ?? [];
}

export function getSectors(district: string) {
  return SECTORS_BY_DISTRICT[district] ?? [`${district} Central`, `${district} East`, `${district} West`].filter(Boolean);
}

export function getCells(sector: string) {
  return sector ? [`${sector} Cell A`, `${sector} Cell B`, `${sector} Cell C`] : [];
}

export function getVillages(cell: string) {
  return cell ? [`${cell} Village 1`, `${cell} Village 2`, `${cell} Village 3`] : [];
}

export function withLocationMetadata(location: RwandaLocation): RwandaLocation {
  const coordinates = DISTRICT_COORDINATES[location.district];
  return coordinates ? { ...location, ...coordinates } : location;
}

export function getLocationRecommendations(role: RegistrationRole, location: Partial<RwandaLocation>) {
  const place = location.district || location.province || "your area";
  const shared = [
    `Nearest verified warehouse around ${place}`,
    `Nearest available transport provider around ${place}`,
  ];

  switch (role) {
    case "farmer":
      return [...shared, `Nearby buyers and cooperatives in ${place}`];
    case "retailer":
      return [`Nearby suppliers in ${place}`, ...shared];
    case "warehouse":
      return [`Compatible products expected around ${place}`, `Capacity planning for ${place}`, `incoming transport providers near ${place}`];
    case "transport":
    case "driver":
      return [`Nearest pickup requests around ${place}`, `Best route estimate from ${place}`, `Delivery cost estimate based on district distance`];
    case "supplier":
    case "manufacturer":
      return [`Nearby buyers in ${place}`, `Nearby retailers in ${place}`, `Warehouse compatibility around ${place}`];
    default:
      return shared;
  }
}
