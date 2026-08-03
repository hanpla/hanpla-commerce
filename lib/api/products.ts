"use cache";

import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  CategoryOption,
  PaginatedProductsResult,
  Product,
  ProductCategory,
  ProductColor,
  ProductFilterState,
  ProductSize,
  SortOption,
} from "@/types/product";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

// DB Row interfaces for strict typing
interface DbProductOptionRow {
  color_name: string;
  color_hex: string;
  sizes: string[];
}

interface DbCategoryRow {
  id: string;
  name: string;
  count: number | null;
  image_url: string | null;
}

interface DbProductRow {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price: number | null;
  discount_rate: number | null;
  image_url: string;
  images: string[] | null;
  description: string;
  rating: number | null;
  review_count: number | null;
  is_new: boolean | null;
  is_best: boolean | null;
  stock: number | null;
  created_at: string | null;
  product_options?: DbProductOptionRow[];
}

// 'use cache' 함수 내부에서 안전하게 실행되는 Supabase 정적 클라이언트 생성
const getDbClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// DB 행 데이터를 TypeScript Product 모델로 매핑하는 헬퍼 함수
const mapRowToProduct = (row: DbProductRow): Product => {
  const optionsMap = new Map<string, { color: ProductColor; sizes: Set<ProductSize> }>();

  if (Array.isArray(row.product_options)) {
    row.product_options.forEach((opt) => {
      if (!opt.color_name) return;
      const key = opt.color_name;
      if (!optionsMap.has(key)) {
        optionsMap.set(key, {
          color: { name: opt.color_name, hex: opt.color_hex },
          sizes: new Set<ProductSize>(),
        });
      }
      if (Array.isArray(opt.sizes)) {
        opt.sizes.forEach((sz) => optionsMap.get(key)!.sizes.add(sz as ProductSize));
      }
    });
  }

  const options = Array.from(optionsMap.values()).map((item) => ({
    color: item.color,
    sizes: Array.from(item.sizes),
  }));

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category as ProductCategory,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    discountRate: row.discount_rate ?? undefined,
    imageUrl: row.image_url,
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.image_url],
    description: row.description || "",
    options,
    rating: Number(row.rating ?? 5),
    reviewCount: row.review_count ?? 0,
    isNew: row.is_new ?? false,
    isBest: row.is_best ?? false,
    stock: row.stock ?? 100,
    createdAt: row.created_at || new Date().toISOString(),
  };
};

export const getCategories = cache(async (): Promise<CategoryOption[]> => {
  cacheLife("hours");
  cacheTag("categories");

  const supabase = getDbClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");

  if (error || !data) {
    return [];
  }

  return (data as DbCategoryRow[]).map((cat) => ({
    id: cat.id as ProductCategory,
    name: cat.name,
    count: cat.count ?? 0,
    imageUrl: cat.image_url ?? undefined,
  }));
});

export const getCategoryById = cache(
  async (id: ProductCategory): Promise<CategoryOption | undefined> => {
    cacheLife("hours");
    cacheTag("categories");

    const supabase = getDbClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return undefined;
    }

    const cat = data as DbCategoryRow;
    return {
      id: cat.id as ProductCategory,
      name: cat.name,
      count: cat.count ?? 0,
      imageUrl: cat.image_url ?? undefined,
    };
  }
);

export const getProducts = async (options?: {
  category?: ProductCategory;
  sort?: SortOption;
  query?: string;
  limit?: number;
  featuredOnly?: boolean;
}): Promise<Product[]> => {
  cacheLife("hours");
  cacheTag("products");

  const supabase = getDbClient();
  let query = supabase.from("products").select("*, product_options(*)");

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.featuredOnly) {
    query = query.eq("is_best", true);
  }

  if (options?.query) {
    const q = options.query.trim();
    query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`);
  }

  switch (options?.sort) {
    case "popular":
      query = query.order("review_count", { ascending: false });
      break;
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as DbProductRow[]).map(mapRowToProduct);
};

export const getFilteredProducts = async (filters: ProductFilterState): Promise<Product[]> => {
  cacheLife("hours");
  cacheTag("products");

  const supabase = getDbClient();
  let query = supabase.from("products").select("*, product_options(*)");

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.brand && filters.brand.length > 0) {
    query = query.in("brand", filters.brand);
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.trim();
    query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`);
  }

  switch (filters.sort) {
    case "popular":
      query = query.order("review_count", { ascending: false });
      break;
    case "price-low":
      query = query.order("price", { ascending: true });
      break;
    case "price-high":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  let products = (data as DbProductRow[]).map(mapRowToProduct);

  if (filters.color && filters.color.length > 0) {
    const colorSet = new Set(filters.color);
    products = products.filter((p) => p.options.some((opt) => colorSet.has(opt.color.name)));
  }

  if (filters.size && filters.size.length > 0) {
    const sizeSet = new Set(filters.size);
    products = products.filter((p) =>
      p.options.some((opt) => opt.sizes.some((sz) => sizeSet.has(sz)))
    );
  }

  return products;
};

export const getPaginatedFilteredProducts = async (
  filters: ProductFilterState
): Promise<PaginatedProductsResult> => {
  cacheLife("hours");
  cacheTag("products");

  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 6;

  const allProducts = await getFilteredProducts(filters);
  const totalCount = allProducts.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    totalCount,
    hasNextPage: endIndex < totalCount,
    page,
  };
};

export const getAvailableFilterOptions = async () => {
  cacheLife("hours");
  cacheTag("products");

  const supabase = getDbClient();
  const { data, error } = await supabase.from("products").select("brand, product_options(*)");

  if (error || !data) {
    return { brands: [], colors: [], sizes: [] };
  }

  const brandSet = new Set<string>();
  const colorMap = new Map<string, ProductColor>();
  const sizeSet = new Set<ProductSize>();

  (data as DbProductRow[]).forEach((row) => {
    if (row.brand) brandSet.add(row.brand);
    if (Array.isArray(row.product_options)) {
      row.product_options.forEach((opt) => {
        if (opt.color_name && !colorMap.has(opt.color_name)) {
          colorMap.set(opt.color_name, { name: opt.color_name, hex: opt.color_hex });
        }
        if (Array.isArray(opt.sizes)) {
          opt.sizes.forEach((sz) => sizeSet.add(sz as ProductSize));
        }
      });
    }
  });

  return {
    brands: Array.from(brandSet),
    colors: Array.from(colorMap.values()),
    sizes: Array.from(sizeSet),
  };
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query || query.trim() === "") return [];

  cacheLife("hours");
  cacheTag("products");

  const supabase = getDbClient();
  const q = query.trim();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_options(*)")
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(5);

  if (error || !data) {
    return [];
  }

  return (data as DbProductRow[]).map(mapRowToProduct);
};

export const getProductById = cache(async (id: string): Promise<Product | undefined> => {
  if (!id) return undefined;

  cacheLife("hours");
  cacheTag(`product-${id}`, "products");

  const supabase = getDbClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_options(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return mapRowToProduct(data as DbProductRow);
});

export const getProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (!ids || ids.length === 0) return [];

  cacheLife("hours");
  cacheTag("products");

  const supabase = getDbClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_options(*)")
    .in("id", ids);

  if (error || !data) {
    return [];
  }

  return (data as DbProductRow[]).map(mapRowToProduct);
};
