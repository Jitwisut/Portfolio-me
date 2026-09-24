"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { day } from "@/lib/day";
import Sky from "./Sky";
import Pavilion from "./Pavilion";
import Lighting from "./Lighting";
import Exhibits from "./Exhibits";
import CameraRig from "./CameraRig";

/** Hands the canvas' invalidate() to the scroll ticker (frameloop="demand"). */
function Bridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const mgr = THREE.DefaultLoadingManager;
    day.assets = 0;
    mgr.onProgress = (_url, loaded, total) => {
      day.assets = total ? loaded / total : 1;
    };
    mgr.onLoad = () => {
      day.assets = 1;
      invalidate();
    };
    day.invalidate = invalidate;
    invalidate();
    const onVisible = () => document.visibilityState === "visible" && invalidate();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      day.invalidate = () => {};
      mgr.onProgress = () => {};
      mgr.onLoad = () => {};
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [invalidate]);
  return null;
}

export default function Stage() {
  const [lowPower] = useState(
    () => window.matchMedia("(max-width: 820px), (pointer: coarse)").matches
  );
  // Fixed caps rather than an FPS monitor: with frameloop="demand" frames are
  // only rendered while something moves, so frame timing isn't a signal.
  const dpr = Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.6);

  return (
    <Canvas
      className="h-full w-full"
      frameloop="demand"
      dpr={dpr}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: !lowPower, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: lowPower ? 50 : 40, near: 0.1, far: 1000, position: [-50, 3.2, 40] }}
      onCreated={({ gl }) => {
        // Neutral keeps the pastel palette honest (ACES muddies dawn and dusk).
        gl.toneMapping = THREE.NeutralToneMapping;
      }}
      aria-hidden
    >
      <Bridge />
      <CameraRig />
      <Lighting shadowSize={lowPower ? 1024 : 2048} />
      <Sky />
      <Pavilion lowPower={lowPower} />
      <Suspense fallback={null}>
        <Exhibits />
      </Suspense>
    </Canvas>
  );
}
