/**
 * useReducedMotion Hook
 *
 * Detects user's motion preference via the prefers-reduced-motion media query.
 * Use this hook to conditionally disable or simplify animations for accessibility.
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * return (
 *   <motion.div
 *     variants={prefersReducedMotion ? reducedMotionVariants : fadeVariants}
 *     initial="hidden"
 *     animate="visible"
 *   />
 * );
 * ```
 */

import { useState, useEffect } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns true if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  // Default to false during SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);

    // Set initial value
    setPrefersReducedMotion(mediaQueryList.matches);

    // Listen for changes
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else {
      // Legacy Safari
      mediaQueryList.addListener(listener);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else {
        // Legacy Safari
        mediaQueryList.removeListener(listener);
      }
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns animation props based on reduced motion preference
 * Useful for quickly disabling animations
 */
export function useAnimationProps(enabled: boolean = true) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = enabled && !prefersReducedMotion;

  return {
    animate: shouldAnimate,
    initial: shouldAnimate ? "hidden" : false,
    transition: shouldAnimate ? undefined : { duration: 0 },
  };
}

export default useReducedMotion;
