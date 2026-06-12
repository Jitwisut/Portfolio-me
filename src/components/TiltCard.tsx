'use client';

import { useRef, ReactNode, CSSProperties, MouseEvent } from 'react';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    /** Max tilt angle in degrees */
    maxTilt?: number;
}

/**
 * 3D tilt that follows the cursor + feeds --mx/--my CSS vars
 * so .spotlight-card can render a mouse-tracking glow/border.
 */
export default function TiltCard({
    children,
    className = '',
    style,
    maxTilt = 5,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const frame = useRef<number>(0);

    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            const px = x / rect.width - 0.5;
            const py = y / rect.height - 0.5;
            el.style.setProperty('--mx', `${x}px`);
            el.style.setProperty('--my', `${y}px`);
            el.classList.remove('tilt-resting');
            el.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateY(-4px)`;
        });
    };

    const onMouseLeave = () => {
        const el = ref.current;
        if (!el) return;
        cancelAnimationFrame(frame.current);
        el.classList.add('tilt-resting');
        el.style.transform = '';
    };

    return (
        <div
            ref={ref}
            className={`tilt-card ${className}`}
            style={style}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </div>
    );
}
