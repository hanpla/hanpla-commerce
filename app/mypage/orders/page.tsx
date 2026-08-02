import PackageIcon from "@/components/icons/package-icon";
import Button from "@/components/ui/button";
import Link from "next/link";

const OrdersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-900">주문 / 배송 내역</h2>
        <p className="mt-1 text-xs text-neutral-500">
          회원님의 상품 주문 내역 및 배송 상태를 실시간으로 조회하실 수 있습니다.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-neutral-200 pb-3 text-xs font-bold text-neutral-500">
        <button className="border-b-2 border-neutral-900 pb-1 whitespace-nowrap text-neutral-900">
          전체 (0)
        </button>
        <button className="pb-1 whitespace-nowrap hover:text-neutral-900">결제완료 (0)</button>
        <button className="pb-1 whitespace-nowrap hover:text-neutral-900">배송중 (0)</button>
        <button className="pb-1 whitespace-nowrap hover:text-neutral-900">배송완료 (0)</button>
        <button className="pb-1 whitespace-nowrap hover:text-neutral-900">취소/반품 (0)</button>
      </div>

      <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
        <PackageIcon className="mx-auto h-10 w-10 text-neutral-300" />
        <p className="mt-3 text-sm font-bold text-neutral-700">최근 진행된 주문 내역이 없습니다.</p>
        <p className="mt-1 text-xs text-neutral-400">
          토스페이먼츠 결제 기능 연동 후 실제 주문 내역이 표시됩니다.
        </p>
        <Link href="/products" className="mt-6 inline-block">
          <Button variant="primary" size="md" className="rounded-xl font-bold">
            인기 상품 구경하기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrdersPage;
