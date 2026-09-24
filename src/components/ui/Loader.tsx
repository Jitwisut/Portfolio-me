"use client";

import { useEffect, useRef, useState } from "react";
import { READY_EVENT, day } from "@/lib/day";

const MIN_MS = 1100;
const MAX_MS = 2400;

/**
 * Pre-dawn. A horizon line, a sun that rises with the loading progress and
 * a clock counting down to 06:00. When it arrives the sky splits along the
 * horizon and the scene is revealed. Capped at ~2.4s, skippable.
 */
export default function Loader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const sunRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const finish = useRef<() => void>(() => {});

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    const max = reduced ? 500 : MAX_MS;
    let shown = 0;
    let raf = 0;
    let done = false;
    let fontsReady = false;
    document.fonts?.ready.then(() => (fontsReady = true));
    window.__lenis?.stop();

    const end = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      setPhase("leaving");
      window.__lenis?.start();
      // Honour deep links (#projects …) now that scrolling is live again.
      const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
      if (target) {
        if (window.__lenis) window.__lenis.scrollTo(target, { immediate: true, force: true });
        else target.scrollIntoView();
      }
      day.ready = true;
      window.dispatchEvent(new Event(READY_EVENT));
      setTimeout(() => setPhase("done"), reduced ? 50 : 1150);
    };
    finish.current = end;

    const loop = () => {
      const elapsed = performance.now() - t0;
      // Real progress: fonts + textures (when a canvas exists).
      const assets = day.assets < 0 ? 1 : day.assets;
      const real = (fontsReady ? 0.3 : 0) + assets * 0.7;
      // Never faster than MIN_MS, never slower than max.
      const timeFloor = Math.min(elapsed / max, 1);
      const target = Math.max(Math.min(real, elapsed / MIN_MS), timeFloor);
      shown += (target - shown) * 0.12;
      if (target >= 1 && shown > 0.995) shown = 1;

      if (sunRef.current) sunRef.current.style.transform = `translate(-50%, ${(1 - shown) * 110}%)`;
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${0.15 + shown * 0.85})`;
      if (clockRef.current) {
        const mins = Math.floor(shown * 60);
        clockRef.current.textContent = mins >= 60 ? "06:00" : `05:${String(mins).padStart(2, "0")}`;
      }
      if (shown >= 1) end();
      else raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "done") return null;
  const leaving = phase === "leaving";

  return (
    <div
      className="fixed inset-0 z-[100] text-[#efe6d8]"
      style={{ pointerEvents: leaving ? "none" : "auto" }}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      {/* Two halves of the pre-dawn sky; they part along the horizon. */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-[#1c2130] transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: leaving ? "translateY(-100%)" : "none" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#141826_0%,#3a3547_70%,#8c6a6a_100%)]" />
        <div ref={sunRef} className="absolute bottom-0 left-1/2 size-16 rounded-full bg-[#ffb487] sm:size-20" style={{ transform: "translate(-50%, 110%)" }} />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#1a1d27] transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: leaving ? "translateY(100%)" : "none" }}
      >
        <div
          ref={lineRef}
          className="absolute inset-x-6 top-0 h-px origin-center bg-[#efe6d8]/70 sm:inset-x-12"
          style={{ transform: "scaleX(0.15)" }}
        />
        <div className="absolute inset-x-6 top-5 flex items-baseline justify-between font-mono text-[0.7rem] tracking-[0.16em] uppercase sm:inset-x-12">
          <span className="opacity-70">Jitwisut Thobut — Portfolio</span>
          <span>
            <span ref={clockRef} className="tabular-nums">05:00</span>
            <span className="opacity-60"> / sunrise</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => finish.current()}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] tracking-[0.16em] uppercase opacity-60 transition-opacity hover:opacity-100 sm:bottom-10"
        >
          Skip to morning →
        </button>
      </div>
    </div>
  );
}
