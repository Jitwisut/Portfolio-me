'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero() {
    const words = ['Hello World!', 'สวัสดี!', 'Hello!'];
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
                justifyContent: 'center',
                overflow: 'hidden',
                paddingTop: '5rem',
            }}
        >
            {/* Background effects */}
            <div className="gradient-bg-hero" />
            <div className="grid-pattern" />

            {/* Aurora light beams - gradually fade in */}
            <div
                className="hero-aurora-container"
                style={{
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 2s ease 0.5s',
                }}
            >
                <div className="hero-aurora hero-aurora-1" />
                <div className="hero-aurora hero-aurora-2" />
                <div className="hero-aurora hero-aurora-3" />
            </div>

            {/* Rotating geometric rings */}
            <div
                className="hero-geo-rings"
                style={{
                    opacity: visible ? 0.6 : 0,
                    transition: 'opacity 2.5s ease 1s',
                }}
            >
                <div className="hero-ring hero-ring-1" />
                <div className="hero-ring hero-ring-2" />
            </div>

            {/* Light burst rays from center */}
            <div
                className="hero-light-burst"
                style={{
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 3s ease 0.8s',
                }}
            />

            {/* Floating orbs - enhanced */}
            <div
                className="floating-orb"
                style={{
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                    top: '0%',
                    right: '5%',
                    animationDelay: '0s',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 2s ease 0.3s',
                }}
            />
            <div
                className="floating-orb"
                style={{
                    width: 400,
                    height: 400,
                    background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
                    bottom: '5%',
                    left: '0%',
                    animationDelay: '4s',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 2s ease 0.6s',
                }}
            />
            <div
                className="floating-orb"
                style={{
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
                    top: '40%',
                    left: '60%',
                    animationDelay: '2s',
                    opacity: visible ? 1 : 0,
                    transition: 'opacity 2s ease 0.9s',
                }}
            />

            {/* Floating dots / sparkles */}
            <div className="hero-sparkles" style={{ opacity: visible ? 1 : 0, transition: 'opacity 2s ease 1.2s' }}>
                {[
                    { x: '12%', y: '20%', s: 4, d: '3s', del: '0s' },
                    { x: '85%', y: '15%', s: 3, d: '4s', del: '1s' },
                    { x: '20%', y: '70%', s: 5, d: '3.5s', del: '0.5s' },
                    { x: '75%', y: '65%', s: 3, d: '5s', del: '2s' },
                    { x: '50%', y: '10%', s: 4, d: '4.5s', del: '1.5s' },
                    { x: '90%', y: '45%', s: 3, d: '3.8s', del: '0.8s' },
                    { x: '8%', y: '50%', s: 5, d: '4.2s', del: '2.5s' },
                    { x: '65%', y: '85%', s: 3, d: '3.2s', del: '1.8s' },
                    { x: '35%', y: '30%', s: 4, d: '5.5s', del: '0.3s' },
                    { x: '45%', y: '75%', s: 3, d: '4.8s', del: '3s' },
                ].map((sp, i) => (
                    <div
                        key={i}
                        className="hero-sparkle"
                        style={{
                            left: sp.x,
                            top: sp.y,
                            width: sp.s,
                            height: sp.s,
                            animationDuration: sp.d,
                            animationDelay: sp.del,
                        }}
                    />
                ))}
            </div>

            {/* Particles */}
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                {/* Greeting Badge */}
                <div
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                        marginBottom: '1.5rem',
                    }}
                >
                    <div className="hero-greeting-badge">
                        <span className="hero-greeting-dot" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            Welcome to my portfolio
                        </span>
                    </div>
                </div>

                {/* Animated Greeting */}
                <div
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                    }}
                >
                    <div className="hero-greeting-cycle">
                        <span
                            key={wordIndex}
                            style={{
                                display: 'inline-block',
                                animation: 'fadeSlideIn 0.6s ease forwards',
                                background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-cyan) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {words[wordIndex]}
                        </span>
                    </div>
                </div>

                {/* Main Heading */}
                <div
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
                    }}
                >
                    <h1 className="hero-name" style={{ marginBottom: '0.5rem' }}>
                        I&apos;m{' '}
                        <span className="hero-accent">Jitwisut</span>
                    </h1>
                </div>

                {/* Description */}
                <div
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.7s',
                    }}
                >
                    <p className="hero-description">
                        A passionate{' '}
                        <strong style={{ color: 'var(--accent-light)' }}>
                            Fullstack Developer
                        </strong>{' '}
                        with creative thinking. Loves creating sleek designs and best
                        software out of the box.
                    </p>
                </div>

                {/* Divider */}
                <div
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
                        marginBottom: '2rem',
                    }}
                >
                    <div className="hero-divider" />
                </div>

                {/* Buttons */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(30px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.9s',
                    }}
                >
                    <a href="#projects" className="btn-primary">
                        <span>My Projects</span>
                    </a>
                    <a href="#about" className="btn-outline">
                        <span>About Me</span>
                    </a>
                </div>

                {/* Social Icons */}
                <div
                    style={{
                        display: 'flex',
                        gap: '0.75rem',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.1s',
                    }}
                >
                    {[
                        {
                            href: 'https://github.com/Jitwisut',
                            icon: (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                            ),
                        },
                        {
                            href: 'https://www.linkedin.com/in/jitwisut-thobut-0a0994357/',
                            icon: (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            ),
                        },

                        {
                            href: 'mailto:tanzajitwisut@gmail.com',
                            icon: (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        </section>
    );
}
