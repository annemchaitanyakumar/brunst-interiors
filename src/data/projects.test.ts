import { describe, expect, it } from "vitest";
import { PROJECTS, filterProjects } from "./projects";

describe("project filters", () => {
  it("shows every project under All", () => {
    expect(filterProjects(PROJECTS, "All")).toHaveLength(PROJECTS.length);
  });

  it("shows only commercial projects under Commercial", () => {
    const result = filterProjects(PROJECTS, "Commercial");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === "Commercial")).toBe(true);
  });

  it("covers each of the four service categories", () => {
    for (const c of ["Residential", "Commercial", "Styling", "Renovation"] as const) {
      expect(filterProjects(PROJECTS, c).length).toBeGreaterThan(0);
    }
  });
});
