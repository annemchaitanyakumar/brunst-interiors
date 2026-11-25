import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { lenisStore } from "@/lib/motion";
import { TransitionLink, type SiteRoute } from "./Curtain";
import { Magnetic } from "./Magnetic";

const LINKS: { to: SiteRoute; label: string; n: string }[] = [
  { to: "/", label: "Home", n: "01" },
  { to: "/projects", label: "Projects", n: "02" },
  { to: "/tour", label: "3D Tour", n: "03" },
  { to: "/studio", label: "Studio", n: "04" },
  { to: "/contact", label: "Contact", n: "05" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenisStore.current?.stop();
    else lenisStore.current?.start();
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[70] text-bone mix-blend-difference transition-transform duration-700 ease-cinema",
          hidden && !open && "-translate-y-full",
        )}
      >
        <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-6" aria-label="Main">
          <TransitionLink to="/" className="group flex items-baseline gap-2" aria-label="Brunst Interiors home">
            <span className="font-display text-2xl font-light tracking-tight md:text-3xl">Brunst</span>
            <span className="text-eyebrow opacity-70">Interiors</span>
          </TransitionLink>

          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.slice(1).map((l) => (
              <li key={l.to}>
                <TransitionLink to={l.to} className="link-underline text-eyebrow" data-cursor="hover">
                  <span className="mr-1.5 opacity-50">{l.n}</span>
                  {l.label}
                </TransitionLink>
              </li>
            ))}
          </ul>

          <Magnetic className="md:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span className={cn("h-px w-7 bg-bone transition-transform duration-500", open && "translate-y-[3.5px] rotate-45")} />
              <span className={cn("h-px w-7 bg-bone transition-transform duration-500", open && "-translate-y-[3.5px] -rotate-45")} />
            </button>
          </Magnetic>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[65] flex flex-col justify-between overflow-y-auto bg-charcoal px-6 pb-8 pt-24 text-bone md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden />
            <ul className="my-auto space-y-2 py-4">
              {LINKS.map((l, i) => {
                const active = pathname === l.to;
                return (
                  <li key={l.to} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.65, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <TransitionLink
                        to={l.to}
                        className={cn("flex items-baseline gap-4 py-1", active && "text-bronze-light")}
                        onNavigate={() => setOpen(false)}
                      >
                        <span className="text-eyebrow text-bronze">{l.n}</span>
                        <span className="text-display-lg">{l.label}</span>
                      </TransitionLink>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-bone/15 pt-5 text-xs text-bone/60">
              <p className="text-eyebrow text-bronze-light">K.P.H.B Colony, Hyderabad</p>
              <a href="mailto:hello@brunstinteriors.com" className="mt-1 block text-bone/80">
                hello@brunstinteriors.com
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
