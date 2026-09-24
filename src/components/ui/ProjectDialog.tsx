"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { projects } from "@/data/projects";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Stepping into an exhibit. The dialog opens like a door of light — a
 * vertical slit that widens to fill the screen — and holds the full story of
 * one project. Esc / close / backdrop return you to the colonnade.
 */
export default function ProjectDialog({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const isOpen = index !== null;

  const close = () => {
    if (leaving) return;
    setLeaving(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      setLeaving(false);
      onClose();
    }, reduced ? 0 : 520);
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  // Lock page scroll, trap focus, Esc to close.
  useEffect(() => {
    if (!isOpen) return;
    window.__lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab" || !dialog.current) return;
      const f = Array.from(
        dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [isOpen]);

  // New project inside the dialog: back to the top.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [index]);

  if (index === null) return null;
  const p = projects[index];
  const prev = (index - 1 + projects.length) % projects.length;
  const next = (index + 1) % projects.length;

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exhibit-title"
      className="fixed inset-0 z-[90]"
    >
      <div
        className="absolute inset-0 bg-black/30 transition-opacity duration-500"
        style={{ opacity: leaving ? 0 : 1 }}
        onClick={close}
        aria-hidden
      />
      <div
        ref={scroller}
        data-lenis-prevent
        className={`absolute inset-0 overflow-y-auto overscroll-contain bg-panel sm:inset-4 lg:inset-6 ${leaving ? "door-close" : "door-open"}`}
      >
        {/* Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-fg/10 bg-panel/95 px-5 py-4 sm:px-8">
          <p className="eyebrow">
            Exhibit {pad(index + 1)} / {pad(projects.length)}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onNavigate(prev)} className="px-3 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase hover:text-accent" aria-label={`Previous: ${projects[prev].name}`}>
              ← Prev
            </button>
            <button type="button" onClick={() => onNavigate(next)} className="px-3 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase hover:text-accent" aria-label={`Next: ${projects[next].name}`}>
              Next →
            </button>
            <button type="button" data-autofocus onClick={close} className="btn ml-2 !px-4 !py-2" data-cursor="Close">
              Close ✕
            </button>
          </div>
        </div>

        <div key={p.slug} className="grid gap-10 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:px-12">
          {/* Plate */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <figure className="unveil">
              {p.image ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-fg/10 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]">
                  <Image
                    src={p.image}
                    alt={`Screenshot of ${p.name}`}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <div className="grid aspect-[16/9] w-full place-items-center bg-[#2a2521] text-[#efe6d8]">
                  <div className="text-center">
                    <p className="font-display text-5xl tracking-tight sm:text-7xl">{p.name}</p>
                    <p className="eyebrow mt-4 !text-[#efe6d8]/60">Source on GitHub — preview to come</p>
                  </div>
                </div>
              )}
              <figcaption className="eyebrow mt-3 flex justify-between">
                <span>{p.name}</span>
                <span>{p.live ? new URL(p.live).hostname : p.github ? "github.com" : "Private build"}</span>
              </figcaption>
            </figure>
          </div>

          {/* Label */}
          <div>
            <h2 id="exhibit-title" className="font-display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.03em]">
              {p.name}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-fg-soft">{p.description}</p>

            <dl className="mt-10 border-t border-fg/15">
              <Row label="Role">{p.role}</Row>
              <Row label="Stack">
                <ul className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li key={s} className="border border-fg/20 px-2.5 py-1 font-mono text-[0.72rem]">
                      {s}
                    </li>
                  ))}
                </ul>
              </Row>
              <Row label="Challenge">{p.challenge}</Row>
              <Row label="Solution">{p.solution}</Row>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn btn-solid" data-cursor="Visit">
                  Live demo ↗
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn" data-cursor="Code">
                  GitHub ↗
                </a>
              )}
              {!p.live && !p.github && <p className="eyebrow">Private project — demo on request</p>}
            </div>

            <button
              type="button"
              onClick={() => onNavigate(next)}
              className="group mt-16 block w-full border-t border-fg/15 pt-6 text-left"
              data-cursor="Next"
            >
              <span className="eyebrow">Next exhibit</span>
              <span className="mt-2 flex items-baseline justify-between font-display text-3xl tracking-tight">
                {projects[next].name}
                <span className="transition-transform duration-500 group-hover:translate-x-2" aria-hidden>
                  →
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-fg/10 py-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
      <dt className="eyebrow pt-1">{label}</dt>
      <dd className="leading-relaxed">{children}</dd>
    </div>
  );
}
