import { gsap, useGsap } from "@/lib/motion";
import { TransitionLink } from "./Curtain";
import { PillLink } from "./PillButton";
import { RevealText } from "./text";

export function Footer() {
  const ref = useGsap<HTMLElement>((root) => {
    gsap.from(root.querySelectorAll("[data-wordmark] span"), {
      yPercent: 100,
      ease: "power4.out",
      duration: 1.4,
      stagger: 0.06,
      scrollTrigger: { trigger: root.querySelector("[data-wordmark]"), start: "top 95%" },
    });
    gsap.fromTo(
      root.querySelector("[data-footer-inner]"),
      { yPercent: -25 },
      { yPercent: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true } },
    );
  });

  return (
    <footer ref={ref} data-nav-surface="dark" className="relative overflow-hidden bg-charcoal text-bone">
      <div data-footer-inner className="px-6 pb-8 pt-16 md:px-12 md:pt-40">
        <p className="text-eyebrow text-bronze">Begin a project</p>
        <RevealText
          as="h2"
          text="Let's shape the story your space is waiting to tell."
          className="text-display-lg mt-5 max-w-[14ch] md:mt-6"
        />
        <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-12 md:gap-4">
          <PillLink to="/contact" variant="bronze">Start a project</PillLink>
          <PillLink to="/projects" variant="light">Browse the portfolio</PillLink>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-bone/15 pt-8 text-sm text-bone/70 md:mt-28 md:grid-cols-4 md:gap-10 md:pt-10">
          <div>
            <p className="text-eyebrow mb-3 text-bone/40 md:mb-4">Studio</p>
            <p>K.P.H.B Colony</p>
            <p>Kukatpally, Hyderabad</p>
            <p>Telangana 500072</p>
          </div>
          <div className="min-w-0">
            <p className="text-eyebrow mb-3 text-bone/40 md:mb-4">Contact</p>
            <a href="mailto:hello@brunstinteriors.com" className="link-underline block max-w-full truncate">hello@brunstinteriors.com</a>
            <a href="tel:+914048529100" className="link-underline mt-1 block w-fit">+91 40 4852 9100</a>
          </div>
          <div>
            <p className="text-eyebrow mb-3 text-bone/40 md:mb-4">Explore</p>
            <ul className="space-y-1">
              <li><TransitionLink to="/projects" className="link-underline">Projects</TransitionLink></li>
              <li><TransitionLink to="/tour" className="link-underline">3D House Tour</TransitionLink></li>
              <li><TransitionLink to="/studio" className="link-underline">Studio</TransitionLink></li>
              <li><TransitionLink to="/contact" className="link-underline">Contact</TransitionLink></li>
            </ul>
          </div>
          <div>
            <p className="text-eyebrow mb-3 text-bone/40 md:mb-4">Follow</p>
            <ul className="space-y-1">
              <li><a href="https://instagram.com/brunstinteriors" target="_blank" rel="noreferrer" className="link-underline">Instagram</a></li>
              <li><a href="https://pinterest.com/brunstinteriors" target="_blank" rel="noreferrer" className="link-underline">Pinterest</a></li>
              <li><a href="https://linkedin.com/company/brunst-interiors" target="_blank" rel="noreferrer" className="link-underline">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <p
          data-wordmark
          aria-hidden
          className="mt-16 flex overflow-hidden font-display text-[26vw] font-light leading-[0.78] tracking-[-0.06em] text-bone/95"
        >
          {"Brunst".split("").map((c, i) => (
            <span key={i} className="inline-block">{c}</span>
          ))}
          <span className="inline-block italic text-bronze">.</span>
        </p>
        <div className="mt-6 flex flex-wrap justify-between gap-4 text-eyebrow text-bone/40">
          <span>© {new Date().getFullYear()} Brunst Interiors</span>
          <span>Spaces that tell stories</span>
        </div>
      </div>
    </footer>
  );
}
