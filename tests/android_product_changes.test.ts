import { readFileSync } from 'node:fs';
import { resolveAndroidBackAction } from '../src/utils/androidBackHandler';

let assertions = 0;
const check = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
  assertions++;
};

const home = { currentScreen: 'home' as const, showRules: false, showSettings: false, showCustomStoryModal: false, isInterstitialOpen: false };
check(resolveAndroidBackAction(home).type === 'CONFIRM_EXIT', 'Home back must request confirmation.');
check(resolveAndroidBackAction({ ...home, showExitConfirmation: true }).type === 'CLOSE_EXIT_CONFIRMATION', 'Back must dismiss the confirmation without exiting.');

const settings = readFileSync(new URL('../src/components/SettingsModal.tsx', import.meta.url), 'utf8');
check(!settings.includes('handleToggleAds') && !settings.includes('testAdPreview'), 'Settings must not expose ad controls.');
const ads = readFileSync(new URL('../src/services/adService.ts', import.meta.url), 'utf8');
check(ads.includes("@capacitor-community/admob"), 'Ads must use the native AdMob bridge.');
check(!ads.includes('ca-app-pub-3940256099942544'), 'No Google test ad IDs may ship.');
const manifest = readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
check(manifest.includes('com.google.android.gms.ads.APPLICATION_ID'), 'Android manifest must configure the AdMob app ID.');
console.log(`Android product changes passed (${assertions} assertions).`);
