import Link from "next/link";
import CartIcon from "@/components/icons/cart-icon";
import Button from "@/components/ui/button";

const EmptyCartView = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-neutral-200/60 bg-neutral-50 py-24">
      <CartIcon className="h-16 w-16 stroke-1 text-neutral-300" />
      <p className="text-sm font-semibold text-neutral-600">장바구니에 담긴 상품이 없습니다.</p>
      <Link href="/products">
        <Button variant="primary" size="md">
          쇼핑하러 가기
        </Button>
      </Link>
    </div>
  );
};

export default EmptyCartView;
