import { useEffect, useState } from "react";

// Guarantees to call the callback, even if the main thread never goes fully idle
const IDLE_TIMEOUT = 3000;

export const useIsIdle = (): boolean => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    const handle = requestIdleCallback(() => setIsIdle(true), {
      timeout: IDLE_TIMEOUT,
    });
    return () => cancelIdleCallback(handle);
  }, []);

  return isIdle;
};
