"use client";

import ScrollReveal from "./ScrollReveal";
import SectionLabel from "./SectionLabel";
import ContactScene from "./ContactScene";

const channels = [
  {
    label: "Email",
    handle: "tanzajitwisut@gmail.com",
    href: "mailto:tanzajitwisut@gmail.com",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    handle: "Jitwisut Thobut",
    href: "https://www.linkedin.com/in/jitwisut-thobut-0a0994357/",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    handle: "@Jitwisut",
    href: "https://github.com/Jitwisut",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    handle: "@txxjit_tb",
    href: "https://www.instagram.com/txxjit_tb/",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding: "9rem 0",
        overflow: "hidden",
      }}
    >
      {/* Interactive constellation behind everything */}
      <ContactScene />

      <div
        className="container contact-grid"
        style={{ position: "relative", zIndex: 10 }}
      >
        {/* Left — statement */}
        <div className="contact-lead">
          <ScrollReveal>
            <SectionLabel>Get In Touch</SectionLabel>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>
              Let&apos;s create something{" "}
              <span className="text-gradient">amazing</span> together
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="section-subtitle">
              Whether you have a project in mind, want to collaborate, or just
              want to say hello — feel free to reach out. I&apos;m always open to
              discussing new opportunities.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="contact-status">
              <span className="contact-status-dot" />
              Available for new opportunities
            </div>
          </ScrollReveal>
        </div>

        {/* Right — channel rows */}
        <div className="contact-channels">
          {channels.map((c, i) => (
            <ScrollReveal key={c.label} direction="right" delay={150 + i * 90}>
              <a
                href={c.href}
                target={c.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="contact-row"
              >
                <span className="contact-row-icon">{c.icon}</span>
                <span className="contact-row-body">
                  <span className="contact-row-label">{c.label}</span>
                  <span className="contact-row-handle">{c.handle}</span>
                </span>
                <svg
                  className="contact-row-arrow"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
