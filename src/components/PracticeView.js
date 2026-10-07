"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import problemsData from "@/data/problems";
import Sidebar from "@/components/Sidebar";
import ProblemTab from "@/components/ProblemTab";
import IntuitionTab from "@/components/IntuitionTab";
import TypingEngine from "@/components/TypingEngine";
import RightChatPanel from "@/components/RightChatPanel";
import CustomProblemModal from "@/components/CustomProblemModal";
import { getStoredData } from "@/utils/storage";
import {
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  LightbulbIcon,
  CodeIcon
} from "@/components/Icons";

export default function PracticeView({ initialSlug }) {
  const router = useRouter();
  const [customProblems, setCustomProblems] = useState([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Flatten all problems including custom ones
  const allProblems = useMemo(() => {
    const list = [];
    problemsData.phases.forEach((phase) => {
      phase.days.forEach((day) => {
        day.problems.forEach((prob) => {
          list.push({
            ...prob,
            phaseName: phase.name,
            dayNumber: day.day
          });
        });
      });
    });

    customProblems.forEach((cp) => {
      list.push({
        ...cp,
        phaseName: "Custom Drills",
        dayNumber: "Custom"
      });
    });

    return list;
  }, [customProblems]);

  const [currentProblemId, setCurrentProblemId] = useState(
    initialSlug || allProblems[0]?.id || "two-sum"
  );
  const [activeTab, setActiveTab] = useState("code");
  const [completedMap, setCompletedMap] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatGptOpen, setIsChatGptOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(440);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync completion data & custom problems
  useEffect(() => {
    const loadCompleted = () => {
      const data = getStoredData();
      setCompletedMap(data.completedProblems || {});
      setCustomProblems(data.customProblems || []);
    };
    loadCompleted();
    window.addEventListener("dsa_stats_updated", loadCompleted);
    return () => window.removeEventListener("dsa_stats_updated", loadCompleted);
  }, []);


  // Update currentProblemId if initialSlug changes
  useEffect(() => {
    if (initialSlug) {
      setCurrentProblemId(initialSlug);
    }
  }, [initialSlug]);

  // Draggable resize handler
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const sidebarWidth = isSidebarCollapsed ? 48 : 310;
      const minCenterWidth = 380; // Ensure center editor never gets crushed
      const maxAllowedWidth = Math.max(300, window.innerWidth - sidebarWidth - minCenterWidth);
      const targetWidth = window.innerWidth - e.clientX;
      const newWidth = Math.max(300, Math.min(targetWidth, maxAllowedWidth));
      setChatWidth(newWidth);
    }
  }, [isResizing, isSidebarCollapsed]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const currentIndex = allProblems.findIndex((p) => p.id === currentProblemId);
  const currentProblem = allProblems[currentIndex] || allProblems[0];

  const handleSelectProblem = useCallback((id) => {
    setCurrentProblemId(id);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/practice/${id}`);
    }
  }, []);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const parts = window.location.pathname.split("/");
        const slug = parts[parts.length - 1];
        if (slug && slug !== "practice") {
          setCurrentProblemId(slug);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNextProblem = useCallback(() => {
    if (currentIndex < allProblems.length - 1) {
      const next = allProblems[currentIndex + 1];
      handleSelectProblem(next.id);
    }
  }, [currentIndex, allProblems, handleSelectProblem]);

  const handlePrevProblem = useCallback(() => {
    if (currentIndex > 0) {
      const prev = allProblems[currentIndex - 1];
      handleSelectProblem(prev.id);
    }
  }, [currentIndex, allProblems, handleSelectProblem]);

  // Global navigation shortcuts: Alt + ArrowLeft / Alt + ArrowRight
  useEffect(() => {
    const handleNavShortcuts = (e) => {
      if (e.altKey && e.key === "ArrowRight") {
        e.preventDefault();
        handleNextProblem();
      } else if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevProblem();
      }
    };
    window.addEventListener("keydown", handleNavShortcuts);
    return () => window.removeEventListener("keydown", handleNavShortcuts);
  }, [handleNextProblem, handlePrevProblem]);

  // Build sidebar phases including custom drills
  const sidebarPhases = useMemo(() => {
    if (customProblems.length === 0) return problemsData.phases;
    return [
      ...problemsData.phases,
      {
        id: "phase-custom",
        name: "Custom Drills",
        week: "✦",
        description: "User-created custom LeetCode and algorithmic drills",
        days: [
          {
            day: "Custom",
            pattern: "Custom Drill",
            problems: customProblems
          }
        ]
      }
    ];
  }, [customProblems]);

  if (!currentProblem) {
    return <div className="container" style={{ padding: "40px" }}>Problem not found.</div>;
  }

  return (
    <div
      className="practice-viewport"
      style={{
        display: "flex",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        width: "100%",
        overflow: "hidden",
        position: "relative",
        userSelect: isResizing ? "none" : "auto"
      }}
    >
      {/* Fullscreen transparent drag catcher so mouse never drops while resizing */}
      {isResizing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            cursor: "col-resize",
            userSelect: "none"
          }}
        />
      )}

      {/* 1. Desktop Left Sidebar navigation */}
      <div className="desktop-sidebar">
        <Sidebar
          phases={sidebarPhases}
          currentProblemId={currentProblem.id}
          onSelectProblem={handleSelectProblem}
          completedMap={completedMap}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />
      </div>

      {/* Mobile Curriculum Slide-in Drawer */}
      {isMobileDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}
      <div className={`mobile-sidebar-drawer ${isMobileDrawerOpen ? "open" : ""}`}>
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--bg-card)"
          }}
        >
          <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-primary)" }}>
            📚 Curriculum ({allProblems.length} Problems)
          </span>
          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            className="btn btn-ghost"
            style={{ padding: "4px 8px", minWidth: "28px", height: "28px" }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          <Sidebar
            phases={sidebarPhases}
            currentProblemId={currentProblem.id}
            onSelectProblem={(id) => {
              handleSelectProblem(id);
              setIsMobileDrawerOpen(false);
            }}
            completedMap={completedMap}
            isCollapsed={false}
            onToggleCollapse={() => setIsMobileDrawerOpen(false)}
          />
        </div>
      </div>

      {/* 2. Middle Main Practice Area */}
      <main
        className="practice-main"
        style={{
          flex: 1,
          minWidth: 0,
          padding: "20px 28px",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          transition: isResizing ? "none" : "padding 0.15s ease"
        }}
      >
        {/* Navigation bar between problems */}
        <div
          className="practice-problem-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: 600 }}>
              {currentProblem.phaseName} • Day {currentProblem.dayNumber}
            </span>
            <h1 style={{ fontSize: "1.6rem", marginTop: "2px" }}>
              {currentProblem.lcNumber ? `#${currentProblem.lcNumber} ` : ""}{currentProblem.name}
            </h1>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Mobile Curriculum Drawer Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="btn btn-ghost mobile-only-btn"
              style={{ height: "32px", fontSize: "0.78rem", gap: "6px" }}
              title="Open Curriculum Drawer"
            >
              <span>📚 Problems ({allProblems.length})</span>
            </button>

            {/* Custom Drill Button */}
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="btn btn-ghost"
              style={{ height: "32px", fontSize: "0.78rem", gap: "6px" }}
              title="Add any custom Python code or interview problem to drill"
            >
              <CodeIcon size={14} style={{ color: "var(--accent-primary)" }} />
              <span className="desktop-only">+ Custom Drill</span>
            </button>

            {/* AI Tutor Right-Panel Toggle Button */}
            <button
              onClick={() => setIsChatGptOpen(prev => !prev)}
              className={`btn ${isChatGptOpen ? "btn-ghost active" : "btn-ghost"}`}
              style={{ height: "32px", fontSize: "0.78rem" }}
              title="Open Resizable AI Assistant Split Panel on the Right"
            >
              <SparklesIcon size={14} style={{ color: "var(--accent-primary)" }} />
              <span>{isChatGptOpen ? "Hide AI Tutor" : "AI Tutor"}</span>
            </button>

            <button
              onClick={handlePrevProblem}
              disabled={currentIndex === 0}
              className="btn btn-ghost"
              style={{ height: "32px", padding: "6px 10px" }}
              title="Previous Problem (Alt + Left)"
            >
              <ChevronLeftIcon size={14} />
              <span>Prev</span>
            </button>
            <button
              onClick={handleNextProblem}
              disabled={currentIndex === allProblems.length - 1}
              className="btn btn-ghost"
              style={{ height: "32px", padding: "6px 10px" }}
              title="Next Problem (Alt + Right)"
            >
              <span>Next</span>
              <ChevronRightIcon size={14} />
            </button>
          </div>
        </div>


        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab("problem")}
            className={`tab ${activeTab === "problem" ? "active" : ""}`}
          >
            <span className="tab-icon"><BookOpenIcon size={14} /></span>
            <span>Problem &amp; Signals</span>
          </button>
          <button
            onClick={() => setActiveTab("intuition")}
            className={`tab ${activeTab === "intuition" ? "active" : ""}`}
          >
            <span className="tab-icon"><LightbulbIcon size={14} /></span>
            <span>Intuition &amp; Logic</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`tab ${activeTab === "code" ? "active" : ""}`}
          >
            <span className="tab-icon"><CodeIcon size={14} /></span>
            <span>Code Typing Drill</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "problem" && (
          <ProblemTab
            problem={currentProblem}
            onStartTyping={() => setActiveTab("code")}
          />
        )}

        {activeTab === "intuition" && (
          <IntuitionTab
            problem={currentProblem}
            onStartTyping={() => setActiveTab("code")}
          />
        )}

        {activeTab === "code" && (
          <TypingEngine
            problem={currentProblem}
            onNext={currentIndex < allProblems.length - 1 ? handleNextProblem : null}
            onPrev={currentIndex > 0 ? handlePrevProblem : null}
          />
        )}
      </main>

      {/* 3. Right-hand Resizable ChatGPT Panel with Resizer Bar */}
      <RightChatPanel
        problem={currentProblem}
        isOpen={isChatGptOpen}
        onClose={() => setIsChatGptOpen(false)}
        width={chatWidth}
        onStartResize={startResizing}
      />

      {/* Custom Problem Creation Modal */}
      <CustomProblemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
      />
    </div>
  );
}
