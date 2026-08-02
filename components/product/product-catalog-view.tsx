"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CategoryTabs from "@/components/product/category-tabs";
import ProductCard from "@/components/product/product-card";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import ProductFilter from "@/components/product/product-filter";
import ProductFilterSkeleton from "@/components/product/product-filter-skeleton";
import SortBar from "@/components/product/sort-bar";
import { getCategories, getCategoryById, getFilteredProducts } from "@/lib/api/products";
import { CategoryOption, Product, ProductCategory, ProductSize, SortOption } from "@/types/product";

type ProductCatalogViewProps = {
  fixedCategory?: ProductCategory;
  paramsPromise?: Promise<{ category: string }>;
};

// 서스펜스 래핑 내부 공통 상품 카탈로그 View
const ProductCatalogContent = ({ fixedCategory, paramsPromise }: ProductCatalogViewProps) => {
  const resolvedParams = paramsPromise ? use(paramsPromise) : undefined;
  const targetCategory = (resolvedParams?.category as ProductCategory | undefined) ?? fixedCategory;

  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryOption | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>("newest");

  const categoryParam = targetCategory ?? (searchParams.get("category") as ProductCategory | null);
  const queryParam = searchParams.get("q") || undefined;
  const brandsParam = searchParams.getAll("brand");
  const colorsParam = searchParams.getAll("color");
  const sizesParam = searchParams.getAll("size") as ProductSize[];
  const minPriceParam = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPriceParam = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  const brandKey = brandsParam.join(",");
  const colorKey = colorsParam.join(",");
  const sizeKey = sizesParam.join(",");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [catData, curCat, prodData] = await Promise.all([
        getCategories(),
        targetCategory ? getCategoryById(targetCategory) : Promise.resolve(undefined),
        getFilteredProducts({
          category: categoryParam ?? undefined,
          searchQuery: queryParam,
          brand: brandsParam.length > 0 ? brandsParam : undefined,
          color: colorsParam.length > 0 ? colorsParam : undefined,
          size: sizesParam.length > 0 ? sizesParam : undefined,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          sort,
        }),
      ]);
      setCategories(catData);
      setCurrentCategory(curCat);
      setProducts(prodData);
      setIsLoading(false);
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    targetCategory,
    categoryParam,
    queryParam,
    brandKey,
    colorKey,
    sizeKey,
    minPriceParam,
    maxPriceParam,
    sort,
  ]);

  const pageTitle = targetCategory
    ? currentCategory?.name || targetCategory
    : queryParam
      ? `검색 결과: "${queryParam}"`
      : "ALL PRODUCTS";

  const pageSubtitle = targetCategory
    ? `${currentCategory?.name || targetCategory} 카테고리의 큐레이션 상품 목록입니다.`
    : queryParam
      ? `총 ${products.length}개의 관련 상품이 검색되었습니다.`
      : "HANPLA 커머스의 전체 피스 컬렉션을 확인해보세요.";

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Subtitle Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
          {pageTitle}
        </h1>
        <p className="text-xs text-neutral-500">{pageSubtitle}</p>
      </div>

      {/* Category Navigation Tabs */}
      <CategoryTabs categories={categories} activeCategory={categoryParam} />

      {/* Main Catalog Layout (Grid on Left, Filter on Right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left: Main Product Grid (lg:col-span-3) */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <SortBar sort={sort} onSortChange={setSort} totalCount={products.length} />

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 py-24 text-center">
              <p className="text-sm font-semibold text-neutral-600">
                조건에 부합하는 상품이 없습니다.
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                필터 조건을 재설정하거나 다른 검색어를 입력해보세요.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Filter (lg:col-span-1) */}
        <div className="lg:col-span-1">
          <ProductFilter />
        </div>
      </div>
    </div>
  );
};

// 메인 재사용 가능한 ProductCatalogView 컴포넌트
const ProductCatalogView = (props: ProductCatalogViewProps) => {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
          <ProductFilterSkeleton className="lg:col-span-1" />
        </div>
      }
    >
      <ProductCatalogContent {...props} />
    </Suspense>
  );
};

export default ProductCatalogView;
