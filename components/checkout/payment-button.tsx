"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { createPendingOrderInDb } from "@/lib/api/orders-db";
import useAuth from "@/lib/hooks/use-auth";
import { CartItem } from "@/types/cart";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { DeliveryInfo } from "./delivery-section";

const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_P9BRQmyarYx7vMon6knpVJ07KzLN";

type PaymentButtonProps = {
  amount: number;
  orderName: string;
  deliveryInfo: DeliveryInfo;
  cartItems: CartItem[];
};

const PaymentButton = ({ amount, orderName, deliveryInfo, cartItems }: PaymentButtonProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!deliveryInfo.recipient || !deliveryInfo.phone || !deliveryInfo.address) {
      alert("배송지 정보를 모두 입력해 주세요.");
      return;
    }

    if (amount <= 0 || cartItems.length === 0) {
      alert("결제할 상품이 없습니다.");
      return;
    }

    if (!user?.id) {
      alert("로그인이 유효하지 않습니다. 다시 로그인해 주세요.");
      return;
    }

    try {
      setIsLoading(true);

      // 토스페이먼츠 SDK 로드
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);

      // 고유 주문 번호 생성 (timestamp + random hex)
      const orderId = `HANPLA_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // 1. Supabase DB orders 테이블에 PENDING 상태로 미리 저장 (보안 및 유실 방지)
      const pendingItems = cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        colorName: item.selectedOption.color.name,
        colorHex: item.selectedOption.color.hex,
        size: item.selectedOption.size,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const isSuccess = await createPendingOrderInDb({
        orderId,
        orderName,
        userId: user.id,
        amount,
        recipientName: deliveryInfo.recipient,
        recipientPhone: deliveryInfo.phone,
        zipcode: deliveryInfo.zipcode,
        address: deliveryInfo.address,
        addressDetail: deliveryInfo.addressDetail,
        items: pendingItems,
      });

      if (!isSuccess) {
        alert("주문 대기 정보 생성 중 오류가 발생했습니다.");
        setIsLoading(false);
        return;
      }

      const origin = window.location.origin;
      const successUrl = `${origin}/checkout/success`;
      const failUrl = `${origin}/checkout/fail`;

      // 2. 토스페이먼츠 결제창 호출
      await tossPayments.requestPayment("카드", {
        amount,
        orderId,
        orderName,
        customerName: deliveryInfo.recipient,
        successUrl,
        failUrl,
      });
    } catch (error: unknown) {
      console.error("Toss Payments request error:", error);
      const errObj = error as { code?: string; message?: string };
      if (errObj?.code !== "USER_CANCEL") {
        alert(`결제 창 호출 중 오류가 발생했습니다: ${errObj?.message || error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      size="lg"
      disabled={isLoading || amount <= 0 || cartItems.length === 0}
      onClick={handlePayment}
      className="w-full rounded-2xl font-black shadow-lg"
    >
      {isLoading ? "결제창 호출 중..." : `${amount.toLocaleString()}원 결제하기`}
    </Button>
  );
};

export default PaymentButton;
