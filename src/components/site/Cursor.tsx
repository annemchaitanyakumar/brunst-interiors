import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap, canHover } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Mode = "default" | "hover" | "view";

/** Custom cursor: a dot + trailing ring that expands into a "View" disc over images. Disabled on /tour for instant native 3D pointer accuracy. */
export function Cursor() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isTour = pathname.startsWith("/tour");
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("View");
  const [visible, setVisible] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTour || !canHover()) {
      setEnabled(false);
      document.documentElement.classList.remove("has-cursor");
      return;
    }
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [isTour]);

  useEffect(() => {
    if (isTour || !enabled || !dotRef.current || !ringRef.current) return;
    gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50 });
    const xDot = gsap.quickTo(dotRef.current, "x", { duration: 0.1, ease: "power3" });
    const yDot = gsap.quickTo(dotRef.current, "y", { duration: 0.1, ease: "power3" });
    const xRing = gsap.quickTo(ringRef.current, "x", { duration: 0.55, ease: "power3" });
    const yRing = gsap.quickTo(ringRef.current, "y", { duration: 0.55, ease: "power3" });

    const move = (e: PointerEvent) => {
      setVisible(true);
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.<HTMLElement>("[data-cursor]");
      if (!target) {
        setMode("default");
        return;
      }
      setMode((target.dataset["cursor"] as Mode) ?? "hover");
      setLabel(target.dataset["cursorLabel"] ?? "View");
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, isTour]);

  if (!enabled || isTour) return null;

  return (
    <div aria-hidden className={cn("transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}>
      <div
        ref={ringRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[100]",
          mode !== "view" && "mix-blend-difference",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-silk",
            mode === "view" && "h-24 w-24 border-bronze bg-bronze",
            mode === "hover" && "h-16 w-16 border-bone bg-bone/10",
            mode === "default" && "h-9 w-9 border-bone/80",
          )}
        >
          <span
            className={cn(
              "text-eyebrow text-bone transition-all duration-500",
              mode === "view" ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          >
            {label}
          </span>
        </div>
      </div>
      <div
        ref={dotRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[101] h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference transition-opacity",
          mode === "view" ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
