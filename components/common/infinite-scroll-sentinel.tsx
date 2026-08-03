"use client";

import { useRef } from "react";
import useIntersectionObserver from "@/lib/hooks/use-intersection-observer";

type InfiniteScrollSentinelProps = {
  onIntersect: () => void;
  hasMore: boolean;
  isLoading: boolean;
  rootMargin?: string;
  className?: string;
};

const InfiniteScrollSentinel = ({
  onIntersect,
  hasMore,
  isLoading,
  rootMargin = "200px",
  className = "",
}: InfiniteScrollSentinelProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useIntersectionObserver({
    targetRef: sentinelRef,
    onIntersect,
    enabled: hasMore && !isLoading,
    rootMargin,
  });

  return <div ref={sentinelRef} className={`h-4 w-full ${className}`} aria-hidden="true" />;
};

export default InfiniteScrollSentinel;
