// Retro Feature-Phone Chiptune Web Audio Synthesizer (Heroes Lore Tribute)
(function (global) {
  'use strict';

  class RetroAudio {
    constructor() {
      this.ctx = null;
      this.bgmEnabled = true;
      this.sfxEnabled = true;
      this.currentTrack = null;
      this.bgmTimer = null;
      this.stepIndex = 0;
      this.masterGain = null;
      this.bgmGain = null;
      this.sfxGain = null;
    }

    init() {
      if (this.ctx) {
        if (this.ctx.state !== 'running') {
          this.ctx.resume().catch(() => {});
        }
        return;
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      try {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.6;
        this.masterGain.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.22;
        this.bgmGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.55;
        this.sfxGain.connect(this.masterGain);
      } catch (_) {
        this.ctx = null;
      }
    }

    toggleBgm() {
      this.bgmEnabled = !this.bgmEnabled;
      if (!this.bgmEnabled) {
        this.stopBgmTimer();
      } else if (this.currentTrack) {
        const track = this.currentTrack;
        this.currentTrack = null;
        this.playBgm(track);
      }
      return this.bgmEnabled;
    }

    toggleSfx() {
      this.sfxEnabled = !this.sfxEnabled;
      return this.sfxEnabled;
    }

    freq(note) {
      if (!note) return 0;
      const map = {
        C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
        C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
        C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, Ab5: 830.61, A5: 880.00, B5: 987.77,
        C6: 1046.50
      };
      return map[note] || 0;
    }

    playTone(freq, duration, type, volume, target, delay = 0, slideTo = null) {
      if (!this.ctx || this.ctx.state !== 'running' || !freq) return;
      try {
        const now = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.setValueAtTime(freq, now);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
        }
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain);
        gain.connect(target || this.sfxGain);
        osc.start(now);
        osc.stop(now + duration + 0.02);
      } catch (_) {}
    }

    playNoise(duration, volume, filterFreq = 1200) {
      if (!this.ctx || this.ctx.state !== 'running' || !this.sfxEnabled) return;
      try {
        const bufferSize = Math.floor(this.ctx.sampleRate * duration);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = filterFreq;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        src.start();
      } catch (_) {}
    }

    playSfx(name) {
      if (!this.sfxEnabled) return;
      this.init();
      if (!this.ctx) return;

      switch (name) {
        case 'swing':
          this.playNoise(0.08, 0.25, 1900);
          this.playTone(320, 0.07, 'triangle', 0.18, this.sfxGain, 0, 140);
          break;
        case 'swingHeavy':
          this.playNoise(0.12, 0.35, 1200);
          this.playTone(240, 0.11, 'sawtooth', 0.22, this.sfxGain, 0, 90);
          break;
        case 'hit':
          this.playNoise(0.07, 0.3, 600);
          this.playTone(170, 0.08, 'square', 0.25, this.sfxGain, 0, 65);
          break;
        case 'crit':
          this.playNoise(0.11, 0.35, 2200);
          this.playTone(587, 0.08, 'square', 0.25, this.sfxGain, 0, 880);
          this.playTone(880, 0.14, 'square', 0.22, this.sfxGain, 0.05, 1174);
          break;
        case 'hurt':
          this.playTone(210, 0.12, 'sawtooth', 0.28, this.sfxGain, 0, 95);
          this.playNoise(0.09, 0.25, 450);
          break;
        case 'skill':
          this.playTone(330, 0.1, 'square', 0.2, this.sfxGain, 0, 660);
          this.playTone(494, 0.14, 'triangle', 0.22, this.sfxGain, 0.05, 987);
          this.playNoise(0.14, 0.2, 2600);
          break;
        case 'magic':
          this.playTone(523, 0.15, 'sine', 0.25, this.sfxGain, 0, 1046);
          this.playTone(659, 0.18, 'triangle', 0.2, this.sfxGain, 0.06, 1318);
          break;
        case 'kill':
          this.playTone(260, 0.08, 'square', 0.2, this.sfxGain, 0, 130);
          this.playTone(180, 0.14, 'sawtooth', 0.18, this.sfxGain, 0.05, 65);
          break;
        case 'coin':
          this.playTone(987, 0.06, 'square', 0.18, this.sfxGain, 0);
          this.playTone(1318, 0.12, 'square', 0.18, this.sfxGain, 0.055);
          break;
        case 'potion':
          this.playTone(440, 0.08, 'sine', 0.2, this.sfxGain, 0, 587);
          this.playTone(587, 0.1, 'sine', 0.2, this.sfxGain, 0.07, 880);
          break;
        case 'levelup': {
          const notes = ['C5', 'E5', 'G5', 'C6'];
          notes.forEach((n, idx) => {
            this.playTone(this.freq(n), idx === 3 ? 0.35 : 0.11, 'square', 0.22, this.sfxGain, idx * 0.09);
          });
          break;
        }
        case 'quest': {
          const notes = ['G4', 'B4', 'D5', 'G5'];
          notes.forEach((n, idx) => {
            this.playTone(this.freq(n), idx === 3 ? 0.3 : 0.09, 'triangle', 0.26, this.sfxGain, idx * 0.08);
          });
          break;
        }
        case 'enhanceOk': {
          const notes = ['D5', 'Fs5', 'A5', 'D5', 'A5'];
          notes.forEach((n, idx) => {
            this.playTone(this.freq(n), 0.12, 'square', 0.2, this.sfxGain, idx * 0.07);
          });
          break;
        }
        case 'enhanceFail':
          this.playTone(260, 0.14, 'sawtooth', 0.22, this.sfxGain, 0, 160);
          this.playTone(160, 0.22, 'sawtooth', 0.22, this.sfxGain, 0.13, 95);
          break;
        case 'portal':
          this.playTone(300, 0.2, 'sine', 0.22, this.sfxGain, 0, 900);
          this.playTone(450, 0.22, 'triangle', 0.18, this.sfxGain, 0.05, 1100);
          break;
        case 'ui':
          this.playTone(720, 0.04, 'square', 0.12, this.sfxGain, 0);
          break;
        case 'dash':
          this.playNoise(0.09, 0.22, 2400);
          this.playTone(420, 0.08, 'triangle', 0.14, this.sfxGain, 0, 220);
          break;
        case 'bossRoar':
          this.playTone(120, 0.38, 'sawtooth', 0.32, this.sfxGain, 0, 55);
          this.playNoise(0.32, 0.32, 360);
          break;
      }
    }

    stopBgmTimer() {
      if (this.bgmTimer) {
        clearInterval(this.bgmTimer);
        this.bgmTimer = null;
      }
    }

    playBgm(track) {
      if (this.currentTrack === track && this.bgmTimer) return;
      this.currentTrack = track;
      this.stopBgmTimer();
      if (!this.bgmEnabled) return;
      this.init();
      if (!this.ctx) return;

      const tracks = {
        title: {
          tempo: 260,
          lead: ['E4', 'G4', 'B4', 'A4', 'G4', 'E4', 'D4', null, 'E4', 'G4', 'A4', 'B4', 'C5', 'B4', 'A4', null,
                 'G4', 'A4', 'B4', 'D5', 'C5', 'B4', 'A4', 'G4', 'Fs4', 'G4', 'A4', 'B4', 'E4', null, null, null],
          bass: ['E3', null, 'B3', null, 'C3', null, 'G3', null, 'A3', null, 'E3', null, 'D3', null, 'A3', null,
                 'G3', null, 'D3', null, 'C3', null, 'G3', null, 'B3', null, 'Fs4', null, 'E3', null, 'B3', null]
        },
        town: {
          tempo: 270,
          lead: ['G4', 'A4', 'B4', 'D5', 'C5', 'B4', 'A4', 'G4', 'A4', 'B4', 'G4', 'E4', 'D4', null, 'G4', null,
                 'B4', 'C5', 'D5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'A4', 'B4', 'A4', 'G4', null, null, null],
          bass: ['G3', null, 'D3', null, 'C3', null, 'G3', null, 'A3', null, 'E3', null, 'D3', null, 'G3', null,
                 'G3', null, 'B3', null, 'C3', null, 'E3', null, 'D3', null, 'Fs4', null, 'G3', null, 'D3', null]
        },
        field: {
          tempo: 185,
          lead: ['A4', 'C5', 'D5', 'E5', 'E5', 'D5', 'C5', 'A4', 'G4', 'A4', 'C5', 'D5', 'C5', null, 'A4', null,
                 'A4', 'C5', 'E5', 'G5', 'Fs5', 'E5', 'D5', 'C5', 'B4', 'C5', 'D5', 'B4', 'A4', null, null, null],
          bass: ['A3', 'A3', 'E3', 'A3', 'F3', 'F3', 'C3', 'F3', 'G3', 'G3', 'D3', 'G3', 'E3', 'E3', 'A3', null,
                 'A3', 'A3', 'E3', 'A3', 'D3', 'D3', 'A3', 'D3', 'E3', 'E3', 'G3', 'E3', 'A3', null, 'E3', null]
        },
        dungeon: {
          tempo: 210,
          lead: ['D4', 'F4', 'A4', 'Ab4', 'G4', 'F4', 'E4', null, 'D4', 'F4', 'Bb4', 'A4', 'G4', null, 'E4', null,
                 'A4', 'G4', 'F4', 'E4', 'D4', 'E4', 'F4', 'G4', 'E4', 'D4', 'C4', 'E4', 'D4', null, null, null],
          bass: ['D3', null, 'A3', null, 'Bb3', null, 'A3', null, 'G3', null, 'D3', null, 'A3', null, 'E3', null,
                 'F3', null, 'C3', null, 'G3', null, 'D3', null, 'A3', null, 'E3', null, 'D3', null, null, null]
        },
        boss: {
          tempo: 145,
          lead: ['E4', 'E4', 'G4', 'E4', 'Bb4', 'A4', 'G4', 'Fs4', 'E4', 'E4', 'B4', 'A4', 'G4', 'Fs4', 'E4', 'D4',
                 'E5', 'D5', 'C5', 'B4', 'A4', 'B4', 'C5', 'D5', 'E5', 'Fs5', 'G5', 'Fs5', 'E5', null, 'B4', null],
          bass: ['E3', 'E3', 'E3', 'G3', 'E3', 'E3', 'Bb3', 'A3', 'E3', 'E3', 'E3', 'B3', 'C3', 'D3', 'E3', 'D3',
                 'C3', 'C3', 'G3', 'C3', 'D3', 'D3', 'A3', 'D3', 'E3', 'E3', 'B3', 'E3', 'E3', 'G3', 'B3', 'E3']
        }
      };

      const data = tracks[track] || tracks.town;
      this.stepIndex = 0;
      const playStep = () => {
        if (!this.bgmEnabled || !this.ctx || this.ctx.state !== 'running') return;
        const i = this.stepIndex % data.lead.length;
        const leadNote = data.lead[i];
        const bassNote = data.bass[i];
        const dur = (data.tempo / 1000) * 0.85;
        if (leadNote) {
          this.playTone(this.freq(leadNote), dur, track === 'boss' ? 'sawtooth' : 'square', 0.22, this.bgmGain);
        }
        if (bassNote) {
          this.playTone(this.freq(bassNote), dur * 1.1, 'triangle', 0.34, this.bgmGain);
        }
        this.stepIndex++;
      };

      playStep();
      this.bgmTimer = setInterval(playStep, data.tempo);
    }
  }

  global.RetroAudio = RetroAudio;
})(window);
