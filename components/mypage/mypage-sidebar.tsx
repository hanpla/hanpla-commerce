"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import EyeIcon from "@/components/icons/eye-icon";
import HeartIcon from "@/components/icons/heart-icon";
import MapPinIcon from "@/components/icons/map-pin-icon";
import PackageIcon from "@/components/icons/package-icon";
import UserIcon from "@/components/icons/user-icon";
import useAuth from "@/lib/hooks/use-auth";

const NAV_ITEMS = [
  { label: "마이페이지 홈", href: "/mypage", icon: UserIcon },
  { label: "회원정보 수정", href: "/mypage/profile", icon: UserIcon },
  { label: "배송지 관리", href: "/mypage/addresses", icon: MapPinIcon },
  { label: "최근 본 상품", href: "/mypage/recent", icon: EyeIcon },
  { label: "위시리스트", href: "/products", icon: HeartIcon },
  { label: "주문 / 배송 내역", href: "/mypage/orders", icon: PackageIcon },
];

const MyPageSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <aside className="w-full rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm lg:w-64">
      <div className="mb-6 border-b border-neutral-100 pb-6">
        <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 uppercase">
          MY ACCOUNT
        </span>
        <h2 className="mt-1 text-lg font-black text-neutral-900">{user?.name || "회원"}님</h2>
        <p className="truncate text-xs text-neutral-500">{user?.email || "guest@hanpla.com"}</p>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-colors ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-neutral-100 pt-6">
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-neutral-200 py-2.5 text-xs font-bold text-neutral-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
};

export default MyPageSidebar;
