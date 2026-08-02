import { useEffect } from "react";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { useCartStore } from "@/lib/store/use-cart-store";
import { useWishlistStore } from "@/lib/store/use-wishlist-store";
import { createClient } from "@/lib/supabase/client";

export const useAuth = () => {
  const isHydrated = useHydrated();
  const authState = useAuthStore();

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

  useEffect(() => {
    if (isHydrated && authState.user?.id) {
      useCartStore.getState().loadUserCart(authState.user.id);
      useWishlistStore.getState().loadUserWishlist(authState.user.id);
    }
  }, [isHydrated, authState.user?.id]);

  return {
    user: isHydrated ? authState.user : null,
    addresses: isHydrated ? authState.addresses : [],
    isLoading: !isHydrated || authState.isLoading,
    isAuthenticated: isHydrated && !!authState.user,
    fetchSession: authState.fetchSession,
    addAddress: authState.addAddress,
    updateAddress: authState.updateAddress,
    deleteAddress: authState.deleteAddress,
    setDefaultAddress: authState.setDefaultAddress,
  };
};

export default useAuth;
