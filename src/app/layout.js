import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import AuthGuard from "@/components/AuthGuard";

export const metadata = {
  title: "DSA Typing Master — Code Speed & Pattern Fluency",
  description: "Internalize LeetCode patterns and algorithm templates while building blazing-fast code typing muscle memory.",
  keywords: ["DSA", "LeetCode", "Typing Practice", "Python", "Algorithms", "Coding Interview"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AuthProvider>
          <Navbar />
          <AuthGuard>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              {children}
            </div>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
