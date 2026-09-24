"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HOUR_END, HOUR_START, day, palette, writeCssVars } from "@/lib/day";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

type Anchor = { y: number; hour: number };

/**
 * The single clock of the site.
 * - Lenis provides inertial scrolling, driven by GSAP's ticker so there is
 *   exactly one animation loop.
 * - Scroll position → target hour, using `data-hour-start/end` on sections.
 * - Every tick: damp the hour, write the palette to CSS variables, and ask
 *   the canvas for a frame only when something actually changed.
 */
export default function DayController() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    day.reduced = reduced;
    // Touch scrolling is already native and direct; a heavy damp on top of it
    // makes the scene feel like it lags behind the finger.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const damping = touch ? 9 : 4.5;
    const root = document.documentElement;

    let lenis: Lenis | undefined;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 3.2), touchMultiplier: 1.4 });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
    }

    let anchors: Anchor[] = [];
    let works = { start: 0, end: 1 };

    const measure = () => {
      const vh = window.innerHeight;
      const max = Math.max(document.documentElement.scrollHeight - vh, 1);
      const list: Anchor[] = [{ y: 0, hour: HOUR_START }];
      document.querySelectorAll<HTMLElement>("[data-hour-start]").forEach((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const start = parseFloat(el.dataset.hourStart!);
        const end = parseFloat(el.dataset.hourEnd ?? el.dataset.hourStart!);
        list.push({ y: Math.min(top, max), hour: start });
        const bottom = top + el.offsetHeight - vh;
        if (bottom > top + 1) list.push({ y: Math.min(bottom, max), hour: end });
        if (el.id === "projects") works = { start: top, end: Math.max(bottom, top + 1) };
      });
      list.push({ y: max, hour: HOUR_END });
      anchors = list.sort((a, b) => a.y - b.y);
      update();
    };

    const hourAt = (y: number) => {
      for (let i = 0; i < anchors.length - 1; i++) {
        const a = anchors[i];
        const b = anchors[i + 1];
        if (y <= b.y) {
          const t = b.y > a.y ? (y - a.y) / (b.y - a.y) : 1;
          return a.hour + (b.hour - a.hour) * Math.min(Math.max(t, 0), 1);
        }
      }
      return HOUR_END;
    };

    const update = () => {
      const y = window.scrollY;
      day.target = hourAt(y);
      day.works = Math.min(Math.max((y - works.start) / (works.end - works.start), 0), 1);
    };

    let lastWritten = -1;
    const tick = (time: number, deltaMs: number) => {
      lenis?.raf(time * 1000);
      const dt = Math.min(deltaMs / 1000, 0.1);
      const prev = day.hour;
      day.hour = reduced ? day.target : prev + (day.target - prev) * (1 - Math.exp(-dt * damping));
      if (Math.abs(day.target - day.hour) < 0.0005) day.hour = day.target;
      if (Math.abs(day.hour - lastWritten) > 0.0008) {
        writeCssVars(root, palette(day.hour), day.hour);
        root.dataset.night = day.hour > 19 ? "true" : "false";
        lastWritten = day.hour;
        day.invalidate();
      }
    };

    const onScroll = () => update();
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      day.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      day.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      day.invalidate();
    };

    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    measure();
    day.hour = day.target;
    writeCssVars(root, palette(day.hour), day.hour);

    // Deep links (#projects …) are resolved by the Loader once it hands over.

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      lenis?.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, []);

  return null;
}

/** Scroll to a section by id — smooth through Lenis, instant when reduced. */
export function goTo(id: string, opts: { immediate?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { duration: 2.2, immediate: opts.immediate });
  else el.scrollIntoView({ behavior: day.reduced ? "auto" : "smooth" });
}

/** Scroll to an absolute y position. */
export function goToY(y: number, opts: { force?: boolean } = {}) {
  const duration = window.matchMedia("(pointer: coarse)").matches ? 0.8 : 1.4;
  if (window.__lenis) window.__lenis.scrollTo(y, { duration, force: opts.force });
  else window.scrollTo({ top: y, behavior: day.reduced ? "auto" : "smooth" });
}
