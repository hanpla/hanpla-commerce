"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import CartIcon from "@/components/icons/cart-icon";
import CloseIcon from "@/components/icons/close-icon";
import Button from "@/components/ui/button";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useCartStore } from "@/lib/store/use-cart-store";
import { calculateCartSummary } from "@/lib/utils/cart";
import { getBlurDataURL } from "@/lib/utils/image";
import { CartItem } from "@/types/cart";

// 로컬 헬퍼 1: 드로어 백드롭
const DrawerBackdrop = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity"
    />
  );
};

// 로컬 헬퍼 2: 수량 증감 버튼
const QuantityStepButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer px-2 py-0.5 text-xs text-neutral-600 transition-colors select-none hover:bg-neutral-100"
    >
      {children}
    </button>
  );
};

// 로컬 헬퍼 3: 단일 장바구니 드로어 아이템
const CartDrawerItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}) => {
  const { product, selectedOption, quantity, id } = item;

  return (
    <div className="flex gap-3 border-b border-neutral-100 py-3 last:border-0">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          placeholder="blur"
          blurDataURL={getBlurDataURL(80, 100)}
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <span className="text-xs font-medium text-neutral-500">{product.brand}</span>
            <button
              onClick={() => onRemove(id)}
              className="cursor-pointer p-0.5 text-neutral-400 hover:text-neutral-900"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
          <h4 className="mt-0.5 line-clamp-1 text-xs font-semibold text-neutral-900">
            {product.name}
          </h4>
          <p className="mt-1 text-xs text-neutral-500">
            옵션: {selectedOption.color.name} / {selectedOption.size}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-md border border-neutral-200 bg-white">
            <QuantityStepButton onClick={() => onUpdateQuantity(id, quantity - 1)}>
              -
            </QuantityStepButton>
            <span className="px-2 text-xs font-medium">{quantity}</span>
            <QuantityStepButton onClick={() => onUpdateQuantity(id, quantity + 1)}>
              +
            </QuantityStepButton>
          </div>
          <span className="text-xs font-bold text-neutral-900">
            {(product.price * quantity).toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

// 메인 장바구니 드로어 컴포넌트
const CartDrawer = () => {
  const store = useCartStore();
  const isHydrated = useHydrated();

  if (!isHydrated || !store.isOpen) return null;

  const summary = calculateCartSummary(store.items);

  return (
    <>
      <DrawerBackdrop onClick={store.closeDrawer} />
      <div className="animate-in slide-in-from-right fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <div className="flex items-center gap-2">
            <CartIcon className="h-5 w-5" />
            <h3 className="text-base font-bold text-neutral-900">
              장바구니 ({store.items.length})
            </h3>
          </div>
          <button
            onClick={store.closeDrawer}
            className="cursor-pointer rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {store.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-neutral-400">
              <CartIcon className="h-12 w-12 stroke-1" />
              <p className="text-sm font-medium">장바구니가 비어 있습니다.</p>
            </div>
          ) : (
            store.items.map((item) => (
              <CartDrawerItem
                key={item.id}
                item={item}
                onUpdateQuantity={store.updateQuantity}
                onRemove={store.removeItem}
              />
            ))
          )}
        </div>

        {/* Footer Summary */}
        {store.items.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-neutral-600">총 선택 금액</span>
              <span className="font-bold text-neutral-900">
                {summary.subtotal.toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>배송비</span>
              <span>
                {summary.shippingFee === 0
                  ? "무료배송"
                  : `${summary.shippingFee.toLocaleString()}원 (5만원 이상 무료)`}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <Link href="/cart" onClick={store.closeDrawer} className="flex-1">
                <Button variant="outline" className="w-full">
                  장바구니 전체보기
                </Button>
              </Link>
              <Link href="/cart" onClick={store.closeDrawer} className="flex-1">
                <Button variant="primary" className="w-full">
                  주문하기
                </Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CartDrawer;
