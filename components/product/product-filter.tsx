"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FilterIcon from "@/components/icons/filter-icon";
import { getAvailableFilterOptions } from "@/lib/api/products";
import { ProductColor, ProductSize } from "@/types/product";

const DEFAULT_BRANDS = [
  "HANPLA STUDIO",
  "HANPLA ESSENTIAL",
  "HANPLA DENIM",
  "ATELIER HANPLA",
  "HANPLA JEWELRY",
];

const DEFAULT_COLORS: ProductColor[] = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Beige", hex: "#D7C4B7" },
  { name: "Sky Blue", hex: "#87CEEB" },
  { name: "Raw Indigo", hex: "#1F2937" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Silver", hex: "#E5E7EB" },
];

const DEFAULT_SIZES: ProductSize[] = ["S", "M", "L", "XL", "FREE"];

// 로컬 헬퍼 1: 필터 섹션 제목
const FilterSectionTitle = ({ title }: { title: string }) => (
  <h4 className="text-xs font-bold tracking-wider text-neutral-900 uppercase">{title}</h4>
);

// 메인 상품 필터 컴포넌트
const ProductFilter = ({ className = "" }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [availableBrands, setAvailableBrands] = useState<string[]>(DEFAULT_BRANDS);
  const [availableColors, setAvailableColors] = useState<ProductColor[]>(DEFAULT_COLORS);
  const [availableSizes, setAvailableSizes] = useState<ProductSize[]>(DEFAULT_SIZES);

  useEffect(() => {
    const fetchOptions = async () => {
      const options = await getAvailableFilterOptions();
      if (options.brands.length) setAvailableBrands(options.brands);
      if (options.colors.length) setAvailableColors(options.colors);
      if (options.sizes.length) setAvailableSizes(options.sizes);
    };

    fetchOptions();
  }, []);

  // Current filter values from URL
  const selectedBrands = searchParams.getAll("brand");
  const selectedColors = searchParams.getAll("color");
  const selectedSizes = searchParams.getAll("size") as ProductSize[];
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  const createQueryString = useCallback(
    (name: string, value: string, isArray: boolean = false) => {
      const params = new URLSearchParams(searchParams.toString());

      if (isArray) {
        const current = params.getAll(name);
        if (current.includes(value)) {
          const updated = current.filter((v) => v !== value);
          params.delete(name);
          updated.forEach((v) => params.append(name, v));
        } else {
          params.append(name, value);
        }
      } else {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleBrandToggle = (brand: string) => {
    const query = createQueryString("brand", brand, true);
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  const handleColorToggle = (colorName: string) => {
    const query = createQueryString("color", colorName, true);
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  const handleSizeToggle = (size: ProductSize) => {
    const query = createQueryString("size", size, true);
    router.push(`${pathname}?${query}`, { scroll: false });
  };

  const handlePriceChange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");

    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "";

  return (
    <aside
      className={`w-full space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-neutral-800" />
          <h3 className="text-sm font-bold text-neutral-900">상세 필터</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-medium text-rose-600 transition-colors hover:text-rose-700"
          >
            초기화
          </button>
        )}
      </div>

      {/* Brand Filter */}
      <div className="space-y-3">
        <FilterSectionTitle title="브랜드 (Brand)" />
        <div className="space-y-2">
          {availableBrands.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex cursor-pointer items-center gap-2.5 text-xs text-neutral-700 hover:text-neutral-900"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(brand)}
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span className={isChecked ? "font-semibold text-neutral-900" : ""}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 border-t border-neutral-100 pt-5">
        <FilterSectionTitle title="가격대 (Price Range)" />
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="최소 금액"
            value={minPrice}
            onChange={(e) => handlePriceChange(e.target.value, maxPrice)}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
          />
          <span className="text-neutral-400">~</span>
          <input
            type="number"
            placeholder="최대 금액"
            value={maxPrice}
            onChange={(e) => handlePriceChange(minPrice, e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3 border-t border-neutral-100 pt-5">
        <FilterSectionTitle title="색상 (Color)" />
        <div className="flex flex-wrap gap-2">
          {availableColors.map((c) => {
            const isSelected = selectedColors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleColorToggle(c.name)}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: c.hex }}
                />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 border-t border-neutral-100 pt-5">
        <FilterSectionTitle title="사이즈 (Size)" />
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((sz) => {
            const isSelected = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => handleSizeToggle(sz)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-md border text-xs font-semibold transition-all ${
                  isSelected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ProductFilter;
