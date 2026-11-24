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
    if (reduce) v.pause();
    else void v.play().catch(() => {});
  }, [reduce]);

  const ref = useGsap<HTMLElement>((root) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
    });
    tl.to("[data-hero-media]", { scale: 1.18, ease: "none" }, 0)
      .to("[data-hero-frame]", { clipPath: "inset(6% 5% 12% 5% round 18px)", ease: "none" }, 0)
      .to("[data-hero-content]", { yPercent: -35, opacity: 0, ease: "none" }, 0);
  });

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[620px] bg-bone">
      <div data-hero-frame className="absolute inset-0 overflow-hidden bg-charcoal" style={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}>
        <div data-hero-media className="absolute inset-0 will-change-transform">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
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
        <div className="absolute inset-0 veil-hero" />
      </div>

      <div data-hero-content className="relative z-10 flex h-full flex-col justify-end px-6 pb-10 text-bone md:px-12 md:pb-14">
        <motion.p
          className="text-eyebrow mb-6 text-bone/70"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Brunst Interiors — Hyderabad · Est. 2008
        </motion.p>
        <h1 className="text-display-xl">
          <LetterReveal text="Spaces That" play={ready} delay={0.1} />
          <br />
          <LetterReveal text="Tell Stories." play={ready} delay={0.55} className="italic text-bronze-light" />
        </h1>

        <motion.div
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="max-w-sm text-sm leading-relaxed text-bone/75">
            Interiors directed like cinema — light, material and silence composed into homes and spaces you feel before you see.
          </p>
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-3 md:flex" aria-hidden>
              <span className="text-eyebrow text-bone/60">Scroll</span>
              <span className="relative block h-12 w-px overflow-hidden bg-bone/20">
                <span className="absolute inset-0 animate-scroll-cue bg-bone" />
              </span>
            </div>
            <PillLink to="/projects" variant="light">View the portfolio</PillLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
