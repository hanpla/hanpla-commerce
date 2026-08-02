import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/types/user";

interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  fetchSession: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),

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
}));
