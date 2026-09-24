"use client";

import { profile } from "@/data/profile";
import { useReady } from "@/lib/useReady";
import LightType from "@/components/ui/LightType";
import { goTo } from "@/components/DayController";

const fade = (ready: boolean, delay: number) => ({
  transform: ready ? "none" : "translateY(18px)",
  opacity: ready ? 1 : 0,
  transition: "transform 1.2s var(--ease-out), opacity 1.2s var(--ease-out)",
  transitionDelay: `${delay}ms`,
});

/**
 * 06:00. The sun has just cleared the horizon; the name stands in the sky
 * and casts a long, low morning shadow. Pinned for a moment while the
 * light climbs, then the day begins.
 */
export default function Intro() {
  const ready = useReady();

  return (
    <section id="home" data-hour-start="6" className="relative h-[150svh]" aria-labelledby="intro-title">
      <div className="sticky top-0 flex h-svh flex-col justify-between px-5 pt-24 pb-8 sm:px-10 sm:pt-28 lg:px-14 lg:pb-12">
        {/* Morning haze over the foreground so the captions stay legible. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[42%] bg-gradient-to-t from-panel/80 via-panel/45 to-transparent" />
        <div>
          <p className="eyebrow mb-5 sm:mb-8" style={fade(ready, 150)}>
            06:00 — Sunrise at the pavilion
          </p>
          <h1 id="intro-title" className="display text-[clamp(4.4rem,13.5vw,14.5rem)] max-sm:text-[21vw]">
            <span className="sr-only">{profile.name}</span>
            <LightType text={profile.first} ready={ready} delay={250} />
            <br />
            <LightType text={profile.last} ready={ready} delay={550} className="ml-[0.9em] sm:ml-[1.6em]" />
          </h1>
        </div>

        <div className="grid items-end gap-6 pr-20 sm:grid-cols-[1fr_1.2fr_auto] sm:gap-10 sm:pr-0">
          <p style={fade(ready, 900)}>
            <span className="eyebrow block">Role</span>
            <span className="mt-2 block font-display text-2xl leading-tight italic sm:text-[1.7rem]">
              {profile.role}
              <br />
              {profile.roleDetail}
            </span>
          </p>
          <p className="max-w-[34ch] text-[1.02rem] leading-relaxed text-fg-soft" style={fade(ready, 1050)}>
            {profile.statement}
            <span className="max-sm:hidden"> This site is one day at a small pavilion — scroll and the sun moves with you.</span>
          </p>
          <div className="flex items-center gap-5 sm:flex-col sm:items-end" style={fade(ready, 1250)}>
            <button
              type="button"
              onClick={() => goTo("about")}
              className="group flex items-center gap-3 font-mono text-[0.75rem] tracking-[0.14em] uppercase"
              data-cursor="Begin"
            >
              <span className="relative block h-12 w-px overflow-hidden bg-fg/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[drop_2.4s_var(--ease-in-out)_infinite] bg-fg" />
              </span>
              Scroll to begin the day
            </button>
            <button
              type="button"
              onClick={() => goTo("projects")}
              className="link-line font-mono text-[0.72rem] tracking-[0.14em] text-fg-soft uppercase max-sm:hidden"
            >
              or skip to 12:00 — works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
