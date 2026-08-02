"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchIcon from "@/components/icons/search-icon";
import { searchProducts } from "@/lib/api/products";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { getBlurDataURL } from "@/lib/utils/image";
import { Product } from "@/types/product";

// 로컬 헬퍼: 추천 검색 결과 드롭다운 아이템
const AutocompleteItem = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  return (
    <Link
      href={`/products/detail/${product.id}`}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-neutral-50"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          placeholder="blur"
          blurDataURL={getBlurDataURL(40, 40)}
          className="object-cover"
          sizes="40px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-neutral-900">{product.name}</p>
        <p className="text-[11px] text-neutral-500">{product.brand}</p>
      </div>
      <span className="text-xs font-bold text-neutral-900">{product.price.toLocaleString()}원</span>
    </Link>
  );
};

// 메인 검색 자동완성 컴포넌트
const SearchAutocomplete = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCancelled = false;

    if (!debouncedQuery || debouncedQuery.trim() === "") {
      return;
    }

    searchProducts(debouncedQuery.trim())
      .then((data) => {
        if (!isCancelled) {
          setResults(data);
          setIsSearching(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setResults([]);
          setIsSearching(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const activeResults = debouncedQuery && debouncedQuery.trim() !== "" ? results : [];

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          placeholder="상품명, 브랜드, 카테고리 검색..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value.trim().length > 0) {
              setIsSearching(true);
            }
          }}
          className="w-full rounded-full border border-transparent bg-neutral-100 py-2 pr-9 pl-4 text-xs transition-all hover:bg-neutral-200/60 focus:border-neutral-900 focus:bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-3 text-neutral-400 hover:text-neutral-900"
          aria-label="검색"
        >
          <SearchIcon className="h-4 w-4" />
        </button>
      </form>

      {/* AutoComplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 z-50 mt-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
          <div className="mb-2 px-2.5 pt-1 text-[11px] font-semibold text-neutral-400">
            {isSearching ? "검색 중..." : `연관 상품 (${activeResults.length})`}
          </div>

          {activeResults.length > 0 ? (
            <div className="flex flex-col gap-1">
              {activeResults.map((product) => (
                <AutocompleteItem
                  key={product.id}
                  product={product}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          ) : !isSearching ? (
            <div className="py-6 text-center text-xs text-neutral-500">
              &quot;{query}&quot;에 대한 검색 결과가 없습니다.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
