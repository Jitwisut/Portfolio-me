"use client";

import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding: "6rem 0",
        overflow: "hidden",
      }}
    >
      <div
        className="floating-orb"
        style={{
          width: 200,
          height: 200,
          background: "rgba(6,182,212,0.06)",
          top: "10%",
          right: "5%",
          animationDelay: "5s",
        }}
      />

      <div className="container" style={{ maxWidth: 700, textAlign: "center" }}>
        <ScrollReveal>
          <span className="section-label">✦ Get In Touch</span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Let&apos;s create something{" "}
            <span style={{ color: "var(--accent-cyan)" }}>amazing</span>{" "}
            together
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p
            className="section-subtitle"
            style={{ margin: "0 auto 2.5rem", textAlign: "center" }}
          >
            Whether you have a project in mind, want to collaborate, or just
            want to say hello — feel free to reach out. I&apos;m always open to
            discussing new opportunities.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "3rem",
            }}
          >
            <a href="mailto:tanzajitwisut@gmail.com" className="btn-primary">
              <span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: 8,
                  }}
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Send an Email
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/jitwisut-thobut-0a0994357/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <span>LinkedIn</span>
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div
            className="glass"
            style={{
              borderRadius: 16,
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                marginBottom: "1rem",
              }}
            >
              Find me on
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "GitHub", href: "https://github.com/Jitwisut" },

                {
                  label: "Instagram",
                  href: "https://www.instagram.com/txxjit_tb/",
                },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="skill-badge"
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
