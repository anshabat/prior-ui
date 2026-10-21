import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Reads a query parameter once on mount, preserves its value in local state,
 * and removes it from the browser URL without adding a new history entry.
 */
export function useFlashQueryParam(key: string): string | null {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Capture the param value once during initial mount
  const [flashValue] = useState<string | null>(() => searchParams.get(key));

  useEffect(() => {
    // 2. If the parameter is still present in the URL, remove it
    if (searchParams.has(key)) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(key);
          return next;
        },
        { replace: true }, // Overwrites current history entry (no back-button loop)
      );
    }
  }, [key, searchParams, setSearchParams]);

  return flashValue;
}
