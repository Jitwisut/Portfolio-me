"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { day, palette, sunDirection } from "@/lib/day";

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * p;
    gl_Position.z = gl_Position.w; // always behind everything
  }
`;

// Colours arrive already in sRGB and are written as-is (no tone mapping),
// so the sky matches the CSS palette exactly.
const fragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform float uNight;
  varying vec3 vDir;

  void main() {
    vec3 d = normalize(vDir);
    float h = clamp(d.y, 0.0, 1.0);
    vec3 col = mix(uHorizon, uTop, pow(h, 0.55));

    // Sun (or moon) disc with a narrow halo — small, like a real one.
    float c = max(dot(d, normalize(uSunDir)), 0.0);
    float disc = smoothstep(0.99955, 0.99975, c);
    float halo = pow(c, 900.0) * 0.55 + pow(c, 24.0) * 0.12 * (1.0 - uNight);
    col += uSun * (disc * (1.0 - uNight * 0.35) + halo);

    // Below the horizon: fade into the fog colour.
    col = mix(col, uHorizon, smoothstep(0.0, -0.04, d.y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Sky() {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color() },
      uHorizon: { value: new THREE.Color() },
      uSun: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uNight: { value: 0 },
    }),
    []
  );

  const dir = useRef<[number, number, number]>([0, 0, 0]);
  const mat = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    const u = mat.current?.uniforms;
    if (!u) return;
    const p = palette(day.hour);
    u.uTop.value.setRGB(...p.skyTop);
    u.uHorizon.value.setRGB(...p.skyHorizon);
    u.uSun.value.setRGB(...p.sun);
    const d = sunDirection(day.hour, dir.current);
    u.uSunDir.value.set(d[0], d[1], d[2]);
    u.uNight.value = THREE.MathUtils.smoothstep(day.hour, 18.8, 20.5);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[400, 48, 24]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
