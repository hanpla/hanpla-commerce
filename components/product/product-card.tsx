"use client";

import Image from "next/image";
import Link from "next/link";
import StarIcon from "@/components/icons/star-icon";
import WishlistButton from "@/components/product/wishlist-button";
import Badge from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format";
import { getBlurDataURL } from "@/lib/utils/image";
import { Product } from "@/types/product";

// 로컬 헬퍼: 상품 가격 표시부
const ProductPriceView = ({
  price,
  originalPrice,
  discountRate,
}: {
  price: number;
  originalPrice?: number;
  discountRate?: number;
}) => {
  return (
    <div className="mt-1 flex items-baseline gap-1.5">
      {discountRate ? (
        <span className="text-sm font-extrabold text-rose-600">{discountRate}%</span>
      ) : null}
      <span className="text-base font-extrabold text-neutral-900">{formatPrice(price)}</span>
      {originalPrice ? (
        <span className="text-xs font-normal text-neutral-400 line-through">
          {formatPrice(originalPrice)}
        </span>
      ) : null}
    </div>
  );
};

// 메인 ProductCard 컴포넌트
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      href={`/products/detail/${product.id}`}
      className="group flex flex-col gap-2.5 transition-transform duration-200"
    >
      {/* Image Wrapper */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-xs">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          placeholder="blur"
          blurDataURL={getBlurDataURL(300, 400)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges Top-Left */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.isBest ? <Badge variant="dark">BEST</Badge> : null}
          {product.isNew ? <Badge variant="new">NEW</Badge> : null}
        </div>

        {/* Wishlist Top-Right */}
        <div className="absolute top-3 right-3">
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
            <StarIcon className="h-3.5 w-3.5 text-amber-400" />
            <span>{product.rating}</span>
            <span className="text-neutral-300">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="line-clamp-1 text-sm font-semibold text-neutral-900 transition-colors group-hover:text-neutral-600">
          {product.name}
        </h3>

        <ProductPriceView
          price={product.price}
          originalPrice={product.originalPrice}
          discountRate={product.discountRate}
        />
      </div>
    </Link>
  );
};

export default ProductCard;
