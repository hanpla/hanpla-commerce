"use client";

import { useState } from "react";
import Link from "next/link";
import CheckoutOrderSummary from "@/components/checkout/checkout-order-summary";
import DeliverySection, { DeliveryInfo } from "@/components/checkout/delivery-section";
import PaymentButton from "@/components/checkout/payment-button";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useCartStore } from "@/lib/store/use-cart-store";
import { calculateCartSummary } from "@/lib/utils/cart";

const CheckoutPage = () => {
  const store = useCartStore();
  const isHydrated = useHydrated();
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    recipient: "",
    phone: "",
    zipcode: "",
    address: "",
    addressDetail: "",
  });

  if (!isHydrated) return null;

  // 선택된 상품 목록 (없을 경우 전체 상품)
  const selectedItems = store.items.filter((i) => i.isSelected);
  const checkoutItems = selectedItems.length > 0 ? selectedItems : store.items;
  const summary = calculateCartSummary(checkoutItems);

  const orderName =
    checkoutItems.length > 0
      ? checkoutItems.length === 1
        ? checkoutItems[0].product.name
        : `${checkoutItems[0].product.name} 외 ${checkoutItems.length - 1}건`
      : "상품 결제";

  return (
    <div className="mx-auto max-w-5xl flex-col gap-6 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 border-b border-neutral-200 pb-4">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">ORDER & PAYMENT</h1>
        <p className="text-xs text-neutral-500">배송지 정보를 확인하고 결제를 완료하세요.</p>
      </div>

      {checkoutItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="text-sm font-bold text-neutral-700">주문할 상품이 없습니다.</p>
          <p className="mt-1 text-xs text-neutral-400">
            장바구니에 상품을 담은 후 결제를 진행해 주세요.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-xl bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-neutral-800"
          >
            상품 보러가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left Column: Delivery Info Form */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <DeliverySection value={deliveryInfo} onChange={setDeliveryInfo} />
          </div>

          {/* Right Column: Order Summary & Toss Payment Button */}
          <div className="sticky top-24 flex flex-col gap-6 lg:col-span-1">
            <CheckoutOrderSummary items={checkoutItems} summary={summary} />
            <PaymentButton
              amount={summary.finalTotal}
              orderName={orderName}
              deliveryInfo={deliveryInfo}
              cartItems={checkoutItems}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
