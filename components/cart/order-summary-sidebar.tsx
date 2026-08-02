import Button from "@/components/ui/button";
import { CartSummary } from "@/lib/utils/cart";

type OrderSummarySidebarProps = {
  summary: CartSummary;
  onOrderSubmit: () => void;
};

// 로컬 헬퍼: 가격 요약 행
const SummaryPriceRow = ({
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
      <span
        className={`font-semibold ${isHighlight ? "font-bold text-rose-600" : "text-neutral-900"}`}
      >
        {value}
      </span>
    </div>
  );
};

// 로컬 헬퍼: 무료 배송 남은 금액 팁 배너
const FreeShippingNotice = ({ amountNeeded }: { amountNeeded: number }) => {
  if (amountNeeded <= 0) return null;
  return (
    <div className="rounded-xl bg-rose-50 p-2.5 text-[11px] leading-normal font-medium text-rose-700">
      💡 {amountNeeded.toLocaleString()}원 추가 구매 시 <strong>무료배송</strong> 혜택!
    </div>
  );
};

// 메인 OrderSummarySidebar 컴포넌트
const OrderSummarySidebar = ({ summary, onOrderSubmit }: OrderSummarySidebarProps) => {
  const shippingFeeText =
    summary.shippingFee === 0 ? "무료 (5만원 이상)" : `${summary.shippingFee.toLocaleString()}원`;

  return (
    <div className="sticky top-24 flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
      <h3 className="border-b border-neutral-200 pb-3 text-base font-bold text-neutral-900">
        주문 요약 (선택 {summary.selectedItemsCount}개)
      </h3>

      <div className="flex flex-col gap-2.5">
        <SummaryPriceRow label="총 상품 금액" value={`${summary.subtotal.toLocaleString()}원`} />
        <SummaryPriceRow label="배송비" value={shippingFeeText} />
        <FreeShippingNotice amountNeeded={summary.amountNeededForFreeShipping} />
      </div>

      <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4">
        <span className="text-sm font-bold text-neutral-900">총 결제 예정 금액</span>
        <span className="text-2xl font-black text-rose-600">
          {summary.finalTotal.toLocaleString()}원
        </span>
      </div>

      <Button
        variant="primary"
        size="lg"
        disabled={summary.selectedItemsCount === 0}
        onClick={onOrderSubmit}
        className="mt-2 w-full rounded-xl"
      >
        {summary.selectedItemsCount}개 상품 주문하기
      </Button>
    </div>
  );
};

export default OrderSummarySidebar;
