import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sun, Sunset, Moon } from "lucide-react";
import { TransitionLink } from "@/components/site/Curtain";
import { RevealText } from "@/components/site/text";
import { cn } from "@/lib/utils";

const STONES = [
  {
    id: "travertine",
    name: "Roman Travertine",
    origin: "Tivoli · Honed & Unfilled",
    swatch: "linear-gradient(135deg, #D9CBB8 0%, #C8B59C 48%, #B9A386 100%)",
    vein: "repeating-linear-gradient(12deg, transparent 0 14px, rgba(90,70,48,0.08) 14px 16px, transparent 16px 32px)",
  },
  {
    id: "pietra",
    name: "Pietra Grey",
    origin: "Honed Charcoal Limestone",
    swatch: "linear-gradient(135deg, #4B4946 0%, #383633 55%, #2B2927 100%)",
    vein: "repeating-linear-gradient(-22deg, transparent 0 26px, rgba(244,239,232,0.14) 26px 27px, transparent 27px 54px)",
  },
  {
    id: "kota",
    name: "Brushed Kota Stone",
    origin: "Rajasthan · Matte",
    swatch: "linear-gradient(135deg, #6E7369 0%, #585D53 55%, #464A42 100%)",
    vein: "repeating-linear-gradient(4deg, transparent 0 22px, rgba(255,255,255,0.05) 22px 24px, transparent 24px 42px)",
  },
] as const;

const TIMBERS = [
  {
    id: "smoked-oak",
    name: "Smoked European Oak",
    finish: "Wire-brushed Matte Oil",
    swatch: "linear-gradient(160deg, #5B4636 0%, #443326 60%, #34251B 100%)",
  },
  {
    id: "burmese-teak",
    name: "Seasoned Teak",
    finish: "Natural Wax Finish",
    swatch: "linear-gradient(160deg, #8A6443 0%, #6F4E32 58%, #593E26 100%)",
  },
  {
    id: "walnut",
    name: "Kiln-Dried Walnut",
    finish: "Hand-rubbed Satin",
    swatch: "linear-gradient(160deg, #4A3528 0%, #36251B 60%, #271A12 100%)",
  },
] as const;

const WALLS = [
  {
    id: "bone-limewash",
    name: "Bone Limewash",
    tone: "Mineral Slaked Lime",
    swatch: "#EAE2D6",
    textDark: true,
  },
  {
    id: "sand-plaster",
    name: "Warm Clay Plaster",
    tone: "Hand-Troweled Earth",
    swatch: "#C7B299",
    textDark: true,
  },
  {
    id: "charcoal-tadelakt",
    name: "Charcoal Tadelakt",
    tone: "Burnished Mineral",
    swatch: "#262422",
    textDark: false,
  },
] as const;

const LIGHTS = [
  {
    id: "morning",
    label: "Morning · 4200K",
    icon: Sun,
    glow: "radial-gradient(circle at 18% 15%, rgba(255, 252, 245, 0.55) 0%, rgba(255, 250, 240, 0.12) 55%, transparent 80%)",
    tint: "rgba(245, 248, 255, 0.08)",
    note: "Cool directional daylight sharpens stone grain and opens plaster shadows.",
  },
  {
    id: "golden",
    label: "Golden Hour · 3000K",
    icon: Sunset,
    glow: "radial-gradient(circle at 22% 28%, rgba(242, 186, 112, 0.55) 0%, rgba(196, 138, 72, 0.2) 55%, transparent 85%)",
    tint: "rgba(218, 152, 78, 0.14)",
    note: "Low afternoon sun warms travertine pores and turns bronze hardware amber.",
  },
  {
    id: "nocturnal",
    label: "Nocturnal · 2200K",
    icon: Moon,
    glow: "radial-gradient(circle at 75% 70%, rgba(224, 148, 72, 0.45) 0%, rgba(26, 24, 22, 0.52) 60%, rgba(18, 16, 15, 0.72) 100%)",
    tint: "rgba(32, 24, 18, 0.32)",
    note: "Soft perimeter coves and table lamps quiet the room into deep evening warmth.",
  },
] as const;

export function MaterialAtelier() {
  const [stoneIdx, setStoneIdx] = useState(0);
  const [timberIdx, setTimberIdx] = useState(0);
  const [wallIdx, setWallIdx] = useState(0);
  const [lightIdx, setLightIdx] = useState(1);

  const stone = STONES[stoneIdx] ?? STONES[0];
  const timber = TIMBERS[timberIdx] ?? TIMBERS[0];
  const wall = WALLS[wallIdx] ?? WALLS[0];
  const light = LIGHTS[lightIdx] ?? LIGHTS[1];

  const paletteSummary = `${stone.name}, ${timber.name}, ${wall.name} (${light.label})`;

  return (
    <section id="material-atelier" className="px-6 py-16 md:px-12 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-6">
          <div>
            <RevealText
              as="h2"
              text="Pair stone, timber, and daylight."
              className="text-display-md max-w-[16ch]"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Test how our core materials respond as light shifts from crisp morning sun to 2200K evening warmth.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:mt-14 md:gap-10 lg:grid-cols-12 lg:items-stretch">
          {/* Interactive Layered Palette Board (compact min-h on mobile so swatches remain visible alongside controls) */}
          <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-xl border border-border p-5 transition-colors duration-700 sm:min-h-[340px] md:min-h-[420px] md:p-10 lg:col-span-6"
            style={{ backgroundColor: wall.swatch }}
          >
            {/* Simulated light cast */}
            <motion.div
              key={light.id}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="pointer-events-none absolute inset-0"
              style={{ background: `${light.glow}, ${light.tint}` }}
            />

            <div className={cn("relative z-10 flex items-center justify-between text-eyebrow", wall.textDark ? "text-charcoal/70" : "text-bone/70")}>
              <span>Wall · {wall.name}</span>
              <span>{light.label}</span>
            </div>

            {/* Layered physical swatches */}
            <div className="relative z-10 my-5 grid grid-cols-12 items-end gap-3 md:my-10 md:gap-4">
              {/* Stone Slab */}
              <motion.div
                layout
                className="col-span-7 aspect-[4/3] overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10"
                style={{ background: `${stone.vein}, ${stone.swatch}` }}
              >
                <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-4 text-bone">
                  <span className="text-[10px] uppercase tracking-[0.25em] opacity-80">Stone</span>
                  <span className="font-display text-xl">{stone.name}</span>
                </div>
              </motion.div>

              {/* Timber + Bronze Accent */}
              <div className="col-span-5 flex flex-col gap-3">
                <motion.div
                  layout
                  className="aspect-square overflow-hidden rounded-lg shadow-xl ring-1 ring-black/15"
                  style={{ background: timber.swatch }}
                >
                  <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/55 via-transparent to-transparent p-3.5 text-bone">
                    <span className="text-[10px] uppercase tracking-[0.22em] opacity-80">Timber</span>
                    <span className="font-display text-lg leading-tight">{timber.name}</span>
                  </div>
                </motion.div>
                <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-[#8D6843] via-[#B48A5E] to-[#745232] px-3.5 py-2.5 text-bone shadow-md">
                  <span className="text-[10px] uppercase tracking-[0.22em]">Unlacquered Bronze</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-bone/70" />
                </div>
              </div>
            </div>

            <div className={cn("relative z-10 flex flex-wrap items-center justify-between gap-4 border-t pt-4 text-xs", wall.textDark ? "border-charcoal/15 text-charcoal/80" : "border-bone/15 text-bone/80")}>
              <p className="max-w-sm leading-relaxed">{light.note}</p>
            </div>
          </div>

          {/* Controls — clean horizontal swipe pills on narrow phones so preview stays nearby */}
          <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-bone-deep p-5 sm:p-7 md:gap-7 md:p-9 lg:col-span-6">
            <div className="space-y-5 md:space-y-6">
              {/* Stone */}
              <div>
                <p className="text-eyebrow mb-2 text-bronze md:mb-2.5">01 · Stone Slab</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                  {STONES.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStoneIdx(i)}
                      data-cursor="hover"
                      className={cn(
                        "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors sm:py-2.5",
                        stoneIdx === i
                          ? "border-charcoal bg-charcoal text-bone"
                          : "border-border bg-bone text-charcoal hover:border-bronze",
                      )}
                    >
                      <span className="block text-xs font-medium">{s.name}</span>
                      <span className={cn("mt-0.5 block text-[10px]", stoneIdx === i ? "text-bone/65" : "text-muted-foreground")}>
                        {s.origin}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Timber */}
              <div>
                <p className="text-eyebrow mb-2 text-bronze md:mb-2.5">02 · Joinery Timber</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                  {TIMBERS.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTimberIdx(i)}
                      data-cursor="hover"
                      className={cn(
                        "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors sm:py-2.5",
                        timberIdx === i
                          ? "border-charcoal bg-charcoal text-bone"
                          : "border-border bg-bone text-charcoal hover:border-bronze",
                      )}
                    >
                      <span className="block text-xs font-medium">{t.name}</span>
                      <span className={cn("mt-0.5 block text-[10px]", timberIdx === i ? "text-bone/65" : "text-muted-foreground")}>
                        {t.finish}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wall Finish */}
              <div>
                <p className="text-eyebrow mb-2 text-bronze md:mb-2.5">03 · Wall Finish</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                  {WALLS.map((w, i) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWallIdx(i)}
                      data-cursor="hover"
                      className={cn(
                        "shrink-0 rounded-lg border px-3 py-2 text-left transition-colors sm:py-2.5",
                        wallIdx === i
                          ? "border-charcoal bg-charcoal text-bone"
                          : "border-border bg-bone text-charcoal hover:border-bronze",
                      )}
                    >
                      <span className="block text-xs font-medium">{w.name}</span>
                      <span className={cn("mt-0.5 block text-[10px]", wallIdx === i ? "text-bone/65" : "text-muted-foreground")}>
                        {w.tone}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Light Temp */}
              <div>
                <p className="text-eyebrow mb-2 text-bronze md:mb-2.5">04 · Lighting Study</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
                  {LIGHTS.map((l, i) => {
                    const Icon = l.icon;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLightIdx(i)}
                        data-cursor="hover"
                        className={cn(
                          "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors sm:py-2.5",
                          lightIdx === i
                            ? "border-charcoal bg-charcoal text-bone"
                            : "border-border bg-bone text-charcoal hover:border-bronze",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-bronze-light" />
                        <span className="font-medium">{l.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Selected Palette</p>
                <p className="mt-0.5 text-xs font-medium text-charcoal">{paletteSummary}</p>
              </div>
              <TransitionLink
                to="/contact"
                search={{ palette: paletteSummary }}
                data-cursor="hover"
                className="inline-flex items-center gap-1.5 rounded-full bg-charcoal px-5 py-2.5 text-eyebrow text-bone transition-colors hover:bg-bronze"
              >
                Use in inquiry <ArrowUpRight className="h-3.5 w-3.5" />
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
