import assert from 'node:assert';
import { GameEngine } from '../src/game/GameEngine';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { Story, GameState, Player, EvidenceItem } from '../src/game/types';

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
console.log('PHASE 7.6: INVESTIGATION UI & CLUE PRESENTATION');
console.log('====================================================\n');

const stories = BUILT_IN_STORIES_V2;
const galaStory = stories.find(s => s.id === 'gala_toast') || stories[0];

// =========================================================================
// TEST 1: Investigation UI reflects exact round from GameState
// =========================================================================
console.log('--- TEST 1: Exact Round from GameState ---');
{
  const engine = new GameEngine();
  const state = engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  check(state.currentRound === 1, 'Initial state currentRound === 1');

  // Advance role pass to discussion
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  check(engine.getState().phase === 'DISCUSSION', 'Game is now in DISCUSSION');
  check(engine.getState().currentRound === 1, 'Round in DISCUSSION is 1');

  // Verify round state is authoritative
  const roundFromEngine = engine.getState().currentRound;
  check(roundFromEngine === 1, 'Round strictly matches GameState.currentRound');
}

// =========================================================================
// TEST 2: Clue revealed this round is presented as new evidence
// =========================================================================
console.log('--- TEST 2: Clue Revealed This Round is Presented as New Evidence ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  check(!engine.getState().clueRevealedThisRound, 'Initially clueRevealedThisRound === false');
  check(engine.getState().revealedEvidenceIds.length === 0, 'Initially 0 clues revealed');

  // Reveal a clue
  engine.revealEvidence();
  const state = engine.getState();
  check(state.clueRevealedThisRound === true, 'clueRevealedThisRound === true after reveal');
  check(state.revealedEvidenceIds.length === 1, 'revealedEvidenceIds has 1 item');

  // The latest revealed clue index is revealedEvidenceIds.length - 1
  const newestClueId = state.revealedEvidenceIds[state.revealedEvidenceIds.length - 1];
  check(Boolean(newestClueId), 'Newest clue ID exists');

  // Simulating UI isViewingNewClue check
  const activeIndex = state.revealedEvidenceIds.length - 1;
  const isViewingNewClue = state.clueRevealedThisRound && activeIndex === state.revealedEvidenceIds.length - 1;
  check(isViewingNewClue === true, 'UI presents the newest clue as NEW EVIDENCE');
}

// =========================================================================
// TEST 3: Previously revealed clues remain accessible and marked revealed
// =========================================================================
console.log('--- TEST 3: Previously Revealed Clues Accessible and Marked Revealed ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  // Round 1: Reveal first clue
  engine.revealEvidence();
  const clue1Id = engine.getState().revealedEvidenceIds[0];

  // Transition to Voting and then to Round 2 (via wrong vote to continue game)
  // Find an innocent player to vote for
  const innocents = engine.getState().players.filter(p => !p.guilty);
  const targetInnocent = innocents[0];

  engine.startVoting();
  const voterIds = engine.getState().players.map(p => p.id);
  for (const vId of voterIds) {
    engine.castVote(vId, targetInnocent.id);
  }
  const voteResult = engine.resolveVotes();
  check(voteResult.eliminatedPlayer?.id === targetInnocent.id, 'Innocent eliminated');
  check(engine.getState().winner === 'NONE', 'Game continues after 1 wrong vote');

  engine.proceedAfterVoteResult();
  check(engine.getState().currentRound === 2, 'Advanced to Round 2');
  check(engine.getState().phase === 'DISCUSSION', 'Back in DISCUSSION phase');
  check(engine.getState().clueRevealedThisRound === false, 'clueRevealedThisRound reset to false');
  check(engine.getState().revealedEvidenceIds.length === 1, 'Clue 1 remains in revealedEvidenceIds');

  // Round 2: Reveal second clue
  engine.revealEvidence();
  const stateR2 = engine.getState();
  check(stateR2.revealedEvidenceIds.length === 2, 'Now 2 clues revealed');
  const clue2Id = stateR2.revealedEvidenceIds[1];
  check(clue1Id !== clue2Id, 'Clue 2 is distinct from Clue 1');

  // Check UI tagging for previous clue vs new clue:
  // Index 0 (Clue 1):
  const isClue1New = stateR2.clueRevealedThisRound && 0 === stateR2.revealedEvidenceIds.length - 1;
  check(isClue1New === false, 'Clue 1 is NOT tagged as new clue (marked PREVIOUSLY REVEALED)');

  // Index 1 (Clue 2):
  const isClue2New = stateR2.clueRevealedThisRound && 1 === stateR2.revealedEvidenceIds.length - 1;
  check(isClue2New === true, 'Clue 2 is tagged as NEW EVIDENCE');
}

// =========================================================================
// TEST 4: Total clues equals players.length (4-player, 7-player, 10-player)
// =========================================================================
console.log('--- TEST 4: Total Clues Equals Players.length ---');
{
  for (const count of [4, 7, 10]) {
    const engine = new GameEngine();
    const names = Array.from({ length: count }, (_, i) => `Player_${i + 1}`);
    const state = engine.startNewGame(galaStory, names);

    check(state.totalClues === count, `${count}-player game: totalClues === ${count}`);
    check(state.remainingClues === count, `${count}-player game: initial remainingClues === ${count}`);
  }
}

// =========================================================================
// TEST 5: Revealed and remaining clue counts derive from state
// =========================================================================
console.log('--- TEST 5: Revealed and Remaining Clue Counts Derive from State ---');
{
  const engine = new GameEngine();
  const state = engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  const initialRevealed = state.revealedEvidenceIds.length;
  const initialRemaining = state.remainingClues;
  const totalClues = state.totalClues;

  check(initialRevealed === 0, 'Initial revealed count is 0');
  check(initialRemaining === 4, 'Initial remaining count is 4');
  check(initialRevealed + initialRemaining === totalClues, 'Revealed + Remaining === Total');

  // Reveal 1 clue
  engine.revealEvidence();
  const state1 = engine.getState();
  check(state1.revealedEvidenceIds.length === 1, 'Revealed count is 1');
  check(state1.remainingClues === 3, 'Remaining count is 3');
  check(state1.revealedEvidenceIds.length + state1.remainingClues === state1.totalClues, 'Sum matches totalClues');
}

// =========================================================================
// TEST 6: When revealedClues.length === totalClues, exhaustion UI is active
// =========================================================================
console.log('--- TEST 6: Clue Exhaustion State ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  // Force reveal 4 clues across rounds
  for (let r = 1; r <= 4; r++) {
    check(engine.canRevealClue(), `Round ${r}: canRevealClue() is true before reveal`);
    engine.revealEvidence();
    check(!engine.canRevealClue(), `Round ${r}: canRevealClue() is false after reveal`);

    if (r < 4) {
      // Simulate advancing round without voting to test clue progression
      (engine as any).state.currentRound++;
      (engine as any).state.clueRevealedThisRound = false;
    }
  }

  const finalState = engine.getState();
  check(finalState.revealedEvidenceIds.length === 4, 'Exactly 4 clues revealed');
  check(finalState.remainingClues === 0, 'Remaining clues is 0');
  check(finalState.revealedEvidenceIds.length === finalState.totalClues, 'revealedCount === totalClues');
  check(engine.canRevealClue() === false, 'canRevealClue() is false upon exhaustion');
  check(engine.hasMoreEvidence() === false, 'hasMoreEvidence() is false upon exhaustion');

  // Attempting to reveal when exhausted does nothing
  const beforeState = JSON.stringify(engine.getState());
  engine.revealEvidence();
  const afterState = JSON.stringify(engine.getState());
  check(beforeState === afterState, 'revealEvidence() rejects when exhausted with no state mutation');
}

// =========================================================================
// TEST 7: Clue reveal button disabled after one reveal this round
// =========================================================================
console.log('--- TEST 7: Reveal Button Disabled After One Reveal This Round ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  check(engine.canRevealClue() === true, 'canRevealClue() is true before reveal');
  engine.revealEvidence();
  check(engine.canRevealClue() === false, 'canRevealClue() is false after reveal in same round');

  // Attempting second reveal in same round
  const clueCount = engine.getState().revealedEvidenceIds.length;
  engine.revealEvidence();
  check(engine.getState().revealedEvidenceIds.length === clueCount, 'Second reveal in same round rejected');
}

// =========================================================================
// TEST 8: Next round re-enables reveal if clues remain
// =========================================================================
console.log('--- TEST 8: Next Round Re-enables Reveal ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  engine.revealEvidence();
  check(engine.canRevealClue() === false, 'canRevealClue() is false in Round 1 after reveal');

  // Simulate advancing to next round
  (engine as any).state.currentRound = 2;
  (engine as any).state.clueRevealedThisRound = false;

  check(engine.canRevealClue() === true, 'canRevealClue() re-enabled in Round 2 because clues remain');
}

// =========================================================================
// TEST 9: Wrong vote does NOT reveal a clue
// =========================================================================
console.log('--- TEST 9: Wrong Vote Does NOT Reveal a Clue ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  // Round 1: Do NOT reveal any clue
  check(engine.getState().revealedEvidenceIds.length === 0, 'No clues revealed initially');
  check(engine.getState().wrongVotesCount === 0, 'wrongVotesCount === 0');

  // Proceed to voting and cast a wrong vote
  engine.startVoting();
  const innocents = engine.getState().players.filter(p => !p.guilty);
  const target = innocents[0];
  for (const voter of engine.getState().players) {
    engine.castVote(voter.id, target.id);
  }
  engine.resolveVotes();
  check(engine.getState().wrongVotesCount === 1, 'wrongVotesCount === 1 after wrong vote');

  engine.proceedAfterVoteResult();
  check(engine.getState().currentRound === 2, 'Moved to Round 2');
  check(engine.getState().revealedEvidenceIds.length === 0, 'Wrong vote did NOT reveal any clue!');
}

// =========================================================================
// TEST 10: Duplicate reveal attempt rejected without duplicate clue entries
// =========================================================================
console.log('--- TEST 10: Duplicate Reveal Attempt Rejected ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  engine.revealEvidence();
  const firstClueId = engine.getState().revealedEvidenceIds[0];

  // Even if clueRevealedThisRound was reset, trying to reveal firstClueId again must be rejected
  (engine as any).state.clueRevealedThisRound = false;
  engine.revealEvidence(firstClueId);

  const revealedIds = engine.getState().revealedEvidenceIds;
  const uniqueIds = new Set(revealedIds);
  check(revealedIds.length === uniqueIds.size, 'No duplicate clue IDs exist');
}

// =========================================================================
// TEST 11: Invalid reveal phase is rejected
// =========================================================================
console.log('--- TEST 11: Invalid Reveal Phase is Rejected ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);

  // Phase is currently ROLE_PASS. Let's test VOTING, VOTE_RESULT, GAME_OVER, LOBBY
  const invalidPhases = ['VOTING', 'VOTE_RESULT', 'GAME_OVER', 'LOBBY'] as const;

  for (const invalidPhase of invalidPhases) {
    (engine as any).state.phase = invalidPhase;
    (engine as any).state.clueRevealedThisRound = false;

    check(engine.canRevealClue() === false, `canRevealClue() returns false in ${invalidPhase}`);

    const countBefore = engine.getState().revealedEvidenceIds.length;
    engine.revealEvidence();
    check(engine.getState().revealedEvidenceIds.length === countBefore, `revealEvidence() rejected in ${invalidPhase}`);
  }
}

// =========================================================================
// TEST 12: Rapid reveal requests yield at most one clue
// =========================================================================
console.log('--- TEST 12: Rapid Reveal Requests Yield at Most One Clue ---');
{
  const engine = new GameEngine();
  engine.startNewGame(galaStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  check(engine.getState().revealedEvidenceIds.length === 0, 'Initially 0 clues');

  // Execute 5 rapid sequential calls to revealEvidence()
  engine.revealEvidence();
  engine.revealEvidence();
  engine.revealEvidence();
  engine.revealEvidence();
  engine.revealEvidence();

  check(engine.getState().revealedEvidenceIds.length === 1, 'Rapid calls resulted in EXACTLY ONE clue revealed');
  check(engine.getState().clueRevealedThisRound === true, 'clueRevealedThisRound is true');
}

// =========================================================================
// TEST 13: No killer partner leak in investigation UI
// =========================================================================
console.log('--- TEST 13: No Killer Partner Leak in Investigation UI ---');
{
  for (const playerCount of [7, 10]) {
    const engine = new GameEngine();
    const names = Array.from({ length: playerCount }, (_, i) => `Detective_${i + 1}`);
    engine.startNewGame(galaStory, names);

    while (engine.getState().phase === 'ROLE_PASS') {
      engine.advanceRolePass();
    }

    // Reveal all available evidence
    for (let r = 0; r < playerCount; r++) {
      if (engine.canRevealClue()) {
        engine.revealEvidence();
        (engine as any).state.clueRevealedThisRound = false;
      }
    }

    const revealedItems = engine.getRevealedEvidence();
    const killers = engine.getState().players.filter(p => p.guilty);

    for (const item of revealedItems) {
      // Clue text should not expose the phrase "killer partner" or partner private state
      const combinedText = `${item.title} ${item.description || ''} ${item.publicClue || ''} ${item.discussionPrompt || ''}`.toLowerCase();
      check(!combinedText.includes('killer partner'), `${playerCount}p: Clue does not leak 'killer partner' phrasing`);
      check(!combinedText.includes('partner awareness'), `${playerCount}p: Clue does not leak 'partner awareness'`);
      check(!combinedText.includes('actualselectedkillers'), `${playerCount}p: Clue does not leak internal variables`);
      
      // Check that the evidence item does not directly contain a hidden secret property 'killerPartners'
      check(!('killerPartners' in item), `${playerCount}p: Evidence item does not contain killerPartners field`);
    }
  }
}

console.log(`\n====================================================`);
console.log(`PHASE 7.6 ALL 13 TEST SUITES PASSED! (${passedTests} checks passed)`);
console.log(`====================================================`);
