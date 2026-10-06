"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import problemsData from "@/data/problems";
import { getStoredData } from "@/utils/storage";
import {
  SearchIcon,
  CloseIcon,
  CheckIcon,
  LightningIcon,
  ChevronRightIcon
} from "@/components/Icons";

export default function CommandPalette({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completedMap, setCompletedMap] = useState({});
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Load completed problems and custom problems
  useEffect(() => {
    if (!isOpen) return;
    const data = getStoredData();
    setCompletedMap(data.completedProblems || {});
    setQuery("");
    setSelectedIndex(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [isOpen]);

  // Flatten all problems including custom ones
  const allProblems = useMemo(() => {
    const list = [];
    problemsData.phases.forEach((phase) => {
      phase.days.forEach((day) => {
        day.problems.forEach((prob) => {
          list.push({
            ...prob,
            phaseName: phase.name,
            dayNumber: day.day,
            isCustom: false
          });
        });
      });
    });

    if (typeof window !== "undefined") {
      const data = getStoredData();
      if (Array.isArray(data.customProblems)) {
        data.customProblems.forEach((cp) => {
          list.push({
            ...cp,
            phaseName: "Custom Drills",
            dayNumber: "Custom",
            isCustom: true
          });
        });
      }
    }

    return list;
  }, [isOpen]);

  // Filter problems based on query
  const filteredProblems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProblems.slice(0, 30); // show top 30 initially

    return allProblems.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const patternMatch = p.pattern?.toLowerCase().includes(q);
      const lcMatch = p.lcNumber ? String(p.lcNumber).includes(q) : false;
      const diffMatch = p.difficulty?.toLowerCase().includes(q);
      const phaseMatch = p.phaseName?.toLowerCase().includes(q);
      return nameMatch || patternMatch || lcMatch || diffMatch || phaseMatch;
    }).slice(0, 30);
  }, [allProblems, query]);

  // Keep selected index in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredProblems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredProblems.length) % Math.max(1, filteredProblems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredProblems[selectedIndex];
      if (selected) {
        handleSelect(selected.id);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (problemId) => {
    onClose();
    router.push(`/practice/${problemId}`);
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
        paddingLeft: "16px",
        paddingRight: "16px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          background: "#181818",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.8)",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 18px",
            borderBottom: "1px solid var(--border-subtle)",
            gap: "12px",
            background: "#1c1c1c"
          }}
        >
          <SearchIcon size={18} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search problems, patterns (e.g. sliding window, two sum, #643)..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "1rem",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="btn btn-ghost"
              style={{ padding: "4px", width: "24px", height: "24px" }}
            >
              <CloseIcon size={12} />
            </button>
          )}
          <div
            style={{
              padding: "2px 6px",
              background: "rgba(255, 255, 255, 0.06)",
              borderRadius: "4px",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              fontFamily: "var(--mono)"
            }}
          >
            ESC
          </div>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            maxHeight: "380px",
            overflowY: "auto",
            padding: "8px"
          }}
        >
          {filteredProblems.length === 0 ? (
            <div
              style={{
                padding: "36px 20px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.85rem"
              }}
            >
              No matching problems found for "{query}".
            </div>
          ) : (
            filteredProblems.map((prob, idx) => {
              const isSelected = idx === selectedIndex;
              const isDone = Boolean(completedMap[prob.id]);

              return (
                <div
                  key={prob.id}
                  onClick={() => handleSelect(prob.id)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: isSelected ? "rgba(236, 98, 66, 0.12)" : "transparent",
                    border: isSelected ? "1px solid rgba(236, 98, 66, 0.3)" : "1px solid transparent",
                    transition: "all 0.1s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        background: isDone ? "rgba(34, 197, 94, 0.15)" : "rgba(255, 255, 255, 0.05)",
                        color: isDone ? "var(--easy)" : "var(--text-muted)"
                      }}
                    >
                      {isDone ? <CheckIcon size={11} /> : <LightningIcon size={10} />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "0.88rem",
                            color: isSelected ? "#fff" : "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {prob.lcNumber ? `#${prob.lcNumber} ` : ""}{prob.name}
                        </span>

                        <span
                          className={`badge ${
                            prob.difficulty === "Easy"
                              ? "badge-easy"
                              : prob.difficulty === "Medium"
                              ? "badge-medium"
                              : "badge-hard"
                          }`}
                          style={{ fontSize: "0.65rem", padding: "1px 6px" }}
                        >
                          {prob.difficulty}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: "0.74rem",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                      >
                        {prob.pattern} • {prob.phaseName}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0, marginLeft: "8px" }}>
                    {isSelected && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--accent-primary)",
                          fontFamily: "var(--mono)",
                          display: "flex",
                          alignItems: "center",
                          gap: "3px"
                        }}
                      >
                        ↵ Jump
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div
          style={{
            padding: "10px 18px",
            borderTop: "1px solid var(--border-subtle)",
            background: "#161616",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.72rem",
            color: "var(--text-muted)"
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span><kbd style={{ fontFamily: "var(--mono)", background: "#222", padding: "1px 5px", borderRadius: "3px" }}>↑↓</kbd> to navigate</span>
            <span><kbd style={{ fontFamily: "var(--mono)", background: "#222", padding: "1px 5px", borderRadius: "3px" }}>↵</kbd> to select</span>
            <span><kbd style={{ fontFamily: "var(--mono)", background: "#222", padding: "1px 5px", borderRadius: "3px" }}>ESC</kbd> to close</span>
          </div>

          <div>
            {filteredProblems.length} problem{filteredProblems.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>
    </div>
  );
}
