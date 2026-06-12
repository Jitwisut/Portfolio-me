'use client';

import { useRef, ReactNode, MouseEvent } from 'react';

interface MagneticProps {
    children: ReactNode;
    /** How strongly the element follows the cursor (0–1) */
    strength?: number;
    className?: string;
}

/** Wrapper that gently pulls its child toward the cursor and springs back on leave. */
export default function Magnetic({
    children,
    strength = 0.22,
    className = '',
}: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${(x * strength).toFixed(1)}px, ${(y * strength).toFixed(1)}px)`;
    };

    const onMouseLeave = () => {
        const el = ref.current;
        if (el) el.style.transform = '';
    };

    return (
        <div
            ref={ref}
            className={`magnetic ${className}`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </div>
    );
}
