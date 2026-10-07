"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { templatesData, getTemplateById } from "@/data/templates";
import TypingEngine from "@/components/TypingEngine";
import {
  TemplateIcon,
  ChevronRightIcon
} from "@/components/Icons";

export default function TemplateDrillPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug;

  const currentIdx = useMemo(() => {
    return templatesData.findIndex((t) => t.id === slug);
  }, [slug]);

  const template = currentIdx !== -1 ? templatesData[currentIdx] : null;

  const nextTemplate = useMemo(() => {
    if (currentIdx === -1) return null;
    return templatesData[(currentIdx + 1) % templatesData.length];
  }, [currentIdx]);

  const prevTemplate = useMemo(() => {
    if (currentIdx === -1) return null;
    return templatesData[(currentIdx - 1 + templatesData.length) % templatesData.length];
  }, [currentIdx]);

  if (!template) {
    return (
      <div style={{ maxWidth: "800px", margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
        <h2 style={{ fontSize: "1.6rem", marginBottom: "12px" }}>Template Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
          The requested algorithm skeleton does not exist or has been moved.
        </p>
        <Link href="/templates" className="btn btn-primary">
          Back to All Templates
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    if (nextTemplate) router.push(`/templates/${nextTemplate.id}`);
  };

  const handlePrev = () => {
    if (prevTemplate) router.push(`/templates/${prevTemplate.id}`);
  };

  // Convert template data to TypingEngine problem structure
  const problemAdapter = {
    id: template.id,
    name: template.name,
    category: template.category,
    pattern: `${template.category} Template`,
    difficulty: template.difficulty,
    code: template.code,
    signals: template.signals,
    keyInsight: template.keyInsight,
    timeComplexity: template.timeComplexity,
    spaceComplexity: template.spaceComplexity
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 20px 60px 20px", width: "100%" }}>
      {/* Breadcrumb Navigation & Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <Link href="/templates" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
            ← All Templates
          </Link>
          <span>/</span>
          <span style={{ color: "var(--text-muted)" }}>{template.category}</span>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{template.name}</span>
        </div>

        {/* Complexity Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "0.76rem",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "4px",
              background: "rgba(34, 197, 94, 0.1)",
              color: "var(--accent-secondary)",
              border: "1px solid rgba(34, 197, 94, 0.25)"
            }}
          >
            Time {template.timeComplexity}
          </span>
          <span
            style={{
              fontSize: "0.76rem",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "4px",
              background: "rgba(245, 158, 11, 0.1)",
              color: "#f59e0b",
              border: "1px solid rgba(245, 158, 11, 0.25)"
            }}
          >
            Space {template.spaceComplexity}
          </span>
          <span
            className="badge"
            style={{
              fontSize: "0.76rem",
              background: "var(--accent-primary-glow)",
              color: "var(--accent-primary)",
              border: "1px solid var(--border-subtle)"
            }}
          >
            {template.difficulty}
          </span>
        </div>
      </div>

      {/* Mental Model & Signals Summary Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "14px 18px",
          marginBottom: "18px"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "rgba(236, 98, 66, 0.12)",
              border: "1px solid rgba(236, 98, 66, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-primary)",
              flexShrink: 0,
              marginTop: "2px"
            }}
          >
            <TemplateIcon size={15} />
          </div>
          <div>
            <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Core Mental Model
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.45 }}>
              {template.keyInsight}
            </div>
          </div>
        </div>

        {/* Signals */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", paddingTop: "8px", borderTop: "1px solid var(--border-subtle)" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginRight: "4px" }}>
            Signals:
          </span>
          {template.signals.map((sig, i) => (
            <span
              key={i}
              style={{
                fontSize: "0.74rem",
                background: "var(--bg-elevated)",
                color: "var(--text-secondary)",
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)"
              }}
            >
              {sig}
            </span>
          ))}
        </div>
      </div>

      {/* Main Interactive Typing Engine */}
      <TypingEngine
        problem={problemAdapter}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
