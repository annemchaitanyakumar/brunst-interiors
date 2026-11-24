import { createElement } from "react";
import { motion } from "framer-motion";
import { gsap, useGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Letter-by-letter reveal (Framer Motion) played when `play` turns true. */
export function LetterReveal({
  text,
  play,
  delay = 0,
  stagger = 0.035,
  className,
}: {
  text: string;
  play: boolean;
  delay?: number;
  stagger?: number;
  className?: string;
}) {
  const words = text.split(" ");
  let index = 0;
  return (
    <span className={cn("inline-block", className)} aria-label={text} role="text">
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch) => {
            const i = index++;
            return (
              <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block origin-bottom-left"
                  initial={{ y: "115%", rotate: 8 }}
                  animate={play ? { y: "0%", rotate: 0 } : { y: "115%", rotate: 8 }}
                  transition={{ duration: 1.15, ease: EASE, delay: delay + i * stagger }}
                >
                  {ch}
                </motion.span>
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/** Word-by-word reveal (Framer Motion) for page titles, played on `play`. */
export function WordReveal({
  text,
  play,
  delay = 0,
  className,
}: {
  text: string;
  play: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline", className)} aria-label={text} role="text">
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={play ? { y: "0%" } : { y: "115%" }}
            transition={{ duration: 1.1, ease: EASE, delay: delay + i * 0.07 }}
          >
            {w}
            {"\u00a0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote";

/** Split-text reveal on scroll (GSAP ScrollTrigger): words rise out of masks. */
export function RevealText({
  text,
  as = "p",
  className,
  stagger = 0.045,
  start = "top 85%",
}: {
  text: string;
  as?: Tag;
  className?: string;
  stagger?: number;
  start?: string;
}) {
  const ref = useGsap<HTMLElement>((root) => {
    gsap.from(root.querySelectorAll("[data-w]"), {
      yPercent: 115,
      rotate: 3,
      duration: 1.2,
      ease: "power4.out",
      stagger,
      scrollTrigger: { trigger: root, start },
    });
  });
  return createElement(
    as,
    { ref, className, "aria-label": text },
    text.split(" ").map((w, i) => (
      <span key={i} aria-hidden className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
        <span data-w className="inline-block origin-bottom-left">
          {w}
          {"\u00a0"}
        </span>
      </span>
    )),
  );
}

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useGsap<HTMLParagraphElement>((root) => {
    gsap.fromTo(
      root.querySelectorAll("[data-w]"),
      { opacity: 0.12 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 45%", scrub: true },
      },
    );
  });
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w className="inline-block">
          {w}
          {"\u00a0"}
        </span>
      ))}
    </p>
  );
}
