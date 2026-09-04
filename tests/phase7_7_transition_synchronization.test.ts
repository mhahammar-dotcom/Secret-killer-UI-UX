import assert from 'node:assert';
import { GameEngine } from '../src/game/GameEngine';
import { GameFlowCoordinator } from '../src/game/GameFlowCoordinator';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { GameScreen } from '../src/types';

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
console.log('PHASE 7.7: UI / GAMEENGINE TRANSITION SYNCHRONIZATION');
console.log('====================================================\n');

const stories = BUILT_IN_STORIES_V2;
const story = stories.find(s => s.id === 'dreams') || stories[0];

// Helper to construct a test harness tracking screen and error state
function createTestHarness(engine: GameEngine, initialScreen: GameScreen = 'home', initialLang: 'ar' | 'en' = 'en') {
  let currentScreen: GameScreen = initialScreen;
  let currentError: string | null = null;
  let language: 'ar' | 'en' = initialLang;

  const coordinator = new GameFlowCoordinator(engine, {
    getScreen: () => currentScreen,
    setScreen: (screen: GameScreen) => {
      currentScreen = screen;
    },
    setError: (err: string | null) => {
      currentError = err;
    },
    getLanguage: () => language,
  });

  return {
    coordinator,
    getScreen: () => currentScreen,
    getError: () => currentError,
    clearError: () => { currentError = null; },
    setScreen: (screen: GameScreen) => { currentScreen = screen; },
    setLanguage: (lang: 'ar' | 'en') => { language = lang; }
  };
}

// =========================================================================
// TEST 1: If GameEngine.startVoting() throws -> UI does NOT navigate to voting
// =========================================================================
console.log('--- TEST 1: If GameEngine.startVoting() throws, UI does NOT navigate to voting ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'free_discussion');

  // Case A: Engine without active game throws
  check(harness.getScreen() === 'free_discussion', 'Initial screen is free_discussion');
  const resultA = harness.coordinator.startVoting();
  check(resultA === false, 'startVoting returned false on failure');
  check(harness.getScreen() === 'free_discussion', 'Screen remained on free_discussion, did NOT advance to voting');
  check(harness.getError() !== null, 'Localized error was set on failure');

  // Case B: Engine simulated rejection / exception
  engine.startNewGame(story, ['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  harness.clearError();
  harness.setScreen('free_discussion');

  const originalStartVoting = engine.startVoting.bind(engine);
  engine.startVoting = () => {
    throw new Error('Authoritative GameEngine rejected voting transition');
  };

  const resultB = harness.coordinator.startVoting();
  check(resultB === false, 'Coordinator returned false when engine threw');
  check(harness.getScreen() === 'free_discussion', 'Screen remained on free_discussion after engine rejection');
  check(harness.getError() === 'Authoritative GameEngine rejected voting transition', 'Exact error message preserved');

  // Restore engine method
  engine.startVoting = originalStartVoting;
}

// =========================================================================
// TEST 2: If GameEngine.proceedAfterVoteResult() throws -> UI does NOT navigate to killer reveal or discussion
// =========================================================================
console.log('--- TEST 2: If GameEngine.proceedAfterVoteResult() throws, UI does NOT navigate ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'vote_result');

  // Case A: No active game
  check(harness.getScreen() === 'vote_result', 'Initial screen is vote_result');
  const resultA = harness.coordinator.proceedAfterVoteResult();
  check(resultA === false, 'proceedAfterVoteResult returned false');
  check(harness.getScreen() === 'vote_result', 'Screen remained on vote_result, did NOT advance');
  check(harness.getError() !== null, 'Error was set');

  // Case B: Simulated rejection for killer reveal
  engine.startNewGame(story, ['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  harness.clearError();
  harness.setScreen('vote_result');

  const originalProceed = engine.proceedAfterVoteResult.bind(engine);
  engine.proceedAfterVoteResult = () => {
    throw new Error('Vote result resolution in progress');
  };

  const resultB = harness.coordinator.proceedAfterVoteResult();
  check(resultB === false, 'Returned false on throw');
  check(harness.getScreen() === 'vote_result', 'Screen remained on vote_result, did NOT advance');
  check(harness.getError() === 'Vote result resolution in progress', 'Error message recorded');

  engine.proceedAfterVoteResult = originalProceed;
}

// =========================================================================
// TEST 3: If GameEngine.proceedToCrimeExplanation() throws -> UI does NOT navigate forward
// =========================================================================
console.log('--- TEST 3: If GameEngine.proceedToCrimeExplanation() throws, UI does NOT navigate forward ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'killer_reveal');

  // Case A: No active game
  const resultA = harness.coordinator.proceedToCrimeExplanation();
  check(resultA === false, 'proceedToCrimeExplanation returned false without active game');
  check(harness.getScreen() === 'killer_reveal', 'Screen remained on killer_reveal, did NOT advance to crime_explanation');
  check(harness.getError() !== null, 'Error was set');

  // Case B: Simulated rejection
  engine.startNewGame(story, ['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  harness.clearError();
  harness.setScreen('killer_reveal');

  const originalMethod = engine.proceedToCrimeExplanation.bind(engine);
  engine.proceedToCrimeExplanation = () => {
    throw new Error('Cannot advance to explanation until reveal complete');
  };

  const resultB = harness.coordinator.proceedToCrimeExplanation();
  check(resultB === false, 'Returned false when engine rejected');
  check(harness.getScreen() === 'killer_reveal', 'Screen remained on killer_reveal');
  check(harness.getError() === 'Cannot advance to explanation until reveal complete', 'Error recorded');

  engine.proceedToCrimeExplanation = originalMethod;
}

// =========================================================================
// TEST 4: If GameEngine.proceedToGameOver() throws -> UI does NOT navigate to results
// =========================================================================
console.log('--- TEST 4: If GameEngine.proceedToGameOver() throws, UI does NOT navigate to results ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'reveal_truth');

  // Case A: No active game
  const resultA = harness.coordinator.proceedToGameOver();
  check(resultA === false, 'proceedToGameOver returned false without active game');
  check(harness.getScreen() === 'reveal_truth', 'Screen remained on reveal_truth, did NOT advance to results');
  check(harness.getError() !== null, 'Error was set');

  // Case B: Simulated rejection
  engine.startNewGame(story, ['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  harness.clearError();
  harness.setScreen('reveal_truth');

  const originalMethod = engine.proceedToGameOver.bind(engine);
  engine.proceedToGameOver = () => {
    throw new Error('Game over transition blocked by engine');
  };

  const resultB = harness.coordinator.proceedToGameOver();
  check(resultB === false, 'Returned false when engine rejected');
  check(harness.getScreen() === 'reveal_truth', 'Screen remained on reveal_truth');
  check(harness.getError() === 'Game over transition blocked by engine', 'Error recorded');

  engine.proceedToGameOver = originalMethod;
}

// =========================================================================
// TEST 5: Comprehensive Audit of Other GameEngine Transitions
// =========================================================================
console.log('--- TEST 5: Other Audited Transitions (startNewGame, advanceRolePass, resetRolePass, resetToLobby) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'player_setup');

  // 1. startNewGame failure (e.g. invalid player count < 4)
  const startFail = harness.coordinator.startNewGame(story, ['P1', 'P2']); // Invalid (<4)
  check(startFail === false, 'startNewGame rejected invalid player count');
  check(harness.getScreen() === 'player_setup', 'Screen remained on player_setup, did NOT advance to role_pass');
  check(harness.getError() !== null, 'Error was set for invalid start');

  // 2. advanceRolePass failure
  harness.setScreen('role_pass');
  const originalAdvance = engine.advanceRolePass.bind(engine);
  engine.advanceRolePass = () => {
    throw new Error('Role pass progression corrupted');
  };
  const advanceFail = harness.coordinator.advanceRolePass();
  check(advanceFail === false, 'advanceRolePass returned false on error');
  check(harness.getScreen() === 'role_pass', 'Screen remained on role_pass');
  engine.advanceRolePass = originalAdvance;

  // 3. resetRolePass failure
  const originalResetRole = engine.resetRolePass.bind(engine);
  engine.resetRolePass = () => {
    throw new Error('Cannot reset role pass');
  };
  const resetRoleFail = harness.coordinator.resetRolePass();
  check(resetRoleFail === false, 'resetRolePass returned false on error');
  check(harness.getScreen() === 'role_pass', 'Screen remained on role_pass');
  engine.resetRolePass = originalResetRole;

  // 4. resetToLobby failure
  harness.setScreen('results');
  const originalResetLobby = engine.resetToLobby.bind(engine);
  engine.resetToLobby = () => {
    throw new Error('Failed to reset lobby');
  };
  const resetLobbyFail = harness.coordinator.resetToLobby('home');
  check(resetLobbyFail === false, 'resetToLobby returned false on error');
  check(harness.getScreen() === 'results', 'Screen remained on results');
  engine.resetToLobby = originalResetLobby;
}

// =========================================================================
// TEST 6: Successful GameEngine transitions DO navigate correctly
// =========================================================================
console.log('--- TEST 6: Successful GameEngine transitions DO navigate correctly ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'player_setup', 'ar');

  // Step 1: Start game -> transitions to role_pass
  const startSuccess = harness.coordinator.startNewGame(story, ['خالد', 'سارة', 'عمر', 'ريم', 'طارق']);
  check(startSuccess === true, 'startNewGame succeeded');
  check(harness.getScreen() === 'role_pass', 'Screen navigated to role_pass');
  check(harness.getError() === null, 'No error set on success');

  // Step 2: Role pass progression
  // Advance through 4 players (staying on role_pass)
  for (let i = 0; i < 4; i++) {
    harness.coordinator.advanceRolePass();
    check(harness.getScreen() === 'role_pass', `Viewing player ${i + 1}, screen remains role_pass`);
  }
  // 5th player advances -> all viewed -> transitions to free_discussion
  const finalPass = harness.coordinator.advanceRolePass();
  check(finalPass === true, 'Final role pass succeeded');
  check(harness.getScreen() === 'free_discussion', 'Screen navigated to free_discussion');

  // Step 3: Proceed to voting -> transitions to voting
  const voteSuccess = harness.coordinator.startVoting();
  check(voteSuccess === true, 'startVoting succeeded');
  check(harness.getScreen() === 'voting', 'Screen navigated to voting');

  // Step 4: Resolve votes (tie or innocent vote) -> transitions to vote_result
  const state = engine.getState();
  const innocents = state.players.filter(p => !p.guilty);
  const killer = state.players.find(p => p.guilty)!;

  // Cast non-elimination votes to trigger next round
  const nonFatalVotes: Record<number, number> = {};
  state.players.forEach(p => {
    nonFatalVotes[p.id] = innocents[0].id;
  });

  const resolveSuccess = harness.coordinator.resolveVotes(nonFatalVotes);
  check(resolveSuccess === true, 'resolveVotes succeeded');
  check(harness.getScreen() === 'vote_result', 'Screen navigated to vote_result');

  // Step 5: Next round (not game over) -> transitions to free_discussion based on engine state
  check(engine.getState().winner === 'NONE', 'Game is not over yet');
  const nextRoundSuccess = harness.coordinator.proceedAfterVoteResult();
  check(nextRoundSuccess === true, 'proceedAfterVoteResult for next round succeeded');
  check(harness.getScreen() === 'free_discussion', 'Screen navigated back to free_discussion for round 2');

  // Step 6: Start round 2 voting -> eliminate killer -> game over
  harness.coordinator.startVoting();
  check(harness.getScreen() === 'voting', 'Navigated to round 2 voting');

  const killVotes: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    killVotes[p.id] = killer.id;
  });
  harness.coordinator.resolveVotes(killVotes);
  check(harness.getScreen() === 'vote_result', 'Navigated to round 2 vote_result');
  check(engine.getState().winner === 'INNOCENTS', 'Innocents have won');

  // Step 7: Proceed to truth (game over) -> transitions to killer_reveal based on engine state
  const revealSuccess = harness.coordinator.proceedAfterVoteResult();
  check(revealSuccess === true, 'proceedAfterVoteResult for game over succeeded');
  check(harness.getScreen() === 'killer_reveal', 'Screen navigated to killer_reveal');

  // Step 8: Proceed to crime explanation -> transitions to crime_explanation
  const explSuccess = harness.coordinator.proceedToCrimeExplanation();
  check(explSuccess === true, 'proceedToCrimeExplanation succeeded');
  check(harness.getScreen() === 'crime_explanation', 'Screen navigated to crime_explanation');

  // Step 9: Proceed to game over -> transitions to results
  const gameOverSuccess = harness.coordinator.proceedToGameOver();
  check(gameOverSuccess === true, 'proceedToGameOver succeeded');
  check(harness.getScreen() === 'results', 'Screen navigated to results');

  // Step 10: Reset to lobby / home -> transitions to home
  const resetSuccess = harness.coordinator.resetToLobby('home');
  check(resetSuccess === true, 'resetToLobby succeeded');
  check(harness.getScreen() === 'home', 'Screen navigated to home');
  check(engine.getState().phase === 'LOBBY', 'Engine state reset to LOBBY');
}

console.log('\n====================================================');
console.log(`ALL PHASE 7.7 SYNCHRONIZATION TESTS PASSED! (${passedTests} assertions)`);
console.log('====================================================\n');
