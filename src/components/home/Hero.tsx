import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap, useGsap } from "@/lib/motion";
import { useSite } from "@/components/site/site-context";
import { LetterReveal } from "@/components/site/text";
import { PillLink } from "@/components/site/PillButton";
import { motion } from "framer-motion";

export function Hero() {
  const { ready } = useSite();
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduce) {
      v.pause();
    } else {
      try {
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => { });
      } catch {
        // Ignore autoplay restrictions cleanly
      }
    }
  }, [reduce]);

  const ref = useGsap<HTMLElement>((root) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
    tl.to("[data-hero-content]", { yPercent: -30, opacity: 0, ease: "none" }, 0);
  });

  return (
    <section ref={ref} className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-charcoal">
      <div
        data-hero-frame
        className="absolute inset-0 overflow-hidden bg-charcoal"
        style={{ containerType: "size" }}
      >
        {/* Video source is 1600x900 with 125px baked-in pillarboxes on left/right (active 3:2 frame = 84.375% width).
            Size the 3:2 active frame to cover the viewport and widen the video to 118.6% so the room fills 100% edge-to-edge. */}
        <div
          data-hero-media
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden will-change-transform"
          style={{
            width: "max(100cqw, calc(100cqh * 1.5))",
            height: "max(100cqh, calc(100cqw / 1.5))",
          }}
        >
          <video
            ref={videoRef}
            className="h-full w-[118.6%] max-w-none shrink-0 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/videos/hero-poster.jpg"
            aria-hidden
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 veil-hero pointer-events-none" />
      </div>

      <div data-hero-content className="pointer-events-none relative z-10 flex h-full flex-col justify-end px-5 pb-8 pt-24 text-bone md:px-12 md:pb-14">
        <motion.p
          className="text-eyebrow mb-3 text-bone/70 pointer-events-auto md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Brunst Interiors — Hyderabad · Est. 2008
        </motion.p>
        <h1 className="text-display-xl pointer-events-auto">
          <LetterReveal text="Spaces That" play={ready} delay={0.1} />
          <br />
          <LetterReveal text="Tell Stories." play={ready} delay={0.55} className="italic text-bronze-light" />
        </h1>

        <motion.div
          className="mt-6 flex flex-col gap-5 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-8 pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-sm text-sm leading-relaxed text-bone/75">
            Interiors directed like cinema — light, material and silence composed into homes and spaces you feel before you see.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
            <PillLink to="/tour" variant="bronze">3D House Tour</PillLink>
            <PillLink to="/projects" variant="light">View the portfolio</PillLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
