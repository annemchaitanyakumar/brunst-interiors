import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/motion";
import { useSite } from "./site-context";

/** First-visit preloader: counts to 100%, then lifts like a curtain. */
export function Preloader() {
  const { setLoaded } = useSite();
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const finish = () => {
      html.style.overflow = "";
      setDone(true);
    };

    if (prefersReducedMotion()) {
      setLoaded(true);
      finish();
      return;
    }

    window.scrollTo(0, 0);
    let killed = false;
    const counter = { v: 0 };
    const pageLoaded = new Promise<void>((res) => {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", () => res(), { once: true });
    });
    const maxWait = new Promise<void>((res) => setTimeout(res, 3500));

    const ctx = gsap.context(() => {
      gsap.from("[data-pl-letter]", {
        yPercent: 120,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.05,
      });
      gsap.to(counter, {
        v: 100,
        duration: 2.4,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(counter.v);
          if (countRef.current) countRef.current.textContent = String(v);
          if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
        },
        onComplete: () => {
          void Promise.race([pageLoaded, maxWait]).then(() => {
            if (killed) return;
            const tl = gsap.timeline({ onComplete: finish });
            tl.to("[data-pl-fade]", { yPercent: -120, opacity: 0, duration: 0.7, ease: "power3.in", stagger: 0.04 })
              .to(root, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.15, ease: "power4.inOut" }, "-=0.2")
              .add(() => setLoaded(true), "-=0.75");
          });
        },
      });
    }, root);

    return () => {
      killed = true;
      ctx.revert();
      html.style.overflow = "";
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
        <span data-pl-fade>Spaces that tell stories</span>
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
