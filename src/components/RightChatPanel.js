"use client";

import { useState, useEffect, useRef } from "react";
import {
  SparklesIcon,
  ExternalLinkIcon,
  CloseIcon,
  LightbulbIcon,
  PlayIcon,
  CompassIcon,
  FilterIcon,
  SettingsIcon,
  RotateCcwIcon,
  CopyIcon,
  CheckIcon
} from "@/components/Icons";

export default function RightChatPanel({
  problem,
  isOpen,
  onClose,
  width = 440,
  onStartResize
}) {
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dsa_openai_api_key") || "";
      setApiKey(stored);
      setSavedKey(stored);
    }
  }, []);

  // Reset/initialize conversation when problem changes
  useEffect(() => {
    if (!problem) return;
    setMessages([
      {
        role: "assistant",
        content: `👋 Hi! I'm your AI coding mentor for **${problem.name}** (LeetCode #${problem.lcNumber || ""}).\n\n**Pattern:** \`${problem.pattern}\`\n\nAsk me anything: core intuition, line-by-line dry run, time/space complexity, or debugging hints!`
      }
    ]);
  }, [problem?.id, problem?.name, problem?.lcNumber, problem?.pattern]);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleClearChat = () => {
    if (!problem) return;
    setMessages([
      {
        role: "assistant",
        content: `👋 Chat reset. Ask anything about **${problem.name}**!`
      }
    ]);
  };

  const handleSaveKey = () => {
    if (typeof window !== "undefined") {
      const clean = apiKey.trim();
      if (clean) {
        localStorage.setItem("dsa_openai_api_key", clean);
        setSavedKey(clean);
      } else {
        localStorage.removeItem("dsa_openai_api_key");
        setSavedKey("");
      }
      setIsSettingsOpen(false);
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

  const openInExternalChatGpt = (customQ = "") => {
    const text = getProblemPrompt(customQ);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    const encoded = encodeURIComponent(text);
    window.open(`https://chatgpt.com/?q=${encoded}`, "_blank", "noopener,noreferrer");
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
      // Smart built-in tutor response without requiring external API key
      setTimeout(() => {
        let reply = "";
        const lower = text.toLowerCase();
        if (lower.includes("intuition") || lower.includes("how") || lower.includes("why") || lower.includes("pattern")) {
          reply = `💡 **Core Intuition for ${problem.name}:**\n\n${problem.keyInsight || "Focus on the invariant properties of this pattern."}\n\n**Recognition Signals:**\n${(problem.signals || []).map(s => `• "${s}"`).join("\n")}\n\nTry asking for a dry run, edge cases, or complexity breakdown!`;
        } else if (lower.includes("complexity") || lower.includes("time") || lower.includes("space")) {
          reply = `⏱️ **Complexity Analysis for ${problem.name}:**\n\n• **Time Complexity:** O(N) optimal traversal — single pass with constant-time operations.\n• **Space Complexity:** O(N) or O(1) auxiliary space depending on hash maps or pointers.\n\nOptimal for top-tier technical interviews!`;
        } else if (lower.includes("hint") || lower.includes("help") || lower.includes("start")) {
          reply = `🎯 **Hint for ${problem.name}:**\n\nPay attention to the state invariant. When do you update the tracker, and what condition triggers the next step?\n\nReview the template in the solution tab to see the pattern in action!`;
        } else if (lower.includes("dry run") || lower.includes("trace") || lower.includes("example")) {
          reply = `👣 **Step-by-Step Dry Run for ${problem.name}:**\n\n1. Initialize state variables (pointers, hash map, or accumulator).\n2. Iterate through input elements sequentially.\n3. Verify invariant condition at each index.\n4. Update result tracker and return the final answer.\n\nCheck the Example Walkthrough under the Problem & Signals tab!`;
        } else if (lower.includes("edge") || lower.includes("case") || lower.includes("pitfall")) {
          reply = `🔍 **Key Edge Cases to Guard Against:**\n\n• Empty array / string or single-element input\n• Duplicate values or identical elements\n• Negative integers or 0 values\n• Out-of-bounds indices at boundaries`;
        } else {
          reply = `🤖 **DSA Mentor for ${problem.name}:**\n\n${problem.keyInsight || "Keep practicing pattern recognition!"}\n\n*(Tip: Click ⚙️ Settings at the top to connect an OpenAI API key for unconstrained GPT-4o responses, or click \"Ask in ChatGPT ↗\" to discuss externally!)*`;
        }
        setMessages([
          ...newHistory,
          { role: "assistant", content: reply }
        ]);
        setLoading(false);
      }, 350);
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
        title="Drag left/right to resize AI Assistant panel"
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
          minWidth: "320px",
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
                AI Coding Mentor
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                {problem.pattern}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => openInExternalChatGpt()}
              className="btn btn-ghost"
              style={{ padding: "4px 8px", fontSize: "0.72rem", height: "28px", gap: "4px" }}
              title="Open problem context in ChatGPT (copies prompt to clipboard)"
            >
              {copied ? <CheckIcon size={12} style={{ color: "var(--easy)" }} /> : <ExternalLinkIcon size={12} />}
              <span>{copied ? "Copied!" : "ChatGPT ↗"}</span>
            </button>
            <button
              onClick={handleClearChat}
              className="btn btn-ghost"
              style={{ padding: "4px 8px", minWidth: "28px", height: "28px" }}
              title="Reset conversation"
            >
              <RotateCcwIcon size={12} />
            </button>
            <button
              onClick={() => setIsSettingsOpen(prev => !prev)}
              className="btn btn-ghost"
              style={{ padding: "4px 8px", minWidth: "28px", height: "28px" }}
              title="OpenAI API Key Settings"
            >
              <SettingsIcon size={13} style={{ color: savedKey ? "var(--easy)" : "var(--text-muted)" }} />
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

        {/* API Key Settings Drawer/Overlay */}
        {isSettingsOpen && (
          <div
            style={{
              padding: "14px 16px",
              background: "var(--bg-elevated)",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>
                OpenAI API Key (Optional)
              </span>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="btn btn-ghost"
                style={{ padding: "2px 6px", height: "22px", fontSize: "0.7rem" }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: 0, fontSize: "0.74rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Enter your personal API key to chat with live <strong>GPT-4o-mini</strong>. Your key is stored securely in your browser&apos;s localStorage and never sent anywhere else.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="password"
                placeholder="sk-proj-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontSize: "0.78rem",
                  fontFamily: "var(--mono)",
                  outline: "none"
                }}
              />
              <button
                onClick={handleSaveKey}
                className="btn btn-primary"
                style={{ padding: "6px 12px", fontSize: "0.78rem" }}
              >
                Save
              </button>
            </div>
          </div>
        )}

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
            onClick={() => handleSend("Give me a small hint for coding the template condition.")}
            className="btn btn-ghost"
            style={{ padding: "4px 8px", fontSize: "0.72rem", height: "26px" }}
          >
            <SparklesIcon size={12} />
            <span>Hint</span>
          </button>
        </div>

        {/* Chat Messages List */}
        <div
          ref={chatContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minHeight: 0
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

        {/* Bottom Mode Indicator Bar */}
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
            onClick={() => setIsSettingsOpen(prev => !prev)}
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
    </>
  );
}
