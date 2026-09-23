/**
 * Mystic Audio Synthesizer (Web Audio API)
 * Generates enchanting soundscapes, crystal bell chimes, card swooshes, and atmospheric drones.
 * Requires zero external audio files - 100% offline and lightweight.
 */

class MysticAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem("mystic_sound_muted") === "true";
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported in this browser:", e);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem("mystic_sound_muted", this.isMuted);
    return this.isMuted;
  }

  playCrystalBell(freq = 880, duration = 1.8) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;

    // Master chime node
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonics for bell shimmer
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.002, now + duration);

    // Envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Overtone shimmer
    const overtone = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();
    overtone.type = "triangle";
    overtone.frequency.setValueAtTime(freq * 2.76, now);
    overtoneGain.gain.setValueAtTime(0.001, now);
    overtoneGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.6));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    overtone.connect(overtoneGain);
    overtoneGain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration);
    overtone.stop(now + duration);
  }

  playCardShuffle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const duration = 0.5;

    // Filtered noise swoosh simulating card friction
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(1400, now + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(400, now + duration);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  playRiffleShuffle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;

    // 1. Initial Gather Slide (0.0s - 0.3s)
    this.playCardShuffle();

    // 2. Rapid Riffle Flutter (0.4s - 1.2s): 18 crisp textured card-edge clicks
    const totalClicks = 18;
    for (let i = 0; i < totalClicks; i++) {
      const clickDelay = 0.4 + (i * 0.042) + (Math.random() * 0.008);
      const clickTime = now + clickDelay;

      // Small high-frequency noise tick
      const tickOsc = this.ctx.createOscillator();
      const tickGain = this.ctx.createGain();
      const tickFilter = this.ctx.createBiquadFilter();

      // Pitch slightly rises as cards release
      const baseFreq = 800 + (i * 45) + (Math.random() * 80 - 40);
      tickOsc.type = i % 2 === 0 ? "triangle" : "square";
      tickOsc.frequency.setValueAtTime(baseFreq, clickTime);

      tickFilter.type = "highpass";
      tickFilter.frequency.setValueAtTime(1200, clickTime);

      tickGain.gain.setValueAtTime(0.001, clickTime);
      tickGain.gain.linearRampToValueAtTime(0.09, clickTime + 0.004);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.028);

      tickOsc.connect(tickFilter);
      tickFilter.connect(tickGain);
      tickGain.connect(this.ctx.destination);

      tickOsc.start(clickTime);
      tickOsc.stop(clickTime + 0.03);
    }

    // 3. Deck squaring friction swoosh (1.25s)
    setTimeout(() => {
      this.playCardShuffle();
    }, 1250);

    // 4. Harmonic crystal bell chime upon completion (1.6s)
    setTimeout(() => {
      this.playCrystalBell(880, 1.4); // A5 note
      setTimeout(() => {
        this.playCrystalBell(1174.66, 1.6); // D6 harmonic
      }, 100);
    }, 1600);
  }

  playCardFlip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    // Soft resonant whoosh + small ding
    this.playCardShuffle();
    setTimeout(() => {
      this.playCrystalBell(659.25, 1.2); // Note E5
    }, 150);
  }

  playSuccessOracle() {
    if (this.isMuted) return;
    // Chime triad chord (C6, E6, G6)
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((note, index) => {
      setTimeout(() => {
        this.playCrystalBell(note, 2.2);
      }, index * 120);
    });
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

window.mysticAudio = new MysticAudio();
