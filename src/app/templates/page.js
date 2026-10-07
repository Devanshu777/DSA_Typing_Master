"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { templatesData, templateCategories } from "@/data/templates";
import {
  TemplateIcon,
  LightningIcon,
  SearchIcon,
  ChevronRightIcon
} from "@/components/Icons";

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    return templatesData.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" || t.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.signals.some((s) => s.toLowerCase().includes(q)) ||
        t.keyInsight.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "32px 20px 80px 20px", width: "100%" }}>
      {/* Header Banner */}
      <div style={{ marginBottom: "32px", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "rgba(236, 98, 66, 0.12)",
              border: "1px solid rgba(236, 98, 66, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-primary)"
            }}
          >
            <TemplateIcon size={18} />
          </div>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.5px", color: "var(--accent-primary)", textTransform: "uppercase" }}>
            Pattern Skeletons
          </span>
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.5px" }}>
          Canonical Algorithm Templates
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "680px", lineHeight: 1.5 }}>
          Master the exact foundational algorithm archetypes that power 95% of LeetCode interviews.
          Drill each pure template until writing pointers, window slides, and boundary invariants becomes second nature.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "28px"
        }}
      >
        {/* Search Input */}
        <div style={{ position: "relative", maxWidth: "420px" }}>
          <SearchIcon
            size={16}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none"
            }}
          />
          <input
            type="text"
            placeholder="Search templates (e.g. sliding window, binary search, O(n)...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              background: "var(--bg-input)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: "0.88rem",
              outline: "none",
              transition: "border-color 0.15s ease"
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {templateCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: isActive
                    ? "1px solid var(--accent-primary)"
                    : "1px solid var(--border-subtle)",
                  background: isActive
                    ? "var(--accent-primary-glow)"
                    : "var(--bg-card)",
                  color: isActive
                    ? "var(--accent-primary)"
                    : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Count Badge */}
      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
        Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? "template" : "templates"}
      </div>

      {/* Grid of Templates */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "18px"
        }}
      >
        {filteredTemplates.map((t) => (
          <div
            key={t.id}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "var(--shadow-sm)",
              transition: "transform 0.15s ease, border-color 0.15s ease"
            }}
          >
            <div>
              {/* Category & Complexity Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px"
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "var(--accent-primary)"
                  }}
                >
                  {t.category}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(34, 197, 94, 0.1)",
                      color: "var(--accent-secondary)",
                      border: "1px solid rgba(34, 197, 94, 0.2)"
                    }}
                  >
                    Time {t.timeComplexity}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(245, 158, 11, 0.1)",
                      color: "#f59e0b",
                      border: "1px solid rgba(245, 158, 11, 0.2)"
                    }}
                  >
                    Space {t.spaceComplexity}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: "1.12rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
                {t.name}
              </h3>

              {/* Key Insight */}
              <p
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.45,
                  marginBottom: "14px"
                }}
              >
                {t.keyInsight}
              </p>

              {/* Recognition Signals */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>
                  Recognition Signals
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {t.signals.map((sig, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "0.74rem",
                        background: "var(--bg-elevated)",
                        color: "var(--text-secondary)",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        border: "1px solid var(--border-subtle)"
                      }}
                    >
                      → {sig}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Skeleton Preview */}
              <div
                style={{
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 12px",
                  fontSize: "0.76rem",
                  fontFamily: "var(--mono)",
                  color: "var(--text-muted)",
                  overflow: "hidden",
                  whiteSpace: "pre",
                  maxHeight: "92px",
                  marginBottom: "16px",
                  opacity: 0.85
                }}
              >
                {t.code}
              </div>
            </div>

            {/* Drill Button */}
            <Link
              href={`/templates/${t.id}`}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "9px 14px",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
            >
              <LightningIcon size={14} />
              <span>Drill Skeleton</span>
              <ChevronRightIcon size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
