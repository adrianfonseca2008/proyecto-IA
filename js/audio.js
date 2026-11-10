/**
 * ====================================================================
 * SNAKE 3D: CYBERNETIC PROTOCOL - SINTETIZADOR DE AUDIO PROCEDURAL
 * ====================================================================
 * Motor de efectos sonoros 100% sintetizado con Web Audio API.
 * Diseñado con estética Sci-Fi / Cyberpunk: sintetizadores FM, pulsos sub-bass,
 * barridos de frecuencia láser, arpegios cuánticos y clics de interfaz.
 * Cero dependencias externas, latencia cero y persistencia de ajustes.
 */

class SoundController {
    constructor() {
        this.ctx = null;
        this.muted = localStorage.getItem('snake3d_muted') === 'true';
        this.volume = parseFloat(localStorage.getItem('snake3d_volume') || '0.7');
        this.initialized = false;
    }

    init() {
        if (!this.initialized) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
                this.initialized = true;
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        localStorage.setItem('snake3d_volume', this.volume.toString());
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('snake3d_muted', this.muted ? 'true' : 'false');
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
        }
        return this.muted;
    }

    /**
     * Clic futurista sutil para botones de menú / UI
     */
    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(980, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.035);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.035);
    }

    /**
     * Micro-tick al pasar el cursor sobre botones (hover)
     */
    playHover() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.02);
    }

    /**
     * Micro-servo cyber al cambiar de dirección
     */
    playTurn() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.03);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.03);
    }

    /**
     * Recolección de núcleo de energía normal (Sub-punch + campana de plasma)
     */
    playEat() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Capa 1: Sub-punch grave
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(140, now);
        subOsc.frequency.exponentialRampToValueAtTime(60, now + 0.09);
        subGain.gain.setValueAtTime(0.25, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        subOsc.connect(subGain);
        subGain.connect(this.masterGain);
        subOsc.start(now);
        subOsc.stop(now + 0.09);

        // Capa 2: Chime cristalino resonante
        const highOsc = this.ctx.createOscillator();
        const highGain = this.ctx.createGain();
        highOsc.type = 'triangle';
        highOsc.frequency.setValueAtTime(587.33, now); // D5
        highOsc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.07); // D6
        highGain.gain.setValueAtTime(0.18, now);
        highGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        highOsc.connect(highGain);
        highGain.connect(this.masterGain);
        highOsc.start(now);
        highOsc.stop(now + 0.14);
    }

    /**
     * Arpegio triunfal cuántico (Núcleo Dorado +3)
     */
    playBonus() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // Arpegio D Mayor brillante

        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.04;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, start + 0.12);

            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(start);
            osc.stop(start + 0.18);
        });
    }

    /**
     * Activación de Escudo de Fase / Inmunidad (Carga láser y pulso electromagnético)
     */
    playPowerup() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // Carga ascendente rápida
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.22);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.25);

        // Pulso de campana cuántica
        const bell = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(1318.51, now + 0.12); // E6
        bellGain.gain.setValueAtTime(0.18, now + 0.12);
        bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        bell.connect(bellGain);
        bellGain.connect(this.masterGain);
        bell.start(now + 0.12);
        bell.stop(now + 0.35);
    }

    /**
     * Salto de portal warp cuántico (Teletransporte Nokia a través de la pared)
     */
    playTeleport() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    /**
     * Colisión / Game Over: Sobrecarga del sistema, choque glitch y sub-bass
     */
    playCrash() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;

        // 1. Ruido blanco glitch
        const bufferSize = this.ctx.sampleRate * 0.18;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(2400, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.18);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(now);

        // 2. Sub-golpe de impacto
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sawtooth';
        sub.frequency.setValueAtTime(120, now);
        sub.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        subGain.gain.setValueAtTime(0.28, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        sub.connect(subGain);
        subGain.connect(this.masterGain);
        sub.start(now);
        sub.stop(now + 0.3);
    }

    /**
     * Fanfarria de inicio de partida
     */
    playStart() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [440, 659.25, 880]; // A4, E5, A5
        notes.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + i * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(start);
            osc.stop(start + 0.12);
        });
    }
}

window.SoundController = SoundController;
