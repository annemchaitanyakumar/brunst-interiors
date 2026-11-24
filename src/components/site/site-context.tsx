import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface SiteState {
  /** Preloader finished. */
  loaded: boolean;
  setLoaded: (v: boolean) => void;
  /** A curtain page transition is covering the screen. */
  transitioning: boolean;
  setTransitioning: (v: boolean) => void;
  /** Safe moment to play on-load animations for the current page. */
  ready: boolean;
}

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const value = useMemo(
    () => ({ loaded, setLoaded, transitioning, setTransitioning, ready: loaded && !transitioning }),
    [loaded, transitioning],
  );
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
