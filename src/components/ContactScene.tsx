'use client';

import { useEffect, useRef } from 'react';

/**
 * Three.js constellation background for the Contact section:
 * drifting stars connected by lines when close, gently repelled
 * by the cursor. Indigo/violet, additive glow.
 */
export default function ContactScene() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let disposed = false;
        let cleanup: (() => void) | undefined;

        (async () => {
            const THREE = await import('three');
            const mount = mountRef.current;
            if (disposed || !mount) return;

            const reduced = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                50,
                mount.clientWidth / mount.clientHeight,
                0.1,
                100
            );
            camera.position.z = 10;

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            mount.appendChild(renderer.domElement);

            // --- Stars ---
            const COUNT = 110;
            const BOUNDS = { x: 11, y: 5.5, z: 2.5 };
            const pos = new Float32Array(COUNT * 3);
            const vel: number[] = [];
            for (let i = 0; i < COUNT; i++) {
                pos[i * 3] = (Math.random() - 0.5) * 2 * BOUNDS.x;
                pos[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOUNDS.y;
                pos[i * 3 + 2] = (Math.random() - 0.5) * 2 * BOUNDS.z;
                vel.push(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.12
                );
            }
            const starGeo = new THREE.BufferGeometry();
            starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const starMat = new THREE.PointsMaterial({
                color: 0x9aa5f8,
                size: 0.07,
                transparent: true,
                opacity: 0.9,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true,
            });
            const stars = new THREE.Points(starGeo, starMat);
            scene.add(stars);

            // --- Connection lines (vertex colors fade with distance) ---
            const MAX_SEG = 900;
            const linePos = new Float32Array(MAX_SEG * 6);
            const lineCol = new Float32Array(MAX_SEG * 6);
            const lineGeo = new THREE.BufferGeometry();
            lineGeo.setAttribute(
                'position',
                new THREE.BufferAttribute(linePos, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            lineGeo.setAttribute(
                'color',
                new THREE.BufferAttribute(lineCol, 3).setUsage(
                    THREE.DynamicDrawUsage
                )
            );
            const lineMat = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.55,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });
            const lines = new THREE.LineSegments(lineGeo, lineMat);
            scene.add(lines);

            const TH = 1.9; // connect distance
            const cA = new THREE.Color(0x6366f1);
            const cB = new THREE.Color(0xa855f7);

            // --- Mouse (world coords on the z=0 plane) ---
            const mouse = { x: 0, y: 0, active: false };
            const onMove = (e: MouseEvent) => {
                const r = mount.getBoundingClientRect();
                if (
                    e.clientY < r.top - 80 ||
                    e.clientY > r.bottom + 80 ||
                    e.clientX < r.left ||
                    e.clientX > r.right
                ) {
                    mouse.active = false;
                    return;
                }
                const ndcX = ((e.clientX - r.left) / r.width) * 2 - 1;
                const ndcY = -(((e.clientY - r.top) / r.height) * 2 - 1);
                const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
                const halfW = halfH * camera.aspect;
                mouse.x = ndcX * halfW;
                mouse.y = ndcY * halfH;
                mouse.active = true;
            };
            window.addEventListener('mousemove', onMove, { passive: true });

            const onResize = () => {
                if (!mount.clientWidth || !mount.clientHeight) return;
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            };
            window.addEventListener('resize', onResize);

            let inView = true;
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        inView = entry.isIntersecting;
                    });
                },
                { rootMargin: '100px' }
            );
            io.observe(mount);

            const step = (dt: number) => {
                // Drift + soft bounce + cursor repulsion
                for (let i = 0; i < COUNT; i++) {
                    const ix = i * 3;
                    pos[ix] += vel[ix] * dt;
                    pos[ix + 1] += vel[ix + 1] * dt;
                    pos[ix + 2] += vel[ix + 2] * dt;

                    if (Math.abs(pos[ix]) > BOUNDS.x) vel[ix] *= -1;
                    if (Math.abs(pos[ix + 1]) > BOUNDS.y) vel[ix + 1] *= -1;
                    if (Math.abs(pos[ix + 2]) > BOUNDS.z) vel[ix + 2] *= -1;

                    if (mouse.active) {
                        const dx = pos[ix] - mouse.x;
                        const dy = pos[ix + 1] - mouse.y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < 3.2 && d2 > 0.0001) {
                            const d = Math.sqrt(d2);
                            const f = ((1.8 - d) / 1.8) * 1.6 * dt;
                            if (f > 0) {
                                pos[ix] += (dx / d) * f;
                                pos[ix + 1] += (dy / d) * f;
                            }
                        }
                    }
                }
                starGeo.attributes.position.needsUpdate = true;

                // Rebuild connections
                let seg = 0;
                for (let i = 0; i < COUNT && seg < MAX_SEG; i++) {
                    for (let j = i + 1; j < COUNT && seg < MAX_SEG; j++) {
                        const ix = i * 3;
                        const jx = j * 3;
                        const dx = pos[ix] - pos[jx];
                        const dy = pos[ix + 1] - pos[jx + 1];
                        const dz = pos[ix + 2] - pos[jx + 2];
                        const d2 = dx * dx + dy * dy + dz * dz;
                        if (d2 < TH * TH) {
                            const t = 1 - Math.sqrt(d2) / TH;
                            const o = seg * 6;
                            linePos[o] = pos[ix];
                            linePos[o + 1] = pos[ix + 1];
                            linePos[o + 2] = pos[ix + 2];
                            linePos[o + 3] = pos[jx];
                            linePos[o + 4] = pos[jx + 1];
                            linePos[o + 5] = pos[jx + 2];
                            const mixed = cA.clone().lerp(cB, (pos[ix] / BOUNDS.x + 1) / 2);
                            lineCol[o] = mixed.r * t;
                            lineCol[o + 1] = mixed.g * t;
                            lineCol[o + 2] = mixed.b * t;
                            lineCol[o + 3] = mixed.r * t;
                            lineCol[o + 4] = mixed.g * t;
                            lineCol[o + 5] = mixed.b * t;
                            seg++;
                        }
                    }
                }
                lineGeo.setDrawRange(0, seg * 2);
                lineGeo.attributes.position.needsUpdate = true;
                lineGeo.attributes.color.needsUpdate = true;
            };

            const clock = new THREE.Clock();
            let raf = 0;
            const loop = () => {
                raf = requestAnimationFrame(loop);
                if (!inView) return;
                const dt = Math.min(clock.getDelta(), 0.05);
                step(dt);
                renderer.render(scene, camera);
            };

            if (reduced) {
                step(0.016);
                renderer.render(scene, camera);
            } else {
                loop();
            }

            cleanup = () => {
                cancelAnimationFrame(raf);
                io.disconnect();
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('resize', onResize);
                starGeo.dispose();
                starMat.dispose();
                lineGeo.dispose();
                lineMat.dispose();
                renderer.dispose();
                if (renderer.domElement.parentNode === mount) {
                    mount.removeChild(renderer.domElement);
                }
            };
        })();

        return () => {
            disposed = true;
            cleanup?.();
        };
    }, []);

    return <div ref={mountRef} className="contact-3d" aria-hidden="true" />;
}
