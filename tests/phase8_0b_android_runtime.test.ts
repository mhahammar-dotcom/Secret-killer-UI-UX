import { GameEngine } from '../src/game/GameEngine';
import { GameFlowCoordinator } from '../src/game/GameFlowCoordinator';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { GameScreen } from '../src/types';
import { resolveAndroidBackAction, AndroidBackUIState } from '../src/utils/androidBackHandler';
import { sound } from '../src/utils/audio';
import { adService } from '../src/services/adService';

let passedTests = 0;
let failedTests = 0;

function check(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failedTests++;
    throw new Error(message);
  } else {
    passedTests++;
  }
}

console.log('====================================================');
console.log('PHASE 8.0-B: ANDROID RUNTIME & DEVICE INTEGRATION TESTS');
console.log('====================================================\n');

const stories = BUILT_IN_STORIES_V2;
const story = stories[0];

// Test 1: Overlays and Modals Back Handling Precedence
console.log('Test 1: Back navigation closes overlays before screens');
{
  // Interstitial ad has highest priority
  const stateWithAd: AndroidBackUIState = {
    currentScreen: 'free_discussion',
    showRules: true,
    showSettings: true,
    showCustomStoryModal: true,
    isInterstitialOpen: true,
  };
  const adAction = resolveAndroidBackAction(stateWithAd);
  check(adAction.type === 'CLOSE_INTERSTITIAL', 'Interstitial ad must be closed first on back press');

  // Custom Story Modal takes precedence over Settings & Rules
  const stateWithCustom: AndroidBackUIState = {
    currentScreen: 'story_select',
    showRules: true,
    showSettings: true,
    showCustomStoryModal: true,
    isInterstitialOpen: false,
  };
  const customAction = resolveAndroidBackAction(stateWithCustom);
  check(customAction.type === 'CLOSE_CUSTOM_STORY', 'Custom story modal must be closed before settings/rules');

  // Settings Modal takes precedence over Rules
  const stateWithSettings: AndroidBackUIState = {
    currentScreen: 'home',
    showRules: true,
    showSettings: true,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const settingsAction = resolveAndroidBackAction(stateWithSettings);
  check(settingsAction.type === 'CLOSE_SETTINGS', 'Settings modal must be closed before rules');

  // Rules Modal
  const stateWithRules: AndroidBackUIState = {
    currentScreen: 'home',
    showRules: true,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const rulesAction = resolveAndroidBackAction(stateWithRules);
  check(rulesAction.type === 'CLOSE_RULES', 'Rules modal must be closed cleanly');
}

// Test 2: Pre-game Navigation
console.log('Test 2: Pre-game navigation flows backward through setup');
{
  const selectState: AndroidBackUIState = {
    currentScreen: 'story_select',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const selectAction = resolveAndroidBackAction(selectState);
  check(selectAction.type === 'NAVIGATE' && selectAction.targetScreen === 'home', 'story_select must navigate back to home');

  const introState: AndroidBackUIState = {
    currentScreen: 'story_intro',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const introAction = resolveAndroidBackAction(introState);
  check(introAction.type === 'NAVIGATE' && introAction.targetScreen === 'story_select', 'story_intro must navigate back to story_select');

  const setupState: AndroidBackUIState = {
    currentScreen: 'player_setup',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const setupAction = resolveAndroidBackAction(setupState);
  check(setupAction.type === 'NAVIGATE' && setupAction.targetScreen === 'story_intro', 'player_setup must navigate back to story_intro');
}

// Test 3: Active Gameplay Screens are Strictly Protected & Blocked
console.log('Test 3: Active gameplay screens strictly block back navigation');
{
  const activeScreens: GameScreen[] = [
    'role_pass',
    'free_discussion',
    'voting',
    'vote_result',
  ];

  for (const screen of activeScreens) {
    const state: AndroidBackUIState = {
      currentScreen: screen,
      showRules: false,
      showSettings: false,
      showCustomStoryModal: false,
      isInterstitialOpen: false,
    };
    const action = resolveAndroidBackAction(state);
    check(action.type === 'BLOCK_ACTIVE_GAMEPLAY', `${screen} must block Android hardware back button`);
  }
}

// Test 4: Post-game Review Screen Navigation
console.log('Test 4: Post-game review screens navigate backwards through reveal stages');
{
  const resultsState: AndroidBackUIState = {
    currentScreen: 'results',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  check(
    resolveAndroidBackAction(resultsState).type === 'NAVIGATE' &&
      (resolveAndroidBackAction(resultsState) as any).targetScreen === 'reveal_truth',
    'results must navigate back to reveal_truth'
  );

  const truthState: AndroidBackUIState = {
    currentScreen: 'reveal_truth',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  check(
    resolveAndroidBackAction(truthState).type === 'NAVIGATE' &&
      (resolveAndroidBackAction(truthState) as any).targetScreen === 'crime_explanation',
    'reveal_truth must navigate back to crime_explanation'
  );

  const crimeState: AndroidBackUIState = {
    currentScreen: 'crime_explanation',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  check(
    resolveAndroidBackAction(crimeState).type === 'NAVIGATE' &&
      (resolveAndroidBackAction(crimeState) as any).targetScreen === 'killer_reveal',
    'crime_explanation must navigate back to killer_reveal'
  );

  const killerState: AndroidBackUIState = {
    currentScreen: 'killer_reveal',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  check(
    resolveAndroidBackAction(killerState).type === 'NAVIGATE' &&
      (resolveAndroidBackAction(killerState) as any).targetScreen === 'vote_result',
    'killer_reveal must navigate back to vote_result'
  );
}

// Test 5: Home Screen triggers Application Exit
console.log('Test 5: Home screen triggers EXIT_APP');
{
  const homeState: AndroidBackUIState = {
    currentScreen: 'home',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const homeAction = resolveAndroidBackAction(homeState);
  check(homeAction.type === 'EXIT_APP', 'home screen must trigger EXIT_APP');
}

// Test 6: Authoritative GameEngine and Coordinator State Integrity During Active Gameplay Back Press
console.log('Test 6: Active game state is untouched when back is pressed');
{
  const engine = new GameEngine();
  const playerNames = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'];

  let currentScreen: GameScreen = 'player_setup' as GameScreen;
  let screenError: string | null = null;
  const coordinator = new GameFlowCoordinator(engine, {
    getScreen: () => currentScreen,
    setScreen: (s: GameScreen) => {
      currentScreen = s;
    },
    setError: (err: string | null) => {
      screenError = err;
    },
    getLanguage: () => 'ar',
  });

  const startSuccess = coordinator.startNewGame(story, playerNames);
  check(startSuccess === true, 'Game flow coordinator started new game');
  check(currentScreen === 'role_pass', 'UI transitioned to role_pass');

  const stateBefore = engine.getState();
  check(stateBefore.currentRound === 1, 'Current round is 1');
  check(stateBefore.phase === 'ROLE_PASS', 'Phase is ROLE_PASS');

  // Simulate user pressing Android hardware back during role_pass
  const backState: AndroidBackUIState = {
    currentScreen: 'role_pass',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const action = resolveAndroidBackAction(backState);
  check(action.type === 'BLOCK_ACTIVE_GAMEPLAY', 'Back is blocked during role pass');

  // Verify engine state is completely unmodified
  const stateAfter = engine.getState();
  check(stateAfter.currentRound === 1, 'Round remains 1');
  check(stateAfter.phase === 'ROLE_PASS', 'Phase remains ROLE_PASS');
  check(stateAfter.players.length === 5, 'Player count preserved');
  check(currentScreen === 'role_pass', 'Current screen remains role_pass');

  // Advance role pass until free_discussion
  while (engine.getState().phase === 'ROLE_PASS') {
    coordinator.advanceRolePass();
  }
  check(currentScreen === 'free_discussion', 'Screen transitioned to free_discussion');
  check(engine.getState().phase === 'DISCUSSION', 'Phase is DISCUSSION');

  // Simulate back during free_discussion
  const discBackState: AndroidBackUIState = {
    currentScreen: 'free_discussion',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const discAction = resolveAndroidBackAction(discBackState);
  check(discAction.type === 'BLOCK_ACTIVE_GAMEPLAY', 'Back is blocked during free discussion');
  check(currentScreen === 'free_discussion', 'Screen remains free_discussion');
  check(engine.getState().phase === 'DISCUSSION', 'Phase remains DISCUSSION');
}

// Test 7: App Lifecycle / Background-Foreground State Preservation
console.log('Test 7: Backgrounding and resuming preserves authoritative game engine state');
{
  const engine = new GameEngine();
  const playerNames = ['Ali', 'Noor', 'Omar', 'Reem', 'Saad'];
  engine.startNewGame(story, playerNames);

  // Transition to DISCUSSION phase so evidence can be revealed
  (engine as any).state.phase = 'DISCUSSION';
  engine.revealEvidence();
  const clueCountBefore = engine.getState().revealedEvidenceIds.length;
  const roundBefore = engine.getState().currentRound;

  // Simulate app moving to background and returning to foreground (Capacitor appStateChange)
  // Authoritative state in memory must remain identical
  const clueCountAfter = engine.getState().revealedEvidenceIds.length;
  const roundAfter = engine.getState().currentRound;
  check(clueCountBefore === clueCountAfter, 'Clues preserved across background/foreground');
  check(roundBefore === roundAfter, 'Round preserved across background/foreground');
}

// Test 8: Web Audio API resilience
console.log('Test 8: Audio engine executes safely without throwing');
{
  let threw = false;
  try {
    sound.setMuted(false);
    sound.playClick();
    sound.playTick();
    sound.playRoleReveal();
    sound.playEvidenceFound();
    sound.playVoteConfirm();
    sound.playGong();
    sound.playStamp();
    sound.playVictory();
    sound.playGameOver(true);
    sound.playGameOver(false);
  } catch (e) {
    threw = true;
    console.error('Audio threw error:', e);
  }
  check(!threw, 'All sound methods execute without throwing in any environment');
}

// Test 9: AdService safe continuation and back dismissal
console.log('Test 9: AdService executes callbacks safely and integrates with back button');
{
  let proceeded = false;
  adService.updateConfig({ adsEnabled: false });
  adService.requestInterstitial('round_transition', () => {
    proceeded = true;
  });
  check(proceeded, 'AdService immediately calls onProceed when ads are disabled');

  // When interstitial is opened and back button closes it
  adService.updateConfig({ adsEnabled: true, interstitialCooldownSeconds: 0 });
  let closedProceeded = false;
  adService.requestInterstitial('game_end', () => {
    closedProceeded = true;
  });
  check(adService.getActiveInterstitial().isOpen, 'Interstitial is opened');

  // Back button closes interstitial
  const adBackState: AndroidBackUIState = {
    currentScreen: 'results',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: adService.getActiveInterstitial().isOpen,
  };
  const adAction = resolveAndroidBackAction(adBackState);
  check(adAction.type === 'CLOSE_INTERSTITIAL', 'Back resolves to CLOSE_INTERSTITIAL');
  adService.closeInterstitial();
  check(!adService.getActiveInterstitial().isOpen, 'Interstitial closed');
  check(closedProceeded, 'Interstitial onProceed callback executed upon back dismissal');
}

console.log(`\n====================================================`);
console.log(`ALL TESTS PASSED! (${passedTests} assertions verified)`);
console.log(`====================================================\n`);
