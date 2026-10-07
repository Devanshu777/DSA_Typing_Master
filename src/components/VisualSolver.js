"use client";

import { useState, useEffect } from "react";
import { getProblemVisualizer } from "@/data/problemVisualizers";
import {
  PlayIcon,
  RotateCcwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  SparklesIcon
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
      }, 2400);
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
    if (currentStep.windowStart !== undefined && currentStep.windowEnd !== undefined) {
      return idx >= currentStep.windowStart && idx <= currentStep.windowEnd;
    }
    return false;
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
          marginBottom: "18px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "30px",
              height: "30px",
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
              Step-by-step state simulation &amp; pointer trace
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

      {/* Step Progress Dots / Indicator Bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
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

      {/* Visual Canvas: Array Strip / Elements & Active Pointers */}
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
          gap: "16px",
          overflowX: "auto",
          minHeight: "140px"
        }}
      >
        {/* Array Cells / Data Items */}
        {Array.isArray(visualData.inputData) && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0" }}>
            {visualData.inputData.map((val, idx) => {
              const inWindow = isInWindow(idx);
              const isHighlighted = (currentStep.highlightIndices || []).includes(idx);
              const isMatched = currentStep.matched && isHighlighted;
              const isLeft = currentStep.left === idx || currentStep.windowStart === idx;
              const isRight = currentStep.right === idx || currentStep.windowEnd === idx;
              const isMid = currentStep.mid === idx;
              const isPointer = currentStep.pointerIndex === idx;

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {/* Top Pointer Badge */}
                  <div style={{ height: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isLeft && (
                      <span
                        style={{
                          background: "var(--accent-primary)",
                          color: "#fff",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          boxShadow: "0 0 8px var(--accent-primary-glow)",
                          animation: "pulse 1.5s infinite"
                        }}
                      >
                        {currentStep.windowStart !== undefined ? "START" : "L"}
                      </span>
                    )}
                    {isRight && !isLeft && (
                      <span
                        style={{
                          background: "#38bdf8",
                          color: "#0f172a",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px",
                          boxShadow: "0 0 8px rgba(56, 189, 248, 0.4)"
                        }}
                      >
                        {currentStep.windowEnd !== undefined ? "END" : "R"}
                      </span>
                    )}
                    {isMid && (
                      <span
                        style={{
                          background: "#facc15",
                          color: "#181818",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px"
                        }}
                      >
                        MID
                      </span>
                    )}
                    {isPointer && !isLeft && !isRight && (
                      <span
                        style={{
                          background: "var(--accent-secondary)",
                          color: "#0f172a",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "4px"
                        }}
                      >
                        i
                      </span>
                    )}
                  </div>

                  {/* Cell Box */}
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--mono)",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      background: isMatched
                        ? "rgba(34, 197, 94, 0.2)"
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
                        ? "1px solid rgba(255, 255, 255, 0.25)"
                        : "1px solid var(--border-subtle)",
                      color: isMatched
                        ? "var(--accent-secondary)"
                        : inWindow
                        ? "var(--accent-primary)"
                        : "var(--text-primary)",
                      boxShadow: inWindow
                        ? "0 0 12px var(--accent-primary-glow)"
                        : isMatched
                        ? "0 0 16px rgba(34, 197, 94, 0.3)"
                        : "none",
                      transition: "all 0.25s ease"
                    }}
                  >
                    {val}
                  </div>

                  {/* Index Label */}
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                    idx {idx}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Auxiliary State Memory Box (HashMap / Set / Stack / Nodes) */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
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
              <span style={{ color: "var(--text-muted)" }}>HashMap (seen):</span>
              <code style={{ color: "var(--accent-primary)", fontWeight: 600 }}>
                {Object.keys(currentStep.hashMap).length === 0
                  ? "{}"
                  : JSON.stringify(currentStep.hashMap).replace(/"/g, "")}
              </code>
            </div>
          )}

          {currentStep.windowSum !== undefined && (
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
              <span style={{ color: "var(--text-muted)" }}>Current Window Sum:</span>
              <strong style={{ color: "var(--accent-primary)" }}>{currentStep.windowSum}</strong>
              {currentStep.maxAvg !== undefined && (
                <>
                  <span style={{ color: "var(--border-subtle)" }}>•</span>
                  <span style={{ color: "var(--text-muted)" }}>Max Avg:</span>
                  <strong style={{ color: "var(--accent-secondary)" }}>{currentStep.maxAvg}</strong>
                </>
              )}
            </div>
          )}

          {currentStep.charSet && (
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
              <span style={{ color: "var(--text-muted)" }}>Window HashSet:</span>
              <code style={{ color: "#38bdf8" }}>{`{ "${currentStep.charSet.join('", "')}" }`}</code>
              {currentStep.maxLen !== undefined && (
                <>
                  <span style={{ color: "var(--border-subtle)" }}>•</span>
                  <span style={{ color: "var(--text-muted)" }}>Max Len:</span>
                  <strong style={{ color: "var(--accent-secondary)" }}>{currentStep.maxLen}</strong>
                </>
              )}
            </div>
          )}

          {currentStep.currentSum !== undefined && (
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
              <span style={{ color: "var(--text-muted)" }}>Two Pointers Sum:</span>
              <strong
                style={{
                  color:
                    currentStep.currentSum === visualData.target
                      ? "var(--accent-secondary)"
                      : "var(--text-primary)"
                }}
              >
                {currentStep.currentSum}
              </strong>
              {visualData.target !== undefined && (
                <span style={{ color: "var(--text-muted)" }}>(Target = {visualData.target})</span>
              )}
            </div>
          )}

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
              <span style={{ color: "var(--text-muted)" }}>Stack:</span>
              <code style={{ color: "var(--accent-primary)" }}>
                [{currentStep.stack.map(s => `'${s}'`).join(", ")}]
              </code>
            </div>
          )}

          {currentStep.nodes && (
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
              <span style={{ color: "var(--text-muted)" }}>Linked Nodes:</span>
              <code style={{ color: "var(--accent-secondary)" }}>
                {currentStep.nodes.join(" | ")}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Step Explanation & Python Code Invariant Card */}
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
              <span>Optimal Match Found!</span>
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
