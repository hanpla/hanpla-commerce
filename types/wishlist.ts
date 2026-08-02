export type WishlistState = {
  wishlistIds: string[];
};

export type WishlistActions = {
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  loadUserWishlist: (userId: string) => Promise<void>;
};
