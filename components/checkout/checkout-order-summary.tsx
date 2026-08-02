import Image from "next/image";
import { CartItem } from "@/types/cart";
import { CartSummary } from "@/lib/utils/cart";

type CheckoutOrderSummaryProps = {
  items: CartItem[];
  summary: CartSummary;
};

// 로컬 헬퍼: 단일 주문 상품 행
const CheckoutOrderItemRow = ({ item }: { item: CartItem }) => {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 py-2 last:border-0">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-neutral-900">{item.product.name}</p>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          {item.selectedOption.color.name} / {item.selectedOption.size} · {item.quantity}개
        </p>
      </div>
      <span className="text-xs font-extrabold text-neutral-900">
        {(item.product.price * item.quantity).toLocaleString()}원
      </span>
    </div>
  );
};

// 로컬 헬퍼: 요약 행
const SummaryRow = ({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between text-xs text-neutral-600">
      <span>{label}</span>
      <span className={`font-bold ${isHighlight ? "text-base text-rose-600" : "text-neutral-900"}`}>
        {value}
      </span>
    </div>
  );
};

// 메인 CheckoutOrderSummary 컴포넌트
const CheckoutOrderSummary = ({ items, summary }: CheckoutOrderSummaryProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs">
      <h3 className="border-b border-neutral-100 pb-3 text-base font-bold text-neutral-900">
        주문 상품 목록 ({items.length}종)
      </h3>

      <div className="max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <CheckoutOrderItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-2.5 border-t border-neutral-100 pt-4">
        <SummaryRow label="총 상품 금액" value={`${summary.subtotal.toLocaleString()}원`} />
        <SummaryRow
          label="배송비"
          value={summary.shippingFee === 0 ? "무료" : `${summary.shippingFee.toLocaleString()}원`}
        />
        <div className="my-1 border-t border-dashed border-neutral-200" />
        <SummaryRow
          label="최종 결제 금액"
          value={`${summary.finalTotal.toLocaleString()}원`}
          isHighlight
        />
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
