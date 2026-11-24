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
  { to: "/studio", label: "Studio", n: "03" },
  { to: "/contact", label: "Contact", n: "04" },
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
        <nav className="flex items-center justify-between px-6 py-6 md:px-12" aria-label="Main">
          <TransitionLink to="/" className="group flex items-baseline gap-2" aria-label="Brunst Interiors home">
            <span className="font-display text-3xl font-light tracking-tight">Brunst</span>
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
            className="fixed inset-0 z-[65] flex flex-col justify-end bg-charcoal px-6 pb-12 text-bone md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li key={l.to} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TransitionLink to={l.to} className="flex items-baseline gap-4" onNavigate={() => setOpen(false)}>
                      <span className="text-eyebrow text-bronze">{l.n}</span>
                      <span className="text-display-lg">{l.label}</span>
                    </TransitionLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-eyebrow text-bone/50">K.P.H.B, Hyderabad — hello@brunstinteriors.com</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
