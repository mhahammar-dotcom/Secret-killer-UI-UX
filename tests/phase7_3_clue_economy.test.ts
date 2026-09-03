import { GameEngine } from '../src/game/GameEngine';
import { ClueEngine, getTotalClueCount } from '../src/game/ClueEngine';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { Story, EvidenceItem } from '../src/game/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('====================================================');
console.log('🧪 RUNNING PHASE 7.3 CLUE ECONOMY & HARD CLUE COUNT GUARANTEE TEST SUITE');
console.log('====================================================');

// ----------------------------------------------------
// TEST 1: Total clues formula (4..12) and strict errors on invalid counts
// ----------------------------------------------------
console.log('\n--- 1. Testing Hard Clue Count Formula (totalClues === playerCount) ---');
for (let p = 4; p <= 12; p++) {
  assert(getTotalClueCount(p) === p, `getTotalClueCount(${p}) === ${p}`);
}

const invalidCounts = [0, 1, 2, 3, 13, 14, 20, -1, 3.5, NaN];
for (const bad of invalidCounts) {
  let threw = false;
  try {
    getTotalClueCount(bad);
  } catch {
    threw = true;
  }
  assert(threw, `getTotalClueCount(${bad}) threw an Error for invalid player count`);
}

// ----------------------------------------------------
// TEST 2: Exact Clue Count Guarantee in GameEngine (No Math.min clamping)
// ----------------------------------------------------
console.log('\n--- 2. Testing Exact Clue Count in GameEngine (No Clamping) ---');
for (let p = 4; p <= 12; p++) {
  const story = BUILT_IN_STORIES_V2[0]; // dreams
  const names = Array.from({ length: p }, (_, i) => `لاعب ${i + 1}`);
  const engine = new GameEngine();
  const state = engine.startNewGame(story, names);

  assert(state.totalClues === p, `${p}-player game: state.totalClues is exactly ${p}`);
  assert(state.totalClues === state.players.length, `state.totalClues strictly matches player count (${p})`);
}

// ----------------------------------------------------
// TEST 3: Insufficient Eligible Clues Prevents Game Start
// ----------------------------------------------------
console.log('\n--- 3. Testing Insufficient Eligible Clues Hard Failure ---');
const storyWithFewClues: Story = {
  id: 'few_clues_story',
  title: 'قصة بأدلة غير كافية',
  description: 'وصف',
  minPlayers: 4,
  maxPlayers: 4,
  introduction: { setting: 'س', situation: 'و', incident: 'ح', stakes: 'م', objective: 'هـ' },
  guiltyPool: [
    { name: 'جاني 1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: true }
  ],
  innocentPool: [
    { name: 'بريء 1', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false },
    { name: 'بريء 2', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false },
    { name: 'بريء 3', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: false }
  ],
  evidence: [
    {
      id: 'clue_1',
      title: 'دليل 1',
      description: 'دليل 1',
      publicClue: 'أثر 1',
      category: 'physical'
    },
    {
      id: 'clue_2',
      title: 'دليل 2',
      description: 'دليل 2',
      publicClue: 'أثر 2',
      category: 'physical'
    }
    // Only 2 clues for 4 players
  ],
  wrongVoteHints: [],
  investigationRounds: [],
  solution: 'الحل'
};

let startThrew = false;
let startErrorMessage = '';
try {
  const engine = new GameEngine();
  engine.startNewGame(storyWithFewClues, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
} catch (err: any) {
  startThrew = true;
  startErrorMessage = err.message;
}

assert(startThrew, 'GameEngine throws when eligibleClues.length < totalClues');
assert(
  startErrorMessage.includes('Cannot start game') && startErrorMessage.includes('require 4 valid clues, but only 2 clues are compatible'),
  `Error message specifically reports required vs available count: "${startErrorMessage}"`
);

// ----------------------------------------------------
// TEST 4: Initial Public Clues Exceeding totalClues Throws Error
// ----------------------------------------------------
console.log('\n--- 4. Testing Initial Public Clues Exceeding totalClues ---');
const storyWithTooManyInitialClues: Story = {
  ...storyWithFewClues,
  evidence: [
    { id: 'c1', title: '1', description: '1', publicClue: '1', category: 'physical', isInitialPublic: true },
    { id: 'c2', title: '2', description: '2', publicClue: '2', category: 'physical', isInitialPublic: true },
    { id: 'c3', title: '3', description: '3', publicClue: '3', category: 'physical', isInitialPublic: true },
    { id: 'c4', title: '4', description: '4', publicClue: '4', category: 'physical', isInitialPublic: true },
    { id: 'c5', title: '5', description: '5', publicClue: '5', category: 'physical', isInitialPublic: true }
  ]
};

let initialPublicThrew = false;
try {
  const engine = new GameEngine();
  // 4 players with 5 initial public clues
  engine.startNewGame(storyWithTooManyInitialClues, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
} catch (err: any) {
  initialPublicThrew = true;
  assert(err.message.includes('Initial public clues'), `Validation fails if initial public clues exceed totalClues: "${err.message}"`);
}
assert(initialPublicThrew, 'Initial public clues exceeding totalClues threw validation error');

// ----------------------------------------------------
// TEST 5: Wrong Votes NEVER Automatically Reveal Clues
// ----------------------------------------------------
console.log('\n--- 5. Testing Wrong Vote Does NOT Automatically Reveal Clues ---');
const testStory = BUILT_IN_STORIES_V2[0];
const gameEngine = new GameEngine();
gameEngine.startNewGame(testStory, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
gameEngine.startDiscussion();

// Initial clues count
const cluesBeforeVote = [...gameEngine.getState().revealedClues];
const wrongVotesBefore = gameEngine.getState().wrongVotesCount;

// Proceed to voting
gameEngine.startVoting();
const players = gameEngine.getState().players;
const innocentPlayer = players.find(p => !p.guilty);
const guiltyPlayer = players.find(p => p.guilty);

assert(Boolean(innocentPlayer && guiltyPlayer), 'Found innocent and guilty players in the match');

// All players vote for an innocent player (wrong vote)
players.forEach(p => {
  gameEngine.castVote(p.id, innocentPlayer!.id);
});

const voteResult = gameEngine.resolveVotes();

assert(voteResult.wasGuilty === false, 'Vote result identified innocent elimination (wrong vote)');
assert(gameEngine.getState().wrongVotesCount === wrongVotesBefore + 1, 'wrongVotesCount correctly incremented by 1');
assert(gameEngine.getState().revealedClues.length === cluesBeforeVote.length, 'revealedClues.length has NOT increased after wrong vote');
assert(
  JSON.stringify(gameEngine.getState().revealedClues) === JSON.stringify(cluesBeforeVote),
  'revealedClues array is strictly identical before and after wrong vote (no auto hint injection)'
);

// ----------------------------------------------------
// TEST 6: Actual-Killer Filtering & No Cross-Combination Leakage
// ----------------------------------------------------
console.log('\n--- 6. Testing Actual-Killer Filtering & No Cross-Combination Leakage ---');
const syntheticStory: Story = {
  id: 'synthetic_isolation',
  title: 'عزل المجموعات',
  description: 'وصف',
  minPlayers: 4,
  maxPlayers: 12,
  introduction: { setting: 'س', situation: 'و', incident: 'ح', stakes: 'م', objective: 'هـ' },
  guiltyPool: [
    { name: 'جاني_أ', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: true },
    { name: 'جاني_ب', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: true },
    { name: 'جاني_ج', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: true }
  ],
  innocentPool: [
    { name: 'بريء 1', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: false },
    { name: 'بريء 2', profession: 'م5', publicIdentity: 'ه5', knowledge: 'ك5', guilty: false }
  ],
  evidence: [
    { id: 'ev_gen_1', title: 'دليل عام 1', description: 'دليل عام', publicClue: 'عام 1', category: 'physical' },
    { id: 'ev_gen_2', title: 'دليل عام 2', description: 'دليل عام', publicClue: 'عام 2', category: 'physical' },
    { id: 'ev_gen_3', title: 'دليل عام 3', description: 'دليل عام', publicClue: 'عام 3', category: 'physical' },
    { id: 'ev_a_only', title: 'دليل أ فقط', description: 'أ فقط', publicClue: 'خاص بـ أ', category: 'physical', requiredKillers: ['جاني_أ'] },
    { id: 'ev_b_only', title: 'دليل ب فقط', description: 'ب فقط', publicClue: 'خاص بـ ب', category: 'physical', requiredKillers: ['جاني_ب'] },
    { id: 'ev_c_only', title: 'دليل ج فقط', description: 'ج فقط', publicClue: 'خاص بـ ج', category: 'physical', requiredKillers: ['جاني_ج'] },
    { id: 'ev_ab', title: 'دليل أ و ب', description: 'أ و ب معاً', publicClue: 'تنسيق أ و ب', category: 'document', requiredKillers: ['جاني_أ', 'جاني_ب'] },
    { id: 'ev_ac', title: 'دليل أ و ج', description: 'أ و ج معاً', publicClue: 'تنسيق أ و ج', category: 'document', requiredKillers: ['جاني_أ', 'جاني_ج'] },
    { id: 'ev_bc', title: 'دليل ب و ج', description: 'ب و ج معاً', publicClue: 'تنسيق ب و ج', category: 'document', requiredKillers: ['جاني_ب', 'جاني_ج'] },
    { id: 'ev_abc', title: 'دليل أ و ب و ج', description: 'الثلاثة معاً', publicClue: 'تنسيق الثلاثة', category: 'document', requiredKillers: ['جاني_أ', 'جاني_ب', 'جاني_ج'] },
    { id: 'ev_not_a', title: 'استبعاد أ', description: 'استبعاد أ', publicClue: 'أ بريء', category: 'witness', excludedKillers: ['جاني_أ'] }
  ],
  wrongVoteHints: [],
  investigationRounds: [],
  solution: 'الحل'
};

// Case 1: [جاني_أ] selected alone
const cluesForA = ClueEngine.getEligibleClues(syntheticStory, ['جاني_أ']).map(c => c.id);
assert(cluesForA.includes('ev_gen_1'), 'Case [A]: general clue 1 included');
assert(cluesForA.includes('ev_a_only'), 'Case [A]: A-only clue included');
assert(!cluesForA.includes('ev_b_only'), 'Case [A]: B-only clue EXCLUDED');
assert(!cluesForA.includes('ev_c_only'), 'Case [A]: C-only clue EXCLUDED');
assert(!cluesForA.includes('ev_ab'), 'Case [A]: A+B clue EXCLUDED');
assert(!cluesForA.includes('ev_ac'), 'Case [A]: A+C clue EXCLUDED');
assert(!cluesForA.includes('ev_bc'), 'Case [A]: B+C clue EXCLUDED');
assert(!cluesForA.includes('ev_abc'), 'Case [A]: A+B+C clue EXCLUDED');
assert(!cluesForA.includes('ev_not_a'), 'Case [A]: excluded-A clue EXCLUDED');

// Case 2: [جاني_أ, جاني_ب] selected together
const cluesForAB = ClueEngine.getEligibleClues(syntheticStory, ['جاني_أ', 'جاني_ب']).map(c => c.id);
assert(cluesForAB.includes('ev_gen_1'), 'Case [A+B]: general clue included');
assert(cluesForAB.includes('ev_a_only'), 'Case [A+B]: A-only clue included');
assert(cluesForAB.includes('ev_b_only'), 'Case [A+B]: B-only clue included');
assert(cluesForAB.includes('ev_ab'), 'Case [A+B]: A+B clue included');
assert(!cluesForAB.includes('ev_c_only'), 'Case [A+B]: C-only clue EXCLUDED');
assert(!cluesForAB.includes('ev_ac'), 'Case [A+B]: A+C clue EXCLUDED');
assert(!cluesForAB.includes('ev_bc'), 'Case [A+B]: B+C clue EXCLUDED');
assert(!cluesForAB.includes('ev_abc'), 'Case [A+B]: A+B+C clue EXCLUDED');

// Case 3: [جاني_أ, جاني_ب, جاني_ج] selected together
const cluesForABC = ClueEngine.getEligibleClues(syntheticStory, ['جاني_أ', 'جاني_ب', 'جاني_ج']).map(c => c.id);
assert(cluesForABC.includes('ev_gen_1'), 'Case [A+B+C]: general clue included');
assert(cluesForABC.includes('ev_a_only'), 'Case [A+B+C]: A-only clue included');
assert(cluesForABC.includes('ev_b_only'), 'Case [A+B+C]: B-only clue included');
assert(cluesForABC.includes('ev_c_only'), 'Case [A+B+C]: C-only clue included');
assert(cluesForABC.includes('ev_ab'), 'Case [A+B+C]: A+B clue included');
assert(cluesForABC.includes('ev_ac'), 'Case [A+B+C]: A+C clue included');
assert(cluesForABC.includes('ev_bc'), 'Case [A+B+C]: B+C clue included');
assert(cluesForABC.includes('ev_abc'), 'Case [A+B+C]: A+B+C clue included');

// ----------------------------------------------------
// TEST 7: Production Story Combinations Validation Across All 13 Stories
// ----------------------------------------------------
console.log('\n--- 7. Testing All 13 Production Stories for Clue Sufficiency across Combinations ---');
let allStoriesPassed = true;
const storyValidationSummary: { id: string; combinationsTested: number; minEligible: number }[] = [];

for (const story of BUILT_IN_STORIES_V2) {
  const gPool = story.guiltyPool || [];
  let minCluesFound = Infinity;
  let comboCount = 0;

  // 1-killer combinations (must have >= 6 clues for 4-6 players)
  for (const g of gPool) {
    comboCount++;
    const eligible = ClueEngine.getEligibleClues(story, [g.name]);
    minCluesFound = Math.min(minCluesFound, eligible.length);
    if (eligible.length < 6) {
      allStoriesPassed = false;
      console.error(`❌ INSUFFICIENT CLUES: Story "${story.id}" with actual killer [${g.name}] has ${eligible.length} < 6 required clues!`);
    }
    // Verify no duplicate IDs
    const idSet = new Set(eligible.map(e => e.id));
    assert(idSet.size === eligible.length, `Story "${story.id}" [${g.name}] has no duplicate clue IDs (${idSet.size})`);
  }

  // 2-killer combinations (must have >= 9 clues for 7-9 players)
  if (gPool.length >= 2) {
    for (let i = 0; i < gPool.length; i++) {
      for (let j = i + 1; j < gPool.length; j++) {
        comboCount++;
        const killers = [gPool[i].name, gPool[j].name];
        const eligible = ClueEngine.getEligibleClues(story, killers);
        minCluesFound = Math.min(minCluesFound, eligible.length);
        if (eligible.length < 9) {
          allStoriesPassed = false;
          console.error(`❌ INSUFFICIENT CLUES: Story "${story.id}" with killers [${killers.join(', ')}] has ${eligible.length} < 9 required clues!`);
        }
        const idSet = new Set(eligible.map(e => e.id));
        assert(idSet.size === eligible.length, `Story "${story.id}" [${killers.join(', ')}] has no duplicate clue IDs (${idSet.size})`);
      }
    }
  }

  // 3-killer combinations (must have >= 12 clues for 10-12 players)
  if (gPool.length >= 3) {
    comboCount++;
    const killers = gPool.slice(0, 3).map(g => g.name);
    const eligible = ClueEngine.getEligibleClues(story, killers);
    minCluesFound = Math.min(minCluesFound, eligible.length);
    if (eligible.length < 12) {
      allStoriesPassed = false;
      console.error(`❌ INSUFFICIENT CLUES: Story "${story.id}" with killers [${killers.join(', ')}] has ${eligible.length} < 12 required clues!`);
    }
    const idSet = new Set(eligible.map(e => e.id));
    assert(idSet.size === eligible.length, `Story "${story.id}" [${killers.join(', ')}] has no duplicate clue IDs (${idSet.size})`);
  }

  storyValidationSummary.push({
    id: story.id,
    combinationsTested: comboCount,
    minEligible: minCluesFound
  });
}

assert(allStoriesPassed, 'All 13 production stories satisfy clue economy validation across ALL killer combinations');

// ----------------------------------------------------
// TEST 8: Player Count Specific Verification (4, 7, 10, 11, 12 Players)
// ----------------------------------------------------
console.log('\n--- 8. Testing Specific Player Counts (4, 7, 10, 11, 12 Players) in GameEngine ---');

// 4 players (1 killer, 4 totalClues)
{
  const story = BUILT_IN_STORIES_V2[0];
  const engine4 = new GameEngine();
  const s4 = engine4.startNewGame(story, ['P1', 'P2', 'P3', 'P4']);
  assert(s4.totalClues === 4, '4-player game has totalClues === 4');
  assert(s4.players.filter(p => p.guilty).length === 1, '4-player game has exactly 1 killer');
  assert(engine4.getAvailableUnrevealedEvidence().length <= 4, 'Available unrevealed evidence is within totalClues');
}

// 7 players (2 killers, 7 totalClues)
{
  const story = BUILT_IN_STORIES_V2[1];
  const engine7 = new GameEngine();
  const s7 = engine7.startNewGame(story, ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7']);
  assert(s7.totalClues === 7, '7-player game has totalClues === 7');
  assert(s7.players.filter(p => p.guilty).length === 2, '7-player game has exactly 2 killers');
}

// 10 players (3 killers, 10 totalClues)
{
  const story = BUILT_IN_STORIES_V2[2];
  const engine10 = new GameEngine();
  const s10 = engine10.startNewGame(story, Array.from({ length: 10 }, (_, i) => `P${i + 1}`));
  assert(s10.totalClues === 10, '10-player game has totalClues === 10');
  assert(s10.players.filter(p => p.guilty).length === 3, '10-player game has exactly 3 killers');
}

// 11 players (3 killers, 11 totalClues)
{
  const story = BUILT_IN_STORIES_V2[3];
  const engine11 = new GameEngine();
  const s11 = engine11.startNewGame(story, Array.from({ length: 11 }, (_, i) => `P${i + 1}`));
  assert(s11.totalClues === 11, '11-player game has totalClues === 11');
  assert(s11.players.filter(p => p.guilty).length === 3, '11-player game has exactly 3 killers');
}

// 12 players (3 killers, 12 totalClues)
{
  const story = BUILT_IN_STORIES_V2[4];
  const engine12 = new GameEngine();
  const s12 = engine12.startNewGame(story, Array.from({ length: 12 }, (_, i) => `P${i + 1}`));
  assert(s12.totalClues === 12, '12-player game has totalClues === 12');
  assert(s12.players.filter(p => p.guilty).length === 3, '12-player game has exactly 3 killers');
}

// ----------------------------------------------------
// TEST 9: One-Clue-Per-Round & Duplicate Protection & Clue Exhaustion
// ----------------------------------------------------
console.log('\n--- 9. Testing One-Clue-Per-Round, Duplicate Protection & Clue Exhaustion ---');
{
  const story = BUILT_IN_STORIES_V2[5];
  const engine = new GameEngine();
  engine.startNewGame(story, ['A', 'B', 'C', 'D']);
  engine.startDiscussion();

  assert(engine.getState().clueRevealedThisRound === false, 'clueRevealedThisRound is false at start of round 1');

  // Reveal clue 1
  const available1 = engine.getAvailableUnrevealedEvidence();
  assert(available1.length > 0, 'Available clues exist');
  const clue1 = available1[0];
  const stateAfter1 = engine.revealEvidence(clue1.id);

  assert(stateAfter1.clueRevealedThisRound === true, 'clueRevealedThisRound is true after first reveal');
  assert(stateAfter1.revealedEvidenceIds.includes(clue1.id), 'clue 1 added to revealedEvidenceIds');
  assert(stateAfter1.remainingClues === 3, 'remainingClues is 3');

  // Attempt second reveal in same round
  assert(engine.canRevealClue() === false, 'canRevealClue() returns false when clueRevealedThisRound is true');
  assert(engine.hasMoreEvidence() === false, 'hasMoreEvidence() returns false when clueRevealedThisRound is true');

  const blockedState = engine.revealEvidence('another_clue');
  assert(blockedState.revealedEvidenceIds.length === 1, 'Second clue reveal blocked in same round');

  // Advance to voting and round 2 (vote for an innocent player so game continues to round 2)
  engine.startVoting();
  const innocentToVote = engine.getState().players.find(p => !p.guilty)!;
  engine.getState().players.forEach(p => engine.castVote(p.id, innocentToVote.id));
  engine.resolveVotes();
  engine.proceedAfterVoteResult();

  assert(engine.getState().currentRound === 2, 'Advanced to round 2');
  assert(engine.getState().clueRevealedThisRound === false, 'clueRevealedThisRound reset to false in round 2');

  // Reveal clue 2 in round 2
  const availableRound2 = engine.getAvailableUnrevealedEvidence();
  assert(availableRound2.length > 0, 'Clues available in round 2');
  assert(!availableRound2.some(c => c.id === clue1.id), 'Already revealed clue 1 is NOT in available unrevealed clues (duplicate protection)');
}

console.log('\n====================================================');
console.log('🎉 ALL PHASE 7.3 HARD CLUE ECONOMY GUARANTEE TESTS PASSED!');
console.log('====================================================\n');
