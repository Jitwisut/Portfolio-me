'use client';

import { useEffect, useRef } from 'react';

/**
 * Three.js background for the intro: a slowly tumbling wireframe
 * icosahedron pair inside a drifting particle field, with gentle
 * mouse parallax. Pink/rose to match the theme.
 */
export default function IntroScene() {
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
            scene.fog = new THREE.FogExp2(0xfdeef5, 0.045);

            const camera = new THREE.PerspectiveCamera(
                60,
                mount.clientWidth / mount.clientHeight,
                0.1,
                100
            );
            camera.position.z = 7;

            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            mount.appendChild(renderer.domElement);

            // --- Particle field ---
            const count = 1800;
            const positions = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                positions[i * 3] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
            }
            const particleGeo = new THREE.BufferGeometry();
            particleGeo.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            );
            const particleMat = new THREE.PointsMaterial({
                color: 0xdb2777,
                size: 0.045,
                transparent: true,
                opacity: 0.55,
                depthWrite: false,
                blending: THREE.NormalBlending,
                sizeAttenuation: true,
            });
            const particles = new THREE.Points(particleGeo, particleMat);
            scene.add(particles);

            // A second, violet layer for color depth
            const count2 = 600;
            const positions2 = new Float32Array(count2 * 3);
            for (let i = 0; i < count2; i++) {
                positions2[i * 3] = (Math.random() - 0.5) * 26;
                positions2[i * 3 + 1] = (Math.random() - 0.5) * 18;
                positions2[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
            }
            const particleGeo2 = new THREE.BufferGeometry();
            particleGeo2.setAttribute(
                'position',
                new THREE.BufferAttribute(positions2, 3)
            );
            const particleMat2 = new THREE.PointsMaterial({
                color: 0x9d174d,
                size: 0.055,
                transparent: true,
                opacity: 0.45,
                depthWrite: false,
                blending: THREE.NormalBlending,
                sizeAttenuation: true,
            });
            const particles2 = new THREE.Points(particleGeo2, particleMat2);
            scene.add(particles2);

            // --- Wireframe geometry pair ---
            const outerGeo = new THREE.IcosahedronGeometry(2.6, 1);
            const outerMat = new THREE.MeshBasicMaterial({
                color: 0xec4899,
                wireframe: true,
                transparent: true,
                opacity: 0.35,
            });
            const outer = new THREE.Mesh(outerGeo, outerMat);
            outer.position.set(0, 0, -1.5);
            scene.add(outer);

            const innerGeo = new THREE.IcosahedronGeometry(1.3, 0);
            const innerMat = new THREE.MeshBasicMaterial({
                color: 0x9d174d,
                wireframe: true,
                transparent: true,
                opacity: 0.4,
            });
            const inner = new THREE.Mesh(innerGeo, innerMat);
            inner.position.copy(outer.position);
            scene.add(inner);

            // A distant large ring for depth
            const ringGeo = new THREE.TorusGeometry(6.5, 0.012, 8, 120);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0xdb2777,
                transparent: true,
                opacity: 0.28,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(0, 0, -4);
            ring.rotation.x = Math.PI / 2.4;
            scene.add(ring);

            // --- Mouse parallax ---
            const mouse = { x: 0, y: 0 };
            const onMouseMove = (e: MouseEvent) => {
                mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
                mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
            };
            window.addEventListener('mousemove', onMouseMove, { passive: true });

            const onResize = () => {
                if (!mount.clientWidth || !mount.clientHeight) return;
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            };
            window.addEventListener('resize', onResize);

            const clock = new THREE.Clock();
            let raf = 0;

            const render = () => {
                const dt = clock.getDelta();

                outer.rotation.x += dt * 0.1;
                outer.rotation.y += dt * 0.16;
                inner.rotation.x -= dt * 0.22;
                inner.rotation.y -= dt * 0.14;
                ring.rotation.z += dt * 0.04;
                particles.rotation.y += dt * 0.014;
                particles2.rotation.y -= dt * 0.01;

                camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.04;
                camera.position.y += (-mouse.y * 0.45 - camera.position.y) * 0.04;
                camera.lookAt(0, 0, -1.5);

                renderer.render(scene, camera);
            };

            const loop = () => {
                raf = requestAnimationFrame(loop);
                // Skip work once the intro is fully covered by the content
                if (window.scrollY > window.innerHeight * 1.05) return;
                render();
            };

            if (reduced) {
                // Static frame only
                render();
            } else {
                loop();
            }

            cleanup = () => {
                cancelAnimationFrame(raf);
                window.removeEventListener('mousemove', onMouseMove);
                window.removeEventListener('resize', onResize);
                particleGeo.dispose();
                particleMat.dispose();
                particleGeo2.dispose();
                particleMat2.dispose();
                outerGeo.dispose();
                outerMat.dispose();
                innerGeo.dispose();
                innerMat.dispose();
                ringGeo.dispose();
                ringMat.dispose();
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

    return <div ref={mountRef} className="intro-3d" aria-hidden="true" />;
}
