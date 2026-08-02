import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, DeliveryAddress } from "@/types/user";

interface AuthStore {
  user: UserProfile | null;
  addresses: DeliveryAddress[];
  isLoading: boolean;
  fetchSession: () => Promise<void>;
  addAddress: (address: Omit<DeliveryAddress, "id" | "userId">) => void;
  updateAddress: (id: string, address: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  addresses: [],
  isLoading: true,

  fetchSession: async () => {
    const supabase = createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (supabaseUser) {
      const profile: UserProfile = {
        id: supabaseUser.id,
        email: supabaseUser.email || "",
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "회원",
        avatarUrl: supabaseUser.user_metadata?.avatar_url,
        phone: supabaseUser.user_metadata?.phone,
        createdAt: supabaseUser.created_at,
      };
      set({ user: profile, isLoading: false });
    } else {
      set({ user: null, isLoading: false });
    }
  },

  addAddress: (addressData) => {
    const current = get().addresses;
    const newId = `addr_${Date.now()}`;
    const userId = get().user?.id || "usr_guest";

    let updated = current;
    if (addressData.isDefault || current.length === 0) {
      updated = current.map((a) => ({ ...a, isDefault: false }));
    }

    const newAddress: DeliveryAddress = {
      ...addressData,
      id: newId,
      userId,
      isDefault: addressData.isDefault || current.length === 0,
    };

    set({ addresses: [newAddress, ...updated] });
  },

  updateAddress: (id, addressData) => {
    const current = get().addresses;
    const updated = current.map((addr) => {
      if (addr.id === id) {
        return { ...addr, ...addressData };
      }
      if (addressData.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    set({ addresses: updated });
  },

  deleteAddress: (id) => {
    const current = get().addresses;
    const target = current.find((a) => a.id === id);
    const filtered = current.filter((a) => a.id !== id);

    if (target?.isDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }

    set({ addresses: filtered });
  },

  setDefaultAddress: (id) => {
    const current = get().addresses;
    set({
      addresses: current.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    });
  },
}));
