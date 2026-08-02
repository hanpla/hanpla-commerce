"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EyeIcon from "@/components/icons/eye-icon";
import HeartIcon from "@/components/icons/heart-icon";
import MapPinIcon from "@/components/icons/map-pin-icon";
import PackageIcon from "@/components/icons/package-icon";
import Badge from "@/components/ui/badge";
import useAuth from "@/lib/hooks/use-auth";
import useRecentViewed from "@/lib/hooks/use-recent-viewed";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { fetchUserAddressesFromDb } from "@/lib/api/address-db";
import { DeliveryAddress } from "@/types/user";

const MyPageDashboard = () => {
  const { user } = useAuth();
  const { items: recentItems } = useRecentViewed();
  const { wishlistCount } = useWishlist();
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadAddresses = async () => {
      if (!user?.id) {
        if (isMounted) {
          setAddresses([]);
        }
        return;
      }

      try {
        const dbAddresses = await fetchUserAddressesFromDb(user.id);
        if (isMounted) {
          setAddresses(dbAddresses);
        }
      } catch {
        if (isMounted) {
          setAddresses([]);
        }
      }
    };

    loadAddresses();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="space-y-8">
      {/* User Header Profile */}
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-neutral-300 bg-neutral-900 text-xl font-bold text-white">
            {user?.name?.[0]?.toUpperCase() || "H"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-neutral-900">{user?.name || "회원"}님</h2>
              <Badge variant="discount" className="text-[10px] font-bold">
                VIP MEMBER
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        <Link
          href="/mypage/profile"
          className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-100"
        >
          프로필 수정
        </Link>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Link
          href="/mypage/orders"
          className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-900 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-400 group-hover:text-neutral-900">
            <PackageIcon className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase">ORDERS</span>
          </div>
          <p className="mt-3 text-2xl font-black text-neutral-900">0</p>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">주문 / 배송 내역</p>
        </Link>

        <Link
          href="/mypage/recent"
          className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-900 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-400 group-hover:text-neutral-900">
            <EyeIcon className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase">RECENT</span>
          </div>
          <p className="mt-3 text-2xl font-black text-neutral-900">{recentItems.length}</p>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">최근 본 상품</p>
        </Link>

        <Link
          href="/mypage/wishlist"
          className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-900 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-400 group-hover:text-neutral-900">
            <HeartIcon className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase">WISHLIST</span>
          </div>
          <p className="mt-3 text-2xl font-black text-neutral-900">{wishlistCount}</p>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">찜한 상품</p>
        </Link>

        <Link
          href="/mypage/addresses"
          className="group rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-900 hover:shadow-md"
        >
          <div className="flex items-center justify-between text-neutral-400 group-hover:text-neutral-900">
            <MapPinIcon className="h-5 w-5" />
            <span className="text-[10px] font-extrabold tracking-wider uppercase">ADDRESS</span>
          </div>
          <p className="mt-3 text-2xl font-black text-neutral-900">{addresses.length}</p>
          <p className="mt-1 text-[11px] font-medium text-neutral-500">등록된 배송지</p>
        </Link>
      </div>

      {/* Default Address Quick View */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-neutral-700" />
            <h3 className="text-sm font-extrabold text-neutral-900">기본 배송지 정보</h3>
          </div>
          <Link
            href="/mypage/addresses"
            className="text-xs font-bold text-neutral-500 underline underline-offset-4 hover:text-neutral-900"
          >
            배송지 관리 &rarr;
          </Link>
        </div>

        {addresses.find((a) => a.isDefault) ? (
          (() => {
            const defAddr = addresses.find((a) => a.isDefault)!;
            return (
              <div className="mt-4 space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">{defAddr.name}</span>
                  <Badge variant="dark" className="px-1.5 py-0.5 text-[9px]">
                    기본
                  </Badge>
                </div>
                <p className="font-semibold text-neutral-800">
                  수령인: {defAddr.recipient} ({defAddr.phone})
                </p>
                <p>
                  [{defAddr.zipcode}] {defAddr.address} {defAddr.addressDetail}
                </p>
              </div>
            );
          })()
        ) : (
          <p className="mt-4 text-xs text-neutral-400">등록된 기본 배송지가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MyPageDashboard;
