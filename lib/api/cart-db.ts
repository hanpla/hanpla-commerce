import { createClient } from "@/lib/supabase/client";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { getProductById } from "@/lib/api/products";

export const fetchUserCartFromDb = async (userId: string): Promise<CartItem[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("cart_items").select("*").eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  const cartItems: CartItem[] = [];

  for (const item of data) {
    const product: Product | undefined = await getProductById(item.product_id);
    if (product) {
      cartItems.push({
        id: item.id,
        product,
        selectedOption: {
          color: { name: item.color_name, hex: item.color_hex },
          size: item.size,
        },
        quantity: item.quantity,
        isSelected: true,
      });
    }
  }

  return cartItems;
};

export const syncCartItemToDb = async (
  userId: string,
  product: Product,
  option: { color: { name: string; hex: string }; size: string },
  quantity: number
): Promise<void> => {
  const supabase = createClient();
  await supabase.from("cart_items").upsert(
    {
      user_id: userId,
      product_id: product.id,
      color_name: option.color.name,
      color_hex: option.color.hex,
      size: option.size,
      quantity,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,product_id,color_name,size" }
  );
};

export const updateCartQuantityInDb = async (
  userId: string,
  cartItemId: string,
  quantity: number
): Promise<void> => {
  const supabase = createClient();
  await supabase
    .from("cart_items")
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq("id", cartItemId)
    .eq("user_id", userId);
};

export const deleteCartItemFromDb = async (userId: string, cartItemId: string): Promise<void> => {
  const supabase = createClient();
  await supabase.from("cart_items").delete().eq("id", cartItemId).eq("user_id", userId);
};

export const clearUserCartInDb = async (userId: string): Promise<void> => {
  const supabase = createClient();
  await supabase.from("cart_items").delete().eq("user_id", userId);
};
