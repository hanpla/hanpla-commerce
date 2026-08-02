"use client";

import Link from "next/link";
import CartIcon from "@/components/icons/cart-icon";
import MenuIcon from "@/components/icons/menu-icon";
import SearchAutocomplete from "@/components/layout/search-autocomplete";
import UserNavMenu from "@/components/layout/user-nav-menu";
import useAuth from "@/lib/hooks/use-auth";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useCartStore } from "@/lib/store/use-cart-store";

const CATEGORY_NAV_ITEMS = [
  { id: "outer", name: "아우터" },
  { id: "top", name: "상의" },
  { id: "bottom", name: "하의" },
  { id: "shoes", name: "신발" },
  { id: "acc", name: "악세서리" },
];

// 로컬 헬퍼 1: 상단 안내 띠 배너 (비회원에게만 노출)
const TopAnnouncementBar = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <div className="bg-neutral-900 px-4 py-1.5 text-center text-xs font-medium text-white">
      <span>✨ 신규 회원 가입 시 10% 웰컴 쿠폰 즉시 발급 | 5만원 이상 무료배송</span>
    </div>
  );
};

// 로컬 헬퍼 2: 카테고리 링크 목록
const CategoryNavLinks = () => {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      <Link
        href="/products"
        className="text-sm font-semibold text-neutral-900 transition-colors hover:text-neutral-500"
      >
        ALL
      </Link>
      {CATEGORY_NAV_ITEMS.map((cat) => (
        <Link
          key={cat.id}
          href={`/products/${cat.id}`}
          className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          {cat.name}
        </Link>
      ))}
      <Link
        href="/lookbook"
        className="text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700"
      >
        OOTD 룩북
      </Link>
    </nav>
  );
};

// 메인 헤더 컴포넌트
const Header = () => {
  const store = useCartStore();
  const isHydrated = useHydrated();

  const cartCount = isHydrated ? store.items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <TopAnnouncementBar />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={store.toggleDrawer}
            className="p-1 text-neutral-700 hover:text-neutral-900 md:hidden"
            aria-label="메뉴 열기"
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="font-sans text-xl font-extrabold tracking-tighter text-neutral-900">
              HANPLA<span className="text-rose-600">.</span>
            </span>
          </Link>

          <div className="ml-6 hidden lg:block">
            <CategoryNavLinks />
          </div>
        </div>

        {/* Center: Search Bar with Autocomplete */}
        <div className="hidden flex-1 justify-center sm:flex">
          <SearchAutocomplete />
        </div>

        {/* Right: Cart Trigger & User Navigation */}
        <div className="flex items-center gap-3">
          <UserNavMenu />

          <button
            onClick={store.openDrawer}
            className="relative cursor-pointer rounded-full p-2 text-neutral-800 transition-colors hover:bg-neutral-100"
            aria-label="장바구니"
          >
            <CartIcon className="h-6 w-6" />
            {cartCount > 0 ? (
              <span className="animate-in zoom-in absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
