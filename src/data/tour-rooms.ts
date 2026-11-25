import * as THREE from "three";
import heroLiving from "@/assets/hero-living.webp";
import roomKitchen from "@/assets/room-kitchen.webp";
import roomDining from "@/assets/room-dining.webp";
import roomBedroom from "@/assets/room-bedroom.webp";
import roomBath from "@/assets/room-bath.webp";
import roomLibrary from "@/assets/room-library.webp";
import roomLobby from "@/assets/room-lobby.webp";

export interface PoseKeyframe {
  pos: [number, number, number];
  look: [number, number, number];
}

export interface TourStop {
  id: string;
  indexLabel: string;
  name: string;
  subtitle: string;
  description: string;
  materials: string;
  projectSlug?: string | undefined;
  projectTitle?: string | undefined;
  image: string;
  t: number;
  cameraPos: [number, number, number];
  lookAt: [number, number, number];
}

interface RoomChapterConfig extends Omit<TourStop, "t" | "cameraPos" | "lookAt"> {
  /** Waypoints walked smoothly BEFORE dwelling inside the room (aligns cleanly through open doorways). */
  entryPath: PoseKeyframe[];
  /** Dedicated interior exploration sweep inside THIS room (stays 68% of the room's scroll chapter). */
  roomSweep: PoseKeyframe[];
  /** Exit alignment pose looking toward the next room's doorway before stepping through. */
  exitPath: PoseKeyframe[];
}

const CHAPTER_CONFIGS: RoomChapterConfig[] = [
  {
    id: "arrival",
    indexLabel: "00",
    name: "Villa Arrival & Courtyard",
    subtitle: "Private Limestone Facade",
    description:
      "A monolithic two-story residence in Roman travertine and smoked cedar cladding behind a serene reflecting pool. Scroll to cross the stepping bridge and enter through the pivot door.",
    materials: "Roman Travertine · Smoked Cedar Cladding · Reflecting Pool",
    image: roomLobby,
    entryPath: [{ pos: [0.0, 1.85, 23.5], look: [-0.75, 1.7, 10.05] }],
    roomSweep: [
      { pos: [-0.75, 1.78, 18.5], look: [-0.75, 1.68, 10.05] },
      { pos: [-0.75, 1.72, 14.8], look: [-0.75, 1.65, 10.05] },
      { pos: [-0.75, 1.65, 11.8], look: [-0.75, 1.62, 10.05] },
    ],
    exitPath: [
      { pos: [-0.75, 1.58, 9.6], look: [-2.2, 1.45, 5.0] },
    ],
  },
  {
    id: "living",
    indexLabel: "01",
    name: "Living Salon",
    subtitle: "Ground Level · West Wing",
    description:
      "Intimate conversation salon featuring wide herringbone oak parquet, hand-troweled plaster hearth, glowing linear fireplace, sculpted bouclé modular sofa, and draped sunset glass.",
    materials: "Herringbone Oak · Linear Travertine Hearth · Textured Bouclé",
    projectSlug: "maison-lumiere",
    projectTitle: "Maison Lumière",
    image: heroLiving,
    entryPath: [
      { pos: [-1.2, 1.58, 8.5], look: [-2.7, 1.35, 4.8] },
    ],
    roomSweep: [
      { pos: [-1.3, 1.52, 7.2], look: [-2.7, 1.3, 4.6] },
      { pos: [-1.6, 1.5, 6.0], look: [-2.8, 1.32, 4.2] },
      { pos: [-2.2, 1.5, 5.4], look: [-3.0, 1.35, 3.8] },
      { pos: [-2.8, 1.52, 6.2], look: [-2.5, 1.32, 3.5] },
    ],
    exitPath: [
      { pos: [-0.8, 1.55, 6.5], look: [2.4, 1.35, 4.2] },
      { pos: [0.4, 1.55, 5.8], look: [3.2, 1.35, 4.0] },
    ],
  },
  {
    id: "kitchen",
    indexLabel: "02",
    name: "The Travertine Kitchen",
    subtitle: "Ground Level · East Wing",
    description:
      "A monumental waterfall Roman travertine island with counter bar seating, brass gooseneck faucet, smoked walnut floor-to-ceiling pantry joinery, and charcoal cooking niche.",
    materials: "Roman Travertine Island · Smoked Walnut Joinery · Brushed Brass",
    projectSlug: "travertine-kitchen",
    projectTitle: "The Travertine Kitchen",
    image: roomKitchen,
    entryPath: [
      { pos: [1.2, 1.55, 5.4], look: [3.5, 1.3, 4.0] },
    ],
    roomSweep: [
      { pos: [1.8, 1.52, 5.0], look: [3.5, 1.25, 4.0] },
      { pos: [2.1, 1.5, 3.8], look: [3.6, 1.28, 3.9] },
      { pos: [2.0, 1.5, 2.5], look: [3.8, 1.32, 3.2] },
      { pos: [1.6, 1.52, 1.5], look: [3.5, 1.3, 3.8] },
    ],
    exitPath: [
      { pos: [1.8, 1.55, 0.0], look: [2.05, 1.45, -4.0] },
      { pos: [2.05, 1.55, -1.8], look: [-1.0, 1.42, -6.5] },
    ],
  },
  {
    id: "dining",
    indexLabel: "03",
    name: "The Dusk Dining Room",
    subtitle: "Ground Level · North Atrium",
    description:
      "An intimate dining atmosphere framed by dark charcoal tadelakt walls, round solid walnut pedestal table dressed with stoneware and wine goblets, glowing candelabra, and pleated paper lantern.",
    materials: "Solid American Walnut · Charcoal Tadelakt · Pleated Paper",
    projectSlug: "dusk-dining-room",
    projectTitle: "The Dusk Dining Room",
    image: roomDining,
    entryPath: [
      { pos: [0.8, 1.55, -3.2], look: [-2.0, 1.3, -7.2] },
    ],
    roomSweep: [
      { pos: [-0.5, 1.5, -5.2], look: [-2.0, 1.2, -7.2] },
      { pos: [-1.0, 1.48, -6.2], look: [-2.0, 1.22, -7.3] },
      { pos: [-2.2, 1.48, -5.6], look: [-2.0, 1.25, -7.5] },
      { pos: [-2.8, 1.5, -6.8], look: [-1.9, 1.25, -7.4] },
    ],
    exitPath: [
      { pos: [-0.8, 1.55, -8.6], look: [3.5, 1.8, -13.0] },
      { pos: [1.5, 1.58, -10.5], look: [4.8, 2.2, -14.0] },
    ],
  },
  {
    id: "bedroom",
    indexLabel: "04",
    name: "Primary Bedroom",
    subtitle: "Upper Level · Sanctuary",
    description:
      "Ascend the floating travertine stairs into a tranquil upper suite: smoked walnut headboard with halo LED illumination, king platform bed layered in textured bouclé and rust linen, and reading lounge.",
    materials: "Smoked Walnut · Limewash Plaster · Textured Bouclé",
    projectSlug: "linen-house",
    projectTitle: "Linen House",
    image: roomBedroom,
    entryPath: [
      { pos: [3.2, 2.4, -13.2], look: [4.8, 3.8, -15.5] },
      { pos: [4.2, 4.3, -15.5], look: [2.0, 5.3, -18.0] },
      { pos: [1.8, 5.5, -18.2], look: [-1.8, 5.1, -22.5] },
    ],
    roomSweep: [
      { pos: [0.2, 5.45, -19.5], look: [-2.2, 4.8, -23.0] },
      { pos: [-0.8, 5.42, -20.6], look: [-2.35, 4.75, -23.2] },
      { pos: [-1.6, 5.42, -21.2], look: [-2.4, 4.8, -23.3] },
      { pos: [-2.8, 5.45, -20.5], look: [-2.35, 4.8, -23.0] },
    ],
    exitPath: [
      { pos: [-0.4, 5.5, -21.8], look: [3.0, 5.2, -22.5] },
      { pos: [1.2, 5.5, -21.8], look: [4.4, 5.0, -22.8] },
    ],
  },
  {
    id: "bath",
    indexLabel: "05",
    name: "Skylit Spa Bath",
    subtitle: "Upper Level · East Suite",
    description:
      "A private stone sanctuary with natural light descending from an architectural skylight onto a freestanding carved Roman travertine soaking tub, brushed brass floor filler, and floating marble vanity.",
    materials: "Carved Roman Travertine · Honed Concrete · Brushed Brass",
    projectSlug: "atelier-bath",
    projectTitle: "Atelier Bath",
    image: roomBath,
    entryPath: [
      { pos: [2.0, 5.5, -21.8], look: [4.5, 4.9, -22.8] },
    ],
    roomSweep: [
      { pos: [2.8, 5.44, -22.0], look: [4.55, 4.65, -22.95] },
      { pos: [3.4, 5.42, -22.8], look: [4.6, 4.65, -22.95] },
      { pos: [3.8, 5.42, -21.5], look: [5.2, 4.8, -21.2] },
      { pos: [4.2, 5.44, -22.0], look: [4.6, 4.65, -22.9] },
    ],
    exitPath: [
      { pos: [2.6, 5.5, -25.2], look: [2.8, 5.2, -28.5] },
    ],
  },
  {
    id: "library",
    indexLabel: "06",
    name: "Private Library Study",
    subtitle: "Upper Level · Quiet Study",
    description:
      "Floor-to-ceiling smoked walnut millwork bookshelves with warm integrated LED shelf reveals, rich cognac leather club chair with ottoman, marble side table, and brass reading lamp.",
    materials: "Smoked Walnut Millwork · Cognac Leather · Brass Task Lamp",
    projectSlug: "reading-room",
    projectTitle: "The Reading Room",
    image: roomLibrary,
    entryPath: [
      { pos: [2.2, 5.5, -27.2], look: [3.6, 5.0, -30.5] },
    ],
    roomSweep: [
      { pos: [1.6, 5.44, -28.8], look: [3.6, 4.9, -30.5] },
      { pos: [2.1, 5.42, -30.0], look: [3.8, 4.88, -30.6] },
      { pos: [2.6, 5.42, -31.2], look: [5.2, 5.0, -30.8] },
      { pos: [2.9, 5.44, -30.0], look: [4.0, 4.9, -30.5] },
    ],
    exitPath: [
      { pos: [2.4, 5.5, -34.5], look: [0.5, 5.2, -38.5] },
      { pos: [1.8, 5.5, -36.2], look: [0.45, 4.9, -40.0] },
    ],
  },
  {
    id: "balcony",
    indexLabel: "07",
    name: "Sky Balcony & Terrace",
    subtitle: "Upper Level · Sunset Deck",
    description:
      "Cantilevered stone deck with laminated glass balustrade looking out over the dusk horizon, featuring a sculpted stone fire pit with glowing embers and modern outdoor lounge seating.",
    materials: "Honed Travertine Deck · Laminated Glass · Glowing Stone Hearth",
    projectSlug: "hotel-ombre",
    projectTitle: "Hotel Ombre",
    image: roomLobby,
    entryPath: [
      { pos: [1.2, 5.5, -37.2], look: [0.45, 4.85, -40.0] },
    ],
    roomSweep: [
      { pos: [0.8, 5.44, -38.2], look: [0.45, 4.65, -40.0] },
      { pos: [0.2, 5.42, -39.2], look: [0.45, 4.65, -40.2] },
      { pos: [-1.0, 5.42, -39.0], look: [0.2, 4.75, -40.5] },
      { pos: [-1.5, 5.44, -39.8], look: [0.45, 4.75, -40.2] },
    ],
    exitPath: [
      { pos: [-1.5, 5.44, -39.8], look: [0.45, 4.75, -40.2] },
    ],
  },
];

const CHAPTER_COUNT = CHAPTER_CONFIGS.length;
const ENTRY_SPAN = 0.18;
const SWEEP_END = 0.86;

const smoothstep = (x: number) => x * x * (3 - 2 * x);

// Precompute smooth interior curves & portal bridges per room chapter
interface CompiledChapter {
  entryCurvePos: THREE.CatmullRomCurve3;
  entryCurveLook: THREE.CatmullRomCurve3;
  sweepCurvePos: THREE.CatmullRomCurve3;
  sweepCurveLook: THREE.CatmullRomCurve3;
  exitCurvePos: THREE.CatmullRomCurve3;
  exitCurveLook: THREE.CatmullRomCurve3;
}

const COMPILED_CHAPTERS: CompiledChapter[] = CHAPTER_CONFIGS.map((cfg, idx) => {
  const prevExitLast =
    idx > 0
      ? CHAPTER_CONFIGS[idx - 1]!.exitPath[CHAPTER_CONFIGS[idx - 1]!.exitPath.length - 1]!
      : cfg.entryPath[0]!;

  const entryPts = [prevExitLast, ...cfg.entryPath, cfg.roomSweep[0]!];
  const sweepPts = cfg.roomSweep;
  const exitPts = [cfg.roomSweep[cfg.roomSweep.length - 1]!, ...cfg.exitPath];

  const mkCurves = (pts: PoseKeyframe[]) => {
    const safePts = pts.length >= 2 ? pts : [pts[0]!, pts[0]!];
    return {
      pos: new THREE.CatmullRomCurve3(safePts.map((p) => new THREE.Vector3(...p.pos)), false, "catmullrom", 0.25),
      look: new THREE.CatmullRomCurve3(safePts.map((p) => new THREE.Vector3(...p.look)), false, "catmullrom", 0.25),
    };
  };

  const en = mkCurves(entryPts);
  const sw = mkCurves(sweepPts);
  const ex = mkCurves(exitPts);
  return {
    entryCurvePos: en.pos,
    entryCurveLook: en.look,
    sweepCurvePos: sw.pos,
    sweepCurveLook: sw.look,
    exitCurvePos: ex.pos,
    exitCurveLook: ex.look,
  };
});

/**
 * Evaluates a staged, collision-free room-by-room camera pose for normalized scroll progress [0, 1].
 * Each room holds for 68% of its scroll chapter sweeping gently around that room before exiting.
 */
export function evaluateWalkthroughCamera(
  rawT: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
): number {
  const t = Math.min(0.99999, Math.max(0, rawT));
  const scaled = t * CHAPTER_COUNT;
  const chapterIdx = Math.min(CHAPTER_COUNT - 1, Math.floor(scaled));
  const u = scaled - chapterIdx;
  const comp = COMPILED_CHAPTERS[chapterIdx]!;

  if (u < ENTRY_SPAN) {
    const k = smoothstep(u / ENTRY_SPAN);
    comp.entryCurvePos.getPointAt(k, outPos);
    comp.entryCurveLook.getPointAt(k, outLook);
  } else if (u < SWEEP_END) {
    const rawS = (u - ENTRY_SPAN) / (SWEEP_END - ENTRY_SPAN);
    const k = rawS * 0.7 + smoothstep(rawS) * 0.3;
    comp.sweepCurvePos.getPointAt(k, outPos);
    comp.sweepCurveLook.getPointAt(k, outLook);
  } else {
    const k = smoothstep((u - SWEEP_END) / (1 - SWEEP_END));
    comp.exitCurvePos.getPointAt(k, outPos);
    comp.exitCurveLook.getPointAt(k, outLook);
  }

  return chapterIdx;
}

/** Smoothly opens the front pivot walnut entry door as the viewer approaches the covered porch. */
export function getPivotDoorOpenAmount(t: number): number {
  const openStart = 0.04;
  const openEnd = 0.12;
  const norm = Math.min(1, Math.max(0, (t - openStart) / (openEnd - openStart)));
  return smoothstep(norm) * 1.45;
}

export const TOUR_STOPS: TourStop[] = CHAPTER_CONFIGS.map((cfg, idx) => ({
  id: cfg.id,
  indexLabel: cfg.indexLabel,
  name: cfg.name,
  subtitle: cfg.subtitle,
  description: cfg.description,
  materials: cfg.materials,
  projectSlug: cfg.projectSlug,
  projectTitle: cfg.projectTitle,
  image: cfg.image,
  t: Number(((idx + 0.24) / CHAPTER_COUNT).toFixed(4)),
  cameraPos: cfg.roomSweep[0]!.pos,
  lookAt: cfg.roomSweep[0]!.look,
}));
