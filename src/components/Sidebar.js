"use client";

import { useState, useMemo, useEffect } from "react";
import {
  SearchIcon,
  FilterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RotateCcwIcon,
  CheckIcon
} from "@/components/Icons";

export default function Sidebar({
  phases,
  currentProblemId,
  onSelectProblem,
  completedMap = {},
  isCollapsed = false,
  onToggleCollapse
}) {
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("dsa_sidebar_search") || "";
      } catch (e) {}
    }
    return "";
  });

  const [selectedPattern, setSelectedPattern] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("dsa_sidebar_pattern") || "ALL";
      } catch (e) {}
    }
    return "ALL";
  });

  const [selectedDifficulty, setSelectedDifficulty] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("dsa_sidebar_difficulty") || "ALL";
      } catch (e) {}
    }
    return "ALL";
  });

  const [filtersOpen, setFiltersOpen] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("dsa_sidebar_filters_open");
        if (stored !== null) return stored === "true";
      } catch (e) {}
    }
    return true;
  });

  // Sync to sessionStorage whenever filter criteria changes
  useEffect(() => {
    try {
      sessionStorage.setItem("dsa_sidebar_search", searchTerm);
    } catch (e) {}
  }, [searchTerm]);

  useEffect(() => {
    try {
      sessionStorage.setItem("dsa_sidebar_pattern", selectedPattern);
    } catch (e) {}
  }, [selectedPattern]);

  useEffect(() => {
    try {
      sessionStorage.setItem("dsa_sidebar_difficulty", selectedDifficulty);
    } catch (e) {}
  }, [selectedDifficulty]);

  useEffect(() => {
    try {
      sessionStorage.setItem("dsa_sidebar_filters_open", String(filtersOpen));
    } catch (e) {}
  }, [filtersOpen]);

  // Extract all unique patterns across all phases
  const allPatterns = useMemo(() => {
    const set = new Set();
    phases.forEach(phase => {
      phase.days.forEach(day => {
        if (day.pattern) set.add(day.pattern);
      });
    });
    return Array.from(set).sort();
  }, [phases]);

  const [expandedPhases, setExpandedPhases] = useState(() => {
    const init = {};
    phases.forEach(p => {
      init[p.id] = true;
    });
    return init;
  });

  const togglePhase = (id) => {
    setExpandedPhases(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtered tree
  const filteredPhases = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return phases
      .map(phase => {
        const matchingDays = phase.days
          .map(day => {
            // Pattern dropdown filter
            if (selectedPattern !== "ALL" && day.pattern !== selectedPattern) {
              return null;
            }

            const matchingProblems = day.problems.filter(prob => {
              // Difficulty filter
              if (selectedDifficulty !== "ALL" && prob.difficulty !== selectedDifficulty) {
                return false;
              }

              // Search term filter
              if (!term) return true;
              return (
                prob.name.toLowerCase().includes(term) ||
                prob.pattern.toLowerCase().includes(term) ||
                prob.difficulty.toLowerCase().includes(term) ||
                (prob.lcNumber && String(prob.lcNumber).includes(term)) ||
                (prob.signals && prob.signals.some(s => s.toLowerCase().includes(term)))
              );
            });

            if (matchingProblems.length === 0) return null;
            return { ...day, problems: matchingProblems };
          })
          .filter(Boolean);

        if (matchingDays.length === 0) return null;
        return { ...phase, days: matchingDays };
      })
      .filter(Boolean);
  }, [phases, searchTerm, selectedPattern, selectedDifficulty]);

  const totalFilteredCount = useMemo(() => {
    return filteredPhases.reduce((acc, p) => {
      return acc + p.days.reduce((dAcc, d) => dAcc + d.problems.length, 0);
    }, 0);
  }, [filteredPhases]);

  if (isCollapsed) {
    return (
      <aside
        style={{
          width: "48px",
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 0",
          gap: "16px"
        }}
      >
        <button
          onClick={onToggleCollapse}
          className="btn btn-ghost"
          style={{ padding: "8px", minWidth: "32px", height: "32px" }}
          title="Expand Curriculum Sidebar"
        >
          <ChevronRightIcon size={16} />
        </button>
        <span
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            letterSpacing: "1px",
            userSelect: "none",
            fontFamily: "var(--mono)"
          }}
        >
          PROBLEMS ({totalFilteredCount})
        </span>
      </aside>
    );
  }

  return (
    <aside
      className="sidebar"
      style={{
        width: "310px",
        minWidth: "310px",
        height: "100%",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      {/* Top Header & Collapse Button */}
      <div
        style={{
          padding: "0 16px 12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>
            Curriculum
          </span>
          <span className="badge badge-easy" style={{ fontSize: "0.7rem", padding: "2px 7px" }}>
            {totalFilteredCount}
          </span>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => setFiltersOpen(prev => !prev)}
            className="btn btn-ghost"
            style={{ padding: "4px 8px", fontSize: "0.72rem", height: "28px", gap: "4px" }}
            title="Toggle Search & Filters"
          >
            <FilterIcon size={12} />
            <span>Filters</span>
            {filtersOpen ? <ChevronUpIcon size={11} /> : <ChevronDownIcon size={11} />}
          </button>
          <button
            onClick={onToggleCollapse}
            className="btn btn-ghost"
            style={{ padding: "4px 8px", minWidth: "28px", height: "28px" }}
            title="Collapse Sidebar"
          >
            <ChevronLeftIcon size={13} />
          </button>
        </div>
      </div>

      {/* Collapsible Search & Filter Area */}
      {filtersOpen && (
        <div style={{ padding: "0 16px 12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Search Box with SVG icon */}
          <div style={{ position: "relative", width: "100%" }}>
            <SearchIcon
              size={13}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none"
              }}
            />
            <input
              type="text"
              placeholder="Search (e.g. 643, sliding window)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px 8px 30px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontSize: "0.78rem",
                outline: "none"
              }}
            />
          </div>

          {/* Pattern Selector */}
          <div>
            <label style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>
              Filter by Pattern:
            </label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 8px",
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontSize: "0.75rem",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="ALL">All Patterns</option>
              {allPatterns.map((pat) => (
                <option key={pat} value={pat}>
                  {pat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter Pills */}
          <div style={{ display: "flex", gap: "4px", marginTop: "2px" }}>
            {["ALL", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className="btn btn-ghost"
                style={{
                  flex: 1,
                  padding: "4px 2px",
                  fontSize: "0.7rem",
                  background: selectedDifficulty === diff ? "var(--bg-elevated)" : "transparent",
                  color:
                    selectedDifficulty === diff
                      ? diff === "Easy"
                        ? "var(--easy)"
                        : diff === "Medium"
                        ? "var(--medium)"
                        : diff === "Hard"
                        ? "var(--hard)"
                        : "var(--accent-primary)"
                      : "var(--text-muted)",
                  borderColor: selectedDifficulty === diff ? "var(--border-active)" : "var(--border-subtle)"
                }}
              >
                {diff}
              </button>
            ))}
          </div>

          {(searchTerm || selectedPattern !== "ALL" || selectedDifficulty !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedPattern("ALL");
                setSelectedDifficulty("ALL");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-primary)",
                fontSize: "0.72rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "4px",
                marginTop: "2px",
                fontFamily: "var(--mono)"
              }}
            >
              <RotateCcwIcon size={11} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* Problems Tree */}
      <div style={{ overflowY: "auto", flex: 1, paddingBottom: "20px" }}>
        {filteredPhases.length === 0 ? (
          <div style={{ padding: "20px 16px", color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
            No problems match your filters.
          </div>
        ) : (
          filteredPhases.map((phase) => {
            const isExpanded = expandedPhases[phase.id] !== false;
            const totalProbs = phase.days.reduce((acc, d) => acc + d.problems.length, 0);
            const completedCount = phase.days.reduce((acc, d) => {
              return acc + d.problems.filter(p => completedMap[p.id]).length;
            }, 0);

            return (
              <div key={phase.id} className="sidebar-section">
                <div
                  onClick={() => togglePhase(phase.id)}
                  className="sidebar-section-title"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                >
                  <span style={{ fontSize: "0.7rem" }}>
                    {phase.name} ({completedCount}/{totalProbs})
                  </span>
                  <span style={{ display: "flex", alignItems: "center", color: "var(--text-muted)" }}>
                    {isExpanded ? <ChevronDownIcon size={12} /> : <ChevronRightIcon size={12} />}
                  </span>
                </div>

                {isExpanded && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {phase.days.map((day) => (
                      <div key={day.day} style={{ marginBottom: "6px" }}>
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: "var(--accent-primary)",
                            padding: "3px 12px",
                            fontWeight: 600,
                            opacity: 0.85
                          }}
                        >
                          Day {day.day} • {day.pattern}
                        </div>

                        {day.problems.map((prob) => {
                          const isActive = prob.id === currentProblemId;
                          const isDone = !!completedMap[prob.id];
                          const dotColor =
                            prob.difficulty === "Easy"
                              ? "var(--easy)"
                              : prob.difficulty === "Medium"
                              ? "var(--medium)"
                              : "var(--hard)";

                          return (
                            <div
                              key={prob.id}
                              onClick={() => onSelectProblem(prob.id)}
                              className={`sidebar-item ${isActive ? "active" : ""}`}
                              style={{ padding: "8px 12px" }}
                            >
                              <span
                                className="difficulty-dot"
                                style={{ background: dotColor }}
                                title={`Difficulty: ${prob.difficulty}`}
                              />
                              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.8rem" }}>
                                {prob.lcNumber ? `#${prob.lcNumber} ` : ""}{prob.name}
                              </span>
                              {isDone && (
                                <span style={{ color: "var(--easy)", display: "inline-flex", alignItems: "center" }}>
                                  <CheckIcon size={12} />
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
