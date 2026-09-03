// Procedural Web Audio API sound effects, Resident Evil style title voice
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private titleAudioBuffer: AudioBuffer | null = null;
  private hasPlayedOpeningTitle: boolean = false;
  private isTitleAudioLoading: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  // Preload Resident Evil title voice audio buffer
  public preloadTitleVoice() {
    if (this.titleAudioBuffer || this.isTitleAudioLoading) return;
    this.isTitleAudioLoading = true;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const audioUrl = '/sounds/secret_killer_title.mp3';
      fetch(audioUrl)
        .then((res) => res.arrayBuffer())
        .then((data) => this.ctx?.decodeAudioData(data))
        .then((decoded) => {
          this.titleAudioBuffer = decoded || null;
          this.isTitleAudioLoading = false;
        })
        .catch(() => {
          // Fallback to wav if mp3 fetch failed
          fetch('/sounds/secret_killer_title.wav')
            .then((res) => res.arrayBuffer())
            .then((data) => this.ctx?.decodeAudioData(data))
            .then((decoded) => {
              this.titleAudioBuffer = decoded || null;
              this.isTitleAudioLoading = false;
            })
            .catch(() => {
              this.isTitleAudioLoading = false;
            });
        });
    } catch {
      this.isTitleAudioLoading = false;
    }
  }

  // Resident Evil style Title Voice: Deep guttural dramatic voice saying "SECRET... KILLER..."
  public playTitleVoice(force: boolean = false) {
    if (this.isMuted) return;
    if (!force && this.hasPlayedOpeningTitle) return;

    this.hasPlayedOpeningTitle = true;

    try {
      this.initCtx();
      if (!this.ctx) {
        // Fallback to HTMLAudioElement
        const audio = new Audio('/sounds/secret_killer_title.mp3');
        audio.volume = 0.95;
        audio.play().catch(() => {});
        return;
      }

      // If audio buffer is already decoded in Web Audio API, play with cinematic DSP chain
      if (this.titleAudioBuffer) {
        this.playDecodedTitleBuffer(this.titleAudioBuffer);
      } else {
        // Fetch & decode immediately or fallback to Audio element
        fetch('/sounds/secret_killer_title.mp3')
          .then((res) => res.arrayBuffer())
          .then((data) => this.ctx!.decodeAudioData(data))
          .then((decoded) => {
            this.titleAudioBuffer = decoded;
            this.playDecodedTitleBuffer(decoded);
          })
          .catch(() => {
            const audio = new Audio('/sounds/secret_killer_title.mp3');
            audio.volume = 0.95;
            audio.play().catch(() => {});
          });
      }
    } catch {
      try {
        const audio = new Audio('/sounds/secret_killer_title.mp3');
        audio.volume = 0.95;
        audio.play().catch(() => {});
      } catch {}
    }
  }

  private playDecodedTitleBuffer(buffer: AudioBuffer) {
    if (!this.ctx || this.isMuted) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Sub-bass resonance filter
    const bassFilter = this.ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.setValueAtTime(90, this.ctx.currentTime);
    bassFilter.gain.setValueAtTime(4.5, this.ctx.currentTime); // +4.5dB low punch

    // Presence boost for rasp and clarity
    const presenceFilter = this.ctx.createBiquadFilter();
    presenceFilter.type = 'peaking';
    presenceFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
    presenceFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);
    presenceFilter.gain.setValueAtTime(2.5, this.ctx.currentTime);

    // Dynamic Compressor
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    compressor.knee.setValueAtTime(8, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(4.5, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    // Master Gain
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    // Connect Graph: Source -> Bass -> Presence -> Compressor -> MasterGain -> Destination
    source.connect(bassFilter);
    bassFilter.connect(presenceFilter);
    presenceFilter.connect(compressor);
    compressor.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    source.start();
  }

  // Click / Button navigation cue
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  // Timer Tick
  public playTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {}
  }

  // Role Reveal dramatic whoosh / rising mystery chord
  public playRoleReveal() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(587.33, this.ctx.currentTime + 0.25); // D5

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {}
  }

  // Evidence Found / Clue Uncovered dramatic discovery chime
  public playEvidenceFound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.18); // A5

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // Vote confirmation sound
  public playVoteConfirm() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  // Gong / Dramatic Bell (Time End or Defeat)
  public playGong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {}
  }

  // Stamp Slam (When Killer or Verdict is revealed)
  public playStamp() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  // Victory Fanfare (Innocents win / correct verdict)
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.35);
      });
    } catch {}
  }

  // Game over sound (victory or defeat)
  public playGameOver(isVictory: boolean) {
    if (isVictory) {
      this.playVictory();
    } else {
      this.playGong();
    }
  }
}

export const sound = new SoundEngine();
