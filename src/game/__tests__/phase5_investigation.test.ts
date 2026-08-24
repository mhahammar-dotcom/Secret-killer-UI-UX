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

console.log('=== RUNNING PHASE 5 DISCUSSION & EVIDENCE TEST SUITE ===\n');

const builtInStories = StoryStore.getBuiltInStories();
assert(builtInStories.length > 0, 'Built-in stories exist');
const sampleStory = builtInStories[0];

// =========================================================================
// TEST 1: RolePass completes and transitions cleanly to DISCUSSION
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['فارس', 'رانيا', 'طارق', 'هدى'];
  engine.startNewGame(sampleStory, playerNames);
  
  // Advance through 4 players
  engine.advanceRolePass(); // 1 -> 2
  engine.advanceRolePass(); // 2 -> 3
  engine.advanceRolePass(); // 3 -> 4
  const finalState = engine.advanceRolePass(); // 4 -> finishes role pass

  assert(finalState.phase === 'DISCUSSION', 'TEST 1: Completed role-pass lands on DISCUSSION phase');
  assert(finalState.currentRound === 1, 'TEST 1: Round starts at 1');
  assert(Array.isArray(finalState.revealedEvidenceIds), 'TEST 1: revealedEvidenceIds is initialized as array');
}

// =========================================================================
// TEST 2: Direct startDiscussion transitions cleanly to DISCUSSION
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['فارس', 'رانيا', 'طارق', 'هدى'];
  engine.startNewGame(sampleStory, playerNames);
  const state = engine.startDiscussion();

  assert(state.phase === 'DISCUSSION', 'TEST 2: startDiscussion transitions to DISCUSSION phase');
  assert(state.revealedClues.length > 0, 'TEST 2: revealedClues contains initial clues');
}

// =========================================================================
// TEST 3: StoryEngine.getStoryEvidence extracts valid EvidenceItems
// =========================================================================
{
  const evidenceList = StoryEngine.getStoryEvidence(sampleStory);
  assert(evidenceList.length > 0, 'TEST 3: StoryEngine returns evidence items for story');
  for (const item of evidenceList) {
    assert(Boolean(item.id), 'TEST 3: EvidenceItem has unique id');
    assert(Boolean(item.title), 'TEST 3: EvidenceItem has title');
    assert(Boolean(item.description || item.publicClue), 'TEST 3: EvidenceItem has description or publicClue');
    assert(Boolean(item.category), `TEST 3: EvidenceItem has valid category (${item.category})`);
  }
}

// =========================================================================
// TEST 4: Evidence Categorization helper works correctly
// =========================================================================
{
  assert(StoryEngine.categorizeEvidence('تقرير المستندات', 'سجل الفواتير') === 'document', 'TEST 4: Document categorization');
  assert(StoryEngine.categorizeEvidence('توقيت الحادث', 'الساعة 11:30') === 'timeline', 'TEST 4: Timeline categorization');
  assert(StoryEngine.categorizeEvidence('إفادة الحارس', 'شاهد شخصاً يمر') === 'witness', 'TEST 4: Witness categorization');
  assert(StoryEngine.categorizeEvidence('خزنة الممر', 'موقع الجريمة') === 'location', 'TEST 4: Location categorization');
  assert(StoryEngine.categorizeEvidence('تناقض الأقوال', 'اختلاف في الرواية') === 'contradiction', 'TEST 4: Contradiction categorization');
  assert(StoryEngine.categorizeEvidence('بصمة وسكين', 'أداة معدنية ملوثة') === 'physical', 'TEST 4: Physical categorization');
}

// =========================================================================
// TEST 5: GameEngine evidence query and mutation methods
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['فارس', 'رانيا', 'طارق', 'هدى'];
  engine.startNewGame(sampleStory, playerNames);

  const all = engine.getAllEvidence();
  assert(all.length > 0, 'TEST 5: getAllEvidence returns all story evidence');

  const revealed = engine.getRevealedEvidence();
  assert(revealed.length >= 1, 'TEST 5: Initial evidence is revealed at start');

  const initialRevealedCount = revealed.length;
  if (engine.hasMoreEvidence()) {
    const unrevealed = engine.getUnrevealedEvidence();
    const nextItem = unrevealed[0];
    
    // Reveal specific item
    const stateAfterReveal = engine.revealEvidence(nextItem.id);
    assert(stateAfterReveal.revealedEvidenceIds.includes(nextItem.id), 'TEST 5: revealEvidence adds ID to state');
    assert(engine.getRevealedEvidence().length === initialRevealedCount + 1, 'TEST 5: Revealed count increases by 1');
  }
}

// =========================================================================
// TEST 6: revealNextEvidence progresses sequentially without cycling
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['فارس', 'رانيا', 'طارق', 'هدى'];
  engine.startNewGame(sampleStory, playerNames);

  const total = engine.getAllEvidence().length;
  // Reveal all until none left
  while (engine.hasMoreEvidence()) {
    engine.revealNextEvidence();
  }

  assert(engine.getRevealedEvidence().length === total, 'TEST 6: All available evidence revealed');
  assert(engine.hasMoreEvidence() === false, 'TEST 6: hasMoreEvidence returns false when exhausted');

  // Calling revealNextEvidence again should be a safe no-op (no crash, no duplicate, no loop)
  const stateBefore = engine.getState();
  const stateAfter = engine.revealNextEvidence();
  assert(stateAfter.revealedEvidenceIds.length === stateBefore.revealedEvidenceIds.length, 'TEST 6: Safe no-op on exhausted evidence');
}

// =========================================================================
// TEST 7: No cycling rule in StoryEngine.getInvestigationRound
// =========================================================================
{
  const round99 = StoryEngine.getInvestigationRound(sampleStory, 99);
  assert(round99 === null, 'TEST 7: getInvestigationRound returns null for non-existent round, no cycling');
}

// =========================================================================
// TEST 8: All built-in stories support the new evidence system seamlessly
// =========================================================================
{
  for (const story of builtInStories) {
    const engine = new GameEngine();
    const playerNames = ['أحمد', 'سارة', 'كريم', 'ليلى'];
    const state = engine.startNewGame(story, playerNames);
    assert(state.phase === 'ROLE_PASS', `TEST 8 [${story.id}]: Starts in ROLE_PASS`);
    
    const evidence = engine.getAllEvidence();
    assert(Array.isArray(evidence), `TEST 8 [${story.id}]: Evidence list is valid array`);
    
    engine.startDiscussion();
    assert(engine.getState().phase === 'DISCUSSION', `TEST 8 [${story.id}]: Discussion phase works`);
  }
}

console.log(`\n==================================================`);
console.log(`All Phase 5 Discussion & Evidence Tests Passed! (${passedTests} checks)`);
console.log(`==================================================\n`);
