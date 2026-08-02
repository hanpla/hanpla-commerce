import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/data/mock-products";
import { CategoryOption, Product, ProductCategory, SortOption } from "@/types/product";

export const getCategories = async (): Promise<CategoryOption[]> => {
  return MOCK_CATEGORIES;
};

export const getCategoryById = async (id: ProductCategory): Promise<CategoryOption | undefined> => {
  return MOCK_CATEGORIES.find((cat) => cat.id === id);
};

export const getProducts = async (options?: {
  category?: ProductCategory;
  sort?: SortOption;
  query?: string;
  limit?: number;
  featuredOnly?: boolean;
}): Promise<Product[]> => {
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

export const getProductById = async (id: string): Promise<Product | undefined> => {
  return MOCK_PRODUCTS.find((p) => p.id === id);
};
