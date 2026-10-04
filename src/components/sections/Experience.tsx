"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { materials, milestones } from "@/data/profile";
import { projects } from "@/data/projects";
import Hinge from "@/components/ui/Hinge";

const PHONE = "(max-width: 767px)";
const DESKTOP = "(min-width: 768px)";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9#+]/g, "");

/**
 * 17:00 → 19:00. The sun is low and every column throws a long shadow.
 * The journey is drawn as one of those shadows, lengthening as you scroll;
 * skills are written as the architect's schedule of materials, and each
 * material points to the works it was used in.
 */
export default function Experience() {
  const line = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [material, setMaterial] = useState<string | null>(null);

  // Which projects use each material (matched loosely against project stacks).
  const usage = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const g of materials)
      for (const m of g.items) {
        const key = norm(m);
        map.set(
          m,
          projects.filter((p) => p.stack.some((s) => norm(s).includes(key) || key.includes(norm(s)))).map((p) => p.name)
        );
      }
    return map;
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (line.current) line.current.style.transform = "none";
      return;
    }
    const st = ScrollTrigger.create({
      trigger: list.current,
      start: "top 75%",
      end: "bottom 55%",
      onUpdate: (self) => {
        if (line.current) line.current.style.transform = `scaleY(${self.progress.toFixed(3)})`;
      },
    });
    return () => st.kill();
  }, []);

  const used = material ? usage.get(material) ?? [] : null;

  return (
    <section
      id="experience"
      data-hour-start="17"
      data-hour-end="18.8"
      className="relative px-4 py-[34svh] sm:px-10 lg:px-14"
      aria-labelledby="experience-title"
    >
      <div className="ml-auto max-w-[46rem]">
        {/* Desktop: one panel. Phones: a heading sheet, then one sheet per
            milestone strung along the shadow line, the scene between them. */}
        <Hinge media={DESKTOP} className="md:panel md:p-10">
          <Hinge media={PHONE} className="max-md:panel max-md:p-6">
            <p className="eyebrow">17:00 — Long shadows</p>
            <h2 id="experience-title" className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.92] tracking-[-0.03em]">
              The path so far
            </h2>
            <p className="mt-4 max-w-[46ch] text-fg-soft">
              Late in the day the shadows are longest — a good time to look back at how I got here.
            </p>
          </Hinge>

          <ol ref={list} className="relative mt-[14svh] pl-7 sm:pl-12 md:mt-10">
            {/* The long shadow */}
            <div className="absolute top-1 bottom-1 left-[5px] w-px bg-fg/15 sm:left-[9px]" aria-hidden>
              <div ref={line} className="h-full w-full origin-top scale-y-0 bg-fg" />
            </div>
            {milestones.map((m) => (
              <Hinge media={PHONE} as="li" key={m.title} className="relative mb-[12svh] last:mb-0 md:mb-9">
                <span className="absolute top-2 -left-7 size-[11px] rounded-full border border-fg bg-panel sm:-left-12 sm:size-[19px] max-md:top-6" aria-hidden />
                <div className="max-md:panel max-md:p-5">
                  <p className="eyebrow">{m.when}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight tracking-tight sm:text-[1.75rem]">{m.title}</h3>
                  <p className="mt-1 text-sm text-fg-soft">{m.place}</p>
                  <p className="mt-3 max-w-[52ch] leading-relaxed">{m.text}</p>
                </div>
              </Hinge>
            ))}
          </ol>
        </Hinge>

        <Hinge className="panel mt-[14svh] p-6 sm:p-10 md:mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-3xl tracking-tight">Schedule of materials</h3>
            <p className="eyebrow">Skills &amp; tools</p>
          </div>
          <p className="mt-3 text-sm text-fg-soft">Select a material to see which works were built with it.</p>

          <div className="mt-6 border-t border-fg/15">
            {materials.map((g, gi) => (
              <div key={g.group} className="grid gap-3 border-b border-fg/10 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <div>
                  <p className="font-mono text-[0.7rem] text-fg-soft">M-{String(gi + 1).padStart(2, "0")}</p>
                  <p className="font-display text-xl leading-tight">{g.group}</p>
                  <p className="eyebrow mt-1 !text-[0.64rem]">{g.note}</p>
                </div>
                <ul className="flex flex-wrap content-start gap-2">
                  {g.items.map((m) => {
                    const count = usage.get(m)?.length ?? 0;
                    const on = material === m;
                    return (
                      <li key={m}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setMaterial(on ? null : m)}
                          onPointerEnter={(e) => e.pointerType === "mouse" && setMaterial(m)}
                          className={`flex items-center gap-1.5 border px-3 py-1.5 text-sm transition-colors duration-300 ${
                            on ? "border-fg bg-fg text-panel" : "border-fg/20 hover:border-fg/60"
                          }`}
                          data-cursor={count ? `${count} work${count > 1 ? "s" : ""}` : "Tool"}
                        >
                          {m}
                          {count > 0 && <sup className="font-mono text-[0.6rem] opacity-70">{count}</sup>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-5 min-h-[3em] text-sm leading-relaxed" aria-live="polite">
            {used === null ? (
              <span className="text-fg-soft">—</span>
            ) : used.length ? (
              <>
                <span className="eyebrow mr-2">{material} in</span>
                {used.join(" · ")}
              </>
            ) : (
              <>
                <span className="eyebrow mr-2">{material}</span>
                <span className="text-fg-soft">part of my everyday toolkit.</span>
              </>
            )}
          </p>
        </Hinge>
      </div>
    </section>
  );
}
