import { projects } from "@/data/projects";

/**
 * Pavilion floor plan, in metres. The colonnade runs along x; each bay
 * between two columns holds one project on the back wall.
 *
 *            skylight slit
 *   ┌────────────────────────────────────┐  back wall   z = WALL_Z
 *   │ [01]  [02]  [03]  …                │
 *   ■     ■     ■     ■     ■     ■     ■  colonnade   z = COL_Z
 *   └────────── plinth ──────────────────┘
 */
export const BAYS = projects.length;
export const BAY = 4.4;
export const COL_Z = 2.8;
export const WALL_Z = -3.2;
export const WALL_T = 0.4;
export const HEIGHT = 4.4;
export const FLOOR_Y = 0.5;

export const COLONNADE_LEN = BAYS * BAY;
export const X0 = -COLONNADE_LEN / 2;

export const bayCenter = (i: number) => X0 + BAY * (i + 0.5);

/**
 * The freestanding slit wall where the About section happens. It stands on
 * open ground west of the pavilion, turned to face the mid-morning sun so the
 * slit throws a long line of light across the ground (`rot` about y).
 */
export const SLIT_WALL = { x: X0 - 16, z: 5, width: 7, height: 5.6, gap: 0.3, rot: -0.84 };
/** Unit vector along which the light line falls, away from the wall. */
export const SLIT_BEAM = { x: -Math.cos(SLIT_WALL.rot), z: Math.sin(SLIT_WALL.rot) };

/** The closed studio volume where the light stays on at night. */
export const STUDIO = { x: -X0 + 5.2, z: -0.6, w: 6, h: 4.4, d: 6.4 };

export const ART = { w: 3.7, h: 1.82, y: FLOOR_Y + 2.25 };
