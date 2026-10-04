"use client";

import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { HOUR_END, HOUR_START, chapters, day, formatHour } from "@/lib/day";
import { profile } from "@/data/profile";
import { goTo } from "@/components/DayController";

const SWEEP = 240; // degrees of dial used for 06:00 → 22:00
const angleFor = (h: number) => -SWEEP / 2 + ((h - HOUR_START) / (HOUR_END - HOUR_START)) * SWEEP;

function activeChapter(h: number) {
  let idx = 0;
  chapters.forEach((c, i) => {
    if (h >= c.hour - 0.35) idx = i;
  });
  return idx;
}

/**
 * Navigation as a sundial. The hand is the gnomon's shadow and turns with the
 * hour; opening the dial lists every chapter by its time. The header carries
 * the name, the live time of day and a direct contact link.
 */
export default function Sundial() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const handRef = useRef<SVGGElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    let lastIdx = -1;
    let lastText = "";
    const tick = () => {
      const h = day.hour;
      if (handRef.current) handRef.current.setAttribute("transform", `rotate(${angleFor(h).toFixed(2)} 40 40)`);
      const text = formatHour(h);
      if (text !== lastText && clockRef.current) {
        clockRef.current.textContent = text;
        lastText = text;
      }
      const idx = activeChapter(day.target);
      if (idx !== lastIdx) {
        lastIdx = idx;
        day.chapter = idx;
        setActive(idx);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    goTo(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      {/* Header */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 pt-5 sm:px-10 sm:pt-7 lg:px-14">
        {/* A soft band of the current sky so the header reads over any scene */}
        <div className="absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-panel from-40% via-panel/70 to-transparent sm:h-28 sm:from-panel/75 sm:from-0% sm:via-panel/40" aria-hidden />
        <a href="#home" onClick={jump("home")} className="pointer-events-auto font-display text-lg leading-none tracking-tight sm:text-xl" data-cursor="Top">
          {profile.first}
          <span className="text-fg-soft"> {profile.last}</span>
        </a>
        <div className="pointer-events-auto flex items-center gap-6 font-mono text-[0.72rem] tracking-[0.14em] uppercase">
          <span className="hidden tabular-nums sm:inline" aria-hidden>
            <span ref={clockRef}>06:00</span>
            <span className="text-fg-soft"> — {chapters[active].title}</span>
          </span>
          <a href="#contact" onClick={jump("contact")} className="link-line" data-cursor="Say hi">
            Contact
          </a>
        </div>
      </header>

      {/* Dial */}
      <nav aria-label="Chapters" className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8">
        <div
          ref={menuRef}
          id={menuId}
          hidden={!open}
          className="panel w-[min(78vw,18rem)] origin-bottom-right p-2"
          style={{ animation: open ? "dial-in 0.45s var(--ease-out)" : undefined }}
        >
          <p className="eyebrow px-3 pt-2 pb-3">Jump to a time of day</p>
          <ul>
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  onClick={jump(c.id)}
                  aria-current={i === active ? "location" : undefined}
                  className="group flex items-baseline gap-4 px-3 py-2.5 transition-colors hover:bg-fg/5"
                >
                  <span className="font-mono text-[0.72rem] tabular-nums text-fg-soft">{c.label}</span>
                  <span className="font-display text-xl leading-none">{c.title}</span>
                  {i === active && <span className="ml-auto size-1.5 self-center rounded-full bg-accent" />}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={`Chapters — now: ${chapters[active].title}`}
          onClick={() => setOpen((o) => !o)}
          className="panel group relative size-16 rounded-full transition-transform duration-500 ease-[var(--ease-out)] hover:scale-105 sm:size-[4.5rem]"
          data-cursor={open ? "Close" : "Chapters"}
        >
          <svg viewBox="0 0 80 80" className="absolute inset-0 size-full" aria-hidden>
            {/* hour ticks */}
            {Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => {
              const h = HOUR_START + i;
              const major = chapters.some((c) => Math.floor(c.hour) === h);
              return (
                <line
                  key={h}
                  x1="40"
                  y1={major ? 9 : 11}
                  x2="40"
                  y2="15"
                  transform={`rotate(${angleFor(h)} 40 40)`}
                  stroke="rgb(var(--fg))"
                  strokeOpacity={major ? 0.8 : 0.3}
                  strokeWidth={major ? 1.4 : 1}
                />
              );
            })}
            {/* gnomon shadow */}
            <g ref={handRef} transform={`rotate(${angleFor(6)} 40 40)`}>
              <path d="M40 40 L38.6 18 L40 15 L41.4 18 Z" fill="rgb(var(--fg))" />
            </g>
            <circle cx="40" cy="40" r="2.6" fill="rgb(var(--accent))" />
          </svg>
        </button>
      </nav>
    </>
  );
}
