export type Category = "All" | "Grains" | "Vegetables" | "Beverages" | "Processed" | "Livestock" | "Fruits";

export type MarketProduct = {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  supplier: string;
  location: string;
  price: string;
  pricePerUnit: number;
  unit: string;
  stock: string;
  stockQty: number;
  rating: number;
  reviews: number;
  verified: boolean;
  image: string;
  description: string;
  minOrder: string;
  tags: string[];
};

export const CATEGORIES: Category[] = ["All", "Grains", "Vegetables", "Beverages", "Processed", "Livestock", "Fruits"];

export const marketProducts: MarketProduct[] = [
  {
    id: "MP-001", name: "Premium Arabica Coffee", category: "Beverages",
    supplier: "Musanze Cooperative", location: "Musanze", price: "RWF 3,500/kg",
    pricePerUnit: 3500, unit: "kg", stock: "240 kg available", stockQty: 240,
    rating: 4.8, reviews: 52, verified: true, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80&fit=crop",
    description: "Single-origin Arabica coffee beans, washed and sun-dried. Grade A certified by NAEB.",
    minOrder: "10 kg", tags: ["Organic", "Export Grade", "NAEB Certified"],
  },
  {
    id: "MP-002", name: "Long Grain White Rice", category: "Grains",
    supplier: "Kigali Grain Hub", location: "Kigali", price: "RWF 2,300/kg",
    pricePerUnit: 2300, unit: "kg", stock: "540 kg available", stockQty: 540,
    rating: 4.7, reviews: 38, verified: true, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&fit=crop",
    description: "Premium long-grain white rice sourced from Eastern Province irrigation schemes.",
    minOrder: "50 kg", tags: ["Bulk Available", "Milled"],
  },
  {
    id: "MP-003", name: "Fresh Tomatoes", category: "Vegetables",
    supplier: "Gasabo Produce", location: "Gasabo", price: "RWF 800/kg",
    pricePerUnit: 800, unit: "kg", stock: "310 kg available", stockQty: 310,
    rating: 4.9, reviews: 71, verified: true, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80&fit=crop",
    description: "Farm-fresh tomatoes harvested daily. Ideal for processing or direct retail.",
    minOrder: "20 kg", tags: ["Fresh", "Daily Harvest"],
  },
  {
    id: "MP-004", name: "Maize Flour (Refined)", category: "Processed",
    supplier: "Rwanda Foods Ltd", location: "Rubavu", price: "RWF 1,650/kg",
    pricePerUnit: 1650, unit: "kg", stock: "180 kg available", stockQty: 180,
    rating: 4.6, reviews: 29, verified: true, image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&fit=crop",
    description: "Double-refined maize flour. Suitable for industrial bakeries and food manufacturers.",
    minOrder: "25 kg", tags: ["Refined", "Industrial"],
  },
  {
    id: "MP-005", name: "Irish Potatoes", category: "Vegetables",
    supplier: "Musanze Farm Coop", location: "Musanze", price: "RWF 650/kg",
    pricePerUnit: 650, unit: "kg", stock: "800 kg available", stockQty: 800,
    rating: 4.5, reviews: 44, verified: true, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80&fit=crop",
    description: "Grade A Irish potatoes from Musanze highlands. Low moisture, high starch variety.",
    minOrder: "100 kg", tags: ["Highlands", "Grade A"],
  },
  {
    id: "MP-006", name: "Avocado (Hass)", category: "Fruits",
    supplier: "Nyagatare Farm", location: "Nyagatare", price: "RWF 400/pc",
    pricePerUnit: 400, unit: "piece", stock: "1,200 pcs available", stockQty: 1200,
    rating: 4.8, reviews: 63, verified: true, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80&fit=crop",
    description: "Export-quality Hass avocados. Sourced from certified farms with cold chain support.",
    minOrder: "200 pcs", tags: ["Export Quality", "Cold Chain"],
  },
  {
    id: "MP-007", name: "Sorghum (Whole Grain)", category: "Grains",
    supplier: "AgriFinance Coop", location: "Huye", price: "RWF 1,100/kg",
    pricePerUnit: 1100, unit: "kg", stock: "420 kg available", stockQty: 420,
    rating: 4.4, reviews: 18, verified: false, image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80&fit=crop",
    description: "Whole grain sorghum for brewing, flour production or animal feed.",
    minOrder: "50 kg", tags: ["Brewing", "Animal Feed"],
  },
  {
    id: "MP-008", name: "Beef (Chilled)", category: "Livestock",
    supplier: "Kigali Meat Hub", location: "Kigali", price: "RWF 8,500/kg",
    pricePerUnit: 8500, unit: "kg", stock: "90 kg available", stockQty: 90,
    rating: 4.7, reviews: 33, verified: true, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&fit=crop",
    description: "Halal-certified chilled beef. Processed in ISO-certified facility. Available in bulk cuts.",
    minOrder: "5 kg", tags: ["Halal", "Chilled", "ISO Certified"],
  },
];

export type QuoteRequest = {
  id: string;
  productId: string;
  productName: string;
  supplier: string;
  quantity: string;
  message: string;
  status: "Sent" | "Responded" | "Pending";
  createdAt: string;
};

export const rfqSample: QuoteRequest[] = [
  { id: "RFQ-001", productId: "MP-001", productName: "Premium Arabica Coffee", supplier: "Musanze Cooperative", quantity: "50 kg", message: "Need bulk pricing for regular monthly supply.", status: "Responded", createdAt: "2026-07-20" },
  { id: "RFQ-002", productId: "MP-002", productName: "Long Grain White Rice", supplier: "Kigali Grain Hub", quantity: "200 kg", message: "Requesting discount for 6-month contract.", status: "Pending", createdAt: "2026-07-22" },
];
