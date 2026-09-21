/**
 * Web Speech API Voice Synthesizer for Multilingual Advisories
 * Supports Hindi (hi-IN), Marathi (mr-IN), and English (en-IN)
 */

class TextToSpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    if (this.synth) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  speak(text, lang = 'hi', onEndCallback = null) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEndCallback) onEndCallback();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity in rural advisory
    utterance.pitch = 1.0;

    let targetLangCode = 'hi-IN';
    if (lang === 'mr') targetLangCode = 'mr-IN';
    else if (lang === 'en') targetLangCode = 'en-IN';

    utterance.lang = targetLangCode;

    // Try finding matching voice
    const matchedVoice = this.voices.find(
      (v) => v.lang.startsWith(lang) || v.lang === targetLangCode
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }
}

const ttsService = new TextToSpeechService();

export default ttsService;
