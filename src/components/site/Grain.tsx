import { useRouterState } from "@tanstack/react-router";

export function Grain() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Skip animated SVG feTurbulence overlay on /tour so WebGL presents without compositor rasterization lag
  if (pathname.startsWith("/tour")) return null;
  return <div aria-hidden className="grain" />;
}
