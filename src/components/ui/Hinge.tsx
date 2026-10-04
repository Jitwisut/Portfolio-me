"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * A wall being raised. The element starts lying back on its bottom edge
 * (rotateX, top receding into the scene) and stands up as it scrolls into
 * view — scrubbed by scroll, so it moves exactly with the visitor's hand.
 * Its sun-cast shadow (.panel) lengthens as it rises.
 */
export default function Hinge({
  children,
  className = "",
  as: Tag = "div",
  angle = 64,
  start = "top bottom",
  end = "top 58%",
  style,
  media,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  /** How far back the panel lies before it rises, in degrees. */
  angle?: number;
  start?: string;
  end?: string;
  style?: React.CSSProperties;
  /** Only animate when this media query matches (e.g. phones only). */
  media?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (media && !window.matchMedia(media).matches) return;
    gsap.registerPlugin(ScrollTrigger);
    el.style.transformOrigin = "50% 100%";
    el.style.willChange = "transform, opacity";

    const apply = (p: number) => {
      const e = 1 - Math.pow(1 - p, 3);
      const a = angle * (1 - e);
      el.style.transform = `perspective(1100px) translate3d(0, ${((1 - e) * 48).toFixed(1)}px, 0) rotateX(${a.toFixed(2)}deg)`;
      el.style.opacity = (0.25 + 0.75 * e).toFixed(3);
      el.dataset.raised = e > 0.98 ? "true" : "false";
    };

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(st.progress);
    return () => {
      st.kill();
      el.style.transform = "";
      el.style.opacity = "";
      el.style.willChange = "";
    };
  }, [angle, start, end, media]);

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
