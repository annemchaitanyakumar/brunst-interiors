import { useCallback, useRef, useState } from "react";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/motion";
import { useSite } from "./site-context";

const SESSION_KEY = "brunst_seen";

/** First-visit preloader: runs once per session (~1s), skippable, then lifts like a curtain. */
export function Preloader() {
  const { setLoaded } = useSite();
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<(() => void) | null>(null);

  const handleSkip = useCallback(() => {
    skipRef.current?.();
  }, []);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;

    const alreadySeen = (() => {
      try {
        return sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        return false;
      }
    })();

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch { }
      if (!html.classList.contains("case-study-open")) {
        html.style.overflow = "";
      }
      setDone(true);
    };

      if (alreadySeen || prefersReducedMotion()) {
        setLoaded(true);
        finish();
        return;
      }

      html.style.overflow = "hidden";
      window.scrollTo(0, 0);
      let killed = false;
      let lifted = false;
      const counter = { v: 0 };

      const pageLoaded = new Promise<void>((res) => {
        if (document.readyState === "complete") res();
        else window.addEventListener("load", () => res(), { once: true });
      });
      const maxWait = new Promise<void>((res) => setTimeout(res, 1400));

      const liftCurtain = () => {
        if (killed || lifted) return;
        lifted = true;
        const tl = gsap.timeline({ onComplete: finish });
        tl.to("[data-pl-fade]", { yPercent: -110, opacity: 0, duration: 0.45, ease: "power3.in", stagger: 0.03 })
          .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "power4.inOut" }, "-=0.15")
          .add(() => setLoaded(true), "-=0.6");
      };

      skipRef.current = () => {
        if (killed || lifted) return;
        if (countRef.current) countRef.current.textContent = "100";
        if (barRef.current) barRef.current.style.transform = "scaleX(1)";
        liftCurtain();
      };

      const ctx = gsap.context(() => {
        gsap.from("[data-pl-letter]", {
          yPercent: 110,
          duration: 0.75,
          ease: "power4.out",
          stagger: 0.035,
        });
        gsap.to(counter, {
          v: 100,
          duration: 1.05,
          ease: "power2.inOut",
          onUpdate: () => {
            const v = Math.round(counter.v);
            if (countRef.current) countRef.current.textContent = String(v);
            if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
          },
          onComplete: () => {
            void Promise.race([pageLoaded, maxWait]).then(liftCurtain);
          },
        });
      }, root);

      return () => {
        killed = true;
        skipRef.current = null;
        ctx.revert();
        if (!html.classList.contains("case-study-open")) {
          html.style.overflow = "";
        }
      };
    }, [setLoaded]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      className="fixed inset-0 z-[95] flex flex-col justify-between bg-charcoal px-6 py-8 text-bone md:px-12 md:py-10"
      aria-label="Loading"
      role="status"
    >
      <div className="flex items-start justify-between text-eyebrow text-bone/60">
        <span data-pl-fade>Brunst Interiors</span>
        <div data-pl-fade className="flex items-center gap-6">
          <span className="hidden sm:inline">Spaces that tell stories</span>
          <button
            type="button"
            onClick={handleSkip}
            className="cursor-pointer border-b border-bone/30 pb-0.5 text-bone/80 transition-colors hover:border-bronze hover:text-bronze-light"
          >
            Enter
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <p data-pl-fade className="text-display-lg flex overflow-hidden">
          {"Brunst".split("").map((ch, i) => (
            <span key={i} data-pl-letter className="inline-block">
              {ch}
            </span>
          ))}
          <span data-pl-letter className="inline-block italic text-bronze">.</span>
        </p>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div data-pl-fade className="h-px flex-1 bg-bone/15">
          <div ref={barRef} className="h-px origin-left scale-x-0 bg-bronze" />
        </div>
        <p data-pl-fade className="font-display text-7xl font-light leading-none tabular-nums md:text-[10rem]">
          <span ref={countRef}>0</span>
          <span className="text-bronze">%</span>
        </p>
      </div>
    </div>
  );
}
