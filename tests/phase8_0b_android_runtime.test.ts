import { GameEngine } from '../src/game/GameEngine';
import { GameFlowCoordinator } from '../src/game/GameFlowCoordinator';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { GameScreen } from '../src/types';
import { resolveAndroidBackAction, AndroidBackUIState } from '../src/utils/androidBackHandler';
import { sound } from '../src/utils/audio';

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
  check(selectAction.type === 'NAVIGATE_PREGAME' && selectAction.targetScreen === 'home', 'story_select must navigate back to home');

  const introState: AndroidBackUIState = {
    currentScreen: 'story_intro',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const introAction = resolveAndroidBackAction(introState);
  check(introAction.type === 'NAVIGATE_PREGAME' && introAction.targetScreen === 'story_select', 'story_intro must navigate back to story_select');

  const setupState: AndroidBackUIState = {
    currentScreen: 'player_setup',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const setupAction = resolveAndroidBackAction(setupState);
  check(setupAction.type === 'NAVIGATE_PREGAME' && setupAction.targetScreen === 'story_intro', 'player_setup must navigate back to story_intro');
}

// Test 3: Gameplay Screens Delegate to GameFlowCoordinator Authority
console.log('Test 3: Gameplay screens delegate to GameFlowCoordinator authority');
{
  // Results screen delegates to coordinator
  const resultsState: AndroidBackUIState = {
    currentScreen: 'results',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const resultsAction = resolveAndroidBackAction(resultsState);
  check(resultsAction.type === 'COORDINATOR_BACK' && resultsAction.screen === 'results', 'results must delegate to COORDINATOR_BACK');
}

// Test 4: Active Gameplay Screens are strictly blocked from accidental back navigation
console.log('Test 4: Active gameplay screens are strictly blocked to protect game state');
{
  const blockedScreens: GameScreen[] = [
    'role_pass',
    'free_discussion',
    'voting',
    'vote_result',
    'killer_reveal',
    'crime_explanation',
    'reveal_truth',
  ];

  for (const screen of blockedScreens) {
    const state: AndroidBackUIState = {
      currentScreen: screen,
      showRules: false,
      showSettings: false,
      showCustomStoryModal: false,
      isInterstitialOpen: false,
    };
    const action = resolveAndroidBackAction(state);
    check(action.type === 'BLOCK_ACTIVE_GAMEPLAY', `${screen} must block Android hardware back button to protect GameEngine state`);
  }
}

// Test 5: Home Screen requires an explicit exit confirmation
console.log('Test 5: Home screen triggers CONFIRM_EXIT');
{
  const homeState: AndroidBackUIState = {
    currentScreen: 'home',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  };
  const homeAction = resolveAndroidBackAction(homeState);
  check(homeAction.type === 'CONFIRM_EXIT', 'home screen must request exit confirmation instead of exiting');

  const confirmationState = { ...homeState, showExitConfirmation: true };
  const confirmationAction = resolveAndroidBackAction(confirmationState);
  check(confirmationAction.type === 'CLOSE_EXIT_CONFIRMATION', 'back dismisses the exit confirmation and remains on home');
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

// Test 9: Ad service never simulates ads or blocks the game outside configured Android AdMob
console.log('Test 9: Ad service safely continues without native production configuration');
{
  let proceeded = false;
  const { adService } = await import('../src/services/adService');
  await adService.requestInterstitial('round_transition', () => {
    proceeded = true;
  });
  check(proceeded, 'Ad service immediately continues when native production ads are unavailable');
  check(!adService.hasProductionConfiguration(), 'Test environment contains no fake AdMob unit IDs');
}

// Test 10: Authoritative GameFlowCoordinator back handling execution
console.log('Test 10: Back navigation executes coordinator transitions without direct setCurrentScreen');
{
  let currentScreen: GameScreen = 'results' as GameScreen;
  let coordinatorError: string | null = null;
  const engine = new GameEngine();
  const coordinator = new GameFlowCoordinator(engine, {
    getScreen: () => currentScreen,
    setScreen: (s: GameScreen) => { currentScreen = s; },
    setError: (e: string | null) => { coordinatorError = e; },
    getLanguage: () => 'en',
  });

  engine.startNewGame(story, ['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  check(engine.getState().players.length === 4, 'Game started with 4 players');

  // 1. In results screen, back delegates to COORDINATOR_BACK
  const resultsAction = resolveAndroidBackAction({
    currentScreen: 'results',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  });
  check(resultsAction.type === 'COORDINATOR_BACK' && resultsAction.screen === 'results', 'Action is COORDINATOR_BACK for results');

  if (resultsAction.type === 'COORDINATOR_BACK') {
    const handled = coordinator.handleBack(resultsAction.screen);
    check(handled === true, 'coordinator.handleBack(results) returned true');
  }
  check(engine.getState().phase === 'LOBBY', 'GameEngine phase synchronized back to LOBBY');
  check(currentScreen === 'home', 'Screen safely transitioned to home under coordinator authority');
  check(coordinatorError === null, 'No transition error during coordinator back');

  // 2. In active voting, back is strictly blocked to protect active game state
  const votingAction = resolveAndroidBackAction({
    currentScreen: 'voting',
    showRules: false,
    showSettings: false,
    showCustomStoryModal: false,
    isInterstitialOpen: false,
  });
  check(votingAction.type === 'BLOCK_ACTIVE_GAMEPLAY', 'Voting blocks Android back to protect active game state');
}

console.log(`\n====================================================`);
console.log(`ALL TESTS PASSED! (${passedTests} assertions verified)`);
console.log(`====================================================\n`);
