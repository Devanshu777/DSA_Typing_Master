"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { playKeySound, playSuccessChime } from "@/utils/sound";
import {
  saveSessionResult,
  getStoredData,
  setSkipBoilerplatePref,
  setBlindRecallPref
} from "@/utils/storage";
import { getBoilerplateLength, hasBoilerplate } from "@/utils/codeParser";
import WpmSparkline from "@/components/WpmSparkline";
import {
  LightningIcon,
  RotateCcwIcon,
  ChevronRightIcon,
  TrophyIcon
} from "@/components/Icons";

export default function TypingEngine({ problem, onNext, onPrev }) {
  const code = (problem.code || "").replace(/\r\n/g, "\n");
  const bpLen = useMemo(() => getBoilerplateLength(code), [code]);
  const isEligibleForSkip = bpLen > 0;

  const [skipBoilerplate, setSkipBoilerplate] = useState(false);
  const [blindRecall, setBlindRecall] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalStats, setFinalStats] = useState(null);
  const [autoIndent, setAutoIndent] = useState(true);
  const [autoCloseBrackets, setAutoCloseBrackets] = useState(true);
  const [wpmTimeline, setWpmTimeline] = useState([]);
  const [burstWpm, setBurstWpm] = useState(0);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const activeCharRef = useRef(null);
  const soundEnabledRef = useRef(true);
  const peekTimerRef = useRef(null);
  const lastSampleSecRef = useRef(0);

  const minTypedLength = skipBoilerplate && isEligibleForSkip ? bpLen : 0;
  const targetChars = Math.max(1, code.length - minTypedLength);
  const userTypedLength = Math.max(0, typed.length - minTypedLength);

  // Sync sound preference
  useEffect(() => {
    soundEnabledRef.current = getStoredData().soundEnabled !== false;
    const updateSound = () => {
      soundEnabledRef.current = getStoredData().soundEnabled !== false;
    };
    window.addEventListener("dsa_stats_updated", updateSound);
    return () => window.removeEventListener("dsa_stats_updated", updateSound);
  }, []);

  const triggerPeek = useCallback(() => {
    setIsPeeking(true);
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    peekTimerRef.current = setTimeout(() => {
      setIsPeeking(false);
    }, 1500);
  }, []);

  const resetToMode = useCallback((shouldSkip) => {
    const startOffset = shouldSkip && isEligibleForSkip ? bpLen : 0;
    setTyped(code.slice(0, startOffset));
    setStartTime(null);
    setElapsedSec(0);
    setTotalKeystrokes(0);
    setMistakes(0);
    setIsCompleted(false);
    setFinalStats(null);
    setWpmTimeline([]);
    setBurstWpm(0);
    lastSampleSecRef.current = 0;
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    setIsPeeking(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputProxyRef.current) inputProxyRef.current.value = DUMMY_BUFFER;
    setProxyVal(DUMMY_BUFFER);
    if (inputProxyRef.current) {
      inputProxyRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [code, isEligibleForSkip, bpLen]);

  const handleReset = useCallback(() => {
    resetToMode(skipBoilerplate);
  }, [resetToMode, skipBoilerplate]);

  // Sync preference and reset when problem changes
  useEffect(() => {
    const data = getStoredData();
    const shouldSkip = typeof data.skipBoilerplate === "boolean" ? data.skipBoilerplate : false;
    const shouldBlind = typeof data.blindRecall === "boolean" ? data.blindRecall : false;
    setSkipBoilerplate(shouldSkip);
    setBlindRecall(shouldBlind);
    const startOffset = shouldSkip && isEligibleForSkip ? bpLen : 0;
    setTyped(code.slice(0, startOffset));
    setStartTime(null);
    setElapsedSec(0);
    setTotalKeystrokes(0);
    setMistakes(0);
    setIsCompleted(false);
    setFinalStats(null);
    setWpmTimeline([]);
    setBurstWpm(0);
    lastSampleSecRef.current = 0;
    if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
    setIsPeeking(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputProxyRef.current) inputProxyRef.current.value = DUMMY_BUFFER;
    setProxyVal(DUMMY_BUFFER);
    if (inputProxyRef.current) {
      inputProxyRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [problem.id, isEligibleForSkip, bpLen, code]);

  // Timer loop & Monkeytype-style WPM Progression Sampling
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startTime) / 1000);
        setElapsedSec(sec);

        // Sample every 1s of active drill
        if (sec > lastSampleSecRef.current && sec >= 1) {
          lastSampleSecRef.current = sec;
          const min = sec / 60;
          let charsDone = 0;
          for (let i = minTypedLength; i < typed.length; i++) {
            if (typed[i] === code[i]) charsDone++;
          }
          const instWpm = Math.round((charsDone / 5) / min);
          setWpmTimeline(prev => [...prev, { sec, wpm: instWpm }]);
          setBurstWpm(prev => Math.max(prev, instWpm));
        }
      }, 250);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isCompleted, minTypedLength, typed, code]);

  // Global Keyboard Shortcuts (Alt+R restart, Alt+H peek, Alt+B toggle blind)
  useEffect(() => {
    const handleGlobalShortcuts = (e) => {
      if (e.altKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        handleReset();
      } else if (e.altKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        triggerPeek();
      } else if (e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setBlindRecall(prev => {
          const next = !prev;
          setBlindRecallPref(next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleGlobalShortcuts);
    return () => window.removeEventListener("keydown", handleGlobalShortcuts);
  }, [handleReset, triggerPeek]);

  // Keep cursor in view
  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
      });
    }
  }, [typed]);


  // Stats calculation based on user drilled characters
  let correctCount = 0;
  for (let i = minTypedLength; i < typed.length; i++) {
    if (typed[i] === code[i]) correctCount++;
  }

  const minutes = elapsedSec / 60;
  const currentWpm = minutes > 0.05 ? Math.round((correctCount / 5) / minutes) : 0;
  const currentAccuracy = totalKeystrokes > 0 ? Math.round((correctCount / totalKeystrokes) * 100) : 100;
  const progressPercent = targetChars > 0 ? Math.min(100, Math.round((userTypedLength / targetChars) * 100)) : 0;

  const DUMMY_BUFFER = "  ";
  const [proxyVal, setProxyVal] = useState(DUMMY_BUFFER);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputProxyRef = useRef(null);
  const lastKeyHandledAtRef = useRef(0);
  const lastBackspaceTimeRef = useRef(0);

  const focusEditor = useCallback(() => {
    if (inputProxyRef.current) {
      inputProxyRef.current.focus();
    } else if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const startTimerIfNeeded = useCallback(() => {
    let currentStart = startTime;
    if (!currentStart) {
      currentStart = Date.now();
      setStartTime(currentStart);
    }
    return currentStart;
  }, [startTime]);

  // Complete handler
  const handleComplete = useCallback((completedTyped, currentElapsed, keystrokes, errs) => {
    setIsCompleted(true);
    const timeInSec = Math.max(1, currentElapsed);
    const min = timeInSec / 60;
    const finalWpm = Math.max(1, Math.round((targetChars / 5) / min));
    const finalAcc = Math.round((targetChars / Math.max(targetChars, keystrokes)) * 100);

    const statsObj = {
      problemId: problem.id,
      problemName: problem.name,
      wpm: finalWpm,
      accuracy: Math.max(0, Math.min(100, finalAcc)),
      timeSec: timeInSec,
      mistakes: errs
    };

    setFinalStats(statsObj);
    saveSessionResult(statsObj);
    if (soundEnabledRef.current) playSuccessChime();
  }, [targetChars, problem]);

  // BACKSPACE processor
  const processBackspace = useCallback(() => {
    if (isCompleted) return;
    const now = Date.now();
    // Guard against duplicate event firing within 90ms
    if (now - lastBackspaceTimeRef.current < 90) return;
    lastBackspaceTimeRef.current = now;

    startTimerIfNeeded();
    if (typed.length > minTypedLength) {
      if (soundEnabledRef.current) playKeySound(false);
      const lastTwo = typed.slice(-2);
      if (["{}", "[]", "()", '""', "''"].includes(lastTwo) && autoCloseBrackets && typed.length - 2 >= minTypedLength) {
        setTyped(prev => prev.slice(0, -2));
        return;
      }
      if (typed.endsWith("    ") && autoIndent && typed.length - 4 >= minTypedLength) {
        setTyped(prev => prev.slice(0, -4));
      } else {
        setTyped(prev => prev.slice(0, -1));
      }
    }
  }, [isCompleted, startTimerIfNeeded, typed, minTypedLength, autoCloseBrackets, autoIndent]);

  // TAB processor
  const processTab = useCallback(() => {
    if (isCompleted) return;
    const currentStart = startTimerIfNeeded();
    const currentPos = typed.length;
    if (currentPos >= code.length) return;

    let spacesToAdd = "    ";
    const remainingTarget = code.slice(currentPos);
    const matchLeadingSpaces = remainingTarget.match(/^ +/);
    if (matchLeadingSpaces) {
      const count = Math.min(4, matchLeadingSpaces[0].length);
      spacesToAdd = " ".repeat(count || 4);
    }

    setTotalKeystrokes(prev => prev + 1);
    const nextTyped = typed + spacesToAdd;
    if (soundEnabledRef.current) playKeySound(false);

    if (nextTyped.length >= code.length) {
      setTyped(code);
      handleComplete(code, Math.floor((Date.now() - currentStart) / 1000), totalKeystrokes + 1, mistakes);
    } else {
      setTyped(nextTyped);
    }
  }, [isCompleted, startTimerIfNeeded, typed, code, handleComplete, totalKeystrokes, mistakes]);

  // ENTER processor
  const processEnter = useCallback(() => {
    if (isCompleted) return;
    const currentStart = startTimerIfNeeded();
    const currentPos = typed.length;
    if (currentPos >= code.length) return;

    const isCorrect = code[currentPos] === "\n";
    if (!isCorrect) {
      setMistakes(prev => prev + 1);
      if (soundEnabledRef.current) playKeySound(true);
    } else {
      if (soundEnabledRef.current) playKeySound(false);
    }
    setTotalKeystrokes(prev => prev + 1);

    let nextTyped = typed + "\n";
    if (autoIndent && isCorrect) {
      const restOfCode = code.slice(nextTyped.length);
      const leadingSpaceMatch = restOfCode.match(/^( +)/);
      if (leadingSpaceMatch) {
        nextTyped += leadingSpaceMatch[1];
      }
    }

    if (nextTyped.length >= code.length) {
      setTyped(code);
      handleComplete(code, Math.floor((Date.now() - currentStart) / 1000), totalKeystrokes + 1, mistakes + (isCorrect ? 0 : 1));
    } else {
      setTyped(nextTyped);
    }
  }, [isCompleted, startTimerIfNeeded, typed, code, autoIndent, handleComplete, totalKeystrokes, mistakes]);

  // Regular single character processor
  const processChar = useCallback((char) => {
    if (isCompleted) return;
    if (!char || char.length !== 1) return;
    const currentStart = startTimerIfNeeded();
    const currentPos = typed.length;
    if (currentPos >= code.length) return;

    const targetChar = code[currentPos];
    const pairMap = { "{": "}", "[": "]", "(": ")", '"': '"', "'": "'" };
    const isOpeningBracket = Boolean(pairMap[char]);

    if (autoCloseBrackets && isOpeningBracket && targetChar === char) {
      const closingChar = pairMap[char];
      if (code[currentPos + 1] === closingChar) {
        if (soundEnabledRef.current) playKeySound(false);
        setTotalKeystrokes(prev => prev + 1);
        const nextTyped = typed + char + closingChar;
        if (nextTyped.length >= code.length) {
          setTyped(code);
          handleComplete(code, Math.floor((Date.now() - currentStart) / 1000), totalKeystrokes + 1, mistakes);
        } else {
          setTyped(nextTyped);
        }
        return;
      }
    }

    const isCorrect = char === targetChar;
    if (!isCorrect) {
      setMistakes(prev => prev + 1);
      if (soundEnabledRef.current) playKeySound(true);
    } else {
      if (soundEnabledRef.current) playKeySound(false);
    }
    setTotalKeystrokes(prev => prev + 1);

    const nextTyped = typed + char;
    if (nextTyped.length >= code.length) {
      setTyped(code);
      handleComplete(code, Math.floor((Date.now() - currentStart) / 1000), totalKeystrokes + 1, mistakes + (isCorrect ? 0 : 1));
    } else {
      setTyped(nextTyped);
    }
  }, [isCompleted, startTimerIfNeeded, typed, code, autoCloseBrackets, handleComplete, totalKeystrokes, mistakes]);

  // Keydown handler (for desktop & hardware keyboards)
  const handleKeyDown = (e) => {
    if (isCompleted) return;
    e.stopPropagation();

    // Ignore special modifier keys alone
    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Escape"].includes(e.key)) {
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      lastKeyHandledAtRef.current = Date.now();
      if (inputProxyRef.current) {
        inputProxyRef.current.value = DUMMY_BUFFER;
      }
      processBackspace();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      lastKeyHandledAtRef.current = Date.now();
      if (inputProxyRef.current) {
        inputProxyRef.current.value = DUMMY_BUFFER;
      }
      processTab();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      lastKeyHandledAtRef.current = Date.now();
      if (inputProxyRef.current) {
        inputProxyRef.current.value = DUMMY_BUFFER;
      }
      processEnter();
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      lastKeyHandledAtRef.current = Date.now();
      if (inputProxyRef.current) {
        inputProxyRef.current.value = DUMMY_BUFFER;
      }
      processChar(e.key);
    }
  };

  // Mobile virtual keyboard input change handler
  const handleProxyChange = (e) => {
    if (isCompleted) return;
    const timeSinceKeydown = Date.now() - lastKeyHandledAtRef.current;
    const val = e.target.value;

    // Avoid double-processing if keydown already handled this within 150ms
    if (timeSinceKeydown < 150) {
      e.target.value = DUMMY_BUFFER;
      setProxyVal(DUMMY_BUFFER);
      return;
    }

    if (val.length < DUMMY_BUFFER.length) {
      // Mobile backspace pressed
      const count = DUMMY_BUFFER.length - val.length;
      for (let i = 0; i < count; i++) {
        processBackspace();
      }
    } else if (val.length > DUMMY_BUFFER.length) {
      // One or more characters inserted (typing, swipe, autocomplete)
      const added = val.slice(DUMMY_BUFFER.length);
      for (const ch of added) {
        if (ch === "\n") {
          processEnter();
        } else if (ch === "\t") {
          processTab();
        } else {
          processChar(ch);
        }
      }
    }

    e.target.value = DUMMY_BUFFER;
    setProxyVal(DUMMY_BUFFER);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Render lines with exact char matching
  const codeLines = code.split("\n");
  let globalCharIndex = 0;

  return (
    <div className="typing-container">
      {/* Top Stats Bar */}
      <div className="typing-stats-bar">
        <div className="typing-stat">
          <span className="typing-stat-label">WPM</span>
          <span className={`typing-stat-value ${currentWpm >= 50 ? "good" : currentWpm >= 30 ? "warning" : ""}`}>
            {currentWpm}
          </span>
        </div>

        <div className="typing-stat">
          <span className="typing-stat-label">Accuracy</span>
          <span className={`typing-stat-value ${currentAccuracy >= 95 ? "good" : currentAccuracy >= 85 ? "warning" : "bad"}`}>
            {currentAccuracy}%
          </span>
        </div>

        <div className="typing-stat">
          <span className="typing-stat-label">Time</span>
          <span className="typing-stat-value">{formatTime(elapsedSec)}</span>
        </div>

        <div className="typing-stat">
          <span className="typing-stat-label">Mistakes</span>
          <span className={`typing-stat-value ${mistakes === 0 ? "good" : "bad"}`}>{mistakes}</span>
        </div>

        <div className="typing-stat" style={{ flex: 1, maxWidth: "160px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span className="typing-stat-label">Progress</span>
            <span className="typing-stat-label">{progressPercent}%</span>
          </div>
          <div className="progress-bar" style={{ height: "4px" }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="typing-actions">
          {isEligibleForSkip && (
            <label
              className={`toggle-pill ${skipBoilerplate ? "active" : ""}`}
              title="When ON, class Solution and def signature remain visible and marked done, so your cursor starts directly on the actual logic"
            >
              <input
                type="checkbox"
                checked={skipBoilerplate}
                onChange={(e) => {
                  const next = e.target.checked;
                  setSkipBoilerplate(next);
                  setSkipBoilerplatePref(next);
                  resetToMode(next);
                }}
              />
              <LightningIcon size={12} style={{ color: skipBoilerplate ? "var(--accent-primary)" : "var(--text-muted)" }} />
              <span>Skip Boilerplate</span>
            </label>
          )}

          {/* Blind Recall Mode Toggle */}
          <label
            className={`toggle-pill ${blindRecall ? "active" : ""}`}
            title="Interview Simulation: Obscures untyped code so you type from memory (Alt + B)"
          >
            <input
              type="checkbox"
              checked={blindRecall}
              onChange={(e) => {
                const next = e.target.checked;
                setBlindRecall(next);
                setBlindRecallPref(next);
              }}
            />
            <span>Blind Recall</span>
          </label>

          {/* Peek Button (when in blind recall) */}
          {blindRecall && (
            <button
              onClick={triggerPeek}
              className={`btn ${isPeeking ? "btn-primary" : "btn-ghost"}`}
              style={{ height: "28px", fontSize: "0.74rem", gap: "5px" }}
              title="Unblur code for 1.5 seconds (Alt + H)"
            >
              <span>{isPeeking ? "Peeking (1.5s)..." : "Peek"}</span>
              <kbd style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", opacity: 0.7 }}>Alt H</kbd>
            </button>
          )}

          <label
            className={`toggle-pill ${autoIndent ? "active" : ""}`}
            title="When ON, pressing Enter automatically preserves Python indentation"
          >
            <input
              type="checkbox"
              checked={autoIndent}
              onChange={(e) => setAutoIndent(e.target.checked)}
            />
            <span>Indent (4sp)</span>
          </label>

          <label
            className={`toggle-pill ${autoCloseBrackets ? "active" : ""}`}
            title="When ON, typing { [ ( automatically pairs {} [] ()"
          >
            <input
              type="checkbox"
              checked={autoCloseBrackets}
              onChange={(e) => setAutoCloseBrackets(e.target.checked)}
            />
            <span>Auto-Pairs</span>
          </label>

          <button onClick={handleReset} className="btn btn-ghost" title="Restart typing (Alt + R)" style={{ height: "28px" }}>
            <RotateCcwIcon size={12} />
            <span>Restart</span>
          </button>
          {onNext && (
            <button onClick={onNext} className="btn btn-ghost" title="Skip to next problem (Alt + Right)" style={{ height: "28px" }}>
              <span>Next</span>
              <ChevronRightIcon size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Focus Helper Banner */}
      <button
        type="button"
        className={`mobile-tap-banner ${isInputFocused ? "focused" : ""}`}
        onClick={focusEditor}
      >
        {isInputFocused ? (
          <span>⌨️ Keyboard Active • Type code or use quick keys below</span>
        ) : (
          <span>📱 Tap Here to Open Keyboard &amp; Start Typing</span>
        )}
      </button>

      {/* Code Editor Area */}
      <div
        ref={containerRef}
        tabIndex={0}
        className="code-editor"
        style={{ outline: "none", cursor: "text", position: "relative" }}
        onClick={focusEditor}
      >
        {/* Invisible proxy textarea for iOS/Android virtual keyboard */}
        <textarea
          ref={inputProxyRef}
          className="mobile-input-proxy"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          inputMode="text"
          aria-label="Code typing input"
          value={proxyVal}
          onChange={handleProxyChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />

        <div className="code-editor-header">
          <div className="code-editor-dots">
            <span className="code-editor-dot" style={{ background: "#ff5f56" }} />
            <span className="code-editor-dot" style={{ background: "#ffbd2e" }} />
            <span className="code-editor-dot" style={{ background: "#27c93f" }} />
          </div>
          <div className="code-editor-title">
            solution.py — {blindRecall ? "🧠 Blind Recall Interview Mode (Peek: Alt+H)" : skipBoilerplate && isEligibleForSkip ? "Core Logic Drill (class & def pre-completed)" : "Full Solution Drill (Tab = 4 spaces)"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Python 3
          </div>
        </div>

        <div className="code-lines">
          {codeLines.map((lineText, lineIdx) => {
            const lineChars = lineText.split("");
            const lineStartIdx = globalCharIndex;
            // Add 1 for the \n at end of line (except last line)
            globalCharIndex += lineChars.length + (lineIdx < codeLines.length - 1 ? 1 : 0);

            let charIdxCounter = lineStartIdx;

            return (
              <div key={lineIdx} className="code-line">
                <span className="line-number">{lineIdx + 1}</span>
                <span className="line-content">
                  {lineChars.map((ch, charOffset) => {
                    const charIndex = charIdxCounter++;
                    const isBoilerplate = skipBoilerplate && isEligibleForSkip && charIndex < bpLen;
                    const isTyped = charIndex < typed.length;
                    const isCurrent = charIndex === typed.length;
                    const isCorrect = isTyped && typed[charIndex] === ch;
                    const isWrong = isTyped && typed[charIndex] !== ch;

                    // Blind recall blur logic
                    const isAfterCursor = charIndex > typed.length;
                    const isBlurred = blindRecall && !isPeeking && !isBoilerplate && isAfterCursor;

                    let className = "char ";
                    if (isCurrent) className += "char-current ";
                    if (isBoilerplate) className += "char-boilerplate ";
                    else if (isCorrect) className += "char-correct ";
                    else if (isWrong) className += "char-wrong ";
                    else if (!isTyped) className += "char-pending ";

                    return (
                      <span
                        key={charOffset}
                        ref={isCurrent ? activeCharRef : null}
                        className={className}
                        style={{
                          filter: isBlurred ? "blur(5px)" : "none",
                          opacity: isBlurred ? 0.2 : undefined,
                          userSelect: isBlurred ? "none" : undefined,
                          transition: "filter 0.2s ease, opacity 0.2s ease"
                        }}
                      >
                        {ch}
                      </span>
                    );
                  })}

                  {/* Render newline character indicator if cursor is at newline */}
                  {lineIdx < codeLines.length - 1 && (() => {
                    const newlineIdx = charIdxCounter++;
                    const isBoilerplate = skipBoilerplate && isEligibleForSkip && newlineIdx < bpLen;
                    const isCurrent = newlineIdx === typed.length;
                    const isTyped = newlineIdx < typed.length;
                    const isCorrect = isTyped && typed[newlineIdx] === "\n";
                    const isWrong = isTyped && typed[newlineIdx] !== "\n";

                    const isAfterCursor = newlineIdx > typed.length;
                    const isBlurred = blindRecall && !isPeeking && !isBoilerplate && isAfterCursor;

                    let className = "char ";
                    if (isCurrent) className += "char-current ";
                    if (isBoilerplate) className += "char-boilerplate ";
                    else if (isCorrect) className += "char-correct ";
                    else if (isWrong) className += "char-wrong ";

                    return (
                      <span
                        ref={isCurrent ? activeCharRef : null}
                        className={className}
                        style={{
                          opacity: isCurrent ? 1 : 0.2,
                          fontSize: "0.8em",
                          filter: isBlurred ? "blur(5px)" : "none"
                        }}
                      >
                        {isCurrent ? " ↵" : ""}
                      </span>
                    );
                  })()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Quick Symbols Toolbar (Tab, Brackets, Colon, Indent, Backspace) */}
      <div className="mobile-code-toolbar">
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processTab(); focusEditor(); }}
        >
          Tab
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar(":"); focusEditor(); }}
        >
          :
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar("("); focusEditor(); }}
        >
          ( )
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar("["); focusEditor(); }}
        >
          [ ]
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar("{"); focusEditor(); }}
        >
          {'{ }'}
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar('"'); focusEditor(); }}
        >
          &quot;
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar("="); focusEditor(); }}
        >
          =
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar("-"); processChar(">"); focusEditor(); }}
        >
          -&gt;
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar("_"); focusEditor(); }}
        >
          _
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn"
          onPointerDown={(e) => { e.preventDefault(); processChar("."); focusEditor(); }}
        >
          .
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn btn-enter"
          onPointerDown={(e) => { e.preventDefault(); processEnter(); focusEditor(); }}
        >
          ↵ Enter
        </button>
        <button
          type="button"
          className="mobile-toolbar-btn btn-del"
          onPointerDown={(e) => { e.preventDefault(); processBackspace(); focusEditor(); }}
        >
          ⌫
        </button>
      </div>

      {/* Completion Modal Overlay with Monkeytype Analytics & Sparkline */}
      {isCompleted && finalStats && (
        <div className="completion-overlay">
          <div className="completion-card" style={{ maxWidth: "520px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px auto",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)"
              }}
            >
              <TrophyIcon size={28} style={{ color: "#f59e0b" }} />
            </div>
            <h2 className="gradient-text">Problem Mastered!</h2>
            <p>
              You just typed <strong>{problem.name}</strong> with high pattern recall.
            </p>

            <div className="completion-stats">
              <div className="completion-stat">
                <div className="completion-stat-value" style={{ color: "var(--accent-secondary)" }}>
                  {finalStats.wpm}
                </div>
                <div className="completion-stat-label">Average WPM</div>
              </div>

              <div className="completion-stat">
                <div className="completion-stat-value" style={{ color: "var(--accent-primary)" }}>
                  {finalStats.accuracy}%
                </div>
                <div className="completion-stat-label">Accuracy</div>
              </div>

              <div className="completion-stat">
                <div className="completion-stat-value">
                  {formatTime(finalStats.timeSec)}
                </div>
                <div className="completion-stat-label">Total Time</div>
              </div>

              <div className="completion-stat">
                <div className="completion-stat-value" style={{ color: "#f59e0b" }}>
                  {burstWpm || finalStats.wpm}
                </div>
                <div className="completion-stat-label">Burst Peak WPM</div>
              </div>
            </div>

            {/* Monkeytype-style Speed Progression Sparkline */}
            <WpmSparkline
              data={wpmTimeline}
              finalWpm={finalStats.wpm}
              burstWpm={burstWpm}
            />

            <div className="completion-actions">
              <button onClick={handleReset} className="btn btn-ghost" style={{ padding: "10px 18px" }}>
                <RotateCcwIcon size={13} />
                <span>Practice Again (Alt+R)</span>
              </button>
              {onNext ? (
                <button onClick={onNext} className="btn btn-primary" style={{ padding: "10px 22px" }}>
                  <span>Next Problem</span>
                  <ChevronRightIcon size={14} />
                </button>
              ) : (
                <button onClick={handleReset} className="btn btn-primary" style={{ padding: "10px 22px" }}>
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

