import { create } from "zustand";
import {
  fetchUserWishlistFromDb,
  addWishlistItemToDb,
  deleteWishlistItemFromDb,
} from "@/lib/api/wishlist-db";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { WishlistActions, WishlistState } from "@/types/wishlist";

type WishlistStore = WishlistState & WishlistActions;

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  wishlistIds: [],

  loadUserWishlist: async (userId: string) => {
    if (!userId) {
      set({ wishlistIds: [] });
      return;
    }
    try {
      const dbWishlist = await fetchUserWishlistFromDb(userId);
      set({ wishlistIds: dbWishlist || [] });
    } catch {
      set({ wishlistIds: [] });
    }
  },

  toggleWishlist: (productId: string) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      if (typeof window !== "undefined") {
        alert("위시리스트(찜) 기능은 로그인 회원 전용 서비스입니다. 로그인 후 이용해 주세요.");
        window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      }
      return;
    }

    const current = get().wishlistIds;
    const isExists = current.includes(productId);

    if (isExists) {
      set({ wishlistIds: current.filter((id) => id !== productId) });
      deleteWishlistItemFromDb(userId, productId).catch(() => {});
    } else {
      set({ wishlistIds: [...current, productId] });
      addWishlistItemToDb(userId, productId).catch(() => {});
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.includes(productId);
  },

  clearWishlist: () => {
    set({ wishlistIds: [] });
  },
}));
