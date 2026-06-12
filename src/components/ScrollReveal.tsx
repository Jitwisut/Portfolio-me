'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?:
    | 'up'
    | 'left'
    | 'right'
    | 'scale'
    | 'converge-left'
    | 'converge-right'
    | 'converge-up';
  delay?: number;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild;
    if (!inner) return;

    // Observe the untransformed wrapper so the initial offset of the inner
    // element doesn't shift the trigger point (keeps converge rows in sync).
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              inner.classList.add('revealed');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const dirClass =
    direction === 'left'
      ? 'reveal-left'
      : direction === 'right'
      ? 'reveal-right'
      : direction === 'scale'
      ? 'reveal-scale'
      : direction === 'converge-left'
      ? 'reveal-converge-left'
      : direction === 'converge-right'
      ? 'reveal-converge-right'
      : direction === 'converge-up'
      ? 'reveal-converge-up'
      : 'reveal';

  return (
    <div ref={ref} className={className}>
      <div className={dirClass} style={{ height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
