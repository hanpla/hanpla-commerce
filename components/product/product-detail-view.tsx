"use client";

import { useState } from "react";
import CartIcon from "@/components/icons/cart-icon";
import HeartIcon from "@/components/icons/heart-icon";
import StarIcon from "@/components/icons/star-icon";
import ImageGallery from "@/components/product/image-gallery";
import OptionSelector from "@/components/product/option-selector";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { useCartStore } from "@/lib/store/use-cart-store";
import { Product, ProductColor, ProductSize } from "@/types/product";

// 로컬 헬퍼: 수량 조절 컨트롤러
const QuantityController = ({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        QUANTITY
      </span>
      <div className="flex items-center overflow-hidden rounded-lg border border-neutral-300 bg-white">
        <button
          onClick={onDecrease}
          className="cursor-pointer px-3 py-1.5 text-sm font-semibold text-neutral-600 select-none hover:bg-neutral-100"
        >
          -
        </button>
        <span className="px-4 text-xs font-bold">{quantity}</span>
        <button
          onClick={onIncrease}
          className="cursor-pointer px-3 py-1.5 text-sm font-semibold text-neutral-600 select-none hover:bg-neutral-100"
        >
          +
        </button>
      </div>
    </div>
  );
};

// 메인 상품 상세 클라이언트 뷰
const ProductDetailView = ({ product }: { product: Product }) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.options[0]?.color || { name: "Default", hex: "#000000" }
  );
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.options[0]?.sizes[0] || "FREE"
  );
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const cartStore = useCartStore();

  const handleAddToCart = () => {
    cartStore.addItem(product, { color: selectedColor, size: selectedSize }, quantity);
  };

  return (
    <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-2 lg:gap-14">
      {/* Left Image Gallery */}
      <ImageGallery images={product.images} productName={product.name} />

      {/* Right Details */}
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700">
              <StarIcon className="h-4 w-4 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-neutral-400">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="text-2xl leading-snug font-black tracking-tight text-neutral-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-2.5">
            {product.discountRate ? (
              <Badge variant="discount" className="px-2.5 py-1 text-sm">
                {product.discountRate}% OFF
              </Badge>
            ) : null}
            <span className="text-2xl font-black text-neutral-900">
              {product.price.toLocaleString()}원
            </span>
            {product.originalPrice ? (
              <span className="text-sm text-neutral-400 line-through">
                {product.originalPrice.toLocaleString()}원
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-xs leading-relaxed text-neutral-600">
          {product.description}
        </div>

        {/* Option Selector Component */}
        <OptionSelector
          options={product.options}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onSelectColor={setSelectedColor}
          onSelectSize={setSelectedSize}
        />

        {/* Quantity Controller */}
        <QuantityController
          quantity={quantity}
          onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          onIncrease={() => setQuantity((q) => q + 1)}
        />

        {/* Total Price Summary */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-neutral-500">총 구매 금액</span>
          <span className="text-xl font-black text-neutral-900">
            {(product.price * quantity).toLocaleString()}원
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              isLiked
                ? "border-rose-300 bg-rose-50 text-rose-600"
                : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            }`}
            aria-label="위시리스트 추가"
          >
            <HeartIcon className="h-5 w-5" filled={isLiked} />
          </button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 gap-2 rounded-xl"
          >
            <CartIcon className="h-5 w-5" />
            장바구니 담기
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 rounded-xl"
          >
            바로 구매하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
