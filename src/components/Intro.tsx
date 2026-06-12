'use client';

import { useEffect, useRef, useState } from 'react';
import IntroScene from './IntroScene';

const lines = [
    { text: 'This is my', big: false },
    { text: 'PORTFOLIO', big: true },
];

// Deterministic pseudo-random in [0,1) per letter index
const rand = (i: number, seed: number) => {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
};

/**
 * Full-screen opening statement over a Three.js scene, pinned while the
 * content scrolls over it.
 * Entrance: letters rise in blurred and tilted, then sharpen.
 * After the reveal finishes an "ENTERING" bar fills, then the page
 * auto-scrolls down — the statement spins past 50° and every letter
 * scatters its own way (same scrub also drives manual scrolling).
 */
export default function Intro() {
    const [ready, setReady] = useState(false);
    const [armed, setArmed] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    // Scroll scrub: spin, scatter and fade (manual or auto scroll)
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const content = contentRef.current;
        if (!content) return;

        const letters = Array.from(
            content.querySelectorAll<HTMLElement>('.intro-letter-scatter')
        );
        const vectors = letters.map((_, i) => ({
            dx: (rand(i, 1) - 0.5) * 2 * 260,
            dy: (rand(i, 2) - 0.5) * 2 * 180 - 80,
            rot: (rand(i, 3) - 0.5) * 2 * 110,
        }));

        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const p = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
                content.style.transform = `translateY(${(-p * 8).toFixed(2)}vh) rotate(${(-p * 65).toFixed(2)}deg) scale(${(1 - p * 0.22).toFixed(3)})`;
                content.style.opacity = Math.max(1 - p * 1.25, 0).toFixed(3);
                content.style.visibility = p >= 0.99 ? 'hidden' : 'visible';
                letters.forEach((el, i) => {
                    const v = vectors[i];
                    el.style.transform = `translate(${(v.dx * p).toFixed(1)}px, ${(v.dy * p).toFixed(1)}px) rotate(${(v.rot * p).toFixed(1)}deg)`;
                });
                if (bgRef.current) {
                    bgRef.current.style.opacity = Math.max(1 - p * 1.1, 0).toFixed(3);
                }
            });
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    // Auto-advance: once the reveal finishes, fill the ENTERING bar and
    // scroll on — unless the visitor has already taken over
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let cancelled = false;
        const cancel = () => {
            cancelled = true;
        };
        window.addEventListener('wheel', cancel, { passive: true, once: true });
        window.addEventListener('touchstart', cancel, { passive: true, once: true });

        const arm = setTimeout(() => setArmed(true), 2800);
        const go = setTimeout(() => {
            if (cancelled || window.scrollY > 40) return;
            const target = window.innerHeight;
            if (window.__lenis) {
                window.__lenis.scrollTo(target, { duration: 1.9 });
            } else {
                window.scrollTo({ top: target, behavior: 'smooth' });
            }
        }, 5100);

        return () => {
            clearTimeout(arm);
            clearTimeout(go);
            window.removeEventListener('wheel', cancel);
            window.removeEventListener('touchstart', cancel);
        };
    }, []);

    let letterIndex = 0;

    return (
        <section
            id="home"
            className={`intro-section ${ready ? 'intro-ready' : ''} ${armed ? 'intro-armed' : ''}`}
        >
            <div className="intro-glow" />
            <div ref={bgRef} className="intro-3d-wrap">
                <IntroScene />
            </div>

            <div
                ref={contentRef}
                className="container"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transformOrigin: '50% 60%',
                    willChange: 'transform, opacity',
                }}
            >
                <span className="intro-kicker">Welcome</span>

                <h1 className="intro-title" aria-label="This is my portfolio">
                    {lines.map((line) => (
                        <span
                            key={line.text}
                            className={`intro-line ${line.big ? 'intro-line-big' : 'intro-line-script'}`}
                            aria-hidden="true"
                        >
                            {line.text.split('').map((ch, i) => (
                                <span key={i} className="intro-letter-scatter">
                                    <span
                                        className={`intro-letter ${line.big ? 'intro-letter-gradient' : ''}`}
                                        style={{
                                            transitionDelay: ready
                                                ? `${(0.35 + letterIndex++ * 0.05).toFixed(2)}s`
                                                : '0s',
                                        }}
                                    >
                                        {ch === ' ' ? ' ' : ch}
                                    </span>
                                </span>
                            ))}
                        </span>
                    ))}
                </h1>

                <p className="intro-sub">Jitwisut Thobut — Fullstack Developer</p>

                <div className="intro-enter" aria-hidden="true">
                    <span className="intro-enter-label">Entering portfolio</span>
                    <div className="intro-enter-bar">
                        <div className="intro-enter-fill" />
                    </div>
                </div>
            </div>
        </section>
    );
}
