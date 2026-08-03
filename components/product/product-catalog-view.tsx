"use client";

import { Suspense, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import InfiniteScrollSentinel from "@/components/common/infinite-scroll-sentinel";
import CategoryTabs from "@/components/product/category-tabs";
import ProductCard from "@/components/product/product-card";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import ProductFilter from "@/components/product/product-filter";
import ProductFilterSkeleton from "@/components/product/product-filter-skeleton";
import SortBar from "@/components/product/sort-bar";
import { getCategories, getCategoryById, getPaginatedFilteredProducts } from "@/lib/api/products";
import { CategoryOption, Product, ProductCategory, ProductSize, SortOption } from "@/types/product";

type ProductCatalogViewProps = {
  fixedCategory?: ProductCategory;
  paramsPromise?: Promise<{ category: string }>;
  initialCategories?: CategoryOption[];
  initialProducts?: Product[];
  initialCurrentCategory?: CategoryOption;
};

const PAGE_SIZE = 6;

// 서스펜스 래핑 내부 공통 상품 카탈로그 View
const ProductCatalogContent = ({
  fixedCategory,
  paramsPromise,
  initialCategories,
  initialProducts,
  initialCurrentCategory,
}: ProductCatalogViewProps) => {
  const resolvedParams = paramsPromise ? use(paramsPromise) : undefined;
  const targetCategory = (resolvedParams?.category as ProductCategory | undefined) ?? fixedCategory;

  const searchParams = useSearchParams();

  // 초기 카테고리 매핑
  const initialCurCat =
    initialCurrentCategory ||
    (targetCategory && initialCategories
      ? initialCategories.find((c) => c.id === targetCategory)
      : undefined);

  const [categories, setCategories] = useState<CategoryOption[]>(initialCategories || []);
  const [currentCategory, setCurrentCategory] = useState<CategoryOption | undefined>(initialCurCat);
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialProducts ? initialProducts.length : 0);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<SortOption>("newest");
  const isInitialMount = useRef(true);

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

  const filterState = useMemo(
    () => ({
      category: categoryParam ?? undefined,
      searchQuery: queryParam,
      brand: brandKey ? brandKey.split(",") : undefined,
      color: colorKey ? colorKey.split(",") : undefined,
      size: sizeKey ? (sizeKey.split(",") as ProductSize[]) : undefined,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      sort,
    }),
    [categoryParam, queryParam, brandKey, colorKey, sizeKey, minPriceParam, maxPriceParam, sort]
  );

  useEffect(() => {
    // 최초 마운트 시 initialProducts가 존재하면 추가 쿼리 없이 건너뜀 (클라이언트 waterfall 0회)
    if (isInitialMount.current && initialProducts && initialProducts.length > 0) {
      isInitialMount.current = false;
      setHasMore(initialProducts.length >= PAGE_SIZE);
      return;
    }
    isInitialMount.current = false;

    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setPage(1);

      const [catData, curCat, paginatedRes] = await Promise.all([
        categories.length > 0 ? Promise.resolve(categories) : getCategories(),
        targetCategory ? getCategoryById(targetCategory) : Promise.resolve(undefined),
        getPaginatedFilteredProducts({
          ...filterState,
          page: 1,
          limit: PAGE_SIZE,
        }),
      ]);

      if (!isCancelled) {
        setCategories(catData);
        setCurrentCategory(curCat);
        setProducts(paginatedRes.products);
        setTotalCount(paginatedRes.totalCount);
        setHasMore(paginatedRes.hasNextPage);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetCategory, filterState]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || isFetchingNextPage || !hasMore) return;

    setIsFetchingNextPage(true);
    const nextPage = page + 1;

    try {
      const res = await getPaginatedFilteredProducts({
        ...filterState,
        page: nextPage,
        limit: PAGE_SIZE,
      });

      setProducts((prev) => [...prev, ...res.products]);
      setPage(nextPage);
      setTotalCount(res.totalCount);
      setHasMore(res.hasNextPage);
    } catch (err) {
      console.error("Failed to load more products:", err);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [isLoading, isFetchingNextPage, hasMore, page, filterState]);

  const pageTitle = targetCategory
    ? currentCategory?.name || targetCategory
    : queryParam
      ? `검색 결과: "${queryParam}"`
      : "ALL PRODUCTS";

  const pageSubtitle = targetCategory
    ? `${currentCategory?.name || targetCategory} 카테고리의 큐레이션 상품 목록입니다.`
    : queryParam
      ? `총 ${totalCount}개의 관련 상품이 검색되었습니다.`
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
          <SortBar sort={sort} onSortChange={setSort} totalCount={totalCount} />

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
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* 추가 로딩 스케일 스켈레톤 UI */}
              {isFetchingNextPage && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <ProductCardSkeleton key={`next-skel-${idx}`} />
                  ))}
                </div>
              )}

              {/* 무한 스크롤 트리거 관찰 센티널 */}
              <InfiniteScrollSentinel
                onIntersect={handleLoadMore}
                hasMore={hasMore}
                isLoading={isLoading || isFetchingNextPage}
              />

              {/* 끝 도달 메세지 */}
              {!hasMore && products.length > 0 && (
                <div className="py-8 text-center">
                  <p className="text-xs font-semibold text-neutral-400">
                    모든 상품을 불러왔습니다.
                  </p>
                </div>
              )}
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

// 로컬 헬퍼: 서스펜스 폴백 컴포넌트
const ProductCatalogFallback = (props: ProductCatalogViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
          {props.fixedCategory ? props.fixedCategory : "ALL PRODUCTS"}
        </h1>
        <p className="text-xs text-neutral-500">
          {props.fixedCategory
            ? `${props.fixedCategory} 카테고리의 큐레이션 상품 목록입니다.`
            : "HANPLA 커머스의 전체 피스 컬렉션을 확인해보세요."}
        </p>
      </div>

      <CategoryTabs
        categories={props.initialCategories || []}
        activeCategory={props.fixedCategory || null}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <SortBar sort="newest" onSortChange={() => {}} totalCount={0} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        </div>
        <ProductFilterSkeleton className="lg:col-span-1" />
      </div>
    </div>
  );
};

// 메인 재사용 가능한 ProductCatalogView 컴포넌트
const ProductCatalogView = (props: ProductCatalogViewProps) => {
  return (
    <Suspense fallback={<ProductCatalogFallback {...props} />}>
      <ProductCatalogContent {...props} />
    </Suspense>
  );
};

export default ProductCatalogView;
