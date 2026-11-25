import materials from "@/assets/detail-materials.webp";
import { ParallaxImage } from "@/components/site/media";
import { RevealText } from "@/components/site/text";

export function QuoteParallax() {
  return (
    <section data-nav-surface="dark" className="relative flex min-h-[70svh] items-center overflow-hidden text-bone md:min-h-[110svh]">
      <ParallaxImage src={materials} alt="" className="absolute inset-0" amount={14} />
      <div className="absolute inset-0 bg-charcoal/70" />
      <div className="relative mx-auto max-w-6xl px-6 py-20 text-center md:px-12 md:py-32">
        <RevealText
          as="blockquote"
          className="text-display-md italic"
          stagger={0.035}
          text="“We don't decorate rooms. We direct the light, the silence, and the way a morning feels.”"
        />
        <p className="text-eyebrow mt-12 text-bone/60">Elena Brunst — Founder & Creative Director</p>
      </div>
    </section>
  );
}
