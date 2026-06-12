export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p
            className="footer-text"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            © {new Date().getFullYear()}{" "}
            <a href="#home" style={{ fontWeight: 600 }}>
              Jitwisut Thobut
            </a>
            . Crafted with{" "}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="url(#footer-heart-gradient)"
              aria-label="love"
              style={{ flexShrink: 0 }}
            >
              <defs>
                <linearGradient
                  id="footer-heart-gradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "GitHub", href: "https://github.com/Jitwisut" },
              {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/jitwisut-thobut-0a0994357/",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-text"
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "color 0.3s",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
