export type WishlistState = {
  wishlistIds: string[];
};

export type WishlistActions = {
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};
