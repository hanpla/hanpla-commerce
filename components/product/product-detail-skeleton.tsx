import Skeleton from "@/components/ui/skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-8 py-6 md:grid-cols-2 lg:gap-12">
      {/* Left: Gallery Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="aspect-3/4 w-full rounded-3xl" />
        <div className="flex gap-3">
          <Skeleton className="aspect-3/4 w-20 rounded-xl" />
          <Skeleton className="aspect-3/4 w-20 rounded-xl" />
          <Skeleton className="aspect-3/4 w-20 rounded-xl" />
        </div>
      </div>

      {/* Right: Product Info Skeleton */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-2 h-6 w-32" />
        </div>

        <Skeleton className="h-20 w-full rounded-xl" />

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-12 rounded-lg" />
            <Skeleton className="h-8 w-12 rounded-lg" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-14 rounded-lg" />
            <Skeleton className="h-9 w-14 rounded-lg" />
            <Skeleton className="h-9 w-14 rounded-lg" />
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <Skeleton className="h-14 flex-1 rounded-full" />
          <Skeleton className="h-14 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
