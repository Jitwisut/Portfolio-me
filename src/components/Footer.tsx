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
          <p className="footer-text">
            © {new Date().getFullYear()}{" "}
            <a href="#home" style={{ fontWeight: 600 }}>
              Jitwisut Thobut
            </a>
            . Crafted with 💙
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
