import { createFileRoute } from "@tanstack/react-router";
import { useSite } from "@/components/site/site-context";
import { WordReveal } from "@/components/site/text";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Brunst Interiors" },
      { name: "description", content: "Contact Brunst Interiors at K.P.H.B, Hyderabad." },
      { property: "og:title", content: "Contact — Brunst Interiors" },
      { property: "og:description", content: "Contact Brunst Interiors at K.P.H.B, Hyderabad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { ready } = useSite();
  return (
    <section className="px-6 pb-32 pt-40 md:px-12 md:pt-52">
      <p className="text-eyebrow text-bronze">Contact</p>
      <h1 className="text-display-xl mt-6">
        <WordReveal text="Start a" play={ready} />
        <br />
        <WordReveal text="Conversation." play={ready} delay={0.15} className="italic text-bronze" />
      </h1>
      <p className="mt-10 max-w-xl text-base leading-relaxed text-muted-foreground">
        K.P.H.B Colony, Kukatpally, Hyderabad, Telangana 500072 · hello@brunstinteriors.com
      </p>
    </section>
  );
}