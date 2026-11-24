import { gsap, useGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CLIP_FROM = {
  center: "inset(22% 22% 22% 22%)",
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
} as const;

/** Image that unmasks via clip-path and settles from a zoom as it scrolls in. */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  from = "center",
  view = false,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  from?: keyof typeof CLIP_FROM;
  view?: boolean;
  eager?: boolean;
}) {
  const ref = useGsap<HTMLDivElement>((root) => {
    const img = root.querySelector("img");
    gsap.fromTo(
      root,
      { clipPath: CLIP_FROM[from] },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 95%", end: "top 35%", scrub: 1 },
      },
    );
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.4 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom 30%", scrub: 1 } },
      );
    }
  }, [from]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-bone-deep", className)} data-cursor={view ? "view" : undefined}>
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover will-change-transform", imgClassName)}
      />
    </div>
  );
}

/** Image that drifts slower than the page for depth. */
export function ParallaxImage({
  src,
  alt,
  className,
  amount = 12,
}: {
  src: string;
  alt: string;
  className?: string;
  amount?: number;
}) {
  const ref = useGsap<HTMLDivElement>((root) => {
    const img = root.querySelector("img");
    if (!img) return;
    gsap.fromTo(
      img,
      { yPercent: -amount },
      { yPercent: amount, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } },
    );
  }, [amount]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-x-0 -top-[15%] h-[130%] w-full object-cover will-change-transform"
      />
    </div>
  );
}
