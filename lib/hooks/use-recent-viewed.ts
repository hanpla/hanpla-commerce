import useHydrated from "@/lib/hooks/use-hydrated";
import { RecentProduct, useRecentStore } from "@/lib/store/use-recent-store";

const EMPTY_ITEMS: RecentProduct[] = [];

export const useRecentViewed = () => {
  const isHydrated = useHydrated();
  const recentStore = useRecentStore();

  return {
    items: isHydrated ? recentStore.items : EMPTY_ITEMS,
    addRecentProduct: recentStore.addRecentProduct,
    removeRecentProduct: recentStore.removeRecentProduct,
    clearAll: recentStore.clearAll,
  };
};

export default useRecentViewed;
