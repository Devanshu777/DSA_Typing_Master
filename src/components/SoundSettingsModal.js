"use client";

import { useState, useEffect } from "react";
import {
  getStoredData,
  toggleSoundPref,
  setSoundProfilePref,
  setSoundVolumePref
} from "@/utils/storage";
import { playKeySound } from "@/utils/sound";
import {
  VolumeOnIcon,
  VolumeOffIcon,
  CloseIcon,
  CheckIcon,
  SparklesIcon
} from "@/components/Icons";

const SWITCH_PROFILES = [
  {
    id: "thock",
    name: "Creamy Thock",
    subtitle: "Gateron Yellow Linear",
    desc: "Deep, resonant, buttery acoustic pop with low-frequency travel.",
    badge: "Most Popular"
  },
  {
    id: "clicky",
    name: "Tactile Clicky",
    subtitle: "Cherry MX Blue",
    desc: "Crisp, snappy high-frequency tactile reset snap for sharp rhythm.",
    badge: "Tactile"
  },
  {
    id: "silent",
    name: "Silent Topre",
    subtitle: "Electro-Capacitive Cushion",
    desc: "Ultra-quiet damped bump, perfect for library or late-night flow.",
    badge: "Quiet"
  }
];

export default function SoundSettingsModal({ isOpen, onClose }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [profile, setProfile] = useState("thock");
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    if (!isOpen) return;
    const data = getStoredData();
    setSoundEnabled(data.soundEnabled !== false);
    setProfile(data.soundProfile || "thock");
    setVolume(typeof data.soundVolume === "number" ? data.soundVolume : 0.7);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const next = toggleSoundPref();
    setSoundEnabled(next);
  };

  const handleSelectProfile = (profId) => {
    setProfile(profId);
    setSoundProfilePref(profId);
    setTimeout(() => {
      playKeySound(false);
    }, 40);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setSoundVolumePref(val);
  };

  const handleTestKey = () => {
    playKeySound(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#181818",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(236, 98, 66, 0.12)",
                border: "1px solid rgba(236, 98, 66, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-primary)"
              }}
            >
              <VolumeOnIcon size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", margin: 0, fontWeight: 600 }}>
                Acoustic Switch Profiles
              </h2>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Zero latency Web Audio mechanical key synthesizer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: "6px", width: "28px", height: "28px" }}
          >
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Master Mute & Volume */}
        <div
          style={{
            background: "#1f1f1f",
            border: "1px solid var(--border-subtle)",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
              Master Key Sound
            </span>
            <button
              onClick={handleToggleMute}
              className={`btn ${soundEnabled ? "btn-primary" : "btn-ghost"}`}
              style={{ padding: "4px 12px", height: "28px", fontSize: "0.75rem" }}
            >
              {soundEnabled ? (
                <>
                  <VolumeOnIcon size={13} />
                  <span>Enabled</span>
                </>
              ) : (
                <>
                  <VolumeOffIcon size={13} />
                  <span>Muted</span>
                </>
              )}
            </button>
          </div>

          {soundEnabled && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginBottom: "6px"
                }}
              >
                <span>Volume</span>
                <span style={{ fontFamily: "var(--mono)" }}>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  width: "100%",
                  accentColor: "var(--accent-primary)",
                  cursor: "pointer"
                }}
              />
            </div>
          )}
        </div>

        {/* Switch Profiles List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, paddingLeft: "2px" }}>
            Select Switch Profile
          </div>

          {SWITCH_PROFILES.map((prof) => {
            const isSelected = profile === prof.id;
            return (
              <div
                key={prof.id}
                onClick={() => handleSelectProfile(prof.id)}
                style={{
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: isSelected
                    ? "1px solid var(--accent-primary)"
                    : "1px solid var(--border-subtle)",
                  background: isSelected
                    ? "rgba(236, 98, 66, 0.08)"
                    : "#1c1c1c",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: isSelected ? "var(--text-primary)" : "var(--text-secondary)" }}>
                      {prof.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        background: isSelected ? "rgba(236, 98, 66, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        color: isSelected ? "var(--accent-primary)" : "var(--text-muted)"
                      }}
                    >
                      {prof.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {prof.desc}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "12px" }}>
                  {isSelected && (
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "var(--accent-primary)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <CheckIcon size={12} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
          <button
            onClick={handleTestKey}
            className="btn btn-ghost"
            style={{ fontSize: "0.78rem", padding: "6px 14px" }}
          >
            <span>Preview Keystroke</span>
            <SparklesIcon size={13} style={{ color: "var(--accent-primary)" }} />
          </button>

          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ fontSize: "0.82rem", padding: "8px 20px" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
