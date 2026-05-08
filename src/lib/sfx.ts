// Lightweight Web Audio "generate" sound — no external assets.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function playGenerateSound() {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;

  // Whoosh: filtered noise sweep
  const bufferSize = ac.sampleRate * 0.4;
  const noiseBuf = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ac.createBufferSource();
  noise.buffer = noiseBuf;
  const noiseFilter = ac.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(400, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(3000, now + 0.35);
  const noiseGain = ac.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  noise.connect(noiseFilter).connect(noiseGain).connect(ac.destination);
  noise.start(now);
  noise.stop(now + 0.42);

  // Beep: rising then ping
  const osc = ac.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.25);
  const oscGain = ac.createGain();
  oscGain.gain.setValueAtTime(0.0001, now);
  oscGain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  osc.connect(oscGain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.4);

  // Confirmation ping
  const ping = ac.createOscillator();
  ping.type = "sine";
  ping.frequency.setValueAtTime(1200, now + 0.32);
  const pingGain = ac.createGain();
  pingGain.gain.setValueAtTime(0.0001, now + 0.32);
  pingGain.gain.exponentialRampToValueAtTime(0.18, now + 0.36);
  pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  ping.connect(pingGain).connect(ac.destination);
  ping.start(now + 0.32);
  ping.stop(now + 0.62);
}
