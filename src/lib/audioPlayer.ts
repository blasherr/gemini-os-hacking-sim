// Audio Player Utility for OS Hacking Simulation

export type SoundEffect = 
  | 'login-success'
  | 'notification'
  | 'objective-complete'
  | 'minigame-start'
  | 'minigame-success'
  | 'mission-complete'
  | 'error'
  | 'typing';

class AudioPlayer {
  private sounds: Map<SoundEffect, HTMLAudioElement> = new Map();
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadSounds();
      this.muted = localStorage.getItem('audioMuted') === 'true';
    }
  }

  private loadSounds() {
    const soundEffects: SoundEffect[] = [
      'login-success',
      'notification',
      'objective-complete',
      'minigame-start',
      'minigame-success',
      'mission-complete',
      'error',
      'typing'
    ];

    soundEffects.forEach(sound => {
      try {
        const audio = new Audio(`/assets/audio/${sound}.mp3`);
        audio.preload = 'auto';
        audio.volume = 0.5;
        this.sounds.set(sound, audio);
      } catch (error) {
        console.warn(`Failed to load sound: ${sound}`);
      }
    });
  }

  play(sound: SoundEffect, volume: number = 0.5) {
    if (this.muted) return;

    const audio = this.sounds.get(sound);
    if (audio) {
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(err => console.warn('Audio play failed:', err));
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioMuted', this.muted.toString());
    }
    return this.muted;
  }

  setVolume(sound: SoundEffect, volume: number) {
    const audio = this.sounds.get(sound);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  setGlobalVolume(volume: number) {
    const vol = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(audio => {
      audio.volume = vol;
    });
  }

  isMuted(): boolean {
    return this.muted;
  }
}

// Singleton instance
let audioPlayer: AudioPlayer | null = null;

export const getAudioPlayer = (): AudioPlayer => {
  if (!audioPlayer && typeof window !== 'undefined') {
    audioPlayer = new AudioPlayer();
  }
  return audioPlayer!;
};

export default AudioPlayer;
