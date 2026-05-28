import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  loadMore: () => void;
  observerEnabled?: boolean;
}

export const useInfiniteScroll = ({
  loadMore,
  observerEnabled = true,
}: UseInfiniteScrollProps) => {
  const topElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topElement = topElementRef.current;
    if (!(topElement && observerEnabled)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(topElement);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, observerEnabled]);

  return { topElementRef };
};
