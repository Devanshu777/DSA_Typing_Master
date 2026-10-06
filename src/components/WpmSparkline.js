"use client";

import { useMemo } from "react";

export default function WpmSparkline({ data = [], finalWpm = 0, burstWpm = 0 }) {
  // If data is very short (e.g. fast solve in < 3 sec), construct smooth endpoints
  const points = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { sec: 0, wpm: Math.round(finalWpm * 0.8) },
        { sec: 1, wpm: finalWpm },
        { sec: 2, wpm: finalWpm }
      ];
    }
    if (data.length === 1) {
      return [
        { sec: 0, wpm: Math.round(data[0].wpm * 0.7) },
        { sec: data[0].sec, wpm: data[0].wpm }
      ];
    }
    return data;
  }, [data, finalWpm]);

  const { pathD, areaD, maxWpm, minWpm } = useMemo(() => {
    const width = 440;
    const height = 90;
    const padding = 12;

    const wpms = points.map((p) => p.wpm);
    const max = Math.max(...wpms, finalWpm, burstWpm, 20);
    const min = Math.min(0, Math.min(...wpms));
    const range = max - min || 1;

    const n = points.length;
    const coords = points.map((p, idx) => {
      const x = padding + (idx / Math.max(1, n - 1)) * (width - 2 * padding);
      const y = height - padding - ((p.wpm - min) / range) * (height - 2 * padding);
      return { x, y };
    });

    if (coords.length === 0) return { pathD: "", areaD: "", maxWpm: max, minWpm: min };

    // Build smooth cubic bezier curve
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? i : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    const last = coords[coords.length - 1];
    const first = coords[0];
    const area = `${d} L ${last.x} ${height - padding} L ${first.x} ${height - padding} Z`;

    return {
      pathD: d,
      areaD: area,
      maxWpm: max,
      minWpm: min
    };
  }, [points, finalWpm, burstWpm]);

  return (
    <div
      style={{
        background: "#141414",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        padding: "14px 16px",
        marginTop: "16px",
        marginBottom: "16px",
        position: "relative"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          fontSize: "0.75rem",
          color: "var(--text-muted)"
        }}
      >
        <span style={{ fontWeight: 600 }}>Speed Progression Curve</span>
        <div style={{ display: "flex", gap: "12px", fontFamily: "var(--mono)" }}>
          <span>Burst: <strong style={{ color: "var(--accent-secondary)" }}>{burstWpm || finalWpm} WPM</strong></span>
          <span>Avg: <strong style={{ color: "var(--accent-primary)" }}>{finalWpm} WPM</strong></span>
        </div>
      </div>

      <svg
        viewBox="0 0 440 90"
        style={{ width: "100%", height: "85px", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EC6242" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EC6242" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Subtle grid lines */}
        <line x1="12" y1="20" x2="428" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
        <line x1="12" y1="50" x2="428" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
        <line x1="12" y1="78" x2="428" y2="78" stroke="rgba(255,255,255,0.06)" />

        {/* Area fill */}
        {areaD && <path d={areaD} fill="url(#wpmGradient)" />}

        {/* Line curve */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="#EC6242"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}
