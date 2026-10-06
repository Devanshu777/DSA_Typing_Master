"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LightningIcon,
  CheckIcon,
  SparklesIcon,
  FlameIcon,
  CompassIcon
} from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const { status, loginWithGoogleCredential, loginWithMockGoogle, loginAsGuest, googleClientId } = useAuth();
  const gsiLoadedRef = useRef(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Load Google Identity Services script when googleClientId is available
  useEffect(() => {
    if (!googleClientId || gsiLoadedRef.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gsiLoadedRef.current = true;
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (res) => {
            if (res.credential) {
              loginWithGoogleCredential(res.credential);
            }
          }
        });

        const btnContainer = document.getElementById("gsi-button-container");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "filled_black",
            size: "large",
            width: "360",
            text: "continue_with"
          });
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [googleClientId, loginWithGoogleCredential]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative"
      }}
    >
      {/* Subtle background ambient blur glow */}
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 98, 66, 0.08) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      />

      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#181818",
          border: "1px solid var(--border-subtle)",
          borderRadius: "16px",
          padding: "36px 32px",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.8)",
          position: "relative",
          zIndex: 1
        }}
      >
        {/* Logo and Brand */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(236, 98, 66, 0.12)",
              border: "1px solid rgba(236, 98, 66, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              color: "var(--accent-primary)",
              boxShadow: "0 0 24px rgba(236, 98, 66, 0.15)"
            }}
          >
            <LightningIcon size={24} />
          </div>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0 0 8px 0" }}>
            Sign in to <span className="gradient-text">DSA Typing Master</span>
          </h1>

          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
            Master 85 LeetCode patterns, build rapid typing muscle memory, and track your daily consistency.
          </p>
        </div>

        {/* Official Google GSI Button Container */}
        <div
          id="gsi-button-container"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            minHeight: "44px",
            marginBottom: "4px"
          }}
        />

        {/* Fallback button if Client ID is not yet provided */}
        {!googleClientId && (
          <button
            onClick={() => loginWithMockGoogle("devanshu@gmail.com", "Devanshu")}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px 20px",
              background: "#1f1f1f",
              color: "#ffffff",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              fontSize: "0.92rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {/* Subtle 'OR' Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "18px 0 16px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
        </div>

        {/* Continue as Guest Button */}
        <button
          onClick={loginAsGuest}
          className="btn btn-ghost"
          style={{
            width: "100%",
            padding: "12px 20px",
            fontSize: "0.9rem",
            fontWeight: 600,
            border: "1px solid var(--border-subtle)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            color: "var(--text-primary)",
            background: "rgba(255, 255, 255, 0.04)",
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)")}
        >
          <CompassIcon size={16} style={{ color: "var(--accent-primary)" }} />
          <span>Continue as Guest</span>
        </button>

        <p style={{ textAlign: "center", marginTop: "10px", marginBottom: "0", fontSize: "0.74rem", color: "var(--text-muted)" }}>
          No login required • Saves progress locally in your browser storage
        </p>

        {/* Feature Highlights */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            <div style={{ color: "var(--easy)", display: "flex", alignItems: "center" }}>
              <CheckIcon size={14} />
            </div>
            <span>85 Curated Problems &amp; Sliding Window drills</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            <div style={{ color: "#f59e0b", display: "flex", alignItems: "center" }}>
              <FlameIcon size={14} />
            </div>
            <span>Persistent streaks, WPM curve, &amp; activity heatmap</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
            <div style={{ color: "var(--accent-primary)", display: "flex", alignItems: "center" }}>
              <SparklesIcon size={14} />
            </div>
            <span>100% Free • Zero Credit Card • Private &amp; Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
