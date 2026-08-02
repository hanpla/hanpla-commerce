import ProductCatalogView from "@/components/product/product-catalog-view";
import { getCategories, getCategoryById } from "@/lib/api/products";
import { ProductCategory } from "@/types/product";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const generateStaticParams = async () => {
  const categories = await getCategories();
  if (categories.length === 0) {
    return [{ category: "top" }];
  }
  return categories.map((cat) => ({
    category: cat.id,
  }));
};

const CategoryProductsPage = async (props: PageProps) => {
  const params = await props.params;
  const categoryId = params.category as ProductCategory;

  const [categories, currentCategory] = await Promise.all([
    getCategories(),
    getCategoryById(categoryId),
  ]);

  return (
    <ProductCatalogView
      paramsPromise={props.params}
      initialCategories={categories}
      initialCurrentCategory={currentCategory}
    />
  );
};

export default CategoryProductsPage;
