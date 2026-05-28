// Web Audio API Synthesizer for typing sound effects and notifications.
// Functions check if AudioContext is supported and if music/sounds are enabled.

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound(type: 'mechanical' | 'retro' | 'beep' | 'pop', frequencyFactor = 1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'mechanical') {
      // Wood clack sound
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 * frequencyFactor, now);
      osc.frequency.exponentialRampToValueAtTime(1200 * frequencyFactor, now + 0.01);
      osc.frequency.exponentialRampToValueAtTime(100 * frequencyFactor, now + 0.04);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'retro') {
      // Short high pitch synth bip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 * frequencyFactor, now);
      osc.frequency.setValueAtTime(400 * frequencyFactor, now + 0.02);
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } else if (type === 'pop') {
      // Modern bubble pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 * frequencyFactor, now);
      osc.frequency.exponentialRampToValueAtTime(600 * frequencyFactor, now + 0.03);
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      // Standard gentle electronic beep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 * frequencyFactor, now);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (e) {
    // Audio context not initialized or blocked
  }
}

export function playErrorSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.15);
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.16);
  } catch (e) {
    // Failed to play
  }
}

export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const noteTime = now + idx * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.setValueAtTime(0, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.08, noteTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  } catch (e) {
    // Failed to play
  }
}
