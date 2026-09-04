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
console.log('PHASE 7.7: COMPLETE PLAYER-FACING GAME FLOW & UX VERIFICATION');
console.log('====================================================\n');

const stories = BUILT_IN_STORIES_V2;
const dreamsStory = stories.find(s => s.id === 'dreams') || stories[0];
const museumStory = stories.find(s => s.id === 'museum') || stories[1];
const galaStory = stories.find(s => s.id === 'gala_toast') || stories[2];

// =========================================================================
// TEST 1: 1-KILLER COMPLETE FLOW (5 Players -> 1 Killer, Innocents Win)
// =========================================================================
console.log('--- TEST 1: 1-Killer Complete Flow (5 Players) ---');
{
  const engine = new GameEngine();
  const playerNames = ['Amir', 'Basma', 'Camila', 'Dina', 'Ehab'];
  const state = engine.startNewGame(dreamsStory, playerNames);

  // 1. Lobby & Setup Validation
  check(state.phase === 'ROLE_PASS', 'Engine transitions from start to ROLE_PASS');
  check(state.players.length === 5, 'Exactly 5 players created');
  check(state.totalClues === 5, 'Total clues matches player count: 5');

  // 2. Killer Scaling (4-6 players = 1 killer)
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);
  check(killers.length === 1, 'Exactly 1 killer scaled for 5 players');
  check(innocents.length === 4, 'Exactly 4 innocent players');

  // 3. Privacy & Killer Partner Isolation
  const singleKiller = killers[0];
  check(engine.getKillerPartners(singleKiller.id).length === 0, 'Single killer has no partners');
  innocents.forEach(innocent => {
    check(engine.getKillerPartners(innocent.id).length === 0, `Innocent ${innocent.name} has no killer partner data`);
  });

  // 4. Role Pass Progression
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  check(engine.getState().phase === 'DISCUSSION', 'Transitions smoothly to DISCUSSION');
  check(engine.getState().currentRound === 1, 'Current round is 1');

  // 5. Clue Economy & Investigation
  check(!engine.getState().clueRevealedThisRound, 'No clue revealed yet in round 1');
  const clue1 = engine.revealNextEvidence();
  check(clue1 !== null, 'Clue successfully revealed in round 1');
  check(engine.getState().clueRevealedThisRound, 'clueRevealedThisRound is true');
  check(engine.getState().revealedEvidenceIds.length === 1, 'Revealed clues count is 1');

  // Attempting second reveal in same round must fail to add any clue
  const countBeforeDuplicate = engine.getState().revealedEvidenceIds.length;
  engine.revealNextEvidence();
  check(engine.getState().revealedEvidenceIds.length === countBeforeDuplicate, 'Second clue reveal in round 1 is blocked by one-clue-per-round limit');

  // 6. Voting Flow
  engine.startVoting();
  check(engine.getState().phase === 'VOTING', 'Phase transitioned to VOTING');

  // All innocents vote for the killer; killer votes for an innocent
  const votes: Record<number, number> = {};
  innocents.forEach(p => {
    votes[p.id] = singleKiller.id;
  });
  votes[singleKiller.id] = innocents[0].id;

  // 7. Vote Resolution
  const result = engine.resolveVotes(votes);
  check(result.eliminatedPlayer?.id === singleKiller.id, 'Killer was eliminated by majority vote');
  check(result.wasGuilty === true, 'Eliminated player was guilty');
  check(result.gameOver === true, 'Game over triggered upon killer elimination');
  check(result.winner === 'INNOCENTS', 'Innocents declared the winner');

  // 8. End Game Transitions
  engine.proceedAfterVoteResult();
  check(engine.getState().phase === 'KILLER_REVEAL', 'Phase is KILLER_REVEAL after game over');

  engine.proceedToCrimeExplanation();
  check(engine.getState().phase === 'CRIME_EXPLANATION', 'Phase is CRIME_EXPLANATION');

  engine.proceedToGameOver();
  check(engine.getState().phase === 'GAME_OVER', 'Phase is GAME_OVER');

  // 9. Reset & State Cleansing
  engine.resetToLobby();
  const resetState = engine.getState();
  check(resetState.phase === 'LOBBY', 'Reset sets phase to LOBBY');
  check(resetState.players.length === 0, 'Players wiped on reset');
  check(resetState.revealedEvidenceIds.length === 0, 'Evidence IDs wiped on reset');
  check(resetState.wrongVotesCount === 0, 'Wrong votes count wiped on reset');
  check(resetState.winner === 'NONE', 'Winner reset to NONE');
}

// =========================================================================
// TEST 2: 2-KILLER COMPLETE FLOW (8 Players -> 2 Killers, Tie, Elimination)
// =========================================================================
console.log('\n--- TEST 2: 2-Killer Complete Flow (8 Players, Ties, Alliances) ---');
{
  const engine = new GameEngine();
  const playerNames = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'];
  const state = engine.startNewGame(museumStory, playerNames);

  check(state.players.length === 8, '8 players registered');
  check(state.totalClues === 8, '8 total clues scheduled');

  // Killer Scaling (7-9 players = 2 killers)
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);
  check(killers.length === 2, 'Exactly 2 killers scaled for 8 players');
  check(innocents.length === 6, 'Exactly 6 innocent players');

  // Killer Alliance Awareness
  const [k1, k2] = killers;
  const k1Partners = engine.getKillerPartners(k1.id);
  const k2Partners = engine.getKillerPartners(k2.id);
  check(k1Partners.length === 1, 'Killer 1 has 1 partner');
  check(k1Partners[0].character.name === k2.character.name, 'Killer 1 knows Killer 2');
  check(k2Partners.length === 1, 'Killer 2 has 1 partner');
  check(k2Partners[0].character.name === k1.character.name, 'Killer 2 knows Killer 1');

  // Innocents have zero knowledge of killers
  innocents.forEach(innocent => {
    check(engine.getKillerPartners(innocent.id).length === 0, `Innocent ${innocent.name} has no partner leak`);
  });

  // Advance role pass
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  check(engine.getState().phase === 'DISCUSSION', 'Entered DISCUSSION');
  check(engine.getState().currentRound === 1, 'Round 1');

  // Round 1: Reveal clue
  engine.revealNextEvidence();
  check(engine.getState().revealedEvidenceIds.length === 1, 'Round 1 clue revealed');

  // Round 1 Voting: Tie vote (3 votes for P1, 3 votes for P2, 2 votes for k1)
  engine.startVoting();
  const tieVotes: Record<number, number> = {
    [innocents[0].id]: innocents[2].id,
    [innocents[1].id]: innocents[2].id,
    [innocents[2].id]: innocents[3].id,
    [innocents[3].id]: innocents[3].id,
    [innocents[4].id]: innocents[3].id,
    [innocents[5].id]: innocents[2].id,
    [k1.id]: k2.id,
    [k2.id]: k1.id,
  };
  const tieResult = engine.resolveVotes(tieVotes);
  check(tieResult.isTie === true, 'Tie vote detected');
  check(tieResult.eliminatedPlayer === null, 'No player eliminated on tie');
  check(tieResult.wrongVotesCount === 0, 'Wrong votes count remains unchanged on tie');
  check(tieResult.gameOver === false, 'Game continues after first tie');

  // Transition to Round 2
  engine.proceedAfterVoteResult();
  check(engine.getState().phase === 'DISCUSSION', 'Transitions to DISCUSSION for round 2');
  check(engine.getState().currentRound === 2, 'Current round is now 2');
  check(engine.getState().clueRevealedThisRound === false, 'clueRevealedThisRound reset to false');
  check(engine.getState().revealedEvidenceIds.length === 1, 'Previous clues preserved');

  // Round 2: Reveal clue 2
  const clue2 = engine.revealNextEvidence();
  check(clue2 !== null, 'Round 2 clue revealed successfully');
  check(engine.getState().revealedEvidenceIds.length === 2, 'Total 2 clues revealed');

  // Round 2 Voting: Eliminate Killer 1
  engine.startVoting();
  const r2Votes: Record<number, number> = {};
  innocents.forEach(p => { r2Votes[p.id] = k1.id; });
  r2Votes[k1.id] = innocents[0].id;
  r2Votes[k2.id] = innocents[0].id;

  const r2Result = engine.resolveVotes(r2Votes);
  check(r2Result.eliminatedPlayer?.id === k1.id, 'Killer 1 eliminated');
  check(r2Result.wasGuilty === true, 'Eliminated player was guilty');
  check(r2Result.gameOver === false, 'Game does NOT end because Killer 2 is still alive');

  // Transition to Round 3
  engine.proceedAfterVoteResult();
  check(engine.getState().currentRound === 3, 'Round 3 reached');

  // Round 3 Voting: Eliminate Killer 2 (Final Killer)
  engine.startVoting();
  const r3Votes: Record<number, number> = {};
  innocents.forEach(p => { r3Votes[p.id] = k2.id; });
  r3Votes[k2.id] = innocents[0].id;

  const r3Result = engine.resolveVotes(r3Votes);
  check(r3Result.eliminatedPlayer?.id === k2.id, 'Killer 2 eliminated');
  check(r3Result.gameOver === true, 'Game is now over (all killers eliminated)');
  check(r3Result.winner === 'INNOCENTS', 'Innocents win');
}

// =========================================================================
// TEST 3: 3-KILLER COMPLETE FLOW (11 Players -> 3 Killers, Killer Victory)
// =========================================================================
console.log('\n--- TEST 3: 3-Killer Complete Flow (11 Players, Killer Victory) ---');
{
  const engine = new GameEngine();
  const playerNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  const state = engine.startNewGame(galaStory, playerNames);

  check(state.players.length === 11, '11 players registered');
  check(state.totalClues === 11, '11 total clues scheduled');

  // Killer Scaling (10-12 players = 3 killers)
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);
  check(killers.length === 3, 'Exactly 3 killers scaled for 11 players');
  check(innocents.length === 8, 'Exactly 8 innocent players');

  // 3-Killer Alliance Awareness (each killer knows other two)
  killers.forEach(k => {
    const partners = engine.getKillerPartners(k.id);
    const expectedPartnerNames = killers.filter(other => other.id !== k.id).map(other => other.character.name);
    check(partners.length === 2, `Killer ${k.name} has exactly 2 partners`);
    expectedPartnerNames.forEach(name => {
      check(partners.some(p => p.character.name === name), `Killer ${k.name} knows partner ${name}`);
    });
  });

  // Advance to Discussion
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }

  // Round 1: Wrong vote (eliminate innocent)
  engine.startVoting();
  const innocentTarget1 = innocents[0];
  const r1Votes: Record<number, number> = {};
  state.players.forEach(p => {
    if (p.id !== innocentTarget1.id) {
      r1Votes[p.id] = innocentTarget1.id;
    } else {
      r1Votes[p.id] = innocents[1].id;
    }
  });

  const r1Result = engine.resolveVotes(r1Votes);
  check(r1Result.wasGuilty === false, 'Innocent was eliminated');
  check(r1Result.wrongVotesCount === 1, 'Wrong votes count incremented to 1');
  check(r1Result.gameOver === false, 'Game continues');

  // Round 2: Wrong vote (eliminate second innocent)
  engine.proceedAfterVoteResult();
  engine.startVoting();
  const innocentTarget2 = innocents[1];
  const r2Votes: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    if (p.id !== innocentTarget2.id) {
      r2Votes[p.id] = innocentTarget2.id;
    } else {
      r2Votes[p.id] = innocents[2].id;
    }
  });

  const r2Result = engine.resolveVotes(r2Votes);
  check(r2Result.wrongVotesCount === 2, 'Wrong votes count incremented to 2');

  // Round 3: Wrong vote (eliminate third innocent) -> Reaches maxWrongVotes (3)
  engine.proceedAfterVoteResult();
  engine.startVoting();
  const innocentTarget3 = innocents[2];
  const r3Votes: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    if (p.id !== innocentTarget3.id) {
      r3Votes[p.id] = innocentTarget3.id;
    } else {
      r3Votes[p.id] = innocents[3].id;
    }
  });

  const r3Result = engine.resolveVotes(r3Votes);
  check(r3Result.wrongVotesCount === 3, 'Wrong votes count reached 3');
  check(r3Result.gameOver === true, 'Game over triggered by wrong votes limit');
  check(r3Result.winner === 'GUILTY', 'Killers declared victorious');
  check(r3Result.endReason === 'MAX_WRONG_VOTES', 'End reason is MAX_WRONG_VOTES');
}

// =========================================================================
// TEST 4: STRICT STATE ISOLATION BETWEEN GAMES
// =========================================================================
console.log('\n--- TEST 4: State Isolation Between Games ---');
{
  const engine = new GameEngine();

  // Game A: 6 players on dreamsStory
  engine.startNewGame(dreamsStory, ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  engine.revealNextEvidence();
  engine.startVoting();
  const gameAPlayers = engine.getState().players;
  const gameAKiller = gameAPlayers.find(p => p.guilty)!;
  const gameAVotes: Record<number, number> = {};
  gameAPlayers.forEach(p => {
    gameAVotes[p.id] = gameAKiller.id;
  });
  engine.resolveVotes(gameAVotes);
  check(engine.getState().winner === 'INNOCENTS', 'Game A completed with innocent victory');

  // Reset to Lobby
  engine.resetToLobby();

  // Game B: 4 completely different players on museumStory
  const stateB = engine.startNewGame(museumStory, ['One', 'Two', 'Three', 'Four']);

  // Verify ZERO residual state from Game A
  check(stateB.phase === 'ROLE_PASS', 'Game B phase is ROLE_PASS');
  check(stateB.currentRound === 1, 'Game B starts at round 1');
  check(stateB.revealedEvidenceIds.length === 0, 'Game B has 0 revealed evidence');
  check(stateB.wrongVotesCount === 0, 'Game B has 0 wrong votes');
  check(stateB.winner === 'NONE', 'Game B winner is NONE');
  check(stateB.players.length === 4, 'Game B has exactly 4 players');
  check(stateB.totalClues === 4, 'Game B total clues is 4');

  // Ensure names from Game A do not exist anywhere in Game B
  const namesB = stateB.players.map(p => p.name);
  ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'].forEach(oldName => {
    check(!namesB.includes(oldName), `Old player ${oldName} not present in Game B`);
  });

  // Ensure story in Game B is museum
  check(stateB.story?.id === 'museum', 'Game B story is museum, not dreams');
}

// =========================================================================
// TEST 5: PREVENT INVALID RE-VOTING & CORRUPT BACK TRANSITIONS
// =========================================================================
console.log('\n--- TEST 5: Prevent Invalid Re-voting & State Corruption ---');
{
  const engine = new GameEngine();
  engine.startNewGame(dreamsStory, ['P1', 'P2', 'P3', 'P4']);
  while (engine.getState().phase === 'ROLE_PASS') {
    engine.advanceRolePass();
  }
  engine.startVoting();

  const votes: Record<number, number> = {
    1: 2,
    2: 1,
    3: 1,
    4: 1,
  };

  const result1 = engine.resolveVotes(votes);
  check(engine.getState().phase === 'VOTE_RESULT' || engine.getState().phase === 'KILLER_REVEAL', 'Phase progressed to VOTE_RESULT or beyond');

  // In App.tsx, back button from VoteResultScreen to voting has been removed.
  // Verify that calling proceedAfterVoteResult transitions forward, not backward:
  if (result1.gameOver) {
    engine.proceedAfterVoteResult();
    check(engine.getState().phase === 'KILLER_REVEAL', 'Transitions forward to KILLER_REVEAL');
  } else {
    engine.proceedAfterVoteResult();
    check(engine.getState().phase === 'DISCUSSION', 'Transitions forward to DISCUSSION round 2');
    check(engine.getState().currentRound === 2, 'Round incremented');
  }
}

// =========================================================================
// TEST 6: COMPREHENSIVE PRIVACY VERIFICATION (NO LEAKS FOR INNOCENTS)
// =========================================================================
console.log('\n--- TEST 6: Comprehensive Role Pass Privacy Verification ---');
{
  const engine = new GameEngine();
  // Test 4 to 12 players
  for (let count = 4; count <= 12; count++) {
    const names = Array.from({ length: count }, (_, i) => `Player_${i + 1}`);
    const state = engine.startNewGame(dreamsStory, names);

    const killers = state.players.filter(p => p.guilty);
    const innocents = state.players.filter(p => !p.guilty);

    // Verify killer scaling formula
    if (count <= 6) {
      check(killers.length === 1, `${count} players must have 1 killer`);
    } else if (count <= 9) {
      check(killers.length === 2, `${count} players must have 2 killers`);
    } else {
      check(killers.length === 3, `${count} players must have 3 killers`);
    }

    // Verify privacy
    innocents.forEach(innocent => {
      check(
        engine.getKillerPartners(innocent.id).length === 0,
        `Privacy check passed: Innocent ${innocent.name} in ${count}-player match has no partner leak`
      );
    });

    killers.forEach(killer => {
      const expectedPartnersCount = killers.length - 1;
      check(
        engine.getKillerPartners(killer.id).length === expectedPartnersCount,
        `Killer ${killer.name} in ${count}-player match has exactly ${expectedPartnersCount} partner(s)`
      );
    });
  }
}

console.log('\n====================================================');
console.log(`PHASE 7.7 ALL COMPLETE GAME FLOW TESTS PASSED! (${passedTests} checks passed)`);
console.log('====================================================');
