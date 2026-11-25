import { cn } from "@/lib/utils";

/**
 * Brunst Interiors architectural emblem:
 * Two interlocking threshold planes receding along a shared horizon axis,
 * woven cleanly to evoke spatial depth and framed light.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="3.6 2.1 20.8 19.8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[32px] w-[34px] shrink-0", className)}
      aria-hidden
    >
      {/* Foreground doorway threshold plane */}
      <path
        d="M14 10.15V16.65Q14 18.1 12.59 18.45L6.61 19.95Q5.2 20.3 5.2 18.85V7.35Q5.2 5.9 6.61 5.55L12.59 4.05Q14 3.7 14 5.15V5.65"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Interwoven recessed gallery volume */}
      <path
        d="M11.82 16.05L11.21 16.2Q9.8 16.55 9.8 15.1V10.4Q9.8 8.95 11.21 8.6L21.39 6.05Q22.8 5.7 22.8 7.15V11.85Q22.8 13.3 21.39 13.65L16.18 14.95"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
