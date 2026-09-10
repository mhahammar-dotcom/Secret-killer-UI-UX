import { GameScreen } from '../types';

export interface AndroidBackUIState {
  currentScreen: GameScreen;
  showRules: boolean;
  showSettings: boolean;
  showCustomStoryModal: boolean;
  isInterstitialOpen: boolean;
}

export type AndroidBackAction =
  | { type: 'CLOSE_INTERSTITIAL' }
  | { type: 'CLOSE_RULES' }
  | { type: 'CLOSE_SETTINGS' }
  | { type: 'CLOSE_CUSTOM_STORY' }
  | { type: 'NAVIGATE'; targetScreen: GameScreen }
  | { type: 'BLOCK_ACTIVE_GAMEPLAY'; reason: string; screen: GameScreen }
  | { type: 'EXIT_APP' };

/**
 * Authoritative resolver for Android hardware back-button actions.
 *
 * Rules:
 * 1. Modals & Overlays take precedence (close top overlay first).
 * 2. Pre-game lobby screens navigate back to their previous screen.
 * 3. Active gameplay screens (role_pass, free_discussion, voting, vote_result)
 *    are STRICTLY BLOCKED to prevent accidental reset or corruption of authoritative game state.
 * 4. Post-game review screens allow reviewing previous review steps.
 * 5. Home screen triggers application exit.
 */
export function resolveAndroidBackAction(state: AndroidBackUIState): AndroidBackAction {
  // 1. Overlays take highest precedence
  if (state.isInterstitialOpen) {
    return { type: 'CLOSE_INTERSTITIAL' };
  }

  if (state.showCustomStoryModal) {
    return { type: 'CLOSE_CUSTOM_STORY' };
  }

  if (state.showSettings) {
    return { type: 'CLOSE_SETTINGS' };
  }

  if (state.showRules) {
    return { type: 'CLOSE_RULES' };
  }

  // 2. Pre-game screens
  if (state.currentScreen === 'story_select') {
    return { type: 'NAVIGATE', targetScreen: 'home' };
  }

  if (state.currentScreen === 'story_intro') {
    return { type: 'NAVIGATE', targetScreen: 'story_select' };
  }

  if (state.currentScreen === 'player_setup') {
    return { type: 'NAVIGATE', targetScreen: 'story_intro' };
  }

  // 3. Active gameplay screens - STRICTLY PROTECTED / BLOCKED
  // Back navigation must NOT accidentally reset or mutate active games.
  const activeGameplayScreens: GameScreen[] = [
    'role_pass',
    'free_discussion',
    'voting',
    'vote_result',
  ];

  if (activeGameplayScreens.includes(state.currentScreen)) {
    return {
      type: 'BLOCK_ACTIVE_GAMEPLAY',
      reason: 'Hardware back button blocked during active gameplay to prevent game reset or state corruption',
      screen: state.currentScreen,
    };
  }

  // 4. Post-game review screens
  if (state.currentScreen === 'results') {
    return { type: 'NAVIGATE', targetScreen: 'reveal_truth' };
  }

  if (state.currentScreen === 'reveal_truth') {
    return { type: 'NAVIGATE', targetScreen: 'crime_explanation' };
  }

  if (state.currentScreen === 'crime_explanation') {
    return { type: 'NAVIGATE', targetScreen: 'killer_reveal' };
  }

  if (state.currentScreen === 'killer_reveal') {
    return { type: 'NAVIGATE', targetScreen: 'vote_result' };
  }

  // 5. Home screen - exit application
  if (state.currentScreen === 'home') {
    return { type: 'EXIT_APP' };
  }

  // Fallback safe default: block to avoid undefined state
  return {
    type: 'BLOCK_ACTIVE_GAMEPLAY',
    reason: `Unhandled screen ${state.currentScreen}; blocking back to protect state`,
    screen: state.currentScreen,
  };
}
