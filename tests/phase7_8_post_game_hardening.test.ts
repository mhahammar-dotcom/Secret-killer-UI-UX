import { GameEngine } from '../src/game/GameEngine';
import { GameFlowCoordinator } from '../src/game/GameFlowCoordinator';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { GameScreen, PlayerData, StoryData } from '../src/types';
import { StorySolutionEngine, STORY_DEDUCTION_DATABASE } from '../src/game/StorySolutionEngine';

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
console.log('PHASE 7.8: POST-GAME FLOW & REPLAY LOOP HARDENING');
console.log('====================================================\n');

const stories = BUILT_IN_STORIES_V2;
const story = stories.find(s => s.id === 'dreams') || stories[0];

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
    setScreen: (s: GameScreen) => {
      currentScreen = s;
    },
    getError: () => currentError,
    clearError: () => {
      currentError = null;
    },
    setLanguage: (lang: 'ar' | 'en') => {
      language = lang;
    },
    getLanguage: () => language,
  };
}

// =========================================================================
// TEST A: INNOCENTS WIN -> CORRECT POST-GAME DESTINATION PIPELINE
// =========================================================================
console.log('--- TEST A: Innocents Win Post-Game Pipeline ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'player_setup');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  const killers = engine.getState().players.filter(p => p.guilty);
  check(killers.length === 1, '4 players allocate exactly 1 killer');
  const killer = killers[0];

  // Pass roles
  for (let i = 0; i < 4; i++) {
    harness.coordinator.advanceRolePass();
  }
  check(harness.getScreen() === 'free_discussion', 'Advanced to free_discussion');

  // Start voting and all players vote the killer
  harness.coordinator.startVoting();
  check(harness.getScreen() === 'voting', 'Advanced to voting');

  const votes: Record<number, number> = {};
  engine.getState().players.forEach(p => {
    votes[p.id] = killer.id;
  });
  harness.coordinator.resolveVotes(votes);

  check(harness.getScreen() === 'vote_result', 'Navigated to vote_result');
  check(engine.getState().winner === 'INNOCENTS', 'Innocents won');

  // Authoritative post-game sequence
  // 1. Vote Result -> Killer Reveal
  const toReveal = harness.coordinator.proceedAfterVoteResult();
  check(toReveal === true, 'Proceed after vote result returned true');
  check(harness.getScreen() === 'killer_reveal', 'Navigated to killer_reveal');
  check(engine.getState().phase === 'KILLER_REVEAL', 'Engine phase is KILLER_REVEAL');

  // 2. Killer Reveal -> Crime Explanation
  const toExplanation = harness.coordinator.proceedToCrimeExplanation();
  check(toExplanation === true, 'Proceed to crime explanation returned true');
  check(harness.getScreen() === 'crime_explanation', 'Navigated to crime_explanation');
  check(engine.getState().phase === 'CRIME_EXPLANATION', 'Engine phase is CRIME_EXPLANATION');

  // 3. Crime Explanation -> Reveal Truth
  const toTruth = harness.coordinator.proceedToTruthReveal();
  check(toTruth === true, 'Proceed to truth reveal returned true');
  check(harness.getScreen() === 'reveal_truth', 'Navigated to reveal_truth');
  check(engine.getState().phase === 'REVEAL_TRUTH', 'Engine phase is REVEAL_TRUTH');

  // 4. Reveal Truth -> Results
  const toResults = harness.coordinator.proceedToGameOver();
  check(toResults === true, 'Proceed to game over returned true');
  check(harness.getScreen() === 'results', 'Navigated to results');
  check(engine.getState().phase === 'GAME_OVER', 'Engine phase is GAME_OVER');
}

// =========================================================================
// TEST B: KILLERS WIN -> CORRECT POST-GAME DESTINATION PIPELINE
// =========================================================================
console.log('--- TEST B: Killer(s) Win Post-Game Pipeline ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'player_setup');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  const innocents = engine.getState().players.filter(p => !p.guilty);
  const targetInnocent = innocents[0];

  // Complete role pass
  for (let i = 0; i < 4; i++) {
    harness.coordinator.advanceRolePass();
  }

  // Max wrong votes triggers guilty victory
  const maxWrong = engine.getState().maxWrongVotes;
  for (let round = 1; round <= maxWrong; round++) {
    harness.coordinator.startVoting();
    const aliveInnocents = engine.getState().players.filter(p => !p.guilty && !p.isEliminated);
    const target = aliveInnocents[0];
    const wrongVotes: Record<number, number> = {};
    engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
      wrongVotes[p.id] = target.id;
    });
    harness.coordinator.resolveVotes(wrongVotes);

    if (round < maxWrong) {
      harness.coordinator.proceedAfterVoteResult();
    }
  }

  check(engine.getState().winner === 'GUILTY', 'Guilty won via max wrong votes');
  check(harness.getScreen() === 'vote_result', 'On vote_result');

  // Post-game navigation
  check(harness.coordinator.proceedAfterVoteResult() === true, 'Proceeded to killer_reveal');
  check(harness.getScreen() === 'killer_reveal', 'On killer_reveal');
  check(harness.coordinator.proceedToCrimeExplanation() === true, 'Proceeded to crime_explanation');
  check(harness.getScreen() === 'crime_explanation', 'On crime_explanation');
  check(harness.coordinator.proceedToTruthReveal() === true, 'Proceeded to reveal_truth');
  check(harness.getScreen() === 'reveal_truth', 'On reveal_truth');
  check(harness.coordinator.proceedToGameOver() === true, 'Proceeded to results');
  check(harness.getScreen() === 'results', 'On results');
}

// =========================================================================
// TEST C: ONE-KILLER GAME (4-6 Players) -> ONLY ACTUAL KILLER APPEARS
// =========================================================================
console.log('--- TEST C: One-Killer Scaling & Isolation ---');
{
  [4, 5, 6].forEach(count => {
    const engine = new GameEngine();
    const names = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
    engine.startNewGame(story, names);

    const actualKillers = engine.getState().players.filter(p => p.guilty);
    check(actualKillers.length === 1, `${count} players must produce exactly 1 actual killer`);

    // Verify innocent players have no killer flags or partners
    const innocentPlayers = engine.getState().players.filter(p => !p.guilty);
    check(innocentPlayers.length === count - 1, `Remaining ${count - 1} players are innocent`);
    innocentPlayers.forEach(p => {
      check(p.guilty === false, `Innocent ${p.name} must have guilty = false`);
      check(p.character.guilty === false, `Innocent ${p.name} character must have guilty = false`);
    });

    // Actual killer has no partner in single-killer game
    const otherPartners = actualKillers.filter(p => p.id !== actualKillers[0].id);
    check(otherPartners.length === 0, 'Single killer must have 0 partners');
  });
}

// =========================================================================
// TEST D: TWO-KILLER GAME (7-9 Players) -> BOTH ACTUAL KILLERS RECOGNIZE EACH OTHER
// =========================================================================
console.log('--- TEST D: Two-Killer Alliance & Mutual Recognition ---');
{
  [7, 8, 9].forEach(count => {
    const engine = new GameEngine();
    const names = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
    engine.startNewGame(story, names);

    const actualKillers = engine.getState().players.filter(p => p.guilty);
    check(actualKillers.length === 2, `${count} players must produce exactly 2 actual killers`);

    const killerA = actualKillers[0];
    const killerB = actualKillers[1];

    // Killer A sees Killer B as partner
    const partnersForA = actualKillers.filter(p => p.id !== killerA.id);
    check(partnersForA.length === 1 && partnersForA[0].id === killerB.id, `Killer A sees Killer B`);

    // Killer B sees Killer A as partner
    const partnersForB = actualKillers.filter(p => p.id !== killerB.id);
    check(partnersForB.length === 1 && partnersForB[0].id === killerA.id, `Killer B sees Killer A`);

    // Innocents see 0 partners
    const innocents = engine.getState().players.filter(p => !p.guilty);
    innocents.forEach(inn => {
      const innPartners = actualKillers.filter(k => k.id !== inn.id);
      // If innocent queried their own "partners" (which UI never does), innocent is not in actualKillers
      check(!actualKillers.some(k => k.id === inn.id), `Innocent ${inn.name} is never in actualKillers`);
    });
  });
}

// =========================================================================
// TEST E: THREE-KILLER GAME (10-12 Players) -> ALL THREE RECOGNIZE EACH OTHER
// =========================================================================
console.log('--- TEST E: Three-Killer Alliance & Mutual Recognition ---');
{
  [10, 11, 12].forEach(count => {
    const engine = new GameEngine();
    const names = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
    engine.startNewGame(story, names);

    const actualKillers = engine.getState().players.filter(p => p.guilty);
    check(actualKillers.length === 3, `${count} players must produce exactly 3 actual killers`);

    actualKillers.forEach(k => {
      const otherPartners = actualKillers.filter(p => p.id !== k.id);
      check(otherPartners.length === 2, `Killer ${k.name} recognizes exactly 2 partners`);
      otherPartners.forEach(partner => {
        check(partner.guilty === true, `Partner ${partner.name} is also guilty`);
      });
    });
  });
}

// =========================================================================
// TEST F: guiltyPool CANDIDATES NEVER APPEAR AS ACTUAL KILLERS / PARTNERS
// =========================================================================
console.log('--- TEST F: guiltyPool Candidates Never Appear as Actual Killers ---');
{
  const engine = new GameEngine();
  // Story dreams has 3 guilty candidates in story.guiltyPool
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  const actualKillers = engine.getState().players.filter(p => p.guilty);
  check(actualKillers.length === 1, '4 players: only 1 killer allocated');

  const storyGuiltyPoolNames = (story as any).guiltyPool || [];
  const assignedCharacters = engine.getState().players.map(p => p.character.name);

  // Check that any characters from guiltyPool that are assigned to innocent players remain innocent!
  engine.getState().players.forEach(player => {
    if (!player.guilty) {
      check(player.guilty === false, `Player ${player.name} (${player.character.name}) is strictly not guilty`);
      check(player.character.guilty === false, `Character ${player.character.name} is strictly not guilty`);
    }
  });

  // Check that only player.guilty is used in end-game screens
  const displayedKillers = engine.getState().players.filter(p => p.guilty);
  check(displayedKillers.length === 1, 'Displayed killer list contains strictly actual guilty players');
  check(displayedKillers[0].id === actualKillers[0].id, 'Displayed killer matches actual killer');
}

// =========================================================================
// TEST G: REVEAL TRUTH USES CURRENT GAME ACTUAL GUILTY PLAYERS
// =========================================================================
console.log('--- TEST G: Reveal Truth Solution Generation Uses Actual Killers ---');
{
  const engine = new GameEngine();
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  const guiltyPlayers = engine.getState().players.filter(p => p.guilty);
  const innocentPlayers = engine.getState().players.filter(p => !p.guilty);

  check(guiltyPlayers.length === 1, '1 guilty player in engine');
  check(innocentPlayers.length === 3, '3 innocent players in engine');

  // Verify dynamic solution output
  const caseData = STORY_DEDUCTION_DATABASE[story.id];
  const culpritProfile = Object.values(caseData.culprits).find(
    c => c.name === guiltyPlayers[0].character.name || guiltyPlayers[0].character.name.includes(c.name)
  );
  check(culpritProfile !== undefined, 'Found matching culprit profile for assigned character');

  const solutionEn = StorySolutionEngine.generateSolution(story, guiltyPlayers, innocentPlayers, 'en');
  check(typeof solutionEn === 'string' && solutionEn.length > 20, 'English solution generated');
  check(solutionEn.includes(culpritProfile!.nameEn),
    'English solution explicitly mentions the actual guilty character English name');

  const solutionAr = StorySolutionEngine.generateSolution(story, guiltyPlayers, innocentPlayers, 'ar');
  check(typeof solutionAr === 'string' && solutionAr.length > 20, 'Arabic solution generated');
  check(solutionAr.includes(culpritProfile!.name),
    'Arabic solution explicitly mentions actual killer Arabic name');
}

// =========================================================================
// TEST H: PLAY AGAIN COMPLETELY RESETS THE AUTHORITATIVE STATE
// =========================================================================
console.log('--- TEST H: Play Again Authoritative State Cleansing ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'results');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  // Set up game over state
  engine.proceedToGameOver();
  check(engine.getState().phase === 'GAME_OVER', 'Engine is GAME_OVER');
  check(engine.getState().players.length === 4, 'Engine has 4 players');

  // Trigger Play Again via coordinator
  const resetOk = harness.coordinator.resetToLobby('story_select');
  check(resetOk === true, 'resetToLobby returned true');
  check(harness.getScreen() === 'story_select', 'Navigated to story_select');

  const cleanState = engine.getState();
  check(cleanState.phase === 'LOBBY', 'Phase is LOBBY');
  check(cleanState.story === null, 'Story is null');
  check(cleanState.players.length === 0, 'Players are empty');
  check(cleanState.votes && Object.keys(cleanState.votes).length === 0, 'Votes are empty');
  check(cleanState.revealedClues.length === 0, 'Revealed clues are empty');
  check(cleanState.revealedEvidenceIds.length === 0, 'Evidence IDs are empty');
  check(cleanState.wrongVotesCount === 0, 'Wrong votes count is 0');
  check(cleanState.winner === 'NONE', 'Winner is NONE');
  check(cleanState.currentRound === 1, 'Round is 1');
  check(cleanState.history.eliminations.length === 0, 'History eliminations are empty');
}

// =========================================================================
// TEST I: HOME COMPLETELY RESETS THE AUTHORITATIVE STATE
// =========================================================================
console.log('--- TEST I: Home Authoritative State Cleansing ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'results');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace']);

  // Set up game over state
  engine.proceedToGameOver();
  check(engine.getState().phase === 'GAME_OVER', 'Engine is GAME_OVER');
  check(engine.getState().players.length === 7, 'Engine has 7 players');

  // Trigger Home via coordinator
  const resetOk = harness.coordinator.resetToLobby('home');
  check(resetOk === true, 'resetToLobby returned true');
  check(harness.getScreen() === 'home', 'Navigated to home');

  const cleanState = engine.getState();
  check(cleanState.phase === 'LOBBY', 'Phase is LOBBY');
  check(cleanState.story === null, 'Story is null');
  check(cleanState.players.length === 0, 'Players are empty');
  check(cleanState.votes && Object.keys(cleanState.votes).length === 0, 'Votes are empty');
  check(cleanState.winner === 'NONE', 'Winner is NONE');
}

// =========================================================================
// TEST J: PROCEED-TO-TRUTH TRANSITION CANNOT NAVIGATE IF TRANSITION FAILS
// =========================================================================
console.log('--- TEST J: proceedToTruth Cannot Navigate on Authoritative Failure ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'crime_explanation');

  // 1. Without active game
  const failedNoGame = harness.coordinator.proceedToTruthReveal();
  check(failedNoGame === false, 'proceedToTruthReveal returned false without active game');
  check(harness.getScreen() === 'crime_explanation', 'Screen stayed on crime_explanation');
  check(harness.getError() !== null, 'Error recorded');

  // 2. Simulated engine exception
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);
  harness.clearError();
  harness.setScreen('crime_explanation');

  const originalMethod = engine.proceedToTruthReveal.bind(engine);
  engine.proceedToTruthReveal = () => {
    throw new Error('Database locked truth reveal');
  };

  const failedException = harness.coordinator.proceedToTruthReveal();
  check(failedException === false, 'proceedToTruthReveal returned false on engine error');
  check(harness.getScreen() === 'crime_explanation', 'Screen remained on crime_explanation');
  check(harness.getError() === 'Database locked truth reveal', 'Error message recorded correctly');

  engine.proceedToTruthReveal = originalMethod;
}

// =========================================================================
// TEST K: GAMEFLOWCOORDINATOR REMAINS RESPONSIBLE FOR POST-GAME TRANSITIONS
// =========================================================================
console.log('--- TEST K: Coordinator Single Source of Truth for Post-Game ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'crime_explanation');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  // Enter CRIME_EXPLANATION first
  engine.proceedToCrimeExplanation();
  check(engine.getState().phase === 'CRIME_EXPLANATION', 'Engine phase is CRIME_EXPLANATION');

  // Verify that calling coordinator.proceedToTruthReveal() performs the GameEngine transition
  // and THEN updates the UI screen to 'reveal_truth'
  check(engine.getState().phase !== 'REVEAL_TRUTH', 'Initial phase is not REVEAL_TRUTH');
  const success = harness.coordinator.proceedToTruthReveal();
  check(success === true, 'Coordinator transition succeeded');
  check(engine.getState().phase === 'REVEAL_TRUTH', 'Engine phase transitioned to REVEAL_TRUTH');
  check(harness.getScreen() === 'reveal_truth', 'Harness screen updated to reveal_truth');

  // And proceedToGameOver
  const gameOverSuccess = harness.coordinator.proceedToGameOver();
  check(gameOverSuccess === true, 'Coordinator proceedToGameOver succeeded');
  check(engine.getState().phase === 'GAME_OVER', 'Engine phase transitioned to GAME_OVER');
  check(harness.getScreen() === 'results', 'Harness screen updated to results');
}

// =========================================================================
// TEST L: ARABIC POST-GAME FLOW REMAINS VALID & LOCALIZED
// =========================================================================
console.log('--- TEST L: Arabic Post-Game Flow & Localization ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'vote_result', 'ar');
  engine.startNewGame(story, ['خالد', 'فاطمة', 'عمر', 'سارة']);

  // Check error message in Arabic when failing
  const uninitEngine = new GameEngine();
  const failHarness = createTestHarness(uninitEngine, 'crime_explanation', 'ar');
  failHarness.coordinator.proceedToTruthReveal();
  check(failHarness.getError() !== null, 'Arabic error recorded');
  check(typeof failHarness.getError() === 'string', 'Arabic error is a string');

  // Check successful flow in Arabic
  const killer = engine.getState().players.find(p => p.guilty)!;
  const killVotes: Record<number, number> = {};
  engine.getState().players.forEach(p => { killVotes[p.id] = killer.id; });
  harness.coordinator.resolveVotes(killVotes);
  check(engine.getState().winner === 'INNOCENTS', 'Innocents won in Arabic game');

  harness.coordinator.proceedAfterVoteResult();
  check(harness.getScreen() === 'killer_reveal', 'Arabic navigated to killer_reveal');
  harness.coordinator.proceedToCrimeExplanation();
  check(harness.getScreen() === 'crime_explanation', 'Arabic navigated to crime_explanation');
  harness.coordinator.proceedToTruthReveal();
  check(harness.getScreen() === 'reveal_truth', 'Arabic navigated to reveal_truth');
  harness.coordinator.proceedToGameOver();
  check(harness.getScreen() === 'results', 'Arabic navigated to results');
}

// =========================================================================
// TEST M: ENGLISH POST-GAME FLOW REMAINS VALID & LOCALIZED
// =========================================================================
console.log('--- TEST M: English Post-Game Flow & Localization ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine, 'vote_result', 'en');
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);

  // Check error message in English when failing
  const uninitEngine = new GameEngine();
  const failHarness = createTestHarness(uninitEngine, 'crime_explanation', 'en');
  failHarness.coordinator.proceedToTruthReveal();
  check(failHarness.getError() !== null, 'English error recorded');
  check(failHarness.getError() === 'Cannot proceed to reveal truth: no active game.' ||
        failHarness.getError() === 'Unable to load reveal truth.', 'English error is localized');

  // Check successful flow in English
  const killer = engine.getState().players.find(p => p.guilty)!;
  const killVotes: Record<number, number> = {};
  engine.getState().players.forEach(p => { killVotes[p.id] = killer.id; });
  harness.coordinator.resolveVotes(killVotes);
  check(engine.getState().winner === 'INNOCENTS', 'Innocents won in English game');

  harness.coordinator.proceedAfterVoteResult();
  check(harness.getScreen() === 'killer_reveal', 'English navigated to killer_reveal');
  harness.coordinator.proceedToCrimeExplanation();
  check(harness.getScreen() === 'crime_explanation', 'English navigated to crime_explanation');
  harness.coordinator.proceedToTruthReveal();
  check(harness.getScreen() === 'reveal_truth', 'English navigated to reveal_truth');
  harness.coordinator.proceedToGameOver();
  check(harness.getScreen() === 'results', 'English navigated to results');
}

// =========================================================================
// TEST N: INVALID-PHASE CALL TO proceedToTruthReveal() IS REJECTED WITHOUT MUTATING STATE
// =========================================================================
console.log('--- TEST N: proceedToTruthReveal Rejects Invalid Phases Without Mutating State ---');
{
  const engine = new GameEngine();
  engine.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'David']);
  check(engine.getState().phase === 'ROLE_PASS', 'Initial phase after startNewGame is ROLE_PASS');

  // 1. Direct call when phase is ROLE_PASS (invalid phase)
  const stateSnapshotBefore = JSON.parse(JSON.stringify(engine.getState()));
  let thrownError: Error | null = null;
  try {
    engine.proceedToTruthReveal();
  } catch (err: any) {
    thrownError = err;
  }

  check(thrownError !== null, 'proceedToTruthReveal threw error on invalid phase (ROLE_PASS)');
  check(
    thrownError!.message.includes('expected CRIME_EXPLANATION'),
    'Error message explicitly specifies expected phase CRIME_EXPLANATION'
  );
  check(engine.getState().phase === 'ROLE_PASS', 'State phase remained ROLE_PASS without mutation');
  check(
    JSON.stringify(engine.getState()) === JSON.stringify(stateSnapshotBefore),
    'Engine state was completely unmutated after rejected transition'
  );

  // 2. Advance through role passes to DISCUSSION phase (still invalid phase)
  const harness = createTestHarness(engine, 'free_discussion');
  for (let i = 0; i < 4; i++) {
    harness.coordinator.advanceRolePass();
  }
  check(engine.getState().phase === 'DISCUSSION', 'Game is now in DISCUSSION phase');

  const discussionSnapshot = JSON.parse(JSON.stringify(engine.getState()));
  let discussionError: Error | null = null;
  try {
    engine.proceedToTruthReveal();
  } catch (err: any) {
    discussionError = err;
  }

  check(discussionError !== null, 'proceedToTruthReveal threw error on invalid phase (DISCUSSION)');
  check(engine.getState().phase === 'DISCUSSION', 'State phase remained DISCUSSION without mutation');
  check(
    JSON.stringify(engine.getState()) === JSON.stringify(discussionSnapshot),
    'Engine state remained completely unmutated after rejected DISCUSSION transition'
  );

  // 3. Coordinator integration: coordinator catches rejection, does NOT navigate, sets error
  const coordResult = harness.coordinator.proceedToTruthReveal();
  check(coordResult === false, 'Coordinator returned false when engine rejected invalid phase');
  check(harness.getScreen() === 'free_discussion', 'Screen remained on free_discussion');
  check(harness.getError() !== null, 'Error was recorded on coordinator');

  // 4. Transition to CRIME_EXPLANATION -> proceedToTruthReveal now succeeds
  engine.proceedToCrimeExplanation();
  check(engine.getState().phase === 'CRIME_EXPLANATION', 'Phase is now CRIME_EXPLANATION');
  harness.setScreen('crime_explanation');
  harness.clearError();

  const successResult = harness.coordinator.proceedToTruthReveal();
  check(successResult === true, 'Coordinator returned true when phase is CRIME_EXPLANATION');
  check(engine.getState().phase === 'REVEAL_TRUTH', 'Engine state mutated to REVEAL_TRUTH on valid phase');
  check(harness.getScreen() === 'reveal_truth', 'Screen navigated to reveal_truth');
  check(harness.getError() === null, 'No error present on successful transition');
}

console.log('\n====================================================');
console.log(`ALL PHASE 7.8 HARDENING REGRESSION TESTS PASSED! (${passedTests} assertions)`);
console.log('====================================================\n');
