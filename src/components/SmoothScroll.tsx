'use client';

import { useEffect } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        let lenis: any;

        const initLenis = async () => {
            try {
                const Lenis = (await import('lenis')).default;
                lenis = new Lenis({
                    duration: 1.2,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    touchMultiplier: 2,
                });

                function raf(time: number) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }

                requestAnimationFrame(raf);

                // Handle anchor links
                document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
                        if (href) {
                            const target = document.querySelector(href);
                            if (target) {
                                lenis.scrollTo(target as HTMLElement);
                            }
                        }
                    });
                });
            } catch {
                // Fallback: Lenis not installed, use native smooth scroll
                console.log('Using native smooth scroll');
            }
        };

        initLenis();

        return () => {
            if (lenis) {
                lenis.destroy();
            }
        };
    }, []);

    return <>{children}</>;
}
