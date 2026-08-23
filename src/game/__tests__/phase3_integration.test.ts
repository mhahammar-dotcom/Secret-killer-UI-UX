import {
  GameEngine,
  StoryEngine,
  StoryStore,
  CharacterAllocator,
  VotingEngine,
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

console.log('=== RUNNING PHASE 3 INTEGRATION TEST SUITE ===\n');

const builtInStories = StoryStore.getBuiltInStories();
const sampleStory = builtInStories[0];

// =========================================================================
// TEST 1: Selecting a valid story works
// =========================================================================
{
  const validation = StoryEngine.validateStory(sampleStory);
  assert(validation.valid === true, 'TEST 1: Valid story passes StoryEngine.validateStory');
  assert(validation.errors.length === 0, 'TEST 1: Valid story has zero validation errors');
}

// =========================================================================
// TEST 2: Invalid story is rejected
// =========================================================================
{
  const invalidStory: any = {
    id: 'invalid_case',
    title: '',
    description: '',
    minPlayers: 2, // invalid: min is 4
    maxPlayers: 3, // invalid: min is 4
    guiltyPool: [], // invalid: empty
    innocentPool: []
  };

  const validation = StoryEngine.validateStory(invalidStory);
  assert(validation.valid === false, 'TEST 2: Invalid story is rejected by StoryEngine');
  assert(validation.errors.length > 0, 'TEST 2: Invalid story provides specific error messages');
}

// =========================================================================
// TEST 3: Player Setup can collect 4–12 players
// =========================================================================
{
  const engine = new GameEngine();
  const validPlayerCounts = [4, 5, 8, 12];
  
  for (const count of validPlayerCounts) {
    const names = Array.from({ length: count }, (_, i) => `Player_${i + 1}`);
    const state = engine.startNewGame(sampleStory, names);
    assert(state.players.length === count, `TEST 3: Player setup accepted valid player count: ${count}`);
  }
}

// =========================================================================
// TEST 4: Invalid player count is rejected
// =========================================================================
{
  const engine = new GameEngine();
  let rejectedUnder4 = false;
  try {
    engine.startNewGame(sampleStory, ['A', 'B', 'C']);
  } catch (e) {
    rejectedUnder4 = true;
  }
  assert(rejectedUnder4 === true, 'TEST 4: Player count < 4 is rejected');

  let rejectedOver12 = false;
  try {
    const thirteenNames = Array.from({ length: 13 }, (_, i) => `P_${i + 1}`);
    engine.startNewGame(sampleStory, thirteenNames);
  } catch (e) {
    rejectedOver12 = true;
  }
  assert(rejectedOver12 === true, 'TEST 4: Player count > 12 is rejected');
}

// =========================================================================
// TEST 5: Duplicate player names are rejected
// =========================================================================
{
  const engine = new GameEngine();
  let duplicateRejected = false;
  try {
    engine.startNewGame(sampleStory, ['أحمد', 'أحمد', 'سارة', 'عمر']);
  } catch (e) {
    duplicateRejected = true;
  }
  assert(duplicateRejected === true, 'TEST 5: Duplicate player names are rejected by GameEngine');
}

// =========================================================================
// TEST 6: Starting a valid game calls GameEngine.startNewGame()
// =========================================================================
{
  const engine = new GameEngine();
  let subscribedState: any = null;
  const unsubscribe = engine.subscribe((state) => {
    subscribedState = state;
  });

  const playerNames = ['فارس', 'ندى', 'ماجد', 'هدى'];
  const state = engine.startNewGame(sampleStory, playerNames);

  assert(state !== null, 'TEST 6: startNewGame returns GameState');
  assert(subscribedState !== null, 'TEST 6: Subscribed listener receives initial GameState');
  assert(subscribedState.phase === 'ROLE_PASS', 'TEST 6: Subscribed listener receives phase ROLE_PASS');
  unsubscribe();
}

// =========================================================================
// TEST 7: GameEngine returns ROLE_PASS and currentViewingPlayerIndex = 0
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
  assert(state.phase === 'ROLE_PASS', 'TEST 7: State phase is ROLE_PASS');
  assert(state.currentViewingPlayerIndex === 0, 'TEST 7: currentViewingPlayerIndex starts at 0');
}

// =========================================================================
// TEST 8: GameState contains the selected story
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
  assert(state.story !== null, 'TEST 8: GameState contains story');
  assert(state.story.id === sampleStory.id, 'TEST 8: GameState story ID matches selected story');
  assert(state.story.title === sampleStory.title, 'TEST 8: GameState story title matches selected story');
}

// =========================================================================
// TEST 9: GameState contains all players
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['زياد', 'بسمة', 'يوسف', 'دانة', 'علي'];
  const state = engine.startNewGame(sampleStory, playerNames);
  assert(state.players.length === 5, 'TEST 9: GameState contains all 5 players');
  playerNames.forEach((name, idx) => {
    assert(state.players[idx].name === name, `TEST 9: Player ${idx + 1} name is ${name}`);
  });
}

// =========================================================================
// TEST 10: Every player receives a unique legitimate story character
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);
  const allStoryCharacters = [...sampleStory.guiltyPool, ...sampleStory.innocentPool];
  const assignedNames = new Set<string>();

  state.players.forEach((p) => {
    assert(p.character !== undefined, `TEST 10: Player ${p.name} has character`);
    assert(p.character.name.length > 0, `TEST 10: Character name is valid string`);
    assert(p.character.profession.length > 0, `TEST 10: Character profession is valid string`);
    assert(p.character.knowledge.length > 0, `TEST 10: Character knowledge is valid string`);

    // Verify character is from the legitimate story pool
    const match = allStoryCharacters.find((c) => c.name === p.character.name);
    assert(match !== undefined, `TEST 10: Character ${p.character.name} belongs to authentic story pool`);

    // Verify character uniqueness across players
    assert(!assignedNames.has(p.character.name), `TEST 10: Character ${p.character.name} is unique`);
    assignedNames.add(p.character.name);
  });
}

// =========================================================================
// TEST 11: Guilty status remains internal
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['P1', 'P2', 'P3', 'P4']);
  state.players.forEach((p) => {
    // Role title or profession must NEVER be 'قاتل' or 'المجرم'
    assert(!p.character.name.includes('القاتل'), 'TEST 11: Character name does not reveal guilty status');
    assert(!p.character.profession.includes('القاتل'), 'TEST 11: Character profession does not reveal guilty status');
    assert(!p.character.publicIdentity.includes('أنت القاتل'), 'TEST 11: Public identity does not leak guilt');
  });
}

// =========================================================================
// TEST 12: App does not independently calculate voting/elimination
// =========================================================================
{
  // Verify that VotingEngine and GameEngine are authoritative
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['P1', 'P2', 'P3', 'P4']);
  const guiltyPlayer = state.players.find((p) => p.guilty)!;
  const innocentPlayer = state.players.find((p) => !p.guilty)!;

  // Engine authoritative vote resolution for innocent elimination
  const votesForInnocent: Record<number, number> = {
    [state.players[0].id]: innocentPlayer.id,
    [state.players[1].id]: innocentPlayer.id,
    [state.players[2].id]: innocentPlayer.id,
  };

  const voteResult = engine.resolveVotes(votesForInnocent);
  assert(voteResult.wasGuilty === false, 'TEST 12: Engine authoritatively detects innocent elimination');
  assert(voteResult.wrongVotesCount === 1, 'TEST 12: Engine authoritatively increments wrongVotesCount');
  assert(engine.getState().wrongVotesCount === 1, 'TEST 12: GameEngine state wrongVotesCount updated');
}

// =========================================================================
// TEST 13: Custom stories still work and pass validation
// =========================================================================
{
  const customStory: Story = {
    id: 'custom_noir_case',
    title: 'سرقة الماسة السوداء',
    description: 'قضية مخصصة للتحقيق في سرقة ماسة نادرة',
    minPlayers: 4,
    maxPlayers: 4,
    isCustom: true,
    introduction: {
      setting: 'القصر الكلاسيكي',
      situation: 'حفل مسائي مغلق',
      incident: 'اختفاء الماسة من الخزنة',
      stakes: 'البحث عن السارق قبل الصباح',
      objective: 'من سرق الماسة؟'
    },
    guiltyPool: [
      {
        name: 'حاتم',
        profession: 'خبير الخزائن',
        publicIdentity: 'مسؤول تأمين الخزنة',
        knowledge: 'فتحت القفل باستخدام الرمز السري',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'ليلى',
        profession: 'المصورة',
        publicIdentity: 'توثيق الحفل بالصور',
        knowledge: 'شاهدت الحارس يغادر موقعه',
        guilty: false
      },
      {
        name: 'سامي',
        profession: 'المضيف',
        publicIdentity: 'إدارة ضيوف الحفل',
        knowledge: 'قدمت المشروبات في الصالة الرئيسية',
        guilty: false
      },
      {
        name: 'هند',
        profession: 'مديرة الحفل',
        publicIdentity: 'تنظيم الجدول الزمني',
        knowledge: 'تأكدت من إغلاق النوافذ الخلفية',
        guilty: false
      }
    ],
    clues: ['أثر مسحوق على الخزنة'],
    wrongVoteHints: ['السارق على دراية بنظام القفل الإلكتروني'],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'فحص الخزنة',
        publicClue: 'الخزنة فتحت بدون كسر',
        description: 'استخدم رمز الإدارة السري',
        discussionPrompt: 'من يعرف الرمز السري؟'
      }
    ],
    solution: 'حاتم هو من فتح الخزنة واستولى على الماسة.'
  };

  const validation = StoryEngine.validateStory(customStory);
  assert(validation.valid === true, 'TEST 13: Custom story passes validation');

  const engine = new GameEngine();
  const state = engine.startNewGame(customStory, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
  assert(state.phase === 'ROLE_PASS', 'TEST 13: Custom story successfully starts game with ROLE_PASS');
  assert(state.players.length === 4, 'TEST 13: Custom story allocates 4 players');
}

console.log(`\n========================================`);
console.log(`PHASE 3 INTEGRATION: ALL 13 TEST CASES PASSED!`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
