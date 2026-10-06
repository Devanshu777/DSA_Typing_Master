"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import problemsData from "@/data/problems";
import { getStoredData } from "@/utils/storage";
import Footer from "@/components/Footer";
import {
  SparklesIcon,
  LightningIcon,
  CompassIcon,
  FlameIcon,
  ChevronRightIcon,
  LightbulbIcon
} from "@/components/Icons";

export default function Home() {
  const [userData, setUserData] = useState({
    completedProblems: {},
    history: [],
    lastPracticed: null,
    streak: { count: 0 }
  });

  const loadData = () => {
    setUserData(getStoredData());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("dsa_stats_updated", loadData);
    return () => window.removeEventListener("dsa_stats_updated", loadData);
  }, []);

  const totalProblems = problemsData.phases.reduce((acc, p) => {
    return acc + p.days.reduce((dAcc, d) => dAcc + d.problems.length, 0);
  }, 0);

  const completedCount = Object.keys(userData.completedProblems || {}).length;

  // Compute average WPM and Accuracy
  const history = userData.history || [];
  const avgWpm =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + (b.wpm || 0), 0) / history.length)
      : 0;

  const avgAccuracy =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + (b.accuracy || 0), 0) / history.length)
      : 0;

  // Find last practiced or first problem
  const allProblemsFlat = [];
  problemsData.phases.forEach(p => {
    p.days.forEach(d => {
      d.problems.forEach(prob => allProblemsFlat.push(prob));
    });
  });

  const resumeProblem =
    allProblemsFlat.find(p => p.id === userData.lastPracticed) ||
    allProblemsFlat[0];

  return (
    <main className="container" style={{ paddingBottom: "80px" }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="badge badge-easy" style={{ marginBottom: "16px" }}>
          <SparklesIcon size={13} style={{ color: "var(--easy)" }} />
          <span>6-Week DSA Pattern &amp; Typing Mastery</span>
        </div>
        <h1>
          Master Code Speed &amp; <span className="gradient-text">Algorithmic Patterns</span>
        </h1>
        <p>
          Internalize LeetCode solutions, recognition signals, and intuition
          while building lightning-fast code typing muscle memory.
        </p>

        <div style={{ marginTop: "28px", display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href={`/practice/${resumeProblem?.id || "two-sum"}`}
            className="btn btn-primary"
            style={{ padding: "12px 28px", fontSize: "0.95rem" }}
          >
            <LightningIcon size={16} />
            <span>{userData.lastPracticed ? `Resume: ${resumeProblem?.name}` : "Start Practice: Two Sum"}</span>
          </Link>
          <Link
            href="/stats"
            className="btn btn-ghost"
            style={{ padding: "12px 24px", fontSize: "0.95rem" }}
          >
            <CompassIcon size={16} />
            <span>View Stats</span>
          </Link>
        </div>
      </section>

      {/* Stats Summary Row */}
      <div className="stats-row">
        <div className="stat-card glass-card">
          <div className="stat-value gradient-text">
            {completedCount} <span style={{ fontSize: "1.2rem", color: "var(--text-muted)" }}>/ {totalProblems}</span>
          </div>
          <div className="stat-label">Mastered Problems</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-value" style={{ color: "var(--accent-secondary)" }}>
            {avgWpm > 0 ? avgWpm : "--"}
          </div>
          <div className="stat-label">Average WPM</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-value" style={{ color: "var(--accent-primary)" }}>
            {avgAccuracy > 0 ? `${avgAccuracy}%` : "--"}
          </div>
          <div className="stat-label">Average Accuracy</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-value" style={{ color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span>{userData.streak?.count || 0}</span>
            <FlameIcon size={24} style={{ color: "#f59e0b" }} />
          </div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      {/* Phases Grid */}
      <div style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
          Structured Curriculum Phases
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          Follow your 6-week roadmap. Every problem includes pattern signals, intuition questions, and clean Python code.
        </p>

        <div className="phases-grid">
          {problemsData.phases.map((phase, pIdx) => {
            const phaseProbs = [];
            phase.days.forEach(d => d.problems.forEach(prob => phaseProbs.push(prob)));
            const phaseDone = phaseProbs.filter(p => userData.completedProblems[p.id]).length;
            const progress = Math.round((phaseDone / phaseProbs.length) * 100);
            const firstProb = phaseProbs[0];

            return (
              <div key={phase.id} className="phase-card glass-card">
                <div className="phase-card-header">
                  <span className="phase-card-week">Week {phase.week} • Phase {pIdx + 1}</span>
                  <span className="badge badge-easy">{phaseProbs.length} problems</span>
                </div>

                <h3>{phase.name}</h3>
                <p className="phase-card-desc">{phase.description}</p>

                <div className="phase-card-patterns">
                  {phase.days.map((d) => (
                    <span key={d.day} className="pattern-tag">
                      {d.pattern}
                    </span>
                  ))}
                </div>

                <div className="phase-card-progress" style={{ marginBottom: "16px" }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progress-text">{phaseDone}/{phaseProbs.length} ({progress}%)</span>
                </div>

                <Link
                  href={`/practice/${firstProb?.id || "two-sum"}`}
                  className="btn btn-ghost"
                  style={{ width: "100%", textAlign: "center", display: "inline-flex", justifyContent: "center", gap: "6px" }}
                >
                  <span>Start Phase {pIdx + 1}</span>
                  <ChevronRightIcon size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practice Focus Tips */}
      <section className="glass-card" style={{ padding: "32px", marginTop: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <LightbulbIcon size={20} style={{ color: "var(--accent-primary)" }} />
          <h3 style={{ fontSize: "1.25rem", margin: 0 }}>
            Why Type DSA Solutions?
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginTop: "16px" }}>
          <div>
            <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "6px" }}>
              1. 4-Space Python Indentation
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Tab automatically inputs 4 spaces. Train muscle memory for nesting blocks, loops, and conditional structures seamlessly.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "6px" }}>
              2. Special Symbol Muscle Memory
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Programming keys like `&#123;&#125;`, `[]`, `()`, `:`, `-&gt;`, `//` slow down regular touch typists. Drilling code removes that cognitive bottleneck.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "6px" }}>
              3. Pattern Recall Under Pressure
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Review the recognition signals and intuition questions before typing so you can reproduce templates effortlessly in interviews.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
