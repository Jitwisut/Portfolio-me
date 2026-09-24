"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { day, palette, sunDirection } from "@/lib/day";

/** One sun (becomes the moon after dusk), a sky/ground fill, and fog. */
export default function Lighting({ shadowSize }: { shadowSize: number }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const fog = useRef<THREE.Fog>(null);
  const scene = useThree((s) => s.scene);
  const dir = useRef<[number, number, number]>([0, 0, 0]);

  useEffect(() => {
    const l = sun.current;
    if (!l) return;
    // Fit the shadow frustum tightly around the pavilion for crisp shadows.
    const cam = l.shadow.camera;
    // The frustum follows the camera's focus (see useFrame), so it can stay
    // small and sharp instead of covering the whole site.
    cam.near = 1;
    cam.far = 140;
    cam.updateProjectionMatrix();
    l.shadow.bias = -0.0004;
    l.shadow.normalBias = 0.04;
    scene.add(l.target);
    return () => {
      scene.remove(l.target);
    };
  }, [scene]);

  useFrame(() => {
    const p = palette(day.hour);
    const d = sunDirection(day.hour, dir.current);
    const l = sun.current;
    if (l) {
      const f = day.focus;
      l.position.set(f.x + d[0] * 70, d[1] * 70, f.z + d[2] * 70);
      l.target.position.set(f.x, 0, f.z);
      l.target.updateMatrixWorld();
      const c = l.shadow.camera;
      const half = Math.round(f.y);
      if (c.right !== half) {
        c.left = c.bottom = -half;
        c.right = c.top = half;
        c.updateProjectionMatrix();
      }
      l.color.setRGB(p.sun[0], p.sun[1], p.sun[2], THREE.SRGBColorSpace);
      l.intensity = p.sunI;
    }
    if (hemi.current) {
      hemi.current.color.setRGB(p.skyTop[0], p.skyTop[1], p.skyTop[2], THREE.SRGBColorSpace);
      hemi.current.groundColor.setRGB(p.fog[0] * 0.8, p.fog[1] * 0.75, p.fog[2] * 0.7, THREE.SRGBColorSpace);
      hemi.current.intensity = p.amb * 2.3;
    }
    fog.current?.color.setRGB(p.skyHorizon[0], p.skyHorizon[1], p.skyHorizon[2], THREE.SRGBColorSpace);
  });

  return (
    <>
      <fog ref={fog} attach="fog" args={["#e9e5dd", 45, 190]} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
      />
      <hemisphereLight ref={hemi} />
    </>
  );
}
