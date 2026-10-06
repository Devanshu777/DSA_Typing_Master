"use client";

import {
  ExternalLinkIcon,
  LightbulbIcon,
  CodeIcon,
  ChevronRightIcon,
  CompassIcon
} from "@/components/Icons";

export default function ProblemTab({ problem, onStartTyping }) {
  const difficultyClass =
    problem.difficulty === "Easy"
      ? "badge-easy"
      : problem.difficulty === "Medium"
      ? "badge-medium"
      : "badge-hard";

  return (
    <div className="problem-view" style={{ animation: "fadeIn 0.3s ease" }}>
      <div className="problem-header">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <h2>{problem.name}</h2>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span className={`badge ${difficultyClass}`}>{problem.difficulty}</span>
            {problem.leetcodeUrl && (
              <a
                href={problem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="lc-link"
                style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <ExternalLinkIcon size={12} />
                <span>LeetCode #{problem.lcNumber || ""}</span>
              </a>
            )}
          </div>
        </div>

        <div className="problem-meta" style={{ marginTop: "12px" }}>
          <span className="problem-pattern">Pattern: {problem.pattern}</span>
        </div>
      </div>

      {/* Recognition Signals */}
      {problem.signals && problem.signals.length > 0 && (
        <div className="signals-section">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <CompassIcon size={14} style={{ color: "var(--accent-primary)" }} />
            <h4 style={{ margin: 0 }}>Recognition Signals (Keywords to spot this pattern)</h4>
          </div>
          <div>
            {problem.signals.map((sig, idx) => (
              <span key={idx} className="signal-tag">
                &ldquo;{sig}&rdquo;
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key Insight */}
      {problem.keyInsight && (
        <div className="key-insight">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <LightbulbIcon size={14} style={{ color: "var(--accent-primary)" }} />
            <strong>Core Insight:</strong>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>{problem.keyInsight}</p>
        </div>
      )}

      {/* Questions to ask yourself */}
      {problem.intuition && problem.intuition.length > 0 && (
        <div style={{ marginTop: "28px" }}>
          <h4 style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
            Mental Checklist Before Coding
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {problem.intuition.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-secondary)",
                  padding: "14px 18px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.88rem"
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  Q{idx + 1}: {item.q}
                </div>
                <div style={{ color: "var(--accent-secondary)", fontFamily: "var(--mono)", fontSize: "0.85rem", paddingLeft: "12px", borderLeft: "2px solid var(--accent-secondary)" }}>
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action to switch to typing */}
      <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={onStartTyping}
          className="btn btn-primary"
          style={{ padding: "10px 22px", fontSize: "0.85rem" }}
        >
          <CodeIcon size={15} />
          <span>Start Typing Solution</span>
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </div>
  );
}
