import ProductCard from "@/components/product/product-card";
import CategoryTabs from "@/components/product/category-tabs";
import { getCategories, getCategoryById, getProducts } from "@/lib/api/products";
import { ProductCategory } from "@/types/product";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const generateStaticParams = async () => {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.id,
  }));
};

const CategoryProductsPage = async (props: PageProps) => {
  const params = await props.params;
  const categoryId = params.category as ProductCategory;

  const [categories, currentCategory, products] = await Promise.all([
    getCategories(),
    getCategoryById(categoryId),
    getProducts({ category: categoryId }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900 uppercase">
          {currentCategory ? currentCategory.name : categoryId}
        </h1>
        <p className="text-xs text-neutral-500">
          {currentCategory?.name} 카테고리의 큐레이션 상품 목록입니다.
        </p>
      </div>

      <CategoryTabs categories={categories} activeCategory={categoryId} />

      <div className="border-b border-neutral-200 py-2 text-xs font-medium text-neutral-500">
        총 <strong className="text-neutral-900">{products.length}개</strong>의 상품
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center text-sm text-neutral-400">
          해당 카테고리의 상품이 없습니다.
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

export default CategoryProductsPage;
