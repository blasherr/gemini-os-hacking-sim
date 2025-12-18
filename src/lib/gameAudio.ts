// Système audio pour les mini-jeux avec notes musicales
// Utilise Web Audio API pour générer des sons synthétisés

class GameAudioManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  // Fréquences des notes musicales (Do Ré Mi Fa Sol La Si)
  private notes: { [key: string]: number } = {
    'do': 261.63,   // C4
    're': 293.66,   // D4
    'mi': 329.63,   // E4
    'fa': 349.23,   // F4
    'sol': 392.00,  // G4
    'la': 440.00,   // A4
    'si': 493.88,   // B4
    'do2': 523.25,  // C5
  };

  // Notes pour le jeu Simon (4 couleurs = 4 notes)
  private simonNotes: { [key: string]: number } = {
    'red': 329.63,    // Mi
    'blue': 261.63,   // Do
    'green': 392.00,  // Sol
    'yellow': 440.00, // La
  };

  private initAudio(): void {
    if (!this.audioContext && typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0.3;
    }
  }

  // Jouer une note musicale
  playNote(frequency: number, duration: number = 0.3, type: OscillatorType = 'sine'): void {
    if (this.isMuted) return;
    this.initAudio();
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    noteGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Jouer une note par nom (do, re, mi, etc.)
  playNoteName(noteName: string, duration: number = 0.3): void {
    const freq = this.notes[noteName.toLowerCase()];
    if (freq) {
      this.playNote(freq, duration);
    }
  }

  // Jouer la note Simon par couleur
  playSimonNote(color: string, duration: number = 0.4): void {
    const freq = this.simonNotes[color.toLowerCase()];
    if (freq) {
      this.playNote(freq, duration, 'square');
    }
  }

  // Sons de feedback
  playSuccess(): void {
    if (this.isMuted) return;
    this.initAudio();
    // Jouer Do Mi Sol (accord majeur)
    setTimeout(() => this.playNote(261.63, 0.15), 0);
    setTimeout(() => this.playNote(329.63, 0.15), 100);
    setTimeout(() => this.playNote(392.00, 0.3), 200);
  }

  playError(): void {
    if (this.isMuted) return;
    this.initAudio();
    // Son d'erreur (notes dissonantes)
    this.playNote(150, 0.3, 'sawtooth');
  }

  playClick(): void {
    if (this.isMuted) return;
    this.initAudio();
    this.playNote(800, 0.05, 'sine');
  }

  playLevelUp(): void {
    if (this.isMuted) return;
    this.initAudio();
    // Gamme ascendante rapide
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playNote(freq, 0.15), i * 80);
    });
  }

  playGameOver(): void {
    if (this.isMuted) return;
    this.initAudio();
    // Gamme descendante
    const notes = [392.00, 329.63, 261.63, 196.00];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playNote(freq, 0.2, 'triangle'), i * 150);
    });
  }

  playCountdown(): void {
    if (this.isMuted) return;
    this.initAudio();
    this.playNote(440, 0.1, 'sine');
  }

  playTick(): void {
    if (this.isMuted) return;
    this.initAudio();
    this.playNote(1000, 0.02, 'sine');
  }

  // Jouer une séquence de notes (pour Memory, patterns, etc.)
  async playSequence(frequencies: number[], interval: number = 300): Promise<void> {
    for (let i = 0; i < frequencies.length; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));
      this.playNote(frequencies[i], 0.25);
    }
  }

  // Contrôles
  setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
}

// Singleton
let gameAudioInstance: GameAudioManager | null = null;

export function getGameAudio(): GameAudioManager {
  if (!gameAudioInstance) {
    gameAudioInstance = new GameAudioManager();
  }
  return gameAudioInstance;
}

export default GameAudioManager;
