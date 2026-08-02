import Skeleton from "@/components/ui/skeleton";

const WishlistSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-1 h-3.5 w-48" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-3/4 w-full rounded-2xl" />
            <div className="mt-1 flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-10 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSkeleton;
