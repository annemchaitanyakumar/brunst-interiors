import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { lenisStore } from "@/lib/motion";
import { TransitionLink, type SiteRoute } from "./Curtain";
import { Magnetic } from "./Magnetic";
import { BrandMark } from "./BrandMark";

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
  const logoRef = useRef<HTMLDivElement>(null);
  const [onDarkSurface, setOnDarkSurface] = useState(
    () => pathname === "/" || pathname.startsWith("/tour"),
  );

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    // Seed initial contrast from route so page loads / curtain reveals never flash invisible text.
    setOnDarkSurface(pathname === "/" || pathname.startsWith("/tour"));

    let raf = 0;
    const syncSurface = () => {
      const logo = logoRef.current;
      const rect = logo?.getBoundingClientRect();
      const sampleY = rect && rect.height > 0 ? rect.top + rect.height * 0.5 : 48;

      const darkEls = document.querySelectorAll<HTMLElement>('[data-nav-surface="dark"]');
      let hitDark = false;
      darkEls.forEach((el) => {
        if (hitDark) return;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) return;
        const inset = parseFloat(getComputedStyle(el).getPropertyValue("--hero-inset")) || 0;
        if (sampleY >= r.top + inset && sampleY <= r.bottom - inset) {
          hitDark = true;
        }
      });
      setOnDarkSurface(hitDark);
    };

    const scheduleSync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncSurface);
    };

    const initId = requestAnimationFrame(() => {
      syncSurface();
      // Re-sample shortly after ScrollTrigger / curtain settle
      setTimeout(scheduleSync, 120);
    });

    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });
    return () => {
      cancelAnimationFrame(initId);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [pathname]);

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

  const useLightInk = open || onDarkSurface;

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[70] transition-transform duration-700 ease-cinema",
          hidden && !open && "-translate-y-full",
        )}
      >
        <nav
          className="flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6 md:px-11 md:py-8"
          aria-label="Main"
        >
          {/* Left: Clean Brand Emblem + Wordmark with real surface-aware ink contrast */}
          <div ref={logoRef} className="pointer-events-auto">
            <TransitionLink
              to="/"
              className={cn(
                "group flex items-center gap-2.5 transition-colors duration-300 sm:gap-3.5",
                useLightInk
                  ? "text-bone drop-shadow-[0_1px_10px_rgba(0,0,0,0.3)]"
                  : "text-charcoal",
              )}
              aria-label="Brunst Interiors home"
            >
              <BrandMark className="h-[36px] w-[38px] transition-transform duration-500 ease-silk group-hover:scale-105 sm:h-[42px] sm:w-[44px] md:h-[46px] md:w-[48px]" />
              <span className="font-display text-[32px] font-light leading-none tracking-[-0.02em] sm:text-[36px] md:text-[42px]">
                Brunst{" "}
                <span className="text-[0.55em] tracking-[0.025em] opacity-75">
                  Interiors
                </span>
              </span>
            </TransitionLink>
          </div>

          {/* Right (Desktop): Compact Off-White Floating Pill Dock with Nested Dark CTA */}
          <div className="pointer-events-auto hidden items-center rounded-[10px] border border-charcoal/10 bg-[#F2F1EE]/95 p-1 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.16)] backdrop-blur-md md:flex">
            <ul className="flex items-center">
              {LINKS.slice(1, 4).map((l) => {
                const active = pathname === l.to;
                return (
                  <li key={l.to}>
                    <TransitionLink
                      to={l.to}
                      data-cursor="hover"
                      className={cn(
                        "block rounded-[7px] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors",
                        active
                          ? "bg-charcoal/[0.08] text-charcoal"
                          : "text-charcoal/80 hover:bg-charcoal/[0.05] hover:text-charcoal",
                      )}
                    >
                      {l.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>

            <TransitionLink
              to="/contact"
              data-cursor="hover"
              className={cn(
                "ml-1 rounded-[7px] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#F4EFE8] transition-colors",
                pathname === "/contact"
                  ? "bg-bronze"
                  : "bg-[#1F2324] hover:bg-bronze",
              )}
            >
              Work With Us
            </TransitionLink>
          </div>

          {/* Right (Mobile): Matching Compact Off-White Dock + Dark Menu Trigger */}
          <Magnetic className="pointer-events-auto md:hidden">
            <div className="rounded-[10px] border border-charcoal/10 bg-[#F2F1EE]/95 p-1 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.16)] backdrop-blur-md">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-[7px] bg-[#1F2324] px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-[#F4EFE8]"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <span>{open ? "Close" : "Menu"}</span>
                <span className="flex flex-col gap-1">
                  <span
                    className={cn(
                      "h-px w-3.5 bg-current transition-transform duration-500",
                      open && "translate-y-[2.5px] rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "h-px w-3.5 bg-current transition-transform duration-500",
                      open && "-translate-y-[2.5px] -rotate-45",
                    )}
                  />
                </span>
              </button>
            </div>
          </Magnetic>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[65] flex flex-col justify-between overflow-y-auto bg-charcoal px-6 pb-8 pt-28 text-bone md:hidden"
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
