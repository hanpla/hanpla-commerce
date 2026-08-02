import ProductCatalogView from "@/components/product/product-catalog-view";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

const CategoryProductsPage = (props: PageProps) => {
  return <ProductCatalogView paramsPromise={props.params} />;
};

export default CategoryProductsPage;
