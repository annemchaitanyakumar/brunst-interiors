import { gsap, ScrollTrigger, useGsap } from "@/lib/motion";

const SERVICES = ["Residential", "Commercial", "Styling", "Renovation"];

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...SERVICES, ...SERVICES];
  return (
    <div className="overflow-hidden py-2">
      <div data-marquee={reverse ? "rev" : "fwd"} className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((s, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className={i % 2 ? "text-display-xl italic text-bronze" : "text-display-xl"}>{s}</span>
                <span className="mx-5 font-display text-3xl text-bronze md:mx-14 md:text-7xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServicesMarquee() {
  const ref = useGsap<HTMLElement>((root) => {
    const fwd = gsap.to(root.querySelector("[data-marquee='fwd']"), { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    const rev = gsap.fromTo(
      root.querySelector("[data-marquee='rev']"),
      { xPercent: -50 },
      { xPercent: 0, duration: 42, ease: "none", repeat: -1 },
    );
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6);
        gsap.to([fwd, rev], { timeScale: boost * (self.direction === -1 ? -1 : 1), duration: 0.3, overwrite: true });
        gsap.to([fwd, rev], { timeScale: self.direction === -1 ? -1 : 1, duration: 1.2, delay: 0.3 });
      },
    });
    gsap.from(root.querySelectorAll("[data-marquee]"), {
      opacity: 0,
      y: 80,
      duration: 1.4,
      ease: "power4.out",
      stagger: 0.15,
      scrollTrigger: { trigger: root, start: "top 80%" },
    });
  });

  return (
    <section ref={ref} className="overflow-hidden border-y border-border py-14 md:py-28" aria-label="Our services">
      <h2 className="sr-only">Services: {SERVICES.join(", ")}</h2>
      <p className="text-eyebrow mb-6 px-6 text-bronze md:mb-10 md:px-12">(04) — What we do</p>
      <Row />
      <Row reverse />
    </section>
  );
}
