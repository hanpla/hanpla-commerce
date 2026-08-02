"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/data/mock-products";
import {
  CategoryOption,
  Product,
  ProductCategory,
  ProductColor,
  ProductFilterState,
  ProductSize,
  SortOption,
} from "@/types/product";

export const getCategories = async (): Promise<CategoryOption[]> => {
  cacheLife("hours");
  cacheTag("categories");

  return MOCK_CATEGORIES;
};

export const getCategoryById = async (id: ProductCategory): Promise<CategoryOption | undefined> => {
  cacheLife("hours");
  cacheTag("categories");

  return MOCK_CATEGORIES.find((cat) => cat.id === id);
};

export const getProducts = async (options?: {
  category?: ProductCategory;
  sort?: SortOption;
  query?: string;
  limit?: number;
  featuredOnly?: boolean;
}): Promise<Product[]> => {
  cacheLife("hours");
  cacheTag("products");

  let list = [...MOCK_PRODUCTS];

  if (options?.category) {
    list = list.filter((p) => p.category === options.category);
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.isBest);
  }

  if (options?.query) {
    const q = options.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (options?.sort) {
    switch (options.sort) {
      case "popular":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  if (options?.limit) {
    list = list.slice(0, options.limit);
  }

  return list;
};

// O(1) Set 룩업 기반 성능 최적화 필터링 (Vercel Best Practice: js-set-map-lookups)
export const getFilteredProducts = async (filters: ProductFilterState): Promise<Product[]> => {
  cacheLife("hours");
  cacheTag("products");

  let list = [...MOCK_PRODUCTS];

  if (filters.category) {
    list = list.filter((p) => p.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    list = list.filter((p) => p.price >= (filters.minPrice ?? 0));
  }

  if (filters.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
  }

  if (filters.brand && filters.brand.length > 0) {
    const brandSet = new Set(filters.brand);
    list = list.filter((p) => brandSet.has(p.brand));
  }

  if (filters.color && filters.color.length > 0) {
    const colorSet = new Set(filters.color);
    list = list.filter((p) => p.options.some((opt) => colorSet.has(opt.color.name)));
  }

  if (filters.size && filters.size.length > 0) {
    const sizeSet = new Set(filters.size);
    list = list.filter((p) => p.options.some((opt) => opt.sizes.some((sz) => sizeSet.has(sz))));
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (filters.sort) {
    switch (filters.sort) {
      case "popular":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  return list;
};

// 동적 필터 옵션(브랜드/컬러/사이즈) 집계 API
export const getAvailableFilterOptions = async () => {
  cacheLife("hours");
  cacheTag("products");

  const brandSet = new Set<string>();
  const colorMap = new Map<string, ProductColor>();
  const sizeSet = new Set<ProductSize>();

  MOCK_PRODUCTS.forEach((p) => {
    brandSet.add(p.brand);
    p.options.forEach((opt) => {
      if (!colorMap.has(opt.color.name)) {
        colorMap.set(opt.color.name, opt.color);
      }
      opt.sizes.forEach((sz) => sizeSet.add(sz));
    });
  });

  return {
    brands: Array.from(brandSet),
    colors: Array.from(colorMap.values()),
    sizes: Array.from(sizeSet),
  };
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  cacheLife("hours");
  cacheTag("products");

  if (!query || query.trim() === "") return [];

  const q = query.toLowerCase().trim();
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  ).slice(0, 5);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  cacheLife("hours");
  cacheTag(`product-${id}`, "products");

  return MOCK_PRODUCTS.find((p) => p.id === id);
};

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  cacheLife("hours");
  cacheTag("products");

  if (!ids || ids.length === 0) return [];
  const idSet = new Set(ids);
  return MOCK_PRODUCTS.filter((p) => idSet.has(p.id));
};
