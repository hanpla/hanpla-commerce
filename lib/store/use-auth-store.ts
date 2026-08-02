import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, DeliveryAddress } from "@/types/user";

interface AuthStore {
  user: UserProfile | null;
  addresses: DeliveryAddress[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  fetchSession: () => Promise<void>;
  addAddress: (address: Omit<DeliveryAddress, "id" | "userId">) => void;
  updateAddress: (id: string, address: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEFAULT_ADDRESSES: DeliveryAddress[] = [
  {
    id: "addr_1",
    userId: "usr_default",
    name: "우리집 (기본)",
    recipient: "한플라",
    phone: "010-1234-5678",
    zipcode: "06164",
    address: "서울 강남구 영동대로 513",
    addressDetail: "101동 1204호",
    isDefault: true,
  },
  {
    id: "addr_2",
    userId: "usr_default",
    name: "회사",
    recipient: "한플라",
    phone: "010-1234-5678",
    zipcode: "04524",
    address: "서울 중구 세종대로 110",
    addressDetail: "한플라 타워 7층 프론트엔드팀",
    isDefault: false,
  },
];

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  addresses: DEFAULT_ADDRESSES,
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

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false });
      let errorMessage = error.message;
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage =
          "이메일 인증이 아직 완료되지 않았습니다. 수신함의 인증 링크를 확인해 주세요.";
      }
      return { success: false, error: errorMessage };
    }

    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || email.split("@")[0] || "회원",
        avatarUrl: data.user.user_metadata?.avatar_url,
        phone: data.user.user_metadata?.phone,
        createdAt: data.user.created_at,
      };
      set({ user: profile, isLoading: false });
      return { success: true };
    }

    set({ isLoading: false });
    return { success: false, error: "로그인 세션을 생성할 수 없습니다." };
  },

  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true });
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      set({ isLoading: false });
      let errorMessage = error.message;
      if (error.message.includes("User already registered")) {
        errorMessage = "이미 가입되어 있는 이메일 주소입니다.";
      } else if (
        error.message.toLowerCase().includes("is invalid") ||
        error.message.toLowerCase().includes("invalid email")
      ) {
        errorMessage =
          "유효한 이메일 주소 형식이 아닙니다. (예: user@gmail.com, user@naver.com 등 실제 이메일 도메인을 입력해 주세요.)";
      } else if (error.message.includes("at least 6 characters")) {
        errorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
      }
      return { success: false, error: errorMessage };
    }

    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        name: name,
        createdAt: data.user.created_at,
      };
      const needsVerification = !data.session;
      set({ user: profile, isLoading: false });
      return { success: true, needsVerification };
    }

    set({ isLoading: false });
    return { success: false, error: "회원 가입에 실패했습니다." };
  },

  logout: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },

  updateProfile: async (data) => {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const current = get().user;
    if (current) {
      set({
        user: {
          ...current,
          ...data,
        },
      });
    }
    return { success: true };
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
