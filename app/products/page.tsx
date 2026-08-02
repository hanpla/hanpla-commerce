import ProductCatalogView from "@/components/product/product-catalog-view";
import { getCategories } from "@/lib/api/products";

const ProductsPage = async () => {
  const categories = await getCategories();
  return <ProductCatalogView initialCategories={categories} />;
};

export default ProductsPage;
