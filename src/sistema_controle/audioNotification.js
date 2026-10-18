// Notificador de Áudio usando Web Audio API nativa
// Cria um som agradável e penetrante de campainha de cozinha / sino de restaurante sem arquivos externos

class KitchenAudioBell {
  constructor() {
    this.audioCtx = null;
  }

  init() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Toque duplo clássico de cozinha: "DING-DONG!"
  playNewOrderAlert() {
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      // Nota 1 (DING - Mi 5: ~659.25 Hz)
      this.createChime(659.25, now, 0.9, 0.45);
      
      // Harmônico superior para brilho
      this.createChime(1318.5, now, 0.6, 0.2);

      // Nota 2 (DONG - Dó 5: ~523.25 Hz) após 220ms
      this.createChime(523.25, now + 0.22, 1.3, 0.55);
      this.createChime(1046.5, now + 0.22, 0.8, 0.22);
    } catch (e) {
      console.warn('Erro ao reproduzir alerta de áudio da cozinha:', e);
    }
  }

  // Alerta urgente para pedidos atrasados (> 30 min)
  playUrgentAlert() {
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // Três bips rápidos de atenção
      [0, 0.18, 0.36].forEach((delay) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now + delay); // Lá 5

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.3, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.14);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.15);
      });
    } catch (e) {
      console.warn('Erro ao reproduzir alerta urgente:', e);
    }
  }

  createChime(freq, startTime, duration, maxVolume) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(maxVolume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

export const kitchenAudio = new KitchenAudioBell();
