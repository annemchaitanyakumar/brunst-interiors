import { useEffect, useMemo, useRef, useState } from "react";
import { motion, transform, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { X, ArrowRight, ArrowLeft } from "lucide-react";
import type { Project } from "@/data/projects";
import { lenisStore } from "@/lib/motion";
import { BeforeAfter } from "./BeforeAfter";

const EASE = [0.76, 0, 0.24, 1] as const;

function Frame({ src, i, n, progress, alt }: { src: string; i: number; n: number; progress: MotionValue<number>; alt: string }) {
  const seg = 1 / n;
  const start = i * seg;
  const fadeIn = Math.max(0, start - seg * 0.35);
  const fadeOutStart = Math.min(1, start + seg * 0.75);
  const end = Math.min(1, start + seg);

  const opacityMap = useMemo(
    () =>
      i === 0
        ? transform([0, fadeOutStart, end], [1, 1, 0])
        : i === n - 1
          ? transform([fadeIn, start, 1], [0, 1, 1])
          : transform([fadeIn, start, fadeOutStart, end], [0, 1, 1, 0]),
    [i, n, fadeIn, start, fadeOutStart, end],
  );
  const scaleMap = useMemo(() => transform([fadeIn, end], [1.25, 1]), [fadeIn, end]);

  // Function-based transforms avoid WAAPI ScrollTimeline offset rejections in Chromium.
  const opacity = useTransform(progress, (v) => opacityMap(v));
  const scale = useTransform(progress, (v) => scaleMap(v));

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ opacity, scale }}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Sequence({ project, container }: { project: Project; container: React.RefObject<HTMLDivElement | null> }) {
  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container, target, offset: ["start start", "end end"] });
  const [idx, setIdx] = useState(0);
  const n = project.gallery.length;
  useMotionValueEvent(scrollYProgress, "change", (v) => setIdx(Math.min(n - 1, Math.floor(v * n))));
  const bar = useTransform(scrollYProgress, (v) => v);

  return (
    <div ref={target} className="relative" style={{ height: `${n * 90}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-charcoal">
        {project.gallery.map((src, i) => (
          <Frame key={i} src={src} i={i} n={n} progress={scrollYProgress} alt={`${project.title} — view ${i + 1}`} />
        ))}
        <div className="absolute inset-0 veil-image" />
        <div className="absolute inset-x-6 bottom-8 flex items-end justify-between text-bone md:inset-x-12">
          <div>
            <p className="text-eyebrow text-bronze-light">Walkthrough</p>
            <p className="mt-2 font-display text-4xl md:text-6xl">
              {String(idx + 1).padStart(2, "0")}
              <span className="text-bone/40"> / {String(n).padStart(2, "0")}</span>
            </p>
          </div>
          <div className="h-px w-32 bg-bone/20 md:w-64">
            <motion.div style={{ scaleX: bar }} className="h-px origin-left bg-bronze" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CaseStudy({
  project,
  index,
  total,
  nextTitle,
  onClose,
  onNext,
  onPrev,
}: {
  project: Project;
  index: number;
  total: number;
  nextTitle?: string | undefined;
  onClose: () => void;
  onNext: () => void;
  onPrev?: (() => void) | undefined;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lenisStore.current?.stop();
    document.documentElement.classList.add("case-study-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft" && onPrev) onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenisStore.current?.start();
      document.documentElement.classList.remove("case-study-open");
      window.removeEventListener("keydown", onKey);
    };
}, [onClose, onNext, onPrev]);

useEffect(() => {
  if (!scroller.current) return;
  if (typeof scroller.current.scrollTo === "function") {
    try {
      scroller.current.scrollTo({ top: 0 });
    } catch {
      scroller.current.scrollTop = 0;
    }
  } else {
    scroller.current.scrollTop = 0;
  }
}, [project.slug]);

const simulated = !project.before;

return (
  <motion.div
    role="dialog"
    aria-modal="true"
    aria-label={`${project.title} case study`}
    className="fixed inset-0 z-[80] bg-bone"
    initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
    exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
    transition={{ duration: 0.65, ease: EASE }}
  >
    <div
      key={project.slug}
      ref={scroller}
      data-lenis-prevent
      data-case-study-scroll=""
      data-scroll-restoration-id={`case-study-${project.slug}`}
      style={{ overflowAnchor: "none" }}
      className="relative h-full overflow-y-auto overscroll-contain"
    >
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 text-bone mix-blend-difference md:px-12 md:py-5">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-eyebrow">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            <span className="hidden sm:inline"> — {project.category}</span>
          </span>
          {onPrev && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onPrev}
                data-cursor="hover"
                aria-label="Previous project"
                className="rounded-full border border-bone/30 p-1.5 transition-colors hover:border-bone"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                data-cursor="hover"
                aria-label="Next project"
                className="rounded-full border border-bone/30 p-1.5 transition-colors hover:border-bone"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
        <button type="button" onClick={onClose} data-cursor="hover" className="flex items-center gap-3 text-eyebrow" aria-label="Close case study">
          Close <X className="h-5 w-5" />
        </button>
      </div>

      <section className="relative -mt-[68px] h-[100svh] overflow-hidden">
        <motion.img
          key={project.cover}
          src={project.cover}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 veil-hero" />
        <div className="absolute inset-x-6 bottom-10 text-bone md:inset-x-12 md:bottom-14">
          <motion.p
            className="text-eyebrow text-bronze-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {project.location} · {project.year}
          </motion.p>
          <h2 className="text-display-xl mt-4 overflow-hidden">
            <motion.span
              key={project.slug}
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ delay: 0.55, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {project.title}
            </motion.span>
          </h2>
        </div>
      </section>

      <section className="grid gap-8 px-6 py-14 md:grid-cols-12 md:gap-12 md:px-12 md:py-32">
        <dl className="grid grid-cols-2 gap-6 md:col-span-4 md:grid-cols-1 md:gap-8">
          {[
            ["Location", project.location],
            ["Year", project.year],
            ["Area", project.area],
            ["Scope", project.scope.join(", ")],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-border pt-4">
              <dt className="text-eyebrow text-muted-foreground">{k}</dt>
              <dd className="mt-2 font-display text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="md:col-span-7 md:col-start-6">
          <p className="text-display-md">{project.summary}</p>
          <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground">{project.story}</p>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-12 md:pb-32">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8 md:gap-6">
          <h3 className="text-display-md">{simulated ? "Concept to reveal" : "Before & after"}</h3>
          <p className="text-eyebrow text-muted-foreground">Drag to compare</p>
        </div>
        <BeforeAfter
          before={project.before ?? project.cover}
          after={project.cover}
          alt={project.title}
          beforeLabel={simulated ? "Concept" : "Before"}
          afterLabel={simulated ? "Reveal" : "After"}
          simulated={simulated}
        />
      </section>

      <Sequence project={project} container={scroller} />

      <button
        type="button"
        onClick={(e) => {
          e.currentTarget.blur();
          onNext();
        }}
        data-cursor="view"
        data-cursor-label="Next"
        className="group flex w-full items-end justify-between bg-charcoal px-6 py-14 text-left text-bone md:px-12 md:py-28"
      >
        <div>
          <p className="text-eyebrow text-bronze-light">Next project</p>
          <p className="text-display-lg mt-4 transition-transform duration-700 ease-silk group-hover:translate-x-4">
            {nextTitle ?? "Continue"}
          </p>
        </div>
        <ArrowRight className="h-10 w-10 transition-transform duration-700 group-hover:translate-x-3 md:h-16 md:w-16" />
      </button>
    </div>
  </motion.div>
);
}
