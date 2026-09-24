"use client";

import { useEffect, useRef } from "react";

/**
 * Display text whose letters thicken as the pointer passes over them, as if
 * a beam of light were catching the edges. Letters are also revealed one by
 * one when `ready` flips. Pure transform/opacity + font-variation-settings.
 */
export default function LightType({
  text,
  ready,
  delay = 0,
  className = "",
}: {
  text: string;
  ready: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-l]"));
    const weights = letters.map(() => 380);
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    let running = false;

    const frame = () => {
      let moving = false;
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const target = 380 + 420 * Math.max(0, 1 - d / 260);
        weights[i] += (target - weights[i]) * 0.14;
        if (Math.abs(target - weights[i]) > 0.5) moving = true;
        l.style.fontVariationSettings = `"wght" ${weights[i].toFixed(0)}, "SOFT" ${(30 + (weights[i] - 380) / 6).toFixed(0)}`;
      });
      raf = moving ? requestAnimationFrame(frame) : 0;
      running = moving;
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      kick();
    };
    const onLeave = () => {
      mx = my = -9999;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span ref={ref} className={`inline-block whitespace-nowrap ${className}`} aria-hidden>
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-y-clip pb-[0.12em] align-bottom">
          <span
            data-l
            data-text={ch}
            className="cast transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: ready ? "none" : "translateY(108%) rotate(4deg)",
              opacity: ready ? 1 : 0,
              transitionDelay: `${delay + i * 45}ms`,
            }}
          >
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}
