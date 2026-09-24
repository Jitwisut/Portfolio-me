"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "@/data/projects";
import { day } from "@/lib/day";
import { goToY } from "@/components/DayController";
import Image from "next/image";
import ProjectDialog from "@/components/ui/ProjectDialog";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 12:00 → 16:00. A walk down the colonnade. Each bay holds one project on
 * the back wall (rendered in WebGL); this layer carries the wall label, the
 * bay index and the door into each exhibit.
 */
export default function Works() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = -1;
    const tick = () => {
      const i = Math.round(day.works * (N - 1));
      if (i !== last) {
        last = i;
        setActive(i);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  /** Scroll so that bay `i` is centred in front of the camera. */
  const walkTo = (i: number, force = false) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    goToY(top + (span * i) / (N - 1), { force });
  };

  const p = projects[active];

  return (
    <section
      ref={section}
      id="projects"
      data-hour-start="12"
      data-hour-end="16"
      // Scroll length per bay: shorter on phones so a swipe moves ~one exhibit.
      className="relative h-[calc(100svh+var(--bays)*38svh)] md:h-[calc(100svh+var(--bays)*70svh)]"
      style={{ "--bays": N } as React.CSSProperties}
      aria-labelledby="works-title"
    >
      <div className="sticky top-0 h-svh px-5 pt-20 pb-24 sm:px-10 sm:pt-24 sm:pb-10 lg:px-14">
        <div className="flex items-baseline justify-between">
          <h2 id="works-title" className="eyebrow">
            12:00<span className="max-sm:hidden"> → 16:00</span> — Works<span className="max-sm:hidden">, in the colonnade</span>
          </h2>
          <p className="font-mono text-sm whitespace-nowrap tabular-nums" aria-live="polite">
            <span className="text-fg">{pad(active + 1)}</span>
            <span className="text-fg-soft"> / {pad(N)}</span>
          </p>
        </div>

        {/* Bay index — desktop */}
        <ol className="panel absolute top-1/2 right-10 hidden -translate-y-1/2 px-4 py-3 lg:right-14 lg:block" aria-label="All works">
          {projects.map((q, i) => (
            <li key={q.slug}>
              <button
                type="button"
                onClick={() => walkTo(i)}
                aria-current={i === active ? "true" : undefined}
                className="group flex w-full items-center justify-end gap-3 py-1 text-right"
                data-cursor="Walk"
              >
                <span
                  className={`font-display text-[0.95rem] transition-[opacity,transform] duration-500 ${
                    i === active ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                  }`}
                >
                  {q.name}
                </span>
                <span className={`font-mono text-[0.7rem] tabular-nums ${i === active ? "text-fg" : "text-fg-soft"}`}>{pad(i + 1)}</span>
                <span
                  className={`h-px transition-all duration-500 ${i === active ? "w-8 bg-accent" : "w-3 bg-fg/40 group-hover:w-5"}`}
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ol>

        {/* Wall label */}
        <div className="absolute inset-x-4 bottom-24 sm:inset-x-auto sm:bottom-10 sm:left-10 sm:w-[27rem] lg:left-14">
          <article key={p.slug} className="panel p-4 sm:p-7">
            {/* On phones the exhibits in the 3D scene are too small to read,
                so the label carries the screenshot itself. Tap to enter. */}
            <button
              type="button"
              onClick={() => setOpen(active)}
              className="unveil relative mb-4 block aspect-[16/9] w-full overflow-hidden border border-fg/10 bg-[#2a2521] md:hidden"
              aria-label={`Open ${p.name}`}
            >
              {p.texture ? (
                <Image src={p.texture} alt="" fill sizes="100vw" className="object-cover object-top" />
              ) : (
                <span className="grid h-full place-items-center font-display text-4xl tracking-tight text-[#efe6d8]">{p.name}</span>
              )}
              <span className="absolute right-2 bottom-2 bg-black/55 px-2 py-1 font-mono text-[0.62rem] tracking-[0.12em] text-white uppercase">
                Tap to view
              </span>
            </button>
            <div className="unveil">
              <p className="eyebrow flex justify-between">
                <span>Bay {pad(active + 1)}</span>
                <span>{p.stack.slice(0, 2).join(" · ")}</span>
              </p>
              <h3 className="mt-2 font-display text-[clamp(1.7rem,3.4vw,2.9rem)] leading-[0.95] tracking-[-0.025em] sm:mt-3">{p.name}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-soft sm:mt-3 [@media(max-height:720px)]:max-md:hidden">{p.summary}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-5">
              <button
                ref={openerRef}
                type="button"
                onClick={() => setOpen(active)}
                className="btn btn-solid"
                data-cursor="Enter"
              >
                Enter exhibit
                <span aria-hidden>→</span>
              </button>
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer" className="link-line font-mono text-[0.72rem] tracking-[0.12em] uppercase" data-cursor="Visit">
                  Live ↗
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="link-line font-mono text-[0.72rem] tracking-[0.12em] uppercase" data-cursor="Code">
                  GitHub ↗
                </a>
              )}
            </div>
          </article>

          {/* Prev / next — touch-friendly on small screens */}
          <div className="mt-3 flex items-center justify-between lg:hidden">
            <button type="button" onClick={() => walkTo(Math.max(0, active - 1))} disabled={active === 0} className="panel px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.12em] uppercase disabled:opacity-40" aria-label="Previous work">
              ← Prev
            </button>
            <div className="flex gap-1.5" aria-hidden>
              {projects.map((q, i) => (
                <span key={q.slug} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-5 bg-fg" : "w-1 bg-fg/35"}`} />
              ))}
            </div>
            <button type="button" onClick={() => walkTo(Math.min(N - 1, active + 1))} disabled={active === N - 1} className="panel px-4 py-2.5 font-mono text-[0.7rem] tracking-[0.12em] uppercase disabled:opacity-40" aria-label="Next work">
              Next →
            </button>
          </div>
        </div>
      </div>

      <ProjectDialog
        index={open}
        onClose={() => {
          setOpen(null);
          openerRef.current?.focus();
        }}
        onNavigate={(i) => {
          setOpen(i);
          // Walk the camera to the new bay behind the open dialog.
          walkTo(i, true);
        }}
      />
    </section>
  );
}
