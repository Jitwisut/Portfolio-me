'use client';

import { useEffect, useRef, useState } from 'react';

interface TextRevealProps {
    children: string;
    className?: string;
    as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
    delay?: number;
    staggerMs?: number;
}

export default function TextReveal({
    children,
    className = '',
    as: Tag = 'p',
    delay = 0,
    staggerMs = 40,
}: TextRevealProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => setRevealed(true), delay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -30px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay]);

    const words = children.split(' ');

    return (
        <Tag ref={containerRef as any} className={`text-reveal-container ${className}`}>
            {words.map((word, i) => (
                <span
                    key={i}
                    className="text-reveal-word"
                    style={{
                        transitionDelay: revealed ? `${i * staggerMs}ms` : '0ms',
                        opacity: revealed ? 1 : 0,
                        transform: revealed ? 'translateY(0)' : 'translateY(12px)',
                        filter: revealed ? 'blur(0px)' : 'blur(4px)',
                    }}
                >
                    {word}
                    {i < words.length - 1 ? '\u00A0' : ''}
                </span>
            ))}
        </Tag>
    );
}
