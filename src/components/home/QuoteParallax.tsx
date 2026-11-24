import materials from "@/assets/detail-materials.webp";
import { ParallaxImage } from "@/components/site/media";
import { RevealText } from "@/components/site/text";

export function QuoteParallax() {
  return (
    <section className="relative flex min-h-[110svh] items-center overflow-hidden text-bone">
      <ParallaxImage src={materials} alt="" className="absolute inset-0" amount={14} />
      <div className="absolute inset-0 bg-charcoal/70" />
      <div className="relative mx-auto max-w-6xl px-6 py-32 text-center md:px-12">
        <p className="text-eyebrow text-bronze-light">(03) — Our conviction</p>
        <RevealText
          as="blockquote"
          className="text-display-md mt-10 italic"
          stagger={0.035}
          text="“We don't decorate rooms. We direct the light, the silence, and the way a morning feels.”"
        />
        <p className="text-eyebrow mt-12 text-bone/60">Elena Brunst — Founder & Creative Director</p>
      </div>
    </section>
  );
}
