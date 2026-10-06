// Advanced Web Audio API Mechanical Keyboard Synthesizer
// Provides realistic mechanical switch profiles with zero external sound files.

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound(isError = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Read stored sound preferences
    let profile = "clicky";
    let volume = 0.7;
    try {
      const stored = localStorage.getItem("dsa_typing_data_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.soundProfile) profile = parsed.soundProfile;
        if (typeof parsed.soundVolume === "number") volume = parsed.soundVolume;
      }
    } catch (e) {}

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (isError) {
      // Subdued warning thud for mistyped character
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain.gain.setValueAtTime(0.18 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.08);
      return;
    }

    if (profile === "thock") {
      // Linear Switch ("Creamy Thock" / Gateron Yellow)
      // Deep, resonant, satisfying low-frequency pop
      const osc = ctx.createOscillator();
      const randomPitch = 220 + Math.random() * 60;
      osc.type = "sine";
      osc.frequency.setValueAtTime(randomPitch, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.045);

      gain.gain.setValueAtTime(0.25 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (profile === "silent") {
      // Silent / Topre ("Damped Thud")
      // Soft tactile bump with minimal top-out click
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320 + Math.random() * 40, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

      gain.gain.setValueAtTime(0.12 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.035);
    } else {
      // Tactile Clicky ("Cherry MX Blue")
      // High-pitched tactile snap with quick decay
      const osc = ctx.createOscillator();
      const clickFreq = 750 + Math.random() * 250;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(clickFreq, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);

      gain.gain.setValueAtTime(0.16 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch (e) {
    // Audio context may be blocked prior to first gesture
  }
}

export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    let volume = 0.7;
    try {
      const stored = localStorage.getItem("dsa_typing_data_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.soundVolume === "number") volume = parsed.soundVolume;
      }
    } catch (e) {}

    // Elegant ascending C-Major chord (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const startTime = ctx.currentTime + idx * 0.07;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18 * volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  } catch (e) {}
}
