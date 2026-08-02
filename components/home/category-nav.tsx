import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api/products";
import { getBlurDataURL } from "@/lib/utils/image";
import { CategoryOption } from "@/types/product";

// 로컬 헬퍼: 단일 비주얼 카테고리 카드
const VisualCategoryCard = ({ category }: { category: CategoryOption }) => {
  return (
    <Link
      href={`/products/${category.id}`}
      className="group relative aspect-4/5 w-full overflow-hidden rounded-3xl shadow-sm transition-all duration-500 hover:shadow-xl"
    >
      {category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          priority={category.id === "outer"}
          placeholder="blur"
          blurDataURL={getBlurDataURL(400, 500)}
          sizes="(max-width: 640px) 50vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="h-full w-full bg-neutral-200" />
      )}

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/90" />

      {/* Card Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
        <span className="mb-1 text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
          {category.count ?? 0} ITEMS
        </span>
        <h4 className="text-xl font-black tracking-tight transition-transform duration-300 group-hover:translate-x-1">
          {category.name}
        </h4>
        <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-neutral-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          EXPLORE →
        </span>
      </div>
    </Link>
  );
};

// 메인 비주얼 카테고리 피드 컴포넌트 (Async RSC - Supabase DB 쿼리)
const CategoryNav = async () => {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <section className="my-14">
        <div className="mb-6 flex flex-col gap-1">
          <h3 className="text-xl font-extrabold tracking-tight text-neutral-900">
            VISUAL CATEGORIES
          </h3>
          <p className="text-xs font-normal text-neutral-500">
            원하는 패션 카테고리의 대표 피스들을 감각적으로 탐색해보세요
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center text-xs text-neutral-400">
          카테고리 정보를 불러올 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="my-14">
      <div className="mb-6 flex flex-col gap-1">
        <h3 className="text-xl font-extrabold tracking-tight text-neutral-900">
          VISUAL CATEGORIES
        </h3>
        <p className="text-xs font-normal text-neutral-500">
          원하는 패션 카테고리의 대표 피스들을 감각적으로 탐색해보세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {categories.map((cat) => (
          <VisualCategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
};

export default CategoryNav;
