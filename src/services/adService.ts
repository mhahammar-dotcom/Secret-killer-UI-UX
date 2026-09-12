import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob';

export type InterstitialPlacement = 'round_transition' | 'game_end' | 'story_start' | 'manual';

const bannerAdUnitId = (import.meta as any).env?.VITE_ADMOB_BANNER_AD_UNIT_ID?.trim();
const interstitialAdUnitId = (import.meta as any).env?.VITE_ADMOB_INTERSTITIAL_AD_UNIT_ID?.trim();

/**
 * Native AdMob adapter. Ads are enabled by the app configuration, never by an
 * end-user setting. No ad is simulated: if Android, consent, or a production
 * unit ID is unavailable, game flow continues without an ad.
 */
class AdService {
  private initialized = false;
  private initializationPromise: Promise<boolean> | null = null;
  private bannerVisible = false;
  private lastInterstitialTime = 0;
  private readonly interstitialCooldownMs = 30_000;

  public isNativeAndroid(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
  }

  public hasProductionConfiguration(): boolean {
    return Boolean(bannerAdUnitId || interstitialAdUnitId);
  }

  public async initialize(): Promise<boolean> {
    if (!this.isNativeAndroid() || !this.hasProductionConfiguration()) return false;
    if (this.initialized) return true;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = (async () => {
      try {
        await AdMob.initialize();
        let consent = await AdMob.requestConsentInfo();
        if (!consent.canRequestAds && consent.status === AdmobConsentStatus.REQUIRED) {
          consent = await AdMob.showConsentForm();
        }
        this.initialized = consent.canRequestAds;
        return this.initialized;
      } catch (error) {
        console.warn('AdMob initialization was unavailable; continuing without ads.', error);
        return false;
      } finally {
        this.initializationPromise = null;
      }
    })();
    return this.initializationPromise;
  }

  public async showBanner(): Promise<void> {
    if (!bannerAdUnitId || this.bannerVisible || !(await this.initialize())) return;
    try {
      await AdMob.showBanner({
        adId: bannerAdUnitId,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      });
      this.bannerVisible = true;
    } catch (error) {
      console.warn('AdMob banner could not be shown.', error);
    }
  }

  public async hideBanner(): Promise<void> {
    if (!this.bannerVisible) return;
    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.warn('AdMob banner could not be removed.', error);
    } finally {
      this.bannerVisible = false;
    }
  }

  public async requestInterstitial(placement: InterstitialPlacement, onProceed: () => void): Promise<boolean> {
    const now = Date.now();
    const shouldShow = placement === 'game_end' || now - this.lastInterstitialTime >= this.interstitialCooldownMs;
    if (!interstitialAdUnitId || !shouldShow || !(await this.initialize())) {
      onProceed();
      return false;
    }

    try {
      await AdMob.prepareInterstitial({ adId: interstitialAdUnitId });
      this.lastInterstitialTime = now;
      await AdMob.showInterstitial({ adId: interstitialAdUnitId });
      return true;
    } catch (error) {
      console.warn('AdMob interstitial could not be shown; continuing game flow.', error);
      return false;
    } finally {
      onProceed();
    }
  }
}

export const adService = new AdService();
