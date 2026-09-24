"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, profile } from "@/data/profile";
import Reveal from "@/components/ui/Reveal";

/**
 * 10:00. Standing in the line of light that falls through the slit wall.
 * As you scroll, the same light passes over the statement and lights it
 * word by word; the slit on the panel's edge opens with it.
 */
export default function About() {
  const section = useRef<HTMLElement>(null);
  const lead = useRef<HTMLParagraphElement>(null);
  const slit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const words = Array.from(lead.current!.querySelectorAll<HTMLElement>("[data-w]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      words.forEach((w) => (w.dataset.lit = "true"));
      return;
    }
    let lastLit = -1;
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top 60%",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        const lit = Math.round(Math.min(p / 0.7, 1) * words.length);
        if (lit !== lastLit) {
          words.forEach((w, i) => (w.dataset.lit = i < lit ? "true" : "false"));
          lastLit = lit;
        }
        if (slit.current) slit.current.style.transform = `scaleY(${Math.min(p / 0.7, 1).toFixed(3)})`;
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section
      ref={section}
      id="about"
      data-hour-start="9.5"
      data-hour-end="11"
      className="relative h-[260svh]"
      aria-labelledby="about-title"
    >
      <div className="sticky top-0 flex h-svh items-end px-5 pt-24 pb-24 sm:px-10 md:items-center md:justify-end md:pb-10 lg:px-14">
        <div className="panel relative w-full max-w-[40rem] p-6 sm:p-10">
          {/* The slit: a line of light that opens down the panel's edge. */}
          <div className="absolute top-0 bottom-0 -left-px w-[3px] overflow-hidden" aria-hidden>
            <div ref={slit} className="h-full w-full origin-top scale-y-0 bg-accent" />
          </div>

          <div className="mb-6 flex items-baseline justify-between gap-4 sm:mb-8">
            <h2 id="about-title" className="eyebrow">
              09:30 — About
            </h2>
            <span className="eyebrow hidden sm:inline">{profile.coords}</span>
          </div>

          <p ref={lead} className="font-display text-[clamp(1.45rem,2.6vw,2.15rem)] leading-[1.18] tracking-[-0.015em]">
            {about.lead.split(" ").map((w, i) => (
              <span key={i} data-w data-lit="false" className="lit-word">
                {w}{" "}
              </span>
            ))}
          </p>

          <div className="mt-7 grid gap-4 text-[0.98rem] leading-relaxed text-fg-soft sm:mt-9 sm:grid-cols-2 sm:gap-6">
            {about.body.map((b, i) => (
              <Reveal key={i} delay={i * 120} as="p">
                {b}
              </Reveal>
            ))}
          </div>

          <dl className="mt-8 hidden border-t border-fg/15 sm:block">
            {about.facts.map((f) => (
              <div key={f.label} className="flex items-baseline gap-4 border-b border-fg/10 py-2.5 text-sm">
                <dt className="eyebrow w-24 shrink-0">{f.label}</dt>
                {/* Dimension line, like an annotation on a drawing */}
                <span className="relative hidden h-px flex-1 bg-fg/20 md:block" aria-hidden>
                  <span className="absolute -top-[3px] left-0 h-[7px] w-px bg-fg/40" />
                  <span className="absolute -top-[3px] right-0 h-[7px] w-px bg-fg/40" />
                </span>
                <dd className="text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
