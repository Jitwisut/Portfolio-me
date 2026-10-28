"use client";

import { useEffect, useRef, useState } from "react";
import { READY_EVENT, day } from "@/lib/day";
import { hasWebGL } from "@/lib/useClient";

const MIN_MS = 1100;
const MAX_MS = 3200;
const RISE_MS = 2800; // matches the loader-sun keyframes in globals.css
const SETTLE_MS = 480;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Pre-dawn. A horizon line, a sun that rises while the site loads and a
 * clock counting down to 06:00. When it arrives the sky splits along the
 * horizon and the scene is revealed. Capped at ~3.2s, skippable.
 *
 * The rise itself is a CSS animation (compositor-driven) so it stays smooth
 * while the main thread is busy; this component only decides when to finish:
 * fonts loaded and the 3D scene warmed up (textures + shaders), so the
 * reveal never shares frames with heavy work.
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
    const scene = hasWebGL();
    let raf = 0;
    let settling = 0;
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
      day.readyAt = performance.now();
      window.dispatchEvent(new Event(READY_EVENT));
      setTimeout(() => setPhase("done"), reduced ? 50 : 1150);
    };

    // The last stretch of the sunrise, from wherever the CSS animation is.
    const settle = () => {
      if (settling || done) return;
      settling = performance.now();
      const opts: KeyframeAnimationOptions = {
        duration: reduced ? 1 : SETTLE_MS,
        easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        fill: "forwards",
      };
      const sun = sunRef.current;
      const line = lineRef.current;
      const anim = sun?.animate(
        [{ transform: getComputedStyle(sun).transform }, { transform: "translate(-50%, 0)" }],
        opts
      );
      line?.animate([{ transform: getComputedStyle(line).transform }, { transform: "scaleX(1)" }], opts);
      if (anim) anim.finished.then(end, end);
      else end();
    };
    finish.current = settle;

    const rise = () => {
      const t = sunRef.current?.getAnimations()[0]?.currentTime;
      return typeof t === "number" ? t : performance.now();
    };

    const loop = () => {
      const now = performance.now();
      const warm = !scene || day.assets === 1;
      if (!settling && ((fontsReady && warm && now >= MIN_MS && now - t0 >= 200) || now - t0 >= max)) settle();

      if (clockRef.current) {
        const base = easeOutCubic(Math.min(rise() / RISE_MS, 1)) * 0.85;
        const p = settling ? base + (1 - base) * Math.min((now - settling) / SETTLE_MS, 1) : base;
        const mins = Math.floor(p * 60);
        clockRef.current.textContent = mins >= 60 ? "06:00" : `05:${String(mins).padStart(2, "0")}`;
      }
      if (!done) raf = requestAnimationFrame(loop);
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
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-[#1c2130] transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
        style={{ transform: leaving ? "translateY(-100%)" : "none" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#141826_0%,#3a3547_70%,#8c6a6a_100%)]" />
        <div ref={sunRef} className="loader-sun absolute bottom-0 left-1/2 size-16 rounded-full bg-[#ffb487] will-change-transform sm:size-20" />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#1a1d27] transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform"
        style={{ transform: leaving ? "translateY(100%)" : "none" }}
      >
        <div ref={lineRef} className="loader-line absolute inset-x-6 top-0 h-px origin-center bg-[#efe6d8]/70 will-change-transform sm:inset-x-12" />
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
