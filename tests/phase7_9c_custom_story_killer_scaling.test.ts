import { GameEngine } from '../src/game/GameEngine';
import { StoryEngine } from '../src/game/StoryEngine';
import { getKillerCount } from '../src/game/PlayerManager';
import { StorySolutionEngine } from '../src/game/StorySolutionEngine';
import { Story, StoryCharacter, EvidenceItem } from '../src/game/types';
import { StoryCharacterData, StoryData } from '../src/types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failed++;
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    passed++;
  }
}

console.log('====================================================');
console.log('PHASE 7.9-C: CUSTOM STORY KILLER-SCALING REGRESSION SUITE');
console.log('====================================================\n');

// Helper to construct a custom story matching CustomStoryModal output
function createCustomStory(
  characterCount: number,
  guiltyIndices: number[]
): Story {
  const characters: StoryCharacter[] = Array.from({ length: characterCount }, (_, i) => ({
    name: `Char_${i + 1}`,
    profession: `Profession_${i + 1}`,
    publicIdentity: `Identity_${i + 1}`,
    knowledge: `Secret_${i + 1}`,
    guilty: guiltyIndices.includes(i),
  }));

  const guiltyPool = characters.filter((c) => c.guilty);
  const innocentPool = characters.filter((c) => !c.guilty);

  const evidenceItems: EvidenceItem[] = Array.from(
    { length: Math.max(characterCount, 12) },
    (_, i) => ({
      id: `ev_custom_${i + 1}`,
      title: `Evidence #${i + 1}`,
      description: `Forensic observation #${i + 1} at crime scene.`,
      publicClue: `Scene clue #${i + 1}.`,
      discussionPrompt: `Discuss clue #${i + 1}.`,
      category: 'physical' as const,
      availableFromRound: Math.min(i + 1, 3),
      isInitialPublic: false,
    })
  );

  return {
    id: `custom_${Date.now()}_${characterCount}`,
    title: `Custom Mystery ${characterCount}`,
    description: `A customized mystery case designed for ${characterCount} players.`,
    minPlayers: characterCount,
    maxPlayers: characterCount,
    isCustom: true,
    guiltyPool,
    innocentPool,
    fixedCharacters: characters,
    evidence: evidenceItems,
    clues: evidenceItems.map((e) => e.publicClue || e.description),
    wrongVoteHints: ['Review the evidence carefully.'],
    solution: 'The perpetrator confessed to the crime.',
    introduction: {
      setting: 'Custom Crime Scene',
      situation: 'Detailed case background',
      incident: 'A crime occurred.',
      stakes: 'Expose the culprit.',
      objective: 'Find the truth.',
    },
    investigationRounds: evidenceItems.map((e, idx) => ({
      roundNumber: idx + 1,
      title: e.title,
      publicClue: e.publicClue || e.description,
      description: e.description,
      discussionPrompt: e.discussionPrompt,
    })),
  };
}

// =========================================================================
// 1. MULTI-SELECTION & DESELECTION LOGIC
// =========================================================================
console.log('--- 1. Testing Multi-Selection & Deselection State Behavior ---');

// Emulate CustomStoryModal handleToggleGuilty
function toggleGuilty(characters: StoryCharacterData[], idx: number): StoryCharacterData[] {
  return characters.map((c, i) => (i === idx ? { ...c, guilty: !c.guilty } : c));
}

let chars: StoryCharacterData[] = [
  { name: 'A', profession: 'Doc', publicIdentity: 'ID A', knowledge: 'K A', guilty: false },
  { name: 'B', profession: 'Lawyer', publicIdentity: 'ID B', knowledge: 'K B', guilty: false },
  { name: 'C', profession: 'Chef', publicIdentity: 'ID C', knowledge: 'K C', guilty: false },
  { name: 'D', profession: 'Pilot', publicIdentity: 'ID D', knowledge: 'K D', guilty: false },
];

// 1. Single-selection is replaced by multi-selection
chars = toggleGuilty(chars, 0); // Select A
chars = toggleGuilty(chars, 1); // Select B
chars = toggleGuilty(chars, 2); // Select C
assert(chars[0].guilty === true, 'Requirement 1: Character A remains selected');
assert(chars[1].guilty === true, 'Requirement 1: Character B remains selected alongside A');
assert(chars[2].guilty === true, 'Requirement 1: Character C remains selected alongside A and B');
assert(chars[3].guilty === false, 'Requirement 1: Character D remains unselected');
assert(chars.filter((c) => c.guilty).length === 3, 'Requirement 1: Multi-selection allows 3 candidates selected simultaneously');

// 2. Deselecting one candidate leaves remaining candidates selected
chars = toggleGuilty(chars, 1); // Deselect B
assert(chars[0].guilty === true, 'Requirement 2: Character A is still selected after deselecting B');
assert(chars[1].guilty === false, 'Requirement 2: Character B is now deselected');
assert(chars[2].guilty === true, 'Requirement 2: Character C is still selected after deselecting B');
assert(chars[3].guilty === false, 'Requirement 2: Character D remains unselected');
assert(chars.filter((c) => c.guilty).length === 2, 'Requirement 2: Exactly A and C remain selected');

// =========================================================================
// 2. SCALING MATRIX VALIDATION SUITE (Requirements 3 - 15)
// =========================================================================
console.log('\n--- 2. Testing Scaling Matrix Validation Suite ---');

// 3. 4-character custom story requires at least 1 candidate
const story4_valid = createCustomStory(4, [0]);
const val4 = StoryEngine.validateStory(story4_valid);
assert(val4.valid === true, 'Requirement 3: 4-character custom story with 1 candidate is valid');

// 4. 5-character custom story requires at least 1 candidate
const story5_valid = createCustomStory(5, [0]);
const val5 = StoryEngine.validateStory(story5_valid);
assert(val5.valid === true, 'Requirement 4: 5-character custom story with 1 candidate is valid');

// 5. 6-character custom story requires at least 1 candidate
const story6_valid = createCustomStory(6, [0]);
const val6 = StoryEngine.validateStory(story6_valid);
assert(val6.valid === true, 'Requirement 5: 6-character custom story with 1 candidate is valid');

// 6. 7-character custom story requires at least 2 candidates
const story7_valid = createCustomStory(7, [0, 1]);
const val7 = StoryEngine.validateStory(story7_valid);
assert(val7.valid === true, 'Requirement 6: 7-character custom story with 2 candidates is valid');

// 7. 8-character custom story requires at least 2 candidates
const story8_valid = createCustomStory(8, [0, 1]);
const val8 = StoryEngine.validateStory(story8_valid);
assert(val8.valid === true, 'Requirement 7: 8-character custom story with 2 candidates is valid');

// 8. 9-character custom story requires at least 2 candidates
const story9_valid = createCustomStory(9, [0, 1]);
const val9 = StoryEngine.validateStory(story9_valid);
assert(val9.valid === true, 'Requirement 8: 9-character custom story with 2 candidates is valid');

// 9. 10-character custom story requires at least 3 candidates
const story10_valid = createCustomStory(10, [0, 1, 2]);
const val10 = StoryEngine.validateStory(story10_valid);
assert(val10.valid === true, 'Requirement 9: 10-character custom story with 3 candidates is valid');

// 10. 11-character custom story requires at least 3 candidates
const story11_valid = createCustomStory(11, [0, 1, 2]);
const val11 = StoryEngine.validateStory(story11_valid);
assert(val11.valid === true, 'Requirement 10: 11-character custom story with 3 candidates is valid');

// 11. 12-character custom story requires at least 3 candidates
const story12_valid = createCustomStory(12, [0, 1, 2]);
const val12 = StoryEngine.validateStory(story12_valid);
assert(val12.valid === true, 'Requirement 11: 12-character custom story with 3 candidates is valid');

// 12. 7-character custom story with only 1 candidate fails validation
const story7_invalid = createCustomStory(7, [0]);
const val7_inv = StoryEngine.validateStory(story7_invalid);
assert(val7_inv.valid === false, 'Requirement 12: 7-character custom story with 1 candidate fails validation');
assert(
  val7_inv.errors.some((e) => e.includes('requires 2 killers') && e.includes('only has 1')),
  'Requirement 12: Error message explicitly identifies 2 killers required for 7 players'
);

// 13. 8-character custom story with only 1 candidate fails validation
const story8_invalid = createCustomStory(8, [0]);
const val8_inv = StoryEngine.validateStory(story8_invalid);
assert(val8_inv.valid === false, 'Requirement 13: 8-character custom story with 1 candidate fails validation');
assert(
  val8_inv.errors.some((e) => e.includes('requires 2 killers') && e.includes('only has 1')),
  'Requirement 13: Error message explicitly identifies 2 killers required for 8 players'
);

// 14. 10-character custom story with only 2 candidates fails validation
const story10_invalid = createCustomStory(10, [0, 1]);
const val10_inv = StoryEngine.validateStory(story10_invalid);
assert(val10_inv.valid === false, 'Requirement 14: 10-character custom story with 2 candidates fails validation');
assert(
  val10_inv.errors.some((e) => e.includes('requires 3 killers') && e.includes('only has 2')),
  'Requirement 14: Error message explicitly identifies 3 killers required for 10 players'
);

// 15. 12-character custom story with only 2 candidates fails validation
const story12_invalid = createCustomStory(12, [0, 1]);
const val12_inv = StoryEngine.validateStory(story12_invalid);
assert(val12_inv.valid === false, 'Requirement 15: 12-character custom story with 2 candidates fails validation');
assert(
  val12_inv.errors.some((e) => e.includes('requires 3 killers') && e.includes('only has 2')),
  'Requirement 15: Error message explicitly identifies 3 killers required for 12 players'
);

// =========================================================================
// 3. SURPLUS POOL AND RUNTIME INTEGRITY (Requirements 16, 17, 18)
// =========================================================================
console.log('\n--- 3. Testing Surplus Pool and Runtime Guilt Integrity ---');

// 16. guiltyPool size can exceed minimum requirement (e.g., 4 candidates for 8 players)
const story8_surplus = createCustomStory(8, [0, 1, 2, 3]); // 4 candidates for 8 players
const val8_surplus = StoryEngine.validateStory(story8_surplus);
assert(val8_surplus.valid === true, 'Requirement 16: 8-character custom story with 4 candidates is valid');
assert(story8_surplus.guiltyPool.length === 4, 'Requirement 16: guiltyPool length is 4');

// 17. At runtime, actual killers match getKillerCount(playerCount), NOT guiltyPool.length
const engine8 = new GameEngine();
const playerNames8 = Array.from({ length: 8 }, (_, i) => `Player_${i + 1}`);
engine8.startNewGame(story8_surplus, playerNames8);

const state8 = engine8.getState();
const actualKillers8 = state8.players.filter((p) => p.guilty);
const actualKillerNames8 = actualKillers8.map((p) => p.character.name);
assert(
  actualKillers8.length === getKillerCount(8),
  `Requirement 17: Runtime actual killers (${actualKillers8.length}) strictly equals getKillerCount(8) = 2, NOT guiltyPool.length (4)`
);

// 18. Non-selected candidates in guiltyPool are treated as innocent players in active game
const allCandidateNames8 = story8_surplus.guiltyPool.map((c) => c.name);
const unselectedCandidates8 = allCandidateNames8.filter((name) => !actualKillerNames8.includes(name));
assert(
  unselectedCandidates8.length === 2,
  'Requirement 18: Exactly 2 surplus candidates remain unselected as killers'
);

for (const unselectedName of unselectedCandidates8) {
  const player = state8.players.find((p) => p.character.name === unselectedName);
  assert(player !== undefined, `Requirement 18: Unselected candidate ${unselectedName} is present in player roster`);
  assert(
    player?.guilty === false,
    `Requirement 18: Unselected candidate ${unselectedName} has player.guilty === false`
  );
  assert(
    player?.character.guilty === false,
    `Requirement 18: Unselected candidate ${unselectedName} has character.guilty === false`
  );
}

// Verify StorySolutionEngine handles custom story solution cleanly with actual killers
const truthText = StorySolutionEngine.generateSolution(
  story8_surplus,
  actualKillers8,
  state8.players.filter((p) => !p.guilty),
  'ar'
);
assert(truthText.length > 0, 'Requirement 18: StorySolutionEngine generates valid solution for custom story');
assert(
  truthText.includes('The perpetrator confessed'),
  'Requirement 18: Solution text accurately renders custom story solution'
);

// =========================================================================
// 4. FULL FLOW ACROSS 4–12 PLAYERS (Section 10 Scenarios A–H)
// =========================================================================
console.log('\n--- 4. Full Flow Across 4–12 Players (Scenarios A–H) ---');

const testCases = [
  { count: 4, poolIndices: [0, 1], expectedKillers: 1, label: 'A. 4-player custom story' },
  { count: 5, poolIndices: [0, 1], expectedKillers: 1, label: 'B. 5-player custom story' },
  { count: 6, poolIndices: [0, 1, 2], expectedKillers: 1, label: 'C. 6-player custom story' },
  { count: 7, poolIndices: [0, 1, 2], expectedKillers: 2, label: 'D. 7-player custom story' },
  { count: 8, poolIndices: [0, 1, 2, 3], expectedKillers: 2, label: 'E. 8-player custom story' },
  { count: 9, poolIndices: [0, 1, 2, 3], expectedKillers: 2, label: 'F. 9-player custom story' },
  { count: 10, poolIndices: [0, 1, 2, 3], expectedKillers: 3, label: 'G. 10-player custom story' },
  { count: 11, poolIndices: [0, 1, 2, 3, 4], expectedKillers: 3, label: 'H. 11-player custom story' },
  { count: 12, poolIndices: [0, 1, 2, 3, 4, 5], expectedKillers: 3, label: 'I. 12-player custom story' },
];

for (const tc of testCases) {
  const story = createCustomStory(tc.count, tc.poolIndices);
  const val = StoryEngine.validateStory(story);
  assert(val.valid === true, `${tc.label}: Validates cleanly`);

  const engine = new GameEngine();
  const playerNames = Array.from({ length: tc.count }, (_, i) => `User_${i + 1}`);
  engine.startNewGame(story, playerNames);

  const gameState = engine.getState();
  assert(gameState.phase === 'ROLE_PASS', `${tc.label}: Enters ROLE_PASS`);
  assert(gameState.players.length === tc.count, `${tc.label}: Correct player roster size`);

  const activeKillers = gameState.players.filter((p) => p.guilty);
  assert(
    activeKillers.length === tc.expectedKillers,
    `${tc.label}: Exactly ${tc.expectedKillers} actual killer(s) allocated (getKillerCount(${tc.count}) = ${tc.expectedKillers})`
  );

  const poolNames = story.guiltyPool.map((c) => c.name);
  const activeNames = activeKillers.map((p) => p.character.name);
  const allFromPool = activeNames.every((n) => poolNames.includes(n));
  assert(allFromPool, `${tc.label}: All actual killers are members of guiltyPool`);

  // Verify total clues economy matches player count
  assert(
    gameState.totalClues === tc.count,
    `${tc.label}: Total clues (${gameState.totalClues}) equals player count (${tc.count})`
  );
}

console.log('\n====================================================');
console.log(`ALL PHASE 7.9-C TESTS PASSED! (${passed} assertions, ${failed} failures)`);
console.log('====================================================');
