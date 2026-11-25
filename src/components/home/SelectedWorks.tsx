import { PROJECTS } from "@/data/projects";
import { RevealImage } from "@/components/site/media";
import { RevealText } from "@/components/site/text";
import { PillLink } from "@/components/site/PillButton";
import { TransitionLink } from "@/components/site/Curtain";

const PICKS = [PROJECTS[5], PROJECTS[2], PROJECTS[7]].filter((p): p is (typeof PROJECTS)[number] => Boolean(p));

export function SelectedWorks() {
  return (
    <section className="px-6 py-28 md:px-12 md:py-44">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="text-eyebrow text-bronze">(05) — Selected works</p>
          <RevealText as="h2" className="text-display-lg mt-6 max-w-[12ch]" text="Every room, a different story." />
        </div>
        <PillLink to="/projects" variant="solid">Explore all projects</PillLink>
      </div>

      <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8">
        {PICKS.map((p, i) => (
            <TransitionLink
              key={p.slug}
              to="/projects"
              search={{ open: p.slug }}
              data-cursor="view"
              className={i === 1 ? "md:mt-40" : i === 2 ? "md:mt-16" : ""}
            >
              <RevealImage src={p.cover} alt={`${p.title} — ${p.summary}`} className="aspect-[3/4]" from={i === 1 ? "bottom" : "center"} />
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="font-display text-3xl">{p.title}</h3>
                <span className="text-eyebrow text-muted-foreground">{p.year}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.category} · {p.location}</p>
            </TransitionLink>
        ))}
          </div>
    </section>
  );
}
