import assert from 'node:assert';
import { GameEngine } from '../src/game/GameEngine';
import { PlayerManager, getKillerPartners } from '../src/game/PlayerManager';
import { ClueEngine, getTotalClueCount } from '../src/game/ClueEngine';
import { StoryEngine } from '../src/game/StoryEngine';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { Story, Player, GameState, VoteResult } from '../src/game/types';

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
console.log('PHASE 7.5: FULL GAMEPLAY INTEGRATION & E2E STABILITY');
console.log('====================================================\n');

const stories = BUILT_IN_STORIES_V2;
check(stories.length >= 13, 'All 13 production stories available');

// =========================================================================
// SECTION 1: E2E Matrix for Player Counts 4 through 12
// =========================================================================
console.log('--- SECTION 1: Player Counts 4 through 12 End-to-End ---');

for (const playerCount of [4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  const expectedKillers = playerCount <= 6 ? 1 : playerCount <= 9 ? 2 : 3;
  const expectedClues = playerCount;
  const story = stories[0]; // gala_toast supports 4-12
  const playerNames = Array.from({ length: playerCount }, (_, i) => `Player_${i + 1}`);

  const engine = new GameEngine();
  const state = engine.startNewGame(story, playerNames);

  // A. Game initializes in ROLE_PASS
  check(state.phase === 'ROLE_PASS', `${playerCount}p: Game starts in ROLE_PASS`);
  check(state.players.length === playerCount, `${playerCount}p: Correct player count`);

  // B. Role allocation & Killer counts
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);
  check(killers.length === expectedKillers, `${playerCount}p: Exactly ${expectedKillers} killers`);
  check(innocents.length === playerCount - expectedKillers, `${playerCount}p: Exactly ${playerCount - expectedKillers} innocents`);

  // C. Partner Logic per player count
  for (const killer of killers) {
    const partners = engine.getKillerPartners(killer.id);
    check(partners.length === expectedKillers - 1, `${playerCount}p: Killer sees ${expectedKillers - 1} partners`);
    check(!partners.some(p => p.id === killer.id), `${playerCount}p: Killer never sees self`);
    check(partners.every(p => p.guilty), `${playerCount}p: All partners are guilty`);
  }

  for (const innocent of innocents) {
    const partners = engine.getKillerPartners(innocent.id);
    check(partners.length === 0, `${playerCount}p: Innocent sees 0 partners`);
  }

  // D. Clue Count & Economy
  check(state.totalClues === expectedClues, `${playerCount}p: totalClues === ${expectedClues}`);
  check(state.remainingClues === expectedClues, `${playerCount}p: remainingClues === ${expectedClues}`);
  check(engine.getAllEvidence().length >= expectedClues, `${playerCount}p: eligibleClues >= totalClues`);

  // E. Complete Role Pass flow simulation
  for (let i = 0; i < playerCount; i++) {
    const viewingPlayer = engine.getCurrentViewingPlayer();
    check(viewingPlayer !== null, `${playerCount}p: viewing player is valid at step ${i}`);
    check(viewingPlayer!.id === i + 1, `${playerCount}p: viewing player id matches sequence`);

    const partners = engine.getCurrentViewingPlayerPartners();
    if (viewingPlayer!.guilty) {
      check(partners.length === expectedKillers - 1, `${playerCount}p: viewing killer receives proper partner count`);
    } else {
      check(partners.length === 0, `${playerCount}p: viewing innocent receives zero partners`);
    }

    engine.advanceRolePass();
  }

  // After all players view role, phase transitions to DISCUSSION
  check(engine.getState().phase === 'DISCUSSION', `${playerCount}p: Transitions to DISCUSSION after role pass`);

  // F. Clue Pacing: exactly 1 clue per round
  check(engine.getState().clueRevealedThisRound === false, `${playerCount}p: clueRevealedThisRound starts false`);
  check(engine.canRevealClue() === true, `${playerCount}p: can reveal clue in round 1`);

  const clue1 = engine.revealNextEvidence();
  check(clue1.clueRevealedThisRound === true, `${playerCount}p: clueRevealedThisRound is true after reveal`);
  check(clue1.revealedEvidenceIds.length === 1, `${playerCount}p: 1 clue revealed`);
  check(clue1.remainingClues === expectedClues - 1, `${playerCount}p: remainingClues decremented`);

  // Attempting second clue in same round must fail / return unmodified state
  check(engine.canRevealClue() === false, `${playerCount}p: canRevealClue() is false after 1st reveal`);
  const clueAttempt2 = engine.revealEvidence();
  check(clueAttempt2.revealedEvidenceIds.length === 1, `${playerCount}p: second reveal blocked in same round`);

  console.log(`  ✓ ${playerCount} Players verified: ${expectedKillers} killer(s), ${expectedClues} clues, partner logic, role pass & pacing.`);
}

// =========================================================================
// SECTION 2: Complete 4-Player Gameplay to Innocent Victory
// =========================================================================
console.log('\n--- SECTION 2: 4-Player Complete Game to Innocent Victory ---');
{
  const engine = new GameEngine();
  engine.startNewGame(stories[0], ['P1', 'P2', 'P3', 'P4']);

  // Complete role pass
  for (let i = 0; i < 4; i++) engine.advanceRolePass();
  check(engine.getState().phase === 'DISCUSSION', '4p: In DISCUSSION phase');

  // Round 1: Reveal clue
  engine.revealNextEvidence();
  check(engine.getState().revealedEvidenceIds.length === 1, '4p: Round 1 clue revealed');

  // Start voting
  engine.startVoting();
  check(engine.getState().phase === 'VOTING', '4p: In VOTING phase');

  // Cast wrong vote (vote for an innocent)
  const killer = engine.getState().players.find(p => p.guilty)!;
  const innocents = engine.getState().players.filter(p => !p.guilty);
  const victim1 = innocents[0];

  const votesRound1: Record<number, number> = {
    [innocents[0].id]: victim1.id,
    [innocents[1].id]: victim1.id,
    [innocents[2].id]: victim1.id,
    [killer.id]: victim1.id
  };

  const res1 = engine.resolveVotes(votesRound1);
  check(res1.wasGuilty === false, '4p: Round 1 eliminated innocent');
  check(res1.wrongVotesCount === 1, '4p: wrongVotesCount incremented to 1');
  check(engine.getState().revealedEvidenceIds.length === 1, '4p: Wrong vote did NOT reveal a clue');
  check(res1.gameOver === false, '4p: Game not over after 1 wrong vote');

  // Advance to Round 2
  engine.proceedAfterVoteResult();
  check(engine.getState().currentRound === 2, '4p: Advanced to round 2');
  check(engine.getState().clueRevealedThisRound === false, '4p: clueRevealedThisRound reset for round 2');

  // Reveal Round 2 clue
  engine.revealNextEvidence();
  check(engine.getState().revealedEvidenceIds.length === 2, '4p: Round 2 clue revealed');

  // Round 2 Voting: Vote for the actual killer
  engine.startVoting();
  const livingVoters = engine.getState().players.filter(p => !p.isEliminated);
  const votesRound2: Record<number, number> = {};
  livingVoters.forEach(v => {
    votesRound2[v.id] = killer.id;
  });

  const res2 = engine.resolveVotes(votesRound2);
  check(res2.wasGuilty === true, '4p: Round 2 eliminated the killer');
  check(res2.gameOver === true, '4p: Game over triggered');
  check(res2.winner === 'INNOCENTS', '4p: Innocents win');
  check(res2.endReason === 'ALL_GUILTY_ELIMINATED', '4p: End reason is ALL_GUILTY_ELIMINATED');

  console.log('  ✓ 4-Player complete game verified: wrong vote penalty, clue integrity, killer eliminated -> innocent victory.');
}

// =========================================================================
// SECTION 3: Multi-Killer Games & Sequential Elimination (7 Players & 10 Players)
// =========================================================================
console.log('\n--- SECTION 3: Sequential Multi-Killer Elimination ---');
{
  // 7-Player: 2 killers (K1, K2). Eliminate K1 -> game continues -> Eliminate K2 -> innocents win.
  const engine7 = new GameEngine();
  engine7.startNewGame(stories[0], ['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  for (let i = 0; i < 7; i++) engine7.advanceRolePass();

  const killers7 = engine7.getState().players.filter(p => p.guilty);
  const [k1, k2] = killers7;

  // Round 1: Eliminate K1
  engine7.startVoting();
  const votesK1: Record<number, number> = {};
  engine7.getState().players.forEach(p => { votesK1[p.id] = k1.id; });
  const resK1 = engine7.resolveVotes(votesK1);

  check(resK1.wasGuilty === true, '7p: K1 was guilty');
  check(resK1.gameOver === false, '7p: Game continues while K2 survives');
  check(resK1.winner === 'NONE', '7p: No winner yet');
  
  // Verify K2 remains guilty and untouched
  const stateAfterK1 = engine7.getState();
  const liveK2 = stateAfterK1.players.find(p => p.id === k2.id)!;
  check(liveK2.guilty === true, '7p: K2 still guilty');
  check(!liveK2.isEliminated, '7p: K2 still alive');

  // Round 2: Eliminate K2
  engine7.proceedAfterVoteResult();
  engine7.startVoting();
  const livingVotersRound2 = engine7.getState().players.filter(p => !p.isEliminated);
  const votesK2: Record<number, number> = {};
  livingVotersRound2.forEach(p => { votesK2[p.id] = k2.id; });
  const resK2 = engine7.resolveVotes(votesK2);

  check(resK2.wasGuilty === true, '7p: K2 was guilty');
  check(resK2.gameOver === true, '7p: Game over after all killers eliminated');
  check(resK2.winner === 'INNOCENTS', '7p: Innocents win');
  check(resK2.endReason === 'ALL_GUILTY_ELIMINATED', '7p: Correct end reason');

  console.log('  ✓ 7-Player 2-killer sequential elimination verified.');
}

{
  // 10-Player: 3 killers (K1, K2, K3).
  // Eliminate K1 -> K2 & K3 remain guilty.
  // Eliminate K2 -> K3 remains guilty.
  // Eliminate K3 -> innocents win.
  const engine10 = new GameEngine();
  engine10.startNewGame(stories[0], ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10']);
  for (let i = 0; i < 10; i++) engine10.advanceRolePass();

  const killers10 = engine10.getState().players.filter(p => p.guilty);
  check(killers10.length === 3, '10p: 3 killers');
  const [k1, k2, k3] = killers10;

  // Eliminate K1
  engine10.startVoting();
  const votesK1: Record<number, number> = {};
  engine10.getState().players.forEach(p => { votesK1[p.id] = k1.id; });
  const resK1 = engine10.resolveVotes(votesK1);
  check(resK1.gameOver === false, '10p: Game continues after K1 elimination');
  check(engine10.getState().players.find(p => p.id === k2.id)!.guilty === true, '10p: K2 remains guilty');
  check(engine10.getState().players.find(p => p.id === k3.id)!.guilty === true, '10p: K3 remains guilty');

  // Eliminate K2
  engine10.proceedAfterVoteResult();
  engine10.startVoting();
  const votesK2: Record<number, number> = {};
  engine10.getState().players.filter(p => !p.isEliminated).forEach(p => { votesK2[p.id] = k2.id; });
  const resK2 = engine10.resolveVotes(votesK2);
  check(resK2.gameOver === false, '10p: Game continues after K2 elimination');
  check(engine10.getState().players.find(p => p.id === k3.id)!.guilty === true, '10p: K3 remains guilty');

  // Eliminate K3
  engine10.proceedAfterVoteResult();
  engine10.startVoting();
  const votesK3: Record<number, number> = {};
  engine10.getState().players.filter(p => !p.isEliminated).forEach(p => { votesK3[p.id] = k3.id; });
  const resK3 = engine10.resolveVotes(votesK3);
  check(resK3.gameOver === true, '10p: Game over after final killer eliminated');
  check(resK3.winner === 'INNOCENTS', '10p: Innocents win');
  check(resK3.endReason === 'ALL_GUILTY_ELIMINATED', '10p: Correct end reason');

  console.log('  ✓ 10-Player 3-killer sequential elimination verified.');
}

// =========================================================================
// SECTION 4: Killer Victory Conditions (Max Wrong Votes & Parity)
// =========================================================================
console.log('\n--- SECTION 4: Killer Victory Conditions ---');
{
  const engine = new GameEngine();
  engine.startNewGame(stories[0], ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);
  for (let i = 0; i < 6; i++) engine.advanceRolePass();

  const maxWrong = engine.getState().maxWrongVotes;
  check(maxWrong >= 2, 'maxWrongVotes is at least 2');

  const killer = engine.getState().players.find(p => p.guilty)!;
  const innocents = engine.getState().players.filter(p => !p.guilty);

  // Perform wrong votes until game over
  let lastRes: VoteResult | null = null;
  for (let round = 1; round <= maxWrong; round++) {
    engine.startVoting();
    const victim = innocents[round - 1];
    const votes: Record<number, number> = {};
    engine.getState().players.filter(p => !p.isEliminated).forEach(p => { votes[p.id] = victim.id; });
    lastRes = engine.resolveVotes(votes);

    if (lastRes.gameOver) {
      break;
    }
    engine.proceedAfterVoteResult();
  }

  check(lastRes !== null && lastRes.gameOver === true, 'Game over on killer victory');
  check(lastRes!.winner === 'GUILTY', 'Killer victory triggered');
  check(
    lastRes!.endReason === 'MAX_WRONG_VOTES' || lastRes!.endReason === 'GUILTY_PARITY',
    'Valid killer victory end reason'
  );

  console.log(`  ✓ Killer victory condition verified (${lastRes!.endReason}).`);
}

// =========================================================================
// SECTION 5: Voting Ties Integration
// =========================================================================
console.log('\n--- SECTION 5: Voting Ties Integration ---');
{
  const engine = new GameEngine();
  engine.startNewGame(stories[0], ['P1', 'P2', 'P3', 'P4']);
  for (let i = 0; i < 4; i++) engine.advanceRolePass();

  const initialClues = engine.getState().revealedEvidenceIds.length;
  const initialWrongVotes = engine.getState().wrongVotesCount;
  const initialTotalClues = engine.getState().totalClues;

  engine.startVoting();
  // Cast tie vote: P1 and P2 vote P3; P3 and P4 vote P4
  const tieVotes = { 1: 3, 2: 3, 3: 4, 4: 4 };
  const res = engine.resolveVotes(tieVotes);

  check(res.isTie === true, 'Tie identified');
  check(res.eliminatedPlayer === null, 'No player eliminated on tie');
  check(res.wrongVotesCount === initialWrongVotes, 'wrongVotesCount not changed on tie');
  check(res.gameOver === false, 'Game not over on tie');
  check(engine.getState().revealedEvidenceIds.length === initialClues, 'No clues added on tie');
  check(engine.getState().totalClues === initialTotalClues, 'totalClues unchanged on tie');

  console.log('  ✓ Voting tie behavior verified.');
}

// =========================================================================
// SECTION 6: Role Pass Privacy & Sequential Transitions
// =========================================================================
console.log('\n--- SECTION 6: Role Pass Privacy & Sequences ---');
{
  // Specifically test transitions:
  // Killer -> Innocent, Innocent -> Killer, Killer A -> Killer B, Killer B -> Innocent
  // in an 8-player game (2 killers).
  const engine = new GameEngine();
  engine.startNewGame(stories[0], ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);

  // Verify pure helper getKillerPartners isolation
  for (const inn of innocents) {
    check(getKillerPartners(inn.id, state.players).length === 0, 'Innocent helper receives empty list');
  }

  for (const k of killers) {
    const partners = getKillerPartners(k.id, state.players);
    check(partners.length === 1, 'Killer helper receives 1 partner');
    check(partners[0].id !== k.id, 'Killer helper never lists self');
  }

  // Simulate passing device through all 8 players
  for (let i = 0; i < 8; i++) {
    const current = engine.getCurrentViewingPlayer()!;
    const partners = engine.getCurrentViewingPlayerPartners();
    if (current.guilty) {
      check(partners.length === 1, `Player ${current.id} (killer) sees 1 partner`);
      check(partners[0].guilty === true, `Partner of ${current.id} is guilty`);
      check(partners[0].id !== current.id, `Partner of ${current.id} is not self`);
    } else {
      check(partners.length === 0, `Player ${current.id} (innocent) sees 0 partners`);
    }
    engine.advanceRolePass();
  }

  console.log('  ✓ Role pass privacy and partner isolation verified.');
}

// =========================================================================
// SECTION 7: Production Stories Compatibility Matrix
// =========================================================================
console.log('\n--- SECTION 7: All 13 Production Stories Compatibility ---');
{
  for (const story of stories) {
    const minP = story.minPlayers || 4;
    const maxP = story.maxPlayers || 12;

    // Test minimum, midpoint, and maximum player counts for each story
    const testCounts = Array.from(new Set([minP, Math.min(maxP, Math.max(minP, 7)), maxP]));

    for (const count of testCounts) {
      const names = Array.from({ length: count }, (_, i) => `Tester_${i + 1}`);
      const testEngine = new GameEngine();
      const testState = testEngine.startNewGame(story, names);

      const expectedK = count <= 6 ? 1 : count <= 9 ? 2 : 3;
      const actualK = testState.players.filter(p => p.guilty).length;
      check(actualK === expectedK, `Story "${story.id}" at ${count}p: Expected ${expectedK} killers, got ${actualK}`);
      check(testState.totalClues === count, `Story "${story.id}" at ${count}p: Expected ${count} clues, got ${testState.totalClues}`);
      check(testEngine.getAllEvidence().length >= count, `Story "${story.id}" at ${count}p: Has sufficient clues`);
    }
    console.log(`  ✓ Story "${story.id}" compatible across its player range (${minP}–${maxP} players).`);
  }
}

// =========================================================================
// SECTION 8: Game A -> Game B Isolation & Reset To Lobby
// =========================================================================
console.log('\n--- SECTION 8: Game A -> Game B Isolation & Reset ---');
{
  // Start Game A and mutate state
  const engine = new GameEngine();
  engine.startNewGame(stories[0], ['A1', 'A2', 'A3', 'A4']);
  for (let i = 0; i < 4; i++) engine.advanceRolePass();
  engine.revealNextEvidence();
  engine.startVoting();
  const victimA = engine.getState().players.find(p => !p.guilty)!;
  const votesA: Record<number, number> = {};
  engine.getState().players.forEach(p => { votesA[p.id] = victimA.id; });
  engine.resolveVotes(votesA); // eliminate an innocent player so game continues to round 2
  engine.proceedAfterVoteResult();

  const stateA = engine.getState();
  check(stateA.currentRound >= 2, 'Game A is in round 2+');
  check(stateA.revealedEvidenceIds.length >= 1, 'Game A has revealed evidence');
  check(stateA.history.eliminations.length >= 1, 'Game A has eliminations');

  // Start Game B on same engine instance
  engine.startNewGame(stories[1], ['B1', 'B2', 'B3', 'B4', 'B5']);
  const stateB = engine.getState();

  check(stateB.phase === 'ROLE_PASS', 'Game B starts clean in ROLE_PASS');
  check(stateB.currentRound === 1, 'Game B round reset to 1');
  check(stateB.players.length === 5, 'Game B has 5 players');
  check(stateB.players.every(p => !p.isEliminated), 'Game B players all alive');
  check(stateB.revealedEvidenceIds.length === 0, 'Game B revealedEvidenceIds is empty');
  check(stateB.wrongVotesCount === 0, 'Game B wrongVotesCount is 0');
  check(stateB.winner === 'NONE', 'Game B winner is NONE');
  check(stateB.endReason === null, 'Game B endReason is null');
  check(stateB.history.eliminations.length === 0, 'Game B history eliminations empty');
  check(stateB.history.wrongVotes === 0, 'Game B history wrong votes is 0');

  // Test resetToLobby()
  engine.resetToLobby();
  const stateLobby = engine.getState();
  check(stateLobby.phase === 'LOBBY', 'Lobby reset phase is LOBBY');
  check(stateLobby.players.length === 0, 'Lobby players empty');
  check(stateLobby.story === null, 'Lobby story is null');

  console.log('  ✓ Game A -> Game B isolation and resetToLobby() clean state verified.');
}

console.log('\n====================================================');
console.log(`🎉 ALL PHASE 7.5 FULL INTEGRATION TESTS PASSED! (${passedTests} assertions)`);
console.log('====================================================\n');
