import { useRef, useCallback } from 'react';

export function useRateLimit(ms: number = 2000) {
  const lastCall = useRef(0);

  const isLimited = useCallback(() => {
    const now = Date.now();
    if (now - lastCall.current < ms) return true;
    lastCall.current = now;
    return false;
  }, [ms]);

  const withRateLimit = useCallback(
    <T extends (...args: unknown[]) => unknown>(fn: T): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
      return (...args: Parameters<T>) => {
        if (isLimited()) return undefined;
        return fn(...args) as ReturnType<T>;
      };
    },
    [isLimited],
  );

  return { isLimited, withRateLimit };
}
