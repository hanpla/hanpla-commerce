import { CartStore } from "@/types/cart";
import { Product, ProductColor, ProductSize } from "@/types/product";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const generateCartItemId = (productId: string, color: ProductColor, size: ProductSize) => {
  return `${productId}-${color.name}-${size}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, option, quantity = 1) => {
        const itemId = generateCartItemId(product.id, option.color, option.size);
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === itemId);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity,
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          set({
            items: [
              ...currentItems,
              {
                id: itemId,
                product,
                selectedOption: option,
                quantity,
                isSelected: true,
              },
            ],
            isOpen: true,
          });
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) return;
        set({
          items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        });
      },

      toggleSelectItem: (id: string) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, isSelected: !item.isSelected } : item
          ),
        });
      },

      selectAllItems: (selected: boolean) => {
        set({
          items: get().items.map((item) => ({ ...item, isSelected: selected })),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleDrawer: () => {
        set({ isOpen: !get().isOpen });
      },

      openDrawer: () => {
        set({ isOpen: true });
      },

      closeDrawer: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: "hanpla-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
