export type Product = {
  id: number;
  name: string;
  category: string;
  supplier: string;
  price: string;
  stock: string;
  rating: number;
  verified: boolean;
  location: string;
  image: string;
};

export type Order = {
  id: string;
  product: string;
  supplier: string;
  quantity: string;
  amount: string;
  status: "Pending" | "Processing" | "Shipping" | "Delivered" | "Cancelled";
  date: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  detail: string;
  type: "Order" | "Payment" | "Delivery" | "Message" | "System";
  read: boolean;
};

export type PaymentRecord = {
  id: string;
  invoice: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
};

export const products: Product[] = [
  { id: 1, name: "Premium Rice", category: "Grains", supplier: "Kigali Grain Hub", price: "RWF 2,300/kg", stock: "540 kg", rating: 4.8, verified: true, location: "Kigali", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80&fit=crop" },
  { id: 2, name: "Arabica Coffee", category: "Beverages", supplier: "Musanze Cooperative", price: "RWF 3,500/kg", stock: "240 kg", rating: 4.7, verified: true, location: "Musanze", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80&fit=crop" },
  { id: 3, name: "Fresh Tomatoes", category: "Vegetables", supplier: "Gasabo Produce", price: "RWF 800/kg", stock: "310 kg", rating: 4.9, verified: true, location: "Gasabo", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80&fit=crop" },
  { id: 4, name: "Maize Flour", category: "Processed", supplier: "Rwanda Foods", price: "RWF 1,650/kg", stock: "180 kg", rating: 4.6, verified: true, location: "Rubavu", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80&fit=crop" },
];

export const orders: Order[] = [
  { id: "B-1101", product: "Premium Rice", supplier: "Kigali Grain Hub", quantity: "500 kg", amount: "RWF 1,150,000", status: "Shipping", date: "2026-07-21" },
  { id: "B-1102", product: "Arabica Coffee", supplier: "Musanze Cooperative", quantity: "250 kg", amount: "RWF 875,000", status: "Processing", date: "2026-07-20" },
  { id: "B-1103", product: "Fresh Tomatoes", supplier: "Gasabo Produce", quantity: "300 kg", amount: "RWF 240,000", status: "Delivered", date: "2026-07-18" },
];

export const notifications: NotificationItem[] = [
  { id: 1, title: "Payment cleared", detail: "Invoice INV-104 has been processed.", type: "Payment", read: false },
  { id: 2, title: "Order shipped", detail: "Your order B-1101 is on the way.", type: "Delivery", read: false },
  { id: 3, title: "Supplier message", detail: "New quote received for Premium Rice.", type: "Message", read: true },
];

export const payments: PaymentRecord[] = [
  { id: "P-201", invoice: "INV-104", amount: "RWF 275,000", status: "Pending" },
  { id: "P-202", invoice: "INV-105", amount: "RWF 180,000", status: "Paid" },
  { id: "P-203", invoice: "INV-106", amount: "RWF 420,000", status: "Overdue" },
];
