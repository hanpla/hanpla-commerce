import Skeleton from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-3">
      {/* Image Skeleton */}
      <Skeleton className="aspect-3/4 w-full rounded-2xl" />

      {/* Brand & Badge Skeleton */}
      <div className="mt-1 flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-10 rounded-full" />
      </div>

      {/* Title Skeleton */}
      <Skeleton className="h-4 w-3/4" />

      {/* Price Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
