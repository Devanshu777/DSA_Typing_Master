"use client";

import { useState, useEffect, useRef } from "react";
import {
  SparklesIcon,
  ExternalLinkIcon,
  CloseIcon,
  MessageSquareIcon,
  LightbulbIcon,
  PlayIcon,
  CompassIcon,
  FilterIcon,
  SettingsIcon,
  LockIcon,
  CopyIcon,
  CheckIcon,
  CodeIcon
} from "@/components/Icons";

export default function RightChatPanel({
  problem,
  isOpen,
  onClose,
  width = 440,
  onStartResize
}) {
  const [activeMode, setActiveMode] = useState("chat"); // 'chat' | 'account'
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dsa_openai_api_key") || "";
      setApiKey(stored);
      setSavedKey(stored);
    }
  }, []);

  // Update initial tutor greeting when problem changes
  useEffect(() => {
    if (!problem) return;
    setMessages([
      {
        role: "assistant",
        content: `👋 Hi! I'm your AI coding mentor for **${problem.name}** (LeetCode #${problem.lcNumber || ""}).\n\n**Pattern:** \`${problem.pattern}\`\n\nAsk me anything: intuition, code explanation, time/space complexity, or debugging hints!`
      }
    ]);
  }, [problem?.id]);

  // Scroll internal chat container only (NEVER scroll the window)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSaveKey = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dsa_openai_api_key", apiKey.trim());
      setSavedKey(apiKey.trim());
    }
  };

  const handleClearKey = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("dsa_openai_api_key");
      setApiKey("");
      setSavedKey("");
    }
  };

  const getProblemPrompt = (customQ = "") => {
    return `LeetCode #${problem.lcNumber || ""} - ${problem.name}
Pattern: ${problem.pattern}
Difficulty: ${problem.difficulty}
Recognition Signals: ${(problem.signals || []).join(", ")}
Core Insight: ${problem.keyInsight || ""}

Python Solution:
\`\`\`python
${problem.code || ""}
\`\`\`

Question: ${customQ || "Please explain the intuition, algorithm breakdown, and edge cases for this problem."}`;
  };

  const openDockedChatGpt = (customQ = "") => {
    const text = getProblemPrompt(customQ);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
    const encoded = encodeURIComponent(text);
    const winWidth = 520;
    const winHeight = window.screen.height - 80;
    const leftPos = window.screen.width - winWidth;
    window.open(
      `https://chatgpt.com/?q=${encoded}`,
      "ChatGPT_DSA",
      `width=${winWidth},height=${winHeight},left=${leftPos},top=40,resizable=yes,scrollbars=yes`
    );
  };

  const copyProblemContext = () => {
    const text = getProblemPrompt();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputMsg).trim();
    if (!text) return;
    setInputMsg("");

    const newHistory = [...messages, { role: "user", content: text }];
    setMessages(newHistory);
    setLoading(true);

    if (savedKey) {
      try {
        const systemPrompt = `You are an expert DSA coding mentor. The student is practicing: ${problem.name} (${problem.pattern}). Solution code:\n${problem.code}\nKey Insight: ${problem.keyInsight}\nGive concise, crystal-clear algorithmic explanations with clean Python snippets.`;

        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${savedKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...newHistory
            ]
          })
        });

        const data = await res.json();
        if (data.choices && data.choices[0]) {
          setMessages([
            ...newHistory,
            { role: "assistant", content: data.choices[0].message.content }
          ]);
        } else {
          setMessages([
            ...newHistory,
            {
              role: "assistant",
              content: `⚠️ API Error: ${data.error?.message || "Failed to reach OpenAI."}`
            }
          ]);
        }
      } catch (err) {
        setMessages([
          ...newHistory,
          { role: "assistant", content: `⚠️ Network Error: ${err.message}` }
        ]);
      } finally {
        setLoading(false);
      }
    } else {
      // Smart built-in tutor response without requiring API key
      setTimeout(() => {
        let reply = "";
        const lower = text.toLowerCase();
        if (lower.includes("intuition") || lower.includes("how") || lower.includes("explain")) {
          reply = `💡 **Core Intuition for ${problem.name}:**\n\n${problem.keyInsight}\n\n**Recognition Signals:**\n${(problem.signals || []).map(s => `• "${s}"`).join("\n")}\n\nAsk for a dry run, hint, or complexity!`;
        } else if (lower.includes("complexity") || lower.includes("time") || lower.includes("space")) {
          reply = `⏱️ **Complexity Analysis:**\n\n• **Time Complexity:** O(N) — Every element enters and leaves the data structure at most once.\n• **Space Complexity:** O(N) or O(1) space depending on auxiliary structures.\n\nOptimal for standard interview constraints!`;
        } else if (lower.includes("hint") || lower.includes("help") || lower.includes("start")) {
          reply = `🎯 **Hint for ${problem.name}:**\n\nFocus on the invariant. What condition decides when to expand, shrink, or record the result?\n\nCheck the template structure in the solution tab!`;
        } else if (lower.includes("dry run") || lower.includes("example") || lower.includes("test")) {
          reply = `👣 **Step-by-Step Dry Run for ${problem.name}:**\n\n1. Initialize state variables.\n2. Iterate through input elements sequentially.\n3. Check invariant condition.\n4. Update result tracker.\n\nNeed specific values traced? Ask me with test numbers!`;
        } else {
          reply = `🤖 **DSA Mentor for ${problem.name}:**\n\n${problem.keyInsight}\n\n*(Tip: Click "Your ChatGPT Account" tab above to open with your logged-in ChatGPT, or enter an OpenAI API key to chat with GPT-4o directly!)*`;
        }
        setMessages([
          ...newHistory,
          { role: "assistant", content: reply }
        ]);
        setLoading(false);
      }, 400);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Draggable Resizer Bar */}
      <div
        className="ai-chat-resizer"
        onMouseDown={onStartResize}
        style={{
          width: "12px",
          minWidth: "12px",
          cursor: "col-resize",
          background: "transparent",
          position: "relative",
          zIndex: 30,
          userSelect: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        title="Drag left/right to resize ChatGPT panel"
      >
        <div
          style={{
            width: "1px",
            height: "100%",
            background: "var(--border-subtle)"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "4px",
            height: "36px",
            background: "var(--accent-primary)",
            borderRadius: "4px",
            opacity: 0.8,
            boxShadow: "0 0 8px var(--accent-primary-glow)"
          }}
        />
      </div>

      {/* Right AI Panel */}
      <div
        className="ai-chat-panel"
        style={{
          width: `${width}px`,
          minWidth: "300px",
          maxWidth: "65vw",
          flexShrink: 0,
          background: "var(--bg-secondary)",
          borderLeft: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.45)"
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-input)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              <SparklesIcon size={15} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", fontFamily: "var(--mono)" }}>
                AI Coding Assistant
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                {width}px • Resizable
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={() => openDockedChatGpt()}
              className="btn btn-ghost"
              style={{ padding: "4px 8px", fontSize: "0.72rem", height: "28px" }}
              title="Snap ChatGPT into a side window with your account"
            >
              <ExternalLinkIcon size={12} />
              <span>Popout</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: "4px 8px", minWidth: "28px", height: "28px" }}
              title="Close panel"
            >
              <CloseIcon size={13} />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div
          style={{
            display: "flex",
            padding: "6px 12px",
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border-subtle)",
            gap: "6px"
          }}
        >
          <button
            onClick={() => setActiveMode("chat")}
            className="btn btn-ghost"
            style={{
              flex: 1,
              padding: "6px 10px",
              fontSize: "0.76rem",
              fontFamily: "var(--mono)",
              background: activeMode === "chat" ? "var(--bg-elevated)" : "transparent",
              color: activeMode === "chat" ? "var(--accent-primary)" : "var(--text-secondary)",
              borderColor: activeMode === "chat" ? "var(--border-active)" : "transparent",
              gap: "6px"
            }}
          >
            <MessageSquareIcon size={13} />
            <span>In-App Tutor</span>
          </button>
          <button
            onClick={() => setActiveMode("account")}
            className="btn btn-ghost"
            style={{
              flex: 1,
              padding: "6px 10px",
              fontSize: "0.76rem",
              fontFamily: "var(--mono)",
              background: activeMode === "account" ? "var(--bg-elevated)" : "transparent",
              color: activeMode === "account" ? "var(--accent-primary)" : "var(--text-secondary)",
              borderColor: activeMode === "account" ? "var(--border-active)" : "transparent",
              gap: "6px"
            }}
          >
            <ExternalLinkIcon size={13} />
            <span>ChatGPT Account</span>
          </button>
        </div>

        {/* Mode 1: In-App AI Tutor */}
        {activeMode === "chat" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* Quick Prompt Chips */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                padding: "8px 12px",
                borderBottom: "1px solid var(--border-subtle)",
                background: "rgba(10, 10, 15, 0.4)",
                whiteSpace: "nowrap"
              }}
            >
              <button
                onClick={() => handleSend("Explain the core intuition and why this pattern works.")}
                className="btn btn-ghost"
                style={{ padding: "4px 8px", fontSize: "0.72rem", height: "26px" }}
              >
                <LightbulbIcon size={12} />
                <span>Intuition</span>
              </button>
              <button
                onClick={() => handleSend("Walk me through a step-by-step dry run with a simple test case.")}
                className="btn btn-ghost"
                style={{ padding: "4px 8px", fontSize: "0.72rem", height: "26px" }}
              >
                <PlayIcon size={10} />
                <span>Dry Run</span>
              </button>
              <button
                onClick={() => handleSend("What is the exact time and space complexity?")}
                className="btn btn-ghost"
                style={{ padding: "4px 8px", fontSize: "0.72rem", height: "26px" }}
              >
                <CompassIcon size={12} />
                <span>Complexity</span>
              </button>
              <button
                onClick={() => handleSend("What edge cases should I be careful of?")}
                className="btn btn-ghost"
                style={{ padding: "4px 8px", fontSize: "0.72rem", height: "26px" }}
              >
                <FilterIcon size={12} />
                <span>Edge Cases</span>
              </button>
              <button
                onClick={() => handleSend("Give me a small hint for coding the window condition.")}
                className="btn btn-ghost"
                style={{ padding: "4px 8px", fontSize: "0.72rem", height: "26px" }}
              >
                <SparklesIcon size={12} />
                <span>Hint</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    background: m.role === "user" ? "var(--accent-primary)" : "var(--bg-card)",
                    border: m.role === "user" ? "none" : "1px solid var(--border-subtle)",
                    color: "var(--text-primary)",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    maxWidth: "92%",
                    fontSize: "0.82rem",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word"
                  }}
                >
                  {m.content}
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "var(--bg-card)",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span style={{ animation: "pulse 1s infinite" }}>●</span> Thinking...
                </div>
              )}
            </div>

            {/* Optional API Key Bar */}
            <div
              style={{
                padding: "6px 16px",
                background: "var(--bg-input)",
                borderTop: "1px solid var(--border-subtle)",
                fontSize: "0.72rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>
                {savedKey ? "✓ Custom OpenAI API Key Active" : "Built-In DSA Pattern Mentor"}
              </span>
              <button
                onClick={() => {
                  const key = prompt(
                    "Optional: Enter your OpenAI API Key to chat with GPT-4o-mini directly inside this panel (stored only in your browser localStorage):",
                    savedKey
                  );
                  if (key !== null) {
                    if (key.trim()) {
                      localStorage.setItem("dsa_openai_api_key", key.trim());
                      setSavedKey(key.trim());
                    } else {
                      localStorage.removeItem("dsa_openai_api_key");
                      setSavedKey("");
                    }
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-primary)",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <SettingsIcon size={12} />
                <span>{savedKey ? "Change Key" : "Add OpenAI Key"}</span>
              </button>
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--border-subtle)",
                background: "var(--bg-secondary)",
                display: "flex",
                gap: "8px"
              }}
            >
              <input
                type="text"
                placeholder={`Ask query about ${problem.name}...`}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "0.82rem",
                  outline: "none"
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputMsg.trim()}
                className="btn btn-primary"
                style={{ padding: "8px 16px", fontSize: "0.85rem" }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Mode 2: Real ChatGPT Account Bridge (No broken iframe) */}
        {activeMode === "account" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Why OpenAI blocks iframes explanation */}
            <div
              style={{
                padding: "14px 16px",
                background: "rgba(236, 98, 66, 0.08)",
                border: "1px solid rgba(236, 98, 66, 0.25)",
                borderRadius: "var(--radius-md)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <LockIcon size={15} style={{ color: "var(--accent-primary)" }} />
                <strong style={{ fontSize: "0.85rem", color: "var(--accent-primary)" }}>
                  Why OpenAI Blocks Direct Iframes
                </strong>
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                For user security, OpenAI sets <code>X-Frame-Options: DENY</code>, which makes web browsers block embedding the <code>chatgpt.com</code> login directly inside an iframe.
              </p>
            </div>

            {/* 1-Click Docked Window Solution */}
            <div
              style={{
                padding: "18px",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div>
                <h4 style={{ fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "4px" }}>
                  Launch with Your Logged-In Account
                </h4>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Click below to open ChatGPT snapped to the right side of your screen. Your current problem, pattern signals, and Python code will be pre-filled automatically!
                </p>
              </div>

              <button
                onClick={() => openDockedChatGpt()}
                className="btn btn-primary"
                style={{
                  padding: "12px",
                  fontSize: "0.85rem",
                  gap: "8px"
                }}
              >
                <ExternalLinkIcon size={15} />
                <span>Open ChatGPT Docked (Logged In)</span>
              </button>

              <button
                onClick={copyProblemContext}
                className="btn btn-ghost"
                style={{
                  padding: "10px",
                  fontSize: "0.8rem",
                  gap: "6px"
                }}
              >
                {copied ? <CheckIcon size={14} style={{ color: "var(--easy)" }} /> : <CopyIcon size={14} />}
                <span>{copied ? "Copied to Clipboard!" : "Copy Problem Code & Context"}</span>
              </button>
            </div>

            {/* Quick 1-Click Launchers */}
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                Launch Pre-Built Prompts in Your ChatGPT:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  onClick={() => openDockedChatGpt("Explain the algorithmic intuition and how to recognize this pattern.")}
                  className="btn btn-ghost"
                  style={{ textAlign: "left", fontSize: "0.78rem", padding: "8px 12px", justifyContent: "flex-start", gap: "8px" }}
                >
                  <LightbulbIcon size={13} style={{ color: "var(--accent-primary)" }} />
                  <span><strong>Intuition:</strong> &ldquo;Why this pattern?&rdquo;</span>
                </button>
                <button
                  onClick={() => openDockedChatGpt("Walk me through this solution line-by-line with a concrete test case.")}
                  className="btn btn-ghost"
                  style={{ textAlign: "left", fontSize: "0.78rem", padding: "8px 12px", justifyContent: "flex-start", gap: "8px" }}
                >
                  <PlayIcon size={12} style={{ color: "var(--accent-secondary)" }} />
                  <span><strong>Dry Run:</strong> Step-by-step trace</span>
                </button>
                <button
                  onClick={() => openDockedChatGpt("What are common interview follow-ups and tricky edge cases for this problem?")}
                  className="btn btn-ghost"
                  style={{ textAlign: "left", fontSize: "0.78rem", padding: "8px 12px", justifyContent: "flex-start", gap: "8px" }}
                >
                  <FilterIcon size={13} style={{ color: "var(--medium)" }} />
                  <span><strong>Edge Cases:</strong> Common interview follow-ups</span>
                </button>
                <button
                  onClick={() => openDockedChatGpt("Review this code: are there any optimizations or cleaner Python idioms?")}
                  className="btn btn-ghost"
                  style={{ textAlign: "left", fontSize: "0.78rem", padding: "8px 12px", justifyContent: "flex-start", gap: "8px" }}
                >
                  <CodeIcon size={13} style={{ color: "var(--text-secondary)" }} />
                  <span><strong>Code Review:</strong> Python optimizations</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
