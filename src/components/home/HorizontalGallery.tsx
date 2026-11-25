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
    const mm = gsap.matchMedia();

    // Only pin and scrub horizontally on md+ viewports; mobile uses native touch snap-scrolling
    mm.add("(min-width: 768px)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
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

    return () => mm.revert();
  });

  return (
    <section ref={ref} data-nav-surface="dark" className="relative overflow-hidden bg-charcoal text-bone" aria-label="Featured rooms">
      {/* Mobile-first editorial intro + swipeable snap gallery (< md) */}
      <div className="py-16 md:hidden">
        <div className="px-6">
            <h2 className="text-display-lg">
              Rooms <span className="italic text-bronze-light">in motion.</span>
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/65">
              Six rooms, six stories. Swipe to explore our curated interior narratives.
            </p>
        </div>

        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
          {FEATURED.map((p, i) => (
            <TransitionLink
              key={p.slug}
              to="/projects"
              search={{ open: p.slug }}
              className="group block w-[76vw] max-w-[320px] shrink-0 snap-center"
              aria-label={`${p.title} — open case study`}
            >
              <article>
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-soft">
                  <img
                    src={p.cover}
                    alt={`${p.title}, ${p.location}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3.5 top-3.5 font-display text-4xl font-light italic text-bone/90">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <span className="text-eyebrow shrink-0 text-[10px] text-bone/50">{p.category}</span>
                </div>
                <p className="mt-1 text-xs text-bone/55">{p.location}</p>
              </article>
            </TransitionLink>
          ))}
        </div>
      </div>

      {/* Desktop pinned cinema horizontal track (md+) — preserved untouched */}
      <div className="hidden h-[100svh] flex-col justify-center py-16 md:flex">
        <div data-track className="flex w-max items-center gap-10 px-12">
          <div className="flex w-[34vw] shrink-0 flex-col justify-between self-stretch">
            <div aria-hidden />
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
              className="group block w-[30vw] shrink-0"
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
