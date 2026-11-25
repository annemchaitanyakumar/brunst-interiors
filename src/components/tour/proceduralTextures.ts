import * as THREE from "three";

export interface TextureBundle {
  textures: THREE.Texture[];
  oakPlankMap: THREE.CanvasTexture;
  oakPlankBump: THREE.CanvasTexture;
  oakPlankRoughness: THREE.CanvasTexture;
  travertineMap: THREE.CanvasTexture;
  travertineBump: THREE.CanvasTexture;
  microcementMap: THREE.CanvasTexture;
  microcementBump: THREE.CanvasTexture;
  plasterMap: THREE.CanvasTexture;
  plasterBump: THREE.CanvasTexture;
  darkPlasterMap: THREE.CanvasTexture;
  walnutMap: THREE.CanvasTexture;
  walnutBump: THREE.CanvasTexture;
  fabricMap: THREE.CanvasTexture;
  fabricBump: THREE.CanvasTexture;
  juteRugMap: THREE.CanvasTexture;
  juteRugBump: THREE.CanvasTexture;
  pleatMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  oliveLeafMap: THREE.CanvasTexture;
  skyMap: THREE.CanvasTexture;
  artLivingMap: THREE.CanvasTexture;
  artDiningMap: THREE.CanvasTexture;
  artBedroomMap: THREE.CanvasTexture;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  return [c, ctx];
}

function registerTex(
  canvas: HTMLCanvasElement,
  textures: THREE.Texture[],
  wrap: THREE.Wrapping = THREE.RepeatWrapping,
  srgb = true,
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = wrap;
  tex.wrapT = wrap;
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  textures.push(tex);
  return tex;
}

/** Deterministic PRNG so materials look consistent across reloads. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 1D harmonic noise for natural wood rings and stone strata. */
function harmonicNoise(x: number, seed: number): number {
  return (
    Math.sin(x * 1.1 + seed) * 0.45 +
    Math.sin(x * 2.7 + seed * 1.9) * 0.3 +
    Math.sin(x * 5.9 + seed * 3.1) * 0.15 +
    Math.cos(x * 11.3 + seed * 0.7) * 0.1
  );
}

/**
 * Generates seamless 1024p/512p PBR diffuse, bump, roughness, foliage alpha,
 * ambient-occlusion contact shadows, artwork canvases, and dusk backdrop textures.
 */
export function createProceduralTextures(): TextureBundle {
  const textures: THREE.Texture[] = [];
  const rand = mulberry32(2026);

  // 1. Wide-Plank Smoked European Oak Flooring (1024x1024 Diffuse + Bump + Roughness)
  const [oakC, oakCtx] = makeCanvas(1024, 1024);
  const [oakBC, oakBCtx] = makeCanvas(1024, 1024);
  const [oakRC, oakRCtx] = makeCanvas(1024, 1024);

  const plankCols = 8;
  const plankW = 1024 / plankCols;
  for (let col = 0; col < plankCols; col++) {
    const x0 = col * plankW;
    const stagger = ((col * 373) % 512) + 128;
    const segments = [
      { y0: 0, h: stagger },
      { y0: stagger, h: 1024 - stagger },
    ];

    for (const seg of segments) {
      const shade = (rand() - 0.5) * 18;
      const baseR = Math.round(74 + shade);
      const baseG = Math.round(54 + shade * 0.78);
      const baseB = Math.round(39 + shade * 0.58);

      const g = oakCtx.createLinearGradient(x0, seg.y0, x0 + plankW, seg.y0);
      g.addColorStop(0, `rgb(${baseR - 8},${baseG - 6},${baseB - 5})`);
      g.addColorStop(0.5, `rgb(${baseR + 5},${baseG + 4},${baseB + 3})`);
      g.addColorStop(1, `rgb(${baseR - 6},${baseG - 4},${baseB - 3})`);
      oakCtx.fillStyle = g;
      oakCtx.fillRect(x0, seg.y0, plankW, seg.h);

      oakBCtx.fillStyle = "#888888";
      oakBCtx.fillRect(x0, seg.y0, plankW, seg.h);

      const roughTone = Math.round(135 + (rand() - 0.5) * 32);
      oakRCtx.fillStyle = `rgb(${roughTone},${roughTone},${roughTone})`;
      oakRCtx.fillRect(x0, seg.y0, plankW, seg.h);

      // Organic wood fibers along plank length
      const grainPhase = rand() * 50;
      for (let gx = 0; gx < plankW; gx += 2) {
        const wave = harmonicNoise((gx + x0) * 0.14, grainPhase);
        const alpha = Math.abs(wave) * 0.16;
        oakCtx.fillStyle = wave > 0 ? `rgba(118, 86, 62, ${alpha})` : `rgba(26, 17, 11, ${alpha * 1.25})`;
        oakCtx.fillRect(x0 + gx, seg.y0, 2, seg.h);

        const bVal = Math.round(128 + wave * 28);
        oakBCtx.fillStyle = `rgba(${bVal},${bVal},${bVal},0.35)`;
        oakBCtx.fillRect(x0 + gx, seg.y0, 2, seg.h);
      }

      // Delicate plank bevel joint lines
      oakCtx.fillStyle = "rgba(18, 12, 8, 0.72)";
      oakCtx.fillRect(x0, seg.y0, 2, seg.h);
      oakCtx.fillRect(x0, seg.y0, plankW, 2);

      oakBCtx.fillStyle = "#202020";
      oakBCtx.fillRect(x0, seg.y0, 2.5, seg.h);
      oakBCtx.fillRect(x0, seg.y0, plankW, 2.5);

      oakRCtx.fillStyle = "#d8d8d8";
      oakRCtx.fillRect(x0, seg.y0, 2, seg.h);
      oakRCtx.fillRect(x0, seg.y0, plankW, 2);
    }
  }
  const oakPlankMap = registerTex(oakC, textures, THREE.RepeatWrapping, true);
  const oakPlankBump = registerTex(oakBC, textures, THREE.RepeatWrapping, false);
  const oakPlankRoughness = registerTex(oakRC, textures, THREE.RepeatWrapping, false);

  // 2. Vein-Cut Roman Travertine (1024x512 smooth mineral striations + soft micro-pores)
  const [travC, travCtx] = makeCanvas(1024, 512);
  const [travBC, travBCtx] = makeCanvas(1024, 512);
  travCtx.fillStyle = "#bfa98f";
  travCtx.fillRect(0, 0, 1024, 512);
  travBCtx.fillStyle = "#888888";
  travBCtx.fillRect(0, 0, 1024, 512);

  for (let y = 0; y < 512; y++) {
    const wave = harmonicNoise(y * 0.055, 4.2) * 16 + harmonicNoise(y * 0.19, 11.7) * 6;
    const tone = Math.max(125, Math.min(212, 168 + wave));
    const r = Math.round(tone + 20);
    const g = Math.round(tone + 2);
    const b = Math.round(tone - 22);
    travCtx.fillStyle = `rgb(${r},${g},${b})`;
    travCtx.fillRect(0, y, 1024, 1.5);

    const bV = Math.max(70, Math.min(200, Math.round(132 + wave * 1.3)));
    travBCtx.fillStyle = `rgb(${bV},${bV},${bV})`;
    travBCtx.fillRect(0, y, 1024, 1.5);
  }
  // Subtle mineral veins & tapered natural pores
  for (let i = 0; i < 480; i++) {
    const x = rand() * 1024;
    const y = rand() * 512;
    const w = 12 + rand() * 68;
    const gr = travCtx.createLinearGradient(x, y, x + w, y);
    gr.addColorStop(0, "rgba(105, 84, 64, 0)");
    gr.addColorStop(0.5, "rgba(105, 84, 64, 0.2)");
    gr.addColorStop(1, "rgba(105, 84, 64, 0)");
    travCtx.fillStyle = gr;
    travCtx.fillRect(x, y, w, 1.6);

    travBCtx.fillStyle = "rgba(65, 65, 65, 0.28)";
    travBCtx.fillRect(x + w * 0.2, y, w * 0.6, 1.4);
  }
  const travertineMap = registerTex(travC, textures, THREE.RepeatWrapping, true);
  const travertineBump = registerTex(travBC, textures, THREE.RepeatWrapping, false);

  // 3. Honed Warm Microcement / Limestone (for Spa Bath, Pool Coping & Sky Terrace)
  const [mcC, mcCtx] = makeCanvas(512, 512);
  const [mcBC, mcBCtx] = makeCanvas(512, 512);
  mcCtx.fillStyle = "#6e655c";
  mcCtx.fillRect(0, 0, 512, 512);
  mcBCtx.fillStyle = "#808080";
  mcBCtx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 360; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 30 + rand() * 88;
    const bright = rand() > 0.48;
    const g = mcCtx.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, bright ? "rgba(142, 131, 118, 0.12)" : "rgba(74, 67, 60, 0.14)");
    g.addColorStop(1, "rgba(110, 101, 92, 0)");
    mcCtx.fillStyle = g;
    mcCtx.fillRect(x - r, y - r, r * 2, r * 2);

    const gb = mcBCtx.createRadialGradient(x, y, 2, x, y, r);
    gb.addColorStop(0, bright ? "rgba(155, 155, 155, 0.12)" : "rgba(95, 95, 95, 0.12)");
    gb.addColorStop(1, "rgba(128, 128, 128, 0)");
    mcBCtx.fillStyle = gb;
    mcBCtx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const microcementMap = registerTex(mcC, textures, THREE.RepeatWrapping, true);
  const microcementBump = registerTex(mcBC, textures, THREE.RepeatWrapping, false);

  // 4. Hand-Troweled Architectural Limewash & Charcoal Tadelakt Plaster
  const [plasC, plasCtx] = makeCanvas(512, 512);
  const [plasBC, plasBCtx] = makeCanvas(512, 512);
  const [darkPC, darkPCtx] = makeCanvas(512, 512);

  plasCtx.fillStyle = "#9c8d7b";
  plasCtx.fillRect(0, 0, 512, 512);
  plasBCtx.fillStyle = "#808080";
  plasBCtx.fillRect(0, 0, 512, 512);
  darkPCtx.fillStyle = "#221f1c";
  darkPCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 480; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const r = 26 + rand() * 76;
    const light = rand() > 0.5;
    const g1 = plasCtx.createRadialGradient(x, y, 2, x, y, r);
    g1.addColorStop(0, light ? "rgba(182, 168, 149, 0.13)" : "rgba(116, 102, 86, 0.14)");
    g1.addColorStop(1, "rgba(156, 141, 123, 0)");
    plasCtx.fillStyle = g1;
    plasCtx.fillRect(x - r, y - r, r * 2, r * 2);

    const gB = plasBCtx.createRadialGradient(x, y, 2, x, y, r);
    gB.addColorStop(0, light ? "rgba(156,156,156,0.14)" : "rgba(98,98,98,0.14)");
    gB.addColorStop(1, "rgba(128,128,128,0)");
    plasBCtx.fillStyle = gB;
    plasBCtx.fillRect(x - r, y - r, r * 2, r * 2);

    const gD = darkPCtx.createRadialGradient(x, y, 2, x, y, r);
    gD.addColorStop(0, light ? "rgba(48, 43, 38, 0.16)" : "rgba(18, 16, 14, 0.18)");
    gD.addColorStop(1, "rgba(34, 31, 28, 0)");
    darkPCtx.fillStyle = gD;
    darkPCtx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const plasterMap = registerTex(plasC, textures, THREE.RepeatWrapping, true);
  const plasterBump = registerTex(plasBC, textures, THREE.RepeatWrapping, false);
  const darkPlasterMap = registerTex(darkPC, textures, THREE.RepeatWrapping, true);

  // 5. Figured American Walnut Millwork (smooth linear grain + vertical veneer sheen)
  const [walC, walCtx] = makeCanvas(512, 512);
  const [walBC, walBCtx] = makeCanvas(512, 512);
  walCtx.fillStyle = "#352318";
  walCtx.fillRect(0, 0, 512, 512);
  walBCtx.fillStyle = "#808080";
  walBCtx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x++) {
    const wave = harmonicNoise(x * 0.11, 2.3) + harmonicNoise(x * 0.32, 8.1) * 0.5;
    const tone = Math.round(52 + wave * 14);
    walCtx.fillStyle = `rgb(${tone + 6},${Math.max(12, tone - 12)},${Math.max(8, tone - 22)})`;
    walCtx.fillRect(x, 0, 1.5, 512);

    const bv = Math.max(60, Math.min(190, Math.round(128 + wave * 18)));
    walBCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
    walBCtx.fillRect(x, 0, 1.5, 512);
  }
  const walnutMap = registerTex(walC, textures, THREE.RepeatWrapping, true);
  const walnutBump = registerTex(walBC, textures, THREE.RepeatWrapping, false);

  // 6. Warm Bouclé Upholstery & Woven Jute Area Rug
  const [fabC, fabCtx] = makeCanvas(256, 256);
  const [fabBC, fabBCtx] = makeCanvas(256, 256);
  fabCtx.fillStyle = "#cfc3b0";
  fabCtx.fillRect(0, 0, 256, 256);
  fabBCtx.fillStyle = "#808080";
  fabBCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 3) {
    for (let x = 0; x < 256; x += 3) {
      const n = rand();
      fabCtx.fillStyle = n > 0.5 ? "rgba(236,227,212,0.34)" : "rgba(148,132,112,0.24)";
      fabCtx.fillRect(x, y, 2, 2);
      const b = Math.round(108 + n * 58);
      fabBCtx.fillStyle = `rgb(${b},${b},${b})`;
      fabBCtx.fillRect(x, y, 2, 2);
    }
  }
  const fabricMap = registerTex(fabC, textures, THREE.RepeatWrapping, true);
  const fabricBump = registerTex(fabBC, textures, THREE.RepeatWrapping, false);

  const [juteC, juteCtx] = makeCanvas(512, 512);
  const [juteBC, juteBCtx] = makeCanvas(512, 512);
  juteCtx.fillStyle = "#8f7b62";
  juteCtx.fillRect(0, 0, 512, 512);
  juteBCtx.fillStyle = "#808080";
  juteBCtx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 4) {
    for (let x = 0; x < 512; x += 6) {
      const shift = (y / 4) % 2 === 0 ? 0 : 3;
      const n = rand();
      juteCtx.fillStyle = n > 0.45 ? "rgba(176, 154, 126, 0.35)" : "rgba(92, 76, 56, 0.32)";
      juteCtx.fillRect((x + shift) % 512, y, 5, 3);
      const bv = Math.round(102 + n * 64);
      juteBCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
      juteBCtx.fillRect((x + shift) % 512, y, 5, 3);
    }
  }
  // Woven rug dark border trim
  juteCtx.strokeStyle = "rgba(48, 37, 27, 0.65)";
  juteCtx.lineWidth = 12;
  juteCtx.strokeRect(18, 18, 476, 476);
  const juteRugMap = registerTex(juteC, textures, THREE.RepeatWrapping, true);
  const juteRugBump = registerTex(juteBC, textures, THREE.RepeatWrapping, false);

  // 7. Hand-Pleated Rice-Paper Lantern Texture (shows crisp glowing ribs instead of flat white blob)
  const [plC, plCtx] = makeCanvas(512, 256);
  for (let x = 0; x < 512; x++) {
    const rib = Math.sin((x / 512) * Math.PI * 32);
    const v = Math.round(192 + rib * 42);
    plCtx.fillStyle = `rgb(${Math.min(255, v + 14)},${Math.min(255, v - 4)},${Math.max(120, v - 36)})`;
    plCtx.fillRect(x, 0, 1, 256);
  }
  const pleatMap = registerTex(plC, textures, THREE.RepeatWrapping, true);

  // 8. Soft Radial Ambient-Occlusion Contact Shadow Decal (grounding under every furniture piece)
  const [csC, csCtx] = makeCanvas(256, 256);
  const csGrad = csCtx.createRadialGradient(128, 128, 14, 128, 128, 126);
  csGrad.addColorStop(0, "rgba(12, 9, 6, 0.85)");
  csGrad.addColorStop(0.45, "rgba(12, 9, 6, 0.52)");
  csGrad.addColorStop(0.78, "rgba(12, 9, 6, 0.14)");
  csGrad.addColorStop(1, "rgba(12, 9, 6, 0.0)");
  csCtx.fillStyle = csGrad;
  csCtx.fillRect(0, 0, 256, 256);
  const contactShadowMap = registerTex(csC, textures, THREE.ClampToEdgeWrapping, false);

  // 9. Alpha-Cutout Mediterranean Olive Leaf Sprig (for natural branched trees instead of clay balls)
  const [olC, olCtx] = makeCanvas(256, 256);
  olCtx.clearRect(0, 0, 256, 256);
  // Central twig stem
  olCtx.strokeStyle = "#4b3e2f";
  olCtx.lineWidth = 4;
  olCtx.lineCap = "round";
  olCtx.beginPath();
  olCtx.moveTo(128, 246);
  olCtx.quadraticCurveTo(124, 140, 130, 24);
  olCtx.stroke();

  const leaves: [number, number, number, number, string][] = [
    [126, 210, -0.75, 42, "#546148"],
    [131, 198, 0.72, 44, "#677459"],
    [125, 165, -0.82, 48, "#606e54"],
    [132, 152, 0.68, 46, "#4d5942"],
    [124, 118, -0.65, 45, "#6e7c61"],
    [130, 108, 0.78, 44, "#58664b"],
    [126, 75, -0.58, 38, "#728064"],
    [131, 66, 0.62, 36, "#5a674d"],
    [130, 28, 0.06, 36, "#738166"],
  ];
  for (const [lx, ly, rot, len, col] of leaves) {
    olCtx.save();
    olCtx.translate(lx, ly);
    olCtx.rotate(rot);
    olCtx.fillStyle = col;
    olCtx.beginPath();
    olCtx.moveTo(0, 0);
    olCtx.quadraticCurveTo(-len * 0.24, -len * 0.5, 0, -len);
    olCtx.quadraticCurveTo(len * 0.24, -len * 0.5, 0, 0);
    olCtx.fill();
    // Silvery underside midrib accent
    olCtx.strokeStyle = "rgba(182, 192, 168, 0.35)";
    olCtx.lineWidth = 1.5;
    olCtx.beginPath();
    olCtx.moveTo(0, -4);
    olCtx.lineTo(0, -len * 0.85);
    olCtx.stroke();
    olCtx.restore();
  }
  const oliveLeafMap = registerTex(olC, textures, THREE.ClampToEdgeWrapping, true);

  // 10. Rich Golden-Hour Twilight Sky Dome with Misty Dusk Ridges (replaces black star void)
  const [skyC, skyCtx] = makeCanvas(1024, 512);
  const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0.0, "#1c202b");
  skyGrad.addColorStop(0.28, "#2b2b36");
  skyGrad.addColorStop(0.48, "#56433b");
  skyGrad.addColorStop(0.62, "#a36b43");
  skyGrad.addColorStop(0.71, "#df9a5e");
  skyGrad.addColorStop(0.78, "#28211d");
  skyGrad.addColorStop(1.0, "#161412");
  skyCtx.fillStyle = skyGrad;
  skyCtx.fillRect(0, 0, 1024, 512);

  // Soft golden cloud wisps near sunset horizon
  for (let i = 0; i < 42; i++) {
    const cx = rand() * 1024;
    const cy = 220 + rand() * 115;
    const rw = 90 + rand() * 200;
    const rh = 12 + rand() * 26;
    const cg = skyCtx.createRadialGradient(cx, cy, 4, cx, cy, rw);
    cg.addColorStop(0, "rgba(235, 166, 104, 0.16)");
    cg.addColorStop(1, "rgba(235, 166, 104, 0)");
    skyCtx.save();
    skyCtx.translate(cx, cy);
    skyCtx.scale(1, rh / rw);
    skyCtx.translate(-cx, -cy);
    skyCtx.fillStyle = cg;
    skyCtx.fillRect(cx - rw, cy - rw, rw * 2, rw * 2);
    skyCtx.restore();
  }

  // Distant layered hillside silhouette along horizon band
  skyCtx.fillStyle = "rgba(26, 22, 19, 0.9)";
  skyCtx.beginPath();
  skyCtx.moveTo(0, 410);
  for (let x = 0; x <= 1024; x += 16) {
    const h = 368 + Math.sin(x * 0.011) * 14 + Math.cos(x * 0.029) * 8;
    skyCtx.lineTo(x, h);
  }
  skyCtx.lineTo(1024, 512);
  skyCtx.lineTo(0, 512);
  skyCtx.closePath();
  skyCtx.fill();
  const skyMap = registerTex(skyC, textures, THREE.RepeatWrapping, true);

  // 11. Curated Abstract Relief & Oil Artwork Canvases (cohesive gallery art for walls)
  const buildAbstractArt = (
    bg: string,
    c1: string,
    c2: string,
    c3: string,
    variant: number,
  ): THREE.CanvasTexture => {
    const [ac, actx] = makeCanvas(512, 384);
    actx.fillStyle = bg;
    actx.fillRect(0, 0, 512, 384);
    for (let i = 0; i < 140; i++) {
      const x = rand() * 512;
      const y = rand() * 384;
      const r = 18 + rand() * 70;
      const g = actx.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, i % 2 === 0 ? c1 : c2);
      g.addColorStop(1, "rgba(0,0,0,0)");
      actx.fillStyle = g;
      actx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    actx.fillStyle = c3;
    if (variant === 0) {
      actx.beginPath();
      actx.arc(256, 210, 96, Math.PI, 0);
      actx.lineTo(352, 330);
      actx.lineTo(160, 330);
      actx.closePath();
      actx.fill();
    } else if (variant === 1) {
      actx.fillRect(48, 224, 416, 110);
      actx.fillStyle = c1;
      actx.fillRect(48, 72, 260, 128);
    } else {
      actx.strokeStyle = c3;
      actx.lineWidth = 3;
      actx.strokeRect(72, 56, 368, 272);
      actx.beginPath();
      actx.arc(256, 192, 76, 0, Math.PI * 2);
      actx.fill();
    }
    return registerTex(ac, textures, THREE.ClampToEdgeWrapping, true);
  };

  const artLivingMap = buildAbstractArt(
    "#cfc2ae",
    "rgba(136, 102, 72, 0.22)",
    "rgba(72, 54, 40, 0.25)",
    "rgba(168, 134, 98, 0.58)",
    0,
  );
  const artDiningMap = buildAbstractArt(
    "#26201b",
    "rgba(180, 120, 68, 0.28)",
    "rgba(58, 42, 30, 0.34)",
    "rgba(196, 148, 96, 0.5)",
    1,
  );
  const artBedroomMap = buildAbstractArt(
    "#d4cab8",
    "rgba(122, 104, 84, 0.16)",
    "rgba(170, 154, 134, 0.2)",
    "rgba(96, 78, 60, 0.44)",
    2,
  );

  return {
    textures,
    oakPlankMap,
    oakPlankBump,
    oakPlankRoughness,
    travertineMap,
    travertineBump,
    microcementMap,
    microcementBump,
    plasterMap,
    plasterBump,
    darkPlasterMap,
    walnutMap,
    walnutBump,
    fabricMap,
    fabricBump,
    juteRugMap,
    juteRugBump,
    pleatMap,
    contactShadowMap,
    oliveLeafMap,
    skyMap,
    artLivingMap,
    artDiningMap,
    artBedroomMap,
  };
}
