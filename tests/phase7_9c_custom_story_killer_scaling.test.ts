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
  guiltyIndices: number[],
  customSolution?: string,
  lang: 'ar' | 'en' = 'en'
): Story {
  const isEn = lang === 'en';
  const characters: StoryCharacter[] = Array.from({ length: characterCount }, (_, i) => ({
    name: isEn ? `Char_${i + 1}` : `شخصية_${i + 1}`,
    profession: isEn ? `Profession_${i + 1}` : `مهنة_${i + 1}`,
    publicIdentity: isEn ? `Public identity of Char_${i + 1}` : `الهوية العامة لشخصية_${i + 1}`,
    knowledge: isEn ? `Secret knowledge of Char_${i + 1}` : `المعلومة السرية لشخصية_${i + 1}`,
    guilty: guiltyIndices.includes(i),
  }));

  const guiltyPool = characters.filter((c) => c.guilty);
  const innocentPool = characters.filter((c) => !c.guilty);

  // Minimal creator-derived evidence: exactly characterCount items
  const sceneEvidence: EvidenceItem = {
    id: 'ev_custom_1',
    title: isEn ? `Crime Scene: Custom Mystery ${characterCount}` : `مسرح الجريمة: قصة مخصصة ${characterCount}`,
    description: isEn
      ? `A customized mystery case designed for ${characterCount} players.`
      : `قضية غامضة مخصصة لـ ${characterCount} لاعبين.`,
    publicClue: isEn
      ? `A customized mystery case designed for ${characterCount} players.`
      : `قضية غامضة مخصصة لـ ${characterCount} لاعبين.`,
    discussionPrompt: isEn
      ? 'Examine the initial crime scene details and verify each suspect’s alibi.'
      : 'ناقشوا تفاصيل مسرح الحادث وتحققوا من إفادات وتحركات المشتبه بهم.',
    category: 'physical',
    availableFromRound: 1,
    isInitialPublic: false,
  };

  const characterEvidence: EvidenceItem[] = characters.slice(1).map((char, idx) => ({
    id: `ev_custom_${idx + 2}`,
    title: isEn ? `Statement: ${char.name} (${char.profession})` : `إفادة: ${char.name} (${char.profession})`,
    description: char.publicIdentity || '',
    publicClue: char.publicIdentity || '',
    discussionPrompt: isEn
      ? `Review ${char.name}'s statements and look for inconsistencies.`
      : `راجعوا إفادة ${char.name} وابحثوا عن أي تناقضات مع باقي الأقوال.`,
    category: 'witness',
    availableFromRound: 1,
    isInitialPublic: false,
  }));

  const evidenceItems: EvidenceItem[] = [sceneEvidence, ...characterEvidence];

  return {
    id: `custom_${Date.now()}_${characterCount}_${Math.random().toString(36).substring(2, 7)}`,
    title: isEn ? `Custom Mystery ${characterCount}` : `قضية مخصصة ${characterCount}`,
    description: isEn
      ? `A customized mystery case designed for ${characterCount} players.`
      : `قضية غامضة مخصصة لـ ${characterCount} لاعبين.`,
    minPlayers: characterCount,
    maxPlayers: characterCount,
    isCustom: true,
    guiltyPool,
    innocentPool,
    fixedCharacters: characters,
    evidence: evidenceItems,
    clues: evidenceItems.map((e) => e.publicClue || e.description),
    wrongVoteHints: [isEn ? 'Review the evidence carefully.' : 'راجعوا الأدلة بعناية.'],
    solution:
      customSolution !== undefined
        ? customSolution
        : isEn
        ? 'The perpetrator confessed to the crime.'
        : 'اعترف الجاني بارتكاب الجريمة بعد مواجهته بالأدلة الدامغة.',
    introduction: {
      setting: isEn ? 'Custom Crime Scene' : 'مسرح الحادث المخصص',
      situation: isEn ? 'Detailed case background' : 'تفاصيل خلفية القضية',
      incident: isEn ? 'A crime occurred.' : 'وقعت حادثة غامضة.',
      stakes: isEn ? 'Expose the culprit.' : 'كشف الجاني.',
      objective: isEn ? 'Find the truth.' : 'معرفة الحقيقة.',
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
// 3. SURPLUS POOL AND RUNTIME INTEGRITY (Section 7 Items 1 & 2)
// =========================================================================
console.log('\n--- 3. Testing Surplus Pool and Runtime Guilt Integrity ---');

// Item 1: 8-player story with 4 possible killers
// - guiltyPool=4
// - actual selected killers=2
// - remaining 2 candidates are innocent
// - character.guilty is false
// - player.guilty is false
const story8_surplus = createCustomStory(8, [0, 1, 2, 3]); // 4 candidates for 8 players
const val8_surplus = StoryEngine.validateStory(story8_surplus);
assert(val8_surplus.valid === true, 'Requirement 16: 8-character custom story with 4 candidates is valid');
assert(story8_surplus.guiltyPool.length === 4, 'Requirement 16: guiltyPool length is 4');

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

// Item 2: 12-player story with 5+ possible killers
// - guiltyPool > 3 (5 candidates for 12 players)
// - actual selected killers=3
// - remaining candidates are innocent
const story12_surplus = createCustomStory(12, [0, 1, 2, 3, 4]); // 5 candidates for 12 players
const val12_surplus = StoryEngine.validateStory(story12_surplus);
assert(val12_surplus.valid === true, 'Requirement 19: 12-character custom story with 5 candidates is valid');
assert(story12_surplus.guiltyPool.length === 5, 'Requirement 19: guiltyPool length is 5 (> 3)');

const engine12 = new GameEngine();
const playerNames12 = Array.from({ length: 12 }, (_, i) => `Player12_${i + 1}`);
engine12.startNewGame(story12_surplus, playerNames12);

const state12 = engine12.getState();
const actualKillers12 = state12.players.filter((p) => p.guilty);
const actualKillerNames12 = actualKillers12.map((p) => p.character.name);
assert(
  actualKillers12.length === getKillerCount(12),
  `Requirement 19: Runtime actual killers (${actualKillers12.length}) strictly equals getKillerCount(12) = 3, NOT guiltyPool.length (5)`
);

const allCandidateNames12 = story12_surplus.guiltyPool.map((c) => c.name);
const unselectedCandidates12 = allCandidateNames12.filter((name) => !actualKillerNames12.includes(name));
assert(
  unselectedCandidates12.length === 2,
  'Requirement 19: Exactly 2 surplus candidates remain unselected as killers (5 - 3 = 2)'
);

for (const unselectedName of unselectedCandidates12) {
  const player = state12.players.find((p) => p.character.name === unselectedName);
  assert(player !== undefined, `Requirement 19: Unselected candidate ${unselectedName} is present in player roster`);
  assert(
    player?.guilty === false,
    `Requirement 19: Unselected candidate ${unselectedName} has player.guilty === false`
  );
  assert(
    player?.character.guilty === false,
    `Requirement 19: Unselected candidate ${unselectedName} has character.guilty === false`
  );
}

// =========================================================================
// 4. CONTENT PRESERVATION (Section 7 Item 3)
// =========================================================================
console.log('\n--- 4. Testing Creator-Authored Content Preservation ---');

const authoredStory: Story = {
  id: 'custom_authored_1',
  title: 'سرقة المخطوطة القديمة',
  description: 'اختفت المخطوطة النادرة من قاعة الأرشيف المغلقة دون كسر في الأبواب.',
  minPlayers: 4,
  maxPlayers: 4,
  isCustom: true,
  guiltyPool: [
    {
      name: 'سامي النجار',
      profession: 'أمين الأرشيف',
      publicIdentity: 'شوهد في القاعة المجاورة يتفحص الملفات',
      knowledge: 'يعلم بالرمز السري لقفل الخزانة',
      guilty: true,
    },
    {
      name: 'هدى سليم',
      profession: 'باحثة آثار',
      publicIdentity: 'كانت تجري أبحاثاً حتى ساعة متأخرة',
      knowledge: 'تمتلك مفتاحاً احتياطياً للأرشيف',
      guilty: true,
    },
  ],
  innocentPool: [
    {
      name: 'كريم عادل',
      profession: 'حارس أمن',
      publicIdentity: 'قام بجولة تفقدية منتظمة في الساعة العاشرة',
      knowledge: 'لاحظ انقطاع الكهرباء للحظات',
      guilty: false,
    },
    {
      name: 'منى الشريف',
      profession: 'مديرة المركز',
      publicIdentity: 'غادرت المركز قبل الحادث بنصف ساعة',
      knowledge: 'تلقت مكالمة هاتفية مريبة قبل المغادرة',
      guilty: false,
    },
  ],
  fixedCharacters: [
    {
      name: 'سامي النجار',
      profession: 'أمين الأرشيف',
      publicIdentity: 'شوهد في القاعة المجاورة يتفحص الملفات',
      knowledge: 'يعلم بالرمز السري لقفل الخزانة',
      guilty: true,
    },
    {
      name: 'هدى سليم',
      profession: 'باحثة آثار',
      publicIdentity: 'كانت تجري أبحاثاً حتى ساعة متأخرة',
      knowledge: 'تمتلك مفتاحاً احتياطياً للأرشيف',
      guilty: true,
    },
    {
      name: 'كريم عادل',
      profession: 'حارس أمن',
      publicIdentity: 'قام بجولة تفقدية منتظمة في الساعة العاشرة',
      knowledge: 'لاحظ انقطاع الكهرباء للحظات',
      guilty: false,
    },
    {
      name: 'منى الشريف',
      profession: 'مديرة المركز',
      publicIdentity: 'غادرت المركز قبل الحادث بنصف ساعة',
      knowledge: 'تلقت مكالمة هاتفية مريبة قبل المغادرة',
      guilty: false,
    },
  ],
  clues: [
    'الأثر 1: بصمات مجهولة على الخزانة',
    'الأثر 2: بقايا شمع على طاولة الأرشيف',
    'الأثر 3: بطاقة دخول مفقودة',
    'الأثر 4: تسلسل كاميرات المراقبة',
  ],
  evidence: [
    {
      id: 'ev_1',
      title: 'بصمات الخزانة',
      description: 'بصمات أصابع واضحة على مقبض الخزانة الزجاجية.',
      publicClue: 'الأثر 1: بصمات مجهولة على الخزانة',
      discussionPrompt: 'من كان آخر من لمس مقبض الخزانة؟',
      category: 'physical',
      availableFromRound: 1,
      isInitialPublic: false,
    },
    {
      id: 'ev_2',
      title: 'بقايا الشمع',
      description: 'قطرات شمع محترق عثر عليها تحت طاولة الأرشيف.',
      publicClue: 'الأثر 2: بقايا شمع على طاولة الأرشيف',
      discussionPrompt: 'لماذا استخدم أحدهم شمعة رغم وجود إضاءة الطوارئ؟',
      category: 'physical',
      availableFromRound: 1,
      isInitialPublic: false,
    },
    {
      id: 'ev_3',
      title: 'بطاقة الدخول',
      description: 'بطاقة دخول إلكترونية مسجلة باسم أحد الموظفين.',
      publicClue: 'الأثر 3: بطاقة دخول مفقودة',
      discussionPrompt: 'كيف وصلت هذه البطاقة إلى أرضية الردهة؟',
      category: 'document',
      availableFromRound: 2,
      isInitialPublic: false,
    },
    {
      id: 'ev_4',
      title: 'تسجيل الكاميرات',
      description: 'تسجيل يوضح ظلاً يمر عبر الممر عند الساعة 10:15.',
      publicClue: 'الأثر 4: تسلسل كاميرات المراقبة',
      discussionPrompt: 'طابقوا توقيت مرور الظل مع إفادات الجميع.',
      category: 'witness',
      availableFromRound: 2,
      isInitialPublic: false,
    },
  ],
  wrongVoteHints: ['راجعوا الأدلة بعناية قبل التصويت.'],
  solution: 'اعترف سامي النجار بأخذ المخطوطة لإخفائها قبل تفتيش الصباح.',
  introduction: {
    setting: 'قاعة الأرشيف الوطني',
    situation: 'اختفت المخطوطة النادرة من قاعة الأرشيف المغلقة دون كسر في الأبواب.',
    incident: 'اختفاء المخطوطة التاريخية.',
    stakes: 'إنقاذ الإرث التاريخي من التهريب.',
    objective: 'من سرق المخطوطة؟',
  },
  investigationRounds: [
    {
      roundNumber: 1,
      title: 'بصمات الخزانة',
      publicClue: 'الأثر 1: بصمات مجهولة على الخزانة',
      description: 'بصمات أصابع واضحة على مقبض الخزانة الزجاجية.',
      discussionPrompt: 'من كان آخر من لمس مقبض الخزانة؟',
    },
  ],
};

// Validate that StoryEngine preserves creator-authored content
const storyEvidence = StoryEngine.getStoryEvidence(authoredStory);
assert(storyEvidence.length === 4, 'Requirement 20: Creator-authored evidence count is preserved (4)');
assert(storyEvidence[0].title === 'بصمات الخزانة', 'Requirement 20: Clue 1 title is preserved without generic overwrite');
assert(storyEvidence[0].description === 'بصمات أصابع واضحة على مقبض الخزانة الزجاجية.', 'Requirement 20: Clue 1 description is preserved');
assert(storyEvidence[1].title === 'بقايا الشمع', 'Requirement 20: Clue 2 title is preserved');

const engineAuthored = new GameEngine();
engineAuthored.startNewGame(authoredStory, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
const stateAuthored = engineAuthored.getState();

// Verify character attributes remain intact
for (const p of stateAuthored.players) {
  const original = authoredStory.fixedCharacters.find((c) => c.name === p.character.name);
  assert(original !== undefined, `Requirement 21: Character ${p.character.name} exists in authored roster`);
  assert(p.character.profession === original?.profession, `Requirement 21: Character profession preserved for ${p.character.name}`);
  assert(p.character.publicIdentity === original?.publicIdentity, `Requirement 21: Character publicIdentity preserved for ${p.character.name}`);
  assert(p.character.knowledge === original?.knowledge, `Requirement 21: Character knowledge preserved for ${p.character.name}`);
}

// Verify author-defined solution is preserved
assert(stateAuthored.story?.solution === authoredStory.solution, 'Requirement 22: Author-defined solution string is preserved intact');

// =========================================================================
// 5. ARABIC VS ENGLISH SOLUTION VALIDATION (Section 7 Item 4)
// =========================================================================
console.log('\n--- 5. Testing Arabic vs English Solution Validation ---');

const arKillers = stateAuthored.players.filter((p) => p.guilty);
const arInnocents = stateAuthored.players.filter((p) => !p.guilty);

// Arabic request returns Arabic solution
const arSolution = StorySolutionEngine.generateSolution(authoredStory, arKillers, arInnocents, 'ar');
assert(arSolution.length > 0, 'Requirement 23: Arabic solution generated successfully');
assert(arSolution === authoredStory.solution, 'Requirement 23: Arabic custom solution returns exact authored Arabic text');
assert(arSolution.includes('اعترف سامي النجار'), 'Requirement 23: Arabic solution contains authored Arabic phrase');
assert(!arSolution.includes('The perpetrator confessed'), 'Requirement 23: Arabic solution contains NO English strings');

// Arabic fallback when story solution is empty
const arEmptyStory = { ...authoredStory, solution: '' };
const arFallbackSolution = StorySolutionEngine.generateSolution(arEmptyStory, arKillers, arInnocents, 'ar');
assert(
  arFallbackSolution === 'تم كشف الفاعلين واكتمال التحقيق بنجاح.',
  'Requirement 24: Empty Arabic custom story solution falls back to localized Arabic success string'
);

// English request returns English solution
const enStory = createCustomStory(4, [0, 1], 'The perpetrator confessed to the crime after being confronted with forensic evidence.', 'en');
const enEngine = new GameEngine();
enEngine.startNewGame(enStory, ['P1', 'P2', 'P3', 'P4']);
const enState = enEngine.getState();
const enKillers = enState.players.filter((p) => p.guilty);
const enInnocents = enState.players.filter((p) => !p.guilty);

const enSolution = StorySolutionEngine.generateSolution(enStory, enKillers, enInnocents, 'en');
assert(enSolution.length > 0, 'Requirement 25: English solution generated successfully');
assert(enSolution.includes('The perpetrator confessed'), 'Requirement 25: English solution contains authored English text');

// English fallback when story solution is empty
const enEmptyStory = { ...enStory, solution: '' };
const enFallbackSolution = StorySolutionEngine.generateSolution(enEmptyStory, enKillers, enInnocents, 'en');
assert(
  enFallbackSolution === 'The culprits have been identified and the investigation is successfully closed.',
  'Requirement 26: Empty English custom story solution falls back to localized English success string'
);

// =========================================================================
// 6. GAME FLOW COMPLETION (Section 7 Item 5)
// =========================================================================
console.log('\n--- 6. Testing Complete Game Flow on Multi-Killer Custom Story ---');

// 8-player story with 4 candidates (getKillerCount(8) = 2 killers)
const flowStory = createCustomStory(8, [0, 1, 2, 3], 'The two conspirators admitted their roles in orchestrating the incident.', 'en');
const flowEngine = new GameEngine();
const flowPlayers = Array.from({ length: 8 }, (_, i) => `Player_${i + 1}`);
flowEngine.startNewGame(flowStory, flowPlayers);

// Phase 1: ROLE_PASS
assert(flowEngine.getState().phase === 'ROLE_PASS', 'Requirement 27: Game starts in ROLE_PASS');
const flowKillers = flowEngine.getState().players.filter((p) => p.guilty);
assert(flowKillers.length === 2, 'Requirement 27: Exactly 2 actual killers assigned');

// Cycle through all 8 players in ROLE_PASS
for (let i = 0; i < 8; i++) {
  flowEngine.advanceRolePass();
}
// After last pass, game transitions to DISCUSSION
assert(flowEngine.getState().phase === 'DISCUSSION', 'Requirement 27: Transitions to DISCUSSION after role reveal');

// Clue revelation
const discCluesBefore = flowEngine.getState().revealedClues.length;
flowEngine.revealNextEvidence();
const discCluesAfter = flowEngine.getState().revealedClues.length;
assert(discCluesAfter === discCluesBefore + 1, 'Requirement 27: Evidence clue revealed in discussion');

// Phase 2: Start Voting for Round 1
flowEngine.startVoting();
assert(flowEngine.getState().phase === 'VOTING', 'Requirement 27: Enters VOTING phase');

// Round 1: Eliminate first actual killer
const killer1 = flowKillers[0];
const votesRound1: Record<number, number> = {};
for (const p of flowEngine.getState().players) {
  votesRound1[p.id] = killer1.id;
}
const voteResult1 = flowEngine.resolveVotes(votesRound1);
assert(voteResult1.eliminatedPlayer?.id === killer1.id, 'Requirement 28: First killer is eliminated in round 1');
assert(voteResult1.wasGuilty === true, 'Requirement 28: Eliminated player is marked guilty');
assert(voteResult1.winner === 'NONE', 'Requirement 28: Game continues with 1 killer remaining');

// Advance to round 2 via proceedAfterVoteResult
flowEngine.proceedAfterVoteResult();
assert(flowEngine.getState().phase === 'DISCUSSION', 'Requirement 29: Enters round 2 DISCUSSION');
assert(flowEngine.getState().currentRound === 2, 'Requirement 29: Current round is 2');

// Phase 3: Start Voting for Round 2
flowEngine.startVoting();
assert(flowEngine.getState().phase === 'VOTING', 'Requirement 29: Enters round 2 VOTING');

// Round 2: Eliminate second actual killer
const killer2 = flowKillers[1];
const votesRound2: Record<number, number> = {};
for (const p of flowEngine.getState().players) {
  if (!p.isEliminated) {
    votesRound2[p.id] = killer2.id;
  }
}
const voteResult2 = flowEngine.resolveVotes(votesRound2);
assert(voteResult2.eliminatedPlayer?.id === killer2.id, 'Requirement 30: Second killer is eliminated in round 2');
assert(voteResult2.wasGuilty === true, 'Requirement 30: Eliminated player is marked guilty');
assert(voteResult2.winner === 'INNOCENTS', 'Requirement 30: Innocents win when all killers are eliminated');
assert(flowEngine.getState().winner === 'INNOCENTS', 'Requirement 30: Engine state reflects INNOCENTS as winner');

// Transitions through endgame screens:
// 1. Killer Reveal
flowEngine.proceedAfterVoteResult();
assert(flowEngine.getState().phase === 'KILLER_REVEAL', 'Requirement 31: Enters KILLER_REVEAL phase');
const revealedKillers = flowEngine.getState().players.filter((p) => p.guilty);
assert(revealedKillers.length === 2, 'Requirement 31: Killer reveal displays exactly the 2 actual killers');
assert(
  revealedKillers.some((k) => k.id === killer1.id) && revealedKillers.some((k) => k.id === killer2.id),
  'Requirement 31: Killer reveal matches the actual killers'
);

// 2. Crime Explanation
flowEngine.proceedToCrimeExplanation();
assert(flowEngine.getState().phase === 'CRIME_EXPLANATION', 'Requirement 32: Enters CRIME_EXPLANATION phase');

// 3. Reveal Truth
flowEngine.proceedToTruthReveal();
assert(flowEngine.getState().phase === 'REVEAL_TRUTH', 'Requirement 32: Enters REVEAL_TRUTH phase');
const truthOutput = StorySolutionEngine.generateSolution(
  flowStory,
  revealedKillers,
  flowEngine.getState().players.filter((p) => !p.guilty),
  'en'
);
assert(truthOutput.includes('The two conspirators admitted their roles'), 'Requirement 32: Truth output renders custom story solution');

// 4. Game Over / Results
flowEngine.proceedToGameOver();
assert(flowEngine.getState().phase === 'GAME_OVER', 'Requirement 33: Enters GAME_OVER phase');
assert(flowEngine.getState().winner === 'INNOCENTS', 'Requirement 33: Results screen reflects INNOCENTS winner');

// =========================================================================
// 7. FULL FLOW ACROSS 4–12 PLAYERS (Section 10 Scenarios A–I)
// =========================================================================
console.log('\n--- 7. Full Flow Across 4–12 Players (Scenarios A–I) ---');

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
