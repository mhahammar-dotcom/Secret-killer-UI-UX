export interface AdConfig {
  adsEnabled: boolean;
  testMode: boolean;
  adMobAppId?: string;
  bannerAdUnitId?: string;
  interstitialAdUnitId?: string;
  lastInterstitialTime?: number;
  interstitialCooldownSeconds?: number;
}

export type InterstitialPlacement = 'round_transition' | 'game_end' | 'story_start' | 'manual';

class AdService {
  private config: AdConfig = {
    adsEnabled: true,
    testMode: true,
    adMobAppId: 'ca-app-pub-3940256099942544~3347511713', // Google Test App ID
    bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111', // Google Test Banner ID
    interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712', // Google Test Interstitial ID
    lastInterstitialTime: 0,
    interstitialCooldownSeconds: 30, // 30 seconds minimum between interstitials
  };

  private activeInterstitial: {
    isOpen: boolean;
    placement: InterstitialPlacement;
    onClose?: () => void;
  } = {
    isOpen: false,
    placement: 'round_transition',
  };

  private listeners: Array<() => void> = [];

  constructor() {
    try {
      const saved = localStorage.getItem('secret_killer_ad_config');
      if (saved) {
        this.config = { ...this.config, ...JSON.parse(saved) };
      }
    } catch {}
  }

  public getConfig(): AdConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AdConfig>) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem('secret_killer_ad_config', JSON.stringify(this.config));
    } catch {}
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public isInterstitialReady(placement: InterstitialPlacement): boolean {
    if (!this.config.adsEnabled) return false;
    const now = Date.now();
    const elapsedSeconds = (now - (this.config.lastInterstitialTime || 0)) / 1000;
    
    // Always permit game_end or if cooldown has elapsed
    if (placement === 'game_end' || elapsedSeconds >= (this.config.interstitialCooldownSeconds || 30)) {
      return true;
    }
    return false;
  }

  public requestInterstitial(
    placement: InterstitialPlacement,
    onProceed: () => void
  ): boolean {
    if (!this.config.adsEnabled) {
      onProceed();
      return false;
    }

    if (this.isInterstitialReady(placement)) {
      this.activeInterstitial = {
        isOpen: true,
        placement,
        onClose: onProceed,
      };
      this.config.lastInterstitialTime = Date.now();
      this.notify();
      return true;
    } else {
      // Cooldown active, seamlessly proceed with gameplay
      onProceed();
      return false;
    }
  }

  public getActiveInterstitial() {
    return this.activeInterstitial;
  }

  public closeInterstitial() {
    if (this.activeInterstitial.isOpen) {
      const callback = this.activeInterstitial.onClose;
      this.activeInterstitial = {
        isOpen: false,
        placement: 'round_transition',
        onClose: undefined,
      };
      this.notify();
      if (callback) {
        callback();
      }
    }
  }
}

export const adService = new AdService();
