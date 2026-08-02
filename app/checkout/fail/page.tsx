"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";

const PaymentFailContent = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "UNKNOWN_ERROR";
  const message = searchParams.get("message") || "결제 과정에서 오류가 발생했습니다.";

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center shadow-xs">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-xl font-black text-rose-600">
        !
      </div>

      <h2 className="mt-4 text-xl font-black text-rose-900">결제가 취소되었거나 실패했습니다</h2>

      <div className="mt-4 rounded-2xl border border-rose-100 bg-white/80 p-4 text-left">
        <p className="font-mono text-[11px] font-bold text-rose-500 uppercase">오류 코드: {code}</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-700">{message}</p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <Link href="/checkout" className="flex-1">
          <Button variant="outline" size="md" className="w-full rounded-xl">
            다시 시도
          </Button>
        </Link>
        <Link href="/cart" className="flex-1">
          <Button variant="primary" size="md" className="w-full rounded-xl">
            장바구니 이동
          </Button>
        </Link>
      </div>
    </div>
  );
};

const CheckoutFailPage = () => {
  return (
    <div className="py-12">
      <Suspense
        fallback={
          <div className="py-24 text-center text-xs text-neutral-500">
            결제 취소 정보를 처리 중입니다...
          </div>
        }
      >
        <PaymentFailContent />
      </Suspense>
    </div>
  );
};

export default CheckoutFailPage;
