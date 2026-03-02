'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero() {
    const words = ['Hello World!', 'Namaste!', 'สวัสดี!', 'Bonjour!'];
    const [wordIndex, setWordIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setVisible(true);
        const interval = setInterval(() => {
            setWordIndex((i) => (i + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section
            id="home"
            ref={sectionRef}
            style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                paddingTop: '5rem',
            }}
        >
            {/* Background effects */}
            <div className="gradient-bg-hero" />
            <div className="grid-pattern" />

            {/* Floating orbs */}
            <div
                className="floating-orb"
                style={{
                    width: 300,
                    height: 300,
                    background: 'rgba(59,130,246,0.08)',
                    top: '10%',
                    right: '-5%',
                    animationDelay: '0s',
                }}
            />
            <div
                className="floating-orb"
                style={{
                    width: 200,
                    height: 200,
                    background: 'rgba(6,182,212,0.06)',
                    bottom: '10%',
                    left: '-3%',
                    animationDelay: '4s',
                }}
            />

            {/* Particles - deterministic positions to avoid hydration mismatch */}
            <div className="particles">
                {[
                    { left: '8%', dur: '7s', del: '0s', sz: '2px' },
                    { left: '15%', dur: '10s', del: '1s', sz: '3px' },
                    { left: '25%', dur: '8s', del: '2.5s', sz: '2px' },
                    { left: '35%', dur: '12s', del: '0.5s', sz: '3px' },
                    { left: '45%', dur: '9s', del: '3s', sz: '2px' },
                    { left: '55%', dur: '11s', del: '1.5s', sz: '4px' },
                    { left: '65%', dur: '7.5s', del: '4s', sz: '2px' },
                    { left: '72%', dur: '13s', del: '2s', sz: '3px' },
                    { left: '80%', dur: '8.5s', del: '0.8s', sz: '2px' },
                    { left: '88%', dur: '10.5s', del: '3.5s', sz: '3px' },
                    { left: '93%', dur: '9.5s', del: '1.2s', sz: '2px' },
                    { left: '50%', dur: '14s', del: '4.5s', sz: '4px' },
                ].map((p, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: p.left,
                            animationDuration: p.dur,
                            animationDelay: p.del,
                            width: p.sz,
                            height: p.sz,
                        }}
                    />
                ))}
            </div>

            <div
                className="container"
                style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '3rem',
                }}
            >
                {/* Profile Image */}
                <div
                    style={{
                        flex: '1 1 300px',
                        display: 'flex',
                        justifyContent: 'center',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    <div
                        className="hero-image-wrapper"
                        style={{
                            background:
                                'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: 4,
                                background: 'var(--bg-primary)',
                                clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <svg
                                width="200"
                                height="200"
                                viewBox="0 0 200 200"
                                fill="none"
                                style={{ opacity: 0.3 }}
                            >
                                <circle
                                    cx="100"
                                    cy="80"
                                    r="40"
                                    stroke="var(--accent-blue)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                                <path
                                    d="M50 180 C50 140, 80 120, 100 120 C120 120, 150 140, 150 180"
                                    stroke="var(--accent-blue)"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div style={{ flex: '1 1 400px' }}>
                    <div
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                fontWeight: 700,
                                height: '1.2em',
                                overflow: 'hidden',
                                marginBottom: '0.5rem',
                            }}
                        >
                            <span
                                key={wordIndex}
                                style={{
                                    display: 'inline-block',
                                    animation: 'fadeSlideIn 0.6s ease forwards',
                                }}
                            >
                                {words[wordIndex]}
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
                        }}
                    >
                        <h1 className="hero-name" style={{ marginBottom: '0.25rem' }}>
                            I&apos;m{' '}
                            <span className="hero-accent">Anish</span>
                        </h1>
                    </div>

                    <div
                        style={{
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
                        }}
                    >
                        <p
                            style={{
                                fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                                color: 'var(--text-secondary)',
                                maxWidth: 500,
                                lineHeight: 1.7,
                                marginTop: '1rem',
                                marginBottom: '2rem',
                            }}
                        >
                            A passionate{' '}
                            <strong style={{ color: 'var(--accent-light)' }}>
                                Fullstack Developer
                            </strong>{' '}
                            with creative thinking. Loves creating sleek designs and best
                            software out of the box.
                        </p>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(30px)',
                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
                        }}
                    >
                        <a href="#projects" className="btn-primary">
                            <span>My Projects</span>
                        </a>
                        <a href="#about" className="btn-outline">
                            <span>About Me</span>
                        </a>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            opacity: visible ? 1 : 0,
                            transform: visible ? 'translateY(0)' : 'translateY(20px)',
                            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s',
                        }}
                    >
                        {[
                            {
                                href: 'https://github.com/xeven777',
                                icon: (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                    </svg>
                                ),
                            },
                            {
                                href: 'https://linkedin.com/in/anishbiswas777',
                                icon: (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect x="2" y="9" width="4" height="12" />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                ),
                            },
                            {
                                href: 'https://twitter.com/xevenbiswas',
                                icon: (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                    </svg>
                                ),
                            },
                            {
                                href: 'mailto:anish7biswas@gmail.com',
                                icon: (
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                ),
                            },
                        ].map((s, i) => (
                            <a
                                key={i}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
