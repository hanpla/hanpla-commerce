import { useCallback } from "react";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useWishlistStore } from "@/lib/store/use-wishlist-store";

const EMPTY_WISHLIST_IDS: string[] = [];

export const useWishlist = (productId?: string) => {
  const isHydrated = useHydrated();

  const isWishlisted = useWishlistStore((state) =>
    productId && isHydrated ? state.wishlistIds.includes(productId) : false
  );

  const wishlistCount = useWishlistStore((state) => (isHydrated ? state.wishlistIds.length : 0));

  const wishlistIds = useWishlistStore((state) =>
    isHydrated ? state.wishlistIds : EMPTY_WISHLIST_IDS
  );

  const toggleWishlistStore = useWishlistStore((state) => state.toggleWishlist);

  const toggleWishlist = useCallback(() => {
    if (productId) {
      toggleWishlistStore(productId);
    }
  }, [productId, toggleWishlistStore]);

  return {
    isWishlisted,
    toggleWishlist,
    wishlistCount,
    wishlistIds,
  };
};
