import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { HorizontalGallery } from "@/components/home/HorizontalGallery";
import { QuoteParallax } from "@/components/home/QuoteParallax";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { SelectedWorks } from "@/components/home/SelectedWorks";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      title: "Brunst Interiors — Spaces That Tell Stories",
      description:
        "Luxury interior architecture & design studio in Hyderabad crafting bespoke villas, residences, boutique hotels, and ateliers built around natural light and honest materials.",
      path: "/",
      keywords:
        "luxury interior design Hyderabad, Brunst Interiors, residential interior architecture, travertine interiors, bespoke joinery India",
      imageAlt: "Brunst Interiors — Luxury architectural living room crafted in travertine and smoked oak",
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
