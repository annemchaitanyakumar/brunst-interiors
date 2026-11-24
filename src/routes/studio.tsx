import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/components/site/site-context";
import { WordReveal } from "@/components/site/text";
import { PillLink } from "@/components/site/PillButton";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio — Brunst Interiors" },
      { name: "description", content: "Meet Brunst Interiors in K.P.H.B, Hyderabad." },
      { property: "og:title", content: "Studio — Brunst Interiors" },
      { property: "og:description", content: "Meet Brunst Interiors in K.P.H.B, Hyderabad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioPage,
});

function StudioPage() {
  const { ready } = useSite();
  return (
    <section className="px-6 pb-32 pt-40 md:px-12 md:pt-52">
      <p className="text-eyebrow text-bronze">Studio — Hyderabad</p>
      <h1 className="text-display-xl mt-6">
        <WordReveal text="Crafted in" play={ready} />
        <br />
        <WordReveal text="Light & Silence." play={ready} delay={0.15} className="italic text-bronze" />
      </h1>
      <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground">
        The full Studio story, process timeline, team portraits, and studio counters are ready to be completed next.
      </p>
      <div className="mt-10">
        <PillLink to="/projects" variant="solid">Explore the portfolio</PillLink>
      </div>
    </section>
  );
}