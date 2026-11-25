import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { LoadedPbrSet, ModelId, StudioAssets } from "./assetLoader";
import type { TextureBundle } from "./proceduralTextures";

export interface BuildHouseResult {
  animatedCurtains: THREE.Mesh[];
  animatedWater: THREE.Mesh;
  pivotDoor: THREE.Group;
  emberMat: THREE.MeshStandardMaterial;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
  textures: THREE.Texture[];
}

/**
 * Scales BoxGeometry UVs proportionally to real-world meters AND clones uv -> uv2
 * so photographed 2K PBR AO, normal, and roughness maps render crisply at true scale.
 */
function scaleBoxUVs(
  geo: THREE.BoxGeometry,
  w: number,
  h: number,
  d: number,
  tileMeters = 1.8,
): THREE.BoxGeometry {
  const uv = geo.attributes["uv"] as THREE.BufferAttribute;
  const faceDims: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let face = 0; face < 6; face++) {
    const [uScale, vScale] = faceDims[face]!;
    for (let v = 0; v < 4; v++) {
      const idx = face * 4 + v;
      uv.setXY(
        idx,
        (uv.getX(idx) * uScale) / tileMeters,
        (uv.getY(idx) * vScale) / tileMeters,
      );
    }
  }
  uv.needsUpdate = true;
  geo.setAttribute("uv2", uv.clone());
  return geo;
}

/**
 * Builds the architectural estate:
 * - Solid Roman travertine and dark cedar private exterior facade (NO fishbowl/aquarium glass exposing rooms!)
 * - Oversized smoked-walnut pivot entry door over a reflecting water court
 * - Proportioned, intimate luxury rooms: Living Salon with linear hearth, Travertine Kitchen with waterfall island,
 *   Dusk Dining Room with round table & paper lantern, Primary Bedroom suite, Skylit Spa Bath, Private Library, and Sunset Deck
 * - NO jail-like vertical bars anywhere; only clean architectural ledges, bronze reveals, and monolithic planes
 * - Realistic leafy botanical greenery (Pachira & snake plants; zero low-poly lollipop balls)
 */
export function buildRealisticHouse(
  scene: THREE.Scene,
  assets: StudioAssets,
  tex: TextureBundle,
): BuildHouseResult {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [...tex.textures, ...assets.textures, assets.envTexture];
  const animatedCurtains: THREE.Mesh[] = [];

  const regGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const regMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const makePbrMat = (
    set: LoadedPbrSet,
    colorHex: number,
    roughness: number,
    normalScale = 0.85,
    aoIntensity = 0.45,
    metalness = 0.03,
  ) =>
    regMat(
      new THREE.MeshStandardMaterial({
        color: colorHex,
        map: set.diffuse,
        normalMap: set.normal,
        normalScale: new THREE.Vector2(normalScale, normalScale),
        roughnessMap: set.roughness,
        roughness,
        aoMap: set.ao,
        aoMapIntensity: aoIntensity,
        metalness,
      }),
    );

  // --- Photographed Architectural 2K PBR Materials ---
  const matHerringboneFloor = makePbrMat(assets.pbr.herringbone_parquet, 0xf0e4d2, 0.48, 0.9, 0.45, 0.03);
  const matWalnut = makePbrMat(assets.pbr.smoked_walnut_veneer, 0xdcd0c0, 0.42, 0.8, 0.45, 0.04);
  const matCedarSiding = makePbrMat(assets.pbr.brown_planks_04, 0xb89f8a, 0.68, 0.88, 0.55, 0.02);
  const matTravertine = makePbrMat(assets.pbr.marble_01, 0xf5eee2, 0.35, 0.65, 0.4, 0.04);
  const matLimewash = makePbrMat(assets.pbr.plastered_wall_04, 0xf2ece3, 0.88, 0.9, 0.45, 0.0);
  const matDarkPlaster = makePbrMat(assets.pbr.plastered_wall_04, 0x48423c, 0.86, 0.85, 0.55, 0.02);
  const matCeilingSoffit = makePbrMat(assets.pbr.plastered_wall_04, 0xded8ce, 0.92, 0.6, 0.45, 0.0);
  const matConcrete = makePbrMat(assets.pbr.smooth_concrete_floor, 0xded8ce, 0.76, 0.8, 0.48, 0.02);
  const matSlateTiles = makePbrMat(assets.pbr.patterned_slate_tiles, 0xdad3c8, 0.72, 0.85, 0.5, 0.04);
  const matExteriorLawn = makePbrMat(assets.pbr.grass_ground, 0xaeb89e, 0.96, 0.9, 0.6, 0.0);
  const matWoolRug = makePbrMat(assets.pbr.poly_wool_herringbone, 0xddd2c0, 0.95, 0.88, 0.55, 0.0);
  const matBoucle = makePbrMat(assets.pbr.wool_boucle, 0xf4eee4, 0.94, 0.85, 0.45, 0.0);
  const matRustLinen = makePbrMat(assets.pbr.wool_boucle, 0x9e5f3e, 0.9, 0.8, 0.45, 0.0);

  const matBronze = regMat(
    new THREE.MeshStandardMaterial({ color: 0x3d3022, roughness: 0.28, metalness: 0.9 }),
  );
  const matWarmBrass = regMat(
    new THREE.MeshStandardMaterial({ color: 0xc49d62, roughness: 0.22, metalness: 0.92 }),
  );
  const matSteelFrame = regMat(
    new THREE.MeshStandardMaterial({ color: 0x1a1816, roughness: 0.32, metalness: 0.85 }),
  );
  const matCeramicWhite = regMat(
    new THREE.MeshStandardMaterial({ color: 0xede6dc, roughness: 0.26, metalness: 0.02 }),
  );

  // Exterior privacy glass: opaque dusk-sky reflection from outside so rooms are NOT visible like an open shop!
  const matPrivacyMirrorGlass = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x14181c,
      roughness: 0.06,
      metalness: 0.9,
      envMapIntensity: 1.5,
      transparent: true,
      opacity: 0.95,
    }),
  );

  // Courtyard & Terrace glass (low-iron clear glass without heavy MeshPhysicalMaterial shader)
  const matInteriorGlass = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xdde5df,
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      metalness: 0.15,
      envMapIntensity: 1.4,
      depthWrite: false,
    }),
  );

  const matCurtain = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6ded0,
      normalMap: assets.pbr.wool_boucle.normal,
      normalScale: new THREE.Vector2(0.35, 0.35),
      roughnessMap: assets.pbr.wool_boucle.roughness,
      roughness: 0.9,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    }),
  );

  const matPleatedPaper = regMat(
    new THREE.MeshStandardMaterial({
      map: tex.pleatMap,
      emissive: 0xd89b52,
      emissiveMap: tex.pleatMap,
      emissiveIntensity: 0.65,
      roughness: 0.84,
      side: THREE.DoubleSide,
    }),
  );

  const matWarmLed = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xffe2ba,
      emissive: 0xff9e44,
      emissiveIntensity: 0.85,
      roughness: 0.35,
    }),
  );

  const matContactShadow = regMat(
    new THREE.MeshBasicMaterial({
      map: tex.contactShadowMap,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    }),
  );

  const matStillWater = regMat(
    new THREE.MeshStandardMaterial({
      color: 0x121a1e,
      roughness: 0.04,
      metalness: 0.55,
      envMapIntensity: 1.4,
    }),
  );

  // --- Geometry & Helper Functions ---
  const addBox = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
    options?: {
      castShadow?: boolean;
      receiveShadow?: boolean;
      rotY?: number;
      tile?: number;
      rounded?: number;
    },
  ) => {
    const geo = options?.rounded
      ? regGeo(new RoundedBoxGeometry(w, h, d, 3, options.rounded))
      : regGeo(scaleBoxUVs(new THREE.BoxGeometry(w, h, d), w, h, d, options?.tile ?? 1.8));
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    if (options?.rotY) mesh.rotation.y = options.rotY;
    mesh.castShadow = options?.castShadow ?? true;
    mesh.receiveShadow = options?.receiveShadow ?? true;
    scene.add(mesh);
    return mesh;
  };

  const addShadowAO = (x: number, y: number, z: number, w: number, d: number, rotY = 0, op = 1) => {
    const geo = regGeo(new THREE.PlaneGeometry(w, d));
    const mat =
      op === 1
        ? matContactShadow
        : regMat(
            new THREE.MeshBasicMaterial({
              map: tex.contactShadowMap,
              transparent: true,
              opacity: 0.52 * op,
              depthWrite: false,
              polygonOffset: true,
              polygonOffsetFactor: -1,
            }),
          );
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotY;
    mesh.position.set(x, y, z);
    scene.add(mesh);
  };

  const addBaseboard = (w: number, d: number, x: number, yBase: number, z: number) => {
    addBox(w, 0.08, d, x, yBase + 0.04, z, matSteelFrame, { castShadow: false });
    addBox(w, 0.015, d * 1.12, x, yBase + 0.085, z, matBronze, { castShadow: false });
  };

  const addCeilingDownlight = (x: number, yCeil: number, z: number) => {
    const rim = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.015, 20)), matSteelFrame);
    rim.position.set(x, yCeil - 0.005, z);
    const lens = new THREE.Mesh(regGeo(new THREE.CircleGeometry(0.045, 16)), matWarmLed);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, yCeil - 0.014, z);
    scene.add(rim, lens);
  };

  const addDoorCasing = (
    x: number,
    yBase: number,
    z: number,
    openW: number,
    openH: number,
    wallDepth: number,
    alongX = true,
  ) => {
    const casingThick = 0.055;
    const jambDepth = wallDepth + 0.04;
    const group = new THREE.Group();
    group.position.set(x, yBase, z);
    if (!alongX) group.rotation.y = Math.PI / 2;

    const sideGeo = regGeo(scaleBoxUVs(new THREE.BoxGeometry(casingThick, openH, jambDepth), casingThick, openH, jambDepth, 1.5));
    const jambL = new THREE.Mesh(sideGeo, matWalnut);
    jambL.position.set(-openW * 0.5 + casingThick * 0.5, openH * 0.5, 0);
    const jambR = new THREE.Mesh(sideGeo, matWalnut);
    jambR.position.set(openW * 0.5 - casingThick * 0.5, openH * 0.5, 0);
    const headGeo = regGeo(scaleBoxUVs(new THREE.BoxGeometry(openW, casingThick, jambDepth), openW, casingThick, jambDepth, 1.5));
    const head = new THREE.Mesh(headGeo, matWalnut);
    head.position.set(0, openH - casingThick * 0.5, 0);

    jambL.castShadow = true;
    jambR.castShadow = true;
    head.castShadow = true;
    group.add(jambL, jambR, head);
    scene.add(group);
  };

  const addCeilingCoffer = (
    x: number,
    yCeil: number,
    z: number,
    w: number,
    d: number,
    beamCount = 0,
  ) => {
    const rim = 0.38;
    const drop = 0.14;
    const yDrop = yCeil - drop * 0.5;
    addBox(w, drop, rim, x, yDrop, z + d * 0.5 - rim * 0.5, matCeilingSoffit, { castShadow: false });
    addBox(w, drop, rim, x, yDrop, z - d * 0.5 + rim * 0.5, matCeilingSoffit, { castShadow: false });
    addBox(rim, drop, d - rim * 2, x - w * 0.5 + rim * 0.5, yDrop, z, matCeilingSoffit, { castShadow: false });
    addBox(rim, drop, d - rim * 2, x + w * 0.5 - rim * 0.5, yDrop, z, matCeilingSoffit, { castShadow: false });

    // Warm indirect LED perimeter glow strip
    addBox(w - rim * 2.2, 0.012, 0.015, x, yCeil - drop + 0.025, z - d * 0.5 + rim + 0.02, matWarmLed, {
      castShadow: false,
    });
    for (const dx of [-w * 0.28, w * 0.28]) {
      for (const dz of [-d * 0.28, d * 0.28]) {
        addCeilingDownlight(x + dx, yCeil, z + dz);
      }
    }

    if (beamCount > 0) {
      for (let i = 0; i < beamCount; i++) {
        const bx = x - w * 0.36 + (i / Math.max(1, beamCount - 1)) * (w * 0.72);
        addBox(0.12, 0.12, d - rim * 2, bx, yCeil - 0.06, z, matWalnut, { tile: 1.5 });
      }
    }
  };

  const addDrapedCurtain = (x: number, yBase: number, zStart: number, span: number, height: number) => {
    const segX = 48;
    const segY = 12;
    const geo = regGeo(new THREE.PlaneGeometry(span, height, segX, segY));
    const pos = geo.attributes["position"] as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const u = (px + span * 0.5) / span;
      const v = (py + height * 0.5) / height;
      const splay = 1 + (1 - v) * 0.2;
      const wave =
        (Math.sin(u * Math.PI * 14) * 0.065 + Math.cos(u * Math.PI * 28) * 0.018) * splay;
      pos.setZ(i, wave);
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, matCurtain);
    mesh.position.set(x, yBase + height * 0.5, zStart + span * 0.5);
    mesh.rotation.y = Math.PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    animatedCurtains.push(mesh);
    addBox(0.045, 0.035, span + 0.06, x, yBase + height - 0.018, zStart + span * 0.5, matSteelFrame, {
      castShadow: false,
    });
  };

  // Place 3D model with per-model shadow culling to keep WebGL draw/shadow cost ultra-low
  const HIGH_POLY_NO_SHADOW = new Set<ModelId>([
    "pachira_aquatica_01",
    "potted_plant_02",
    "brass_candleholders",
    "ceramic_vase_01",
    "ceramic_vase_02",
    "wooden_bowl_01",
    "desk_lamp_arm_01",
    "modern_ceiling_lamp_01",
  ]);

  const placeModel = (
    id: ModelId,
    x: number,
    surfaceY: number,
    z: number,
    opts?: {
      targetHeight?: number;
      targetWidth?: number;
      scale?: number;
      rotY?: number;
      tintHex?: number;
      emissiveHex?: number;
      emissiveIntensity?: number;
      castShadow?: boolean;
      shadowAO?: [number, number] | false;
    },
  ) => {
    const clone = assets.models[id].clone(true);
    const shouldCastShadow = opts?.castShadow ?? !HIGH_POLY_NO_SHADOW.has(id);

    clone.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.castShadow = shouldCastShadow;
        m.receiveShadow = true;
        const needsMatClone =
          opts?.tintHex !== undefined ||
          (opts?.emissiveHex !== undefined &&
            /(flame|light|glass|globe|bulb)/i.test(m.name + " " + (Array.isArray(m.material) ? "" : m.material.name)));
        if (needsMatClone && !Array.isArray(m.material)) {
          const matCopy = m.material.clone() as THREE.MeshStandardMaterial;
          if (opts?.tintHex !== undefined && matCopy.color) {
            matCopy.color.multiply(new THREE.Color(opts.tintHex));
          }
          if (
            opts?.emissiveHex !== undefined &&
            /(flame|light|glass|globe|bulb)/i.test(m.name + " " + matCopy.name)
          ) {
            matCopy.emissive = new THREE.Color(opts.emissiveHex);
            matCopy.emissiveIntensity = opts.emissiveIntensity ?? 1.2;
          }
          materials.push(matCopy);
          m.material = matCopy;
        }
      }
    });

    if (opts?.scale !== undefined) {
      clone.scale.setScalar(opts.scale);
    } else if (opts?.targetHeight !== undefined || opts?.targetWidth !== undefined) {
      const preBox = new THREE.Box3().setFromObject(clone);
      const size = new THREE.Vector3();
      preBox.getSize(size);
      const s =
        opts.targetHeight !== undefined
          ? opts.targetHeight / Math.max(0.001, size.y)
          : opts.targetWidth! / Math.max(0.001, size.x);
      clone.scale.setScalar(s);
    }

    if (opts?.rotY !== undefined) clone.rotation.y = opts.rotY;

    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    clone.position.set(
      clone.position.x + (x - center.x),
      clone.position.y + (surfaceY - box.min.y),
      clone.position.z + (z - center.z),
    );
    scene.add(clone);

    if (opts?.shadowAO !== false) {
      const [aoW, aoD] = opts?.shadowAO ?? [size.x * 1.15, size.z * 1.15];
      addShadowAO(x, surfaceY + 0.003, z, aoW, aoD, opts?.rotY ?? 0, 0.82);
    }
    return clone;
  };

  const addGlassFacade = (
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    yBase: number,
    height: number,
    panels: number,
    doorGapIndex = -1,
    privacyMirror = false,
  ) => {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);

    const addAlong = (t: number, w: number, h: number, y: number, thick: number, mat: THREE.Material) => {
      const m = new THREE.Mesh(
        regGeo(scaleBoxUVs(new THREE.BoxGeometry(thick, h, w), thick, h, w, 2)),
        mat,
      );
      m.position.set(x1 + dx * t, y, z1 + dz * t);
      m.rotation.y = angle;
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
    };

    addAlong(0.5, len, 0.07, yBase + height - 0.035, 0.09, matSteelFrame);
    addAlong(0.5, len, 0.04, yBase + 0.02, 0.09, matSteelFrame);
    addAlong(0.5, len, 0.025, yBase + height * 0.72, 0.05, matSteelFrame);

    const glassMat = privacyMirror ? matPrivacyMirrorGlass : matInteriorGlass;
    for (let i = 0; i <= panels; i++) {
      addAlong(i / panels, 0.05, height, yBase + height * 0.5, 0.095, matSteelFrame);
      if (i < panels && i !== doorGapIndex) {
        const pw = len / panels;
        const pane = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(pw, height - 0.08)), glassMat);
        pane.position.set(x1 + dx * ((i + 0.5) / panels), yBase + height * 0.5, z1 + dz * ((i + 0.5) / panels));
        pane.rotation.y = angle + Math.PI / 2;
        scene.add(pane);
      }
    }
  };

  const addArt = (
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    rotY: number,
    artTex: THREE.Texture,
  ) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    const frame = new THREE.Mesh(regGeo(new THREE.BoxGeometry(w + 0.06, h + 0.06, 0.04)), matWalnut);
    frame.castShadow = true;
    const matEdge = new THREE.Mesh(regGeo(new THREE.BoxGeometry(w + 0.02, h + 0.02, 0.042)), matBoucle);
    const canvas = new THREE.Mesh(
      regGeo(new THREE.PlaneGeometry(w - 0.05, h - 0.05)),
      regMat(new THREE.MeshStandardMaterial({ map: artTex, roughness: 0.72 })),
    );
    canvas.position.z = 0.024;
    group.add(frame, matEdge, canvas);

    const bar = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.01, 0.01, w * 0.45, 12)), matWarmBrass);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, h * 0.5 + 0.07, 0.1);
    group.add(bar);
    scene.add(group);
  };

  // =========================================================================
  // 0. ESTATE GROUNDS, COURTYARD WATER FEATURE & SOLID PRIVATE FACADE
  // =========================================================================
  // Genuine 2K manicured lawn turf
  addBox(140, 0.2, 140, 0, -0.35, -14, matExteriorLawn, { castShadow: false, tile: 4.5 });

  // Slate-Tiled Motor Court & Reflecting Pool (single-quad water for zero CPU stall)
  addBox(24.0, 0.14, 16.0, 0.3, -0.21, 18.5, matSlateTiles, { castShadow: false, tile: 2.2 });
  const animatedWater = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(18.0, 8.4)), matStillWater);
  animatedWater.rotation.x = -Math.PI / 2;
  animatedWater.position.set(0.2, -0.04, 15.8);
  animatedWater.receiveShadow = true;
  scene.add(animatedWater);

  // Travertine Pool Coping & Floating Stepping Bridge
  addBox(18.5, 0.14, 0.44, 0.2, -0.02, 20.1, matTravertine, { tile: 1.5 });
  addBox(0.44, 0.14, 8.8, -8.9, -0.02, 15.6, matTravertine, { tile: 1.5 });
  addBox(0.44, 0.14, 8.8, 9.3, -0.02, 15.6, matTravertine, { tile: 1.5 });
  for (let i = 0; i < 4; i++) {
    const zStep = 18.8 - i * 2.15;
    addBox(2.6, 0.14, 1.48, -0.75, 0.0, zStep, matTravertine, { tile: 1.4, rounded: 0.015 });
    addShadowAO(-0.75, -0.035, zStep, 2.8, 1.65, 0, 0.6);
    // Minimalist bronze path bollard
    addBox(0.06, 0.45, 0.06, -1.95, 0.23, zStep, matSteelFrame);
    addBox(0.055, 0.025, 0.055, -1.95, 0.41, zStep, matWarmLed, { castShadow: false });
  }
  addBox(13.2, 0.14, 1.6, 0.4, 0.0, 10.6, matTravertine, { tile: 1.6 });

  // Perimeter Privacy Walls
  addBox(14.0, 1.6, 0.36, -12.0, 0.6, 23.2, matDarkPlaster, { tile: 2.2 });
  addBox(14.0, 1.6, 0.36, 12.6, 0.6, 23.2, matDarkPlaster, { tile: 2.2 });
  addBox(0.32, 2.2, 58, -11.4, 1.0, -8.5, matDarkPlaster, { tile: 2.4 });
  addBox(0.32, 2.2, 58, 10.2, 1.0, -8.5, matDarkPlaster, { tile: 2.4 });

  // Courtyard Planters + Botanical Greenery (Pachira & Potted Plants - NO lollipop balls!)
  addBox(3.4, 0.5, 1.4, -3.9, 0.25, 11.4, matTravertine, { tile: 1.4 });
  addBox(3.6, 0.5, 1.4, 3.8, 0.25, 11.4, matTravertine, { tile: 1.4 });
  placeModel("pachira_aquatica_01", -3.9, 0.5, 11.4, { targetHeight: 2.6, rotY: 0.4 });
  placeModel("potted_plant_02", 3.6, 0.5, 11.4, { targetHeight: 1.2, rotY: -0.6 });
  placeModel("potted_plant_02", -2.5, 0.0, 11.2, { targetHeight: 0.95, rotY: 1.1 });
  placeModel("potted_plant_02", 5.2, 0.0, 11.2, { targetHeight: 0.9, rotY: -0.7 });

  // =========================================================================
  // PRIVATE ARCHITECTURAL FRONT FACADE
  // (Monolithic Roman Travertine & Smoked Cedar Cladding - Zero Aquarium Glass!)
  // =========================================================================
  // Left Front Wing (Living Room Exterior): Solid Travertine Stone Wall + Cedar Accent
  addBox(4.2, 3.75, 0.36, -4.0, 1.875, 10.05, matTravertine, { tile: 1.6 });
  addBox(1.2, 3.75, 0.38, -1.7, 1.875, 10.05, matCedarSiding, { tile: 1.8 });

  // Right Front Wing (Kitchen Exterior): Solid Travertine Stone Wall + Cedar Accent
  addBox(1.2, 3.75, 0.38, 0.2, 1.875, 10.05, matCedarSiding, { tile: 1.8 });
  addBox(5.2, 3.75, 0.36, 3.8, 1.875, 10.05, matTravertine, { tile: 1.6 });

  // Recessed Front Entry Vestibule + Oversized Smoked Walnut Pivot Door
  addDoorCasing(-0.75, 0.0, 10.05, 2.1, 3.5, 0.42, true);
  addBox(2.2, 0.26, 0.38, -0.75, 3.55, 10.05, matTravertine, { tile: 1.5 });

  // Pivot Door (hinged at -1.62, swinging smoothly inward on approach)
  const pivotDoor = new THREE.Group();
  pivotDoor.position.set(-1.62, 0.0, 10.05);
  const doorSlabGeo = regGeo(scaleBoxUVs(new THREE.BoxGeometry(1.74, 3.35, 0.095), 1.74, 3.35, 0.095, 1.5));
  const doorSlab = new THREE.Mesh(doorSlabGeo, matWalnut);
  doorSlab.position.set(0.87, 1.68, 0);
  doorSlab.castShadow = true;
  doorSlab.receiveShadow = true;
  // Brushed brass vertical pull bar
  const pullGeo = regGeo(new THREE.CylinderGeometry(0.016, 0.016, 1.65, 14));
  const pullFront = new THREE.Mesh(pullGeo, matWarmBrass);
  pullFront.position.set(1.56, 1.45, 0.075);
  const pullBack = new THREE.Mesh(pullGeo, matWarmBrass);
  pullBack.position.set(1.56, 1.45, -0.075);
  pivotDoor.add(doorSlab, pullFront, pullBack);
  scene.add(pivotDoor);

  // Upper Level Cantilevered Architectural Volume (Travertine + Cedar Louvers + Dusk Privacy Glass)
  addBox(13.8, 0.42, 22.8, 0.4, 3.84, -0.3, matTravertine, { tile: 1.8 });
  addBox(13.8, 0.36, 1.65, 0.4, 3.82, 10.75, matWalnut, { tile: 1.6 });
  for (const lx of [-4.2, -2.0, -0.75, 1.4, 3.6, 5.4]) {
    addCeilingDownlight(lx, 3.65, 10.85);
  }
  // Upper Front Solid Stone Pillars & Overhang
  addBox(4.2, 3.65, 0.42, -4.4, 5.65, 10.9, matTravertine, { tile: 1.8 });
  addBox(4.2, 3.65, 0.42, 5.2, 5.65, 10.9, matTravertine, { tile: 1.8 });
  addBox(14.0, 0.44, 23.0, 0.4, 7.62, -0.3, matTravertine, { tile: 2.0 });
  addBox(14.1, 0.08, 23.1, 0.4, 7.86, -0.3, matSteelFrame);
  // Center upper ribbon window: heavily mirrored dusk glass (reflects sunset sky, zero fishbowl rooms!)
  addGlassFacade(-2.3, 10.88, 3.1, 10.88, 4.02, 3.4, 4, -1, true);

  // =========================================================================
  // 1. GROUND FLOOR ENCLOSURE & INTERIOR ROOM VOLUMES
  // =========================================================================
  // Main ground floor: warm herringbone parquet
  addBox(12.6, 0.14, 21.8, 0.4, -0.07, -0.7, matHerringboneFloor, { tile: 1.8, castShadow: false });
  // Ceiling soffits
  addBox(12.8, 0.32, 21.6, 0.4, 3.8, -0.6, matCeilingSoffit, { tile: 2.4 });
  addBox(7.5, 0.32, 6.2, -2.15, 3.8, -14.5, matCeilingSoffit, { tile: 2.4 });

  // Solid East Exterior Wall
  addBox(0.28, 3.65, 22.0, 6.6, 1.825, -0.8, matLimewash, { tile: 2.4 });
  addBaseboard(0.05, 21.6, 6.44, 0, -0.8);
  // West Courtyard Glass Wall looking onto private courtyard garden & drapes
  addGlassFacade(-5.8, 10.0, -5.8, -11.5, 0, 3.65, 8);

  // =========================================================================
  // STOP 01 — LIVING SALON (West Wing: x: -5.6..+0.4, z: +1.0..+9.4)
  // =========================================================================
  addCeilingCoffer(-2.7, 3.65, 5.2, 5.8, 8.0, 3);

  // North Fireplace Hearth Wall (Limewash with Dark Oak Media Display Niche)
  addBox(5.6, 3.65, 0.28, -3.0, 1.825, 0.85, matLimewash, { tile: 2.2 });
  addBaseboard(5.6, 0.05, -3.0, 0, 1.02);

  // Floating Travertine Hearth Ledge & Linear Fireplace
  addBox(5.2, 0.26, 0.54, -3.0, 0.13, 1.15, matTravertine, { tile: 1.4, rounded: 0.015 });
  addBox(2.2, 0.32, 0.06, -3.0, 0.72, 1.01, matSteelFrame);
  addBox(1.9, 0.04, 0.05, -3.0, 0.62, 1.02, matWarmLed, { castShadow: false });
  addShadowAO(-3.0, 0.003, 1.18, 5.4, 0.65, 0, 0.8);
  addArt(-3.0, 2.08, 1.02, 1.85, 1.22, 0, tex.artLivingMap);

  // Living Room Low Architectural Floating Credenza / Room Transition
  // (REPLACES the ugly vertical bars with an elegant, modern architectural low console!)
  addBox(0.48, 0.74, 3.6, 0.45, 0.37, 4.8, matWalnut, { tile: 1.4, rounded: 0.015 });
  addBox(0.52, 0.06, 3.64, 0.45, 0.77, 4.8, matTravertine, { tile: 1.2, rounded: 0.015 });
  addShadowAO(0.45, 0.003, 4.8, 0.65, 3.8, 0, 0.85);
  placeModel("ceramic_vase_01", 0.45, 0.8, 4.2, { scale: 0.95, rotY: 0.4 });
  placeModel("wooden_bowl_01", 0.45, 0.8, 5.2, { scale: 1.0 });

  // Conversation Pit / Furnishings
  addBox(4.2, 0.024, 3.6, -2.7, 0.012, 5.0, matWoolRug, { tile: 1.8, castShadow: false });
  addShadowAO(-2.7, 0.004, 5.0, 4.4, 3.8, 0, 0.48);

  placeModel("sofa_02", -2.8, 0.024, 3.9, { scale: 1.28, rotY: 0.0, tintHex: 0xf0e6d6 });
  placeModel("modern_coffee_table_02", -2.7, 0.024, 5.5, { scale: 1.05, rotY: 0.2 });
  placeModel("mid_century_lounge_chair", -1.05, 0.024, 5.65, { scale: 0.92, rotY: -2.45 });
  placeModel("Ottoman_01", -1.55, 0.024, 5.15, { scale: 0.72, rotY: -2.45, tintHex: 0xd4b290 });
  placeModel("modern_wooden_cabinet", -3.0, 0.26, 1.28, { scale: 0.95, rotY: 0 });
  placeModel("ceramic_vase_02", -2.45, 0.41, 5.4, { scale: 1.05, rotY: 0.5 });
  // Curated stacked coffee-table books on credenza
  addBox(0.32, 0.032, 0.24, -2.6, 0.925, 1.28, matDarkPlaster, { castShadow: false });
  addBox(0.28, 0.028, 0.21, -2.6, 0.955, 1.28, matBoucle, { castShadow: false, rotY: 0.08 });
  placeModel("desk_lamp_arm_01", -2.05, 0.91, 1.28, {
    scale: 0.85,
    rotY: -0.45,
    emissiveHex: 0xffcb88,
    emissiveIntensity: 1.2,
  });
  placeModel("pachira_aquatica_01", -4.9, 0.0, 2.2, { targetHeight: 2.5, rotY: 0.9 });
  addDrapedCurtain(-5.58, 0.0, 1.4, 2.4, 3.54);

  // Soft living & kitchen warm ambient fill point light
  const groundWarmFill = new THREE.PointLight(0xffd5a0, 4.5, 18, 1.4);
  groundWarmFill.position.set(0.2, 3.1, 4.4);
  scene.add(groundWarmFill);

  // =========================================================================
  // STOP 02 — THE TRAVERTINE KITCHEN (East Wing: x: +0.4..+6.5, z: -1.8..+9.6)
  // =========================================================================
  addCeilingCoffer(3.6, 3.65, 4.0, 5.2, 10.4, 0);

  // North kitchen wall with doorway casing
  addBox(3.55, 3.65, 0.28, 4.75, 1.825, -1.65, matLimewash, { tile: 2.2 });
  addBox(1.9, 0.95, 0.28, 2.05, 3.175, -1.65, matLimewash, { tile: 2.0 });
  addDoorCasing(2.05, 0.0, -1.65, 1.9, 2.72, 0.28, true);
  addBaseboard(3.55, 0.05, 4.75, 0, -1.49);

  // East Wall Tall Walnut Pantry Joinery + Flush Reveals
  addBox(0.68, 3.45, 1.6, 6.12, 1.725, 6.35, matWalnut, { tile: 1.6 });
  addBox(0.025, 3.4, 0.02, 5.77, 1.7, 6.35, matWarmBrass, { castShadow: false });
  addBox(0.68, 3.45, 1.6, 6.12, 1.725, 1.15, matWalnut, { tile: 1.6 });
  addBox(0.025, 3.4, 0.02, 5.77, 1.7, 1.15, matWarmBrass, { castShadow: false });

  // Cooking Back Counter + Charcoal Splashback + Warm LED Cove
  addBox(0.68, 0.88, 3.6, 6.12, 0.44, 3.75, matWalnut, { tile: 1.6 });
  addBox(0.72, 0.06, 3.64, 6.1, 0.91, 3.75, matTravertine, { tile: 1.3 });
  addBox(0.06, 1.48, 3.6, 6.42, 1.66, 3.75, matTravertine, { tile: 1.4 });
  addBox(0.52, 0.015, 0.92, 6.08, 0.945, 3.75, matSteelFrame);
  addBox(0.62, 1.25, 2.35, 6.15, 3.02, 3.75, matDarkPlaster, { tile: 1.5 });
  addBox(0.06, 0.02, 2.1, 6.08, 2.39, 3.75, matWarmLed, { castShadow: false });

  // Monolithic Waterfall Travertine Island
  addShadowAO(3.5, 0.004, 3.9, 1.55, 3.4, 0, 0.95);
  addBox(0.92, 0.09, 2.8, 3.5, 0.045, 3.9, matSteelFrame);
  addBox(0.98, 0.78, 2.88, 3.5, 0.48, 3.9, matWalnut, { tile: 1.5 });
  // Waterfall stone ends and top counter
  addBox(1.15, 0.09, 3.12, 3.5, 0.91, 3.9, matTravertine, { tile: 1.4, rounded: 0.015 });
  addBox(1.15, 0.91, 0.09, 3.5, 0.455, 5.46, matTravertine, { tile: 1.4, rounded: 0.015 });
  addBox(1.15, 0.91, 0.09, 3.5, 0.455, 2.34, matTravertine, { tile: 1.4, rounded: 0.015 });

  // Minimalist Gooseneck Brass Faucet
  const faucet = new THREE.Mesh(
    regGeo(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(3.8, 0.95, 4.3),
          new THREE.Vector3(3.8, 1.24, 4.3),
          new THREE.Vector3(3.7, 1.32, 4.3),
          new THREE.Vector3(3.62, 1.24, 4.3),
        ]),
        18,
        0.014,
        10,
        false,
      ),
    ),
    matWarmBrass,
  );
  faucet.castShadow = true;
  scene.add(faucet);

  placeModel("ceramic_vase_02", 3.4, 0.955, 3.4, { scale: 1.05, rotY: 0.4 });
  placeModel("wooden_bowl_01", 3.48, 0.955, 3.85, { scale: 1.1 });

  for (let i = 0; i < 3; i++) {
    placeModel("bar_chair_round_01", 2.68, 0.0, 2.95 + i * 0.95, { scale: 0.95, rotY: Math.PI / 2 });
  }

  // Modern twin minimalist brass ceiling lamps
  placeModel("modern_ceiling_lamp_01", 3.5, 2.68, 3.25, {
    scale: 0.95,
    emissiveHex: 0xffcb88,
    emissiveIntensity: 1.4,
    shadowAO: false,
  });
  placeModel("modern_ceiling_lamp_01", 3.5, 2.68, 4.55, {
    scale: 0.95,
    emissiveHex: 0xffcb88,
    emissiveIntensity: 1.4,
    shadowAO: false,
  });

  // =========================================================================
  // STOP 03 — THE DUSK DINING ROOM (North Atrium: x: -5.6..+1.5, z: -3.5..-11.2)
  // (Intimate, atmospheric dining space matching Brunst room-dining.webp!)
  // =========================================================================
  addCeilingCoffer(-2.0, 3.65, -7.2, 7.2, 7.6, 4);

  // South Moody Charcoal Wall + Walnut Credenza
  addBox(7.2, 3.65, 0.28, -2.1, 1.825, -11.35, matDarkPlaster, { tile: 2.2 });
  addBaseboard(7.2, 0.05, -2.1, 0, -11.18);
  addBox(2.2, 3.65, 0.28, 5.5, 1.825, -11.35, matLimewash, { tile: 2.2 });
  addBox(3.4, 0.85, 0.28, 2.75, 3.225, -11.35, matLimewash, { tile: 2.0 });
  addDoorCasing(2.8, 0.0, -11.35, 3.2, 2.8, 0.28, true);

  placeModel("modern_wooden_cabinet", -2.1, 0.0, -10.82, { scale: 0.96, rotY: 0 });
  placeModel("ceramic_vase_01", -1.4, 0.65, -10.82, { scale: 1.15 });
  addArt(-2.1, 2.05, -11.18, 1.9, 1.25, 0, tex.artDiningMap);

  // Dedicated Dining Wool Area Rug
  addBox(4.2, 0.022, 4.0, -2.0, 0.011, -7.25, matWoolRug, { tile: 1.8, castShadow: false });
  addShadowAO(-2.0, 0.003, -7.25, 4.35, 4.15, 0, 0.45);

  // Round Solid Walnut Dining Table
  addShadowAO(-2.0, 0.025, -7.25, 2.5, 2.5, 0, 0.95);
  const tableTop = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(1.08, 1.05, 0.055, 48)), matWalnut);
  tableTop.position.set(-2.0, 0.76, -7.25);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  scene.add(tableTop);
  const tablePedestal = new THREE.Mesh(
    regGeo(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.46, 0),
          new THREE.Vector2(0.42, 0.06),
          new THREE.Vector2(0.28, 0.32),
          new THREE.Vector2(0.32, 0.72),
        ],
        32,
      ),
    ),
    matWalnut,
  );
  tablePedestal.position.set(-2.0, 0.022, -7.25);
  tablePedestal.castShadow = true;
  scene.add(tablePedestal);

  // 6 Elegant Dining Chairs & Table Settings
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.35;
    const dist = 1.3;
    const cx = -2.0 + Math.cos(a) * dist;
    const cz = -7.25 + Math.sin(a) * dist;
    placeModel("dining_chair_02", cx, 0.022, cz, {
      scale: 0.94,
      rotY: Math.atan2(-2.0 - cx, -7.25 - cz),
      tintHex: 0xf2ebe0,
    });

    const pDist = 0.78;
    const px = -2.0 + Math.cos(a) * pDist;
    const pz = -7.25 + Math.sin(a) * pDist;
    const plate = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.125, 0.095, 0.018, 24)), matCeramicWhite);
    plate.position.set(px, 0.798, pz);
    plate.castShadow = true;
    scene.add(plate);

    const gX = -2.0 + Math.cos(a - 0.14) * 0.64;
    const gZ = -7.25 + Math.sin(a - 0.14) * 0.64;
    const goblet = new THREE.Mesh(
      regGeo(
        new THREE.LatheGeometry(
          [
            new THREE.Vector2(0.032, 0),
            new THREE.Vector2(0.005, 0.015),
            new THREE.Vector2(0.005, 0.085),
            new THREE.Vector2(0.042, 0.14),
            new THREE.Vector2(0.036, 0.19),
          ],
          16,
        ),
      ),
      matInteriorGlass,
    );
    goblet.position.set(gX, 0.79, gZ);
    scene.add(goblet);
  }

  // Brass Candelabra with warm candle glow
  placeModel("brass_candleholders", -2.0, 0.788, -7.25, {
    scale: 0.58,
    rotY: 0.4,
    emissiveHex: 0xffae48,
    emissiveIntensity: 2.0,
    shadowAO: [0.35, 0.35],
  });

  // Pleated Paper Pendant Lantern (matching Brunst dining aesthetic!)
  const lantern = new THREE.Mesh(
    regGeo(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.01, 0.42),
          new THREE.Vector2(0.14, 0.38),
          new THREE.Vector2(0.38, 0.18),
          new THREE.Vector2(0.44, 0.0),
          new THREE.Vector2(0.34, -0.14),
          new THREE.Vector2(0.14, -0.18),
          new THREE.Vector2(0.08, -0.16),
        ],
        40,
      ),
    ),
    matPleatedPaper,
  );
  lantern.position.set(-2.0, 2.08, -7.25);
  lantern.castShadow = true;
  scene.add(lantern);
  addBox(0.012, 1.25, 0.012, -2.0, 3.02, -7.25, matSteelFrame, { castShadow: false });

  // Warm, intimate dining illumination
  const diningGlow = new THREE.PointLight(0xffcf94, 4.2, 11, 1.4);
  diningGlow.position.set(-2.0, 2.1, -7.25);
  scene.add(diningGlow);

  addDrapedCurtain(-5.58, 0.0, -10.2, 2.2, 3.54);

  // =========================================================================
  // FLOATING TRAVERTINE STAIRWELL CORE (x: +1.6..+6.4, z: -11.4..-17.6)
  // =========================================================================
  addBox(4.8, 0.14, 6.4, 4.1, -0.07, -14.5, matConcrete, { tile: 1.8 });
  addBox(0.26, 7.5, 6.4, 6.48, 3.75, -14.5, matLimewash, { tile: 2.2 });
  addBox(0.26, 7.5, 6.4, 1.55, 3.75, -14.5, matLimewash, { tile: 2.2 });
  addBox(5.1, 3.75, 0.26, 4.0, 1.875, -17.65, matLimewash, { tile: 2.2 });

  // Floating Travertine Steps with Integrated Warm Tread Lights
  for (let s = 0; s < 14; s++) {
    const ty = 0.28 + s * 0.265;
    const tz = -12.15 - s * 0.34;
    addBox(2.2, 0.085, 0.33, 5.15, ty, tz, matTravertine, { tile: 1.3, rounded: 0.01 });
    addBox(2.05, 0.01, 0.015, 5.15, ty - 0.045, tz + 0.12, matWarmLed, { castShadow: false });
  }
  const railGlass = new THREE.Mesh(regGeo(new THREE.BoxGeometry(0.03, 1.05, 5.1)), matInteriorGlass);
  railGlass.position.set(4.08, 2.35, -14.4);
  railGlass.rotation.x = 0.65;
  scene.add(railGlass);

  // =========================================================================
  // UPPER LEVEL ENCLOSURE (y = 4.0 -> 7.45)
  // =========================================================================
  const upperY = 3.95;
  const upperCeilY = 7.42;

  addBox(7.4, 0.14, 20.2, -2.15, upperY - 0.07, -25.7, matHerringboneFloor, { tile: 1.8, castShadow: false });
  addBox(5.2, 0.14, 19.4, 4.05, upperY - 0.07, -26.1, matHerringboneFloor, { tile: 1.8, castShadow: false });
  const landingGlass = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(2.6, 1.02)), matInteriorGlass);
  landingGlass.position.set(5.1, upperY + 0.51, -16.45);
  scene.add(landingGlass);
  addBox(2.65, 0.04, 0.05, 5.1, upperY + 1.03, -16.45, matBronze);

  // Ceiling Volumes
  addBox(9.2, 0.34, 24.4, -1.2, upperCeilY + 0.16, -24.2, matCeilingSoffit, { tile: 2.4 });
  addBox(3.4, 0.34, 9.8, 5.1, upperCeilY + 0.16, -16.9, matCeilingSoffit, { tile: 2.4 });
  addBox(3.4, 0.34, 12.2, 5.1, upperCeilY + 0.16, -30.1, matCeilingSoffit, { tile: 2.4 });
  addBox(1.4, 0.34, 2.2, 6.1, upperCeilY + 0.16, -22.9, matCeilingSoffit, { tile: 2.4 });

  addBox(0.26, 3.55, 24.5, 6.58, upperY + 1.775, -23.8, matLimewash, { tile: 2.4 });
  addGlassFacade(-5.8, -11.6, -5.8, -35.8, upperY, 3.5, 8);
  addGlassFacade(-5.8, -11.6, 1.6, -11.6, upperY, 3.5, 3);

  // =========================================================================
  // STOP 04 — PRIMARY BEDROOM SUITE (x: -5.6..+1.3, z: -16.5..-25.2)
  // (Intimate luxury bedroom sanctuary matching Brunst room-bedroom.webp!)
  // =========================================================================
  addCeilingCoffer(-2.2, upperCeilY, -20.5, 6.8, 9.0, 0);

  // Divider walls & walnut doorways
  addBox(0.26, 3.5, 2.2, 1.45, upperY + 1.75, -16.5, matLimewash, { tile: 2.2 });
  addBox(0.26, 3.5, 1.0, 1.45, upperY + 1.75, -20.2, matLimewash, { tile: 2.2 });
  addBox(0.26, 3.5, 2.4, 1.45, upperY + 1.75, -24.0, matLimewash, { tile: 2.2 });
  addBox(0.26, 0.85, 5.4, 1.45, upperY + 3.075, -20.2, matLimewash, { tile: 2.2 });
  addDoorCasing(1.45, upperY, -18.65, 2.1, 2.65, 0.26, false);
  addDoorCasing(1.45, upperY, -21.75, 2.1, 2.65, 0.26, false);

  // South Headboard Feature Wall
  addBox(7.2, 3.5, 0.28, -2.2, upperY + 1.75, -25.2, matLimewash, { tile: 2.2 });
  addBaseboard(7.0, 0.05, -2.2, upperY, -25.04);

  // Full-width Architectural Headboard Wall in Smoked Walnut with Halo LED Glow
  addBox(4.4, 1.8, 0.08, -2.35, upperY + 0.9, -24.95, matWalnut, { tile: 1.5, rounded: 0.015 });
  addBox(4.3, 0.015, 0.02, -2.35, upperY + 1.81, -24.94, matWarmLed, { castShadow: false });

  // King Platform Bed & Bouclé Layering
  addBox(4.2, 0.022, 3.6, -2.35, upperY + 0.011, -22.3, matWoolRug, { tile: 1.8, castShadow: false });
  addShadowAO(-2.35, upperY + 0.004, -22.3, 4.4, 3.8, 0, 0.45);

  addShadowAO(-2.35, upperY + 0.026, -23.1, 2.5, 2.5, 0, 0.95);
  addBox(2.26, 0.24, 2.22, -2.35, upperY + 0.14, -23.2, matWalnut, { rounded: 0.02, tile: 1.5 });
  addBox(2.38, 0.94, 0.14, -2.35, upperY + 0.62, -24.42, matWalnut, { rounded: 0.02, tile: 1.5 });
  addBox(1.06, 0.62, 0.08, -2.9, upperY + 0.72, -24.32, matBoucle, { rounded: 0.04 });
  addBox(1.06, 0.62, 0.08, -1.8, upperY + 0.72, -24.32, matBoucle, { rounded: 0.04 });
  addBox(1.9, 0.24, 2.02, -2.35, upperY + 0.37, -23.2, matBoucle, { rounded: 0.065 });

  // Soft textured duvet with realistic edge droop
  const duvetGeo = regGeo(new THREE.PlaneGeometry(2.14, 1.7, 44, 36));
  const dPos = duvetGeo.attributes["position"] as THREE.BufferAttribute;
  for (let i = 0; i < dPos.count; i++) {
    const px = dPos.getX(i);
    const py = dPos.getY(i);
    const edgeX = Math.max(0, Math.abs(px) - 0.9);
    const edgeY = Math.max(0, -py - 0.66);
    const droop = -(edgeX * edgeX * 3.8 + edgeY * edgeY * 3.2);
    const ripple = Math.sin(px * 9) * Math.cos(py * 7) * 0.012;
    dPos.setZ(i, droop + ripple);
  }
  duvetGeo.computeVertexNormals();
  const duvetMesh = new THREE.Mesh(duvetGeo, matBoucle);
  duvetMesh.rotation.x = -Math.PI / 2;
  duvetMesh.position.set(-2.35, upperY + 0.515, -22.92);
  duvetMesh.castShadow = true;
  duvetMesh.receiveShadow = true;
  scene.add(duvetMesh);
  addBox(1.98, 0.04, 0.52, -2.35, upperY + 0.535, -22.38, matRustLinen, { rounded: 0.025 });

  // Pillows
  for (const px of [-2.82, -1.88]) {
    addBox(0.74, 0.15, 0.42, px, upperY + 0.55, -23.98, matBoucle, { rounded: 0.06 });
    addBox(0.6, 0.14, 0.26, px, upperY + 0.56, -23.66, matRustLinen, { rounded: 0.05 });
  }

  // Floating Bedside Tables & Reading Sconces
  placeModel("coffee_table_round_01", -3.98, upperY, -24.15, { scale: 0.46, tintHex: 0xd9cbb9 });
  placeModel("coffee_table_round_01", -0.72, upperY, -24.15, { scale: 0.46, tintHex: 0xd9cbb9 });
  placeModel("desk_lamp_arm_01", -3.98, upperY + 0.225, -24.15, {
    scale: 0.68,
    rotY: 0.65,
    emissiveHex: 0xffcb88,
    emissiveIntensity: 1.2,
  });
  placeModel("ceramic_vase_02", -0.72, upperY + 0.225, -24.15, { scale: 0.85 });

  // Lounge Armchair & Ottoman in bedroom corner
  placeModel("modern_arm_chair_01", -4.35, upperY, -20.8, { scale: 0.9, rotY: 1.05 });
  placeModel("Ottoman_01", -2.35, upperY + 0.022, -21.45, { scale: 0.85, rotY: 0 });
  placeModel("pachira_aquatica_01", -4.95, upperY, -23.85, { targetHeight: 2.3, rotY: 0.6 });

  // Leaned Bronze Full-Length Dressing Mirror
  addBox(0.88, 2.15, 0.04, 1.24, upperY + 1.08, -24.05, matBronze, { rotY: -Math.PI / 2 });
  addBox(0.8, 2.07, 0.02, 1.21, upperY + 1.08, -24.05, matPrivacyMirrorGlass, { rotY: -Math.PI / 2 });

  addArt(-2.35, upperY + 2.1, -25.04, 1.5, 1.05, 0, tex.artBedroomMap);
  addDrapedCurtain(-5.58, upperY, -24.4, 2.2, 3.42);

  // =========================================================================
  // STOP 05 — SKYLIT SPA BATH (x: +1.5..+6.4, z: -16.5..-25.2)
  // (Solid architectural spa bath matching Brunst room-bath.webp! NO plastic cones!)
  // =========================================================================
  // Honed Concrete/Microcement Floor
  addBox(4.95, 0.04, 7.6, 4.05, upperY + 0.01, -21.4, matConcrete, { tile: 1.6, castShadow: false });

  // Solid microcement partition walls enclosing the bathroom
  addBox(2.9, 3.5, 0.28, 5.15, upperY + 1.75, -25.2, matLimewash, { tile: 2.2 });
  addBox(2.2, 0.85, 0.28, 2.6, upperY + 3.075, -25.2, matLimewash, { tile: 2.0 });
  addDoorCasing(2.6, upperY, -25.2, 2.1, 2.65, 0.28, true);

  // Deep Architectural Skylight Well
  addBox(2.1, 0.55, 0.14, 4.4, upperCeilY + 0.38, -21.8, matLimewash);
  addBox(2.1, 0.55, 0.14, 4.4, upperCeilY + 0.38, -24.0, matLimewash);
  addBox(0.14, 0.55, 2.2, 3.35, upperCeilY + 0.38, -22.9, matLimewash);
  addBox(0.14, 0.55, 2.2, 5.45, upperCeilY + 0.38, -22.9, matLimewash);
  const skyPanel = new THREE.Mesh(
    regGeo(new THREE.PlaneGeometry(1.95, 2.1)),
    regMat(new THREE.MeshBasicMaterial({ color: 0xfff0db })),
  );
  skyPanel.rotation.x = Math.PI / 2;
  skyPanel.position.set(4.4, upperCeilY + 0.62, -22.9);
  scene.add(skyPanel);

  // Soft upper suite warm light covering bedroom, skylight tub & study
  const upperSuiteGlow = new THREE.PointLight(0xffdfb8, 4.4, 22, 1.3);
  upperSuiteGlow.position.set(1.5, upperCeilY - 0.5, -24.5);
  scene.add(upperSuiteGlow);

  // Honed River Stone Floor Pad beneath the Tub
  addBox(2.4, 0.02, 1.6, 4.55, upperY + 0.02, -22.95, matSlateTiles, { tile: 1.2, rounded: 0.015 });
  addShadowAO(4.55, upperY + 0.032, -22.95, 2.2, 1.4, 0.18, 0.95);

  // Freestanding Carved Roman Travertine Oval Soaking Tub
  const tubGroup = new THREE.Group();
  tubGroup.position.set(4.55, upperY + 0.03, -22.95);
  tubGroup.rotation.y = 0.18;
  const tubMesh = new THREE.Mesh(
    regGeo(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.0, 0.0),
          new THREE.Vector2(0.46, 0.0),
          new THREE.Vector2(0.56, 0.18),
          new THREE.Vector2(0.62, 0.56),
          new THREE.Vector2(0.56, 0.58),
          new THREE.Vector2(0.52, 0.14),
          new THREE.Vector2(0.0, 0.12),
        ],
        56,
      ),
    ),
    matTravertine,
  );
  tubMesh.scale.set(1.42, 1.0, 0.88);
  tubMesh.castShadow = true;
  tubMesh.receiveShadow = true;
  tubGroup.add(tubMesh);

  const bathWater = new THREE.Mesh(regGeo(new THREE.CircleGeometry(0.54, 40)), matStillWater);
  bathWater.rotation.x = -Math.PI / 2;
  bathWater.scale.set(1.4, 0.86, 1);
  bathWater.position.y = 0.46;
  tubGroup.add(bathWater);
  scene.add(tubGroup);

  // Brushed Brass Freestanding Tub Filler
  const mixer = new THREE.Group();
  mixer.position.set(5.48, upperY + 0.03, -23.2);
  addShadowAO(5.48, upperY + 0.032, -23.2, 0.34, 0.34, 0, 0.75);
  const stand = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.02, 0.03, 0.88, 16)), matWarmBrass);
  stand.position.y = 0.44;
  const spout = new THREE.Mesh(
    regGeo(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.86, 0),
          new THREE.Vector3(-0.08, 0.94, 0.04),
          new THREE.Vector3(-0.22, 0.9, 0.08),
        ]),
        12,
        0.014,
        8,
        false,
      ),
    ),
    matWarmBrass,
  );
  mixer.add(stand, spout);
  scene.add(mixer);

  // Floating Marble Vanity with Backlit Mirror
  addBox(0.56, 0.32, 2.0, 6.18, upperY + 0.72, -19.8, matWalnut, { tile: 1.5 });
  addBox(0.6, 0.06, 2.04, 6.16, upperY + 0.91, -19.8, matTravertine, { tile: 1.3, rounded: 0.01 });
  addBox(0.03, 1.15, 1.1, 6.42, upperY + 1.85, -19.8, matWarmBrass, { castShadow: false });
  addBox(0.02, 1.09, 1.04, 6.41, upperY + 1.85, -19.8, matPrivacyMirrorGlass, { castShadow: false });
  addBox(0.01, 1.12, 1.06, 6.44, upperY + 1.85, -19.8, matWarmLed, { castShadow: false });

  placeModel("coffee_table_round_01", 3.45, upperY + 0.03, -22.25, { scale: 0.36 });
  addBox(1.15, 0.018, 0.72, 4.45, upperY + 0.038, -21.85, matWoolRug, { tile: 1.3, castShadow: false });
  placeModel("potted_plant_02", 5.65, upperY + 0.03, -24.25, { targetHeight: 1.1, rotY: -0.9 });

  // =========================================================================
  // STOP 06 — PRIVATE LIBRARY STUDY (x: -1.2..+6.4, z: -25.5..-35.5)
  // (Atmospheric study matching Brunst room-library.webp!)
  // =========================================================================
  addCeilingCoffer(2.5, upperCeilY, -30.5, 7.6, 9.6, 4);

  // Enclosing walls
  addBox(0.24, 3.5, 9.8, -1.45, upperY + 1.75, -30.5, matDarkPlaster, { tile: 2.2 });
  addBox(0.26, 3.5, 9.8, 6.45, upperY + 1.75, -30.5, matDarkPlaster, { tile: 2.2 });
  addBox(3.4, 3.5, 0.24, 0.1, upperY + 1.75, -35.8, matLimewash, { tile: 2.2 });
  addGlassFacade(1.8, -35.8, 6.4, -35.8, upperY, 3.5, 3, 1);

  // Floor-to-Ceiling Smoked Walnut Millwork Bookcase (5 bays)
  const shelfBays = 5;
  const shelfZStart = -26.8;
  const bayWidth = 1.44;
  addBox(0.46, 3.4, bayWidth * shelfBays + 0.12, 6.18, upperY + 1.7, shelfZStart - bayWidth * 2.5, matWalnut, {
    tile: 1.8,
  });
  for (let b = 0; b <= shelfBays; b++) {
    addBox(0.48, 3.4, 0.06, 6.15, upperY + 1.7, shelfZStart - b * bayWidth, matWalnut, { tile: 1.6 });
  }
  // Single InstancedMesh for all curated art-book volumes across all 5 bays (1 draw call instead of 300!)
  const bookGeo = regGeo(new THREE.BoxGeometry(0.22, 0.28, 0.045));
  const bookMat = regMat(new THREE.MeshStandardMaterial({ roughness: 0.72, metalness: 0.04 }));
  const booksPerRow = 10;
  const totalBookInstances = shelfBays * 3 * booksPerRow;
  const bookInst = new THREE.InstancedMesh(bookGeo, bookMat, totalBookInstances);
  bookInst.castShadow = false;
  bookInst.receiveShadow = true;
  const bookPalette = [0x2a2623, 0xd8cfc2, 0x70513a, 0x43484c, 0xa88f76, 0x1e1b18];
  const bookDummy = new THREE.Object3D();
  const bookColor = new THREE.Color();
  let bIdx = 0;

  for (let lv = 0; lv < 5; lv++) {
    const sy = upperY + 0.56 + lv * 0.62;
    addBox(0.44, 0.04, bayWidth * shelfBays, 6.14, sy, shelfZStart - bayWidth * 2.5, matWalnut, { tile: 1.6 });
    if (lv >= 1 && lv <= 3) {
      // Warm integrated LED linear shelf glow
      addBox(0.02, 0.008, bayWidth * shelfBays - 0.3, 5.98, sy - 0.022, shelfZStart - bayWidth * 2.5, matWarmLed, {
        castShadow: false,
      });
    }
    for (let b = 0; b < shelfBays; b++) {
      const zBay = shelfZStart - b * bayWidth - 0.72;
      if (lv >= 1 && lv <= 3) {
        for (let k = 0; k < booksPerRow; k++) {
          const hScale = 0.85 + ((b * 7 + k * 3 + lv) % 4) * 0.08;
          bookDummy.position.set(6.1, sy + 0.02 + 0.14 * hScale, zBay - 0.52 + k * 0.056);
          bookDummy.rotation.set(0, 0, k === booksPerRow - 1 ? 0.12 : 0);
          bookDummy.scale.set(1, hScale, 0.9 + (k % 3) * 0.15);
          bookDummy.updateMatrix();
          bookInst.setMatrixAt(bIdx, bookDummy.matrix);
          bookColor.setHex(bookPalette[(b + lv * 2 + k) % bookPalette.length]!);
          bookInst.setColorAt(bIdx, bookColor);
          bIdx += 1;
        }
        if ((b + lv) % 2 === 0) {
          placeModel("ceramic_vase_01", 6.06, sy + 0.02, zBay + 0.32, { scale: 0.72, shadowAO: false });
        } else {
          placeModel("wooden_bowl_01", 6.06, sy + 0.02, zBay + 0.32, { scale: 0.75, shadowAO: false });
        }
      }
    }
  }
  bookInst.instanceMatrix.needsUpdate = true;
  if (bookInst.instanceColor) bookInst.instanceColor.needsUpdate = true;
  scene.add(bookInst);

  // Study Seating Vignette: Leather Club Chair, Ottoman, Brass Reading Lamp, Wool Rug
  addBox(3.5, 0.02, 3.5, 3.1, upperY + 0.01, -30.6, matWoolRug, { tile: 1.8, castShadow: false });
  placeModel("mid_century_lounge_chair", 3.18, upperY + 0.02, -30.45, { scale: 0.96, rotY: -2.45 });
  placeModel("Ottoman_01", 2.48, upperY + 0.02, -31.18, { scale: 0.78, rotY: -2.45, tintHex: 0xa87551 });
  placeModel("coffee_table_round_01", 4.18, upperY + 0.02, -31.15, { scale: 0.56 });
  placeModel("desk_lamp_arm_01", 4.18, upperY + 0.295, -31.15, {
    scale: 0.72,
    rotY: -1.1,
    emissiveHex: 0xffcb88,
    emissiveIntensity: 1.3,
  });
  placeModel("potted_plant_02", 5.65, upperY, -34.7, { targetHeight: 0.95, rotY: 0.4 });

  // =========================================================================
  // STOP 07 — SKY BALCONY & SUNSET TERRACE (x: -5.8..+6.5, z: -35.8..-42.8)
  // =========================================================================
  addBox(12.6, 0.24, 7.2, 0.35, upperY - 0.12, -39.3, matTravertine, { tile: 1.6 });
  addBox(12.8, 0.26, 4.4, 0.35, upperCeilY + 0.12, -38.0, matTravertine, { tile: 1.8 });

  // Glass balustrade with bronze cap
  addBox(12.4, 0.04, 0.06, 0.35, upperY + 1.06, -42.75, matBronze);
  addBox(0.06, 0.04, 7.0, -5.82, upperY + 1.06, -39.25, matBronze);
  addBox(0.06, 0.04, 7.0, 6.52, upperY + 1.06, -39.25, matBronze);
  const balFront = new THREE.Mesh(regGeo(new THREE.PlaneGeometry(12.3, 1.04)), matInteriorGlass);
  balFront.position.set(0.35, upperY + 0.54, -42.75);
  scene.add(balFront);

  // Sculptural Stone Fire Pit with Glowing Embers
  placeModel("stone_fire_pit", 0.45, upperY, -39.85, { scale: 1.15, rotY: 0.3 });
  const emberMat = regMat(
    new THREE.MeshStandardMaterial({
      color: 0xff8c38,
      emissive: 0xff6218,
      emissiveIntensity: 1.5,
      roughness: 0.45,
    }),
  );
  const emberBed = new THREE.Mesh(regGeo(new THREE.CylinderGeometry(0.42, 0.46, 0.06, 24)), emberMat);
  emberBed.position.set(0.45, upperY + 0.24, -39.85);
  scene.add(emberBed);
  const hearthGlow = new THREE.PointLight(0xff8432, 2.8, 7.0, 1.6);
  hearthGlow.position.set(0.45, upperY + 0.65, -39.85);
  scene.add(hearthGlow);

  placeModel("modern_arm_chair_01", -1.9, upperY, -39.4, { scale: 1.02, rotY: 0.72, tintHex: 0xf0e6d6 });
  placeModel("modern_arm_chair_01", 2.75, upperY, -39.4, { scale: 1.02, rotY: -0.78, tintHex: 0xf0e6d6 });
  placeModel("coffee_table_round_01", 1.55, upperY, -38.65, { scale: 0.58 });
  placeModel("pachira_aquatica_01", -4.65, upperY, -41.4, { targetHeight: 2.3, rotY: 0.4 });
  placeModel("potted_plant_02", 5.2, upperY, -41.4, { targetHeight: 1.3, rotY: -0.7 });

  return {
    animatedCurtains,
    animatedWater,
    pivotDoor,
    emberMat,
    geometries,
    materials,
    textures,
  };
}
