import { Product, ProductColor, ProductSize } from "./product";

export type SelectedOption = {
  color: ProductColor;
  size: ProductSize;
};

export type CartItem = {
  id: string; // unique item id (product.id + color.name + size)
  product: Product;
  selectedOption: SelectedOption;
  quantity: number;
  isSelected: boolean;
};

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

export type CartActions = {
  addItem: (product: Product, option: SelectedOption, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSelectItem: (id: string) => void;
  selectAllItems: (selected: boolean) => void;
  clearCart: () => void;
  loadUserCart: (userId: string) => Promise<void>;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

export type CartStore = CartState & CartActions;
