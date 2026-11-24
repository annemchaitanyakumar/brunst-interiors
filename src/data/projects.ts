import living from "@/assets/hero-living.webp";
import bedroom from "@/assets/room-bedroom.webp";
import kitchen from "@/assets/room-kitchen.webp";
import dining from "@/assets/room-dining.webp";
import bath from "@/assets/room-bath.webp";
import lobby from "@/assets/room-lobby.webp";
import library from "@/assets/room-library.webp";
import boutique from "@/assets/room-boutique.webp";
import materials from "@/assets/detail-materials.webp";
import beforeDining from "@/assets/before-dining.webp";

export type Category = "Residential" | "Commercial" | "Styling" | "Renovation";
export const CATEGORIES = ["All", "Residential", "Commercial", "Styling", "Renovation"] as const;
export type Filter = (typeof CATEGORIES)[number];

export interface Project {
  slug: string;
  title: string;
  category: Category;
  location: string;
  year: string;
  area: string;
  scope: string[];
  summary: string;
  story: string;
  cover: string;
  gallery: string[];
  /** A real "before" photo. Without one, the case study shows a concept/final comparison. */
  before?: string;
  aspect: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "maison-lumiere",
    title: "Maison Lumière",
    category: "Residential",
    location: "Alibaug, Maharashtra",
    year: "2025",
    area: "6,400 sq ft",
    scope: ["Full interior architecture", "Bespoke furniture", "Art curation"],
    summary: "A lakeside home choreographed around the last hour of sunlight.",
    story:
      "We oriented every room toward the water and let the light do the heavy lifting. Hand-troweled plaster absorbs the dusk, travertine anchors the living spaces, and a curved bouclé sofa follows the line of the horizon.",
    cover: living,
    gallery: [living, materials, bedroom, dining],
    aspect: "aspect-[4/3]",
  },
  {
    slug: "linen-house",
    title: "Linen House",
    category: "Residential",
    location: "Banjara Hills, Hyderabad",
    year: "2024",
    area: "2,800 sq ft",
    scope: ["Bedroom suites", "Textiles", "Lighting"],
    summary: "Soft limewash, raw oak and a slow morning rhythm.",
    story:
      "A family apartment reimagined as a retreat. Layered linens, oak platforms and a bronze sconce designed in-house create bedrooms that feel quieter than the city outside.",
    cover: bedroom,
    gallery: [bedroom, materials, bath, living],
    aspect: "aspect-[2/3]",
  },
  {
    slug: "travertine-kitchen",
    title: "The Travertine Kitchen",
    category: "Renovation",
    location: "Jubilee Hills, Hyderabad",
    year: "2024",
    area: "900 sq ft",
    scope: ["Renovation", "Joinery", "Stone sourcing"],
    summary: "A monolithic island carved from a single travertine block.",
    story:
      "A dated 1990s kitchen stripped to the slab. We sourced a single travertine block for the island, wrapped the walls in smoked oak and hid every appliance behind seamless joinery.",
    cover: kitchen,
    gallery: [kitchen, materials, dining, living],
    aspect: "aspect-[3/4]",
  },
  {
    slug: "dusk-dining-room",
    title: "The Dusk Dining Room",
    category: "Renovation",
    location: "Malabar Hill, Mumbai",
    year: "2023",
    area: "1,200 sq ft",
    scope: ["Renovation", "Lighting design", "Art curation"],
    summary: "From an empty, forgotten room to the heart of every evening.",
    story:
      "An unused corner room with a remarkable view. We restored the cornicing, laid a warm parquet, and suspended a hand-pleated paper pendant above a solid walnut table made for long dinners.",
    cover: dining,
    gallery: [dining, materials, kitchen, library],
    before: beforeDining,
    aspect: "aspect-[2/3]",
  },
  {
    slug: "atelier-bath",
    title: "Atelier Bath",
    category: "Styling",
    location: "Goa",
    year: "2025",
    area: "450 sq ft",
    scope: ["Styling", "Material palette", "Objects"],
    summary: "A skylit bathing room in microcement and olive green.",
    story:
      "A styling commission for a villa in Goa. We worked with a single skylight, a stone bath and an olive tree to turn a functional room into a daily ritual.",
    cover: bath,
    gallery: [bath, materials, bedroom, boutique],
    aspect: "aspect-[3/4]",
  },
  {
    slug: "hotel-ombre",
    title: "Hotel Ombre",
    category: "Commercial",
    location: "Hitech City, Hyderabad",
    year: "2025",
    area: "14,000 sq ft",
    scope: ["Hospitality", "Lobby & lounge", "Custom lighting"],
    summary: "A double-height lobby glowing in bronze and rust velvet.",
    story:
      "For a boutique hotel we designed an arrival sequence that unfolds like a film: low light at the door, a curved bronze reception and a cascade of hand-blown pendants overhead.",
    cover: lobby,
    gallery: [lobby, materials, library, boutique],
    aspect: "aspect-[4/5]",
  },
  {
    slug: "reading-room",
    title: "The Reading Room",
    category: "Styling",
    location: "Pune",
    year: "2023",
    area: "600 sq ft",
    scope: ["Library styling", "Joinery", "Lighting"],
    summary: "Smoked oak shelving and lamplight for a collector of books.",
    story:
      "A private library for a lifelong reader. Floor-to-ceiling smoked oak, integrated picture lights and a single leather chair positioned exactly where the evening light lands.",
    cover: library,
    gallery: [library, materials, dining, living],
    aspect: "aspect-[2/3]",
  },
  {
    slug: "maison-arc",
    title: "Maison Arc",
    category: "Commercial",
    location: "Gachibowli, Hyderabad",
    year: "2024",
    area: "3,200 sq ft",
    scope: ["Retail", "Spatial branding", "Fixtures"],
    summary: "A fashion boutique of plaster arches and bronze rails.",
    story:
      "A flagship store designed as a sequence of plaster arches. Bronze rails, travertine plinths and concealed light lines let the collection breathe like an exhibition.",
    cover: boutique,
    gallery: [boutique, materials, bath, lobby],
    aspect: "aspect-[3/4]",
  },
];

export function filterProjects(list: Project[], filter: Filter): Project[] {
  return filter === "All" ? list : list.filter((p) => p.category === filter);
}
