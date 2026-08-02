import { useEffect } from "react";
import { useCartStore } from "@/lib/store/use-cart-store";
import { useWishlistStore } from "@/lib/store/use-wishlist-store";

export const useSyncUserData = (userId?: string | null) => {
  useEffect(() => {
    if (userId) {
      useCartStore.getState().loadUserCart(userId);
      useWishlistStore.getState().loadUserWishlist(userId);
    }
  }, [userId]);
};

export default useSyncUserData;
