"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { projects } from "@/data/projects";
import { day } from "@/lib/day";
import { ART, BAYS, WALL_T, WALL_Z, bayCenter } from "./layout";

/** A typographic plate for projects that have no screenshot yet. */
function plateTexture(name: string) {
  const c = document.createElement("canvas");
  c.width = 1400;
  c.height = 690;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#2a2521";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.strokeStyle = "rgba(239,230,216,0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, c.width - 80, c.height - 80);
  ctx.fillStyle = "#efe6d8";
  ctx.font = "600 150px Georgia, serif";
  ctx.textBaseline = "middle";
  ctx.fillText(name, 110, c.height / 2);
  ctx.font = "28px monospace";
  ctx.fillStyle = "rgba(239,230,216,0.6)";
  ctx.fillText("SOURCE ON GITHUB — PREVIEW TO COME", 114, c.height / 2 + 120);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const urls = projects.filter((p) => p.texture).map((p) => p.texture!);

export default function Exhibits() {
  const loaded = useLoader(THREE.TextureLoader, urls);

  const textures = useMemo(() => {
    let k = 0;
    return projects.map((p) => {
      if (p.texture) {
        const t = loaded[k++];
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        // Cover-fit, anchored to the top of the screenshot (where the hero is).
        const img = t.image as HTMLImageElement;
        const ia = img.width / img.height;
        const pa = ART.w / ART.h;
        if (ia > pa) {
          t.repeat.set(pa / ia, 1);
          t.offset.set((1 - pa / ia) / 2, 0);
        } else {
          t.repeat.set(1, ia / pa);
          t.offset.set(0, 1 - ia / pa);
        }
        return t;
      }
      return plateTexture(p.name);
    });
  }, [loaded]);

  const materials = useMemo(
    () =>
      textures.map(
        (map) =>
          new THREE.MeshStandardMaterial({
            map,
            roughness: 0.55,
            // A little self-illumination keeps screenshots readable in the
            // shade under the roof and lets them glow faintly after dark.
            emissive: new THREE.Color("#ffffff"),
            emissiveMap: map,
            emissiveIntensity: 0.28,
          })
      ),
    [textures]
  );

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2b2622", roughness: 0.6 }), []);

  useEffect(
    () => () => {
      materials.forEach((m) => m.dispose());
      frameMat.dispose();
      textures.forEach((t, i) => !projects[i].texture && t.dispose());
    },
    [materials, frameMat, textures]
  );

  // The exhibit you're standing in front of is lit a touch brighter.
  useFrame(() => {
    const active = day.works * (BAYS - 1);
    const inWorks = THREE.MathUtils.smoothstep(day.hour, 11.2, 12.2) * (1 - THREE.MathUtils.smoothstep(day.hour, 16.2, 17.2));
    const night = THREE.MathUtils.smoothstep(day.hour, 18.5, 20.5);
    materials.forEach((m, i) => {
      const focus = Math.max(0, 1 - Math.abs(active - i)) * inWorks;
      m.emissiveIntensity = 0.22 + focus * 0.22 - night * 0.1;
    });
  });

  const z = WALL_Z + WALL_T / 2;

  return (
    <group>
      {projects.map((p, i) => (
        <group key={p.slug} position={[bayCenter(i), ART.y, z]}>
          <mesh position={[0, 0, 0.03]} material={frameMat} castShadow receiveShadow>
            <boxGeometry args={[ART.w + 0.08, ART.h + 0.08, 0.06]} />
          </mesh>
          <mesh position={[0, 0, 0.061]} material={materials[i]}>
            <planeGeometry args={[ART.w, ART.h]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
