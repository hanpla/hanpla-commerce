"use client";

import { useRouter } from "next/navigation";
import CartHeaderBar from "@/components/cart/cart-header-bar";
import CartItemRow from "@/components/cart/cart-item-row";
import EmptyCartView from "@/components/cart/empty-cart-view";
import OrderSummarySidebar from "@/components/cart/order-summary-sidebar";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useCartStore } from "@/lib/store/use-cart-store";
import { calculateCartSummary } from "@/lib/utils/cart";

const CartPage = () => {
  const router = useRouter();
  const store = useCartStore();
  const isHydrated = useHydrated();

  if (!isHydrated) return null;

  const summary = calculateCartSummary(store.items);
  const allSelected = store.items.length > 0 && store.items.every((i) => i.isSelected);

  const handleOrderSubmit = () => {
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">SHOPPING CART</h1>
        <p className="text-xs text-neutral-500">선택하신 상품 정보를 확인하고 주문을 진행하세요.</p>
      </div>

      {store.items.length === 0 ? (
        <EmptyCartView />
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          {/* Left: Items list */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <CartHeaderBar
              allSelected={allSelected}
              onToggleAll={store.selectAllItems}
              onClear={store.clearCart}
            />
            <div className="flex flex-col gap-3">
              {store.items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onToggleSelect={store.toggleSelectItem}
                  onUpdateQuantity={store.updateQuantity}
                  onRemove={store.removeItem}
                />
              ))}
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <OrderSummarySidebar summary={summary} onOrderSubmit={handleOrderSubmit} />
        </div>
      )}
    </div>
  );
};

export default CartPage;
