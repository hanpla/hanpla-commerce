"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PackageIcon from "@/components/icons/package-icon";
import OrdersSkeleton from "@/components/mypage/orders-skeleton";
import Button from "@/components/ui/button";
import { fetchUserOrdersFromDb } from "@/lib/api/orders-db";
import useAuth from "@/lib/hooks/use-auth";
import { getBlurDataURL } from "@/lib/utils/image";
import { Order, OrderItem } from "@/types/order";

// 로컬 헬퍼 1: 주문 내역 상품 행
const OrderItemRow = ({ item }: { item: OrderItem }) => {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 py-2 last:border-0">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={item.productImage}
          alt={item.productName}
          fill
          placeholder="blur"
          blurDataURL={getBlurDataURL(56, 56)}
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/detail/${item.productId}`}
          className="block truncate text-xs font-bold text-neutral-900 hover:underline"
        >
          {item.productName}
        </Link>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          색상: {item.colorName} / 사이즈: {item.size} · {item.quantity}개
        </p>
      </div>
      <div className="text-right">
        <span className="text-xs font-extrabold text-neutral-900">
          {(item.price * item.quantity).toLocaleString()}원
        </span>
      </div>
    </div>
  );
};

// 로컬 헬퍼 2: 단일 주문 내역 카드
const OrderCard = ({ order }: { order: Order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs transition-all hover:shadow-md">
      {/* Header: Order ID & Status */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-900">{formattedDate}</span>
          <span className="font-mono text-[11px] text-neutral-400">({order.orderId})</span>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
          {order.status === "DONE" ? "결제완료" : order.status}
        </span>
      </div>

      {/* Items List */}
      <div className="mt-3 divide-y divide-neutral-100">
        {order.items?.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
      </div>

      {/* Footer: Delivery Info & Total Amount */}
      <div className="mt-4 flex flex-col items-start justify-between gap-2 border-t border-neutral-100 pt-3 sm:flex-row sm:items-center">
        <div className="text-[11px] text-neutral-500">
          수령인: <strong className="text-neutral-800">{order.recipientName}</strong> · [
          {order.zipcode}] {order.address} {order.addressDetail}
        </div>
        <div className="flex items-baseline gap-1.5 self-end sm:self-auto">
          <span className="text-xs font-medium text-neutral-500">총 결제금액</span>
          <span className="text-lg font-black text-rose-600">
            {order.amount.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

// 메인 OrdersPage 컴포넌트
const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  useEffect(() => {
    let isCancelled = false;

    if (!user?.id) {
      return;
    }

    fetchUserOrdersFromDb(user.id)
      .then((list) => {
        if (!isCancelled) {
          setOrders(list);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const showLoading = !user ? false : isLoading;

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "DONE") return o.status === "DONE";
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-900">주문 / 배송 내역</h2>
        <p className="mt-1 text-xs text-neutral-500">
          회원님의 상품 주문 내역 및 배송 상태를 실시간으로 조회하실 수 있습니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-neutral-200 pb-3 text-xs font-bold text-neutral-500">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`pb-1 whitespace-nowrap transition-colors ${
            activeTab === "ALL"
              ? "border-b-2 border-neutral-900 text-neutral-900"
              : "hover:text-neutral-900"
          }`}
        >
          전체 ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("DONE")}
          className={`pb-1 whitespace-nowrap transition-colors ${
            activeTab === "DONE"
              ? "border-b-2 border-neutral-900 text-neutral-900"
              : "hover:text-neutral-900"
          }`}
        >
          결제완료 ({orders.filter((o) => o.status === "DONE").length})
        </button>
      </div>

      {/* Orders Content */}
      {showLoading ? (
        <OrdersSkeleton />
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 py-16 text-center">
          <PackageIcon className="mx-auto h-10 w-10 text-neutral-300" />
          <p className="mt-3 text-sm font-bold text-neutral-700">진행된 주문 내역이 없습니다.</p>
          <p className="mt-1 text-xs text-neutral-400">
            원하는 상품을 담아 토스페이먼츠 결제를 진행해보세요!
          </p>
          <Link href="/products" className="mt-6 inline-block">
            <Button variant="primary" size="md" className="rounded-xl font-bold">
              인기 상품 구경하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
