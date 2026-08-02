import { ComponentPropsWithoutRef } from "react";

const SkeletonBar = ({ className = "h-4 w-full bg-neutral-200" }: { className?: string }) => (
  <div className={`animate-pulse rounded ${className}`} />
);

const LookbookCardSkeleton = ({
  className = "",
  ...props
}: ComponentPropsWithoutRef<"article">) => {
  return (
    <article
      className={`space-y-4 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    >
      <div className="relative aspect-4/5 w-full animate-pulse overflow-hidden rounded-2xl bg-neutral-200" />
      <div className="space-y-2 px-1">
        <SkeletonBar className="h-5 w-1/2 bg-neutral-200" />
        <SkeletonBar className="bg-neutral-150 h-4 w-5/6" />
        <div className="flex gap-2 pt-2">
          <SkeletonBar className="bg-neutral-150 h-6 w-16 rounded-full" />
          <SkeletonBar className="bg-neutral-150 h-6 w-20 rounded-full" />
        </div>
      </div>
    </article>
  );
};

export default LookbookCardSkeleton;
