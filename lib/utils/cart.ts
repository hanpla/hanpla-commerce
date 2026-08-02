import { CartItem } from "@/types/cart";

export type CartSummary = {
  totalItemsCount: number;
  selectedItemsCount: number;
  subtotal: number;
  shippingFee: number;
  finalTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
};

export const FREE_SHIPPING_THRESHOLD = 50000;
export const DEFAULT_SHIPPING_FEE = 3000;

export const calculateCartSummary = (items: CartItem[]): CartSummary => {
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItems = items.filter((item) => item.isSelected);
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : DEFAULT_SHIPPING_FEE;
  const finalTotal = subtotal + shippingFee;

  const amountNeededForFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FREE_SHIPPING_THRESHOLD - subtotal;

  return {
    totalItemsCount,
    selectedItemsCount,
    subtotal,
    shippingFee,
    finalTotal,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping,
  };
};
