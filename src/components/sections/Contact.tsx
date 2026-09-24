"use client";

import { useEffect, useRef, useState } from "react";
import { profile, socials } from "@/data/profile";
import { useMagnetic } from "@/lib/useMagnetic";
import { goTo } from "@/components/DayController";
import Reveal from "@/components/ui/Reveal";

/** Local time where I actually am, ticking once a minute. */
function useLocalTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone });
    const update = () => setT(fmt.format(new Date()));
    const first = setTimeout(update, 0);
    const id = setInterval(update, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return t;
}

/**
 * 22:00. The pavilion is dark except for one window — the studio light is
 * still on. The last scene is an invitation to knock.
 */
export default function Contact() {
  const email = useMagnetic<HTMLAnchorElement>(0.18);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const time = useLocalTime();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <section
      id="contact"
      data-hour-start="21"
      data-hour-end="22"
      className="relative flex min-h-[150svh] flex-col justify-end px-5 pt-[40svh] pb-6 sm:min-h-[170svh] sm:px-10 sm:pb-8 lg:px-14"
      aria-labelledby="contact-title"
    >
      <div className="max-w-[62rem]">
        <Reveal>
          <p className="eyebrow">22:00 — Contact</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 id="contact-title" className="display mt-5 text-[clamp(3.4rem,9vw,8.5rem)]">
            The light is
            <br />
            still <em className="text-accent">on</em>.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-fg-soft">
            Open to roles, freelance work and hard problems worth staying up for. Write to me — I reply within a day.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            ref={email}
            href={`mailto:${profile.email}`}
            className="btn btn-solid !px-6 !py-5 !text-[0.85rem] sm:!text-base"
            data-cursor="Write"
          >
            {profile.email}
            <span aria-hidden>↗</span>
          </a>
          <button type="button" onClick={copy} className="btn !py-5" data-cursor={copied ? "Copied" : "Copy"}>
            <span aria-live="polite">{copied ? "Copied ✓" : "Copy address"}</span>
          </button>
        </Reveal>

        <Reveal delay={300}>
          <ul className="mt-8 grid grid-cols-3 border-t border-fg/15 sm:mt-12">
            {socials.map((s) => (
              <li key={s.label} className="border-r border-b border-fg/15 last:border-r-0 first:*:pl-0">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline justify-between gap-2 px-3 py-4 sm:gap-4 sm:px-5 sm:py-5"
                  data-cursor="Open"
                >
                  <span>
                    <span className="eyebrow block">{s.label}</span>
                    <span className="mt-1 hidden font-display text-xl sm:block">{s.handle}</span>
                  </span>
                  <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <footer className="mt-[8svh] flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pr-20 pb-2 font-mono text-[0.7rem] tracking-[0.12em] text-fg-soft uppercase sm:mt-[18svh] sm:pr-0 sm:pb-0">
        <p>
          {time ? (
            <>
              It&apos;s <span className="text-fg tabular-nums">{time}</span> in {profile.location.split(",")[0]} right now
            </>
          ) : (
            profile.location
          )}
        </p>
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <button type="button" onClick={() => goTo("home")} className="link-line uppercase" data-cursor="Sunrise">
          Back to sunrise ↺
        </button>
      </footer>
    </section>
  );
}
