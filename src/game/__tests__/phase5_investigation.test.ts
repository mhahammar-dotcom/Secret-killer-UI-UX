import {
  GameEngine,
  StoryEngine,
  StoryStore,
  Story,
  EvidenceItem,
  EvidenceType
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

console.log('=== RUNNING PHASE 5 CORRECTION: EVIDENCE PACING & DISCUSSION TEST SUITE ===\n');

const builtInStories = StoryStore.getBuiltInStories();
assert(builtInStories.length > 0, 'Built-in stories exist');
const sampleStory = builtInStories[0];

// =========================================================================
// TEST 1: New game starts with ZERO investigation evidence revealed
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['فارس', 'رانيا', 'طارق', 'هدى'];
  const state = engine.startNewGame(sampleStory, playerNames);

  assert(state.revealedEvidenceIds.length === 0, 'TEST 1: New game starts with zero investigation evidence revealed');
  assert(engine.getRevealedEvidence().length === 0, 'TEST 1: getRevealedEvidence returns empty array initially');
}

// =========================================================================
// TEST 2: Explicit public opening clues, if any, are handled separately
// =========================================================================
{
  const customStoryWithPublicClue: Story = {
    id: 'test_public_story',
    title: 'قصة اختبار الدليل العلني',
    description: 'وصف اختباري',
    minPlayers: 4,
    maxPlayers: 4,
    introduction: {
      setting: 'المكان',
      situation: 'الوضع',
      incident: 'الحادثة',
      stakes: 'المخاطر',
      objective: 'الهدف'
    },
    guiltyPool: [
      { name: 'جاني 1', profession: 'مهنة', publicIdentity: 'هوية', knowledge: 'معرفة', guilty: true }
    ],
    innocentPool: [
      { name: 'بريء 1', profession: 'مهنة', publicIdentity: 'هوية', knowledge: 'معرفة', guilty: false },
      { name: 'بريء 2', profession: 'مهنة', publicIdentity: 'هوية', knowledge: 'معرفة', guilty: false },
      { name: 'بريء 3', profession: 'مهنة', publicIdentity: 'هوية', knowledge: 'معرفة', guilty: false }
    ],
    clues: [],
    wrongVoteHints: [],
    investigationRounds: [],
    evidence: [
      {
        id: 'ev_public_initial',
        title: 'إعلان أولي عام',
        description: 'بيان عام صادر في بداية التحقيق',
        publicClue: 'بيان عام صادر في بداية التحقيق',
        category: 'document',
        isInitialPublic: true
      },
      {
        id: 'ev_investigation_lead',
        title: 'أثر جنائي مخفي',
        description: 'أثر لا يظهر إلا بعد البحث',
        publicClue: 'أثر لا يظهر إلا بعد البحث',
        category: 'physical',
        isInitialPublic: false,
        availableFromRound: 1
      },
      {
        id: 'ev_item_3',
        title: 'أثر إضافي 3',
        description: 'وصف إضافي 3',
        category: 'physical',
        availableFromRound: 2
      },
      {
        id: 'ev_item_4',
        title: 'أثر إضافي 4',
        description: 'وصف إضافي 4',
        category: 'timeline',
        availableFromRound: 2
      }
    ],
    solution: 'الحل'
  };

  const engine = new GameEngine();
  const state = engine.startNewGame(customStoryWithPublicClue, ['أ', 'ب', 'ج', 'د']);
  
  assert(state.revealedEvidenceIds.includes('ev_public_initial'), 'TEST 2: Explicitly public initial evidence is revealed at start');
  assert(!state.revealedEvidenceIds.includes('ev_investigation_lead'), 'TEST 2: Non-public investigation evidence is NOT revealed at start');
  assert(state.revealedClues.includes('بيان عام صادر في بداية التحقيق'), 'TEST 2: Public clue is included in revealedClues');
}

// =========================================================================
// TEST 3: Unavailable evidence cannot be revealed
// =========================================================================
{
  const storyWithGatedEvidence: Story = {
    id: 'test_gated_story',
    title: 'قصة مقيدة بالجولات',
    description: 'وصف',
    minPlayers: 4,
    maxPlayers: 4,
    introduction: { setting: 'س', situation: 'و', incident: 'ح', stakes: 'م', objective: 'هـ' },
    guiltyPool: [{ name: 'ج', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: true }],
    innocentPool: [
      { name: 'ب1', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب2', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب3', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false }
    ],
    clues: [],
    wrongVoteHints: [],
    investigationRounds: [],
    evidence: [
      {
        id: 'ev_round3_only',
        title: 'دليل مؤجل للجولة 3',
        description: 'بيانات غير متاحة حالياً',
        category: 'document',
        availableFromRound: 3
      },
      {
        id: 'ev_gated_2',
        title: 'دليل 2',
        description: 'بيانات 2',
        category: 'physical',
        availableFromRound: 1
      },
      {
        id: 'ev_gated_3',
        title: 'دليل 3',
        description: 'بيانات 3',
        category: 'witness',
        availableFromRound: 1
      },
      {
        id: 'ev_gated_4',
        title: 'دليل 4',
        description: 'بيانات 4',
        category: 'timeline',
        availableFromRound: 2
      }
    ],
    solution: 'الحل'
  };

  const engine = new GameEngine();
  engine.startNewGame(storyWithGatedEvidence, ['أ', 'ب', 'ج', 'د']);
  
  assert(engine.getState().currentRound === 1, 'TEST 3: Game is in Round 1');
  assert(engine.isEvidenceAvailable('ev_round3_only') === false, 'TEST 3: Round 3 evidence is NOT available in Round 1');
  
  const state = engine.revealEvidence('ev_round3_only');
  assert(!state.revealedEvidenceIds.includes('ev_round3_only'), 'TEST 3: Unavailable evidence cannot be revealed');
}

// =========================================================================
// TEST 4: Available evidence can be revealed
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const available = engine.getAvailableUnrevealedEvidence();
  assert(available.length > 0, 'TEST 4: Available unrevealed evidence exists');
  
  const firstAvailable = available[0];
  assert(engine.isEvidenceAvailable(firstAvailable.id) === true, 'TEST 4: isEvidenceAvailable returns true for eligible item');
  
  const state = engine.revealEvidence(firstAvailable.id);
  assert(state.revealedEvidenceIds.includes(firstAvailable.id), 'TEST 4: Available evidence is successfully revealed');
}

// =========================================================================
// TEST 5: Evidence cannot be revealed twice
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const available = engine.getAvailableUnrevealedEvidence();
  const firstId = available[0].id;

  engine.revealEvidence(firstId);
  assert(engine.getState().revealedEvidenceIds.filter(id => id === firstId).length === 1, 'TEST 5: Evidence revealed once');
  assert(engine.isEvidenceAvailable(firstId) === false, 'TEST 5: Revealed evidence is no longer marked available to re-reveal');

  // Attempting to reveal again
  engine.revealEvidence(firstId);
  assert(engine.getState().revealedEvidenceIds.filter(id => id === firstId).length === 1, 'TEST 5: Evidence cannot be revealed twice');
}

// =========================================================================
// TEST 6: Evidence availability does NOT depend on hardcoded evidence IDs
// =========================================================================
{
  const customIdStory: Story = {
    id: 'custom_id_story',
    title: 'قصة بمعرفات عشوائية',
    description: 'وصف',
    minPlayers: 4,
    maxPlayers: 4,
    introduction: { setting: 'س', situation: 'و', incident: 'ح', stakes: 'م', objective: 'هـ' },
    guiltyPool: [{ name: 'ج', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: true }],
    innocentPool: [
      { name: 'ب1', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب2', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب3', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false }
    ],
    clues: [],
    wrongVoteHints: [],
    investigationRounds: [],
    evidence: [
      {
        id: 'arbitrary_key_xyz_998',
        title: 'أثر معرف حر',
        description: 'محتوى الأثر',
        category: 'location',
        availableFromRound: 1
      },
      {
        id: 'arbitrary_key_2',
        title: 'أثر 2',
        description: 'محتوى 2',
        category: 'physical',
        availableFromRound: 1
      },
      {
        id: 'arbitrary_key_3',
        title: 'أثر 3',
        description: 'محتوى 3',
        category: 'witness',
        availableFromRound: 2
      },
      {
        id: 'arbitrary_key_4',
        title: 'أثر 4',
        description: 'محتوى 4',
        category: 'timeline',
        availableFromRound: 2
      }
    ],
    solution: 'الحل'
  };

  const engine = new GameEngine();
  engine.startNewGame(customIdStory, ['أ', 'ب', 'ج', 'د']);

  assert(engine.isEvidenceAvailable('arbitrary_key_xyz_998') === true, 'TEST 6: Custom arbitrary ID evidence is recognized and available');
  engine.revealEvidence('arbitrary_key_xyz_998');
  assert(engine.getState().revealedEvidenceIds.includes('arbitrary_key_xyz_998'), 'TEST 6: Custom arbitrary ID evidence is revealed properly');
}

// =========================================================================
// TEST 7: Evidence does NOT directly state guilt
// =========================================================================
{
  for (const story of builtInStories) {
    const allEvidence = StoryEngine.getStoryEvidence(story);
    for (const item of allEvidence) {
      const text = `${item.title} ${item.description} ${item.publicClue || ''}`;
      const hasDirectGuiltAccusation = /القاتل هو|هو القاتل|هي القاتلة|أثبتت الجريمة على|ارتكب الجريمة بالفعل/.test(text);
      assert(!hasDirectGuiltAccusation, `TEST 7 [${story.id} - ${item.id}]: Evidence does not directly declare guilt`);
    }
  }
}

// =========================================================================
// TEST 8: Discussion uses GameState & transitions correctly
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  // Complete role pass to reach discussion
  engine.advanceRolePass();
  engine.advanceRolePass();
  engine.advanceRolePass();
  const state = engine.advanceRolePass();

  assert(state.phase === 'DISCUSSION', 'TEST 8: Phase transitions to DISCUSSION');
  assert(state.currentRound === 1, 'TEST 8: Discussion is in current round 1');
  assert(Array.isArray(state.players), 'TEST 8: Players accessible from state');
}

// =========================================================================
// TEST 9: UI / Query cannot see unrevealed evidence contents as revealed
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const revealed = engine.getRevealedEvidence();
  const unrevealed = engine.getUnrevealedEvidence();

  assert(revealed.length === 0, 'TEST 9: Revealed evidence is empty at start');
  assert(unrevealed.length > 0, 'TEST 9: Unrevealed evidence exists in story');
  
  // Verify revealedEvidenceIds only contains revealed IDs
  for (const item of unrevealed) {
    assert(!engine.getState().revealedEvidenceIds.includes(item.id), `TEST 9: Unrevealed item ${item.id} not in state.revealedEvidenceIds`);
  }
}

// =========================================================================
// TEST 10: Custom story with zero evidence works and remains playable
// =========================================================================
{
  const zeroEvidenceStory: Story = {
    id: 'zero_evidence_story',
    title: 'قصة بلا أدلة مادية',
    description: 'وصف',
    minPlayers: 4,
    maxPlayers: 4,
    introduction: { setting: 'س', situation: 'و', incident: 'ح', stakes: 'م', objective: 'هـ' },
    guiltyPool: [{ name: 'ج', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: true }],
    innocentPool: [
      { name: 'ب1', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب2', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب3', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false }
    ],
    clues: [],
    wrongVoteHints: [],
    investigationRounds: [],
    solution: 'الحل'
  };

  const engine = new GameEngine();
  const state = engine.startNewGame(zeroEvidenceStory, ['أ', 'ب', 'ج', 'د']);
  
  assert(state.revealedEvidenceIds.length === 0, 'TEST 10: Zero evidence story has 0 revealed IDs');
  assert(engine.getAllEvidence().length === 0, 'TEST 10: getAllEvidence returns empty array');
  assert(engine.hasMoreEvidence() === false, 'TEST 10: hasMoreEvidence is false');
  assert(engine.hasAvailableEvidence() === false, 'TEST 10: hasAvailableEvidence is false');

  engine.startDiscussion();
  assert(engine.getState().phase === 'DISCUSSION', 'TEST 10: Discussion phase functions normally with 0 evidence');
}

// =========================================================================
// TEST 11: Custom story with evidence works
// =========================================================================
{
  const customStory: Story = {
    id: 'custom_with_evidence',
    title: 'قصة مخصصة بأدلة',
    description: 'وصف',
    minPlayers: 4,
    maxPlayers: 4,
    introduction: { setting: 'س', situation: 'و', incident: 'ح', stakes: 'م', objective: 'هـ' },
    guiltyPool: [{ name: 'ج', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: true }],
    innocentPool: [
      { name: 'ب1', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب2', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false },
      { name: 'ب3', profession: 'م', publicIdentity: 'ه', knowledge: 'ك', guilty: false }
    ],
    clues: [],
    wrongVoteHints: [],
    investigationRounds: [],
    evidence: [
      { id: 'c_ev_1', title: 'دليل 1', description: 'وصف 1', category: 'motive', availableFromRound: 1 },
      { id: 'c_ev_2', title: 'دليل 2', description: 'وصف 2', category: 'timeline', availableFromRound: 2 }
    ],
    solution: 'الحل'
  };

  const engine = new GameEngine();
  engine.startNewGame(customStory, ['أ', 'ب', 'ج', 'د']);

  assert(engine.getAllEvidence().length === 2, 'TEST 11: Custom story loads 2 evidence items');
  assert(engine.getAvailableUnrevealedEvidence().length === 1, 'TEST 11: Only round 1 evidence is available in round 1');
  
  engine.revealNextEvidence();
  assert(engine.getState().revealedEvidenceIds.includes('c_ev_1'), 'TEST 11: First custom evidence revealed');
  assert(!engine.getState().revealedEvidenceIds.includes('c_ev_2'), 'TEST 11: Second custom evidence still unrevealed');
}

// =========================================================================
// TEST 12: No automatic evidence flood occurs on discussion enter
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  
  // Enter discussion directly
  engine.startDiscussion();
  assert(engine.getState().revealedEvidenceIds.length === 0, 'TEST 12: Entering discussion does NOT auto-reveal investigation evidence');
}

// =========================================================================
// TEST 13 & 14: No secret mechanics / No objective mechanics
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  for (const p of state.players) {
    assert((p as any).secret === undefined, 'TEST 13: Player has no secret property');
    assert((p as any).privateSecret === undefined, 'TEST 13: Player has no privateSecret property');
    assert((p as any).objective === undefined, 'TEST 14: Player has no objective property');
    assert((p as any).mission === undefined, 'TEST 14: Player has no mission property');
    assert((p as any).playerObjective === undefined, 'TEST 14: Player has no playerObjective property');
  }
}

console.log(`\n==================================================`);
console.log(`PHASE 5 ALL TESTS PASSED: ${passedTests} passed, ${failedTests} failed.`);
console.log(`==================================================\n`);
