"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CheckIcon from "@/components/icons/check-icon";
import Button from "@/components/ui/button";
import { useCartStore } from "@/lib/store/use-cart-store";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const store = useCartStore();

  useEffect(() => {
    let isCancelled = false;

    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setErrorMessage("결제 승인 파라미터가 유효하지 않습니다.");
        return;
      }

      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const result = await response.json();

        if (!isCancelled) {
          if (response.ok && result.success) {
            setStatus("success");
            store.clearCart();
          } else {
            setStatus("error");
            setErrorMessage(result.message || "결제 승인 과정에서 오류가 발생했습니다.");
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          setStatus("error");
          const msg = err instanceof Error ? err.message : "서버 통신 중 오류가 발생했습니다.";
          setErrorMessage(msg);
        }
      }
    };

    confirmPayment();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentKey, orderId, amount]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
        <h2 className="mt-4 text-base font-bold text-neutral-900">결제 승인 처리 중...</h2>
        <p className="mt-1 text-xs text-neutral-500">
          토스페이먼츠 서버와 통신하여 결제 승인 및 주문 내역을 저장하고 있습니다.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 font-bold text-rose-600">
          ✕
        </div>
        <h2 className="mt-4 text-lg font-black text-rose-900">결제 승인 실패</h2>
        <p className="mt-2 text-xs leading-relaxed text-rose-700">{errorMessage}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/checkout">
            <Button variant="outline" size="md" className="rounded-xl">
              결제 다시 시도
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="primary" size="md" className="rounded-xl">
              장바구니 이동
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckIcon className="h-8 w-8" />
      </div>

      <h2 className="mt-4 text-2xl font-black text-neutral-900">
        주문이 성공적으로 완료되었습니다!
      </h2>
      <p className="mt-1 text-xs text-neutral-500">
        회원님의 주문 내역이 성공적으로 등록되었습니다.
      </p>

      <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-neutral-50 p-4 text-left text-xs">
        <div className="flex justify-between border-b border-neutral-200/60 pb-2 text-neutral-600">
          <span>주문번호</span>
          <span className="font-mono font-bold text-neutral-900">{orderId}</span>
        </div>
        <div className="flex justify-between pt-1 text-neutral-600">
          <span>최종 결제 금액</span>
          <span className="font-extrabold text-rose-600">{Number(amount).toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/mypage/orders" className="flex-1">
          <Button variant="outline" size="lg" className="w-full rounded-xl font-bold">
            주문 내역 보기
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button variant="primary" size="lg" className="w-full rounded-xl font-bold">
            쇼핑 계속하기
          </Button>
        </Link>
      </div>
    </div>
  );
};

const CheckoutSuccessPage = () => {
  return (
    <div className="py-12">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
            <p className="mt-4 text-xs font-bold text-neutral-500">결제 정보 확인 중...</p>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
};

export default CheckoutSuccessPage;
