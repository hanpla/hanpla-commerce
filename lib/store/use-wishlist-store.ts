import { WishlistActions, WishlistState } from "@/types/wishlist";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistIds: ["prod-1", "prod-4"], // Default initial sample items

      toggleWishlist: (productId: string) => {
        const current = get().wishlistIds;
        if (current.includes(productId)) {
          set({ wishlistIds: current.filter((id) => id !== productId) });
        } else {
          set({ wishlistIds: [...current, productId] });
        }
      },

      isInWishlist: (productId: string) => {
        return get().wishlistIds.includes(productId);
      },

      clearWishlist: () => {
        set({ wishlistIds: [] });
      },
    }),
    {
      name: "hanpla-wishlist-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (null as never)
      ),
    }
  )
);
