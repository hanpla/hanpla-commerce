import useHydrated from "@/lib/hooks/use-hydrated";
import { useWishlistStore } from "@/lib/store/use-wishlist-store";

export const useWishlist = (productId?: string) => {
  const store = useWishlistStore();
  const isHydrated = useHydrated();

  const isWishlisted = productId && isHydrated ? store.isInWishlist(productId) : false;
  const wishlistCount = isHydrated ? store.wishlistIds.length : 0;

  const toggleWishlist = () => {
    if (productId) {
      store.toggleWishlist(productId);
    }
  };

  return {
    isWishlisted,
    toggleWishlist,
    wishlistCount,
    wishlistIds: isHydrated ? store.wishlistIds : [],
  };
};
