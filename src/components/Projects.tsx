"use client";

import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const projects = [
  {
    name: "Tic-Tac-Toe",
    desc: "Real-time multiplayer Tic-Tac-Toe platform featuring live spectating, robust concurrency control, and a Minimax-powered AI opponent.",
    tags: ["Next.js", "MiniMax", "PostgreSQL", "Nodejs"],
    url: "https://frontend-tic-tac-toe-pi.vercel.app/",
    color: "#ef4444",
    emoji: "❌⭕",
    image: "/images/projects/tic-tac-toe.png",
  },
  {
    name: "Money-Tracker",
    desc: "Full-stack expense tracking platform featuring interactive dashboard summaries, dynamic categorization, and advanced date filtering.",
    tags: ["Next.js", "ElysiaJS", "PostgreSQL"],
    url: "https://money-tracker-omega-ten.vercel.app",
    color: "#22c55e",
    emoji: "🌿",
    image: "/images/projects/money-tracker.png",
  },
  {
    name: "Real-time-food-order",
    desc: "Interactive point-of-sale and ordering platform managing real-time table assignments, menu item tracking, and transaction finalization.",
    tags: ["Next.js", "ElysiaJS", "Websocket", "PostgreSQL"],
    url: "https://frontend-restaurant-six.vercel.app",
    color: "#8b5cf6",
    emoji: "🧩",
    image: "/images/projects/restaurant-os.png",
  },
  {
    name: "Tinza-Ramdon-VoiceCall",
    desc: "P2P anonymous voice chat platform featuring real-time WebRTC communication, WebSocket signaling, and a dynamic matchmaking algorithm.",
    tags: ["Next.js", "WebRTC", "WebSocket", "ElysiaJS", "PostgreSQL"],
    url: "https://tinza-demo.vercel.app",
    color: "#f59e0b",
    emoji: "💬",
    image: "/images/projects/random-voice.png",
  },
  {
    name: "Baccarat Royale",
    desc: "A dynamic Windows desktop casino simulator featuring Baccarat and Tiger-Dragon, complete with virtual betting, live countdowns, and automated payouts.",
    tags: ["GitHub", "C#", "Developer Tools"],
    url: "https://github.com/Jitwisut/Baccarat-windows-app",
    color: "#06b6d4",
    emoji: "🍱",
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
    emoji: "🏥",
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
    emoji: "⚡",
    image: "/images/projects/askyoudb.png",
  },
];

interface ProjectImageProps {
  src: string;
  alt: string;
  emoji: string;
  color: string;
}

function ProjectImage({ src, alt, emoji, color }: ProjectImageProps) {
  const [imgError, setImgError] = useState(false);

  if (!src || imgError) {
    return (
      <div className="project-card-image-wrap">
        <div className="project-card-placeholder">
          <span className="project-card-placeholder-emoji">{emoji}</span>
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
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

export default function Projects() {
  return (
    <section
      id="projects"
      style={{
        position: "relative",
        padding: "6rem 0",
        overflow: "hidden",
      }}
    >
      <div
        className="floating-orb"
        style={{
          width: 350,
          height: 350,
          background: "rgba(59,130,246,0.05)",
          top: "30%",
          left: "-10%",
          animationDelay: "1s",
        }}
      />

      <div className="container">
        <ScrollReveal>
          <span className="section-label">✦ Featured Projects</span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>
            Things I&apos;ve built
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
            A selection of projects that showcase my skills in full-stack
            development, AI integration, and creative problem-solving.
          </p>
        </ScrollReveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={i * 100}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  display: "block",
                  height: "100%",
                }}
              >
                <div
                  className="project-card"
                  style={{ height: "100%", padding: 0 }}
                >
                  <ProjectImage
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    emoji={project.emoji}
                    color={project.color}
                  />

                  {/* Card Content */}
                  <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <h3
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: "1.15rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {project.name}
                      </h3>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-muted)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginLeft: "auto", flexShrink: 0 }}
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </div>

                    <p
                      style={{
                        fontSize: "0.88rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        marginBottom: "1rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {project.desc}
                    </p>

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

                  {/* Color accent line */}
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
