import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

export type ModelId =
  | "sofa_02"
  | "mid_century_lounge_chair"
  | "modern_arm_chair_01"
  | "Ottoman_01"
  | "modern_coffee_table_01"
  | "modern_coffee_table_02"
  | "coffee_table_round_01"
  | "dining_chair_02"
  | "bar_chair_round_01"
  | "modern_wooden_cabinet"
  | "modern_ceiling_lamp_01"
  | "desk_lamp_arm_01"
  | "ceramic_vase_01"
  | "ceramic_vase_02"
  | "brass_candleholders"
  | "wooden_bowl_01"
  | "pachira_aquatica_01"
  | "potted_plant_02"
  | "stone_fire_pit";

export type PbrSetId =
  | "herringbone_parquet"
  | "smoked_walnut_veneer"
  | "marble_01"
  | "plastered_wall_04"
  | "smooth_concrete_floor"
  | "wool_boucle"
  | "poly_wool_herringbone"
  | "brown_leather"
  | "grass_ground"
  | "patterned_slate_tiles"
  | "brown_planks_04";

export interface LoadedPbrSet {
  diffuse: THREE.Texture;
  normal: THREE.Texture;
  roughness: THREE.Texture;
  ao: THREE.Texture;
}

export interface StudioAssets {
  envTexture: THREE.DataTexture;
  pbr: Record<PbrSetId, LoadedPbrSet>;
  models: Record<ModelId, THREE.Group>;
  textures: THREE.Texture[];
}

const MODEL_IDS: ModelId[] = [
  "sofa_02",
  "mid_century_lounge_chair",
  "modern_arm_chair_01",
  "Ottoman_01",
  "modern_coffee_table_01",
  "modern_coffee_table_02",
  "coffee_table_round_01",
  "dining_chair_02",
  "bar_chair_round_01",
  "modern_wooden_cabinet",
  "modern_ceiling_lamp_01",
  "desk_lamp_arm_01",
  "ceramic_vase_01",
  "ceramic_vase_02",
  "brass_candleholders",
  "wooden_bowl_01",
  "pachira_aquatica_01",
  "potted_plant_02",
  "stone_fire_pit",
];

const PBR_IDS: PbrSetId[] = [
  "herringbone_parquet",
  "smoked_walnut_veneer",
  "marble_01",
  "plastered_wall_04",
  "smooth_concrete_floor",
  "wool_boucle",
  "poly_wool_herringbone",
  "brown_leather",
  "grass_ground",
  "patterned_slate_tiles",
  "brown_planks_04",
];

/** Downsamples oversized 2K+ textures in-memory so GPU VRAM stays under ~250MB with zero PCIe thrashing. */
function fitTexture(tex: THREE.Texture, maxDim: number): THREE.Texture {
  const img = tex.image as { width?: number; height?: number } | undefined;
  if (!img || !img.width || !img.height || typeof document === "undefined") return tex;
  const maxSide = Math.max(img.width, img.height);
  if (maxSide <= maxDim) return tex;
  const scale = maxDim / maxSide;
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return tex;
  ctx.drawImage(img as CanvasImageSource, 0, 0, w, h);
  tex.image = canvas;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Asynchronously loads local 1K HDRI, photographed PBR texture sets (downsampled in-memory to 1K diffuse / 512px maps
 * to prevent VRAM thrashing), and CC0 glTF interior models with live loading percentage progress.
 */
export async function loadStudioAssets(
  maxAnisotropy: number,
  onProgress: (pct: number) => void,
  signal?: AbortSignal,
): Promise<StudioAssets> {
  const texLoader = new THREE.TextureLoader();
  const gltfLoader = new GLTFLoader();
  const hdrLoader = new HDRLoader();
  const textures: THREE.Texture[] = [];
  const anisotropy = Math.min(4, maxAnisotropy);

  const totalSteps = 1 + PBR_IDS.length * 4 + MODEL_IDS.length;
  let completed = 0;
  const tick = () => {
    completed += 1;
    onProgress(Math.min(100, Math.round((completed / totalSteps) * 100)));
  };

  const loadTex = (url: string, srgb: boolean, maxDim: number): Promise<THREE.Texture> =>
    new Promise((resolve, reject) => {
      texLoader.load(
        url,
        (tex) => {
          fitTexture(tex, maxDim);
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.anisotropy = anisotropy;
          if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
          textures.push(tex);
          tick();
          resolve(tex);
        },
        undefined,
        reject,
      );
    });

  const envPromise = new Promise<THREE.DataTexture>((resolve, reject) => {
    hdrLoader.load(
      "/3d/env_dusk_1k.hdr",
      (hdr) => {
        tick();
        resolve(hdr);
      },
      undefined,
      reject,
    );
  });

  const pbrEntries = await Promise.all(
    PBR_IDS.map(async (id) => {
      const [diffuse, normal, roughness, ao] = await Promise.all([
        loadTex(`/3d/textures/${id}/Diffuse.jpg`, true, 1024),
        loadTex(`/3d/textures/${id}/nor_gl.jpg`, false, 512),
        loadTex(`/3d/textures/${id}/Rough.jpg`, false, 512),
        loadTex(`/3d/textures/${id}/AO.jpg`, false, 512),
      ]);
      return [id, { diffuse, normal, roughness, ao }] as const;
    }),
  );

  if (signal?.aborted) {
    textures.forEach((t) => t.dispose());
    throw new DOMException("Aborted", "AbortError");
  }

  const modelEntries = await Promise.all(
    MODEL_IDS.map(
      (id) =>
        new Promise<readonly [ModelId, THREE.Group]>((resolve, reject) => {
          gltfLoader.load(
            `/3d/models/${id}/scene.gltf`,
            (gltf) => {
              gltf.scene.traverse((obj) => {
                if ((obj as THREE.Mesh).isMesh) {
                  const m = obj as THREE.Mesh;
                  m.castShadow = true;
                  m.receiveShadow = true;
                  const mats = Array.isArray(m.material) ? m.material : [m.material];
                  for (const mat of mats) {
                    const std = mat as THREE.MeshStandardMaterial;
                    if (std.map) fitTexture(std.map, 768);
                    if (std.normalMap) fitTexture(std.normalMap, 512);
                    if (std.roughnessMap) fitTexture(std.roughnessMap, 512);
                    if (std.aoMap) fitTexture(std.aoMap, 512);
                    if (std.metalnessMap) fitTexture(std.metalnessMap, 512);
                  }
                }
              });
              tick();
              resolve([id, gltf.scene] as const);
            },
            undefined,
            reject,
          );
        }),
    ),
  );

  const envTexture = await envPromise;
  const pbr = Object.fromEntries(pbrEntries) as Record<PbrSetId, LoadedPbrSet>;
  const models = Object.fromEntries(modelEntries) as Record<ModelId, THREE.Group>;

  return { envTexture, pbr, models, textures };
}
