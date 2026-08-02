import { createClient } from "@/lib/supabase/client";

export const fetchUserWishlistFromDb = async (userId: string): Promise<string[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  return data.map((item) => item.product_id);
};

export const addWishlistItemToDb = async (userId: string, productId: string): Promise<void> => {
  const supabase = createClient();
  await supabase.from("wishlist_items").upsert(
    {
      user_id: userId,
      product_id: productId,
    },
    { onConflict: "user_id,product_id" }
  );
};

export const deleteWishlistItemFromDb = async (
  userId: string,
  productId: string
): Promise<void> => {
  const supabase = createClient();
  await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("product_id", productId);
};

export const syncWishlistToDb = async (userId: string, wishlistIds: string[]): Promise<void> => {
  if (wishlistIds.length === 0) return;
  const supabase = createClient();

  const records = wishlistIds.map((productId) => ({
    user_id: userId,
    product_id: productId,
  }));

  await supabase.from("wishlist_items").upsert(records, { onConflict: "user_id,product_id" });
};
