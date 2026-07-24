import { STORAGE_KEYS } from "./storage.keys";

class StorageService {
  /**
   * Save data to localStorage
   */
  save<T>(key: string, data: T): void {
    try {
      if (typeof window === "undefined") return;
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
    }
  }

  /**
   * Get data from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      if (typeof window === "undefined") return defaultValue || null;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Failed to retrieve from localStorage (${key}):`, error);
      return defaultValue || null;
    }
  }

  /**
   * Update data in localStorage
   */
  update<T>(key: string, updates: Partial<T>): T | null {
    try {
      const current = this.get<T>(key);
      if (!current) return null;
      const updated = { ...current, ...updates };
      this.save(key, updated);
      return updated;
    } catch (error) {
      console.error(`Failed to update localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Delete data from localStorage
   */
  delete(key: string): void {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to delete from localStorage (${key}):`, error);
    }
  }

  /**
   * Clear all RSCN data from localStorage
   */
  clearAll(): void {
    try {
      if (typeof window === "undefined") return;
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }

  /**
   * Get array from localStorage and add item
   */
  addToArray<T extends { id: string }>(key: string, item: T): T[] {
    try {
      const array = this.get<T[]>(key) || [];
      const exists = array.find((i) => i.id === item.id);
      if (!exists) {
        array.push(item);
        this.save(key, array);
      }
      return array;
    } catch (error) {
      console.error(`Failed to add to array (${key}):`, error);
      return [];
    }
  }

  /**
   * Update item in array
   */
  updateInArray<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T[] {
    try {
      const array = this.get<T[]>(key) || [];
      const updated = array.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      this.save(key, updated);
      return updated;
    } catch (error) {
      console.error(`Failed to update array item (${key}):`, error);
      return [];
    }
  }

  /**
   * Remove item from array
   */
  removeFromArray<T extends { id: string }>(key: string, id: string): T[] {
    try {
      const array = this.get<T[]>(key) || [];
      const filtered = array.filter((item) => item.id !== id);
      this.save(key, filtered);
      return filtered;
    } catch (error) {
      console.error(`Failed to remove from array (${key}):`, error);
      return [];
    }
  }

  /**
   * Get item from array by id
   */
  getFromArray<T extends { id: string }>(key: string, id: string): T | null {
    try {
      const array = this.get<T[]>(key) || [];
      return array.find((item) => item.id === id) || null;
    } catch (error) {
      console.error(`Failed to get array item (${key}):`, error);
      return null;
    }
  }

  /**
   * Filter array by predicate
   */
  filterArray<T>(key: string, predicate: (item: T) => boolean): T[] {
    try {
      const array = this.get<T[]>(key) || [];
      return array.filter(predicate);
    } catch (error) {
      console.error(`Failed to filter array (${key}):`, error);
      return [];
    }
  }

  /**
   * Get all items from localStorage that match RSCN keys
   */
  getAllRscnData(): Record<string, unknown> {
    try {
      if (typeof window === "undefined") return {};
      const data: Record<string, unknown> = {};
      Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
        const item = localStorage.getItem(value);
        if (item) {
          data[key] = JSON.parse(item);
        }
      });
      return data;
    } catch (error) {
      console.error("Failed to get all RSCN data:", error);
      return {};
    }
  }
}

export const storageService = new StorageService();
