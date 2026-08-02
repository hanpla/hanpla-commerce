import { createClient } from "@/lib/supabase/client";
import { DeliveryAddress } from "@/types/user";

export const fetchUserAddressesFromDb = async (userId: string): Promise<DeliveryAddress[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    name: row.name,
    recipient: row.recipient,
    phone: row.phone,
    zipcode: row.zipcode,
    address: row.address,
    addressDetail: row.address_detail,
    isDefault: row.is_default,
  }));
};

export const addAddressToDb = async (
  userId: string,
  addressData: Omit<DeliveryAddress, "id" | "userId">
): Promise<DeliveryAddress | null> => {
  const supabase = createClient();

  if (addressData.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      name: addressData.name,
      recipient: addressData.recipient,
      phone: addressData.phone,
      zipcode: addressData.zipcode,
      address: addressData.address,
      address_detail: addressData.addressDetail,
      is_default: addressData.isDefault,
    })
    .select("*")
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    recipient: data.recipient,
    phone: data.phone,
    zipcode: data.zipcode,
    address: data.address,
    addressDetail: data.address_detail,
    isDefault: data.is_default,
  };
};

export const updateAddressInDb = async (
  userId: string,
  addressId: string,
  addressData: Partial<DeliveryAddress>
): Promise<void> => {
  const supabase = createClient();

  if (addressData.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (addressData.name !== undefined) updatePayload.name = addressData.name;
  if (addressData.recipient !== undefined) updatePayload.recipient = addressData.recipient;
  if (addressData.phone !== undefined) updatePayload.phone = addressData.phone;
  if (addressData.zipcode !== undefined) updatePayload.zipcode = addressData.zipcode;
  if (addressData.address !== undefined) updatePayload.address = addressData.address;
  if (addressData.addressDetail !== undefined)
    updatePayload.address_detail = addressData.addressDetail;
  if (addressData.isDefault !== undefined) updatePayload.is_default = addressData.isDefault;

  await supabase.from("addresses").update(updatePayload).eq("id", addressId).eq("user_id", userId);
};

export const deleteAddressFromDb = async (userId: string, addressId: string): Promise<void> => {
  const supabase = createClient();
  await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", userId);
};

export const setDefaultAddressInDb = async (userId: string, addressId: string): Promise<void> => {
  const supabase = createClient();
  await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
  await supabase
    .from("addresses")
    .update({ is_default: true, updated_at: new Date().toISOString() })
    .eq("id", addressId)
    .eq("user_id", userId);
};
