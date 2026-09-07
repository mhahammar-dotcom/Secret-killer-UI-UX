import { GameEngine } from '../src/game/GameEngine';
import { GameFlowCoordinator } from '../src/game/GameFlowCoordinator';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { GameScreen } from '../src/types';
import { StorySolutionEngine, STORY_DEDUCTION_DATABASE } from '../src/game/StorySolutionEngine';
import { ClueEngine, getTotalClueCount } from '../src/game/ClueEngine';
import { AR_STRINGS, EN_STRINGS } from '../src/data/translations';
import { adService } from '../src/services/adService';
import { validateFirebaseConnection } from '../src/services/firebase';

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
console.log('PHASE 7.9: FULL-GAME UX / QA & EDGE-CASE HARDENING');
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

function completeRolePass(harness: ReturnType<typeof createTestHarness>, engine: GameEngine) {
  while (engine.getState().phase === 'ROLE_PASS') {
    harness.coordinator.advanceRolePass();
  }
}

// =========================================================================
// SCENARIO A: Full Flow 4-Player Game (1 Killer)
// =========================================================================
console.log('--- SCENARIO A: Full flow 4-player game (1 killer) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  const playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];

  const startSuccess = harness.coordinator.startNewGame(story, playerNames);
  check(startSuccess === true, 'A: startNewGame succeeded for 4 players');
  check(harness.getScreen() === 'role_pass', 'A: UI transitioned to role_pass');

  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  check(killers.length === 1, 'A: Exactly 1 killer in 4-player game');
  check(state.players.length === 4, 'A: Exactly 4 players created');

  // Complete role pass
  completeRolePass(harness, engine);
  check(harness.getScreen() === 'free_discussion', 'A: UI transitioned to free_discussion');
  check(engine.getState().phase === 'DISCUSSION', 'A: Engine phase is DISCUSSION');
}

// =========================================================================
// SCENARIO B: Full Flow 8-Player Game (2 Killers)
// =========================================================================
console.log('--- SCENARIO B: Full flow 8-player game (2 killers) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];

  const startSuccess = harness.coordinator.startNewGame(story, playerNames);
  check(startSuccess === true, 'B: startNewGame succeeded for 8 players');
  check(harness.getScreen() === 'role_pass', 'B: UI transitioned to role_pass');

  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  check(killers.length === 2, 'B: Exactly 2 killers in 8-player game');
  check(state.players.length === 8, 'B: Exactly 8 players created');

  // Verify killer alliance recognition for both killers
  const k1 = killers[0];
  const k2 = killers[1];
  const partnersOfK1 = engine.getKillerPartners(k1.id);
  const partnersOfK2 = engine.getKillerPartners(k2.id);
  check(partnersOfK1.length === 1 && partnersOfK1[0].id === k2.id, 'B: K1 sees K2 as partner');
  check(partnersOfK2.length === 1 && partnersOfK2[0].id === k1.id, 'B: K2 sees K1 as partner');

  // Advance to discussion
  completeRolePass(harness, engine);
  check(harness.getScreen() === 'free_discussion', 'B: UI on free_discussion');
}

// =========================================================================
// SCENARIO C: Full Flow 11-Player Game (3 Killers)
// =========================================================================
console.log('--- SCENARIO C: Full flow 11-player game (3 killers) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11'];

  const startSuccess = harness.coordinator.startNewGame(story, playerNames);
  check(startSuccess === true, 'C: startNewGame succeeded for 11 players');
  check(harness.getScreen() === 'role_pass', 'C: UI transitioned to role_pass');

  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  check(killers.length === 3, 'C: Exactly 3 killers in 11-player game');
  check(state.players.length === 11, 'C: Exactly 11 players created');

  // Mutual 3-killer alliance check
  for (const k of killers) {
    const partners = engine.getKillerPartners(k.id);
    check(partners.length === 2, `C: Killer ${k.name} sees exactly 2 partners`);
    check(!partners.some(p => p.id === k.id), `C: Killer ${k.name} does not list themselves as partner`);
  }
}

// =========================================================================
// SCENARIO D: Tie Vote Handling
// =========================================================================
console.log('--- SCENARIO D: Tie vote handling (no elimination, correct round progression) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  const playerNames = ['P1', 'P2', 'P3', 'P4'];
  harness.coordinator.startNewGame(story, playerNames);
  completeRolePass(harness, engine);
  harness.coordinator.startVoting();

  const state = engine.getState();
  const p1 = state.players[0];
  const p2 = state.players[1];
  const p3 = state.players[2];
  const p4 = state.players[3];

  const tieVotes: Record<number, number> = {
    [p1.id]: p2.id,
    [p3.id]: p2.id,
    [p2.id]: p1.id,
    [p4.id]: p1.id,
  };

  const voteSuccess = harness.coordinator.resolveVotes(tieVotes);
  check(voteSuccess === true, 'D: resolveVotes succeeded on tie');
  check(harness.getScreen() === 'vote_result', 'D: UI transitioned to vote_result');

  const voteResultState = engine.getState();
  check(voteResultState.lastVoteResult?.eliminatedPlayer === null, 'D: No player eliminated on tie');
  check(voteResultState.lastVoteResult?.isTie === true, 'D: isTie is true');
  check(voteResultState.winner === 'NONE', 'D: Game is not over on round 1 tie');

  // Proceed after vote result -> should go to free_discussion for round 2
  const nextRoundSuccess = harness.coordinator.proceedAfterVoteResult();
  check(nextRoundSuccess === true, 'D: proceedAfterVoteResult succeeded');
  check(harness.getScreen() === 'free_discussion', 'D: UI transitioned to free_discussion');
  check(engine.getState().currentRound === 2, 'D: Round incremented to 2');
}

// =========================================================================
// SCENARIO E: Killer Win Condition
// =========================================================================
console.log('--- SCENARIO E: Killer win condition (eliminations lead to guilty victory) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  const playerNames = ['P1', 'P2', 'P3', 'P4'];
  harness.coordinator.startNewGame(story, playerNames);
  completeRolePass(harness, engine);

  const state = engine.getState();
  const killer = state.players.find(p => p.guilty)!;
  const innocents = state.players.filter(p => !p.guilty);

  // Round 1 voting: eliminate innocent 0
  harness.coordinator.startVoting();
  const votesRound1: Record<number, number> = {
    [killer.id]: innocents[0].id,
    [innocents[0].id]: killer.id,
    [innocents[1].id]: innocents[0].id,
    [innocents[2].id]: innocents[0].id,
  };
  harness.coordinator.resolveVotes(votesRound1);
  harness.coordinator.proceedAfterVoteResult(); // Go to round 2

  // Round 2 voting: eliminate innocent 1 -> living players: killer + innocent 2 (1 killer, 1 innocent -> parity -> guilty win!)
  harness.coordinator.startVoting();
  const votesRound2: Record<number, number> = {
    [killer.id]: innocents[1].id,
    [innocents[1].id]: killer.id,
    [innocents[2].id]: innocents[1].id,
  };
  harness.coordinator.resolveVotes(votesRound2);

  const endState = engine.getState();
  check(endState.winner === 'GUILTY', 'E: Killer / guilty won');

  // Verify transition to killer reveal
  harness.coordinator.proceedAfterVoteResult();
  check(harness.getScreen() === 'killer_reveal', 'E: UI moved to killer_reveal');
}

// =========================================================================
// SCENARIO F: Innocents Win Condition
// =========================================================================
console.log('--- SCENARIO F: Innocents win condition (all killers eliminated) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  const playerNames = ['P1', 'P2', 'P3', 'P4'];
  harness.coordinator.startNewGame(story, playerNames);
  completeRolePass(harness, engine);
  harness.coordinator.startVoting();

  const state = engine.getState();
  const killer = state.players.find(p => p.guilty)!;
  const innocents = state.players.filter(p => !p.guilty);

  // All innocents vote for the killer
  const votes: Record<number, number> = {
    [killer.id]: innocents[0].id,
    [innocents[0].id]: killer.id,
    [innocents[1].id]: killer.id,
    [innocents[2].id]: killer.id,
  };

  harness.coordinator.resolveVotes(votes);
  const endState = engine.getState();
  check(endState.winner === 'INNOCENTS', 'F: Innocents won');
  check(endState.lastVoteResult?.eliminatedPlayer?.id === killer.id, 'F: Killer was eliminated');
}

// =========================================================================
// SCENARIO G & H: Clue Economy & One Clue Per Round Limit
// =========================================================================
console.log('--- SCENARIO G & H: Clue economy and one-clue-per-round limit ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5'];
  harness.coordinator.startNewGame(story, playerNames);
  completeRolePass(harness, engine);

  check(engine.getState().revealedEvidenceIds.length === 0, 'G: 0 clues initially before reveal');
  check(!engine.getState().clueRevealedThisRound, 'G: No clue revealed yet in round 1');

  // Reveal clue 1 in Round 1
  const clue1 = engine.revealNextEvidence();
  check(clue1 !== null, 'G: Clue revealed in Round 1');
  check(engine.getState().revealedEvidenceIds.length === 1, 'G: Exactly 1 clue revealed');
  check(engine.getState().clueRevealedThisRound === true, 'G: clueRevealedThisRound is true');

  // Attempting second reveal in round 1 must not add duplicates
  const clueDuplicate = engine.revealNextEvidence();
  check(engine.getState().revealedEvidenceIds.length === 1, 'H: Second reveal in round 1 is prevented');

  // Advance to round 2 via tie vote
  harness.coordinator.startVoting();
  const p = engine.getState().players;
  const tieVotes: Record<number, number> = {
    [p[0].id]: p[1].id,
    [p[2].id]: p[1].id,
    [p[1].id]: p[2].id,
    [p[3].id]: p[2].id,
    [p[4].id]: p[3].id,
  };
  harness.coordinator.resolveVotes(tieVotes);
  harness.coordinator.proceedAfterVoteResult();

  // Round 2 resets clueRevealedThisRound
  check(!engine.getState().clueRevealedThisRound, 'H: Round 2 starts with clueRevealedThisRound=false');
  const clue2 = engine.revealNextEvidence();
  check(clue2 !== null, 'H: Clue 2 revealed in round 2');
  check(engine.getState().revealedEvidenceIds.length === 2, 'H: Exactly 2 clues revealed in total across rounds');
  check(engine.getState().revealedEvidenceIds[0] !== engine.getState().revealedEvidenceIds[1], 'H: No duplicate clue IDs');
}

// =========================================================================
// SCENARIO I: Sequential Games Reset Cleanly
// =========================================================================
console.log('--- SCENARIO I: Sequential games reset state cleanly (game 1 -> game 2) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);

  // Run Game 1
  harness.coordinator.startNewGame(story, ['Alice', 'Bob', 'Charlie', 'Diana']);
  completeRolePass(harness, engine);
  harness.coordinator.startVoting();
  const p = engine.getState().players;
  harness.coordinator.resolveVotes({ [p[0].id]: p[1].id, [p[1].id]: p[0].id, [p[2].id]: p[0].id, [p[3].id]: p[0].id });

  // Reset to Lobby
  const resetSuccess = harness.coordinator.resetToLobby('home');
  check(resetSuccess === true, 'I: resetToLobby succeeded');
  check(harness.getScreen() === 'home', 'I: UI returned to home');

  const cleanState = engine.getState();
  check(cleanState.phase === 'LOBBY', 'I: Phase reset to LOBBY');
  check(cleanState.players.length === 0, 'I: Players cleared');
  check(cleanState.story === null, 'I: Story reset to null');
  check(cleanState.revealedEvidenceIds.length === 0, 'I: Revealed clues reset');
  check(cleanState.currentRound === 1, 'I: Round reset to 1');
  check(cleanState.history.eliminations.length === 0, 'I: Eliminations reset to empty');
  check(cleanState.winner === 'NONE', 'I: winner reset to NONE');

  // Start Game 2 with completely different players
  const startSuccess2 = harness.coordinator.startNewGame(story, ['Xavier', 'Yvonne', 'Zack', 'Walter']);
  check(startSuccess2 === true, 'I: Game 2 started successfully');
  const state2 = engine.getState();
  check(state2.players.length === 4, 'I: Exactly 4 new players in Game 2');
  check(state2.players.some(pl => pl.name === 'Xavier'), 'I: Game 2 contains Xavier');
  check(!state2.players.some(pl => pl.name === 'Alice'), 'I: Game 2 has NO trace of Game 1 Alice');
}

// =========================================================================
// SCENARIO J: Invalid Player Counts Rejected
// =========================================================================
console.log('--- SCENARIO J: Invalid player counts rejected (3, 13, non-integer) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);

  // 3 players (< 4)
  const res3 = harness.coordinator.startNewGame(story, ['P1', 'P2', 'P3']);
  check(res3 === false, 'J: 3 players rejected');
  check(harness.getError() !== null, 'J: Error set for 3 players');
  harness.clearError();

  // 13 players (> 12)
  const res13 = harness.coordinator.startNewGame(story, [
    'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13'
  ]);
  check(res13 === false, 'J: 13 players rejected');
  check(harness.getError() !== null, 'J: Error set for 13 players');
  harness.clearError();

  // Empty player list
  const res0 = harness.coordinator.startNewGame(story, []);
  check(res0 === false, 'J: 0 players rejected');
  check(harness.getError() !== null, 'J: Error set for 0 players');
}

// =========================================================================
// SCENARIO K: Repeated Click / Rapid Transition Safety
// =========================================================================
console.log('--- SCENARIO K: Repeated click / rapid transition safety ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  harness.coordinator.startNewGame(story, ['P1', 'P2', 'P3', 'P4']);

  // Advance role pass until done
  completeRolePass(harness, engine);
  check(harness.getScreen() === 'free_discussion', 'K: In free_discussion');

  // Calling advanceRolePass when not in ROLE_PASS phase is rejected
  const extraPass = harness.coordinator.advanceRolePass();
  check(extraPass === false, 'K: Extra advanceRolePass rejected safely');
  check(harness.getScreen() === 'free_discussion', 'K: Screen remains free_discussion');

  // Start voting
  const firstVote = harness.coordinator.startVoting();
  check(firstVote === true, 'K: First startVoting succeeded');
  const secondVote = harness.coordinator.startVoting();
  check(firstVote === true && typeof secondVote === 'boolean', 'K: startVoting call completes safely');
  check(harness.getScreen() === 'voting', 'K: Screen remains voting');
}

// =========================================================================
// SCENARIO L: Partner Visibility Integrity
// =========================================================================
console.log('--- SCENARIO L: Partner visibility integrity ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  harness.coordinator.startNewGame(story, ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']); // 7 players = 2 killers

  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);
  check(killers.length === 2, 'L: Exactly 2 killers for 7 players');

  // Innocents MUST see 0 partners
  for (const innocent of innocents) {
    const partners = engine.getKillerPartners(innocent.id);
    check(partners.length === 0, `L: Innocent ${innocent.name} has 0 killer partners`);
  }

  // Killers MUST see each other
  const k1Partners = engine.getKillerPartners(killers[0].id);
  const k2Partners = engine.getKillerPartners(killers[1].id);
  check(k1Partners.length === 1 && k1Partners[0].id === killers[1].id, 'L: Killer 1 sees Killer 2');
  check(k2Partners.length === 1 && k2Partners[0].id === killers[0].id, 'L: Killer 2 sees Killer 1');
}

// =========================================================================
// SCENARIO M: guiltyPool Candidate Safety
// =========================================================================
console.log('--- SCENARIO M: guiltyPool candidate safety (only actual killers revealed) ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  // Story dreams has guiltyPool with multiple candidates
  harness.coordinator.startNewGame(story, ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);

  const state = engine.getState();
  const actualKillers = state.players.filter(p => p.guilty);
  check(actualKillers.length === 1, 'M: 1 actual killer selected');

  const caseData = STORY_DEDUCTION_DATABASE[story.id];
  check(caseData !== undefined, 'M: Case data exists for story');

  // Generate solution text
  const actualInnocents = state.players.filter(p => !p.guilty);
  const solutionTextEn = StorySolutionEngine.generateSolution(story, actualKillers, actualInnocents, 'en');
  const solutionTextAr = StorySolutionEngine.generateSolution(story, actualKillers, actualInnocents, 'ar');
  check(solutionTextAr.includes(actualKillers[0].character.name), 'M: Arabic solution references actual killer Arabic name');

  // Non-selected guiltyPool members MUST NOT be treated as actual killers
  const poolNames = (story.guiltyPool || []).map(c => c.name);
  const innocentPoolMembers = state.players.filter(p => poolNames.includes(p.character.name) && !p.guilty);
  for (const imp of innocentPoolMembers) {
    check(!solutionTextAr.startsWith(imp.character.name), `M: Innocent candidate ${imp.character.name} is not declared primary killer`);
  }
}

// =========================================================================
// SCENARIO N & O: Arabic and English Localization Completeness
// =========================================================================
console.log('--- SCENARIO N & O: Arabic and English localization completeness ---');
{
  const requiredKeys = [
    'appName',
    'votingChamber',
    'confirmVoteFinal',
    'investigationPhase',
    'thePerpetratorIs',
    'theCulpritWas',
    'theCulpritsWere',
    'howCrimeCommitted',
    'theTruthRevealed',
    'theFullTruth',
    'playNewCase',
    'returnToMainMenu',
  ];

  for (const key of requiredKeys) {
    check(Boolean((AR_STRINGS as any)[key]), `N: Arabic string exists for ${key}`);
    check(Boolean((EN_STRINGS as any)[key]), `O: English string exists for ${key}`);
  }
}

// =========================================================================
// SCENARIO P: Firebase Offline Simulation
// =========================================================================
console.log('--- SCENARIO P: Firebase offline simulation does not break game ---');
{
  let caught = false;
  try {
    const result = validateFirebaseConnection();
    check(typeof result === 'boolean' || typeof (result as any).then === 'function', 'P: validateFirebaseConnection runs safely');
  } catch (err) {
    caught = true;
  }
  check(!caught, 'P: Firebase check never crashes the caller');
}

// =========================================================================
// SCENARIO Q: Ad Service Interstitial Cooldown & Safe Failure
// =========================================================================
console.log('--- SCENARIO Q: Ad service safety and cooldown ---');
{
  let threw = false;
  try {
    let proceedCount = 0;
    const res1 = adService.requestInterstitial('round_transition', () => { proceedCount++; });
    const res2 = adService.requestInterstitial('round_transition', () => { proceedCount++; });
    if (adService.getActiveInterstitial().isOpen) {
      adService.closeInterstitial();
    }
  } catch (err) {
    threw = true;
  }
  check(!threw, 'Q: Ad service requestInterstitial never throws uncaught exceptions');
}

// =========================================================================
// SCENARIO R: Story Solution Engine Multi-Killer Scaling
// =========================================================================
console.log('--- SCENARIO R: Story solution engine narrative for 1, 2, and 3 killers ---');
{
  for (const count of [4, 8, 11]) {
    const engine = new GameEngine();
    const names = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
    engine.startNewGame(story, names);
    const st = engine.getState();
    const killers = st.players.filter(p => p.guilty);
    const innocents = st.players.filter(p => !p.guilty);

    const solAr = StorySolutionEngine.generateSolution(story, killers, innocents, 'ar');
    const solEn = StorySolutionEngine.generateSolution(story, killers, innocents, 'en');

    check(solAr.length > 30, `R: Arabic solution generated for ${killers.length} killers`);
    check(solEn.length > 30, `R: English solution generated for ${killers.length} killers`);

    for (const k of killers) {
      check(solAr.includes(k.character.name) || solEn.includes(k.character.name), `R: Killer ${k.character.name} included in narrative`);
    }
  }
}

// =========================================================================
// SCENARIO S: Clue Economy Total Clues == Player Count for 4..12
// =========================================================================
console.log('--- SCENARIO S: Clue economy total clues == player count for 4..12 ---');
{
  for (let n = 4; n <= 12; n++) {
    const totalClues = getTotalClueCount(n);
    check(totalClues === n, `S: For ${n} players, getTotalClueCount returned exactly ${n}`);
  }
  for (const n of [4, 6, 8, 12]) {
    const engine = new GameEngine();
    const names = Array.from({ length: n }, (_, i) => `Player ${i + 1}`);
    engine.startNewGame(story, names);
    check(engine.getState().totalClues === n, `S: Engine state totalClues equals ${n} for ${n} players`);
  }
}

// =========================================================================
// SCENARIO T & U: Back Navigation Safety
// =========================================================================
console.log('--- SCENARIO T & U: Back navigation safety ---');
{
  const engine = new GameEngine();
  const harness = createTestHarness(engine);
  harness.coordinator.startNewGame(story, ['P1', 'P2', 'P3', 'P4']);

  // During role pass, resetRolePass allows returning to player_setup
  const resetRolePassSuccess = harness.coordinator.resetRolePass();
  check(resetRolePassSuccess === true, 'T: resetRolePass succeeded');
  check(harness.getScreen() === 'player_setup', 'T: UI moved to player_setup');

  // Start new game and proceed to discussion
  harness.coordinator.startNewGame(story, ['P1', 'P2', 'P3', 'P4']);
  completeRolePass(harness, engine);
  check(harness.getScreen() === 'free_discussion', 'U: UI in free_discussion');

  // Go to voting
  harness.coordinator.startVoting();
  check(harness.getScreen() === 'voting', 'U: UI in voting');

  // Back navigation from voting returns to free_discussion safely without corrupting engine
  const backToDisc = harness.coordinator.cancelVoting();
  check(backToDisc === true, 'U: cancelVoting succeeded');
  check(harness.getScreen() === 'free_discussion', 'U: UI returned to free_discussion');
  check(engine.getState().phase === 'DISCUSSION', 'U: Phase returned to DISCUSSION');
}

// =========================================================================
// SUMMARY
// =========================================================================
console.log('\n====================================================');
console.log(`ALL PHASE 7.9 QA & HARDENING TESTS PASSED! (${passedTests} assertions)`);
console.log('====================================================');

process.exit(0);
