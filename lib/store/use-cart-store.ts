import { create } from "zustand";
import {
  fetchUserCartFromDb,
  syncCartItemToDb,
  updateCartQuantityInDb,
  deleteCartItemFromDb,
  clearUserCartInDb,
} from "@/lib/api/cart-db";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { CartStore } from "@/types/cart";
import { Product, ProductColor, ProductSize } from "@/types/product";

const generateCartItemId = (productId: string, color: ProductColor, size: ProductSize) => {
  return `${productId}-${color.name}-${size}`;
};

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  isOpen: false,

  loadUserCart: async (userId: string) => {
    if (!userId) {
      set({ items: [] });
      return;
    }
    try {
      const dbItems = await fetchUserCartFromDb(userId);
      set({ items: (dbItems || []).map((i) => ({ ...i, isSelected: true })) });
    } catch {
      set({ items: [] });
    }
  },

  addItem: (product: Product, option, quantity = 1) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      if (typeof window !== "undefined") {
        alert("장바구니 기능은 로그인 회원 전용 서비스입니다. 로그인 후 이용해 주세요.");
        window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      }
      return;
    }

    const itemId = generateCartItemId(product.id, option.color, option.size);
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((item) => item.id === itemId);

    let updatedItems = [...currentItems];
    let targetQuantity = quantity;

    if (existingIndex > -1) {
      targetQuantity = updatedItems[existingIndex].quantity + quantity;
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: targetQuantity,
      };
      set({ items: updatedItems, isOpen: true });
    } else {
      updatedItems = [
        ...currentItems,
        {
          id: itemId,
          product,
          selectedOption: option,
          quantity,
          isSelected: true,
        },
      ];
      set({ items: updatedItems, isOpen: true });
    }

    syncCartItemToDb(userId, product, option, targetQuantity).catch(() => {});
  },

  removeItem: (id: string) => {
    const userId = useAuthStore.getState().user?.id;
    set({ items: get().items.filter((item) => item.id !== id) });
    if (userId) {
      deleteCartItemFromDb(userId, id).catch(() => {});
    }
  },

  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) return;
    const userId = useAuthStore.getState().user?.id;
    set({
      items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    });

    if (userId) {
      updateCartQuantityInDb(userId, id, quantity).catch(() => {});
    }
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
    const userId = useAuthStore.getState().user?.id;
    set({ items: [] });
    if (userId) {
      clearUserCartInDb(userId).catch(() => {});
    }
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
}));
