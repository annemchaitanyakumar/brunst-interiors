import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";
import { TransitionLink, type SiteRoute } from "./Curtain";

export const pillVariants = cva(
  "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-eyebrow transition-colors duration-500",
  {
    variants: {
      variant: {
        solid: "bg-charcoal text-bone",
        bronze: "bg-bronze text-bone",
        light: "border border-bone/40 text-bone hover:text-charcoal",
        outline: "border border-charcoal/25 text-charcoal hover:text-bone",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

const FILL: Record<NonNullable<VariantProps<typeof pillVariants>["variant"]>, string> = {
  solid: "bg-bronze",
  bronze: "bg-charcoal",
  light: "bg-bone",
  outline: "bg-charcoal",
};

function Inner({ children, variant }: { children: ReactNode; variant: keyof typeof FILL }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 translate-y-full rounded-full transition-transform duration-700 ease-cinema group-hover:translate-y-0",
          FILL[variant],
        )}
      />
      <span className="relative">{children}</span>
      <ArrowUpRight className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
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
  variant?: keyof typeof FILL;
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
  variant?: keyof typeof FILL;
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
