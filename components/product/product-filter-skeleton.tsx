import { ComponentPropsWithoutRef } from "react";

const SkeletonBar = ({ className = "h-4 w-full bg-neutral-200" }: { className?: string }) => (
  <div className={`animate-pulse rounded ${className}`} />
);

const ProductFilterSkeleton = ({ className = "", ...props }: ComponentPropsWithoutRef<"aside">) => {
  return (
    <aside
      className={`w-full space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <SkeletonBar className="h-5 w-24 bg-neutral-200" />
        <SkeletonBar className="h-4 w-12 bg-neutral-200" />
      </div>

      {/* Brand Section Skeleton */}
      <div className="space-y-3">
        <SkeletonBar className="h-4 w-20 bg-neutral-200" />
        <div className="space-y-2">
          <SkeletonBar className="bg-neutral-150 h-4 w-full" />
          <SkeletonBar className="bg-neutral-150 h-4 w-3/4" />
          <SkeletonBar className="bg-neutral-150 h-4 w-5/6" />
        </div>
      </div>

      {/* Price Section Skeleton */}
      <div className="space-y-3">
        <SkeletonBar className="h-4 w-20 bg-neutral-200" />
        <div className="flex gap-2">
          <SkeletonBar className="bg-neutral-150 h-8 flex-1" />
          <SkeletonBar className="bg-neutral-150 h-8 flex-1" />
        </div>
      </div>

      {/* Color Section Skeleton */}
      <div className="space-y-3">
        <SkeletonBar className="h-4 w-20 bg-neutral-200" />
        <div className="flex flex-wrap gap-2">
          <SkeletonBar className="bg-neutral-150 h-6 w-14 rounded-full" />
          <SkeletonBar className="bg-neutral-150 h-6 w-16 rounded-full" />
          <SkeletonBar className="bg-neutral-150 h-6 w-12 rounded-full" />
        </div>
      </div>
    </aside>
  );
};

export default ProductFilterSkeleton;
