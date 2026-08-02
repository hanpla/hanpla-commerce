import { createClient } from "@/lib/supabase/client";
import { Order, OrderItem } from "@/types/order";

export type CreatePendingOrderParams = {
  orderId: string;
  orderName: string;
  userId: string;
  amount: number;
  recipientName: string;
  recipientPhone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  items: {
    productId: string;
    productName: string;
    productImage: string;
    colorName: string;
    colorHex: string;
    size: string;
    price: number;
    quantity: number;
  }[];
};

export const createPendingOrderInDb = async (
  params: CreatePendingOrderParams
): Promise<boolean> => {
  const supabase = createClient();

  // 1. orders 테이블에 PENDING 상태로 미리 저장
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_id: params.orderId,
      order_name: params.orderName,
      user_id: params.userId,
      amount: params.amount,
      status: "PENDING",
      recipient_name: params.recipientName,
      recipient_phone: params.recipientPhone,
      zipcode: params.zipcode,
      address: params.address,
      address_detail: params.addressDetail,
    })
    .select("id")
    .single();

  if (orderError || !orderData) {
    console.error("Failed to create pending order:", orderError);
    return false;
  }

  // 2. order_items 상세 품목 추가
  if (params.items.length > 0) {
    const itemRows = params.items.map((item) => ({
      order_id: orderData.id,
      user_id: params.userId,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      color_name: item.colorName,
      color_hex: item.colorHex,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    if (itemsError) {
      console.error("Failed to create pending order items:", itemsError);
    }
  }

  return true;
};

export const fetchUserOrdersFromDb = async (userId: string): Promise<Order[]> => {
  const supabase = createClient();

  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "PENDING")
    .order("created_at", { ascending: false });

  if (ordersError || !ordersData || ordersData.length === 0) {
    return [];
  }

  const orderIds = ordersData.map((o) => o.id);

  const { data: itemsData } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds)
    .order("created_at", { ascending: true });

  const itemsMap = new Map<string, OrderItem[]>();
  if (itemsData) {
    itemsData.forEach((row) => {
      const item: OrderItem = {
        id: row.id,
        orderId: row.order_id,
        userId: row.user_id,
        productId: row.product_id,
        productName: row.product_name,
        productImage: row.product_image,
        colorName: row.color_name,
        colorHex: row.color_hex,
        size: row.size,
        price: row.price,
        quantity: row.quantity,
        createdAt: row.created_at,
      };
      if (!itemsMap.has(row.order_id)) {
        itemsMap.set(row.order_id, []);
      }
      itemsMap.get(row.order_id)!.push(item);
    });
  }

  return ordersData.map((row) => ({
    id: row.id,
    orderId: row.order_id,
    orderName: row.order_name,
    userId: row.user_id,
    amount: row.amount,
    status: row.status,
    paymentKey: row.payment_key ?? undefined,
    recipientName: row.recipient_name,
    recipientPhone: row.recipient_phone,
    zipcode: row.zipcode,
    address: row.address,
    addressDetail: row.address_detail,
    createdAt: row.created_at,
    items: itemsMap.get(row.id) || [],
  }));
};

export const fetchOrderByIdFromDb = async (
  orderId: string,
  userId: string
): Promise<Order | null> => {
  const supabase = createClient();

  const { data: orderData, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !orderData) {
    return null;
  }

  const { data: itemsData } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderData.id);

  const items: OrderItem[] = (itemsData || []).map((row) => ({
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    productId: row.product_id,
    productName: row.product_name,
    productImage: row.product_image,
    colorName: row.color_name,
    colorHex: row.color_hex,
    size: row.size,
    price: row.price,
    quantity: row.quantity,
    createdAt: row.created_at,
  }));

  return {
    id: orderData.id,
    orderId: orderData.order_id,
    orderName: orderData.order_name,
    userId: orderData.user_id,
    amount: orderData.amount,
    status: orderData.status,
    paymentKey: orderData.payment_key ?? undefined,
    recipientName: orderData.recipient_name,
    recipientPhone: orderData.recipient_phone,
    zipcode: orderData.zipcode,
    address: orderData.address,
    addressDetail: orderData.address_detail,
    createdAt: orderData.created_at,
    items,
  };
};
