import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, DeliveryAddress } from "@/types/user";
import {
  fetchUserAddressesFromDb,
  addAddressToDb,
  updateAddressInDb,
  deleteAddressFromDb,
  setDefaultAddressInDb,
} from "@/lib/api/address-db";

interface AuthStore {
  user: UserProfile | null;
  addresses: DeliveryAddress[];
  isLoading: boolean;
  fetchSession: () => Promise<void>;
  loadUserAddresses: (userId: string) => Promise<void>;
  addAddress: (address: Omit<DeliveryAddress, "id" | "userId">) => Promise<void>;
  updateAddress: (id: string, address: Partial<DeliveryAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
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
      get().loadUserAddresses(supabaseUser.id);
    } else {
      set({ user: null, addresses: [], isLoading: false });
    }
  },

  loadUserAddresses: async (userId: string) => {
    if (!userId) {
      set({ addresses: [] });
      return;
    }
    try {
      const dbAddresses = await fetchUserAddressesFromDb(userId);
      set({ addresses: dbAddresses });
    } catch {
      set({ addresses: [] });
    }
  },

  addAddress: async (addressData) => {
    const userId = get().user?.id;
    const current = get().addresses;

    let updated = current;
    if (addressData.isDefault || current.length === 0) {
      updated = current.map((a) => ({ ...a, isDefault: false }));
    }

    const tempId = `temp_${Date.now()}`;
    const newAddress: DeliveryAddress = {
      ...addressData,
      id: tempId,
      userId: userId || "usr_guest",
      isDefault: addressData.isDefault || current.length === 0,
    };

    set({ addresses: [newAddress, ...updated] });

    if (userId) {
      try {
        const dbResult = await addAddressToDb(userId, {
          ...addressData,
          isDefault: addressData.isDefault || current.length === 0,
        });
        if (dbResult) {
          set({
            addresses: get().addresses.map((a) => (a.id === tempId ? dbResult : a)),
          });
        }
      } catch {
        set({ addresses: current });
      }
    }
  },

  updateAddress: async (id, addressData) => {
    const userId = get().user?.id;
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

    if (userId) {
      try {
        await updateAddressInDb(userId, id, addressData);
      } catch {
        set({ addresses: current });
      }
    }
  },

  deleteAddress: async (id) => {
    const userId = get().user?.id;
    const current = get().addresses;
    const target = current.find((a) => a.id === id);
    const filtered = current.filter((a) => a.id !== id);

    if (target?.isDefault && filtered.length > 0) {
      filtered[0].isDefault = true;
    }

    set({ addresses: filtered });

    if (userId) {
      try {
        await deleteAddressFromDb(userId, id);
        if (target?.isDefault && filtered.length > 0) {
          await setDefaultAddressInDb(userId, filtered[0].id);
        }
      } catch {
        set({ addresses: current });
      }
    }
  },

  setDefaultAddress: async (id) => {
    const userId = get().user?.id;
    const current = get().addresses;
    set({
      addresses: current.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    });

    if (userId) {
      try {
        await setDefaultAddressInDb(userId, id);
      } catch {
        set({ addresses: current });
      }
    }
  },
}));
