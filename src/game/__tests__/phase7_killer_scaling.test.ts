import {
  GameEngine,
  StoryEngine,
  StoryStore,
  CharacterAllocator,
  VotingEngine,
  PlayerManager,
  getKillerCount,
  Story,
  Player
} from '../index';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failedTests++;
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }
}

console.log('=== RUNNING PHASE 7.2: ORIGINAL KILLER SCALING TEST SUITE ===\n');

const stories = StoryStore.getBuiltInStories();
assert(stories.length > 0, 'Built-in stories must exist');
const sampleStory = stories[0];

// =========================================================================
// 1. UNIT TESTS: getKillerCount(playerCount)
// =========================================================================
console.log('\n--- 1. Testing getKillerCount() Core Scaling ---');

assert(getKillerCount(4) === 1, '4 players -> 1 killer');
assert(getKillerCount(5) === 1, '5 players -> 1 killer');
assert(getKillerCount(6) === 1, '6 players -> 1 killer');

assert(getKillerCount(7) === 2, '7 players -> 2 killers');
assert(getKillerCount(8) === 2, '8 players -> 2 killers');
assert(getKillerCount(9) === 2, '9 players -> 2 killers');

assert(getKillerCount(10) === 3, '10 players -> 3 killers');
assert(getKillerCount(11) === 3, '11 players -> 3 killers');
assert(getKillerCount(12) === 3, '12 players -> 3 killers');

// PlayerManager & StoryEngine aliases forward to central getKillerCount
assert(PlayerManager.getKillerCount(4) === 1, 'PlayerManager.getKillerCount(4) === 1');
assert(PlayerManager.getKillerCount(8) === 2, 'PlayerManager.getKillerCount(8) === 2');
assert(PlayerManager.getKillerCount(12) === 3, 'PlayerManager.getKillerCount(12) === 3');
assert(StoryEngine.getKillerCount(5) === 1, 'StoryEngine.getKillerCount(5) === 1');
assert(StoryEngine.getKillerCount(7) === 2, 'StoryEngine.getKillerCount(7) === 2');
assert(StoryEngine.getKillerCount(10) === 3, 'StoryEngine.getKillerCount(10) === 3');

// Invalid player counts validation
let thrown = false;
try {
  getKillerCount(3);
} catch {
  thrown = true;
}
assert(thrown, '< 4 players throws error');

thrown = false;
try {
  getKillerCount(0);
} catch {
  thrown = true;
}
assert(thrown, '0 players throws error');

thrown = false;
try {
  getKillerCount(-1);
} catch {
  thrown = true;
}
assert(thrown, 'Negative players throws error');

thrown = false;
try {
  getKillerCount(13);
} catch {
  thrown = true;
}
assert(thrown, '> 12 players throws error');

thrown = false;
try {
  getKillerCount(5.5);
} catch {
  thrown = true;
}
assert(thrown, 'Non-integer player count throws error');

thrown = false;
try {
  getKillerCount(NaN);
} catch {
  thrown = true;
}
assert(thrown, 'NaN player count throws error');

// =========================================================================
// 2. ROLE ALLOCATION MATRIX (4 to 12 players)
// =========================================================================
console.log('\n--- 2. Testing Full Allocation Matrix (4-12 players) ---');

const testNames = [
  'لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4', 'لاعب 5', 'لاعب 6',
  'لاعب 7', 'لاعب 8', 'لاعب 9', 'لاعب 10', 'لاعب 11', 'لاعب 12'
];

for (let count = 4; count <= 12; count++) {
  const currentNames = testNames.slice(0, count);
  const expectedKillers = count <= 6 ? 1 : count <= 9 ? 2 : 3;
  const expectedInnocents = count - expectedKillers;

  const allocated = CharacterAllocator.allocateCharacters(sampleStory, currentNames);
  const guiltyPlayers = allocated.filter(p => p.guilty);
  const innocentPlayers = allocated.filter(p => !p.guilty);

  assert(
    guiltyPlayers.length === expectedKillers,
    `${count} players -> exactly ${expectedKillers} killer(s) (found: ${guiltyPlayers.length})`
  );
  assert(
    innocentPlayers.length === expectedInnocents,
    `${count} players -> exactly ${expectedInnocents} innocent(s) (found: ${innocentPlayers.length})`
  );

  // Each player role consistency
  allocated.forEach((p, idx) => {
    assert(typeof p.guilty === 'boolean', `Player ${idx + 1} has boolean guilty flag`);
    assert(p.character.guilty === p.guilty, `Player ${idx + 1} character.guilty matches player.guilty`);
    assert(!p.isEliminated, `Player ${idx + 1} starts non-eliminated`);
  });
}

// =========================================================================
// 3. RANDOMNESS AND DISTRIBUTION TESTS
// =========================================================================
console.log('\n--- 3. Testing Random Distribution Across 100 Runs ---');

// 9 Players (2 Killers)
{
  const guiltyPositions = new Set<number>();
  for (let i = 0; i < 100; i++) {
    const allocated = CharacterAllocator.allocateCharacters(sampleStory, testNames.slice(0, 9));
    const guilty = allocated.filter(p => p.guilty);
    assert(guilty.length === 2, `Run ${i + 1} (9 players): exactly 2 killers`);
    guilty.forEach(p => guiltyPositions.add(p.id));
  }
  assert(guiltyPositions.size > 2, `9-player killers distributed across multiple seat positions (${guiltyPositions.size} distinct seats)`);
}

// 12 Players (3 Killers)
{
  const guiltyPositions = new Set<number>();
  for (let i = 0; i < 100; i++) {
    const allocated = CharacterAllocator.allocateCharacters(sampleStory, testNames.slice(0, 12));
    const guilty = allocated.filter(p => p.guilty);
    assert(guilty.length === 3, `Run ${i + 1} (12 players): exactly 3 killers`);
    guilty.forEach(p => guiltyPositions.add(p.id));
  }
  assert(guiltyPositions.size > 3, `12-player killers distributed across multiple seat positions (${guiltyPositions.size} distinct seats)`);
}

// =========================================================================
// 4. NO DUPLICATE OR OVERLAPPING ROLES
// =========================================================================
console.log('\n--- 4. Testing Role Exclusivity & Absence of Legacy Fields ---');

for (let count = 4; count <= 12; count++) {
  const allocated = CharacterAllocator.allocateCharacters(sampleStory, testNames.slice(0, count));
  allocated.forEach(p => {
    // Player must be exactly one role
    assert(p.guilty === true || p.guilty === false, 'Player must be strictly guilty or not');
    // Legacy fields must not exist
    assert((p as any).secret === undefined, 'No secret field on player');
    assert((p as any).secretMotive === undefined, 'No secretMotive field on player');
    assert((p as any).objective === undefined, 'No objective field on player');
    assert((p as any).killerObjective === undefined, 'No killerObjective field on player');
    assert((p as any).mission === undefined, 'No mission field on player');
    assert((p as any).task === undefined, 'No task field on player');
  });
}

// =========================================================================
// 5. VOTING AND MULTI-KILLER ELIMINATION (2 Killers in 7 Players)
// =========================================================================
console.log('\n--- 5. Testing Multi-Killer Step-by-Step Elimination (7 Players, 2 Killers) ---');

{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, testNames.slice(0, 7));

  const guiltyPlayers = state.players.filter(p => p.guilty);
  const innocentPlayers = state.players.filter(p => !p.guilty);
  assert(guiltyPlayers.length === 2, '7 players initialized with 2 killers');
  assert(innocentPlayers.length === 5, '7 players initialized with 5 innocents');

  const killer1 = guiltyPlayers[0];
  const killer2 = guiltyPlayers[1];
  const innocent1 = innocentPlayers[0];

  // Advance to discussion
  engine.advanceRolePass();
  engine.advanceRolePass();
  engine.advanceRolePass();
  engine.advanceRolePass();
  engine.advanceRolePass();
  engine.advanceRolePass();
  engine.advanceRolePass();

  // Round 1: Eliminate an innocent player
  // All vote for innocent1
  const votesRound1: Record<number, number> = {};
  state.players.forEach(p => {
    votesRound1[p.id] = innocent1.id;
  });

  const resRound1 = engine.resolveVotes(votesRound1);
  assert(!resRound1.gameOver, 'Eliminating innocent in round 1 does NOT end the game');
  assert(resRound1.wrongVotesCount === 1, 'Wrong votes count incremented to 1');
  assert(resRound1.eliminatedPlayer?.id === innocent1.id, 'innocent1 was eliminated');
  assert(engine.getState().players.filter(p => p.guilty && !p.isEliminated).length === 2, '2 killers still alive');

  // Round 2: Eliminate Killer 1
  // All living players vote for killer1
  const votesRound2: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    votesRound2[p.id] = killer1.id;
  });

  const resRound2 = engine.resolveVotes(votesRound2);
  assert(!resRound2.gameOver, 'Eliminating 1st killer of 2 does NOT end the game (killer 2 still alive!)');
  assert(resRound2.winner === 'NONE', 'Winner is NONE while killers remain');
  assert(resRound2.eliminatedPlayer?.id === killer1.id, 'killer1 was eliminated');
  assert(resRound2.wrongVotesCount === 1, 'Wrong votes count remains 1 (eliminating killer is not a wrong vote)');
  assert(engine.getState().players.filter(p => p.guilty && !p.isEliminated).length === 1, 'Exactly 1 killer remains alive');

  // Round 3: Eliminate Killer 2
  // All living players vote for killer2
  const votesRound3: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    votesRound3[p.id] = killer2.id;
  });

  const resRound3 = engine.resolveVotes(votesRound3);
  assert(resRound3.gameOver === true, 'Eliminating final killer ends the game');
  assert(resRound3.winner === 'INNOCENTS', 'Innocents win when ALL killers are eliminated');
  assert(resRound3.endReason === 'ALL_GUILTY_ELIMINATED', 'End reason is ALL_GUILTY_ELIMINATED');
  assert(engine.getState().players.filter(p => p.guilty && !p.isEliminated).length === 0, '0 killers remain alive');
}

// =========================================================================
// 6. VOTING AND MULTI-KILLER ELIMINATION (3 Killers in 10 Players)
// =========================================================================
console.log('\n--- 6. Testing Multi-Killer Step-by-Step Elimination (10 Players, 3 Killers) ---');

{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, testNames.slice(0, 10));

  const guiltyPlayers = state.players.filter(p => p.guilty);
  const innocentPlayers = state.players.filter(p => !p.guilty);
  assert(guiltyPlayers.length === 3, '10 players initialized with 3 killers');
  assert(innocentPlayers.length === 7, '10 players initialized with 7 innocents');

  const killer1 = guiltyPlayers[0];
  const killer2 = guiltyPlayers[1];
  const killer3 = guiltyPlayers[2];

  // Advance to discussion
  for (let i = 0; i < 10; i++) {
    engine.advanceRolePass();
  }

  // Round 1: Eliminate Killer 1
  const votes1: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    votes1[p.id] = killer1.id;
  });
  const res1 = engine.resolveVotes(votes1);
  assert(!res1.gameOver, 'Eliminating 1st of 3 killers does NOT end game');
  assert(engine.getState().players.filter(p => p.guilty && !p.isEliminated).length === 2, '2 killers remain');

  // Round 2: Eliminate Killer 2
  const votes2: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    votes2[p.id] = killer2.id;
  });
  const res2 = engine.resolveVotes(votes2);
  assert(!res2.gameOver, 'Eliminating 2nd of 3 killers does NOT end game');
  assert(engine.getState().players.filter(p => p.guilty && !p.isEliminated).length === 1, '1 killer remains');

  // Round 3: Eliminate Killer 3
  const votes3: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => {
    votes3[p.id] = killer3.id;
  });
  const res3 = engine.resolveVotes(votes3);
  assert(res3.gameOver === true, 'Eliminating 3rd and final killer ends game');
  assert(res3.winner === 'INNOCENTS', 'Innocents win');
  assert(res3.endReason === 'ALL_GUILTY_ELIMINATED', 'End reason is ALL_GUILTY_ELIMINATED');
}

// =========================================================================
// 7. MAX WRONG VOTES LOSS CONDITION WITH MULTIPLE KILLERS
// =========================================================================
console.log('\n--- 7. Testing Max Wrong Votes Loss with Multi-Killers ---');

{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, testNames.slice(0, 8)); // 8 players -> 2 killers, 6 innocents
  assert(state.players.filter(p => p.guilty).length === 2, '8 players -> 2 killers');

  const innocents = state.players.filter(p => !p.guilty);

  for (let i = 0; i < 8; i++) {
    engine.advanceRolePass();
  }

  // Eliminate innocent 1 (wrong vote 1)
  const votes1: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => votes1[p.id] = innocents[0].id);
  const r1 = engine.resolveVotes(votes1);
  assert(!r1.gameOver && r1.wrongVotesCount === 1, 'Wrong vote 1/3: game continues');

  // Eliminate innocent 2 (wrong vote 2)
  const votes2: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => votes2[p.id] = innocents[1].id);
  const r2 = engine.resolveVotes(votes2);
  assert(!r2.gameOver && r2.wrongVotesCount === 2, 'Wrong vote 2/3: game continues');

  // Eliminate innocent 3 (wrong vote 3 = maxWrongVotes)
  const votes3: Record<number, number> = {};
  engine.getState().players.filter(p => !p.isEliminated).forEach(p => votes3[p.id] = innocents[2].id);
  const r3 = engine.resolveVotes(votes3);
  assert(r3.gameOver === true, 'Wrong vote 3/3 triggers game over');
  assert(r3.winner === 'GUILTY', 'Killers win on max wrong votes');
  assert(r3.endReason === 'MAX_WRONG_VOTES', 'End reason is MAX_WRONG_VOTES');
}

// =========================================================================
// 8. TIE VOTE RESOLUTION
// =========================================================================
console.log('\n--- 8. Testing Tie Vote Behavior with Multi-Killers ---');

{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, testNames.slice(0, 8)); // 8 players

  for (let i = 0; i < 8; i++) {
    engine.advanceRolePass();
  }

  // 4 votes for player 1, 4 votes for player 2 -> Tie
  const tieVotes: Record<number, number> = {
    1: 1, 2: 1, 3: 1, 4: 1,
    5: 2, 6: 2, 7: 2, 8: 2
  };

  const tieRes = engine.resolveVotes(tieVotes);
  assert(tieRes.isTie === true, 'Tie vote detected');
  assert(tieRes.eliminatedPlayer === null, 'No player eliminated on tie');
  assert(!tieRes.gameOver, 'Tie does not end game');
  assert(tieRes.wrongVotesCount === 0, 'Tie does not count as wrong vote');
}

console.log(`\n==================================================`);
console.log(`ALL PHASE 7.2 KILLER SCALING TESTS PASSED!`);
console.log(`Passed: ${passedTests}, Failed: ${failedTests}`);
console.log(`==================================================`);
