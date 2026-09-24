"use client";

import { useEffect, useRef } from "react";

/**
 * A small point of light and the shadow it casts. The shadow falls away from
 * the current sun (via --shadow-x / --shadow-y), so even the cursor tells the
 * time. Over anything with data-cursor it opens into a labelled ring.
 * Fine pointers only; the native cursor is kept for touch and reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = dot.current!;
    document.documentElement.classList.add("has-cursor");

    let x = -100,
      y = -100,
      cx = -100,
      cy = -100,
      raf = 0;

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.dataset.visible = "true";
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (target) {
        el.dataset.state = "hover";
        label.current!.textContent = target.dataset.cursor ?? "";
      } else {
        el.dataset.state = "idle";
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => (el.dataset.visible = "false");
    const onDown = () => (el.dataset.press = "true");
    const onUp = () => (el.dataset.press = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={dot} className="cursor" data-visible="false" data-state="idle" aria-hidden>
      <span className="cursor-shadow" />
      <span className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </span>
    </div>
  );
}
