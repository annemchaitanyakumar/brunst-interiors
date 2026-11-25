import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";
import { TransitionLink, type SiteRoute } from "./Curtain";

export const pillVariants = cva(
  "group relative inline-flex h-12 items-center justify-between gap-4 overflow-hidden rounded-[3px] pl-5 pr-1.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-500 ease-silk active:scale-[0.98] sm:h-[50px]",
  {
    variants: {
      variant: {
        solid:
          "border border-charcoal bg-charcoal text-bone hover:border-bronze",
        bronze:
          "border border-[#C9A073]/50 bg-gradient-to-b from-[#B68859] to-[#946C43] text-bone shadow-[0_10px_28px_-8px_rgba(166,124,82,0.5)] hover:border-bone/60",
        light:
          "border border-bone/25 bg-charcoal/45 text-bone backdrop-blur-md hover:border-bone/70 hover:text-charcoal",
        outline:
          "border border-charcoal/25 bg-bone-deep/50 text-charcoal hover:border-charcoal hover:text-bone",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

type VariantKey = NonNullable<VariantProps<typeof pillVariants>["variant"]>;

const SWEEP_FILL: Record<VariantKey, string> = {
  solid: "bg-bronze",
  bronze: "bg-charcoal",
  light: "bg-bone",
  outline: "bg-charcoal",
};

const ICON_WELL: Record<VariantKey, string> = {
  solid: "bg-bone/12 text-bone group-hover:bg-charcoal/25",
  bronze: "bg-charcoal/85 text-[#D8B48A] group-hover:bg-bronze group-hover:text-bone",
  light: "bg-bone/12 text-bone group-hover:bg-charcoal group-hover:text-bone",
  outline: "bg-charcoal/10 text-charcoal group-hover:bg-bone/15 group-hover:text-bone",
};

function Inner({ children, variant }: { children: ReactNode; variant: VariantKey }) {
  return (
    <>
      {/* Architectural curtain sweep wipe on hover */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-x-full transition-transform duration-600 ease-cinema group-hover:translate-x-0",
          SWEEP_FILL[variant],
        )}
      />
      <span className="relative z-10 whitespace-nowrap">{children}</span>
      {/* Precision square arrow badge with dual-diagonal kinetic glide */}
      <span
        aria-hidden
        className={cn(
          "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[2px] transition-colors duration-500",
          ICON_WELL[variant],
        )}
      >
        <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-cinema group-hover:-translate-y-5 group-hover:translate-x-5" />
        <ArrowUpRight className="absolute h-4 w-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-cinema group-hover:translate-x-0 group-hover:translate-y-0" />
      </span>
    </>
  );
}

export function PillLink({
  to,
  children,
  variant = "solid",
  className,
}: {
  to: SiteRoute;
  children: ReactNode;
  variant?: VariantKey;
  className?: string;
}) {
  return (
    <Magnetic>
      <TransitionLink to={to} className={cn(pillVariants({ variant }), className)}>
        <Inner variant={variant}>{children}</Inner>
      </TransitionLink>
    </Magnetic>
  );
}

export function PillButton({
  children,
  variant = "solid",
  className,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  variant?: VariantKey;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <Magnetic>
      <button type={type} disabled={disabled} className={cn(pillVariants({ variant }), "disabled:opacity-60", className)}>
        <Inner variant={variant}>{children}</Inner>
      </button>
    </Magnetic>
  );
}
