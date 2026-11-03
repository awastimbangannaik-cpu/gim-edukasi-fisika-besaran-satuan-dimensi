/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Narator Text To Speech berbahasa Indonesia dengan konversi formula Fisika
class IndonesianSpeechSystem {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  public enabled: boolean = true;
  public rate: number = 0.95; // Kecepatan bicara ramah dan artikulatif
  public pitch: number = 1.05;
  public isSpeaking: boolean = false;
  public isPaused: boolean = false;
  private lastText: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritaskan suara Bahasa Indonesia
    const idVoice = voices.find(
      (v) => v.lang === 'id-ID' || v.lang === 'id' || v.name.toLowerCase().includes('indonesia')
    );
    if (idVoice) {
      this.voice = idVoice;
    } else {
      // Fallback voice jika browser tidak menyediakan suara lokal id-ID
      this.voice = voices[0] || null;
    }
  }

  // Mengubah rumus dan lambang Fisika menjadi ucapan lisan yang natural
  public formatPhysicsForSpeech(text: string): string {
    return text
      .replace(/\[M\]\[L\]\[T\]⁻²/g, 'M, L, T pangkat minus dua')
      .replace(/\[M\]\[L\]²\[T\]⁻²/g, 'M, L kuadrat, T pangkat minus dua')
      .replace(/\[M\]\[L\]²\[T\]⁻³/g, 'M, L kuadrat, T pangkat minus tiga')
      .replace(/\[M\]\[L\]⁻¹\[T\]⁻²/g, 'M, L pangkat minus satu, T pangkat minus dua')
      .replace(/\[M\]\[L\]⁻³/g, 'M, L pangkat minus tiga')
      .replace(/\[L\]\[T\]⁻¹/g, 'L, T pangkat minus satu')
      .replace(/\[L\]\[T\]⁻²/g, 'L, T pangkat minus dua')
      .replace(/\[L\]³/g, 'L pangkat tiga')
      .replace(/\[L\]²/g, 'L kuadrat')
      .replace(/\[M\]/g, 'dimensi M')
      .replace(/\[L\]/g, 'dimensi L')
      .replace(/\[T\]/g, 'dimensi T')
      .replace(/\[I\]/g, 'dimensi I')
      .replace(/\[θ\]|\[Θ\]/g, 'dimensi theta')
      .replace(/\[N\]/g, 'dimensi N')
      .replace(/\[J\]/g, 'dimensi J')
      .replace(/m\/s²/g, 'meter per sekon kuadrat')
      .replace(/m\/s/g, 'meter per sekon')
      .replace(/km\/jam/g, 'kilometer per jam')
      .replace(/kg\/m³/g, 'kilogram per meter kubik')
      .replace(/g\/cm³/g, 'gram per sentimeter kubik')
      .replace(/cm³/g, 'sentimeter kubik')
      .replace(/m³/g, 'meter kubik')
      .replace(/cm²/g, 'sentimeter persegi')
      .replace(/m²/g, 'meter persegi')
      .replace(/1\/2|½/g, 'setengah')
      .replace(/v₀/g, 'v nol')
      .replace(/t²/g, 't kuadrat')
      .replace(/v²/g, 'v kuadrat')
      .replace(/c²/g, 'c kuadrat')
      .replace(/Δx/g, 'delta x')
      .replace(/ρ/g, 'rho')
      .replace(/λ/g, 'lambda')
      .replace(/10\^(-?\d+)/g, 'sepuluh pangkat $1')
      .replace(/×/g, 'kali')
      .replace(/÷/g, 'bagi')
      .replace(/=/g, 'sama dengan ')
      .replace(/±/g, 'plus minus ');
  }

  public speak(
    text: string,
    onEnd?: () => void,
    onStart?: () => void
  ) {
    if (!this.enabled || !this.synth) return;
    this.cancel();

    this.lastText = text;
    const spokenText = this.formatPhysicsForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(spokenText);

    if (this.voice) {
      utterance.voice = this.voice;
      utterance.lang = this.voice.lang;
    } else {
      utterance.lang = 'id-ID';
    }

    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }

  public repeat() {
    if (this.lastText) {
      this.speak(this.lastText);
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }
}

export const speech = new IndonesianSpeechSystem();
