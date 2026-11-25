import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useSite } from "@/components/site/site-context";
import { WordReveal, RevealText } from "@/components/site/text";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PillLink } from "@/components/site/PillButton";

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { palette?: string | undefined } => ({
    palette: typeof search["palette"] === "string" ? (search["palette"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact — Brunst Interiors" },
      {
        name: "description",
        content: "Contact Brunst Interiors at K.P.H.B Colony, Hyderabad to discuss a residential or commercial project.",
      },
      { property: "og:title", content: "Contact — Brunst Interiors" },
      {
        property: "og:description",
        content: "Start a conversation with Brunst Interiors for residential and commercial interior projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const PROJECT_TYPES = [
  "Residential",
  "Penthouse / Apartment",
  "Hospitality / Commercial",
  "Full Renovation",
  "Styling & Art",
];

const LOCATIONS = [
  "Hyderabad (Jubilee / Banjara Hills)",
  "Hyderabad (K.P.H.B / Financial District)",
  "Mumbai / Alibaug",
  "Goa",
  "Bengaluru",
  "Other",
];

const BUDGET_RANGES = [
  "₹50L – ₹1.2Cr",
  "₹1.2Cr – ₹2.5Cr",
  "₹2.5Cr – ₹5Cr",
  "₹5Cr+",
];

const TIMELINES = [
  "Immediate",
  "Within 3 – 6 Months",
  "6 – 12 Months",
  "Planning Stage",
];

const FAQS = [
  {
    q: "How early should we reach out during construction?",
    a: "Ideally while civil drawings are still open. Involving us early lets us align window proportions, concealed electrical and HVAC routes, and lighting points before walls are built.",
  },
  {
    q: "Do you take on projects outside Hyderabad?",
    a: "Yes. While our studio and materials library are in K.P.H.B Colony, Hyderabad, we regularly work on residences and boutique hotels in Mumbai, Alibaug, Goa, and Bengaluru with scheduled site visits throughout the build.",
  },
  {
    q: "What is included in a full-scope project?",
    a: "We handle space planning, lighting design, custom joinery drawings, stone and material sourcing, contractor coordination, bespoke furniture, art curation, and final room styling.",
  },
  {
    q: "How are design fees structured?",
    a: "Fees are phased across design, detailing, and site supervision based on area and scope. We share a clear proposal after our initial consultation.",
  },
  {
    q: "How long does a typical residence take?",
    a: "Most full-home projects run between 6 and 14 months depending on structural changes, stonework, and custom millwork.",
  },
  {
    q: "Can we visit the studio to see material samples?",
    a: "Yes. Book an appointment to visit our K.P.H.B studio, where you can review travertine slabs, smoked oak, limewash finishes, and hardware in person.",
  },
];

function ContactPage() {
  const { ready } = useSite();
  const search = Route.useSearch();
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [budget, setBudget] = useState(BUDGET_RANGES[1]);
  const [timeline, setTimeline] = useState(TIMELINES[1]);

  const initialPalette =
    search?.palette ??
    (typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("palette") : null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    message: initialPalette ? `Selected material palette: ${initialPalette}\n\n` : "",
  });

  useEffect(() => {
    if (search?.palette && !formData.message.includes(search.palette)) {
      setFormData((prev) => ({
        ...prev,
        message: `Selected material palette: ${search.palette}\n\n${prev.message}`,
      }));
    }
  }, [search?.palette]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

    const summaryText = `Project Type: ${projectType}\nLocation: ${location}\nBudget: ${budget}\nTimeline: ${timeline}${formData.area ? `\nArea: ${formData.area}` : ""}\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`;
    const mailtoHref = `mailto:hello@brunstinteriors.com?subject=${encodeURIComponent(`New ${projectType} Inquiry — ${formData.name}`)}&body=${encodeURIComponent(summaryText)}`;
    const whatsappHref = `https://wa.me/919849012345?text=${encodeURIComponent(`Hello Brunst Interiors,\n\n${summaryText}`)}`;

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast.error("Please fill in the required fields", {
          description: "Name, email, and a short note about your space are required.",
        });
        return;
      }

      setIsSubmitting(true);
        try {
          const endpoint = import.meta.env["VITE_CONTACT_ENDPOINT"] as string | undefined;
          if (endpoint) {
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                projectType,
                location,
                budget,
                timeline,
                ...formData,
                submittedAt: new Date().toISOString(),
              }),
            });
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
          } else {
            try {
              const existing = JSON.parse(localStorage.getItem("brunst_inquiries") ?? "[]") as unknown[];
              localStorage.setItem(
                "brunst_inquiries",
                JSON.stringify([{ projectType, location, budget, timeline, ...formData, createdAt: new Date().toISOString() }, ...existing].slice(0, 10)),
              );
            } catch { }
          }
          setSubmitted(true);
            toast.success("Inquiry saved", {
              description: "Thank you — our studio will reach out within one business day.",
            });
        } catch {
          toast.error("Could not reach the studio endpoint", {
            description: "You can send your details directly via Email or WhatsApp below.",
          });
          setSubmitted(true);
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <main className="bg-bone text-charcoal">
          {/* Header */}
          <section className="px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-52">
            <div className="max-w-4xl">
              <p className="text-eyebrow text-bronze">(01) — Contact</p>
              <h1 className="text-display-xl mt-6">
                <WordReveal text="Start a" play={ready} />
                <br />
                <WordReveal text="Conversation." play={ready} delay={0.15} className="italic text-bronze" />
              </h1>
              <motion.p
                className="mt-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Share a few details about your space below, or reach out directly to schedule a visit at our Hyderabad studio.
              </motion.p>
            </div>

            {/* Contact Cards */}
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-bone-deep p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-bone">
                  <MapPin className="h-4 w-4 text-bronze-light" />
                </div>
                <p className="text-eyebrow mt-4 text-bronze">Studio</p>
                <p className="mt-1 font-display text-xl text-charcoal">K.P.H.B Colony</p>
                <p className="mt-1 text-xs text-muted-foreground">Kukatpally, Hyderabad, TS 500072</p>
                <a
                  href="https://maps.google.com/?q=KPHB+Colony+Hyderabad"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-bronze hover:underline"
                >
                  View on Maps <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>

              <div className="rounded-lg border border-border bg-bone-deep p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-bone">
                  <Mail className="h-4 w-4 text-bronze-light" />
                </div>
                <p className="text-eyebrow mt-4 text-bronze">Email</p>
                <a href="mailto:hello@brunstinteriors.com" className="mt-1 block font-display text-xl text-charcoal hover:text-bronze">
                  hello@brunstinteriors.com
                </a>
                <p className="mt-1 text-xs text-muted-foreground">New projects & general inquiries</p>
                <a href="mailto:press@brunstinteriors.com" className="mt-4 block text-xs font-medium text-stone hover:underline">
                  Press: press@brunstinteriors.com
                </a>
              </div>

              <div className="rounded-lg border border-border bg-bone-deep p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-bone">
                  <Phone className="h-4 w-4 text-bronze-light" />
                </div>
                <p className="text-eyebrow mt-4 text-bronze">Phone</p>
                <a href="tel:+914048529100" className="mt-1 block font-display text-xl text-charcoal hover:text-bronze">
                  +91 40 4852 9100
                </a>
                <p className="mt-1 text-xs text-muted-foreground">+91 98490 12345</p>
                <a
                  href="https://wa.me/919849012345?text=Hello%20Brunst%20Interiors,%20I%20would%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-bronze hover:underline"
                >
                  Message on WhatsApp <MessageSquare className="h-3 w-3" />
                </a>
              </div>

              <div className="rounded-lg border border-border bg-bone-deep p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-bone">
                  <Clock className="h-4 w-4 text-bronze-light" />
                </div>
                <p className="text-eyebrow mt-4 text-bronze">Hours</p>
                <p className="mt-1 font-display text-xl text-charcoal">10:00 — 19:00 IST</p>
                <p className="mt-1 text-xs text-muted-foreground">Monday to Saturday</p>
                <p className="mt-4 text-xs font-medium text-stone">
                  Visits by appointment
                </p>
              </div>
            </div>
          </section>

          {/* Project Inquiry Form */}
          <section className="border-t border-border bg-bone-deep px-6 py-20 md:px-12 md:py-32">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <p className="text-eyebrow text-bronze">(02) — Project Inquiry</p>
                <RevealText
                  as="h2"
                  text="Tell us about your space."
                  className="text-display-md mx-auto mt-4 text-center"
                />
                <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
                  Give us a sense of the scope, location, and timeline so we can prepare for an introductory call.
                </p>
              </div>

              <div className="mt-14 rounded-xl border border-border bg-bone p-8 shadow-sm md:p-12">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-charcoal text-bronze">
                        <CheckCircle2 className="h-8 w-8 text-bronze-light" />
                      </div>
                      <h3 className="mt-6 font-display text-4xl text-charcoal">Thank you, {formData.name}.</h3>
                      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                        We've received your project inquiry and will reach out within one business day to schedule an introductory conversation.
                      </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                          <a
                            href={mailtoHref}
                            className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-2.5 text-xs uppercase tracking-widest text-bone transition-colors hover:bg-bronze"
                          >
                            <Mail className="h-3.5 w-3.5" /> Open in Email
                          </a>
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-charcoal px-6 py-2.5 text-xs uppercase tracking-widest text-charcoal transition-colors hover:bg-charcoal hover:text-bone"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Send via WhatsApp
                          </a>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitted(false);
                              setFormData({ name: "", email: "", phone: "", area: "", message: "" });
                            }}
                            className="link-underline text-eyebrow text-muted-foreground"
                          >
                            Send another message
                          </button>
                            <PillLink to="/projects" variant="light">
                              Browse portfolio
                            </PillLink>
                        </div>
                    </motion.div>
                  ) : (
                    <form key="form" onSubmit={handleSubmit} className="space-y-10">
                      <div>
                        <label className="text-eyebrow mb-3 block text-charcoal">Project Type</label>
                        <div className="flex flex-wrap gap-2.5">
                          {PROJECT_TYPES.map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setProjectType(t)}
                              className={`rounded-full px-4 py-2 text-xs transition-colors duration-300 ${projectType === t
                                  ? "bg-charcoal text-bone"
                                  : "border border-border bg-bone-deep text-charcoal hover:border-bronze"
                                }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-eyebrow mb-3 block text-charcoal">Location</label>
                        <div className="flex flex-wrap gap-2.5">
                          {LOCATIONS.map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => setLocation(loc)}
                              className={`rounded-full px-4 py-2 text-xs transition-colors duration-300 ${location === loc
                                  ? "bg-charcoal text-bone"
                                  : "border border-border bg-bone-deep text-charcoal hover:border-bronze"
                                }`}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-8 md:grid-cols-2">
                        <div>
                          <label className="text-eyebrow mb-3 block text-charcoal">Estimated Budget</label>
                          <div className="grid grid-cols-2 gap-2">
                            {BUDGET_RANGES.map((b) => (
                              <button
                                key={b}
                                type="button"
                                onClick={() => setBudget(b)}
                                className={`rounded-lg border px-3 py-2 text-center text-xs transition-colors ${budget === b
                                    ? "border-charcoal bg-charcoal text-bone"
                                    : "border-border bg-bone-deep text-charcoal hover:border-bronze"
                                  }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-eyebrow mb-3 block text-charcoal">Timeline</label>
                          <div className="grid grid-cols-2 gap-2">
                            {TIMELINES.map((tl) => (
                              <button
                                key={tl}
                                type="button"
                                onClick={() => setTimeline(tl)}
                                className={`rounded-lg border px-3 py-2 text-center text-xs transition-colors ${timeline === tl
                                    ? "border-charcoal bg-charcoal text-bone"
                                    : "border-border bg-bone-deep text-charcoal hover:border-bronze"
                                  }`}
                              >
                                {tl}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 border-t border-border pt-8 md:grid-cols-3">
                        <div>
                          <label htmlFor="name" className="text-eyebrow mb-2 block text-charcoal">
                            Name <span className="text-bronze">*</span>
                          </label>
                          <input
                            id="name"
                            type="text"
                            required
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-md border border-input bg-bone px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted-foreground/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="text-eyebrow mb-2 block text-charcoal">
                            Email <span className="text-bronze">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-md border border-input bg-bone px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted-foreground/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="text-eyebrow mb-2 block text-charcoal">
                            Phone <span className="text-bronze">*</span>
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            required
                            placeholder="+91 98490 00000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full rounded-md border border-input bg-bone px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted-foreground/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="area" className="text-eyebrow mb-2 block text-charcoal">
                          Approximate Area (Optional)
                        </label>
                        <input
                          id="area"
                          type="text"
                          placeholder="e.g. 4,500 sq ft residence"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="w-full rounded-md border border-input bg-bone px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted-foreground/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="text-eyebrow mb-2 block text-charcoal">
                          Project Notes <span className="text-bronze">*</span>
                        </label>
                        <textarea
                          id="message"
                          rows={5}
                          required
                          placeholder="Tell us a little about the property, what stage it is at, and what you're hoping to create..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full rounded-md border border-input bg-bone p-3.5 text-sm leading-relaxed text-charcoal placeholder:text-muted-foreground/60 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze"
                        />
                      </div>

                      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                        <p className="text-xs text-muted-foreground">
                          All inquiries are kept confidential.
                        </p>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 rounded-full bg-charcoal px-8 py-3.5 text-xs uppercase tracking-widest text-bone transition-transform duration-300 hover:scale-[1.02] hover:bg-charcoal/90 active:scale-95 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-3 w-3 animate-spin rounded-full border border-bone border-t-transparent" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send inquiry</span>
                              <Send className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section className="px-6 py-24 md:px-12 md:py-36">
            <div className="mx-auto max-w-3xl">
              <p className="text-eyebrow text-center text-bronze">(03) — FAQ</p>
              <RevealText
                as="h2"
                text="Common questions."
                className="text-display-md mx-auto mt-4 text-center"
              />

              <div className="mt-14">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {FAQS.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="rounded-lg border bg-bone-deep/50 px-6">
                      <AccordionTrigger className="py-5 text-left font-display text-xl text-charcoal hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* Press & Careers */}
          <section className="border-t border-border bg-charcoal px-6 py-20 text-bone md:px-12 md:py-28">
            <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
              <div>
                <p className="text-eyebrow text-bronze-light">Press</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/70">
                  For editorial photography, publication features, and press requests:
                </p>
                <a href="mailto:press@brunstinteriors.com" className="link-underline mt-4 inline-block text-xs uppercase tracking-widest text-bronze-light">
                  press@brunstinteriors.com
                </a>
              </div>

              <div>
                <p className="text-eyebrow text-bronze-light">Suppliers & Artisans</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/70">
                  For stone quarries, joinery workshops, metalworkers, and textile weavers:
                </p>
                <a href="mailto:craft@brunstinteriors.com" className="link-underline mt-4 inline-block text-xs uppercase tracking-widest text-bronze-light">
                  craft@brunstinteriors.com
                </a>
              </div>

              <div>
                <p className="text-eyebrow text-bronze-light">Careers</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/70">
                  Share your portfolio if you are an architect, interior designer, or 3D visualizer:
                </p>
                <a href="mailto:careers@brunstinteriors.com" className="link-underline mt-4 inline-block text-xs uppercase tracking-widest text-bronze-light">
                  careers@brunstinteriors.com
                </a>
              </div>
            </div>
          </section>
        </main>
      );
    }
