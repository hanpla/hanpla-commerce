import useHydrated from "@/lib/hooks/use-hydrated";
import { useRecentStore } from "@/lib/store/use-recent-store";

export const useRecentViewed = () => {
  const isHydrated = useHydrated();
  const recentStore = useRecentStore();

  return {
    items: isHydrated ? recentStore.items : [],
    addRecentProduct: recentStore.addRecentProduct,
    removeRecentProduct: recentStore.removeRecentProduct,
    clearAll: recentStore.clearAll,
  };
};

export default useRecentViewed;
