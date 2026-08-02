import ProductCard from "@/components/product/product-card";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";

// 로컬 헬퍼: 피드 섹션 헤더
const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h3 className="text-xl font-extrabold tracking-tight text-neutral-900">{title}</h3>
      <p className="text-xs font-normal text-neutral-500">{subtitle}</p>
    </div>
  );
};

// 메인 FeaturedProducts 컴포넌트
const FeaturedProducts = () => {
  const bestProducts = MOCK_PRODUCTS.filter((p) => p.isBest);

  return (
    <section className="my-14">
      <SectionHeader
        title="WEEKLY BEST ITEM"
        subtitle="이번 주 가장 많은 유저들에게 사랑받은 베스트 피스"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {bestProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
