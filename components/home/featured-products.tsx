import ProductCard from "@/components/product/product-card";
import { getProducts } from "@/lib/api/products";

// 로컬 헬퍼: 피드 섹션 헤더
const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h3 className="text-xl font-extrabold tracking-tight text-neutral-900">{title}</h3>
      <p className="text-xs font-normal text-neutral-500">{subtitle}</p>
    </div>
  );
};

// 메인 FeaturedProducts 컴포넌트 (Async RSC - Supabase DB API 쿼리)
const FeaturedProducts = async () => {
  const bestProducts = await getProducts({ featuredOnly: true });

  if (bestProducts.length === 0) {
    return (
      <section className="my-14">
        <SectionHeader
          title="WEEKLY BEST ITEM"
          subtitle="이번 주 가장 많은 유저들에게 사랑받은 베스트 피스"
        />
        <div className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center text-xs text-neutral-400">
          상품 정보를 불러올 수 없습니다.
        </div>
      </section>
    );
  }

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
