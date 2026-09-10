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
  | { type: 'NAVIGATE_PREGAME'; targetScreen: 'home' | 'story_select' | 'story_intro' }
  | { type: 'COORDINATOR_BACK'; screen: GameScreen }
  | { type: 'BLOCK_ACTIVE_GAMEPLAY'; reason: string; screen: GameScreen }
  | { type: 'EXIT_APP' };

/**
 * Authoritative resolver for Android hardware back-button actions.
 *
 * Rules:
 * 1. Modals & Overlays take precedence (close top overlay first).
 * 2. Pre-game setup screens navigate back cleanly to earlier setup steps.
 * 3. Gameplay screens (voting, role_pass, results) delegate directly to GameFlowCoordinator authority.
 * 4. Active gameplay screens without reverse transitions (free_discussion, vote_result, reveals)
 *    are protected / blocked from back navigation to prevent game state desynchronization.
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

  // 2. Home screen - exit application
  if (state.currentScreen === 'home') {
    return { type: 'EXIT_APP' };
  }

  // 3. Pre-game setup screens (local UI navigation before game is started)
  if (state.currentScreen === 'story_select') {
    return { type: 'NAVIGATE_PREGAME', targetScreen: 'home' };
  }

  if (state.currentScreen === 'story_intro') {
    return { type: 'NAVIGATE_PREGAME', targetScreen: 'story_select' };
  }

  if (state.currentScreen === 'player_setup') {
    return { type: 'NAVIGATE_PREGAME', targetScreen: 'story_intro' };
  }

  // 4. Gameplay post-game screen delegating to GameFlowCoordinator authority (resetToLobby)
  if (state.currentScreen === 'results') {
    return { type: 'COORDINATOR_BACK', screen: 'results' };
  }

  // 5. Active gameplay screens (role_pass, free_discussion, voting, vote_result, reveals)
  // are protected from hardware back to prevent accidental reset or desynchronization
  return {
    type: 'BLOCK_ACTIVE_GAMEPLAY',
    reason: `Android hardware back button blocked on ${state.currentScreen} to protect GameEngine state and enforce GameFlowCoordinator authority`,
    screen: state.currentScreen,
  };
}

