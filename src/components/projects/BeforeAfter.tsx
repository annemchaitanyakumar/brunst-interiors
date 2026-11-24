import { useState } from "react";
import { cn } from "@/lib/utils";

/** Drag (or use arrow keys) to compare two states of a room. */
export function BeforeAfter({
  before,
  after,
  alt,
  beforeLabel,
  afterLabel,
  simulated,
}: {
  before: string;
  after: string;
  alt: string;
  beforeLabel: string;
  afterLabel: string;
  simulated: boolean;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/5] w-full select-none overflow-hidden bg-bone-deep md:aspect-[16/10]">
      <img src={after} alt={`${alt} — ${afterLabel}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <img
        src={before}
        alt={`${alt} — ${beforeLabel}`}
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          simulated && "grayscale sepia-[0.35] contrast-[0.85] brightness-[0.95] blur-[1px]",
        )}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <div className="pointer-events-none absolute inset-y-0 w-px bg-bone" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/70 bg-charcoal/40 text-bone backdrop-blur-md">
          <span className="text-eyebrow">⟷</span>
        </div>
      </div>
      <span className="text-eyebrow absolute left-4 top-4 rounded-full bg-charcoal/50 px-3 py-1.5 text-bone backdrop-blur">{beforeLabel}</span>
      <span className="text-eyebrow absolute right-4 top-4 rounded-full bg-charcoal/50 px-3 py-1.5 text-bone backdrop-blur">{afterLabel}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
        data-cursor="hover"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
