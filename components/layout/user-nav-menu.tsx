"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import UserIcon from "@/components/icons/user-icon";
import { logoutAction } from "@/lib/actions/auth";
import useAuth from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/store/use-auth-store";
import { buildAuthUrl } from "@/lib/utils/url";

const USER_MENU_ITEMS = [
  { label: "마이페이지", href: "/mypage" },
  { label: "주문 / 배송 내역", href: "/mypage/orders" },
  { label: "위시리스트", href: "/mypage/wishlist" },
  { label: "배송지 관리", href: "/mypage/addresses" },
  { label: "최근 본 상품", href: "/mypage/recent" },
];

// 로컬 헬퍼 1: 사용자 메뉴 fallback
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

// 로컬 헬퍼 2: 사용자 메뉴 콘텐츠 (useSearchParams 사용)
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

export default UserNavMenu;
