import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpRight, Compass, Eye, EyeOff } from "lucide-react";
import { TOUR_STOPS } from "@/data/tour-rooms";
import { lenisStore } from "@/lib/motion";
import { TransitionLink } from "@/components/site/Curtain";
import { PillLink } from "@/components/site/PillButton";
import { cn } from "@/lib/utils";

const HouseWalkthrough3D = lazy(() =>
  import("@/components/tour/HouseWalkthrough3D").then((m) => ({ default: m.HouseWalkthrough3D })),
);

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "3D House Tour — Brunst Interiors" },
      {
        name: "description",
        content:
          "Walk through a realistic modern 3D villa — living salon, travertine kitchen, dusk dining room, bedroom, spa bath, library, and sky balcony.",
      },
      { property: "og:title", content: "3D House Tour — Brunst Interiors" },
      {
        property: "og:description",
        content: "Scroll through each room of a modern architectural home crafted by Brunst Interiors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TourPage,
});

function TourPage() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [webglUnsupported, setWebglUnsupported] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hideHud, setHideHud] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      const el = runwayRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const max = el.offsetHeight - window.innerHeight;
      if (max <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / max));
      progressRef.current = p;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const handleStopChange = useCallback((idx: number) => {
    setActiveIdx(idx);
  }, []);

  const handleWebGLUnsupported = useCallback(() => {
    setWebglUnsupported(true);
  }, []);

  const jumpToStop = useCallback((idx: number) => {
    const stop = TOUR_STOPS[idx];
    const el = runwayRef.current;
    if (!stop || !el) return;
    const max = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + stop.t * Math.max(0, max);
    if (lenisStore.current) {
      lenisStore.current.scrollTo(top, { duration: 1.45 });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActiveIdx(idx);
    progressRef.current = stop.t;
  }, []);

  const stop = TOUR_STOPS[activeIdx] ?? TOUR_STOPS[0]!;
  const maxIdxLabel = String(TOUR_STOPS.length - 1).padStart(2, "0");
  const hasPrev = activeIdx > 0;
  const hasNext = activeIdx < TOUR_STOPS.length - 1;

  return (
    <div ref={runwayRef} className="relative bg-charcoal text-bone" style={{ height: "2400vh" }}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-charcoal">
        {/* 3D WebGL House Canvas or Editorial Fallback */}
        {mounted && !webglUnsupported ? (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-charcoal text-eyebrow text-bone/60">
                Building 3D Residence...
              </div>
            }
          >
            <HouseWalkthrough3D
              progressRef={progressRef}
              onStopChange={handleStopChange}
              onWebGLUnsupported={handleWebGLUnsupported}
            />
          </Suspense>
        ) : (
          <div className="relative h-full w-full">
            <img
              src={stop.image}
              alt={stop.name}
              className="h-full w-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-charcoal/55" />
          </div>
        )}

        {/* Top Progress Hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 bg-bone/10">
          <div
            ref={progressBarRef}
            className="h-full origin-left bg-bronze will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Toggle HUD Visibility + Interaction Hint */}
        <div className="absolute right-6 top-20 z-30 flex items-center gap-3 md:right-12 md:top-24">
          <span className="hidden rounded-full border border-bone/15 bg-charcoal/85 px-3 py-1.5 text-[10px] uppercase tracking-widest text-bone/75 lg:inline-block">
            Drag to look · Scroll to walk
          </span>
          <button
            type="button"
            onClick={() => setHideHud((v) => !v)}
            aria-label={hideHud ? "Show room details" : "Hide room details"}
            className="flex items-center gap-1.5 rounded-full border border-bone/20 bg-charcoal/90 px-3.5 py-1.5 text-[10px] uppercase tracking-widest text-bone/85 transition-colors hover:border-bronze-light hover:text-bone"
          >
            {hideHud ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{hideHud ? "Show Info" : "Cinema View"}</span>
          </button>
        </div>

        {/* Lower-Left Room Info Card */}
        {!hideHud && (
          <div className="pointer-events-none absolute inset-x-6 bottom-6 z-20 flex flex-col justify-end gap-6 md:inset-x-12 md:bottom-10 md:flex-row md:items-end md:justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto max-w-md rounded-xl border border-bone/15 bg-charcoal/90 p-5 md:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-eyebrow text-bronze-light">
                    {stop.indexLabel} / {maxIdxLabel} — {stop.subtitle}
                  </p>
                  <Compass className="h-3.5 w-3.5 text-bronze-light/70" />
                </div>

                <h1 className="mt-2.5 font-display text-3xl font-light text-bone md:text-4xl">
                  {stop.name}
                </h1>

                <p className="mt-2.5 text-sm leading-relaxed text-bone/75">
                  {stop.description}
                </p>

                <p className="mt-3.5 border-t border-bone/10 pt-3 text-[11px] tracking-wide text-bronze-light/90">
                  {stop.materials}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  {stop.projectSlug ? (
                    <TransitionLink
                      to="/projects"
                      search={{ open: stop.projectSlug }}
                      data-cursor="hover"
                      className="inline-flex items-center gap-1.5 rounded-full bg-bone px-4 py-2 text-eyebrow text-charcoal transition-colors hover:bg-bronze hover:text-bone"
                    >
                      View {stop.projectTitle} <ArrowUpRight className="h-3.5 w-3.5" />
                    </TransitionLink>
                  ) : (
                    <button
                      type="button"
                      onClick={() => jumpToStop(1)}
                      data-cursor="hover"
                      className="inline-flex items-center gap-1.5 rounded-full bg-bone px-4 py-2 text-eyebrow text-charcoal transition-colors hover:bg-bronze hover:text-bone"
                    >
                      Step Inside <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!hasPrev}
                      onClick={() => jumpToStop(activeIdx - 1)}
                      aria-label="Previous room"
                      data-cursor="hover"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors hover:border-bone disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={!hasNext}
                      onClick={() => jumpToStop(activeIdx + 1)}
                      aria-label="Next room"
                      data-cursor="hover"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/25 text-bone transition-colors hover:border-bone disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom-Right Scroll Cue or Finale Actions */}
            <div className="pointer-events-auto flex flex-col items-start gap-3 md:items-end">
              {activeIdx === TOUR_STOPS.length - 1 ? (
                <div className="flex flex-wrap gap-3">
                  <PillLink to="/contact" variant="bronze">Book a consultation</PillLink>
                  <PillLink to="/projects" variant="light">All projects</PillLink>
                </div>
              ) : (
                <div className="hidden items-center gap-3 md:flex" aria-hidden>
                  <span className="text-eyebrow text-bone/60">
                    {activeIdx === 0 ? "Scroll to enter" : "Keep scrolling"}
                  </span>
                  <span className="relative block h-10 w-px overflow-hidden bg-bone/20">
                    <span className="absolute inset-0 animate-scroll-cue bg-bone" />
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right-Edge Desktop Room Index Rail */}
        {!hideHud && (
          <nav
            aria-label="Rooms in 3D house"
            className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-2.5 lg:flex md:right-12"
          >
            {TOUR_STOPS.map((item, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jumpToStop(idx)}
                  data-cursor="hover"
                  className={cn(
                    "group flex items-center gap-3 text-right transition-all duration-300",
                    active ? "text-bone" : "text-bone/45 hover:text-bone/85",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-[0.22em] transition-opacity",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {item.name}
                  </span>
                  <span className="font-mono text-[11px]">{item.indexLabel}</span>
                  <span
                    className={cn(
                      "h-px transition-all duration-300",
                      active ? "w-7 bg-bronze-light" : "w-3 bg-bone/30 group-hover:w-5",
                    )}
                  />
                </button>
              );
            })}
          </nav>
        )}

        {/* Mobile Room Pills */}
        {!hideHud && (
          <div className="absolute inset-x-0 top-20 z-20 flex gap-1.5 overflow-x-auto px-6 pb-2 lg:hidden">
            {TOUR_STOPS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => jumpToStop(idx)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors",
                  idx === activeIdx
                    ? "border-bronze-light bg-bronze text-bone"
                    : "border-bone/20 bg-charcoal/85 text-bone/75",
                )}
              >
                {item.indexLabel} · {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
