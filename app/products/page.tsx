"use client";

import { useEffect, useState } from "react";
import CategoryTabs from "@/components/product/category-tabs";
import ProductCard from "@/components/product/product-card";
import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import SortBar from "@/components/product/sort-bar";
import { getCategories, getProducts } from "@/lib/api/products";
import { CategoryOption, Product, SortOption } from "@/types/product";

const ProductsPage = () => {
  const [sort, setSort] = useState<SortOption>("newest");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [prodData, catData] = await Promise.all([getProducts({ sort }), getCategories()]);
      setProducts(prodData);
      setCategories(catData);
      setIsLoading(false);
    };

    fetchData();
  }, [sort]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">ALL PRODUCTS</h1>
        <p className="text-xs text-neutral-500">HANPLA 커머스의 전체 피스 컬렉션을 확인해보세요.</p>
      </div>

      <CategoryTabs categories={categories} activeCategory={null} />

      <SortBar sort={sort} onSortChange={setSort} totalCount={products.length} />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
