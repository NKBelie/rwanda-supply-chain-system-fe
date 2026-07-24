export type ProductionStatus = "In Production" | "QA Check" | "Completed" | "Paused" | "Draft";

export type ProductionBatch = {
  id: string;
  sku: string;
  product: string;
  category: string;
  targetQty: string;
  producedQty: string;
  unit: string;
  progress: number; // 0–100
  status: ProductionStatus;
  startDate: string;
  expectedEnd: string;
  line: string;
  supervisor: string;
  yieldRate: number; // %
  notes?: string;
};

export type ProductionRun = {
  id: string;
  product: string;
  qty: string;
  unit: string;
  line: string;
  status: ProductionStatus;
};

export const productionBatches: ProductionBatch[] = [
  {
    id: "BATCH-7821", sku: "SKU-CF-001", product: "Arabica Coffee (Roasted)", category: "Beverages",
    targetQty: "2,000", producedQty: "1,840", unit: "kg", progress: 92, status: "QA Check",
    startDate: "2026-07-20", expectedEnd: "2026-07-24", line: "Line A",
    supervisor: "Jean Uwimana", yieldRate: 97.2,
    notes: "Final QA batch pending lab sign-off",
  },
  {
    id: "BATCH-7820", sku: "SKU-MF-002", product: "Maize Flour (Fine Grade)", category: "Processed",
    targetQty: "5,000", producedQty: "3,200", unit: "kg", progress: 64, status: "In Production",
    startDate: "2026-07-22", expectedEnd: "2026-07-26", line: "Line B",
    supervisor: "Alice Ingabire", yieldRate: 94.8,
  },
  {
    id: "BATCH-7819", sku: "SKU-RB-003", product: "Rice Bran Oil", category: "Oils",
    targetQty: "800", producedQty: "800", unit: "litres", progress: 100, status: "Completed",
    startDate: "2026-07-15", expectedEnd: "2026-07-19", line: "Line C",
    supervisor: "Paul Nkurunziza", yieldRate: 96.5,
  },
  {
    id: "BATCH-7818", sku: "SKU-TM-004", product: "Tomato Paste", category: "Processed",
    targetQty: "1,200", producedQty: "450", unit: "kg", progress: 37, status: "In Production",
    startDate: "2026-07-23", expectedEnd: "2026-07-27", line: "Line A",
    supervisor: "Jean Uwimana", yieldRate: 91.3,
  },
  {
    id: "BATCH-7817", sku: "SKU-SS-005", product: "Soybean Snacks", category: "Snacks",
    targetQty: "600", producedQty: "0", unit: "kg", progress: 0, status: "Draft",
    startDate: "2026-07-25", expectedEnd: "2026-07-29", line: "Line B",
    supervisor: "Alice Ingabire", yieldRate: 0,
    notes: "Awaiting raw material delivery from supplier",
  },
];

export const dailyOutputData = [
  { day: "D1", output: 580 }, { day: "D3", output: 620 }, { day: "D5", output: 590 },
  { day: "D7", output: 680 }, { day: "D9", output: 640 }, { day: "D11", output: 710 },
  { day: "D13", output: 695 }, { day: "D15", output: 730 }, { day: "D17", output: 680 },
  { day: "D19", output: 650 }, { day: "D21", output: 720 }, { day: "D23", output: 740 },
  { day: "D25", output: 710 }, { day: "D27", output: 760 }, { day: "D30", output: 748 },
];
