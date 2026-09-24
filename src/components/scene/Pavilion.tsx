"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { day, palette, smooth } from "@/lib/day";
import {
  BAY,
  BAYS,
  COL_Z,
  COLONNADE_LEN,
  FLOOR_Y,
  HEIGHT,
  SLIT_WALL,
  STUDIO,
  WALL_T,
  WALL_Z,
  X0,
} from "./layout";

/**
 * A small grey-scale noise texture shared by every concrete surface. It adds
 * the faint mottling of cast concrete without loading any image.
 */
// Deterministic noise (keeps render pure and the texture stable).
const hash = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function useConcreteTexture(repeat: number) {
  const tex = useMemo(() => {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const img = ctx.createImageData(size, size);
    // Soft, tileable value noise (bilinear over a coarse grid) plus a little
    // grain — the mottling of cast concrete, kept very low-contrast.
    const G = 16;
    const cell = size / G;
    const grid = (gx: number, gy: number) => hash(((gx + G) % G) + ((gy + G) % G) * G + 7);
    for (let i = 0; i < size * size; i++) {
      const x = i % size;
      const y = (i / size) | 0;
      const fx = x / cell;
      const fy = y / cell;
      const x0 = Math.floor(fx);
      const y0 = Math.floor(fy);
      const tx = smooth(fx - x0);
      const ty = smooth(fy - y0);
      const top = grid(x0, y0) + (grid(x0 + 1, y0) - grid(x0, y0)) * tx;
      const bot = grid(x0, y0 + 1) + (grid(x0 + 1, y0 + 1) - grid(x0, y0 + 1)) * tx;
      const n = 0.92 + 0.06 * (top + (bot - top) * ty) + 0.03 * hash(i);
      const v = Math.min(255, Math.max(0, n * 255));
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [repeat]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function Block({
  position,
  size,
  material,
}: {
  position: [number, number, number];
  size: [number, number, number];
  material: THREE.Material;
}) {
  return (
    <mesh position={position} material={material} castShadow receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

export default function Pavilion({ lowPower }: { lowPower: boolean }) {
  const concreteMap = useConcreteTexture(2);
  const groundMap = useConcreteTexture(60);

  const concrete = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d8d0c4", roughness: 0.92, map: concreteMap }),
    [concreteMap]
  );
  const plaster = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#ece6dc", roughness: 0.96, map: concreteMap }),
    [concreteMap]
  );
  const column = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#cfc6b8", roughness: 0.85, map: concreteMap }),
    [concreteMap]
  );
  const ground = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d9cebf", roughness: 1, map: groundMap }),
    [groundMap]
  );
  const pool = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5f6a6e", roughness: 0.08, metalness: 0.3 }),
    []
  );

  useEffect(
    () => () => {
      [concrete, plaster, column, ground, pool].forEach((m) => m.dispose());
    },
    [concrete, plaster, column, ground, pool]
  );

  const lampRef = useRef<THREE.PointLight>(null);
  const windowRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    const p = palette(day.hour);
    if (windowRef.current) windowRef.current.emissiveIntensity = p.lamp * 1.6;
    if (lampRef.current) lampRef.current.intensity = p.lamp * 7;
  });

  const plinthW = COLONNADE_LEN + 34;
  const cols = BAYS + 1;
  const roofDepth = COL_Z + 0.6 - (WALL_Z + WALL_T / 2 + 0.85);
  const roofZ = COL_Z + 0.6 - roofDepth / 2;
  const roofY = FLOOR_Y + HEIGHT + 0.18;

  return (
    <group>
      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} material={ground} receiveShadow>
        <planeGeometry args={[400, 400]} />
      </mesh>

      {/* Plinth */}
      <Block position={[4, FLOOR_Y / 2, 0]} size={[plinthW, FLOOR_Y, 15]} material={concrete} />

      {/* Reflecting pool in front of the colonnade */}
      <mesh position={[0, FLOOR_Y + 0.005, COL_Z + 3.6]} rotation-x={-Math.PI / 2} material={pool} receiveShadow>
        <planeGeometry args={[COLONNADE_LEN - 4, 2.2]} />
      </mesh>

      {/* Back gallery wall */}
      <Block
        position={[0, FLOOR_Y + HEIGHT / 2, WALL_Z]}
        size={[COLONNADE_LEN + 1.2, HEIGHT, WALL_T]}
        material={plaster}
      />

      {/* Colonnade */}
      {Array.from({ length: cols }, (_, i) => (
        <Block
          key={i}
          position={[X0 + i * BAY, FLOOR_Y + HEIGHT / 2, COL_Z]}
          size={[0.28, HEIGHT, 0.28]}
          material={column}
        />
      ))}

      {/* Floating roof. The gap above the back wall is a skylight that washes
          the exhibits with a band of light that moves through the day. */}
      <Block
        position={[0, roofY, roofZ]}
        size={[COLONNADE_LEN + 1.6, 0.36, roofDepth]}
        material={concrete}
      />

      {/* Slit wall — About. Two leaves with a narrow gap for the light line,
          and a low bench beside where the line lands. */}
      <group position={[SLIT_WALL.x, 0, SLIT_WALL.z]} rotation-y={SLIT_WALL.rot}>
        {[-1, 1].map((s) => {
          const leaf = (SLIT_WALL.width - SLIT_WALL.gap) / 2;
          return (
            <Block
              key={s}
              position={[0, SLIT_WALL.height / 2, s * (leaf / 2 + SLIT_WALL.gap / 2)]}
              size={[0.55, SLIT_WALL.height, leaf]}
              material={plaster}
            />
          );
        })}
        <Block position={[-4.2, 0.22, 2.1]} size={[3.6, 0.44, 0.7]} material={concrete} />
      </group>

      {/* Studio volume with its one window */}
      <Block position={[STUDIO.x, FLOOR_Y + STUDIO.h / 2, STUDIO.z]} size={[STUDIO.w, STUDIO.h, STUDIO.d]} material={plaster} />
      <Block
        position={[STUDIO.x, FLOOR_Y + STUDIO.h + 0.18, STUDIO.z + 0.4]}
        size={[STUDIO.w + 1.4, 0.36, STUDIO.d + 1.6]}
        material={concrete}
      />
      <mesh position={[STUDIO.x - 0.6, FLOOR_Y + 1.9, STUDIO.z + STUDIO.d / 2 + 0.01]}>
        <planeGeometry args={[2.2, 2.6]} />
        <meshStandardMaterial ref={windowRef} color="#1d1b19" emissive="#ffb65c" emissiveIntensity={0} roughness={0.3} />
      </mesh>
      {/* Deep reveal and a single mullion so the window reads as a window */}
      {[
        { p: [STUDIO.x - 0.6, FLOOR_Y + 3.28, STUDIO.z + STUDIO.d / 2 + 0.12], s: [2.5, 0.16, 0.24] },
        { p: [STUDIO.x - 0.6, FLOOR_Y + 0.52, STUDIO.z + STUDIO.d / 2 + 0.12], s: [2.5, 0.16, 0.24] },
        { p: [STUDIO.x - 1.79, FLOOR_Y + 1.9, STUDIO.z + STUDIO.d / 2 + 0.12], s: [0.14, 2.9, 0.24] },
        { p: [STUDIO.x + 0.59, FLOOR_Y + 1.9, STUDIO.z + STUDIO.d / 2 + 0.12], s: [0.14, 2.9, 0.24] },
        { p: [STUDIO.x - 0.2, FLOOR_Y + 1.9, STUDIO.z + STUDIO.d / 2 + 0.05], s: [0.05, 2.6, 0.08] },
      ].map((b, i) => (
        <Block key={`w${i}`} position={b.p as [number, number, number]} size={b.s as [number, number, number]} material={column} />
      ))}
      <pointLight
        ref={lampRef}
        position={[STUDIO.x - 0.6, FLOOR_Y + 1.8, STUDIO.z + STUDIO.d / 2 + 1.4]}
        color="#ffb65c"
        intensity={0}
        distance={11}
        decay={2}
        castShadow={false}
      />

      {/* Stepping slabs leading off the plinth towards the studio */}
      {!lowPower &&
        [0, 1, 2, 3].map((i) => (
          <Block
            key={i}
            position={[STUDIO.x - 0.6, 0.02, 8.3 + i * 1.3]}
            size={[1.6, 0.04, 0.8]}
            material={concrete}
          />
        ))}
    </group>
  );
}
