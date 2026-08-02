import Image from "next/image";
import Link from "next/link";
import CloseIcon from "@/components/icons/close-icon";
import Badge from "@/components/ui/badge";
import { CartItem } from "@/types/cart";

type CartItemRowProps = {
  item: CartItem;
  onToggleSelect: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

// 로컬 헬퍼 1: 수량 증감 버튼
const QuantityStepButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer px-2.5 py-1 text-xs text-neutral-600 transition-colors select-none hover:bg-neutral-100"
    >
      {children}
    </button>
  );
};

// 로컬 헬퍼 2: 수량 조절기
const QuantityController = ({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) => {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-neutral-300 bg-white">
      <QuantityStepButton onClick={onDecrease}>-</QuantityStepButton>
      <span className="px-3 text-xs font-bold">{quantity}</span>
      <QuantityStepButton onClick={onIncrease}>+</QuantityStepButton>
    </div>
  );
};

// 메인 CartItemRow 컴포넌트
const CartItemRow = ({ item, onToggleSelect, onUpdateQuantity, onRemove }: CartItemRowProps) => {
  const { product, selectedOption, quantity, isSelected, id } = item;
  const itemTotalPrice = product.price * quantity;

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 transition-all hover:border-neutral-300 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(id)}
          className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-bold text-neutral-400 uppercase">{product.brand}</span>
          <Link
            href={`/products/detail/${product.id}`}
            className="line-clamp-1 text-sm font-semibold text-neutral-900 hover:underline"
          >
            {product.name}
          </Link>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
            <Badge variant="outline">
              {selectedOption.color.name} / {selectedOption.size}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-6 border-t border-neutral-100 pt-2 sm:w-auto sm:border-t-0 sm:pt-0">
        <QuantityController
          quantity={quantity}
          onDecrease={() => onUpdateQuantity(id, quantity - 1)}
          onIncrease={() => onUpdateQuantity(id, quantity + 1)}
        />

        <div className="flex items-center gap-4">
          <span className="w-24 text-right text-sm font-extrabold text-neutral-900">
            {itemTotalPrice.toLocaleString()}원
          </span>
          <button
            onClick={() => onRemove(id)}
            className="cursor-pointer p-1 text-neutral-400 hover:text-neutral-900"
            aria-label="삭제"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
