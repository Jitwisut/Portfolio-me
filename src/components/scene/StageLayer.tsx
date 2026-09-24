"use client";

import dynamic from "next/dynamic";
import { hasWebGL, useClient } from "@/lib/useClient";

const Stage = dynamic(() => import("./Stage"), { ssr: false });

/**
 * Fixed layer behind all content. Without WebGL the CSS sky on <body>
 * (driven by the same palette) remains as the backdrop.
 */
export default function StageLayer() {
  const ok = useClient(hasWebGL, false);
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {ok && <Stage />}
    </div>
  );
}
