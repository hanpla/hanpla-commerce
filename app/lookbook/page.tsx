import { Suspense } from "react";
import LookbookCard from "@/components/lookbook/lookbook-card";
import LookbookCardSkeleton from "@/components/lookbook/lookbook-card-skeleton";
import { getLookbooks } from "@/lib/api/lookbooks";

const LookbookFeed = async () => {
  const lookbooks = await getLookbooks();

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {lookbooks.map((look) => (
        <LookbookCard key={look.id} lookbook={look} />
      ))}
    </div>
  );
};

const LookbookPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-neutral-100 pb-6">
        <div className="inline-flex items-center gap-2">
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600">
            2026 S/S STYLE
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">OOTD LOOKBOOK</h1>
        <p className="text-sm text-neutral-500">
          이미지 위 지점(Pin)을 클릭하여 오피셜 스타일링에 착장된 상품 정보를 바로 확인해보세요.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <LookbookCardSkeleton key={idx} />
            ))}
          </div>
        }
      >
        <LookbookFeed />
      </Suspense>
    </div>
  );
};

export default LookbookPage;
