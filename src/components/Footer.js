"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "rgba(10, 10, 15, 0.95)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "32px 24px",
        marginTop: "auto"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "1.2rem" }}>⚡</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.05rem" }}>
              DSA Typing Master
            </span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Designed &amp; Built with <span style={{ color: "#ff4757" }}>❤️</span> by <strong>Devanshu</strong>
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
            &copy; {new Date().getFullYear()} DSA Typing Master. All rights reserved.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem" }}>
            <Link href="/" style={{ color: "var(--text-secondary)" }}>
              Dashboard
            </Link>
            <Link href="/practice" style={{ color: "var(--text-secondary)" }}>
              Practice
            </Link>
            <Link href="/stats" style={{ color: "var(--text-secondary)" }}>
              Analytics
            </Link>
            <a
              href="https://github.com/Devanshu777/DSA_Typing_Master"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-primary)" }}
            >
              GitHub Repo ↗
            </a>
          </div>

          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--text-muted)",
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}
          >
            <span>⌨️ Shortcuts:</span>
            <span><kbd style={{ background: "var(--bg-elevated)", padding: "2px 5px", borderRadius: "3px", border: "1px solid var(--border-subtle)" }}>Tab</kbd> = 4 spaces</span>
            <span><kbd style={{ background: "var(--bg-elevated)", padding: "2px 5px", borderRadius: "3px", border: "1px solid var(--border-subtle)" }}>{`{ } [ ] ( )`}</kbd> = Auto-pair</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
