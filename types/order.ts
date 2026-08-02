export type OrderStatus = "DONE" | "PENDING" | "CANCELED";

export type OrderItem = {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  productName: string;
  productImage: string;
  colorName: string;
  colorHex: string;
  size: string;
  price: number;
  quantity: number;
  createdAt: string;
};

export type Order = {
  id: string;
  orderId: string;
  orderName: string;
  userId: string;
  amount: number;
  status: OrderStatus;
  paymentKey?: string;
  recipientName: string;
  recipientPhone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  createdAt: string;
  items?: OrderItem[];
};
