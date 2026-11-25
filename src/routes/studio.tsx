import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Compass, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { useSite } from "@/components/site/site-context";
import { WordReveal, RevealText } from "@/components/site/text";
import { RevealImage } from "@/components/site/media";
import { PillLink } from "@/components/site/PillButton";
import { MaterialAtelier } from "@/components/studio/MaterialAtelier";

import founderImg from "@/assets/founder.webp";
import team1Img from "@/assets/team-1.webp";
import team2Img from "@/assets/team-2.webp";
import team3Img from "@/assets/team-3.webp";
import materialsImg from "@/assets/detail-materials.webp";
import livingImg from "@/assets/hero-living.webp";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio — Brunst Interiors" },
      {
        name: "description",
        content: "Discover the design philosophy, team, and materials library of Brunst Interiors in Hyderabad.",
      },
      { property: "og:title", content: "Studio — Brunst Interiors" },
      {
        property: "og:description",
        content: "Interior design studio in Hyderabad crafting residential and commercial spaces since 2008.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioPage,
});

const STATS = [
  { value: "18+", label: "Years of practice", detail: "Founded in Hyderabad, 2008" },
  { value: "140+", label: "Completed spaces", detail: "Homes, hotels & boutiques" },
  { value: "12", label: "Design awards", detail: "National & global recognition" },
  { value: "100%", label: "Custom joinery", detail: "Built by local craftsmen" },
];

const PRINCIPLES = [
  {
    num: "01",
    title: "Light first",
    desc: "Before drawing a single wall, we track how sunlight moves across the site so rooms shift naturally from morning to evening.",
  },
  {
    num: "02",
    title: "Honest materials",
    desc: "Honed travertine, unlacquered bronze that patinates with touch, and breathable lime plaster. Nothing faux, nothing rushed.",
  },
  {
    num: "03",
    title: "Quiet rooms",
    desc: "Calm is part of the architecture. Heavy linen drapery, wool rugs, and acoustic detailing soften the city outside.",
  },
  {
    num: "04",
    title: "Measured pacing",
    desc: "A space unfolds in sequence — a quiet entry, an open living room filled with daylight, and warm private quarters.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    name: "Brief & Light Study",
    duration: "Weeks 1 – 3",
    description:
      "We start by listening to how you live, work, and gather, while mapping daylight across every room at different hours.",
    icon: Compass,
  },
  {
    step: "02",
    name: "Material Selection",
    duration: "Weeks 4 – 7",
    description:
      "At our K.P.H.B studio, we assemble a physical palette of stone slabs, timber veneers, textiles, and plaster finishes to review in person.",
    icon: Layers,
  },
  {
    step: "03",
    name: "Drawings & Detailing",
    duration: "Weeks 8 – 14",
    description:
      "Every joinery piece, lighting fixture, and shadow gap is drawn to scale alongside photorealistic views before site work begins.",
    icon: Sparkles,
  },
  {
    step: "04",
    name: "Build & Styling",
    duration: "On-site",
    description:
      "Our team works closely with stonemasons, carpenters, and lighting specialists through installation, art placement, and handover.",
    icon: ShieldCheck,
  },
];

const TEAM = [
  {
    name: "Elena Brunst",
    role: "Founder & Creative Director",
    image: founderImg,
    bio: "Founded the studio in 2008 with a focus on natural light, tactile stone, and calm, lived-in residential spaces.",
  },
  {
    name: "Ananya Sen",
    role: "Design Director",
    image: team1Img,
    bio: "Leads spatial planning, custom millwork, and residential renovations across Hyderabad and Mumbai.",
  },
  {
    name: "Vikramaditya Rao",
    role: "Head of Materials & Craft",
    image: team2Img,
    bio: "Sources natural stone blocks, seasoned timber, and custom brass and bronze hardware directly from quarries and workshops.",
  },
  {
    name: "Meera Varma",
    role: "Lead Stylist & Art Curator",
    image: team3Img,
    bio: "Brings each room to life with contemporary art, hand-loomed textiles, and vintage pieces collected across India.",
  },
];

const PRESS = [
  {
    quote: "Brunst Interiors shapes private homes with the calm and restraint of cinema.",
    publication: "Architectural Digest",
  },
  {
    quote: "A study in how raw travertine, daylight, and quiet proportions define contemporary Indian homes.",
    publication: "Elle Décor",
  },
  {
    quote: "One of the most thoughtful interior design practices working out of Hyderabad.",
    publication: "Design Anthology",
  },
];

function StudioPage() {
  const { ready } = useSite();

  return (
    <main className="bg-bone text-charcoal">
      {/* Hero Section */}
      <section className="px-6 pb-14 pt-28 md:px-12 md:pb-28 md:pt-52">
        <div className="max-w-6xl">
          <p className="text-eyebrow text-bronze">(01) — Studio</p>
          <h1 className="text-display-xl mt-4 md:mt-6">
            <WordReveal text="Crafted in" play={ready} />
            <br />
            <WordReveal text="Light & Silence." play={ready} delay={0.15} className="italic text-bronze" />
          </h1>
          <motion.div
            className="mt-8 grid gap-6 md:mt-12 md:grid-cols-12 md:gap-16"
            initial={{ opacity: 0, y: 30 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <p className="text-base leading-relaxed text-muted-foreground md:col-span-7 md:text-xl">
              Founded in Hyderabad in 2008, Brunst Interiors designs homes, hotels, and boutiques built to age gracefully.
              We compose rooms around natural light, tactile materials, and the daily routines of the people inside.
            </p>
            <div className="flex flex-col justify-end md:col-span-5">
              <p className="text-sm leading-relaxed text-stone">
                From our studio in K.P.H.B Colony, we take on residential and commercial projects across Hyderabad,
                Mumbai, Goa, and Bengaluru.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-y border-border py-8 md:mt-28 md:grid-cols-4 md:gap-8 md:py-12">
          {STATS.map((s, idx) => (
            <div key={idx} className="space-y-2">
              <span className="font-display text-4xl text-charcoal md:text-6xl">{s.value}</span>
              <p className="text-eyebrow font-medium text-charcoal">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-6 py-14 md:px-12 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-eyebrow text-bronze">(02) — Philosophy</p>
            <RevealText
              as="h2"
              text="We don't decorate rooms. We shape how they feel."
              className="text-display-md mt-6"
            />
            <p className="mt-8 text-base leading-relaxed text-muted-foreground">
              Every project begins with observation — how afternoon light crosses a plaster wall, how sound carries
              in an open room, and how smoked oak feels underfoot.
            </p>
            <div className="mt-12 space-y-8">
              {PRINCIPLES.map((item) => (
                <div key={item.num} className="border-t border-border pt-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-eyebrow text-bronze">{item.num}</span>
                    <h3 className="font-display text-2xl text-charcoal">{item.title}</h3>
                  </div>
                  <p className="mt-3 pl-8 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7">
            <RevealImage
              src={livingImg}
              alt="Living room designed by Brunst Interiors"
              className="aspect-[4/3] w-full"
              from="center"
              view
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Maison Lumière · Alibaug</span>
              <span>Natural evening light</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-bone-deep px-6 py-16 md:px-12 md:py-36">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-eyebrow text-bronze">(03) — Process</p>
            <RevealText
              as="h2"
              text="From first sketches to final handover."
              className="text-display-md mx-auto mt-4 max-w-2xl text-center"
            />
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              We take on a small number of projects each year so every client works directly with our senior team from concept to completion.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="group relative flex flex-col justify-between rounded-lg border border-border/80 bg-bone p-8 transition-shadow duration-500 hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-eyebrow text-bronze">Phase {step.step}</span>
                      <span className="text-xs text-muted-foreground">{step.duration}</span>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-bone">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-display text-2xl text-charcoal">{step.name}</h3>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                  <div className="mt-8 border-t border-border pt-4 text-xs text-bronze opacity-80">
                    Stage {i + 1} of {PROCESS_STEPS.length}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Materials Library */}
      <section className="px-6 py-16 md:px-12 md:py-36">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <RevealImage
              src={materialsImg}
              alt="Material samples at Brunst Interiors Hyderabad"
              className="aspect-[4/3] w-full"
              from="bottom"
              view
            />
          </div>
          <div className="lg:col-span-6 lg:pl-8">
            <p className="text-eyebrow text-bronze">(04) — Materials Library</p>
            <RevealText
              as="h2"
              text="Stone, timber, linen, and hand-finished plaster."
              className="text-display-md mt-6"
            />
            <p className="mt-8 text-base leading-relaxed text-muted-foreground">
              Our K.P.H.B studio houses hundreds of stone samples, limewash tests, hand-loomed linens, and patinated
              metals. We study every combination under real daylight and warm evening lighting before anything goes to site.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5 border-t border-border pt-6 text-sm sm:grid-cols-2 sm:gap-6">
              <div>
                <p className="font-medium text-charcoal">Travertine & Marble</p>
                <p className="mt-1 text-xs text-muted-foreground">Hand-picked slabs from Indian and Italian quarries</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">Seasoned Timber</p>
                <p className="mt-1 text-xs text-muted-foreground">Teak, smoked oak, and solid walnut joinery</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">Lime Plaster</p>
                <p className="mt-1 text-xs text-muted-foreground">Hand-troweled mineral walls with natural pigments</p>
              </div>
              <div>
                <p className="font-medium text-charcoal">Cast Bronze</p>
                <p className="mt-1 text-xs text-muted-foreground">Custom handles and fixtures finished by local artisans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Material & Light Study */}
      <MaterialAtelier />

      {/* Team */}
      <section className="bg-bone-deep px-6 py-16 md:px-12 md:py-36">
        <div>
          <p className="text-eyebrow text-bronze">(05) — Team</p>
          <RevealText
            as="h2"
            text="The people behind the studio."
            className="text-display-lg mt-4 md:mt-6"
          />
          <p className="mt-4 max-w-xl text-sm text-muted-foreground md:mt-6 md:text-base">
            Architects, interior designers, material researchers, and stylists working together on every detail.
          </p>
        </div>

        {/* Horizontal snap swipe strip on phones (< sm), standard 2/4-col grid on sm+/lg+ */}
        <div className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-10 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {TEAM.map((member) => (
            <div key={member.name} className="group w-[72vw] max-w-[290px] shrink-0 snap-center sm:w-auto sm:max-w-none">
              <div className="overflow-hidden bg-charcoal">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-silk group-hover:scale-105"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-display text-2xl text-charcoal">{member.name}</h3>
                <p className="text-eyebrow mt-1 text-bronze">{member.role}</p>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press */}
      <section className="px-6 py-24 md:px-12 md:py-36">
        <p className="text-eyebrow text-bronze">(06) — Press</p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {PRESS.map((item, idx) => (
            <blockquote key={idx} className="flex flex-col justify-between border-l-2 border-bronze py-2 pl-6">
              <p className="font-display text-2xl italic leading-snug text-charcoal md:text-3xl">
                "{item.quote}"
              </p>
              <cite className="text-eyebrow mt-8 block not-italic text-stone">
                — {item.publication}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Next Step CTA */}
      <section className="border-t border-border px-6 py-24 text-center md:px-12 md:py-36">
        <p className="text-eyebrow text-bronze">Work with us</p>
        <RevealText
          as="h2"
          text="Let's shape the space you're building."
          className="text-display-lg mx-auto mt-6 max-w-3xl text-center"
        />
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          We work on private homes, boutique hotels, and retail spaces across India.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <PillLink to="/contact" variant="solid">Book a consultation</PillLink>
          <PillLink to="/projects" variant="outline">View portfolio</PillLink>
        </div>
      </section>
    </main>
  );
}
