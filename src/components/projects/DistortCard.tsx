import { useId, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/** Project tile with a liquid displacement ripple on hover. */
export function DistortCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const id = useId().replace(/:/g, "");
  const filterId = `distort-${id}`;
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const [active, setActive] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const enter = () => {
    if (prefersReducedMotion() || !dispRef.current || !turbRef.current) return;
    setActive(true);
    const state = { scale: 0, freq: 0.004 };
    tl.current?.kill();
    tl.current = gsap
      .timeline({
        onUpdate: () => {
          dispRef.current?.setAttribute("scale", String(state.scale));
          turbRef.current?.setAttribute("baseFrequency", `${state.freq} ${state.freq * 3}`);
        },
        onComplete: () => setActive(false),
      })
      .to(state, { scale: 60, freq: 0.012, duration: 0.45, ease: "power2.out" })
      .to(state, { scale: 0, freq: 0.004, duration: 1.1, ease: "power3.out" });
  };

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={enter}
      data-cursor="view"
      data-cursor-label="Open"
      className="group block w-full text-left"
      aria-label={`Open case study: ${project.title}`}
    >
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="2" result="noise" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className={cn("relative overflow-hidden bg-bone-deep", project.aspect)}>
        <img
          src={project.cover}
          alt={`${project.title}, ${project.location}`}
          loading="lazy"
          decoding="async"
          style={active ? { filter: `url(#${filterId})` } : undefined}
          className="h-full w-full scale-[1.04] object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-110"
        />
        <div className="absolute inset-0 veil-image opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="absolute bottom-4 left-4 translate-y-4 text-eyebrow text-bone opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
          {project.scope[0]}
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl md:text-3xl">
          <span className="mr-3 text-base italic text-bronze">{String(index + 1).padStart(2, "0")}</span>
          {project.title}
        </h3>
        <span className="text-eyebrow shrink-0 text-muted-foreground">{project.year}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {project.category} · {project.location}
      </p>
    </button>
  );
}
