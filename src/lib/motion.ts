import { useEffect, useLayoutEffect, useRef, type DependencyList } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Media query that gates every GSAP animation so reduced-motion users get static content. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Shared handle to the Lenis instance (null when smooth scroll is off). */
export const lenisStore: { current: Lenis | null } = { current: null };

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canHover() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Scoped GSAP setup. Runs only when motion is allowed and reverts every
 * tween/ScrollTrigger created inside on unmount.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (root: T) => void | (() => void),
  deps: DependencyList = [],
) {
  const ref = useRef<T>(null);
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add(MOTION_OK, () => setup(root));
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
