import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_sk_jExPeJWYVQbAXWl4Y6Evr49R5gvN";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { message: "필수 결제 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 1. Supabase Server Client로 로그인 사용자 정보 확인
    const reqCookies = request.headers.get("cookie") || "";
    const parsedCookies: Record<string, string> = {};
    reqCookies.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length >= 2) {
        parsedCookies[parts[0].trim()] = parts.slice(1).join("=").trim();
      }
    });

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll: () => Object.entries(parsedCookies).map(([name, value]) => ({ name, value })),
        setAll: () => {},
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    // 2. Supabase DB에서 PENDING 주문 검색 및 금액 교차 검증 (위변조 방지)
    const { data: existingOrder, error: fetchOrderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchOrderError || !existingOrder) {
      return NextResponse.json(
        { message: "결제 대기 중인 주문 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (Number(existingOrder.amount) !== Number(amount)) {
      return NextResponse.json(
        { message: "주문 금액이 일치하지 않습니다. 위변조 가능성이 있습니다." },
        { status: 400 }
      );
    }

    // 3. 토스페이먼츠 승인 API 호출 (Basic Auth: TOSS_SECRET_KEY:)
    const secretKeyBase64 = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
    const tossResponse = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${secretKeyBase64}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    const tossResult = await tossResponse.json();

    if (!tossResponse.ok) {
      return NextResponse.json(
        {
          message: tossResult.message || "토스페이먼츠 결제 승인에 실패했습니다.",
          code: tossResult.code,
        },
        { status: tossResponse.status }
      );
    }

    // 4. Supabase DB orders 상태를 PENDING -> DONE 으로 전환
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "DONE",
        payment_key: paymentKey,
      })
      .eq("id", existingOrder.id);

    if (updateError) {
      console.error("Order status update error:", updateError);
      return NextResponse.json(
        { message: "주문 상태 업데이트 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 5. 결제 완료된 유저의 장바구니(cart_items) DB 비우기
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      orderId,
      amount,
      message: "결제가 성공적으로 승인 및 완료 처리되었습니다.",
    });
  } catch (error: unknown) {
    console.error("Payment confirm handler error:", error);
    const errMessage =
      error instanceof Error ? error.message : "서버 결제 처리 중 예외가 발생했습니다.";
    return NextResponse.json({ message: errMessage }, { status: 500 });
  }
};
