export const SITE_NAME = "Brunst Interiors";
export const SITE_URL =
  (import.meta.env["VITE_SITE_URL"] as string | undefined)?.replace(/\/+$/, "") ||
  "https://brunstinteriors.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/videos/hero-poster.jpg`;

export const STUDIO_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "InteriorDesigner",
      "@id": `${SITE_URL}/#organization`,
      name: "Brunst Interiors",
      slogan: "Spaces That Tell Stories",
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      image: DEFAULT_OG_IMAGE,
      foundingDate: "2008",
      founder: {
        "@type": "Person",
        name: "Elena Brunst",
        jobTitle: "Founder & Creative Director",
      },
      description:
        "Luxury residential and commercial interior architecture studio in Hyderabad crafting tactile residences, boutique hotels, and ateliers across India.",
      telephone: "+91-40-4852-9100",
      email: "hello@brunstinteriors.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "K.P.H.B Colony, Kukatpally",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500072",
        addressCountry: "IN",
      },
      areaServed: ["Hyderabad", "Mumbai", "Alibaug", "Goa", "Bengaluru"],
      openingHours: "Mo-Sa 10:00-19:00",
      sameAs: [
        "https://instagram.com/brunstinteriors",
        "https://pinterest.com/brunstinteriors",
        "https://linkedin.com/company/brunst-interiors",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "Luxury interior design and architectural studio in Hyderabad — portfolio, interactive 3D house walkthrough, and studio inquiry.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
  ],
};

export interface RouteSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  jsonLd?: Record<string, unknown>;
}

/**
 * Generates unified OpenGraph, Twitter Card, Robots, Canonical URL, and JSON-LD head metadata per route.
 */
export function buildPageHead({
  title,
  description,
  path,
  keywords,
  image,
  imageAlt = "Brunst Interiors — Cinematic architectural space",
  jsonLd,
}: RouteSeoInput) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = normalizedPath === "/" ? SITE_URL : `${SITE_URL}${normalizedPath}`;
  const resolvedImage = image
    ? image.startsWith("http")
      ? image
      : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : DEFAULT_OG_IMAGE;

  const meta = [
    { title },
    { name: "description", content: description },
    ...(keywords ? [{ name: "keywords", content: keywords }] : []),
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_IN" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: resolvedImage },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: resolvedImage },
  ];

  const links = [{ rel: "canonical", href: canonicalUrl }];

  const scripts = jsonLd
    ? [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }]
    : [];

  return { meta, links, ...(scripts.length > 0 ? { scripts } : {}) };
}
