"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LightningIcon } from "@/components/Icons";

export default function AuthGuard({ children }) {
  const { status } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.replace("/login");
    }
  }, [status, isLoginPage, router]);

  // Always render login page without blocking
  if (isLoginPage) {
    return children;
  }

  // Loading state
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 120px)",
          gap: "16px"
        }}
      >
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
            color: "var(--accent-primary)",
            animation: "pulse 1.5s infinite ease-in-out"
          }}
        >
          <LightningIcon size={24} />
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", letterSpacing: "0.02em" }}>
          Authenticating DSA Typing Master...
        </div>
      </div>
    );
  }

  // If unauthenticated, render nothing while redirect occurs
  if (status === "unauthenticated") {
    return null;
  }

  // Authenticated
  return children;
}
