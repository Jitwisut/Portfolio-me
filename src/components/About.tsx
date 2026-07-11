"use client";

import ScrollReveal from "./ScrollReveal";
import TextReveal from "./TextReveal";
import TiltCard from "./TiltCard";
import SectionLabel from "./SectionLabel";

export default function About() {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        padding: "8rem 0",
        overflow: "hidden",
      }}
    >
      <div
        className="floating-orb"
        style={{
          width: 250,
          height: 250,
          background: "rgba(219,39,119,0.06)",
          top: "20%",
          left: "-5%",
          animationDelay: "2s",
        }}
      />

      <div className="container">
        <ScrollReveal>
          <SectionLabel>About Me</SectionLabel>
        </ScrollReveal>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "3rem",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: "1 1 500px" }}>
            <ScrollReveal delay={100}>
              <h2 className="section-title">
                <TextReveal as="span" staggerMs={50}>
                  Crafting digital experiences with passion &amp; precision
                </TextReveal>
              </h2>
            </ScrollReveal>

            <div style={{ marginBottom: "1.5rem" }}>
              <TextReveal
                className="section-subtitle"
                delay={200}
                staggerMs={30}
              >
                I&apos;m a Computer Engineering student based in Thailand,
                driven by a strong passion for software development and
                cybersecurity. I love blending clean code with intuitive UI/UX
                design to build fast, scalable, and engaging web applications.
              </TextReveal>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <TextReveal
                className="section-subtitle"
                delay={400}
                staggerMs={30}
              >
                I specialize in high-performance tools like Bun, Elysia, and
                Node.js. I take pride in building reliable apps backed by solid
                test cases—such as a real-time multiplayer Tic-Tac-Toe and an
                expense tracker. Beyond coding, I actively explore ethical
                hacking and have competed in the Cyber Top Talent competition.
              </TextReveal>
            </div>

            <div>
              <TextReveal
                className="section-subtitle"
                delay={600}
                staggerMs={30}
              >
                When I&apos;m not debugging code or securing systems,
                you&apos;ll probably find me writing test cases to improve code
                quality, diving into new algorithms, or exploring the latest AI
                trends.
              </TextReveal>
            </div>
          </div>

          <div style={{ flex: "1 1 300px" }}>
            <ScrollReveal direction="right" delay={200}>
              <TiltCard
                maxTilt={3}
                className="glass spotlight-card"
                style={{
                  borderRadius: 20,
                  padding: "2rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    marginBottom: "1.5rem",
                    color: "var(--accent-light)",
                  }}
                >
                  Quick Facts
                </h3>
                {[
                  { label: "Location", value: "Rangsit, Pathumthani" },
                  {
                    label: "Education",
                    value: "Computer Engineering, Rangsit University",
                  },
                  { label: "Experience", value: "Internship / Student" },
                  { label: "Focus", value: "Full-Stack & Design" },
                ].map((item, i, arr) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                      padding: "0.75rem 0",
                      borderBottom:
                        i !== arr.length - 1
                          ? "1px solid var(--border-color)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: "var(--text-primary)",
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        textAlign: "right",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
