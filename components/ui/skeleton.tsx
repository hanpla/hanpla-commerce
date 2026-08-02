import { ComponentPropsWithoutRef } from "react";

type SkeletonProps = ComponentPropsWithoutRef<"div">;

const Skeleton = ({ className = "", ...props }: SkeletonProps) => {
  return (
    <div className={`animate-pulse rounded-md bg-neutral-200/80 ${className}`.trim()} {...props} />
  );
};

export default Skeleton;
