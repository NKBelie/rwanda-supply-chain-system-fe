import { create } from "zustand";
import { Product } from "@/lib/storage";
import { storageService, STORAGE_KEYS } from "@/lib/storage";

interface ProductStore {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    
    // Fetch products
    fetchProducts: (farmerId?: string) => void;
    
    // CRUD operations
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProductById: (id: string) => Product | undefined;
    
    // Filters
    getProductsByStatus: (status: string) => Product[];
    getProductsByCategory: (category: string) => Product[];
    getProductsByFarmer: (farmerId: string) => Product[];
    
    // Search
    searchProducts: (query: string) => Product[];
    }

    export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: (farmerId?: string) => {
        set({ isLoading: true });
        try {
        let products = storageService.get<Product[]>(STORAGE_KEYS.PRODUCTS) || [];
        
        if (farmerId) {
            products = products.filter((p) => p.farmerId === farmerId);
        }
        
        set({ products, isLoading: false });
        } catch (error) {
        set({
            error: error instanceof Error ? error.message : "Failed to fetch products",
            isLoading: false,
        });
        }
    },

    addProduct: (product: Product) => {
        try {
        const updated = storageService.addToArray(STORAGE_KEYS.PRODUCTS, product);
        set({ products: updated });
        } catch (error) {
        set({ error: error instanceof Error ? error.message : "Failed to add product" });
        }
    },

    updateProduct: (id: string, updates: Partial<Product>) => {
        try {
        const updated = storageService.updateInArray(STORAGE_KEYS.PRODUCTS, id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
        set({ products: updated });
        } catch (error) {
        set({ error: error instanceof Error ? error.message : "Failed to update product" });
        }
    },

    deleteProduct: (id: string) => {
        try {
        const updated = storageService.removeFromArray<Product>(STORAGE_KEYS.PRODUCTS, id);
        set({ products: updated as Product[] });
        } catch (error) {
        set({ error: error instanceof Error ? error.message : "Failed to delete product" });
        }
    },

    getProductById: (id: string) => {
        return get().products.find((p) => p.id === id);
    },

    getProductsByStatus: (status: string) => {
        return get().products.filter((p) => p.status === status);
    },

    getProductsByCategory: (category: string) => {
        return get().products.filter((p) => p.category === category);
    },

    getProductsByFarmer: (farmerId: string) => {
        return get().products.filter((p) => p.farmerId === farmerId);
    },

    searchProducts: (query: string) => {
        const lowerQuery = query.toLowerCase();
        return get().products.filter((p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
        );
    },
}));
