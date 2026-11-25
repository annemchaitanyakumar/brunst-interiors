import { createContext, useCallback, useContext, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { gsap, ScrollTrigger, lenisStore, prefersReducedMotion } from "@/lib/motion";
import { useSite } from "./site-context";

export type SiteRoute = "/" | "/projects" | "/tour" | "/studio" | "/contact";

const LABELS: Record<SiteRoute, string> = {
  "/": "Home",
  "/projects": "Projects",
  "/tour": "3D House Tour",
  "/studio": "Studio",
  "/contact": "Contact",
};

export type RouteSearch = Record<string, string | undefined>;

const CurtainContext = createContext<{ go: (to: SiteRoute, search?: RouteSearch) => void }>({ go: () => { } });

/** Curtain-wipe page transitions: cover → navigate → reveal. */
export function CurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { setTransitioning } = useSite();
  const bronzeRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pendingReveal = useRef(false);
  const [label, setLabel] = useState("");

  const go = useCallback(
      (to: SiteRoute, search?: RouteSearch) => {
        if (busy.current) return;
          const hasSearch = Boolean(search && Object.values(search).some(Boolean));
          if (to === pathname && !hasSearch) {
            lenisStore.current?.scrollTo(0);
            if (!lenisStore.current) window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          if (prefersReducedMotion() || !panelRef.current || !bronzeRef.current) {
            void router.navigate({ to, ...(search ? { search: search as never } : {}) });
            return;
          }
          busy.current = true;
          setLabel(LABELS[to]);
          setTransitioning(true);
          lenisStore.current?.stop();
          const layers = [bronzeRef.current, panelRef.current];
          gsap
            .timeline({
              onComplete: () => {
                pendingReveal.current = true;
                void router.navigate({ to, ...(search ? { search: search as never } : {}) });
              },
            })
            .set(layers, { yPercent: 100, visibility: "visible" })
        .to(layers, { yPercent: 0, duration: 0.6, ease: "power4.inOut", stagger: 0.06 })
    .fromTo("[data-curtain-label]", { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: "power3.out" }, "-=0.25");
},
[pathname, router, setTransitioning],
  );

useEffect(() => {
  lenisStore.current?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
  if (!pendingReveal.current) {
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return;
  }
  pendingReveal.current = false;
  const layers = [panelRef.current, bronzeRef.current];
  const id = requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    lenisStore.current?.start();
    gsap
      .timeline({
        delay: 0.15,
        onComplete: () => {
          busy.current = false;
          gsap.set(layers, { visibility: "hidden" });
        },
      })
      .to("[data-curtain-label]", { yPercent: -110, duration: 0.45, ease: "power3.in" })
      .add(() => setTransitioning(false))
      .to(layers, { yPercent: -100, duration: 0.95, ease: "power4.inOut", stagger: 0.08 }, "-=0.1");
  });
  return () => cancelAnimationFrame(id);
}, [pathname, setTransitioning]);

return (
  <CurtainContext.Provider value={{ go }}>
    {children}
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[96]">
      <div ref={bronzeRef} className="invisible absolute inset-0 bg-bronze" />
      <div ref={panelRef} className="invisible absolute inset-0 flex items-center justify-center bg-charcoal">
        <div className="overflow-hidden">
          <p data-curtain-label className="text-display-lg italic text-bone">
            {label}
          </p>
        </div>
      </div>
    </div>
  </CurtainContext.Provider>
);
}

export function useCurtain() {
  return useContext(CurtainContext);
}

/** Link that plays the curtain transition before navigating. */
export function TransitionLink({
  to,
  search,
  children,
  className,
  onNavigate,
  ...rest
}: {
  to: SiteRoute;
  search?: RouteSearch;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  "aria-label"?: string;
  "data-cursor"?: string;
  "data-cursor-label"?: string;
}) {
  const { go } = useCurtain();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate?.();
    go(to, search);
  };
  return (
      <Link
        to={to}
        {...(search ? { search } : {})}
        onClick={handle}
        className={className}
        activeProps={{ "data-status": "active" }}
        {...rest}
      >
        {children}
      </Link>
      );
}
