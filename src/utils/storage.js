// Local storage utility for DSA Typing Master

const STORAGE_KEY = "dsa_typing_data_v1";

const defaultData = {
  completedProblems: {}, // { [problemId]: { bestWpm, bestAccuracy, completedAt, attempts } }
  history: [], // [ { problemId, problemName, wpm, accuracy, timeSec, date } ]
  lastPracticed: null, // problemId
  streak: {
    lastDate: null,
    count: 0
  },
  soundEnabled: true,
  soundProfile: "thock", // "thock" | "clicky" | "silent"
  soundVolume: 0.7,
  skipBoilerplate: false,
  blindRecall: false,
  customProblems: [] // [ { id, name, pattern, difficulty, lcNumber, leetcodeUrl, code, intuition, keyInsight } ]
};

export function getStoredData() {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch (e) {
    console.error("Failed to read typing data from localStorage", e);
    return defaultData;
  }
}

export function saveSessionResult({ problemId, problemName, wpm, accuracy, timeSec }) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredData();
    const today = new Date().toISOString().slice(0, 10);

    // Update problem stats
    const existingProb = current.completedProblems[problemId] || {
      bestWpm: 0,
      bestAccuracy: 0,
      attempts: 0
    };

    const updatedProb = {
      bestWpm: Math.max(existingProb.bestWpm, wpm),
      bestAccuracy: Math.max(existingProb.bestAccuracy, accuracy),
      attempts: existingProb.attempts + 1,
      completedAt: new Date().toISOString()
    };

    // Update streak
    let newStreakCount = current.streak.count || 0;
    if (!current.streak.lastDate) {
      newStreakCount = 1;
    } else if (current.streak.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (current.streak.lastDate === yesterday) {
        newStreakCount += 1;
      } else {
        newStreakCount = 1;
      }
    }

    const newHistory = [
      {
        problemId,
        problemName,
        wpm,
        accuracy,
        timeSec,
        date: new Date().toISOString()
      },
      ...current.history
    ].slice(0, 100); // keep last 100 sessions

    const updatedData = {
      ...current,
      completedProblems: {
        ...current.completedProblems,
        [problemId]: updatedProb
      },
      history: newHistory,
      lastPracticed: problemId,
      streak: {
        lastDate: today,
        count: newStreakCount
      }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    window.dispatchEvent(new Event("dsa_stats_updated"));
    return updatedData;
  } catch (e) {
    console.error("Failed to save session result to localStorage", e);
  }
}

export function toggleSoundPref() {
  if (typeof window === "undefined") return true;
  const data = getStoredData();
  const next = !data.soundEnabled;
  data.soundEnabled = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dsa_stats_updated"));
  return next;
}

export function setSoundProfilePref(profile) {
  if (typeof window === "undefined") return "thock";
  const data = getStoredData();
  data.soundProfile = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dsa_stats_updated"));
  return profile;
}

export function setSoundVolumePref(vol) {
  if (typeof window === "undefined") return 0.7;
  const data = getStoredData();
  data.soundVolume = Math.max(0, Math.min(1, vol));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dsa_stats_updated"));
  return data.soundVolume;
}

export function setSkipBoilerplatePref(val) {
  if (typeof window === "undefined") return false;
  const data = getStoredData();
  data.skipBoilerplate = Boolean(val);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dsa_stats_updated"));
  return data.skipBoilerplate;
}

export function setBlindRecallPref(val) {
  if (typeof window === "undefined") return false;
  const data = getStoredData();
  data.blindRecall = Boolean(val);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dsa_stats_updated"));
  return data.blindRecall;
}

export function saveCustomProblem(customProb) {
  if (typeof window === "undefined") return [];
  const data = getStoredData();
  const list = Array.isArray(data.customProblems) ? data.customProblems : [];
  const existingIdx = list.findIndex(p => p.id === customProb.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...list];
    updated[existingIdx] = customProb;
  } else {
    updated = [customProb, ...list];
  }
  data.customProblems = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dsa_stats_updated"));
  return updated;
}

export function deleteCustomProblem(id) {
  if (typeof window === "undefined") return [];
  const data = getStoredData();
  const list = Array.isArray(data.customProblems) ? data.customProblems : [];
  const updated = list.filter(p => p.id !== id);
  data.customProblems = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("dsa_stats_updated"));
  return updated;
}


