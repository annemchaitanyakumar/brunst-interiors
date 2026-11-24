import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger, lenisStore, prefersReducedMotion } from "@/lib/motion";
import { useSite } from "./site-context";

/** Lenis smooth scrolling synced to GSAP's ticker. Starts after the preloader. */
export function SmoothScroll() {
  const { loaded } = useSite();

  useEffect(() => {
    if (!loaded) return;
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    if (prefersReducedMotion()) {
      return () => window.removeEventListener("load", onLoad);
    }

    let lenis: Lenis | null = null;
    let cancelled = false;
    const tick = (time: number) => lenis?.raf(time * 1000);

    void import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      lenis = new LenisCtor({ lerp: 0.085, smoothWheel: true });
      lenisStore.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisStore.current = null;
    };
  }, [loaded]);

  return null;
}
