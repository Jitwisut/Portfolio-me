import { useSyncExternalStore } from "react";
import { READY_EVENT, day } from "./day";

const subscribe = (cb: () => void) => {
  window.addEventListener(READY_EVENT, cb);
  return () => window.removeEventListener(READY_EVENT, cb);
};

/** True once the loader has handed over to the opening sequence. */
export function useReady() {
  return useSyncExternalStore(subscribe, () => day.ready, () => false);
}
