"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";
import TiltCard from "./TiltCard";

type Project = {
  name: string;
  desc: string;
  tags: string[];
  url?: string;
  image: string;
};

const projects: Project[] = [
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
    name: "Priya Thai Massage",
    desc: "Luxury Thai massage sanctuary website with online booking, Resend email notifications, ICS calendar attachments, and immersive motion-driven storytelling — serving a premium spa in Domžale, Slovenia.",
    tags: ["Next.js", "Motion", "Resend", "ICS"],
    url: "https://priyathaimassage.com",
    image: "/images/projects/priya-thai-massage.png",
  },
  {
    name: "AskYourDB",
    desc: "AI-powered SQL assistant built with LangChain, FastAPI, and GPT-4o.",
    tags: ["Python", "FastAPI", "LangChain", "OpenAI API"],
    url: "https://github.com/Jitwisut/AI-Driven-Data-Analytics",
    image: "/images/projects/askyoudb.png",
  },
  {
    name: "Wakaclock",
    desc: "Self-hosted WakaTime replacement written in Rust. Ditches file-extension guessing for tree-sitter AST detection, streams heartbeats through ClickHouse Materialized Views for zero app-level aggregation, and uniquely tracks AI-generated lines vs human keystrokes — so you actually know who wrote your code.",
    tags: ["Rust", "ClickHouse", "Axum", "tree-sitter", "Tauri"],
    url: "https://github.com/Jitwisut/wakaclock",
    image: "/images/projects/wakaclock.png",
  },
  {
    name: "Notification Payment Detection",
    desc: "MVP PromptPay payment gateway that detects payment without bank API access: a Windows agent reads toast notifications and a LINE PC OCR watcher reads bank slip cards, both signing and posting to a Node.js backend that matches pending payment intents (exact-amount, OCR time-FIFO, or provider-reference strategies) and fires an HMAC-signed webhook back to the merchant.",
    tags: ["Node.js", "C# / WPF", "OCR", "PromptPay", "HMAC Webhooks"],
    image: "/images/projects/notification-payment-detection.png",
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
      // Cards sit on a shallow arc but stay billboarded (facing the camera),
      // so neighbours recede in depth instead of being sheared into the
      // unreadable trapezoids a full 360° ring produced.
      const CANVAS_W = 1280;
      const CANVAS_H = 860;
      const CARD_W = 3.6;
      const CARD_H = CARD_W * (CANVAS_H / CANVAS_W);
      const ARC_ANGLE = 0.5; // radians of arc between neighbouring cards
      const ARC_RADIUS = 6.4;
      const VISIBLE = 2.5; // cards further than this from centre are culled
      const TILT = 0.09; // a few degrees toward centre — reads curved, no shear
      const FOV = 45;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        FOV,
        stage.clientWidth / stage.clientHeight,
        0.1,
        100
      );

      // Frame the active card the same way at every viewport: pull back far
      // enough to clear its height, and on narrow/portrait stages far enough
      // to clear its width too (which is what makes it degrade to a clean
      // one-card-plus-peek carousel on mobile).
      const fitCamera = () => {
        const aspect = stage.clientWidth / Math.max(1, stage.clientHeight);
        const t = 2 * Math.tan((FOV * Math.PI) / 360);
        camera.aspect = aspect;
        camera.position.set(
          0,
          0.06,
          Math.max((CARD_H * 1.4) / t, (CARD_W * 1.15) / (t * aspect))
        );
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      };
      fitCamera();

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
        color: 0xdb2777,
        size: 0.035,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      // --- Cards: each one is a browser window painted into a canvas texture,
      // so the screenshot arrives already framed, rounded and labelled. ---
      const PAD = 44; // canvas margin the drop shadow bleeds into
      const BAR_H = 72;

      const rr = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) => {
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, w, h, r);
          return;
        }
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };

      const hostLabel = (p: Project) => {
        if (!p.url) return "private repository";
        try {
          const u = new URL(p.url);
          const host = u.hostname.replace(/^www\./, "");
          // Bare "github.com" would label four different cards identically —
          // keep the repo path so every neighbour stays identifiable.
          const repo = u.pathname.split("/").filter(Boolean).slice(0, 2).join("/");
          return host === "github.com" && repo ? `${host}/${repo}` : host;
        } catch {
          return p.name.toLowerCase();
        }
      };

      const paintCard = (
        ctx: CanvasRenderingContext2D,
        p: Project,
        img: HTMLImageElement | null
      ) => {
        const w = CANVAS_W - PAD * 2;
        const h = CANVAS_H - PAD * 2;
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.save();
        ctx.shadowColor = "rgba(190, 24, 93, 0.26)";
        ctx.shadowBlur = 38;
        ctx.shadowOffsetY = 16;
        ctx.fillStyle = "#ffffff";
        rr(ctx, PAD, PAD, w, h, 26);
        ctx.fill();
        ctx.restore();

        ctx.save();
        rr(ctx, PAD, PAD, w, h, 26);
        ctx.clip();

        // Screenshot, cover-fitted below the chrome bar and top-aligned so the
        // interesting part of a tall page stays visible.
        const cy = PAD + BAR_H;
        const ch = h - BAR_H;
        if (img && img.naturalWidth) {
          const s = Math.max(w / img.naturalWidth, ch / img.naturalHeight);
          const dw = img.naturalWidth * s;
          ctx.drawImage(img, PAD + (w - dw) / 2, cy, dw, img.naturalHeight * s);
        } else {
          const g = ctx.createLinearGradient(PAD, cy, PAD + w, cy + ch);
          g.addColorStop(0, "#FDF2F8");
          g.addColorStop(1, "#FCE7F3");
          ctx.fillStyle = g;
          ctx.fillRect(PAD, cy, w, ch);
        }

        // Browser chrome bar
        ctx.fillStyle = "#FFF5F9";
        ctx.fillRect(PAD, PAD, w, BAR_H);
        ctx.fillStyle = "rgba(219, 39, 119, 0.14)";
        ctx.fillRect(PAD, PAD + BAR_H - 1, w, 1);
        ["#F472B6", "#F9A8D4", "#FBCFE8"].forEach((c, i) => {
          ctx.beginPath();
          ctx.arc(PAD + 32 + i * 27, PAD + BAR_H / 2, 8, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.fill();
        });
        const pillX = PAD + 124;
        ctx.fillStyle = "#ffffff";
        rr(ctx, pillX, PAD + 15, w - 164, BAR_H - 30, 21);
        ctx.fill();
        ctx.fillStyle = "#9D174D";
        ctx.font =
          '400 24px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        ctx.textBaseline = "middle";
        ctx.fillText(hostLabel(p), pillX + 24, PAD + BAR_H / 2 + 1);
        ctx.restore();

        ctx.strokeStyle = "rgba(219, 39, 119, 0.2)";
        ctx.lineWidth = 2;
        rr(ctx, PAD + 1, PAD + 1, w - 2, h - 2, 25);
        ctx.stroke();
      };

      const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      const cards: {
        mesh: InstanceType<typeof THREE.Mesh>;
        mat: InstanceType<typeof THREE.MeshBasicMaterial>;
      }[] = [];
      const disposables: { dispose: () => void }[] = [starGeo, starMat, cardGeo];
      const pendingImages: HTMLImageElement[] = [];

      projects.forEach((p, i) => {
        const canvas = document.createElement("canvas");
        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        paintCard(ctx, p, null);

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(cardGeo, mat);
        mesh.userData.index = i;
        scene.add(mesh);

        const img = new Image();
        img.onload = () => {
          if (disposed) return;
          paintCard(ctx, p, img);
          tex.needsUpdate = true;
        };
        img.src = p.image;
        pendingImages.push(img);

        cards.push({ mesh, mat });
        disposables.push(mat, tex);
      });

      // --- Position state (a continuous, unbounded card index) ---
      let pos = 0;
      let targetPos = 0;

      // Shortest signed distance from card `i` to the centre, so the wall
      // wraps around instead of dead-ending at the first and last project.
      const wrapDelta = (d: number) => (((d + N / 2) % N) + N) % N - N / 2;

      const syncActive = () => {
        const idx = ((Math.round(targetPos) % N) + N) % N;
        if (idx !== activeStateRef.current) {
          activeStateRef.current = idx;
          setActive(idx);
        }
      };

      goRef.current = (dir: number) => {
        targetPos += dir;
        syncActive();
      };

      // Bring card `i` to the centre via the shortest path
      const centerOn = (i: number) => {
        targetPos = i + Math.round((targetPos - i) / N) * N;
        syncActive();
      };
      jumpRef.current = centerOn;

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
          cards.filter((c) => c.mesh.visible).map((c) => c.mesh),
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
        // Dragging roughly one card-width across the stage advances one card.
        targetPos -= dx / (stage.clientWidth * 0.34);
      };

      const onWindowUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        canvas.style.cursor = "grab";

        if (moved < 6) {
          const hit = pick(e.clientX, e.clientY);
          if (hit !== null) {
            if (hit === activeStateRef.current) {
              const hitUrl = projects[hit].url;
              if (hitUrl) window.open(hitUrl, "_blank", "noopener,noreferrer");
            } else {
              centerOn(hit);
            }
            return;
          }
        }
        // Snap to the nearest card after a drag
        targetPos = Math.round(targetPos);
        syncActive();
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onHoverMove);
      window.addEventListener("pointermove", onWindowMove);
      window.addEventListener("pointerup", onWindowUp);
      window.addEventListener("pointercancel", onWindowUp);

      const onResize = () => {
        if (!stage.clientWidth || !stage.clientHeight) return;
        fitCamera();
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

        pos += (targetPos - pos) * (reduced ? 1 : 0.12);
        stars.rotation.y += dt * 0.01;

        cards.forEach(({ mesh, mat }, i) => {
          const d = wrapDelta(i - pos);
          const ad = Math.abs(d);
          mesh.visible = ad <= VISIBLE;
          if (!mesh.visible) return;

          const a = d * ARC_ANGLE;
          mesh.position.set(
            Math.sin(a) * ARC_RADIUS,
            0,
            (Math.cos(a) - 1) * ARC_RADIUS
          );
          mesh.rotation.y = -d * TILT;
          mesh.scale.setScalar(1 - ad * 0.07);
          mat.opacity =
            ad <= 1 ? 1 - ad * 0.2 : Math.max(0, 0.8 - (ad - 1) * 0.55);
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
        pendingImages.forEach((img) => {
          img.onload = null;
        });
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
            Drag sideways, or tap a card to bring it to the front — tap the
            front card to open the project.
          </p>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={200}>
        <div ref={stageRef} className="ring-stage" aria-hidden="true" />

        {/* Caption sits below the stage so it never crops the active card */}
        <div className="ring-console-wrap">
          <TiltCard maxTilt={2.5} className="glass spotlight-card ring-console">
            <div className="console-index">
              <span key={active} className="console-num">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="console-total">
                / {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            <div className="console-divider" aria-hidden="true" />

            <div key={active} className="console-info">
              {current.url ? (
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
              ) : (
                <span className="console-name">{current.name}</span>
              )}
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
              {current.url ? (
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
              ) : (
                <span className="console-open console-open-private">
                  Private repository
                </span>
              )}
            </div>

            <div className="console-dots">
              {projects.map((p, i) => (
                <button
                  key={p.name}
                  className={`console-dot ${i === active ? "on" : ""}`}
                  aria-label={`Go to ${p.name}`}
                  aria-current={i === active}
                  onClick={() => jumpRef.current(i)}
                />
              ))}
            </div>
          </TiltCard>
        </div>
      </ScrollReveal>
    </section>
  );
}
