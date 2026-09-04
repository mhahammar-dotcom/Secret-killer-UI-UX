import assert from 'node:assert';
import { GameEngine } from './GameEngine';
import { GameFlowCoordinator, TransitionCallbacks } from './GameFlowCoordinator';
import { BUILT_IN_STORIES_V2 } from '../data/stories';
import { GameScreen } from '../types';

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
console.log('TEST SUITE: GameFlowCoordinator Authoritative State Synchronization');
console.log('====================================================\n');

const story = BUILT_IN_STORIES_V2[0];

function createMockHarness(engine: GameEngine, initialScreen: GameScreen = 'home', initialLang: 'ar' | 'en' = 'en') {
  let screen: GameScreen = initialScreen;
  let lastError: string | null = null;
  let language: 'ar' | 'en' = initialLang;

  const callbacks: TransitionCallbacks = {
    getScreen: () => screen,
    setScreen: (newScreen: GameScreen) => {
      screen = newScreen;
    },
    setError: (err: string | null) => {
      lastError = err;
    },
    getLanguage: () => language
  };

  const coordinator = new GameFlowCoordinator(engine, callbacks);

  return {
    coordinator,
    getScreen: () => screen,
    setScreen: (newScreen: GameScreen) => { screen = newScreen; },
    getError: () => lastError,
    clearError: () => { lastError = null; },
    setLanguage: (lang: 'ar' | 'en') => { language = lang; }
  };
}

// =========================================================================
// TEST A: SUCCESSFUL START VOTING
// =========================================================================
console.log('--- TEST A: Successful Start Voting ---');
{
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'free_discussion');

  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  check(engine.getState().phase === 'DISCUSSION', 'Engine is in DISCUSSION phase');

  const result = harness.coordinator.startVoting();
  check(result === true, 'coordinator.startVoting returned true');
  check(engine.getState().phase === 'VOTING', 'Engine phase is VOTING');
  check(harness.getScreen() === 'voting', 'UI navigated to voting');
  check(harness.getError() === null, 'No error set on success');
}

// =========================================================================
// TEST B: FAILED START VOTING
// =========================================================================
console.log('--- TEST B: Failed Start Voting ---');
{
  const engine = new GameEngine(); // No active game
  const harness = createMockHarness(engine, 'free_discussion');

  const result = harness.coordinator.startVoting();
  check(result === false, 'coordinator.startVoting returned false when engine threw');
  check(harness.getScreen() === 'free_discussion', 'UI did NOT navigate to voting, remained on free_discussion');
  check(harness.getError() !== null, 'Error callback was invoked');
}

// =========================================================================
// TEST C: SUCCESSFUL VOTE RESOLUTION
// =========================================================================
console.log('--- TEST C: Successful Vote Resolution ---');
{
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'voting');

  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  engine.startVoting();

  const players = engine.getState().players;
  const votes: Record<number, number> = {
    [players[0].id]: players[1].id,
    [players[1].id]: players[1].id,
    [players[2].id]: players[1].id,
    [players[3].id]: players[1].id
  };

  const result = harness.coordinator.resolveVotes(votes);
  check(result === true, 'coordinator.resolveVotes returned true');
  check(engine.getState().phase === 'VOTE_RESULT', 'Engine phase is VOTE_RESULT');
  check(harness.getScreen() === 'vote_result', 'UI navigated to vote_result');
  check(harness.getError() === null, 'No error set');
}

// =========================================================================
// TEST D: FAILED VOTE RESOLUTION
// =========================================================================
console.log('--- TEST D: Failed Vote Resolution ---');
{
  const engine = new GameEngine(); // No active game
  const harness = createMockHarness(engine, 'voting');

  const result = harness.coordinator.resolveVotes({ 1: 2 });
  check(result === false, 'coordinator.resolveVotes returned false when engine threw');
  check(harness.getScreen() === 'voting', 'UI did NOT navigate, remained on voting');
  check(harness.getError() !== null, 'Error callback fired');
}

// =========================================================================
// TEST E: NEXT ROUND (destination derived from authoritative state)
// =========================================================================
console.log('--- TEST E: Next Round (Game Not Ended) ---');
{
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'vote_result');

  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  engine.startVoting();

  // Cast tie votes so nobody is eliminated and game continues
  const players = engine.getState().players;
  const votes: Record<number, number> = {
    [players[0].id]: players[1].id,
    [players[1].id]: players[0].id,
    [players[2].id]: players[3].id,
    [players[3].id]: players[2].id
  };
  engine.resolveVotes(votes);
  check(engine.getState().winner === 'NONE', 'Winner is NONE (game ongoing)');

  // IMPORTANT: Notice proceedAfterVoteResult() called with NO arguments!
  const result = harness.coordinator.proceedAfterVoteResult();
  check(result === true, 'coordinator.proceedAfterVoteResult returned true');
  check(engine.getState().phase === 'DISCUSSION', 'Engine phase is DISCUSSION');
  check(harness.getScreen() === 'free_discussion', 'UI became free_discussion based purely on authoritative state');
  check(harness.getError() === null, 'No error set');
}

// =========================================================================
// TEST F: GAME END (destination derived from authoritative state)
// =========================================================================
console.log('--- TEST F: Game End (Winner Determined) ---');
{
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'vote_result');

  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  engine.startVoting();

  // Eliminate the killer so innocents win
  const killer = engine.getState().players.find(p => p.guilty)!;
  const players = engine.getState().players;
  const votes: Record<number, number> = {};
  players.forEach(p => {
    votes[p.id] = killer.id;
  });

  engine.resolveVotes(votes);
  check(engine.getState().winner === 'INNOCENTS', 'Winner is INNOCENTS');

  // IMPORTANT: Notice proceedAfterVoteResult() called with NO arguments!
  const result = harness.coordinator.proceedAfterVoteResult();
  check(result === true, 'coordinator.proceedAfterVoteResult returned true');
  check(engine.getState().phase === 'KILLER_REVEAL', 'Engine phase is KILLER_REVEAL');
  check(harness.getScreen() === 'killer_reveal', 'UI became killer_reveal based purely on authoritative state');
  check(harness.getError() === null, 'No error set');
}

// =========================================================================
// TEST G: FAILED PROCEED AFTER VOTE RESULT
// =========================================================================
console.log('--- TEST G: Failed Proceed After Vote Result ---');
{
  const engine = new GameEngine(); // No active game
  const harness = createMockHarness(engine, 'vote_result');

  const result = harness.coordinator.proceedAfterVoteResult();
  check(result === false, 'coordinator.proceedAfterVoteResult returned false');
  check(harness.getScreen() === 'vote_result', 'UI remained on vote_result');
  check(harness.getError() !== null, 'Error callback was invoked');
}

// =========================================================================
// TEST H: CRIME EXPLANATION SUCCESS/FAILURE
// =========================================================================
console.log('--- TEST H: Crime Explanation Success and Failure ---');
{
  // 1. Success
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'killer_reveal');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  const successResult = harness.coordinator.proceedToCrimeExplanation();
  check(successResult === true, 'proceedToCrimeExplanation returned true on valid game');
  check(engine.getState().phase === 'CRIME_EXPLANATION', 'Engine phase is CRIME_EXPLANATION');
  check(harness.getScreen() === 'crime_explanation', 'UI navigated to crime_explanation');

  // 2. Failure
  const uninitEngine = new GameEngine();
  const failHarness = createMockHarness(uninitEngine, 'killer_reveal');
  const failResult = failHarness.coordinator.proceedToCrimeExplanation();
  check(failResult === false, 'proceedToCrimeExplanation returned false when no active game');
  check(failHarness.getScreen() === 'killer_reveal', 'UI remained on killer_reveal');
  check(failHarness.getError() !== null, 'Error callback fired');
}

// =========================================================================
// TEST I: GAME OVER SUCCESS/FAILURE
// =========================================================================
console.log('--- TEST I: Game Over Success and Failure ---');
{
  // 1. Success
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'reveal_truth');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  const successResult = harness.coordinator.proceedToGameOver();
  check(successResult === true, 'proceedToGameOver returned true on valid game');
  check(engine.getState().phase === 'GAME_OVER', 'Engine phase is GAME_OVER');
  check(harness.getScreen() === 'results', 'UI navigated to results');

  // 2. Failure
  const uninitEngine = new GameEngine();
  const failHarness = createMockHarness(uninitEngine, 'reveal_truth');
  const failResult = failHarness.coordinator.proceedToGameOver();
  check(failResult === false, 'proceedToGameOver returned false when no active game');
  check(failHarness.getScreen() === 'reveal_truth', 'UI remained on reveal_truth');
  check(failHarness.getError() !== null, 'Error callback fired');
}

// =========================================================================
// TEST J: RESET TO LOBBY
// =========================================================================
console.log('--- TEST J: Reset To Lobby Success and Failure ---');
{
  // 1. Success
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'results');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  const successResult = harness.coordinator.resetToLobby('home');
  check(successResult === true, 'resetToLobby returned true');
  check(engine.getState().phase === 'LOBBY', 'Engine phase reset to LOBBY');
  check(harness.getScreen() === 'home', 'UI navigated to home');

  // 2. Failure simulated
  const originalReset = engine.resetToLobby.bind(engine);
  engine.resetToLobby = () => {
    throw new Error('Database write lock during reset');
  };
  harness.setScreen('results');
  const failResult = harness.coordinator.resetToLobby('home');
  check(failResult === false, 'resetToLobby returned false on error');
  check(harness.getScreen() === 'results', 'UI remained on results');
  check(harness.getError() === 'Database write lock during reset', 'Error recorded');
  engine.resetToLobby = originalReset;
}

// =========================================================================
// TEST K: ROLE PASS RESET
// =========================================================================
console.log('--- TEST K: Role Pass Reset Success and Failure ---');
{
  // 1. Success
  const engine = new GameEngine();
  const harness = createMockHarness(engine, 'role_pass');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);
  engine.advanceRolePass();
  check(engine.getState().currentViewingPlayerIndex === 1, 'Viewing player index is 1');

  const successResult = harness.coordinator.resetRolePass();
  check(successResult === true, 'resetRolePass returned true');
  check(engine.getState().currentViewingPlayerIndex === 0, 'Viewing player index reset to 0');
  check(harness.getScreen() === 'player_setup', 'UI navigated to player_setup');

  // 2. Failure simulated
  const originalResetRole = engine.resetRolePass.bind(engine);
  engine.resetRolePass = () => {
    throw new Error('Reset role pass error');
  };
  harness.setScreen('role_pass');
  const failResult = harness.coordinator.resetRolePass();
  check(failResult === false, 'resetRolePass returned false on error');
  check(harness.getScreen() === 'role_pass', 'UI remained on role_pass');
  check(harness.getError() === 'Reset role pass error', 'Error recorded');
  engine.resetRolePass = originalResetRole;
}

console.log('\n====================================================');
console.log(`ALL GameFlowCoordinator DEDICATED TESTS PASSED! (${passedTests} assertions)`);
console.log('====================================================\n');
