import { useEffect } from "react";
import useHydrated from "@/lib/hooks/use-hydrated";
import useSyncUserData from "@/lib/hooks/use-sync-user-data";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { createClient } from "@/lib/supabase/client";

export const useAuth = () => {
  const isHydrated = useHydrated();
  const authState = useAuthStore();

  useSyncUserData(isHydrated ? authState.user?.id : null);

  useEffect(() => {
    if (!isHydrated) return;

    const supabase = createClient();
    useAuthStore.getState().fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        useAuthStore.getState().fetchSession();
      } else if (event === "SIGNED_OUT") {
        useAuthStore.setState({ user: null, isLoading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isHydrated]);

  return {
    user: isHydrated ? authState.user : null,
    isLoading: !isHydrated || authState.isLoading,
    isAuthenticated: isHydrated && !!authState.user,
    fetchSession: authState.fetchSession,
  };
};

export default useAuth;
