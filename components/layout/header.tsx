"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import CartIcon from "@/components/icons/cart-icon";
import MenuIcon from "@/components/icons/menu-icon";
import UserIcon from "@/components/icons/user-icon";
import SearchAutocomplete from "@/components/layout/search-autocomplete";
import { MOCK_CATEGORIES } from "@/lib/data/mock-products";
import useAuth from "@/lib/hooks/use-auth";
import { logoutAction } from "@/lib/actions/auth";
import { useAuthStore } from "@/lib/store/use-auth-store";
import useHydrated from "@/lib/hooks/use-hydrated";
import { useCartStore } from "@/lib/store/use-cart-store";
import { usePathname, useSearchParams } from "next/navigation";
import { buildAuthUrl } from "@/lib/utils/url";

// 로컬 헬퍼 1: 상단 안내 띠 배너
const TopAnnouncementBar = () => {
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
      {MOCK_CATEGORIES.map((cat) => (
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

// 로컬 헬퍼 3: 사용자 메뉴 fallback
const UserNavMenuFallback = () => {
  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
    >
      <UserIcon className="h-4 w-4" />
      <span>로그인</span>
    </Link>
  );
};

const USER_MENU_ITEMS = [
  { label: "마이페이지", href: "/mypage" },
  { label: "위시리스트", href: "/mypage/wishlist" },
  { label: "배송지 관리", href: "/mypage/addresses" },
  { label: "최근 본 상품", href: "/mypage/recent" },
];

// 로컬 헬퍼 4: 사용자 메뉴 콘텐츠 (useSearchParams 사용)
const UserNavMenuContent = () => {
  const { user, isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const loginHref = buildAuthUrl("/login", pathname, searchParams.toString());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <Link
        href={loginHref}
        className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-800 transition-colors hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
      >
        <UserIcon className="h-4 w-4" />
        <span>로그인</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-900 text-xs font-bold text-white transition-transform hover:scale-105"
        aria-label="회원 메뉴 열기"
      >
        {user?.name?.[0]?.toUpperCase() || "H"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-xl backdrop-blur-md">
          <div className="border-b border-neutral-100 px-3 py-2">
            <p className="truncate text-xs font-bold text-neutral-900">{user?.name}님</p>
            <p className="truncate text-[10px] text-neutral-400">{user?.email}</p>
          </div>

          <div className="py-1">
            {USER_MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-xl px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-neutral-100 pt-1">
            <button
              onClick={async () => {
                setIsOpen(false);
                await logoutAction();
                useAuthStore.setState({ user: null, isLoading: false });
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 메인 사용자 메뉴 드롭다운 (Suspense 바운더리 감싸기)
const UserNavMenu = () => {
  return (
    <Suspense fallback={<UserNavMenuFallback />}>
      <UserNavMenuContent />
    </Suspense>
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
            className="relative rounded-full p-2 text-neutral-800 transition-colors hover:bg-neutral-100"
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
