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
console.log('🧪 RUNNING PHASE 7.3 DYNAMIC CLUE ECONOMY & FILTERING TEST SUITE');
console.log('====================================================');

// Test 1: Authoritative player count to clue count mapping (4..12)
console.log('\n--- 1. Testing Dynamic Clue Quantity Formula (Total Clues = Player Count) ---');
for (let p = 4; p <= 12; p++) {
  assert(getTotalClueCount(p) === p, `getTotalClueCount(${p}) returns ${p}`);
}

// Invalid player counts must throw
const invalidCounts = [0, 1, 2, 3, 13, 14, 20, -1, 3.5, NaN];
for (const bad of invalidCounts) {
  let threw = false;
  try {
    getTotalClueCount(bad);
  } catch {
    threw = true;
  }
  assert(threw, `getTotalClueCount(${bad}) threw an Error`);
}

// Test 2: Actual Selected Killer filtering
console.log('\n--- 2. Testing Actual-Killer-Aware Clue Filtering ---');
const testStory: Story = {
  id: 'filtering_test_story',
  title: 'قصة اختبار الفلترة',
  description: 'وصف',
  minPlayers: 4,
  maxPlayers: 12,
  introduction: { setting: 'س', situation: 'و', incident: 'ح', stakes: 'م', objective: 'هـ' },
  guiltyPool: [
    { name: 'القاتل الأول', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: true },
    { name: 'القاتل الثاني', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: true },
    { name: 'القاتل الثالث', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: true }
  ],
  innocentPool: [
    { name: 'بريء 1', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: false },
    { name: 'بريء 2', profession: 'م5', publicIdentity: 'ه5', knowledge: 'ك5', guilty: false },
    { name: 'بريء 3', profession: 'م6', publicIdentity: 'ه6', knowledge: 'ك6', guilty: false },
    { name: 'بريء 4', profession: 'م7', publicIdentity: 'ه7', knowledge: 'ك7', guilty: false }
  ],
  evidence: [
    {
      id: 'clue_general',
      title: 'دليل عام',
      description: 'دليل متاح للجميع',
      publicClue: 'أثر عام في مسرح الجريمة',
      category: 'physical'
    },
    {
      id: 'clue_killer_1_only',
      title: 'دليل خاص بالقاتل 1',
      description: 'دليل يتطلب القاتل الأول',
      publicClue: 'أداة القاتل الأول',
      category: 'physical',
      requiredKillers: ['القاتل الأول']
    },
    {
      id: 'clue_killer_2_only',
      title: 'دليل خاص بالقاتل 2',
      description: 'دليل يتطلب القاتل الثاني',
      publicClue: 'أداة القاتل الثاني',
      category: 'physical',
      requiredKillers: ['القاتل الثاني']
    },
    {
      id: 'clue_killer_1_and_2',
      title: 'دليل ثنائي 1 و 2',
      description: 'دليل يتطلب كلا القاتلين 1 و 2',
      publicClue: 'محادثة بين القاتلين 1 و 2',
      category: 'document',
      requiredKillers: ['القاتل الأول', 'القاتل الثاني']
    },
    {
      id: 'clue_exclude_killer_1',
      title: 'دليل استبعاد القاتل 1',
      description: 'دليل يظهر فقط إذا لم يكن القاتل 1 هو الفاعل',
      publicClue: 'بصمة تستبعد القاتل 1',
      category: 'physical',
      excludedKillers: ['القاتل الأول']
    },
    {
      id: 'clue_associated_suspect_1',
      title: 'دليل مرتبط بالمشتبه 1',
      description: 'مرتبط بالقاتل 1 كجاني محدد',
      publicClue: 'وثيقة المشتبه 1',
      category: 'document',
      isKillerSpecific: true,
      associatedSuspect: 'القاتل الأول'
    }
  ],
  wrongVoteHints: [],
  investigationRounds: [],
  solution: 'الحل'
};

// Case A: Killer 1 is the only killer
const eligibleForK1 = ClueEngine.getEligibleClues(testStory, ['القاتل الأول']);
const k1Ids = new Set(eligibleForK1.map(c => c.id));
assert(k1Ids.has('clue_general'), 'General clue is eligible for Killer 1');
assert(k1Ids.has('clue_killer_1_only'), 'Killer 1 clue is eligible for Killer 1');
assert(!k1Ids.has('clue_killer_2_only'), 'Killer 2 clue is EXCLUDED for Killer 1');
assert(!k1Ids.has('clue_killer_1_and_2'), 'Dual clue (1 & 2) is EXCLUDED when only 1 is killer');
assert(!k1Ids.has('clue_exclude_killer_1'), 'Excluded clue is EXCLUDED when 1 is killer');
assert(k1Ids.has('clue_associated_suspect_1'), 'Associated suspect 1 clue is eligible for Killer 1');

// Case B: Killer 2 is the only killer
const eligibleForK2 = ClueEngine.getEligibleClues(testStory, ['القاتل الثاني']);
const k2Ids = new Set(eligibleForK2.map(c => c.id));
assert(k2Ids.has('clue_general'), 'General clue is eligible for Killer 2');
assert(!k2Ids.has('clue_killer_1_only'), 'Killer 1 clue is EXCLUDED for Killer 2');
assert(k2Ids.has('clue_killer_2_only'), 'Killer 2 clue is eligible for Killer 2');
assert(!k2Ids.has('clue_killer_1_and_2'), 'Dual clue (1 & 2) is EXCLUDED when only 2 is killer');
assert(k2Ids.has('clue_exclude_killer_1'), 'Excluded clue is ELIGIBLE when 1 is NOT killer');
assert(!k2Ids.has('clue_associated_suspect_1'), 'Associated suspect 1 clue is EXCLUDED for Killer 2');

// Case C: Killer 1 AND Killer 2 are both killers
const eligibleForK1K2 = ClueEngine.getEligibleClues(testStory, ['القاتل الأول', 'القاتل الثاني']);
const k1k2Ids = new Set(eligibleForK1K2.map(c => c.id));
assert(k1k2Ids.has('clue_general'), 'General clue is eligible for Killers 1 & 2');
assert(k1k2Ids.has('clue_killer_1_only'), 'Killer 1 clue is eligible for Killers 1 & 2');
assert(k1k2Ids.has('clue_killer_2_only'), 'Killer 2 clue is eligible for Killers 1 & 2');
assert(k1k2Ids.has('clue_killer_1_and_2'), 'Dual clue (1 & 2) is ELIGIBLE when BOTH 1 and 2 are killers');
assert(!k1k2Ids.has('clue_exclude_killer_1'), 'Excluded clue is EXCLUDED when 1 is killer');

// Test 3: Story Clue Economy Validation on all 13 built-in stories
console.log('\n--- 3. Testing Clue Economy Validation on All 13 Built-in Stories ---');
for (const story of BUILT_IN_STORIES_V2) {
  const result = ClueEngine.validateStoryClueEconomy(story);
  assert(result.valid, `Story "${story.id}" (${story.title}) satisfies Clue Economy Validation (12 clues total, >=6 for 1 killer, >=9 for 2 killers, >=12 for 3 killers)`);
  if (!result.valid) {
    console.error(`Errors for ${story.id}:`, result.errors);
  }
}

// Test 4: GameEngine Clue State & One-Clue-Per-Round Enforcement
console.log('\n--- 4. Testing One-Clue-Per-Round Rule & ClueState in GameEngine ---');
const sampleStory = BUILT_IN_STORIES_V2[0]; // dreams
const playerNames4 = ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4'];
const engine = new GameEngine();
const initialState = engine.startNewGame(sampleStory, playerNames4);

assert(initialState.totalClues === 4, '4-player game has totalClues === 4');
assert(initialState.remainingClues === 4, 'Initial remaining clues === 4');
assert(initialState.clueRevealedThisRound === false, 'clueRevealedThisRound is false at start');

// Transition to Discussion
engine.startDiscussion();
assert(engine.getState().phase === 'DISCUSSION', 'Game enters DISCUSSION phase');
assert(engine.getState().currentRound === 1, 'Current round is 1');

// Reveal 1st clue
const available = engine.getAvailableUnrevealedEvidence();
assert(available.length > 0, 'Available unrevealed evidence exists');
const clueToReveal = available[0];
const r1State = engine.revealEvidence(clueToReveal.id);
assert(r1State.revealedEvidenceIds.includes(clueToReveal.id), 'Revealed clue successfully');
assert(engine.getState().clueRevealedThisRound === true, 'clueRevealedThisRound is now true');
assert(engine.getState().remainingClues === 3, 'Remaining clues decremented to 3');
assert(engine.getState().revealedEvidenceIds.includes(clueToReveal.id), 'revealedEvidenceIds includes the revealed clue');

// Attempting to reveal a 2nd clue in the same round must be blocked
const secondClue = engine.getAvailableUnrevealedEvidence()[0];
if (secondClue) {
  const blockedState = engine.revealEvidence(secondClue.id);
  assert(!blockedState.revealedEvidenceIds.includes(secondClue.id), 'Second clue reveal in same round was ignored/blocked');
} else {
  assert(engine.getAvailableUnrevealedEvidence().length === 0, 'getAvailableUnrevealedEvidence is empty after reveal');
}

// Progress to Voting and complete round
engine.startVoting();
const votingPlayers = engine.getState().players;
votingPlayers.forEach(p => {
  engine.castVote(p.id, votingPlayers.find(target => !target.guilty)?.id || 1);
});
engine.resolveVotes();
engine.proceedAfterVoteResult();

// Now next round should be Round 2
assert(engine.getState().currentRound === 2, 'Advanced to Round 2');
assert(engine.getState().clueRevealedThisRound === false, 'clueRevealedThisRound reset to false in Round 2');

// Can now reveal 1 clue in Round 2
const round2Available = engine.getAvailableUnrevealedEvidence();
assert(round2Available.length > 0, 'Available clues exist for Round 2');
const round2Clue = round2Available[0];
const r2State = engine.revealEvidence(round2Clue.id);
assert(r2State.revealedEvidenceIds.includes(round2Clue.id), 'Revealed 1 clue in Round 2 successfully');
assert(engine.getState().clueRevealedThisRound === true, 'clueRevealedThisRound is true for Round 2');
assert(engine.getState().remainingClues === 2, 'Remaining clues is now 2');

console.log('\n====================================================');
console.log('🎉 ALL PHASE 7.3 DYNAMIC CLUE ECONOMY TESTS PASSED!');
console.log('====================================================\n');
