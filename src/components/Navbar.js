"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import problemsData from "@/data/problems";
import { getStoredData } from "@/utils/storage";
import { useAuth } from "@/context/AuthContext";
import CommandPalette from "@/components/CommandPalette";
import SoundSettingsModal from "@/components/SoundSettingsModal";
import {
  LightningIcon,
  FlameIcon,
  CheckIcon,
  VolumeOnIcon,
  VolumeOffIcon,
  SearchIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon
} from "@/components/Icons";

const totalProblemCount = problemsData.phases.reduce((acc, p) => {
  return acc + p.days.reduce((dAcc, d) => dAcc + d.problems.length, 0);
}, 0);

const themesList = [
  {
    id: "default",
    name: "OG Theme (Default)",
    desc: "Warm Letta Orange & Obsidian",
    icon: LightningIcon,
    accentColor: "#EC6242",
    bgPreview: "#181818"
  },
  {
    id: "cursor-dark",
    name: "Cursor Dark",
    desc: "Midnight Blue & VS Code Syntax",
    icon: MoonIcon,
    accentColor: "#007acc",
    bgPreview: "#0e0e11"
  },
  {
    id: "cursor-light",
    name: "Cursor Light",
    desc: "Warm Ivory Cream & Royal Blue",
    icon: SunIcon,
    accentColor: "#0066b8",
    bgPreview: "#FAF7EE"
  }
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ streak: 0, completedCount: 0, sound: true, soundProfile: "thock" });
  const [theme, setTheme] = useState("default");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Initialize theme from localStorage, default to 'default' (OG)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dsa_theme") || "default";
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  const selectTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsThemeMenuOpen(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("dsa_theme", selectedTheme);
      document.documentElement.setAttribute("data-theme", selectedTheme);
      window.dispatchEvent(new CustomEvent("dsa_theme_changed", { detail: selectedTheme }));
    }
  };

  // Close theme menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setIsThemeMenuOpen(false);
      }
    };
    if (isThemeMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isThemeMenuOpen]);

  const loadStats = () => {
    const data = getStoredData();
    const count = Object.keys(data.completedProblems || {}).length;
    setStats({
      streak: data.streak?.count || 0,
      completedCount: count,
      sound: data.soundEnabled !== false,
      soundProfile: data.soundProfile || "thock"
    });
  };

  useEffect(() => {
    loadStats();
    window.addEventListener("dsa_stats_updated", loadStats);
    return () => window.removeEventListener("dsa_stats_updated", loadStats);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "rgba(236, 98, 66, 0.12)",
              border: "1px solid rgba(236, 98, 66, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-primary)"
            }}
          >
            <LightningIcon size={16} />
          </div>
          <span>DSA</span> Typing Master
        </Link>

        <div className="navbar-links">
          <Link href="/" className={pathname === "/" ? "active" : ""}>
            Dashboard
          </Link>
          <Link
            href="/practice"
            className={pathname.startsWith("/practice") ? "active" : ""}
          >
            Practice
          </Link>
          <Link href="/stats" className={pathname === "/stats" ? "active" : ""}>
            Stats
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Quick Search Palette Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="btn btn-ghost"
            style={{
              padding: "6px 10px",
              height: "32px",
              fontSize: "0.78rem",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.03)"
            }}
            title="Search Problems & Patterns (Ctrl + K)"
          >
            <SearchIcon size={14} style={{ color: "var(--text-muted)" }} />
            <span className="desktop-only" style={{ color: "var(--text-secondary)" }}>Search</span>
            <kbd
              className="desktop-only"
              style={{
                fontFamily: "var(--mono)",
                fontSize: "0.68rem",
                background: "rgba(255, 255, 255, 0.08)",
                padding: "1px 5px",
                borderRadius: "3px",
                color: "var(--text-muted)",
                marginLeft: "2px"
              }}
            >
              Ctrl K
            </kbd>
          </button>

          {stats.streak > 0 && (
            <div
              className="badge"
              style={{
                background: "rgba(245, 158, 11, 0.12)",
                color: "#f59e0b",
                border: "1px solid rgba(245, 158, 11, 0.25)"
              }}
              title="Daily Practice Streak"
            >
              <FlameIcon size={13} style={{ color: "#f59e0b" }} />
              <span>{stats.streak}d</span>
            </div>
          )}

          <div
            className="badge badge-easy"
            style={{ fontSize: "0.74rem", cursor: "default" }}
            title="Completed Problems"
          >
            <CheckIcon size={12} style={{ color: "var(--easy)" }} />
            <span>{stats.completedCount} <span className="desktop-only">/ {totalProblemCount}</span></span>
          </div>

          {/* Sound Controls Trigger (Profile & Volume) */}
          <button
            onClick={() => setIsSoundModalOpen(true)}
            className="btn btn-ghost"
            style={{ padding: "6px 8px", height: "32px", gap: "6px", fontSize: "0.76rem" }}
            title="Configure Mechanical Switch Sound Profiles"
          >
            {stats.sound ? (
              <>
                <VolumeOnIcon size={15} style={{ color: "var(--accent-primary)" }} />
                <span className="desktop-only" style={{ textTransform: "capitalize", color: "var(--text-secondary)" }}>
                  {stats.soundProfile}
                </span>
              </>
            ) : (
              <>
                <VolumeOffIcon size={15} style={{ color: "var(--text-muted)" }} />
                <span className="desktop-only" style={{ color: "var(--text-muted)" }}>Muted</span>
              </>
            )}
          </button>

          {/* 3-Theme Selector: OG Default, Cursor Dark, Cursor Light */}
          <div style={{ position: "relative" }} ref={themeMenuRef}>
            <button
              onClick={() => setIsThemeMenuOpen(prev => !prev)}
              className="btn btn-ghost"
              style={{ padding: "6px 10px", height: "32px", gap: "6px", fontSize: "0.76rem" }}
              title="Change Theme (Default OG, Cursor Dark, Cursor Light)"
            >
              {theme === "cursor-light" || theme === "light" ? (
                <SunIcon size={14} style={{ color: "var(--accent-primary)" }} />
              ) : theme === "cursor-dark" ? (
                <MoonIcon size={14} style={{ color: "var(--accent-primary)" }} />
              ) : (
                <LightningIcon size={14} style={{ color: "var(--accent-primary)" }} />
              )}
              <span className="desktop-only" style={{ color: "var(--text-secondary)" }}>
                {theme === "cursor-light" || theme === "light"
                  ? "Cursor Light"
                  : theme === "cursor-dark"
                  ? "Cursor Dark"
                  : "OG Theme"}
              </span>
              <ChevronDownIcon size={11} style={{ opacity: 0.6 }} />
            </button>

            {isThemeMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "6px",
                  width: "235px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  padding: "6px",
                  zIndex: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <div style={{ padding: "6px 8px 4px 8px", fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Select Theme
                </div>
                {themesList.map((t) => {
                  const isActive = theme === t.id || (t.id === "default" && (theme === "og" || !theme));
                  const IconComp = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => selectTheme(t.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: "var(--radius-sm)",
                        background: isActive ? "var(--bg-elevated)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                        width: "100%"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "4px",
                            background: t.bgPreview,
                            border: `1.5px solid ${t.accentColor}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          }}
                        >
                          <IconComp size={11} style={{ color: t.accentColor }} />
                        </span>
                        <div>
                          <div style={{ fontSize: "0.8rem", fontWeight: isActive ? 700 : 500, color: "var(--text-primary)" }}>
                            {t.name}
                          </div>
                          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                            {t.desc}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <CheckIcon size={13} style={{ color: "var(--accent-secondary)" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <a
            href="https://github.com/Devanshu777/DSA_Typing_Master"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost desktop-only"
            style={{ padding: "6px 10px", height: "32px", fontSize: "0.75rem" }}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>

          {/* User Profile / Auth State */}
          {user ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsProfileOpen(prev => !prev)}
                className="btn btn-ghost"
                style={{
                  padding: "3px 10px 3px 6px",
                  height: "32px",
                  gap: "6px",
                  borderRadius: "20px",
                  background: user.isGuest ? "rgba(255, 255, 255, 0.05)" : "rgba(236, 98, 66, 0.08)",
                  border: user.isGuest ? "1px solid var(--border-subtle)" : "1px solid rgba(236, 98, 66, 0.3)"
                }}
                title={user.isGuest ? "Browsing in Guest Mode (Local Storage)" : `Logged in as ${user.name}`}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
                <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.isGuest ? "Guest" : user.name.split(" ")[0]}
                </span>
              </button>

              {isProfileOpen && (
                <div
                  className="glass-card"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "220px",
                    background: "#181818",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "10px",
                    padding: "8px",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
                    zIndex: 1000
                  }}
                >
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "6px" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff" }}>
                      {user.isGuest ? "Guest Mode" : user.name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.isGuest ? "Browser Storage Active" : user.email}
                    </div>
                  </div>
                  <Link
                    href="/stats"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: "block",
                      padding: "6px 10px",
                      fontSize: "0.78rem",
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      borderRadius: "6px"
                    }}
                  >
                    My Stats &amp; Heatmap
                  </Link>

                  {user.isGuest ? (
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "6px 10px",
                        fontSize: "0.78rem",
                        color: "var(--accent-primary)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "6px"
                      }}
                    >
                      Sign In with Google
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "6px 10px",
                        fontSize: "0.78rem",
                        color: "var(--accent-error)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "6px"
                      }}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary"
              style={{ height: "32px", fontSize: "0.78rem", padding: "6px 14px" }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Global Modals */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SoundSettingsModal isOpen={isSoundModalOpen} onClose={() => setIsSoundModalOpen(false)} />
    </nav>
  );
}

