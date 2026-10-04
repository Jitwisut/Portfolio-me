"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, profile } from "@/data/profile";
import Reveal from "@/components/ui/Reveal";
import Hinge from "@/components/ui/Hinge";

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
    // Desktop: the panel is pinned and lights up over the section's scroll.
    // Phones: the lead is its own sheet, so it lights up while it is on screen.
    const phone = window.matchMedia("(max-width: 767px)").matches;
    let lastLit = -1;
    const st = ScrollTrigger.create({
      trigger: phone ? lead.current : section.current,
      start: phone ? "top 80%" : "top 60%",
      end: phone ? "bottom 30%" : "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        const k = phone ? p : Math.min(p / 0.7, 1);
        const lit = Math.round(k * words.length);
        if (lit !== lastLit) {
          words.forEach((w, i) => (w.dataset.lit = i < lit ? "true" : "false"));
          lastLit = lit;
        }
        if (slit.current) slit.current.style.transform = `scaleY(${k.toFixed(3)})`;
      },
    });
    return () => st.kill();
  }, []);

  const PHONE = "(max-width: 767px)";
  const DESKTOP = "(min-width: 768px)";
  const sheet = "max-md:panel relative max-md:p-6";

  return (
    <section
      ref={section}
      id="about"
      data-hour-start="9.5"
      data-hour-end="11"
      className="relative pt-[42svh] pb-[30svh] md:h-[260svh] md:py-0"
      aria-labelledby="about-title"
    >
      <div className="px-4 sm:px-10 md:sticky md:top-0 md:flex md:h-svh md:items-center md:justify-end md:pt-24 md:pb-10 lg:px-14">
        {/* Desktop: one panel rises as a whole. Phones: three sheets rise one by
            one with the scene showing between them. */}
        <Hinge media={DESKTOP} className="relative flex w-full max-w-[40rem] flex-col gap-[34svh] md:panel md:gap-0 md:p-10">
          <Hinge media={PHONE} className={sheet}>
            {/* The slit: a line of light that opens down the edge. */}
            <div className="absolute top-0 bottom-0 -left-px w-[3px] overflow-hidden md:-left-10" aria-hidden>
              <div ref={slit} className="h-full w-full origin-top scale-y-0 bg-accent" />
            </div>
            <div className="mb-5 flex items-baseline justify-between gap-4 sm:mb-8">
              <h2 id="about-title" className="eyebrow">
                09:30 — About
              </h2>
              <span className="eyebrow">{profile.coords}</span>
            </div>
            <p ref={lead} className="font-display text-[clamp(1.6rem,2.6vw,2.15rem)] leading-[1.16] tracking-[-0.015em]">
              {about.lead.split(" ").map((w, i) => (
                <span key={i} data-w data-lit="false" className="lit-word">
                  {w}{" "}
                </span>
              ))}
            </p>
          </Hinge>

          <Hinge media={PHONE} className={`${sheet} md:mt-9`}>
            <p className="eyebrow mb-4 md:hidden">How I work</p>
            <div className="grid gap-4 text-[0.98rem] leading-relaxed text-fg-soft sm:grid-cols-2 sm:gap-6">
              {about.body.map((b, i) => (
                <Reveal key={i} delay={i * 120} as="p">
                  {b}
                </Reveal>
              ))}
            </div>
          </Hinge>

          <Hinge media={PHONE} className={`${sheet} md:mt-8`}>
            <p className="eyebrow mb-3 md:hidden">At a glance</p>
            <dl className="border-t border-fg/15">
              {about.facts.map((f) => (
                <div key={f.label} className="flex items-baseline gap-4 border-b border-fg/10 py-2.5 text-sm max-md:flex-col max-md:gap-0.5">
                  <dt className="eyebrow w-24 shrink-0">{f.label}</dt>
                  {/* Dimension line, like an annotation on a drawing */}
                  <span className="relative hidden h-px flex-1 bg-fg/20 md:block" aria-hidden>
                    <span className="absolute -top-[3px] left-0 h-[7px] w-px bg-fg/40" />
                    <span className="absolute -top-[3px] right-0 h-[7px] w-px bg-fg/40" />
                  </span>
                  <dd className="md:text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Hinge>
        </Hinge>
      </div>
    </section>
  );
}
