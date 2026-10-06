"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LightningIcon,
  CheckIcon,
  SparklesIcon,
  FlameIcon
} from "@/components/Icons";

export default function LoginPage() {
  const router = useRouter();
  const { user, status, loginWithGoogleCredential, loginWithMockGoogle, googleClientId } = useAuth();
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [showManualLogin, setShowManualLogin] = useState(false);
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

  const handleQuickGoogleSignIn = () => {
    if (googleClientId && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // One-click demo sign in
      loginWithMockGoogle("devanshu@gmail.com", "Devanshu");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split("@")[0];
    loginWithMockGoogle(customEmail.trim(), name);
  };

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

        {/* Real GSI Button container if Google Client ID is configured */}
        <div
          id="gsi-button-container"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: googleClientId ? "16px" : "0px"
          }}
        />

        {/* Primary Google Sign In Button */}
        <button
          onClick={handleQuickGoogleSignIn}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "12px 20px",
            background: "#ffffff",
            color: "#1f1f1f",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "0.92rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          {/* Official Google 'G' Logo SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Or custom Google account login */}
        <div style={{ textAlign: "center", margin: "16px 0 12px 0" }}>
          <button
            onClick={() => setShowManualLogin((prev) => !prev)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {showManualLogin ? "Hide manual account input" : "Or sign in with custom Gmail / Name"}
          </button>
        </div>

        {showManualLogin && (
          <form
            onSubmit={handleManualSubmit}
            style={{
              background: "#141414",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                Google Email (@gmail.com)
              </label>
              <input
                type="email"
                required
                placeholder="your.name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1c1c1c",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  color: "#fff",
                  fontSize: "0.82rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                Display Name
              </label>
              <input
                type="text"
                placeholder="Devanshu"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: "100%",
                  background: "#1c1c1c",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  color: "#fff",
                  fontSize: "0.82rem"
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "8px", fontSize: "0.82rem", marginTop: "4px" }}
            >
              Sign In
            </button>
          </form>
        )}

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
