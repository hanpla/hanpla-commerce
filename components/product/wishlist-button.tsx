"use client";

import { MouseEvent } from "react";
import HeartIcon from "@/components/icons/heart-icon";
import { useWishlist } from "@/lib/hooks/use-wishlist";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

const WishlistButton = ({ productId, className }: WishlistButtonProps) => {
  const { isWishlisted, toggleWishlist } = useWishlist(productId);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist();
  };

  return (
    <button
      onClick={handleClick}
      className={
        className ||
        `rounded-full p-2 backdrop-blur-md transition-all duration-200 ${
          isWishlisted
            ? "scale-110 bg-rose-500 text-white shadow-md"
            : "bg-white/70 text-neutral-700 hover:bg-white hover:text-rose-500"
        }`
      }
      aria-label="위시리스트 담기"
    >
      <HeartIcon className="h-4 w-4" filled={isWishlisted} />
    </button>
  );
};

export default WishlistButton;
