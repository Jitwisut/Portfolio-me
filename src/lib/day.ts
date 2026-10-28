/**
 * The whole site is one day. Scroll position maps to an hour (06:00 → 22:00)
 * and everything — sun, sky, camera, text colour — is a function of it.
 *
 * `day` is a plain mutable store (not React state) so the scroll handler,
 * the GSAP ticker and R3F's useFrame can all read it without re-renders.
 */

export type Rgb = [number, number, number];

export const HOUR_START = 6;
export const HOUR_END = 22;

export type Chapter = { id: string; hour: number; label: string; title: string };

/** Section anchors. `hour` is the time shown when the section reaches the top. */
export const chapters: Chapter[] = [
  { id: "home", hour: 6, label: "06:00", title: "Sunrise" },
  { id: "about", hour: 9.5, label: "09:30", title: "About" },
  { id: "projects", hour: 12, label: "12:00", title: "Works" },
  { id: "experience", hour: 17, label: "17:00", title: "Experience" },
  { id: "contact", hour: 21, label: "21:00", title: "Contact" },
];

export const day = {
  /** Damped hour, what is rendered. */
  hour: HOUR_START,
  /** Hour derived directly from scroll position. */
  target: HOUR_START,
  /** Normalised pointer, -1..1, damped in the scene. */
  pointer: { x: 0, y: 0 },
  /** 0..1 progress through the colonnade (projects section). */
  works: 0,
  /** Where the camera is looking (x, z) and the shadow frustum half-size (y). */
  focus: { x: 0, y: 30, z: 0 },
  /** Which chapter is in view. */
  chapter: 0,
  /** Set by the canvas so the ticker can request a frame (frameloop="demand"). */
  invalidate: (() => {}) as () => void,
  reduced: false,
  /**
   * Scene warm-up: -1 = canvas not mounted (yet), 0 = loading / compiling,
   * 1 = textures uploaded and shaders compiled, so it renders without stalls.
   */
  assets: -1,
  /** True once the opening sequence may play (loader gone). */
  ready: false,
  /** performance.now() when `ready` flipped. */
  readyAt: 0,
};

/** How long the opening reveal runs after the loader hands over. */
export const REVEAL_MS = 2500;

export const READY_EVENT = "pavilion:ready";

/* ------------------------------------------------------------------ */
/* Colour script                                                        */
/* ------------------------------------------------------------------ */

type Key = {
  h: number;
  skyTop: string;
  skyHorizon: string;
  fog: string;
  sun: string;
  sunI: number;
  amb: number;
  /** Text + UI palette */
  fg: string;
  fgSoft: string;
  panel: string;
  accent: string;
  lamp: number;
};

// Written like a lighting script for a film: each key is a moment of the day.
const keys: Key[] = [
  { h: 5.5, skyTop: "#6f7890", skyHorizon: "#e7b79c", fog: "#dcc0ad", sun: "#ff9b72", sunI: 1.1, amb: 0.62, fg: "#1f1a17", fgSoft: "#5b4f46", panel: "#efe4d8", accent: "#b24f2c", lamp: 0.3 },
  { h: 6.5, skyTop: "#8f9ab2", skyHorizon: "#f3c9a6", fog: "#ebd2bd", sun: "#ffb487", sunI: 2.0, amb: 0.7, fg: "#1f1a17", fgSoft: "#5b4f46", panel: "#f1e6da", accent: "#b24f2c", lamp: 0.1 },
  { h: 10, skyTop: "#a8bfcf", skyHorizon: "#eee8dd", fog: "#e7e3da", sun: "#fff0da", sunI: 2.7, amb: 0.62, fg: "#1c1916", fgSoft: "#57504a", panel: "#efeae1", accent: "#a9472a", lamp: 0 },
  { h: 14, skyTop: "#9db8cb", skyHorizon: "#f1ece3", fog: "#e9e5dd", sun: "#fff6e8", sunI: 2.9, amb: 0.66, fg: "#1c1916", fgSoft: "#57504a", panel: "#f0ebe3", accent: "#a9472a", lamp: 0 },
  { h: 16.5, skyTop: "#a9b2bb", skyHorizon: "#f0dcc2", fog: "#ecdcc8", sun: "#ffd29a", sunI: 2.6, amb: 0.56, fg: "#211a14", fgSoft: "#5f5043", panel: "#f3e4cf", accent: "#9e3f1d", lamp: 0 },
  { h: 18, skyTop: "#8d8497", skyHorizon: "#f1bc8e", fog: "#e2bea0", sun: "#ffa566", sunI: 2.2, amb: 0.5, fg: "#221810", fgSoft: "#5e4636", panel: "#f3dcc3", accent: "#98391a", lamp: 0.15 },
  { h: 19, skyTop: "#4a4262", skyHorizon: "#d68769", fog: "#8a6a6d", sun: "#ff7446", sunI: 0.6, amb: 0.26, fg: "#f4eadc", fgSoft: "#c7b6a6", panel: "#2b2433", accent: "#ffb45e", lamp: 0.7 },
  { h: 20.5, skyTop: "#161b2a", skyHorizon: "#3a3446", fog: "#262434", sun: "#9db2da", sunI: 0.32, amb: 0.14, fg: "#efe6d8", fgSoft: "#a9a095", panel: "#171b26", accent: "#ffc46b", lamp: 1 },
  { h: 22.5, skyTop: "#0a0d15", skyHorizon: "#1b2131", fog: "#141824", sun: "#9db2da", sunI: 0.3, amb: 0.12, fg: "#efe6d8", fgSoft: "#a39a8f", panel: "#141822", accent: "#ffc46b", lamp: 1 },
];

const hexCache = new Map<string, Rgb>();
export function hex(h: string): Rgb {
  let c = hexCache.get(h);
  if (!c) {
    const n = parseInt(h.slice(1), 16);
    c = [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    hexCache.set(h, c);
  }
  return c;
}

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export type Palette = {
  skyTop: Rgb;
  skyHorizon: Rgb;
  fog: Rgb;
  sun: Rgb;
  sunI: number;
  amb: number;
  fg: Rgb;
  fgSoft: Rgb;
  panel: Rgb;
  accent: Rgb;
  lamp: number;
};

const colourFields = ["skyTop", "skyHorizon", "fog", "sun", "fg", "fgSoft", "panel", "accent"] as const;

export function palette(h: number): Palette {
  let i = 0;
  while (i < keys.length - 2 && h > keys[i + 1].h) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const raw = (h - a.h) / (b.h - a.h);
  const t = smooth(Math.min(Math.max(raw, 0), 1));
  const out = {
    sunI: a.sunI + (b.sunI - a.sunI) * t,
    amb: a.amb + (b.amb - a.amb) * t,
    lamp: a.lamp + (b.lamp - a.lamp) * t,
  } as Palette;
  for (const f of colourFields) out[f] = mix(hex(a[f]), hex(b[f]), t);
  return out;
}

export const smooth = (t: number) => t * t * (3 - 2 * t);
export const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

/**
 * Sun direction (unit vector). East is +x, south (towards the viewer) is +z.
 * Rises at 06:00, sets at 18:00, then hands over to a cool moon light.
 */
export function sunDirection(h: number, out: [number, number, number] = [0, 0, 0]) {
  const t = clamp01((h - 6) / 12);
  const az = Math.PI * t;
  const el = Math.max(Math.sin(Math.PI * t) * 1.05, 0.1);
  const sx = Math.cos(az) * Math.cos(el);
  const sy = Math.sin(el);
  const sz = 0.55 * Math.cos(el);
  // Moon: high, from the north-west, so night shadows stay short and soft.
  const m = smooth(clamp01((h - 18.6) / 1.6));
  const mx = -0.45,
    my = 0.8,
    mz = 0.4;
  out[0] = sx + (mx - sx) * m;
  out[1] = sy + (my - sy) * m;
  out[2] = sz + (mz - sz) * m;
  const len = Math.hypot(out[0], out[1], out[2]);
  out[0] /= len;
  out[1] /= len;
  out[2] /= len;
  return out;
}

/** "14:32" from a fractional hour. */
export function formatHour(h: number) {
  const total = Math.round(Math.min(Math.max(h, 0), 23.99) * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

const toCss = (c: Rgb) => `${Math.round(c[0] * 255)} ${Math.round(c[1] * 255)} ${Math.round(c[2] * 255)}`;

const INK_DARK = hex("#1e1a16");
const INK_DARK_SOFT = hex("#57504a");
const INK_LIGHT = hex("#f2e9dc");
const INK_LIGHT_SOFT = hex("#b3a99d");
const ACCENT_ON_LIGHT = hex("#9e3f1d");
const ACCENT_ON_DARK = hex("#ffc46b");

/**
 * Push the current palette into CSS custom properties (space-separated RGB).
 * Ink is picked from the panel's brightness rather than interpolated with it:
 * when the panel passes through mid-grey at dusk, the text has already
 * switched sides, so contrast never collapses.
 */
export function writeCssVars(root: HTMLElement, p: Palette, h: number) {
  const s = root.style;
  const lum = 0.2126 * p.panel[0] + 0.7152 * p.panel[1] + 0.0722 * p.panel[2];
  const dark = smooth(clamp01((0.5 - lum) / 0.06));
  s.setProperty("--fg", toCss(mix(INK_DARK, INK_LIGHT, dark)));
  s.setProperty("--fg-soft", toCss(mix(INK_DARK_SOFT, INK_LIGHT_SOFT, dark)));
  s.setProperty("--panel", toCss(p.panel));
  s.setProperty("--accent", toCss(mix(ACCENT_ON_LIGHT, ACCENT_ON_DARK, dark)));
  s.setProperty("--sky-top", toCss(p.skyTop));
  s.setProperty("--sky-horizon", toCss(p.skyHorizon));
  // Shadow direction for DOM elements (cursor shadow, cast-shadow type).
  const sd = sunDirection(h);
  const len = Math.min(1 / Math.max(sd[1], 0.18), 5);
  s.setProperty("--shadow-x", (-sd[0] * len).toFixed(3));
  s.setProperty("--shadow-y", (sd[2] * len * 0.6).toFixed(3));
}
