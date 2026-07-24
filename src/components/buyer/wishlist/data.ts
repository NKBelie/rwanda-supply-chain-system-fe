export type WishlistItem = {
  id: string;
  productId: string;
  name: string;
  category: string;
  supplier: string;
  location: string;
  price: string;
  pricePerUnit: number;
  unit: string;
  stock: string;
  stockQty: number;
  rating: number;
  image: string; // external Unsplash URL — not stored in this project
  addedAt: string;
  priceAlert: number | null;
  inStock: boolean;
};

export const wishlistItems: WishlistItem[] = [
  {
    id: "WL-001", productId: "MP-001", name: "Premium Arabica Coffee",
    category: "Beverages", supplier: "Musanze Cooperative", location: "Musanze",
    price: "RWF 3,500/kg", pricePerUnit: 3500, unit: "kg",
    stock: "240 kg available", stockQty: 240, rating: 4.8,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80&fit=crop",
    addedAt: "2026-07-15", priceAlert: 3000, inStock: true,
  },
  {
    id: "WL-002", productId: "MP-006", name: "Hass Avocado (Export)",
    category: "Fruits", supplier: "Nyagatare Farm", location: "Nyagatare",
    price: "RWF 400/pc", pricePerUnit: 400, unit: "piece",
    stock: "1,200 pcs available", stockQty: 1200, rating: 4.8,
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&q=80&fit=crop",
    addedAt: "2026-07-18", priceAlert: null, inStock: true,
  },
  {
    id: "WL-003", productId: "MP-005", name: "Irish Potatoes",
    category: "Vegetables", supplier: "Musanze Farm Coop", location: "Musanze",
    price: "RWF 650/kg", pricePerUnit: 650, unit: "kg",
    stock: "Restock expected Jul 28", stockQty: 0, rating: 4.5,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80&fit=crop",
    addedAt: "2026-07-10", priceAlert: 500, inStock: false,
  },
];
