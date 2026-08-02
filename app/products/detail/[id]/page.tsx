import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/product/product-detail-view";
import { getProductById, getProducts } from "@/lib/api/products";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const generateStaticParams = async () => {
  const products = await getProducts();
  if (products.length === 0) {
    return [{ id: "prod-1" }];
  }
  return products.map((prod) => ({
    id: prod.id,
  }));
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다 | HANPLA COMMERCE",
    };
  }

  return {
    title: `${product.name} | ${product.brand} - HANPLA COMMERCE`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.imageUrl }],
    },
  };
};

const ProductDetailPage = async (props: PageProps) => {
  const params = await props.params;
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
};

export default ProductDetailPage;
