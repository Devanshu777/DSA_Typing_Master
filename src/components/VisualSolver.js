"use client";

import { useState, useEffect } from "react";
import { getProblemVisualizer } from "@/data/problemVisualizers";
import {
  PlayIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  SparklesIcon,
  BookOpenIcon
} from "@/components/Icons";

export default function VisualSolver({ problem }) {
  const visualData = getProblemVisualizer(problem);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset to step 0 when problem changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [problem?.id]);

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && visualData && visualData.steps.length > 1) {
      timer = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < visualData.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2600);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, visualData]);

  if (!visualData || !visualData.steps || visualData.steps.length === 0) {
    return null;
  }

  const steps = visualData.steps;
  const currentStep = steps[currentStepIdx] || steps[0];
  const isLastStep = currentStepIdx === steps.length - 1;
  const isFirstStep = currentStepIdx === 0;

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIdx(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1));
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const togglePlay = () => {
    if (isLastStep) {
      setCurrentStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  // Check if an index is in the sliding window
  const isInWindow = (idx) => {
    if (currentStep.window && currentStep.window.start !== undefined && currentStep.window.end !== undefined) {
      return idx >= currentStep.window.start && idx <= currentStep.window.end;
    }
    if (currentStep.windowStart !== undefined && currentStep.windowEnd !== undefined) {
      return idx >= currentStep.windowStart && idx <= currentStep.windowEnd;
    }
    return false;
  };

  // Get active pointers for a given index
  const getPointersForIndex = (idx) => {
    const list = [];
    if (currentStep.pointers) {
      Object.entries(currentStep.pointers).forEach(([name, pos]) => {
        if (pos === idx) list.push(name);
      });
    }
    if (currentStep.left === idx) list.push("L");
    if (currentStep.right === idx) list.push("R");
    if (currentStep.mid === idx) list.push("MID");
    if (currentStep.pointerIndex === idx && list.length === 0) list.push("i");
    return Array.from(new Set(list));
  };

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        marginBottom: "24px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        position: "relative"
      }}
    >
      {/* Top Header: Title & Step Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "14px",
          marginBottom: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              background: "rgba(236, 98, 66, 0.14)",
              border: "1px solid rgba(236, 98, 66, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-primary)"
            }}
          >
            <SparklesIcon size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.05rem", margin: 0, fontWeight: 700, color: "var(--text-primary)" }}>
              {visualData.title}
            </h3>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Visual step-by-step problem solver for this example
            </span>
          </div>
        </div>

        {/* Step Navigation Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            onClick={togglePlay}
            className={`btn ${isPlaying ? "btn-primary" : "btn-ghost"}`}
            style={{ height: "30px", padding: "0 10px", fontSize: "0.75rem", gap: "5px" }}
            title={isPlaying ? "Pause auto-walkthrough" : "Auto-play visual dry run"}
          >
            <PlayIcon size={11} />
            <span>{isPlaying ? "Pause" : isLastStep ? "Replay" : "Play"}</span>
          </button>
          <button
            onClick={handleRestart}
            className="btn btn-ghost"
            style={{ height: "30px", padding: "0 8px" }}
            title="Reset to step 1"
          >
            <RotateCcwIcon size={12} />
          </button>
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className="btn btn-ghost"
            style={{ height: "30px", padding: "0 10px", fontSize: "0.75rem", gap: "4px" }}
          >
            <ChevronLeftIcon size={13} />
            <span>Prev</span>
          </button>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.78rem",
              padding: "2px 8px",
              color: "var(--text-secondary)",
              minWidth: "68px",
              textAlign: "center"
            }}
          >
            {currentStepIdx + 1} / {steps.length}
          </span>
          <button
            onClick={handleNext}
            disabled={isLastStep}
            className="btn btn-primary"
            style={{ height: "30px", padding: "0 12px", fontSize: "0.75rem", gap: "4px" }}
          >
            <span>Next</span>
            <ChevronRightIcon size={13} />
          </button>
        </div>
      </div>

      {/* Concrete Respective Example Context Card */}
      {visualData.exampleInput && (
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            border: "1px solid var(--border-subtle)",
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <BookOpenIcon size={13} style={{ color: "var(--accent-primary)" }} />
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Problem Example Walkthrough
              </span>
            </div>
            {visualData.exampleOutput && (
              <span style={{ fontSize: "0.76rem", fontFamily: "var(--mono)", color: "var(--accent-secondary)", background: "rgba(34, 197, 94, 0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                Expected Output: <strong>{visualData.exampleOutput}</strong>
              </span>
            )}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", color: "var(--text-code)", wordBreak: "break-word" }}>
            {visualData.exampleInput}
          </div>
          {visualData.exampleExplanation && (
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              <strong style={{ color: "var(--text-secondary)" }}>Explanation: </strong>
              {visualData.exampleExplanation}
            </div>
          )}
        </div>
      )}

      {/* Step Progress Dots / Indicator Bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "18px" }}>
        {steps.map((s, idx) => {
          const isActive = idx === currentStepIdx;
          const isPassed = idx < currentStepIdx;
          return (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(idx);
              }}
              style={{
                flex: 1,
                height: "6px",
                borderRadius: "3px",
                border: "none",
                cursor: "pointer",
                background: isActive
                  ? "var(--accent-primary)"
                  : isPassed
                  ? "rgba(236, 98, 66, 0.45)"
                  : "var(--bg-elevated)",
                transition: "all 0.25s ease"
              }}
              title={`Jump to Step ${idx + 1}: ${s.title}`}
            />
          );
        })}
      </div>

      {/* Visual Canvas: Problem Elements & Active State */}
      <div
        style={{
          background: "var(--bg-input)",
          borderRadius: "var(--radius-md)",
          padding: "24px 20px",
          border: "1px solid var(--border-subtle)",
          marginBottom: "18px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
          overflowX: "auto",
          minHeight: "140px"
        }}
      >
        {/* Array / Elements Strip */}
        {Array.isArray(visualData.inputData) && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0", flexWrap: "nowrap" }}>
            {visualData.inputData.map((val, idx) => {
              const inWindow = isInWindow(idx);
              const isHighlighted = (currentStep.highlightIndices || []).includes(idx);
              const isMatched = currentStep.matched && isHighlighted;
              const pointerTags = getPointersForIndex(idx);

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    minWidth: "46px"
                  }}
                >
                  {/* Top Pointer Badges */}
                  <div style={{ height: "22px", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
                    {pointerTags.map((tag, pIdx) => {
                      const isL = tag === "L" || tag === "START";
                      const isR = tag === "R" || tag === "END";
                      const isMid = tag === "MID";
                      const bg = isL
                        ? "var(--accent-primary)"
                        : isR
                        ? "#38bdf8"
                        : isMid
                        ? "#facc15"
                        : "var(--accent-secondary)";
                      const color = isMid || !isL && !isR ? "#0f172a" : "#fff";

                      return (
                        <span
                          key={pIdx}
                          style={{
                            background: bg,
                            color,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            padding: "1px 5px",
                            borderRadius: "4px",
                            boxShadow: "0 0 8px rgba(0,0,0,0.4)"
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>

                  {/* Element Cell */}
                  <div
                    style={{
                      minWidth: "46px",
                      height: "46px",
                      padding: "0 10px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--mono)",
                      fontSize: typeof val === "string" && val.length > 3 ? "0.8rem" : "1.02rem",
                      fontWeight: 700,
                      background: isMatched
                        ? "rgba(34, 197, 94, 0.22)"
                        : inWindow
                        ? "rgba(236, 98, 66, 0.16)"
                        : isHighlighted
                        ? "var(--bg-elevated)"
                        : "var(--bg-secondary)",
                      border: isMatched
                        ? "2px solid var(--accent-secondary)"
                        : inWindow
                        ? "2px solid var(--accent-primary)"
                        : isHighlighted
                        ? "1px solid rgba(255, 255, 255, 0.3)"
                        : "1px solid var(--border-subtle)",
                      color: isMatched
                        ? "var(--accent-secondary)"
                        : inWindow
                        ? "var(--accent-primary)"
                        : "var(--text-primary)",
                      boxShadow: inWindow
                        ? "0 0 12px var(--accent-primary-glow)"
                        : isMatched
                        ? "0 0 16px rgba(34, 197, 94, 0.35)"
                        : "none",
                      transition: "all 0.25s ease",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {String(val)}
                  </div>

                  {/* Index Label */}
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                    [{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Auxiliary State Memory Display (HashMap, Set, Stack, Memory Box) */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          {/* HashMap Display */}
          {currentStep.hashMap && (
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>HashMap:</span>
              <code style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                {Object.keys(currentStep.hashMap).length === 0
                  ? "{}"
                  : JSON.stringify(currentStep.hashMap).replace(/"/g, "")}
              </code>
            </div>
          )}

          {/* HashSet Display */}
          {currentStep.hashSet && (
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>HashSet:</span>
              <code style={{ color: "#38bdf8", fontWeight: 600 }}>
                {`{ ${currentStep.hashSet.join(", ")} }`}
              </code>
            </div>
          )}

          {/* Stack Display */}
          {currentStep.stack && (
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>Stack (LIFO):</span>
              <code style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                [{currentStep.stack.map(s => `'${s}'`).join(", ")}]
              </code>
            </div>
          )}

          {/* General Memory State Box */}
          {currentStep.memoryState && (
            <div
              style={{
                background: "var(--bg-secondary)",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.78rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>{currentStep.memoryState.label}:</span>
              <strong style={{ color: "var(--accent-secondary)" }}>
                {typeof currentStep.memoryState.data === "object"
                  ? JSON.stringify(currentStep.memoryState.data)
                  : String(currentStep.memoryState.data)}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Step Explanation & Python Solution Code */}
      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-md)",
          padding: "16px 20px",
          border: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--accent-primary)",
                background: "rgba(236, 98, 66, 0.12)",
                padding: "2px 8px",
                borderRadius: "4px"
              }}
            >
              Step {currentStepIdx + 1}
            </span>
            <strong style={{ fontSize: "0.92rem", color: "var(--text-primary)" }}>
              {currentStep.title}
            </strong>
          </div>

          {currentStep.matched && (
            <span
              className="badge badge-easy"
              style={{ fontSize: "0.72rem", gap: "5px" }}
            >
              <CheckIcon size={12} style={{ color: "var(--easy)" }} />
              <span>Optimal Match / Result Produced!</span>
            </span>
          )}
        </div>

        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.88rem", lineHeight: 1.6 }}>
          {currentStep.description}
        </p>

        {/* Code Snippet for this step */}
        {currentStep.codeSnippet && (
          <div
            style={{
              marginTop: "4px",
              padding: "10px 14px",
              background: "var(--bg-input)",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              fontFamily: "var(--mono)",
              fontSize: "0.82rem",
              color: "var(--text-code)",
              whiteSpace: "pre-wrap",
              lineHeight: 1.5
            }}
          >
            {currentStep.codeSnippet}
          </div>
        )}
      </div>
    </div>
  );
}
