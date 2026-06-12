"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";

const projects = [
  {
    name: "Tic-Tac-Toe",
    desc: "Real-time multiplayer Tic-Tac-Toe platform featuring live spectating, robust concurrency control, and a Minimax-powered AI opponent.",
    tags: ["Next.js", "MiniMax", "PostgreSQL", "Nodejs"],
    url: "https://frontend-tic-tac-toe-pi.vercel.app/",
    color: "#ef4444",
    image: "/images/projects/tic-tac-toe.png",
  },
  {
    name: "Money-Tracker",
    desc: "Full-stack expense platform with AI-powered slip scanning for automated logging, interactive dashboard summaries, and dynamic data filtering.",
    tags: ["Next.js", "ElysiaJS", "PostgreSQL"],
    url: "https://money-tracker-omega-ten.vercel.app",
    color: "#22c55e",
    image: "/images/projects/money-tracker.png",
  },
  {
    name: "Real-time-food-order",
    desc: "Interactive point-of-sale and ordering platform managing real-time table assignments, menu item tracking, and transaction finalization.",
    tags: ["Next.js", "ElysiaJS", "Websocket", "PostgreSQL"],
    url: "https://frontend-restaurant-six.vercel.app",
    color: "#8b5cf6",
    image: "/images/projects/restaurant-os.png",
  },
  {
    name: "Tinza-Ramdon-VoiceCall",
    desc: "P2P anonymous voice chat platform featuring real-time WebRTC communication, WebSocket signaling, and a dynamic matchmaking algorithm.",
    tags: ["Next.js", "WebRTC", "WebSocket", "ElysiaJS", "PostgreSQL"],
    url: "https://tinza-demo.vercel.app",
    color: "#f59e0b",
    image: "/images/projects/random-voice.png",
  },
  {
    name: "Baccarat Royale",
    desc: "A dynamic Windows desktop casino simulator featuring Baccarat and Tiger-Dragon, complete with virtual betting, live countdowns, and automated payouts.",
    tags: ["GitHub", "C#", "Developer Tools"],
    url: "https://github.com/Jitwisut/Baccarat-windows-app",
    color: "#06b6d4",
    image: "/images/projects/bacarat.png",
  },
  {
    name: "AegisFace AI",
    desc: "High-security healthcare biometric system using DeepFace for 15-angle facial recognition.",
    tags: [
      "Python",
      "Deepface",
      "Pandas & CSV",
      "VGG-Face Model",
      "TensorFlow / Keras",
      "OpenCV",
      "WebRTC",
      "Pillow",
    ],
    url: "https://github.com/Jitwisut/web-deepface",
    color: "#ec4899",
    image: "/images/projects/deepface.png",
  },
  {
    name: "AskYourDB",
    desc: "AI-powered SQL assistant built with LangChain, FastAPI, and GPT-4o.",
    tags: [
      "Python",
      "FastAPI",
      "LangChain",
      "OpenAI API",
      "Sqlite",
      "Streamlit",
    ],
    url: "https://github.com/Jitwisut/AI-Driven-Data-Analytics",
    color: "#3b82f6",
    image: "/images/projects/askyoudb.png",
  },
];

interface ProjectImageProps {
  src: string;
  alt: string;
  name: string;
  color: string;
}

function ProjectImage({ src, alt, name, color }: ProjectImageProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="project-card-image-wrap">
        <div className="project-card-placeholder">
          <span className="project-card-placeholder-mono">
            {name.charAt(0).toUpperCase()}
          </span>
          <span className="project-card-placeholder-text">
            Screenshot coming soon
          </span>
        </div>
        <div
          className="project-card-image-overlay"
          style={{
            background: `linear-gradient(180deg, transparent 40%, ${color}15 100%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div className="project-card-image-wrap">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 680px"
        style={{ objectFit: "cover" }}
        className="project-card-img"
        onError={() => setImgError(true)}
      />
      <div
        className="project-card-image-overlay"
        style={{
          background: `linear-gradient(180deg, transparent 40%, ${color}15 100%)`,
        }}
      />
    </div>
  );
}

// Per-card resting tilt/offset so the stack reads as a casually piled deck
const baseRot = (i: number) =>
  (i % 2 === 0 ? 1 : -1) * (2.5 + ((i * 137) % 30) / 10);
const baseX = (i: number) => (i % 3 === 0 ? -1 : 1) * (10 + ((i * 89) % 18));

export default function Projects() {
  const n = projects.length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let raf = 0;

    const update = () => {
      const wrap = scrollRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      const global = progress * (n - 1);

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const local = global - i;

        if (local <= 0) {
          // Waiting in the stack, each card at its own tilt/offset; the
          // active card keeps a small residual tilt so the pile never
          // looks perfectly straightened
          const depth = Math.min(-local, 3);
          const k = 0.18 + 0.82 * Math.min(depth, 1);
          card.style.transform = reduced
            ? ""
            : `translate(${(baseX(i) * k).toFixed(1)}px, ${(depth * -26).toFixed(1)}px) rotate(${(baseRot(i) * k).toFixed(2)}deg) scale(${(1 - depth * 0.05).toFixed(3)})`;
          card.style.opacity = Math.max(1 - depth * 0.3, 0).toFixed(3);
          card.style.visibility = depth >= 3 ? "hidden" : "visible";
        } else {
          // Leaving: from the residual tilt, rotate further and drift up
          // like a card tossed off the pile
          const t = Math.min(local, 1);
          const rot = baseRot(i) * 0.18 * (1 - t) + -13 * t;
          const x = baseX(i) * 0.18 * (1 - t);
          card.style.transform = reduced
            ? ""
            : `translateY(${(t * -120).toFixed(1)}%) translateX(${x.toFixed(1)}px) translateX(${(t * 7).toFixed(1)}%) rotate(${rot.toFixed(2)}deg)`;
          card.style.opacity = Math.max(1 - t * 1.2, 0).toFixed(3);
          card.style.visibility = t >= 0.98 ? "hidden" : "visible";
        }
      });

      const idx = Math.min(Math.round(global), n - 1);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  return (
    <section id="projects" style={{ position: "relative" }}>
      <div className="container" style={{ paddingTop: "6rem" }}>
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
            A selection of projects that showcase my skills in full-stack
            development, AI integration, and creative problem-solving. Keep
            scrolling — the deck flips through each one.
          </p>
        </ScrollReveal>
      </div>

      {/* Scroll room: the pinned stage stays while cards swap */}
      <div
        ref={scrollRef}
        className="deck-scroll"
        style={{ height: `${100 + (n - 1) * 70}vh` }}
      >
        <div className="deck-pin">
          {projects.map((project, i) => (
            <div
              key={project.name}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="deck-card"
              style={{
                zIndex: n - i,
                pointerEvents: active === i ? "auto" : "none",
              }}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} — open project`}
                aria-hidden={active !== i}
                tabIndex={active === i ? 0 : -1}
              >
                <div className="project-card">
                  <ProjectImage
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    name={project.name}
                    color={project.color}
                  />

                  <div className="project-card-body">
                    <div className="project-card-title-row">
                      <h3 className="project-card-title">{project.name}</h3>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="project-card-arrow"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </div>

                    <p className="project-card-desc">{project.desc}</p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                      }}
                    >
                      {project.tags.map((tag) => (
                        <span key={tag} className="tech-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: "1.5rem",
                      right: "1.5rem",
                      height: 2,
                      background: `linear-gradient(90deg, ${project.color}, transparent)`,
                      borderRadius: 2,
                      opacity: 0.6,
                    }}
                  />
                </div>
              </a>
            </div>
          ))}

          {/* Counter + progress */}
          <div className="deck-ui" aria-hidden="true">
            <span
              key={active}
              className="deck-name"
              style={{ animation: "fadeSlideIn 0.35s ease" }}
            >
              {projects[active].name}
            </span>
            <div className="deck-progress">
              <div ref={fillRef} className="deck-progress-fill" />
            </div>
            <span className="deck-counter">
              <strong>{String(active + 1).padStart(2, "0")}</strong> /{" "}
              {String(n).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
