"use server";

import { createClient } from "@/lib/supabase/server";
import { DeliveryAddress } from "@/types/user";

export const updateProfileServerAction = async (data: {
  name: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.updateUser({
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (user?.id) {
      await supabase.from("profiles").upsert(
        {
          id: user.id,
          name: data.name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
    }

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "프로필 업데이트 실패";
    return { success: false, error: message };
  }
};

export const addAddressServerAction = async (
  addressData: Omit<DeliveryAddress, "id" | "userId">
): Promise<{ success: boolean; address?: DeliveryAddress; error?: string }> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id || "usr_guest";
    const newAddress: DeliveryAddress = {
      ...addressData,
      id: `addr_${Date.now()}`,
      userId,
    };

    return { success: true, address: newAddress };
  } catch (err) {
    const message = err instanceof Error ? err.message : "배송지 추가 실패";
    return { success: false, error: message };
  }
};

export const updateAddressServerAction = async (
  id: string,
  addressData: Partial<DeliveryAddress>
): Promise<{
  success: boolean;
  id: string;
  addressData: Partial<DeliveryAddress>;
  error?: string;
}> => {
  try {
    return { success: true, id, addressData };
  } catch (err) {
    const message = err instanceof Error ? err.message : "배송지 수정 실패";
    return { success: false, id, addressData, error: message };
  }
};

export const deleteAddressServerAction = async (
  id: string
): Promise<{ success: boolean; id: string; error?: string }> => {
  try {
    return { success: true, id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "배송지 삭제 실패";
    return { success: false, id, error: message };
  }
};
