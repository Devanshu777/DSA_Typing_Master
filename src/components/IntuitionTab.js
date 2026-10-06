"use client";

import { useState } from "react";
import {
  LightbulbIcon,
  SparklesIcon,
  CodeIcon,
  ChevronRightIcon,
  CompassIcon
} from "@/components/Icons";

export default function IntuitionTab({ problem, onStartTyping }) {
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const toggleReveal = (idx) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const revealAll = () => {
    const all = {};
    (problem.intuition || []).forEach((_, idx) => {
      all[idx] = true;
    });
    setRevealedAnswers(all);
  };

  return (
    <div className="intuition-view" style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <LightbulbIcon size={18} style={{ color: "var(--accent-primary)" }} />
            <h2 style={{ fontSize: "1.4rem", margin: 0 }}>
              Algorithmic Intuition &amp; Logic Drill
            </h2>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "4px" }}>
            Test your pattern intuition before writing the solution code.
          </p>
        </div>
        <button
          onClick={revealAll}
          className="btn btn-ghost"
          style={{ fontSize: "0.78rem" }}
        >
          Reveal All Answers
        </button>
      </div>

      {problem.keyInsight && (
        <div className="key-insight" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <SparklesIcon size={14} style={{ color: "var(--accent-primary)" }} />
            <strong>Key Algorithmic Insight:</strong>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>{problem.keyInsight}</p>
        </div>
      )}

      <div className="intuition-list">
        {(problem.intuition || []).map((item, idx) => {
          const isRevealed = !!revealedAnswers[idx];

          return (
            <div key={idx} className="qa-card">
              <div className="question">
                <span>{item.q}</span>
              </div>

              {isRevealed ? (
                <div className="answer" style={{ animation: "fadeIn 0.2s ease" }}>
                  {item.a}
                </div>
              ) : (
                <div style={{ paddingLeft: "32px", marginTop: "8px" }}>
                  <button
                    onClick={() => toggleReveal(idx)}
                    className="btn btn-ghost"
                    style={{ fontSize: "0.75rem", padding: "5px 12px", gap: "6px" }}
                  >
                    <CompassIcon size={13} />
                    <span>Reveal Intuition</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
