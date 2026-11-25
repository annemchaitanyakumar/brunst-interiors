import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CATEGORIES, PROJECTS, filterProjects, type Filter } from "@/data/projects";
import { useSite } from "@/components/site/site-context";
import { WordReveal } from "@/components/site/text";
import { DistortCard } from "@/components/projects/DistortCard";
import { ScrollTrigger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CaseStudy = lazy(() => import("@/components/projects/CaseStudy").then((m) => ({ default: m.CaseStudy })));

export const Route = createFileRoute("/projects")({
  validateSearch: (search: Record<string, unknown>): { open?: string | undefined } => ({
    open: typeof search["open"] === "string" ? (search["open"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Projects — Brunst Interiors" },
      { name: "description", content: "Residential, commercial, styling and renovation projects by Brunst Interiors, Hyderabad." },
      { property: "og:title", content: "Projects — Brunst Interiors" },
      { property: "og:description", content: "Explore homes, hotels and boutiques designed by Brunst Interiors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsPage,
});

function useColumns() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const update = () => setCols(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function ProjectsPage() {
  const { ready } = useSite();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filter, setFilter] = useState<Filter>("All");
  const [openSlug, setOpenSlug] = useState<string | null>(() => {
    if (search?.open) return search.open;
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("open");
      if (p) return p;
    }
    return null;
  });
  const cols = useColumns();
  const visible = useMemo(() => filterProjects(PROJECTS, filter), [filter]);

  useEffect(() => {
    if (search?.open) {
      setOpenSlug(search.open);
    }
  }, [search?.open]);

  const columns = useMemo(() => {
    const out: (typeof visible)[] = Array.from({ length: cols }, () => []);
    visible.forEach((p, i) => out[i % cols]?.push(p));
    return out;
  }, [visible, cols]);

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 900);
    return () => clearTimeout(t);
  }, [visible, cols]);

  const openIndex = openSlug ? PROJECTS.findIndex((p) => p.slug === openSlug) : -1;
  const openProject = openIndex >= 0 ? PROJECTS[openIndex] : undefined;
  const nextProject = openIndex >= 0 ? PROJECTS[(openIndex + 1) % PROJECTS.length] : undefined;
  const prevProject = openIndex >= 0 ? PROJECTS[(openIndex - 1 + PROJECTS.length) % PROJECTS.length] : undefined;
  const close = useCallback(() => {
    setOpenSlug(null);
    void navigate({ search: { open: undefined }, replace: true, resetScroll: false });
  }, [navigate]);
  const next = useCallback(() => {
      if (nextProject) {
        setOpenSlug(nextProject.slug);
        void navigate({ search: { open: nextProject.slug }, replace: true, resetScroll: false });
      }
}, [nextProject, navigate]);
const prev = useCallback(() => {
  if (prevProject) {
    setOpenSlug(prevProject.slug);
    void navigate({ search: { open: prevProject.slug }, replace: true, resetScroll: false });
  }
}, [prevProject, navigate]);

const openProjectSlug = useCallback(
  (slug: string) => {
    setOpenSlug(slug);
    void navigate({ search: { open: slug }, replace: true, resetScroll: false });
  },
  [navigate],
);

return (
  <>
    <section className="px-6 pb-10 pt-28 md:px-12 md:pb-16 md:pt-52">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end md:gap-10">
        <h1 className="text-display-xl">
          <WordReveal text="Selected" play={ready} />
          <br />
          <WordReveal text="Works" play={ready} delay={0.15} className="italic text-bronze" />
          <motion.sup
            className="ml-3 align-top font-sans text-base not-italic text-muted-foreground md:text-xl"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
          >
            ({String(visible.length).padStart(2, "0")})
          </motion.sup>
        </h1>
        <motion.p
          className="max-w-sm text-base leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 1 }}
        >
          A collection of homes, hotels and ateliers — each designed around the people who live, work and gather inside.
          Select a project to step inside.
        </motion.p>
      </div>

      <motion.div
        role="tablist"
        aria-label="Filter projects by category"
        className="no-scrollbar mt-10 flex flex-nowrap gap-2 overflow-x-auto border-t border-border pb-2 pt-6 sm:flex-wrap sm:overflow-visible sm:pb-0 md:mt-16 md:pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <LayoutGroup id="filters">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              type="button"
              data-cursor="hover"
              onClick={() => setFilter(c)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-eyebrow transition-colors duration-500 sm:px-5 sm:py-2.5",
                filter === c ? "text-bone" : "text-charcoal hover:text-bronze",
              )}
            >
              {filter === c && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-charcoal"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">{c}</span>
            </button>
          ))}
        </LayoutGroup>
      </motion.div>
    </section>

    <section className="px-6 pb-20 md:px-12 md:pb-32" aria-live="polite">
      <LayoutGroup id="grid">
        <div className="flex gap-6 md:gap-8">
          {columns.map((col, ci) => (
            <div key={ci} className={cn("flex flex-1 flex-col gap-10 md:gap-14", ci === 1 && "lg:pt-32", ci === 2 && "lg:pt-12")}>
              <AnimatePresence mode="popLayout">
                {col.map((p) => (
                  <motion.div
                    key={p.slug}
                    layout
                    layoutId={p.slug}
                    initial={{ opacity: 0, y: 80, clipPath: "inset(20% 0% 0% 0%)" }}
                    animate={ready ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" } : {}}
                    exit={{ opacity: 0, scale: 0.92, clipPath: "inset(0% 0% 30% 0%)" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: ready ? 0.1 * ci : 0 }}
                  >
                    <DistortCard
                      project={p}
                      index={PROJECTS.indexOf(p)}
                      onOpen={() => openProjectSlug(p.slug)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </LayoutGroup>
    </section>

    <AnimatePresence>
      {openProject && (
          <Suspense fallback={null}>
            <CaseStudy
              key="case-study"
              project={openProject}
              index={openIndex}
              total={PROJECTS.length}
              nextTitle={nextProject?.title}
              onClose={close}
              onNext={next}
              onPrev={prev}
            />
          </Suspense>
      )}
    </AnimatePresence>
  </>
);
}
