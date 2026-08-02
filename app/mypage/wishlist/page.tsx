"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import HeartIcon from "@/components/icons/heart-icon";
import ProductCard from "@/components/product/product-card";
import WishlistSkeleton from "@/components/mypage/wishlist-skeleton";
import { getProducts } from "@/lib/api/products";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { Product } from "@/types/product";

const WishlistPage = () => {
  const isHydrated = useHydrated();
  const { wishlistIds, wishlistCount } = useWishlist();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const products = await getProducts();
        if (isMounted) {
          setAllProducts(products);
        }
      } catch {
        if (isMounted) {
          setAllProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const wishlistedProducts = useMemo(() => {
    if (!wishlistIds || wishlistIds.length === 0) return [];
    const wishlistSet = new Set(wishlistIds);
    return allProducts.filter((p) => wishlistSet.has(p.id));
  }, [allProducts, wishlistIds]);

  if (!isHydrated || isLoading) {
    return <WishlistSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-neutral-900">위시리스트</h1>
            <span className="rounded-full bg-neutral-900 px-2.5 py-0.5 text-xs font-bold text-white">
              {wishlistCount}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-neutral-500">
            마음에 드는 상품을 모아 한눈에 확인하세요.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/50 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
            <HeartIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-base font-bold text-neutral-900">찜한 상품이 없습니다</h2>
          <p className="mt-1 text-xs text-neutral-500">
            마음에 드는 상품의 하트를 눌러 위시리스트에 담아보세요!
          </p>
          <Link
            href="/products"
            className="mt-6 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-bold text-white transition-transform hover:scale-105"
          >
            상품 둘러보기
          </Link>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
