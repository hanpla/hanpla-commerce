import { RefObject, useEffect, useRef } from "react";

type UseIntersectionObserverProps = {
  targetRef: RefObject<HTMLDivElement | null>;
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
};

const useIntersectionObserver = ({
  targetRef,
  onIntersect,
  enabled = true,
  rootMargin = "200px",
  threshold = 0.1,
}: UseIntersectionObserverProps) => {
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;

    const targetNode = targetRef.current;
    if (!targetNode) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersectRef.current();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(targetNode);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, enabled, rootMargin, threshold]);
};

export default useIntersectionObserver;
