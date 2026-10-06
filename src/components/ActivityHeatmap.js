"use client";

import { useMemo, useState } from "react";
import { FlameIcon } from "@/components/Icons";

export default function ActivityHeatmap({ history = [], streak = { count: 0 } }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Build daily counts map: { "YYYY-MM-DD": count }
  const dailyCounts = useMemo(() => {
    const map = {};
    history.forEach((session) => {
      if (session.date) {
        const dayStr = session.date.slice(0, 10);
        map[dayStr] = (map[dayStr] || 0) + 1;
      }
    });
    return map;
  }, [history]);

  // Generate past 20 weeks (140 days) ending on today
  const { weeks, activeDaysCount, totalDrills } = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sunday
    // Start from Sunday of 20 weeks ago
    const totalDays = 20 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (totalDays - 1) - dayOfWeek);

    const generatedWeeks = [];
    let currentWeek = [];
    let activeDays = 0;
    let totalCount = 0;

    for (let i = 0; i < totalDays + dayOfWeek + 1; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const isoKey = d.toISOString().slice(0, 10);
      const count = dailyCounts[isoKey] || 0;
      if (count > 0) activeDays++;
      totalCount += count;

      currentWeek.push({
        date: d,
        isoKey,
        count
      });

      if (currentWeek.length === 7) {
        generatedWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      generatedWeeks.push(currentWeek);
    }

    return {
      weeks: generatedWeeks,
      activeDaysCount: activeDays,
      totalDrills: totalCount
    };
  }, [dailyCounts]);

  const getColor = (count) => {
    if (count === 0) return "#202020";
    if (count === 1) return "rgba(236, 98, 66, 0.3)";
    if (count === 2) return "rgba(236, 98, 66, 0.55)";
    if (count <= 4) return "rgba(236, 98, 66, 0.8)";
    return "var(--accent-primary)";
  };

  return (
    <div className="glass-card" style={{ padding: "24px 28px", marginBottom: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 600 }}>
            DSA Typing Consistency Heatmap
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Daily practice sessions over the last 20 weeks
          </p>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-primary)", fontFamily: "var(--mono)" }}>
              {activeDaysCount}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Active Days</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--accent-secondary)", fontFamily: "var(--mono)" }}>
              {totalDrills}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Total Drills</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f59e0b", fontFamily: "var(--mono)", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>{streak.count || 0}</span>
              <FlameIcon size={14} style={{ color: "#f59e0b" }} />
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Day Streak</div>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div style={{ overflowX: "auto", paddingBottom: "6px" }}>
        <div style={{ display: "flex", gap: "4px", minWidth: "600px" }}>
          {/* Day of week labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              paddingRight: "6px",
              fontSize: "0.65rem",
              color: "var(--text-muted)",
              justifyContent: "space-between",
              height: "108px"
            }}
          >
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* Week columns */}
          {weeks.map((week, wIdx) => (
            <div
              key={wIdx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              {week.map((day) => {
                const isHovered = hoveredCell?.isoKey === day.isoKey;
                return (
                  <div
                    key={day.isoKey}
                    onMouseEnter={() => setHoveredCell(day)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "2px",
                      backgroundColor: getColor(day.count),
                      cursor: "pointer",
                      border: isHovered
                        ? "1px solid #fff"
                        : "1px solid rgba(255, 255, 255, 0.04)",
                      transition: "all 0.1s ease"
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Footer Legend & Hover Details */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px",
          paddingTop: "10px",
          borderTop: "1px solid var(--border-subtle)",
          fontSize: "0.75rem",
          color: "var(--text-muted)"
        }}
      >
        <div style={{ minHeight: "18px" }}>
          {hoveredCell ? (
            <span>
              <strong style={{ color: "var(--text-primary)" }}>{hoveredCell.count} drill{hoveredCell.count === 1 ? "" : "s"}</strong> on {hoveredCell.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          ) : (
            <span>Hover over any day to see activity</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>Less</span>
          <div style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "#202020" }} />
          <div style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "rgba(236, 98, 66, 0.3)" }} />
          <div style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "rgba(236, 98, 66, 0.55)" }} />
          <div style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "rgba(236, 98, 66, 0.8)" }} />
          <div style={{ width: "11px", height: "11px", borderRadius: "2px", backgroundColor: "var(--accent-primary)" }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
