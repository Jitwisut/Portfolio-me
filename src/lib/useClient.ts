import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Read a browser-only value without a hydration mismatch: the server (and
 * the hydration pass) see `serverValue`, the client then re-renders with
 * `read()`. `read` must return a stable value.
 */
export function useClient<T>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(noop, read, () => serverValue);
}

let webgl: boolean | undefined;
export function hasWebGL() {
  if (webgl === undefined) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => window.matchMedia("(pointer: fine)").matches;
