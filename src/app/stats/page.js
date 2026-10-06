"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import problemsData from "@/data/problems";
import { getStoredData } from "@/utils/storage";
import Footer from "@/components/Footer";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import {
  CompassIcon,
  FlameIcon,
  ChevronRightIcon,
  CloseIcon
} from "@/components/Icons";

export default function StatsPage() {
  const [data, setData] = useState({
    completedProblems: {},
    history: [],
    streak: { count: 0 }
  });

  const loadData = () => {
    setData(getStoredData());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("dsa_stats_updated", loadData);
    return () => window.removeEventListener("dsa_stats_updated", loadData);
  }, []);

  const history = data.history || [];
  const completedMap = data.completedProblems || {};
  const completedCount = Object.keys(completedMap).length;

  const totalProblems = problemsData.phases.reduce((acc, p) => {
    return acc + p.days.reduce((dAcc, d) => dAcc + d.problems.length, 0);
  }, 0);

  const bestWpm = history.reduce((max, s) => Math.max(max, s.wpm || 0), 0);
  const avgWpm =
    history.length > 0
      ? Math.round(history.reduce((sum, s) => sum + (s.wpm || 0), 0) / history.length)
      : 0;
  const avgAccuracy =
    history.length > 0
      ? Math.round(history.reduce((sum, s) => sum + (s.accuracy || 0), 0) / history.length)
      : 0;

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all your typing statistics and progress?")) {
      localStorage.removeItem("dsa_typing_data_v1");
      loadData();
      window.dispatchEvent(new Event("dsa_stats_updated"));
    }
  };

  return (
    <div className="container stats-page" style={{ paddingBottom: "80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CompassIcon size={22} style={{ color: "var(--accent-primary)" }} />
            <h1 style={{ fontSize: "1.8rem", margin: 0 }}>
              Performance &amp; Mastery Analytics
            </h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
            Track your code typing speed, pattern fluency, and accuracy gains over time.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleResetData}
            className="btn btn-ghost"
            style={{ color: "var(--accent-error)", borderColor: "rgba(239, 68, 68, 0.3)", fontSize: "0.78rem", gap: "6px" }}
          >
            <CloseIcon size={12} />
            <span>Reset Progress</span>
          </button>
        )}
      </div>

      {/* Top Overview Cards */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="stat-card glass-card">
          <div className="stat-value gradient-text">
            {completedCount} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ {totalProblems}</span>
          </div>
          <div className="stat-label">Problems Mastered</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-value" style={{ color: "var(--accent-secondary)" }}>
            {bestWpm > 0 ? bestWpm : "--"}
          </div>
          <div className="stat-label">Peak Speed (WPM)</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-value" style={{ color: "var(--accent-primary)" }}>
            {avgWpm > 0 ? avgWpm : "--"}
          </div>
          <div className="stat-label">Average Speed (WPM)</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-value" style={{ color: "var(--accent-warning)" }}>
            {avgAccuracy > 0 ? `${avgAccuracy}%` : "--"}
          </div>
          <div className="stat-label">Average Accuracy</div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-value" style={{ color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span>{data.streak?.count || 0}</span>
            <FlameIcon size={20} style={{ color: "#f59e0b" }} />
          </div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>

      {/* Activity Consistency Heatmap */}
      <ActivityHeatmap history={history} streak={data.streak} />

      {/* Phase Completion Breakdown */}
      <div className="glass-card" style={{ padding: "28px", marginBottom: "32px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
          Curriculum Phase Completion
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {problemsData.phases.map((phase) => {
            const phaseProbs = [];
            phase.days.forEach(d => d.problems.forEach(p => phaseProbs.push(p)));
            const doneInPhase = phaseProbs.filter(p => completedMap[p.id]).length;
            const pct = Math.round((doneInPhase / phaseProbs.length) * 100);

            return (
              <div key={phase.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 600 }}>{phase.name}</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {doneInPhase} / {phaseProbs.length} ({pct}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Practice Sessions */}
      <div className="glass-card" style={{ padding: "28px" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "16px" }}>
          Recent Practice Sessions ({history.length})
        </h3>

        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            <p style={{ marginBottom: "16px" }}>No typing sessions recorded yet.</p>
            <Link href="/practice" className="btn btn-primary" style={{ padding: "10px 20px" }}>
              <span>Start Your First Practice Session</span>
              <ChevronRightIcon size={14} />
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "10px 12px" }}>Problem</th>
                  <th style={{ padding: "10px 12px" }}>Speed</th>
                  <th style={{ padding: "10px 12px" }}>Accuracy</th>
                  <th style={{ padding: "10px 12px" }}>Time</th>
                  <th style={{ padding: "10px 12px" }}>Date</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((session, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
                      transition: "background 0.15s ease"
                    }}
                  >
                    <td style={{ padding: "12px", fontWeight: 600 }}>
                      {session.problemName}
                    </td>
                    <td style={{ padding: "12px", color: "var(--accent-secondary)", fontFamily: "var(--mono)" }}>
                      {session.wpm} WPM
                    </td>
                    <td style={{ padding: "12px", color: "var(--accent-primary)", fontFamily: "var(--mono)" }}>
                      {session.accuracy}%
                    </td>
                    <td style={{ padding: "12px", color: "var(--text-secondary)", fontFamily: "var(--mono)" }}>
                      {session.timeSec}s
                    </td>
                    <td style={{ padding: "12px", color: "var(--text-muted)" }}>
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <Link
                        href={`/practice/${session.problemId}`}
                        className="btn btn-ghost"
                        style={{ padding: "4px 10px", fontSize: "0.75rem", gap: "4px" }}
                      >
                        <span>Retype</span>
                        <ChevronRightIcon size={11} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div style={{ marginTop: "40px" }}>
        <Footer />
      </div>
    </div>
  );
}
