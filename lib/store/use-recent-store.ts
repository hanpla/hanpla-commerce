import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/types/product";

export interface RecentProduct {
  product: Product;
  viewedAt: string;
}

interface RecentStore {
  items: RecentProduct[];
  addRecentProduct: (product: Product) => void;
  removeRecentProduct: (productId: string) => void;
  clearAll: () => void;
}

export const useRecentStore = create<RecentStore>()(
  persist(
    (set, get) => ({
      items: [],

      addRecentProduct: (product: Product) => {
        const current = get().items;
        const filtered = current.filter((item) => item.product.id !== product.id);

        const newItem: RecentProduct = {
          product,
          viewedAt: new Date().toISOString(),
        };

        // Keep maximum 10 items in rolling queue
        const updated = [newItem, ...filtered].slice(0, 10);
        set({ items: updated });
      },

      removeRecentProduct: (productId: string) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },

      clearAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: "hanpla_recent_viewed_storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
