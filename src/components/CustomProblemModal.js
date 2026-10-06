"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCustomProblem } from "@/utils/storage";
import {
  CodeIcon,
  CloseIcon,
  SparklesIcon,
  CheckIcon
} from "@/components/Icons";

export default function CustomProblemModal({ isOpen, onClose }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("Custom Algorithm");
  const [difficulty, setDifficulty] = useState("Medium");
  const [lcNumber, setLcNumber] = useState("");
  const [keyInsight, setKeyInsight] = useState("");
  const [code, setCode] = useState(`class Solution:
    def solve(self, nums: list[int]) -> int:
        # Write or paste your logic here
        pass`);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a problem name.");
      return;
    }
    if (!code.trim()) {
      alert("Please enter Python code to drill.");
      return;
    }

    const cleanCode = code.replace(/\r\n/g, "\n");
    const slug = "custom-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-4);

    const newProblem = {
      id: slug,
      name: name.trim(),
      difficulty,
      lcNumber: lcNumber ? parseInt(lcNumber, 10) || null : null,
      leetcodeUrl: lcNumber ? `https://leetcode.com/problem-list/all-codes/` : null,
      pattern: pattern.trim() || "Custom Pattern",
      signals: ["Custom user-created algorithmic practice drill"],
      intuition: [
        { q: "What is the primary pattern?", a: pattern.trim() || "Custom drill" },
        { q: "Key observation?", a: keyInsight.trim() || "Practice muscle memory and algorithmic speed" }
      ],
      keyInsight: keyInsight.trim() || "Type with high precision and optimal indentation.",
      code: cleanCode
    };

    saveCustomProblem(newProblem);
    onClose();
    router.push(`/practice/${slug}`);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#181818",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
          maxHeight: "90vh",
          overflowY: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(236, 98, 66, 0.12)",
                border: "1px solid rgba(236, 98, 66, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-primary)"
              }}
            >
              <CodeIcon size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 600 }}>
                Create Custom Drill
              </h2>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Paste any LeetCode problem, company interview code, or DSA snippet
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: "6px", width: "28px", height: "28px" }}
          >
            <CloseIcon size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                Problem Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Word Break II or Custom Cache"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141414",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                LC Number (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 140"
                value={lcNumber}
                onChange={(e) => setLcNumber(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141414",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: "0.85rem"
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                Pattern / Category
              </label>
              <input
                type="text"
                placeholder="e.g. Dynamic Programming, Two Pointers"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141414",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: "0.85rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{
                  width: "100%",
                  background: "#141414",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  color: "#fff",
                  fontSize: "0.85rem"
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>
              Key Intuition / Insight Note
            </label>
            <input
              type="text"
              placeholder="e.g. Store prefix sum counts in hash map for O(n) one-pass"
              value={keyInsight}
              onChange={(e) => setKeyInsight(e.target.value)}
              style={{
                width: "100%",
                background: "#141414",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "#fff",
                fontSize: "0.85rem"
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Python Code to Drill *
              </label>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                4-space indentation preserved
              </span>
            </div>
            <textarea
              required
              rows={9}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: "100%",
                background: "#121212",
                border: "1px solid var(--border-subtle)",
                borderRadius: "8px",
                padding: "10px 12px",
                color: "#e2e8f0",
                fontSize: "0.82rem",
                fontFamily: "var(--mono)",
                lineHeight: "1.5",
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              style={{ fontSize: "0.82rem", padding: "8px 16px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ fontSize: "0.82rem", padding: "8px 22px" }}
            >
              <SparklesIcon size={13} />
              <span>Save &amp; Start Drill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
