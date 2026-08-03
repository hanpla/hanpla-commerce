export type ProductCategory = "outer" | "top" | "bottom" | "shoes" | "acc";

export type CategoryOption = {
  id: ProductCategory;
  name: string;
  count?: number;
  imageUrl?: string;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductSize = "S" | "M" | "L" | "XL" | "FREE";

export type ProductOption = {
  color: ProductColor;
  sizes: ProductSize[];
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  imageUrl: string;
  images: string[];
  description: string;
  options: ProductOption[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBest?: boolean;
  stock: number;
  createdAt: string;
};

export type SortOption = "newest" | "popular" | "price-low" | "price-high";

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  linkUrl: string;
};

export type ProductFilterState = {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  color?: string[];
  size?: ProductSize[];
  sort?: SortOption;
  searchQuery?: string;
  page?: number;
  limit?: number;
};

export type PaginatedProductsResult = {
  products: Product[];
  totalCount: number;
  hasNextPage: boolean;
  page: number;
};

export type LookbookTagSpot = {
  id: string;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
  productId: string;
};

export type LookbookItem = {
  id: string;
  title: string;
  modelName: string;
  description: string;
  imageUrl: string;
  tags: string[];
  tagSpots: LookbookTagSpot[];
  likes: number;
  createdAt: string;
};
