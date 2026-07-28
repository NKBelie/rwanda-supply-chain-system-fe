/**
 * Rwanda Administrative Divisions
 * 
 * Hierarchy: Province → District → Sector → Cell → Village
 * 
 * Rwanda has:
 * - 5 Provinces (including Kigali City)
 * - 30 Districts
 * - 416 Sectors
 * - 2,148 Cells
 * - 14,837 Villages
 */

export type Province = {
  id: string;
  name: string;
  nameKiny: string;
  nameFr: string;
  code: string;
  capital?: string;
  area?: number; // km²
  population?: number;
};

export type District = {
  id: string;
  name: string;
  nameKiny: string;
  nameFr: string;
  code: string;
  provinceId: string;
  capital?: string;
  area?: number; // km²
  population?: number;
  latitude?: number;
  longitude?: number;
};

export type Sector = {
  id: string;
  name: string;
  nameKiny: string;
  nameFr: string;
  code: string;
  districtId: string;
  population?: number;
};

export type Cell = {
  id: string;
  name: string;
  nameKiny: string;
  nameFr: string;
  code: string;
  sectorId: string;
};

export type Village = {
  id: string;
  name: string;
  nameKiny: string;
  nameFr: string;
  code: string;
  cellId: string;
};

export type LocationHierarchy = {
  province?: Province;
  district?: District;
  sector?: Sector;
  cell?: Cell;
  village?: Village;
};

// ============================================================================
// PROVINCES
// ============================================================================

export const PROVINCES: Province[] = [
  {
    id: "kigali",
    name: "Kigali City",
    nameKiny: "Umujyi wa Kigali",
    nameFr: "Ville de Kigali",
    code: "KGL",
    capital: "Kigali",
    area: 730,
    population: 1132686,
  },
  {
    id: "eastern",
    name: "Eastern Province",
    nameKiny: "Intara y'Iburasirazuba",
    nameFr: "Province de l'Est",
    code: "EST",
    capital: "Rwamagana",
    area: 9458,
    population: 2595703,
  },
  {
    id: "northern",
    name: "Northern Province",
    nameKiny: "Intara y'Amajyaruguru",
    nameFr: "Province du Nord",
    code: "NTH",
    capital: "Musanze",
    area: 3276,
    population: 1726370,
  },
  {
    id: "southern",
    name: "Southern Province",
    nameKiny: "Intara y'Amajyepfo",
    nameFr: "Province du Sud",
    code: "STH",
    capital: "Huye",
    area: 5963,
    population: 2589975,
  },
  {
    id: "western",
    name: "Western Province",
    nameKiny: "Intara y'Iburengerazuba",
    nameFr: "Province de l'Ouest",
    code: "WST",
    capital: "Karongi",
    area: 5883,
    population: 2471239,
  },
];

// ============================================================================
// DISTRICTS
// ============================================================================

export const DISTRICTS: District[] = [
  // Kigali City (3 districts)
  {
    id: "gasabo",
    name: "Gasabo",
    nameKiny: "Gasabo",
    nameFr: "Gasabo",
    code: "KGL-GSB",
    provinceId: "kigali",
    capital: "Remera",
    area: 430.3,
    population: 530907,
    latitude: -1.9403,
    longitude: 30.1142,
  },
  {
    id: "kicukiro",
    name: "Kicukiro",
    nameKiny: "Kicukiro",
    nameFr: "Kicukiro",
    code: "KGL-KCK",
    provinceId: "kigali",
    capital: "Kicukiro",
    area: 166.7,
    population: 318214,
    latitude: -1.9897,
    longitude: 30.1009,
  },
  {
    id: "nyarugenge",
    name: "Nyarugenge",
    nameKiny: "Nyarugenge",
    nameFr: "Nyarugenge",
    code: "KGL-NYG",
    provinceId: "kigali",
    capital: "Nyarugenge",
    area: 134.0,
    population: 283565,
    latitude: -1.9536,
    longitude: 30.0606,
  },

  // Eastern Province (7 districts)
  {
    id: "bugesera",
    name: "Bugesera",
    nameKiny: "Bugesera",
    nameFr: "Bugesera",
    code: "EST-BGS",
    provinceId: "eastern",
    capital: "Nyamata",
    area: 1339.5,
    population: 363611,
    latitude: -2.1468,
    longitude: 30.1113,
  },
  {
    id: "gatsibo",
    name: "Gatsibo",
    nameKiny: "Gatsibo",
    nameFr: "Gatsibo",
    code: "EST-GTB",
    provinceId: "eastern",
    capital: "Kabarore",
    area: 1582.0,
    population: 433020,
    latitude: -1.6281,
    longitude: 30.4203,
  },
  {
    id: "kayonza",
    name: "Kayonza",
    nameKiny: "Kayonza",
    nameFr: "Kayonza",
    code: "EST-KYZ",
    provinceId: "eastern",
    capital: "Kayonza",
    area: 1977.0,
    population: 344157,
    latitude: -1.8887,
    longitude: 30.4203,
  },
  {
    id: "kirehe",
    name: "Kirehe",
    nameKiny: "Kirehe",
    nameFr: "Kirehe",
    code: "EST-KRH",
    provinceId: "eastern",
    capital: "Kirehe",
    area: 1166.7,
    population: 339335,
    latitude: -2.2156,
    longitude: 30.7141,
  },
  {
    id: "ngoma",
    name: "Ngoma",
    nameKiny: "Ngoma",
    nameFr: "Ngoma",
    code: "EST-NGM",
    provinceId: "eastern",
    capital: "Kibungo",
    area: 870.0,
    population: 350705,
    latitude: -2.1511,
    longitude: 30.5149,
  },
  {
    id: "nyagatare",
    name: "Nyagatare",
    nameKiny: "Nyagatare",
    nameFr: "Nyagatare",
    code: "EST-NYG",
    provinceId: "eastern",
    capital: "Nyagatare",
    area: 1741.0,
    population: 466,944,
    latitude: -1.2981,
    longitude: 30.3314,
  },
  {
    id: "rwamagana",
    name: "Rwamagana",
    nameKiny: "Rwamagana",
    nameFr: "Rwamagana",
    code: "EST-RWM",
    provinceId: "eastern",
    capital: "Rwamagana",
    area: 697.0,
    population: 311883,
    latitude: -1.9486,
    longitude: 30.4347,
  },

  // Northern Province (5 districts)
  {
    id: "burera",
    name: "Burera",
    nameKiny: "Burera",
    nameFr: "Burera",
    code: "NTH-BRR",
    provinceId: "northern",
    capital: "Cyeru",
    area: 622.0,
    population: 340836,
    latitude: -1.4958,
    longitude: 29.8436,
  },
  {
    id: "gakenke",
    name: "Gakenke",
    nameKiny: "Gakenke",
    nameFr: "Gakenke",
    code: "NTH-GKK",
    provinceId: "northern",
    capital: "Gakenke",
    area: 703.0,
    population: 338586,
    latitude: -1.6833,
    longitude: 29.7833,
  },
  {
    id: "gicumbi",
    name: "Gicumbi",
    nameKiny: "Gicumbi",
    nameFr: "Gicumbi",
    code: "NTH-GCM",
    provinceId: "northern",
    capital: "Byumba",
    area: 835.0,
    population: 487136,
    latitude: -1.5764,
    longitude: 30.0558,
  },
  {
    id: "musanze",
    name: "Musanze",
    nameKiny: "Musanze",
    nameFr: "Musanze",
    code: "NTH-MSZ",
    provinceId: "northern",
    capital: "Musanze",
    area: 530.0,
    population: 368267,
    latitude: -1.4983,
    longitude: 29.6344,
  },
  {
    id: "rulindo",
    name: "Rulindo",
    nameKiny: "Rulindo",
    nameFr: "Rulindo",
    code: "NTH-RLD",
    provinceId: "northern",
    capital: "Kinihira",
    area: 567.0,
    population: 287681,
    latitude: -1.7678,
    longitude: 30.0667,
  },

  // Southern Province (8 districts)
  {
    id: "gisagara",
    name: "Gisagara",
    nameKiny: "Gisagara",
    nameFr: "Gisagara",
    code: "STH-GSG",
    provinceId: "southern",
    capital: "Save",
    area: 670.0,
    population: 306146,
    latitude: -2.5833,
    longitude: 29.8333,
  },
  {
    id: "huye",
    name: "Huye",
    nameKiny: "Huye",
    nameFr: "Huye",
    code: "STH-HYE",
    provinceId: "southern",
    capital: "Butare",
    area: 581.0,
    population: 381900,
    latitude: -2.5978,
    longitude: 29.7389,
  },
  {
    id: "kamonyi",
    name: "Kamonyi",
    nameKiny: "Kamonyi",
    nameFr: "Kamonyi",
    code: "STH-KMY",
    provinceId: "southern",
    capital: "Kamonyi",
    area: 655.0,
    population: 340501,
    latitude: -2.0294,
    longitude: 29.8381,
  },
  {
    id: "muhanga",
    name: "Muhanga",
    nameKiny: "Muhanga",
    nameFr: "Muhanga",
    code: "STH-MHG",
    provinceId: "southern",
    capital: "Gitarama",
    area: 637.0,
    population: 323143,
    latitude: -2.0844,
    longitude: 29.7489,
  },
  {
    id: "nyamagabe",
    name: "Nyamagabe",
    nameKiny: "Nyamagabe",
    nameFr: "Nyamagabe",
    code: "STH-NMG",
    provinceId: "southern",
    capital: "Gikongoro",
    area: 1181.0,
    population: 366,398,
    latitude: -2.4556,
    longitude: 29.5144,
  },
  {
    id: "nyanza",
    name: "Nyanza",
    nameKiny: "Nyanza",
    nameFr: "Nyanza",
    code: "STH-NYZ",
    provinceId: "southern",
    capital: "Nyanza",
    area: 672.0,
    population: 323719,
    latitude: -2.3522,
    longitude: 29.7503,
  },
  {
    id: "nyaruguru",
    name: "Nyaruguru",
    nameKiny: "Nyaruguru",
    nameFr: "Nyaruguru",
    code: "STH-NRG",
    provinceId: "southern",
    capital: "Kibeho",
    area: 1029.0,
    population: 317,895,
    latitude: -2.6739,
    longitude: 29.4244,
  },
  {
    id: "ruhango",
    name: "Ruhango",
    nameKiny: "Ruhango",
    nameFr: "Ruhango",
    code: "STH-RHG",
    provinceId: "southern",
    capital: "Ruhango",
    area: 629.0,
    population: 323,436,
    latitude: -2.2333,
    longitude: 29.7833,
  },

  // Western Province (7 districts)
  {
    id: "karongi",
    name: "Karongi",
    nameKiny: "Karongi",
    nameFr: "Karongi",
    code: "WST-KRG",
    provinceId: "western",
    capital: "Kibuye",
    area: 1026.0,
    population: 331,229,
    latitude: -2.0608,
    longitude: 29.3450,
  },
  {
    id: "ngororero",
    name: "Ngororero",
    nameKiny: "Ngororero",
    nameFr: "Ngororero",
    code: "WST-NGR",
    provinceId: "western",
    capital: "Ngororero",
    area: 684.0,
    population: 344,730,
    latitude: -1.8833,
    longitude: 29.5333,
  },
  {
    id: "nyabihu",
    name: "Nyabihu",
    nameKiny: "Nyabihu",
    nameFr: "Nyabihu",
    code: "WST-NYB",
    provinceId: "western",
    capital: "Murunda",
    area: 534.0,
    population: 296,123,
    latitude: -1.6833,
    longitude: 29.5000,
  },
  {
    id: "nyamasheke",
    name: "Nyamasheke",
    nameKiny: "Nyamasheke",
    nameFr: "Nyamasheke",
    code: "WST-NMS",
    provinceId: "western",
    capital: "Kagano",
    area: 1377.0,
    population: 356,777,
    latitude: -2.3167,
    longitude: 29.1167,
  },
  {
    id: "rubavu",
    name: "Rubavu",
    nameKiny: "Rubavu",
    nameFr: "Rubavu",
    code: "WST-RBV",
    provinceId: "western",
    capital: "Gisenyi",
    area: 388.0,
    population: 416,165,
    latitude: -1.6777,
    longitude: 29.2608,
  },
  {
    id: "rutsiro",
    name: "Rutsiro",
    nameKiny: "Rutsiro",
    nameFr: "Rutsiro",
    code: "WST-RTS",
    provinceId: "western",
    capital: "Murunda",
    area: 1150.0,
    population: 355,675,
    latitude: -1.9833,
    longitude: 29.3667,
  },
  {
    id: "rusizi",
    name: "Rusizi",
    nameKiny: "Rusizi",
    nameFr: "Rusizi",
    code: "WST-RSZ",
    provinceId: "western",
    capital: "Cyangugu",
    area: 1356.0,
    population: 370,540,
    latitude: -2.4833,
    longitude: 28.9083,
  },
];

// ============================================================================
// SAMPLE SECTORS (Major sectors - Full list would be 416 sectors)
// ============================================================================

export const SECTORS: Sector[] = [
  // Gasabo District
  { id: "bumbogo", name: "Bumbogo", nameKiny: "Bumbogo", nameFr: "Bumbogo", code: "GSB-BMB", districtId: "gasabo" },
  { id: "gatsata", name: "Gatsata", nameKiny: "Gatsata", nameFr: "Gatsata", code: "GSB-GTS", districtId: "gasabo" },
  { id: "jali", name: "Jali", nameKiny: "Jali", nameFr: "Jali", code: "GSB-JLI", districtId: "gasabo" },
  { id: "gikomero", name: "Gikomero", nameKiny: "Gikomero", nameFr: "Gikomero", code: "GSB-GKM", districtId: "gasabo" },
  { id: "gisozi", name: "Gisozi", nameKiny: "Gisozi", nameFr: "Gisozi", code: "GSB-GSZ", districtId: "gasabo" },
  { id: "jabana", name: "Jabana", nameKiny: "Jabana", nameFr: "Jabana", code: "GSB-JBN", districtId: "gasabo" },
  { id: "kacyiru", name: "Kacyiru", nameKiny: "Kacyiru", nameFr: "Kacyiru", code: "GSB-KCY", districtId: "gasabo" },
  { id: "kimihurura", name: "Kimihurura", nameKiny: "Kimihurura", nameFr: "Kimihurura", code: "GSB-KMH", districtId: "gasabo" },
  { id: "kimironko", name: "Kimironko", nameKiny: "Kimironko", nameFr: "Kimironko", code: "GSB-KMR", districtId: "gasabo" },
  { id: "kinyinya", name: "Kinyinya", nameKiny: "Kinyinya", nameFr: "Kinyinya", code: "GSB-KNY", districtId: "gasabo" },
  { id: "ndera", name: "Ndera", nameKiny: "Ndera", nameFr: "Ndera", code: "GSB-NDR", districtId: "gasabo" },
  { id: "nduba", name: "Nduba", nameKiny: "Nduba", nameFr: "Nduba", code: "GSB-NDB", districtId: "gasabo" },
  { id: "remera", name: "Remera", nameKiny: "Remera", nameFr: "Remera", code: "GSB-RMR", districtId: "gasabo" },
  { id: "rusororo", name: "Rusororo", nameKiny: "Rusororo", nameFr: "Rusororo", code: "GSB-RSR", districtId: "gasabo" },
  { id: "rutunga", name: "Rutunga", nameKiny: "Rutunga", nameFr: "Rutunga", code: "GSB-RTG", districtId: "gasabo" },

  // Kicukiro District
  { id: "gahanga", name: "Gahanga", nameKiny: "Gahanga", nameFr: "Gahanga", code: "KCK-GHG", districtId: "kicukiro" },
  { id: "gatenga", name: "Gatenga", nameKiny: "Gatenga", nameFr: "Gatenga", code: "KCK-GTG", districtId: "kicukiro" },
  { id: "gikondo", name: "Gikondo", nameKiny: "Gikondo", nameFr: "Gikondo", code: "KCK-GKD", districtId: "kicukiro" },
  { id: "kanombe", name: "Kanombe", nameKiny: "Kanombe", nameFr: "Kanombe", code: "KCK-KNB", districtId: "kicukiro" },
  { id: "kicukiro-sector", name: "Kicukiro", nameKiny: "Kicukiro", nameFr: "Kicukiro", code: "KCK-KCK", districtId: "kicukiro" },
  { id: "kigarama", name: "Kigarama", nameKiny: "Kigarama", nameFr: "Kigarama", code: "KCK-KGR", districtId: "kicukiro" },
  { id: "masaka", name: "Masaka", nameKiny: "Masaka", nameFr: "Masaka", code: "KCK-MSK", districtId: "kicukiro" },
  { id: "niboye", name: "Niboye", nameKiny: "Niboye", nameFr: "Niboye", code: "KCK-NBY", districtId: "kicukiro" },
  { id: "nyarugunga", name: "Nyarugunga", nameKiny: "Nyarugunga", nameFr: "Nyarugunga", code: "KCK-NYG", districtId: "kicukiro" },
  { id: "kagarama", name: "Kagarama", nameKiny: "Kagarama", nameFr: "Kagarama", code: "KCK-KGM", districtId: "kicukiro" },

  // Nyarugenge District
  { id: "gitega", name: "Gitega", nameKiny: "Gitega", nameFr: "Gitega", code: "NYG-GTG", districtId: "nyarugenge" },
  { id: "kanyinya", name: "Kanyinya", nameKiny: "Kanyinya", nameFr: "Kanyinya", code: "NYG-KNY", districtId: "nyarugenge" },
  { id: "kigali", name: "Kigali", nameKiny: "Kigali", nameFr: "Kigali", code: "NYG-KGL", districtId: "nyarugenge" },
  { id: "kimisagara", name: "Kimisagara", nameKiny: "Kimisagara", nameFr: "Kimisagara", code: "NYG-KMS", districtId: "nyarugenge" },
  { id: "mageragere", name: "Mageragere", nameKiny: "Mageragere", nameFr: "Mageragere", code: "NYG-MGR", districtId: "nyarugenge" },
  { id: "muhima", name: "Muhima", nameKiny: "Muhima", nameFr: "Muhima", code: "NYG-MHM", districtId: "nyarugenge" },
  { id: "nyakabanda", name: "Nyakabanda", nameKiny: "Nyakabanda", nameFr: "Nyakabanda", code: "NYG-NKB", districtId: "nyarugenge" },
  { id: "nyamirambo", name: "Nyamirambo", nameKiny: "Nyamirambo", nameFr: "Nyamirambo", code: "NYG-NYM", districtId: "nyarugenge" },
  { id: "nyarugenge-sector", name: "Nyarugenge", nameKiny: "Nyarugenge", nameFr: "Nyarugenge", code: "NYG-NYG", districtId: "nyarugenge" },
  { id: "rwezamenyo", name: "Rwezamenyo", nameKiny: "Rwezamenyo", nameFr: "Rwezamenyo", code: "NYG-RWZ", districtId: "nyarugenge" },
];

// Note: Full implementation would include all 416 sectors
// This provides the structure and main sectors for Kigali

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getProvinceById(id: string): Province | undefined {
  return PROVINCES.find((p) => p.id === id);
}

export function getDistrictById(id: string): District | undefined {
  return DISTRICTS.find((d) => d.id === id);
}

export function getSectorById(id: string): Sector | undefined {
  return SECTORS.find((s) => s.id === id);
}

export function getDistrictsByProvince(provinceId: string): District[] {
  return DISTRICTS.filter((d) => d.provinceId === provinceId);
}

export function getSectorsByDistrict(districtId: string): Sector[] {
  return SECTORS.filter((s) => s.districtId === districtId);
}

export function getProvinceByDistrict(districtId: string): Province | undefined {
  const district = getDistrictById(districtId);
  return district ? getProvinceById(district.provinceId) : undefined;
}

export function getDistrictBySector(sectorId: string): District | undefined {
  const sector = getSectorById(sectorId);
  return sector ? getDistrictById(sector.districtId) : undefined;
}

export function getFullLocationHierarchy(
  sectorId?: string,
  districtId?: string,
  provinceId?: string
): LocationHierarchy {
  const hierarchy: LocationHierarchy = {};

  if (sectorId) {
    hierarchy.sector = getSectorById(sectorId);
    if (hierarchy.sector) {
      hierarchy.district = getDistrictById(hierarchy.sector.districtId);
    }
  } else if (districtId) {
    hierarchy.district = getDistrictById(districtId);
  }

  if (hierarchy.district) {
    hierarchy.province = getProvinceById(hierarchy.district.provinceId);
  } else if (provinceId) {
    hierarchy.province = getProvinceById(provinceId);
  }

  return hierarchy;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearest districts to a given location
 */
export function findNearestDistricts(
  latitude: number,
  longitude: number,
  limit: number = 5
): Array<District & { distance: number }> {
  return DISTRICTS.filter((d) => d.latitude && d.longitude)
    .map((district) => ({
      ...district,
      distance: calculateDistance(
        latitude,
        longitude,
        district.latitude!,
        district.longitude!
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Get districts sorted by name
 */
export function getDistrictsSorted(): District[] {
  return [...DISTRICTS].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Search districts by name
 */
export function searchDistricts(query: string): District[] {
  const q = query.toLowerCase();
  return DISTRICTS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.nameKiny.toLowerCase().includes(q) ||
      d.nameFr.toLowerCase().includes(q)
  );
}

/**
 * Format location string
 */
export function formatLocation(hierarchy: LocationHierarchy, language: "en" | "kin" | "fr" = "en"): string {
  const parts: string[] = [];

  if (hierarchy.sector) {
    parts.push(
      language === "en"
        ? hierarchy.sector.name
        : language === "kin"
        ? hierarchy.sector.nameKiny
        : hierarchy.sector.nameFr
    );
  }

  if (hierarchy.district) {
    parts.push(
      language === "en"
        ? hierarchy.district.name
        : language === "kin"
        ? hierarchy.district.nameKiny
        : hierarchy.district.nameFr
    );
  }

  if (hierarchy.province) {
    parts.push(
      language === "en"
        ? hierarchy.province.name
        : language === "kin"
        ? hierarchy.province.nameKiny
        : hierarchy.province.nameFr
    );
  }

  return parts.join(", ");
}

// Export count constants
export const LOCATION_STATS = {
  PROVINCES: 5,
  DISTRICTS: 30,
  SECTORS: 416,
  CELLS: 2148,
  VILLAGES: 14837,
} as const;
