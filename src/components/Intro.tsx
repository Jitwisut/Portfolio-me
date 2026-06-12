'use client';

import { useEffect, useRef, useState } from 'react';

const lines = [
    { text: 'THIS IS MY', gradient: false },
    { text: 'PORTFOLIO', gradient: true },
];

// Deterministic pseudo-random in [0,1) per letter index
const rand = (i: number, seed: number) => {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
};

/**
 * Full-screen opening statement, pinned while content scrolls over it.
 * Entrance: each letter rises in blurred and tilted, then sharpens.
 * Exit (scroll): the whole statement spins past 50°, every letter
 * scatters in its own direction and everything fades away.
 */
export default function Intro() {
    const [ready, setReady] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setReady(true));
        return () => cancelAnimationFrame(raf);
    }, []);

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
            });
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
        };
    }, []);

    let letterIndex = 0;

    return (
        <section
            id="home"
            className={`intro-section ${ready ? 'intro-ready' : ''}`}
        >
            <div className="grid-pattern" />
            <div className="intro-glow" />

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
                        <span key={line.text} className="intro-line" aria-hidden="true">
                            {line.text.split('').map((ch, i) => (
                                <span key={i} className="intro-letter-scatter">
                                    <span
                                        className={`intro-letter ${line.gradient ? 'intro-letter-gradient' : ''}`}
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
            </div>

            <a href="#about" className="intro-scroll" aria-label="Scroll to main content">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                </svg>
            </a>
        </section>
    );
}
