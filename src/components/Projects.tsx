"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";
import TiltCard from "./TiltCard";

const projects = [
  {
    name: "Tic-Tac-Toe",
    desc: "Real-time multiplayer Tic-Tac-Toe platform featuring live spectating, robust concurrency control, and a Minimax-powered AI opponent.",
    tags: ["Next.js", "MiniMax", "PostgreSQL", "Nodejs"],
    url: "https://frontend-tic-tac-toe-pi.vercel.app/",
    image: "/images/projects/tic-tac-toe.png",
  },
  {
    name: "Money-Tracker",
    desc: "Full-stack expense platform with AI-powered slip scanning for automated logging, interactive dashboard summaries, and dynamic data filtering.",
    tags: ["Next.js", "ElysiaJS", "PostgreSQL"],
    url: "https://money-tracker-omega-ten.vercel.app",
    image: "/images/projects/money-tracker.png",
  },
  {
    name: "Real-time-food-order",
    desc: "Interactive point-of-sale and ordering platform managing real-time table assignments, menu item tracking, and transaction finalization.",
    tags: ["Next.js", "ElysiaJS", "Websocket", "PostgreSQL"],
    url: "https://frontend-restaurant-six.vercel.app",
    image: "/images/projects/restaurant-os.png",
  },
  {
    name: "Tinza-Ramdon-VoiceCall",
    desc: "P2P anonymous voice chat platform featuring real-time WebRTC communication, WebSocket signaling, and a dynamic matchmaking algorithm.",
    tags: ["Next.js", "WebRTC", "WebSocket", "ElysiaJS", "PostgreSQL"],
    url: "https://tinza-demo.vercel.app",
    image: "/images/projects/random-voice.png",
  },
  {
    name: "Baccarat Royale",
    desc: "A dynamic Windows desktop casino simulator featuring Baccarat and Tiger-Dragon, complete with virtual betting, live countdowns, and automated payouts.",
    tags: ["GitHub", "C#", "Developer Tools"],
    url: "https://github.com/Jitwisut/Baccarat-windows-app",
    image: "/images/projects/bacarat.png",
  },
  {
    name: "AegisFace AI",
    desc: "High-security healthcare biometric system using DeepFace for 15-angle facial recognition.",
    tags: ["Python", "Deepface", "TensorFlow / Keras", "OpenCV"],
    url: "https://github.com/Jitwisut/web-deepface",
    image: "/images/projects/deepface.png",
  },
  {
    name: "AskYourDB",
    desc: "AI-powered SQL assistant built with LangChain, FastAPI, and GPT-4o.",
    tags: ["Python", "FastAPI", "LangChain", "OpenAI API"],
    url: "https://github.com/Jitwisut/AI-Driven-Data-Analytics",
    image: "/images/projects/askyoudb.png",
  },
];

export default function Projects() {
  const stageRef = useRef<HTMLDivElement>(null);
  const goRef = useRef<(dir: number) => void>(() => {});
  const jumpRef = useRef<(i: number) => void>(() => {});
  const activeStateRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      const stage = stageRef.current;
      if (disposed || !stage) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const N = projects.length;
      const STEP = (Math.PI * 2) / N;
      const RADIUS = 3.75;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        stage.clientWidth / stage.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0.5, 7.3);
      camera.lookAt(0, -0.05, 0);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(stage.clientWidth, stage.clientHeight);
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.style.cursor = "grab";
      stage.appendChild(renderer.domElement);

      // Subtle starfield behind the ring
      const starCount = 500;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 26;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 13;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 5;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x818cf8,
        size: 0.03,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      // Ring of project cards
      const ring = new THREE.Group();
      scene.add(ring);

      const loader = new THREE.TextureLoader();
      const cardGeo = new THREE.PlaneGeometry(3.0, 1.875);
      const frameGeo = new THREE.PlaneGeometry(3.15, 2.03);
      const cards: {
        mesh: InstanceType<typeof THREE.Mesh>;
        frameMat: InstanceType<typeof THREE.MeshBasicMaterial>;
        mat: InstanceType<typeof THREE.MeshBasicMaterial>;
      }[] = [];
      const disposables: { dispose: () => void }[] = [
        starGeo,
        starMat,
        cardGeo,
        frameGeo,
      ];

      projects.forEach((p, i) => {
        const a = i * STEP;

        const mat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
        });
        loader.load(p.image, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          mat.map = tex;
          mat.needsUpdate = true;
        });
        const mesh = new THREE.Mesh(cardGeo, mat);
        mesh.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS);
        mesh.rotation.y = a;
        mesh.userData.index = i;
        ring.add(mesh);

        // Glowing frame slightly behind the card
        const frameMat = new THREE.MeshBasicMaterial({
          color: 0x6366f1,
          transparent: true,
          opacity: 0.3,
        });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(
          Math.sin(a) * (RADIUS - 0.03),
          0,
          Math.cos(a) * (RADIUS - 0.03)
        );
        frame.rotation.y = a;
        ring.add(frame);

        cards.push({ mesh, frameMat, mat });
        disposables.push(mat, frameMat);
      });

      // --- Rotation state ---
      let rot = 0;
      let targetRot = 0;

      const indexFromTarget = () =>
        ((Math.round(-targetRot / STEP) % N) + N) % N;

      const syncActive = () => {
        const idx = indexFromTarget();
        if (idx !== activeStateRef.current) {
          activeStateRef.current = idx;
          setActive(idx);
        }
      };

      goRef.current = (dir: number) => {
        targetRot -= dir * STEP;
        syncActive();
      };

      // Rotate so card `i` faces the camera via the shortest path
      const rotateTo = (i: number) => {
        const base = -i * STEP;
        const turns = Math.round((targetRot - base) / (Math.PI * 2));
        targetRot = base + turns * Math.PI * 2;
        syncActive();
      };
      jumpRef.current = rotateTo;

      // --- Pointer interaction (drag to spin, click to focus/open) ---
      // Move/up listeners live on window so a drag can leave the canvas
      // without getting stuck (pointer capture proved flaky in testing).
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const canvas = renderer.domElement;
      let dragging = false;
      let lastX = 0;
      let moved = 0;

      const pick = (clientX: number, clientY: number) => {
        const r = canvas.getBoundingClientRect();
        ndc.x = ((clientX - r.left) / r.width) * 2 - 1;
        ndc.y = -(((clientY - r.top) / r.height) * 2 - 1);
        raycaster.setFromCamera(ndc, camera);
        const hits = raycaster.intersectObjects(
          cards.map((c) => c.mesh),
          false
        );
        return hits.length ? (hits[0].object.userData.index as number) : null;
      };

      const onPointerDown = (e: PointerEvent) => {
        dragging = true;
        moved = 0;
        lastX = e.clientX;
        canvas.style.cursor = "grabbing";
      };

      const onHoverMove = (e: PointerEvent) => {
        if (dragging) return;
        canvas.style.cursor =
          pick(e.clientX, e.clientY) !== null ? "pointer" : "grab";
      };

      const onWindowMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        moved += Math.abs(dx);
        targetRot += dx * 0.006;
      };

      const onWindowUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        canvas.style.cursor = "grab";

        if (moved < 6) {
          const hit = pick(e.clientX, e.clientY);
          if (hit !== null) {
            if (hit === activeStateRef.current) {
              window.open(projects[hit].url, "_blank", "noopener,noreferrer");
            } else {
              rotateTo(hit);
            }
            return;
          }
        }
        // Snap to the nearest card after a drag
        targetRot = Math.round(targetRot / STEP) * STEP;
        syncActive();
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onHoverMove);
      window.addEventListener("pointermove", onWindowMove);
      window.addEventListener("pointerup", onWindowUp);
      window.addEventListener("pointercancel", onWindowUp);

      const onResize = () => {
        if (!stage.clientWidth || !stage.clientHeight) return;
        camera.aspect = stage.clientWidth / stage.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(stage.clientWidth, stage.clientHeight);
      };
      window.addEventListener("resize", onResize);

      // Render only while the section is on screen
      let inView = true;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            inView = entry.isIntersecting;
          });
        },
        { rootMargin: "100px" }
      );
      io.observe(stage);

      const clock = new THREE.Clock();
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!inView) return;
        const dt = clock.getDelta();

        rot += (targetRot - rot) * (reduced ? 1 : 0.09);
        ring.rotation.y = rot;
        stars.rotation.y += dt * 0.01;

        cards.forEach(({ mesh, mat, frameMat }, i) => {
          const facing = Math.cos(i * STEP + rot);
          const lift = Math.max(0, facing);
          mat.opacity = 0.28 + 0.72 * Math.max(0, (facing + 0.45) / 1.45);
          frameMat.opacity = 0.1 + 0.5 * lift * lift;
          const s = 0.86 + 0.17 * lift;
          mesh.scale.setScalar(s);
        });

        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onHoverMove);
        window.removeEventListener("pointermove", onWindowMove);
        window.removeEventListener("pointerup", onWindowUp);
        window.removeEventListener("pointercancel", onWindowUp);
        cards.forEach(({ mat }) => mat.map?.dispose());
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
        if (canvas.parentNode === stage) stage.removeChild(canvas);
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  const current = projects[active];

  return (
    <section
      id="projects"
      style={{ position: "relative", padding: "6rem 0 5rem" }}
    >
      <div className="container">
        <ScrollReveal>
          <SectionLabel>Featured Projects</SectionLabel>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>
            Things I&apos;ve built
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="section-subtitle">
            Drag the ring, or tap a card to bring it forward — tap the front
            card to open the project.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={200}>
        <div ref={stageRef} className="ring-stage" aria-hidden="true" />

        {/* Glass console floating over the bottom edge of the stage */}
        <div className="ring-console-wrap">
          <TiltCard maxTilt={2.5} className="glass spotlight-card ring-console">
            <div className="console-index">
              <div>
                <span key={active} className="console-num">
                  {String(active + 1).padStart(2, "0")}
                </span>
                <span className="console-total">
                  {" "}
                  / {String(projects.length).padStart(2, "0")}
                </span>
              </div>
              <div className="console-dots">
                {projects.map((p, i) => (
                  <button
                    key={p.name}
                    className={`console-dot ${i === active ? "on" : ""}`}
                    aria-label={`Go to ${p.name}`}
                    onClick={() => jumpRef.current(i)}
                  />
                ))}
              </div>
            </div>

            <div className="console-divider" aria-hidden="true" />

            <div key={active} className="console-info">
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="console-name"
              >
                {current.name}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
              <p className="console-desc">{current.desc}</p>
              <p className="console-meta">
                {current.tags.slice(0, 4).join("  ·  ")}
              </p>
            </div>

            <div className="console-divider" aria-hidden="true" />

            <div className="console-controls">
              <div className="console-nav">
                <button
                  className="ring-btn"
                  aria-label="Previous project"
                  onClick={() => goRef.current(-1)}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  className="ring-btn"
                  aria-label="Next project"
                  onClick={() => goRef.current(1)}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="console-open"
              >
                <span>Open Project</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </div>
          </TiltCard>
        </div>
      </ScrollReveal>
    </section>
  );
}
