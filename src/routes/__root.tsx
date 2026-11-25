import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { STUDIO_JSON_LD, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { SiteProvider } from "@/components/site/site-context";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Preloader } from "@/components/site/Preloader";
import { Cursor } from "@/components/site/Cursor";
import { Grain } from "@/components/site/Grain";
import { CurtainProvider } from "@/components/site/Curtain";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="text-eyebrow text-bronze">Error 404</p>
        <h1 className="text-display-lg mt-4">Lost in the hallway.</h1>
        <p className="mt-4 text-muted-foreground">This room doesn't exist — or it's still under renovation.</p>
        <a href="/" className="link-underline text-eyebrow mt-8 inline-block">Return home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="text-display-md">This page didn't load</h1>
        <p className="mt-3 text-muted-foreground">Something went wrong on our end. Try again or head back home.</p>
        {errorMessage ? (
          <p className="mt-4 rounded bg-destructive/10 px-3 py-2 text-xs font-mono text-destructive">
            {errorMessage}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="link-underline text-eyebrow"
          >
            Try again
          </button>
          <a href="/" className="link-underline text-eyebrow">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Brunst Interiors — Luxury Interior Design Studio in Hyderabad" },
      {
        name: "description",
        content:
          "Brunst Interiors is a luxury interior design studio in Hyderabad crafting bespoke residential villas, boutique hotels, and commercial ateliers across India.",
      },
      {
        name: "keywords",
        content:
          "Brunst Interiors, luxury interior design Hyderabad, bespoke residences, interior architecture India, Jubilee Hills interior designer, KPHB interior studio",
      },
      { name: "author", content: "Brunst Interiors" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "geo.region", content: "IN-TG" },
      { name: "geo.placename", content: "Hyderabad" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      { property: "og:title", content: "Brunst Interiors — Spaces That Tell Stories" },
      { property: "og:description", content: "Luxury interior design studio crafting cinematic residential and commercial spaces across India." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Brunst Interiors — Spaces That Tell Stories" },
      { name: "twitter:description", content: "Luxury interior design studio in Hyderabad crafting timeless architectural spaces." },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      { name: "theme-color", content: "#1A1A1A" },
      { name: "msapplication-TileColor", content: "#1A1A1A" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "alternate icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(STUDIO_JSON_LD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <SiteProvider>
          <CurtainProvider>
            <SmoothScroll />
            <Preloader />
            <Nav />
            <main>
              <Outlet />
            </main>
            <Footer />
            <Cursor />
            <Grain />
            <Toaster position="bottom-right" />
          </CurtainProvider>
        </SiteProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
