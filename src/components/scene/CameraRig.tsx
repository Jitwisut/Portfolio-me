"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { day, smooth } from "@/lib/day";
import { ART, BAYS, SLIT_BEAM, SLIT_WALL, STUDIO, bayCenter } from "./layout";

/** A point along the slit wall's light line: `d` metres out, `side` metres across. */
const beam = (d: number, y: number, side: number): [number, number, number] => [
  SLIT_WALL.x + SLIT_BEAM.x * d - SLIT_BEAM.z * side,
  y,
  SLIT_WALL.z + SLIT_BEAM.z * d + SLIT_BEAM.x * side,
];

type V3 = [number, number, number];
/** `portrait` replaces pos/look on tall screens where the wide framing fails. */
type Shot = { h: number; pos: V3; look: V3; tight?: boolean; portrait?: { pos: V3; look: V3 } };

/**
 * The camera script. Each shot is pinned to an hour; between shots the
 * camera eases (smoothstep), so it settles at every stop instead of drifting.
 * Inside the colonnade there is one shot per bay — a slow walk that pauses
 * in front of each exhibit.
 */
function buildShots(): Shot[] {
  const shots: Shot[] = [
    { h: 6, pos: [-52, 2.6, 88], look: [-22.4, 16.2, 0], portrait: { pos: [-40, 2.2, 104], look: [-2, 12, 0] } },
    { h: 8, pos: [-58, 6, 40], look: [-30, 2.5, 2] },
    // Standing in the line of light, looking back at the slit it came through.
    { h: 9.5, pos: beam(13, 6.2, 2.6), look: beam(2.5, 0.4, -0.6) },
    { h: 11, pos: beam(11, 4.6, 3.4), look: beam(1.5, 0.9, -0.3) },
  ];
  const span = 4 / Math.max(BAYS - 1, 1);
  for (let i = 0; i < BAYS; i++) {
    const x = bayCenter(i);
    shots.push({ h: 12 + i * span, pos: [x, 2.1, 6.2], look: [x, ART.y - 0.55, -3], tight: true });
  }
  shots.push(
    { h: 17, pos: [36, 11, 26], look: [2, 0.2, -1] },
    { h: 18.8, pos: [38, 6.5, 27], look: [10, 1.2, 0] },
    { h: 21, pos: [STUDIO.x + 2.5, 1.9, 17], look: [STUDIO.x - 5.5, 3, 0] },
    { h: 22, pos: [STUDIO.x + 2.2, 1.7, 14.5], look: [STUDIO.x - 4.8, 2.8, 0] }
  );
  return shots;
}

export default function CameraRig() {
  const shots = useMemo(() => buildShots(), []);
  const scratch = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3(), a: new THREE.Vector3(), b: new THREE.Vector3(), p: { x: 0, y: 0 } });

  useFrame((state, delta) => {
    const tmp = scratch.current;
    const cam = state.camera as THREE.PerspectiveCamera;
    const h = day.hour;

    let i = 0;
    while (i < shots.length - 2 && h > shots[i + 1].h) i++;
    const A = shots[i];
    const B = shots[i + 1];
    const t = smooth(THREE.MathUtils.clamp((h - A.h) / (B.h - A.h), 0, 1));

    const aspect = cam.aspect;
    const portrait = aspect < 0.8;
    const a = portrait && A.portrait ? A.portrait : A;
    const b = portrait && B.portrait ? B.portrait : B;
    tmp.pos.set(...a.pos).lerp(tmp.b.set(...b.pos), t);
    tmp.look.set(...a.look).lerp(tmp.b.set(...b.look), t);

    // Narrow screens: step back along the line of sight so the subject
    // still fits the frame (exhibits need their full width).
    if (aspect < 1.25) {
      const tight = A.tight && B.tight;
      const k = tight ? Math.min(2.6, 1.35 / aspect) : A.portrait && portrait ? 1 : Math.min(1.9, 1.15 / Math.sqrt(aspect));
      tmp.a.copy(tmp.pos).sub(tmp.look).multiplyScalar(k);
      tmp.pos.copy(tmp.look).add(tmp.a);
      if (tight) {
        // Lift the exhibit into the upper half; the caption owns the bottom.
        tmp.look.y -= 0.75;
      }
    }

    // A breath of parallax from the pointer, damped.
    const damp = 1 - Math.exp(-delta * 3);
    tmp.p.x += (day.pointer.x - tmp.p.x) * damp;
    tmp.p.y += (day.pointer.y - tmp.p.y) * damp;
    tmp.pos.x += tmp.p.x * 0.35;
    tmp.pos.y += tmp.p.y * 0.18;

    cam.position.copy(tmp.pos);
    cam.lookAt(tmp.look);
    // Centre shadows between the camera and what it looks at, and size the
    // shadow frustum to the shot: tight for close-ups, wide for the overview.
    day.focus.x = (tmp.pos.x + tmp.look.x * 2) / 3;
    day.focus.y = THREE.MathUtils.clamp(tmp.pos.distanceTo(tmp.look) * 0.85, 14, 36);
    day.focus.z = (tmp.pos.z + tmp.look.z * 2) / 3;

    if (Math.abs(tmp.p.x - day.pointer.x) > 0.001 || Math.abs(tmp.p.y - day.pointer.y) > 0.001) {
      state.invalidate();
    }
  });

  return null;
}
