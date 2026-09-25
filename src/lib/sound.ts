// Tiny WebAudio blips — no audio files, no autoplay.
// Sound is OFF by default and only ever fires from a user gesture.

export type SoundName = "add" | "confirm" | "toggle" | "sizzle";

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, duration: number, gain: number, type: OscillatorType = "sine") {
  const ac = context();
  if (!ac) return;
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + start);
  vol.gain.setValueAtTime(0.0001, ac.currentTime + start);
  vol.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.01);
  vol.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + duration);
  osc.connect(vol).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + duration + 0.02);
}

function noise(duration: number, gain: number) {
  const ac = context();
  if (!ac) return;
  const frames = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = ac.createBufferSource();
  const vol = ac.createGain();
  vol.gain.value = gain;
  src.buffer = buffer;
  src.connect(vol).connect(ac.destination);
  src.start();
}

export function playSound(name: SoundName) {
  try {
    switch (name) {
      case "add":
        tone(660, 0, 0.09, 0.08, "triangle");
        break;
      case "confirm":
        tone(523, 0, 0.12, 0.07, "sine");
        tone(784, 0.1, 0.18, 0.06, "sine");
        break;
      case "toggle":
        tone(440, 0, 0.07, 0.05, "square");
        break;
      case "sizzle":
        noise(0.35, 0.025);
        break;
    }
  } catch {
    /* audio is a nice-to-have; never break the page */
  }
}
