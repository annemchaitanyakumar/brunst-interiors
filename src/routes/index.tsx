import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { HorizontalGallery } from "@/components/home/HorizontalGallery";
import { QuoteParallax } from "@/components/home/QuoteParallax";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { SelectedWorks } from "@/components/home/SelectedWorks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brunst Interiors — Spaces That Tell Stories" },
      {
        name: "description",
        content: "Luxury interior design studio in Hyderabad crafting cinematic homes, hotels and boutiques. Explore our portfolio.",
      },
      { property: "og:title", content: "Brunst Interiors — Spaces That Tell Stories" },
      { property: "og:description", content: "Cinematic luxury interiors for homes, hotels and boutiques. Explore the portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Philosophy />
      <HorizontalGallery />
      <QuoteParallax />
      <ServicesMarquee />
      <SelectedWorks />
    </>
  );
}
