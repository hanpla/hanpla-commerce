"use client";

import Image from "next/image";
import Link from "next/link";
import EyeIcon from "@/components/icons/eye-icon";
import Button from "@/components/ui/button";
import useRecentViewed from "@/lib/hooks/use-recent-viewed";
import { useCartStore } from "@/lib/store/use-cart-store";
import { getBlurDataURL } from "@/lib/utils/image";

const RecentPage = () => {
  const { items, removeRecentProduct, clearAll } = useRecentViewed();
  const addItemToCart = useCartStore((s) => s.addItem);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-neutral-900">최근 본 상품</h2>
          <p className="mt-1 text-xs text-neutral-500">
            최근 방문한 상품을 최대 10개까지 확인하실 수 있습니다.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-bold text-neutral-400 transition-colors hover:text-rose-600"
          >
            전체 삭제
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center">
          <EyeIcon className="mx-auto h-8 w-8 text-neutral-300" />
          <p className="mt-2 text-xs font-semibold text-neutral-500">최근 본 상품이 없습니다.</p>
          <Link href="/products" className="mt-4 inline-block">
            <Button variant="outline" size="sm" className="rounded-xl">
              쇼핑하러 가기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ product }) => (
            <div
              key={product.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-3.5 transition-all hover:border-neutral-900 hover:shadow-md"
            >
              <button
                onClick={() => removeRecentProduct(product.id)}
                className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="삭제"
              >
                &times;
              </button>

              <Link href={`/products/${product.category}/${product.id}`}>
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    placeholder="blur"
                    blurDataURL={getBlurDataURL(300, 300)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">
                    {product.brand}
                  </span>
                  <h3 className="line-clamp-1 text-xs font-bold text-neutral-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-black text-neutral-900">
                    {product.price.toLocaleString()}원
                  </p>
                </div>
              </Link>

              <div className="mt-3 border-t border-neutral-100 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    addItemToCart(product, {
                      color: product.options[0]?.color || { name: "Default", hex: "#00" },
                      size: product.options[0]?.sizes[0] || "FREE",
                    })
                  }
                  className="w-full justify-center rounded-xl text-xs"
                >
                  장바구니 담기
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentPage;
