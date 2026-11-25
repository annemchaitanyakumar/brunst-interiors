import { gsap, useGsap } from "@/lib/motion";
import { PROJECTS } from "@/data/projects";
import { TransitionLink } from "@/components/site/Curtain";

const FEATURED = ["maison-lumiere", "linen-house", "dusk-dining-room", "hotel-ombre", "reading-room", "maison-arc"]
  .map((slug) => PROJECTS.find((p) => p.slug === slug))
  .filter((p): p is (typeof PROJECTS)[number] => Boolean(p));

export function HorizontalGallery() {
  const ref = useGsap<HTMLElement>((root) => {
    const track = root.querySelector<HTMLElement>("[data-track]");
    if (!track) return;
    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: root,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
      },
    });
    gsap.to("[data-progress]", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: root, start: "top top", end: () => `+=${distance()}`, scrub: true },
    });
    root.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      const img = card.querySelector("img");
      if (img) {
        gsap.fromTo(
          img,
          { xPercent: -10, scale: 1.2 },
          {
            xPercent: 10,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      }
      gsap.from(card.querySelectorAll("[data-card-meta]"), {
        yPercent: 100,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 80%" },
      });
    });
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-charcoal text-bone motion-reduce:overflow-x-auto" aria-label="Featured rooms">
      <div className="flex h-[100svh] flex-col justify-center py-16">
        <div data-track className="flex w-max items-center gap-6 px-6 md:gap-10 md:px-12">
          <div className="flex w-[80vw] shrink-0 flex-col justify-between self-stretch md:w-[34vw]">
            <p className="text-eyebrow text-bronze">(02) — Featured rooms</p>
            <div>
              <h2 className="text-display-lg">
                Rooms
                <br />
                <span className="italic text-bronze-light">in motion.</span>
              </h2>
              <p className="mt-8 max-w-xs text-sm leading-relaxed text-bone/60">
                Six rooms, six stories. Keep scrolling to walk through a few of the spaces we've brought to life.
              </p>
            </div>
            <div className="h-px w-full bg-bone/15">
              <div data-progress className="h-px origin-left scale-x-0 bg-bronze" />
            </div>
          </div>

          {FEATURED.map((p, i) => (
            <TransitionLink
              key={p.slug}
              to="/projects"
              search={{ open: p.slug }}
              data-cursor="view"
              className="group block w-[72vw] shrink-0 md:w-[30vw]"
              aria-label={`${p.title} — open case study`}
            >
              <article data-card>
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-soft">
                  <img
                    src={p.cover}
                    alt={`${p.title}, ${p.location}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
                  />
                  <span className="absolute left-4 top-4 font-display text-5xl font-light italic text-bone/90">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4 overflow-hidden">
                  <h3 data-card-meta className="font-display text-3xl">{p.title}</h3>
                  <span data-card-meta className="text-eyebrow shrink-0 text-bone/50">{p.category}</span>
                </div>
                <p data-card-meta className="mt-1 text-sm text-bone/50">{p.location}</p>
              </article>
            </TransitionLink>
          ))}
          <div className="w-[6vw] shrink-0" />
        </div>
      </div>
    </section>
  );
}
