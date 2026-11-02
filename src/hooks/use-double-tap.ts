import { useCallback, useRef } from "react";

/**
 * Returns a click handler that only fires `onDoubleTap` when two taps/clicks
 * land within `delay` ms. Works for mouse and touch (iOS has no reliable dblclick).
 */
export function useDoubleTap(onDoubleTap: () => void, delay = 400) {
  const lastTap = useRef(0);
  return useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < delay) {
      lastTap.current = 0;
      onDoubleTap();
    } else {
      lastTap.current = now;
    }
  }, [onDoubleTap, delay]);
}
