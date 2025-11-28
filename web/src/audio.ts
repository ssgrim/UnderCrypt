// Audio effects system using Web Audio API
// This generates sounds procedurally without needing external audio files

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

interface AudioConfig {
  frequency: number;
  duration: number;
  volume: number;
  type: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export function playSound(config: Partial<AudioConfig>) {
  const ctx = audioContext;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const freq = config.frequency ?? 440;
  const duration = config.duration ?? 0.5;
  const volume = config.volume ?? 0.3;
  const type = config.type ?? 'sine';
  const attack = config.attack ?? 0.01;
  const decay = config.decay ?? 0.1;
  const sustain = config.sustain ?? 0.3;
  const release = config.release ?? 0.2;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  // ADSR envelope
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.linearRampToValueAtTime(volume * sustain, now + attack + decay);
  gain.gain.linearRampToValueAtTime(0, now + duration + release);

  osc.start(now);
  osc.stop(now + duration + release);
}

// Card play sound - positive "pop" tone
export function playCardPlay() {
  playSound({
    frequency: 600,
    duration: 0.3,
    volume: 0.3,
    type: 'square',
    attack: 0.02,
    decay: 0.15,
    sustain: 0,
    release: 0.1,
  });
}

// Damage sound - lower pitch impact
export function playDamage() {
  const ctx = audioContext;
  const now = ctx.currentTime;

  playSound({
    frequency: 200,
    duration: 0.4,
    volume: 0.4,
    type: 'sine',
    attack: 0.05,
    decay: 0.2,
    sustain: 0.1,
    release: 0.15,
  });

  // Pitch bend down for more impactful sound
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

  osc.start(now);
  osc.stop(now + 0.3);
}

// Block/defense sound - metallic tone
export function playBlock() {
  playSound({
    frequency: 800,
    duration: 0.2,
    volume: 0.25,
    type: 'square',
    attack: 0.01,
    decay: 0.15,
    sustain: 0,
    release: 0.05,
  });
}

// Victory sound - ascending arpeggio
export function playVictory() {
  const frequencies = [523, 659, 784, 1047]; // C E G C
  frequencies.forEach((freq, idx) => {
    setTimeout(() => {
      playSound({
        frequency: freq,
        duration: 0.3,
        volume: 0.3,
        type: 'sine',
        attack: 0.05,
        decay: 0.15,
        sustain: 0,
        release: 0.1,
      });
    }, idx * 100);
  });
}

// Defeat sound - descending tone
export function playDefeat() {
  const ctx = audioContext;
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.8);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

  osc.start(now);
  osc.stop(now + 0.8);
}

// Poison/status effect sound - buzzy tone
export function playStatusEffect() {
  playSound({
    frequency: 330,
    duration: 0.15,
    volume: 0.2,
    type: 'square',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.2,
    release: 0.05,
  });

  setTimeout(() => {
    playSound({
      frequency: 280,
      duration: 0.15,
      volume: 0.2,
      type: 'square',
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.05,
    });
  }, 100);
}

// Heal sound - rising tone
export function playHeal() {
  playSound({
    frequency: 440,
    duration: 0.3,
    volume: 0.25,
    type: 'sine',
    attack: 0.05,
    decay: 0.2,
    sustain: 0,
    release: 0.1,
  });
}

// Background music loop (simple pulse)
let musicOscillator: OscillatorNode | null = null;
let musicGain: GainNode | null = null;

export function startBackgroundMusic() {
  if (musicOscillator) return; // Already playing

  const ctx = audioContext;
  musicOscillator = ctx.createOscillator();
  musicGain = ctx.createGain();

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;

  musicOscillator.connect(filter);
  filter.connect(musicGain);
  musicGain.connect(ctx.destination);

  musicOscillator.type = 'sine';
  musicOscillator.frequency.value = 55; // Very low frequency for ambience

  musicGain.gain.setValueAtTime(0.05, ctx.currentTime);

  musicOscillator.start();
}

export function stopBackgroundMusic() {
  if (musicOscillator) {
    const ctx = audioContext;
    musicGain?.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    musicOscillator.stop(ctx.currentTime + 1);
    musicOscillator = null;
    musicGain = null;
  }
}

export function setMusicVolume(volume: number) {
  if (musicGain) {
    musicGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)) * 0.05, audioContext.currentTime);
  }
}
