import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId, RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PROJECTS } from "@/data/projects";
import { CaseStudy } from "@/components/projects/CaseStudy";

import { routeTree } from "@/routeTree.gen";

describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("renders CaseStudy directly for hotel-ombre", () => {
    const project = PROJECTS[5]!;
    const { container } = render(
      <CaseStudy
        project={project}
        index={5}
        total={PROJECTS.length}
        onClose={() => {}}
        onNext={() => {}}
      />
    );
    expect(container).toBeDefined();
  });
});
