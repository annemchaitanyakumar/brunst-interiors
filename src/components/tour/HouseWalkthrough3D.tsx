import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  evaluateWalkthroughCamera,
  getPivotDoorOpenAmount,
  TOUR_STOPS,
} from "@/data/tour-rooms";
import { prefersReducedMotion } from "@/lib/motion";
import { loadStudioAssets } from "./assetLoader";
import { createProceduralTextures } from "./proceduralTextures";
import { buildRealisticHouse, type BuildHouseResult } from "./houseRooms";

/**
 * Ultra-responsive Three.js architectural walkthrough.
 * Uses single-pass direct rendering with hardware MSAA, static shadow map caching,
 * instanced millwork props, and zero CPU per-frame geometry recalculation.
 */
export function HouseWalkthrough3D({
  progressRef,
  onStopChange,
  onWebGLUnsupported,
}: {
  progressRef: React.MutableRefObject<number>;
  onStopChange: (index: number) => void;
  onWebGLUnsupported: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const ac = new AbortController();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true,
      });
    } catch {
      onWebGLUnsupported();
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    // Native 1x CSS pixel fill with hardware MSAA guarantees crisp lines & 60 FPS across all laptops
    const dpr = Math.min(window.devicePixelRatio || 1, 1.0);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Cache static shadows instead of re-rendering millions of triangles every frame!
    renderer.shadowMap.autoUpdate = false;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgHex = 0x181513;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.0032);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 140);
    const first = TOUR_STOPS[0]!;
    camera.position.set(...first.cameraPos);
    camera.lookAt(...first.lookAt);

    // Lean 3-source Dusk Lighting Rig (fast fragment shader, rich contrast)
    const hemi = new THREE.HemisphereLight(0xffe6d0, 0x241c16, 0.55);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffd5a0, 2.3);
    sun.position.set(-22, 16, 14);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.02;
    sun.shadow.camera.near = 2;
    sun.shadow.camera.far = 92;
    sun.shadow.camera.left = -26;
    sun.shadow.camera.right = 26;
    sun.shadow.camera.top = 26;
    sun.shadow.camera.bottom = -26;
    scene.add(sun);

    const duskBounce = new THREE.DirectionalLight(0x9a6f4e, 0.42);
    duskBounce.position.set(16, 8, -42);
    scene.add(duskBounce);

    const pmrem = new THREE.PMREMGenerator(renderer);
    let envRT: THREE.WebGLRenderTarget | null = null;
    let house: BuildHouseResult | null = null;

    const reduceMotion = prefersReducedMotion();
    let smoothT = progressRef.current;
    let pointerX = 0;
    let pointerY = 0;
    let smoothPX = 0;
    let smoothPY = 0;
    let dragYaw = 0;
    let dragPitch = 0;
    let targetDragYaw = 0;
    let targetDragPitch = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let activeIdx = 0;
    let prevDoorAngle = -1;

    const onPointerDown = (e: PointerEvent) => {
      if (reduceMotion) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerUp = () => {
      dragging = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (dragging) {
        targetDragYaw = Math.max(-0.55, Math.min(0.55, targetDragYaw + (e.clientX - lastX) * 0.0022));
        targetDragPitch = Math.max(-0.28, Math.min(0.28, targetDragPitch + (e.clientY - lastY) * 0.0018));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const nextDpr = Math.min(window.devicePixelRatio || 1, 1.0);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(nextDpr);
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const camVec = new THREE.Vector3();
    const lookVec = new THREE.Vector3();
    const lookOffset = new THREE.Vector3();
    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const targetT = Math.min(1, Math.max(0, progressRef.current));

      if (reduceMotion) {
        smoothT = targetT;
      } else {
        // Snappy, zero-lag tracking of scroll position & mouse drag look
        smoothT += (targetT - smoothT) * 0.45;
        smoothPX += (pointerX - smoothPX) * 0.14;
        smoothPY += (pointerY - smoothPY) * 0.14;
        if (!dragging) {
          targetDragYaw *= 0.94;
          targetDragPitch *= 0.94;
        }
        dragYaw += (targetDragYaw - dragYaw) * 0.25;
        dragPitch += (targetDragPitch - dragPitch) * 0.25;
      }

      const chapterIdx = evaluateWalkthroughCamera(smoothT, camVec, lookVec);

      lookOffset.subVectors(lookVec, camVec);
      const lookDist = lookOffset.length() || 1;
      const horizAngle = Math.atan2(lookOffset.x, lookOffset.z) - dragYaw - smoothPX * 0.035;
      const vertAngle = Math.asin(Math.max(-0.95, Math.min(0.95, lookOffset.y / lookDist))) - dragPitch - smoothPY * 0.018;

      const finalLookX = camVec.x + Math.sin(horizAngle) * Math.cos(vertAngle) * lookDist;
      const finalLookY = camVec.y + Math.sin(vertAngle) * lookDist;
      const finalLookZ = camVec.z + Math.cos(horizAngle) * Math.cos(vertAngle) * lookDist;

      camera.position.copy(camVec);
      camera.lookAt(finalLookX, finalLookY, finalLookZ);

      if (house) {
        const doorAngle = getPivotDoorOpenAmount(smoothT);
        if (Math.abs(doorAngle - prevDoorAngle) > 0.002) {
          house.pivotDoor.rotation.y = doorAngle;
          renderer.shadowMap.needsUpdate = true;
          prevDoorAngle = doorAngle;
        }

        if (!reduceMotion) {
          for (let i = 0; i < house.animatedCurtains.length; i++) {
            house.animatedCurtains[i]!.rotation.z = Math.sin(elapsed * 0.65 + i) * 0.01;
          }
          house.emberMat.emissiveIntensity = 1.48 + Math.sin(elapsed * 2.4) * 0.16;
        }
      }

      if (chapterIdx !== activeIdx) {
        activeIdx = chapterIdx;
        onStopChange(chapterIdx);
      }

      // Single-pass direct WebGL render (zero postprocessing ping-pong lag, full hardware MSAA!)
      renderer.render(scene, camera);
    };

    loadStudioAssets(
      renderer.capabilities.getMaxAnisotropy(),
      (pct) => {
        if (!ac.signal.aborted) setLoadPct(pct);
      },
      ac.signal,
    )
      .then((assets) => {
        if (ac.signal.aborted) return;

        envRT = pmrem.fromEquirectangular(assets.envTexture);
        scene.environment = envRT.texture;
        scene.environmentIntensity = 0.62;
        scene.background = envRT.texture;
        scene.backgroundBlurriness = 0.06;
        scene.backgroundIntensity = 0.72;

        const texBundle = createProceduralTextures();
        house = buildRealisticHouse(scene, assets, texBundle);
        renderer.shadowMap.needsUpdate = true;

        setReady(true);
        animate();
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") return;
        onWebGLUnsupported();
      });

    return () => {
      ac.abort();
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      envRT?.dispose();
      pmrem.dispose();
      house?.geometries.forEach((g) => g.dispose());
      house?.materials.forEach((m) => m.dispose());
      house?.textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progressRef, onStopChange, onWebGLUnsupported]);

  return (
    <div className="relative h-full w-full bg-charcoal">
      <div
        ref={mountRef}
        className="h-full w-full cursor-grab touch-pan-y transition-opacity duration-700 active:cursor-grabbing"
        style={{ opacity: ready ? 1 : 0 }}
        aria-label="Interactive 3D modern house walkthrough"
      />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-charcoal text-bone">
          <p className="text-eyebrow text-bronze-light">Preparing 3D Residence</p>
          <div className="h-px w-48 overflow-hidden bg-bone/15">
            <div
              className="h-full bg-bronze transition-all duration-200"
              style={{ width: `${Math.max(8, loadPct)}%` }}
            />
          </div>
          <p className="font-mono text-xs text-bone/50">{loadPct}%</p>
        </div>
      )}
    </div>
  );
}
