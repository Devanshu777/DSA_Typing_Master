"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext({
  user: null,
  status: "loading", // "loading" | "authenticated" | "unauthenticated"
  loginWithGoogleCredential: () => {},
  loginWithMockGoogle: () => {},
  loginAsGuest: () => {},
  logout: () => {},
  googleClientId: ""
});

const AUTH_STORAGE_KEY = "dsa_auth_user_session_v1";

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // Decode standard Google ID Token (JWT)
  const decodeGoogleJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to decode Google JWT token", e);
      return null;
    }
  };

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
          setStatus("authenticated");
          return;
        }
      }
    } catch (e) {
      console.error("Failed to read user session", e);
    }
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Login using real Google credential token
  const loginWithGoogleCredential = useCallback((credential) => {
    const payload = decodeGoogleJwt(credential);
    if (payload && payload.email) {
      const userData = {
        id: payload.sub,
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        image: payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${payload.email}`,
        loginProvider: "google",
        loginAt: new Date().toISOString()
      };
      setUser(userData);
      setStatus("authenticated");
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      router.push("/");
    }
  }, [router]);

  // Demo / Fallback login (works even before Google Cloud keys are configured)
  const loginWithMockGoogle = useCallback((customEmail = "devanshu@gmail.com", customName = "Devanshu") => {
    const userData = {
      id: "google-usr-" + Date.now().toString().slice(-6),
      name: customName,
      email: customEmail,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customName)}&backgroundColor=ec6242`,
      loginProvider: "google",
      loginAt: new Date().toISOString()
    };
    setUser(userData);
    setStatus("authenticated");
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    router.push("/");
  }, [router]);

  // Guest login (no account required, 100% browser storage)
  const loginAsGuest = useCallback(() => {
    const guestData = {
      id: "guest-user",
      name: "Guest",
      email: "Guest Mode (Local Storage)",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=Guest&backgroundColor=ec6242",
      isGuest: true,
      loginProvider: "guest",
      loginAt: new Date().toISOString()
    };
    setUser(guestData);
    setStatus("authenticated");
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(guestData));
    router.push("/");
  }, [router]);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setStatus("unauthenticated");
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        loginWithGoogleCredential,
        loginWithMockGoogle,
        loginAsGuest,
        logout,
        googleClientId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
