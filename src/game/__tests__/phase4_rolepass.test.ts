import {
  GameEngine,
  StoryEngine,
  StoryStore,
  CharacterAllocator,
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

console.log('=== RUNNING PHASE 4 ROLE PASS TEST SUITE ===\n');

const builtInStories = StoryStore.getBuiltInStories();
const sampleStory = builtInStories[0];

// =========================================================================
// TEST 1: Game starts in ROLE_PASS
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['أحمد', 'سارة', 'كريم', 'ليلى'];
  const state = engine.startNewGame(sampleStory, playerNames);
  assert(state.phase === 'ROLE_PASS', 'TEST 1: Game starts in phase ROLE_PASS');
}

// =========================================================================
// TEST 2: First player is the first player in GameState
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['أحمد', 'سارة', 'كريم', 'ليلى'];
  const state = engine.startNewGame(sampleStory, playerNames);
  assert(state.currentViewingPlayerIndex === 0, 'TEST 2: currentViewingPlayerIndex is 0');
  const viewingPlayer = engine.getCurrentViewingPlayer();
  assert(viewingPlayer !== null, 'TEST 2: getCurrentViewingPlayer returns valid player');
  assert(viewingPlayer?.name === 'أحمد', 'TEST 2: First player matches first player name in GameState');
}

// =========================================================================
// TEST 3 & 4: First player character belongs to that player
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['أحمد', 'سارة', 'كريم', 'ليلى'];
  const state = engine.startNewGame(sampleStory, playerNames);
  const viewingPlayer = engine.getCurrentViewingPlayer();
  assert(viewingPlayer?.character !== undefined, 'TEST 3: Player has character assigned');
  assert(viewingPlayer?.character.name.length > 0, 'TEST 4: Character has valid name');
  assert(viewingPlayer?.character.profession.length > 0, 'TEST 4: Character has valid profession');
}

// =========================================================================
// TEST 5: Character is a legitimate story character
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['أحمد', 'سارة', 'كريم', 'ليلى'];
  const state = engine.startNewGame(sampleStory, playerNames);
  const allStoryCharacters = [...sampleStory.guiltyPool, ...sampleStory.innocentPool];

  state.players.forEach((p, idx) => {
    const isAuthentic = allStoryCharacters.some((c) => c.name === p.character.name);
    assert(isAuthentic, `TEST 5: Player ${p.name} has authentic story character (${p.character.name})`);
  });
}

// =========================================================================
// TEST 6 & 7: Guilty player receives a legitimate story character & no "Killer" title
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['أحمد', 'سارة', 'كريم', 'ليلى'];
  const state = engine.startNewGame(sampleStory, playerNames);
  const guiltyPlayers = state.players.filter((p) => p.guilty);

  assert(guiltyPlayers.length === 1, 'TEST 6: Exactly 1 guilty player is assigned for 4-player game');
  
  const guilty = guiltyPlayers[0];
  assert(guilty.character.name.length > 0, 'TEST 6: Guilty player has legitimate character name');
  assert(!guilty.character.name.includes('القاتل'), 'TEST 7: Guilty player character name does NOT contain "القاتل"');
  assert(!guilty.character.profession.includes('القاتل'), 'TEST 7: Guilty player character profession does NOT contain "القاتل"');
  assert(!guilty.character.name.toLowerCase().includes('killer'), 'TEST 7: Guilty character name does NOT contain "killer"');
  assert(!guilty.character.profession.toLowerCase().includes('killer'), 'TEST 7: Guilty character profession does NOT contain "killer"');
  assert(!guilty.character.publicIdentity.includes('أنت القاتل'), 'TEST 7: Public identity does NOT leak "أنت القاتل"');
}

// =========================================================================
// TEST 8: Innocent player receives a legitimate story character
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['أحمد', 'سارة', 'كريم', 'ليلى'];
  const state = engine.startNewGame(sampleStory, playerNames);
  const innocentPlayers = state.players.filter((p) => !p.guilty);

  assert(innocentPlayers.length === 3, 'TEST 8: 3 innocent players in 4-player game');
  innocentPlayers.forEach((innocent) => {
    assert(innocent.character.name.length > 0, `TEST 8: Innocent ${innocent.name} has legitimate character name`);
    assert(innocent.character.profession.length > 0, `TEST 8: Innocent ${innocent.name} has legitimate profession`);
  });
}

// =========================================================================
// TEST 9 & 10: Advancing role pass moves to the next player & previous is not current
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4'];
  engine.startNewGame(sampleStory, playerNames);

  assert(engine.getCurrentViewingPlayerIndex() === 0, 'TEST 9: Starts at index 0');
  assert(engine.getCurrentViewingPlayer()?.name === 'لاعب 1', 'TEST 9: Viewing player is Player 1');

  // Advance to player 2
  engine.advanceRolePass();
  assert(engine.getCurrentViewingPlayerIndex() === 1, 'TEST 9: Advances to index 1');
  assert(engine.getCurrentViewingPlayer()?.name === 'لاعب 2', 'TEST 10: Current player is now Player 2, Player 1 is no longer current');

  // Advance to player 3
  engine.advanceRolePass();
  assert(engine.getCurrentViewingPlayerIndex() === 2, 'TEST 9: Advances to index 2');
  assert(engine.getCurrentViewingPlayer()?.name === 'لاعب 3', 'TEST 10: Current player is now Player 3');

  // Advance to player 4 (last)
  assert(!engine.isLastViewingPlayer(), 'TEST 9: Player 3 is not last player in 4-player game');
  engine.advanceRolePass();
  assert(engine.getCurrentViewingPlayerIndex() === 3, 'TEST 9: Advances to index 3');
  assert(engine.getCurrentViewingPlayer()?.name === 'لاعب 4', 'TEST 10: Current player is now Player 4');
  assert(engine.isLastViewingPlayer(), 'TEST 9: Player 4 is identified as last player');
}

// =========================================================================
// TEST 11 & 12: Last player finishes role pass -> transitions to DISCUSSION
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4'];
  engine.startNewGame(sampleStory, playerNames);

  // Advance through 1, 2, 3, 4
  engine.advanceRolePass(); // to 1
  engine.advanceRolePass(); // to 2
  engine.advanceRolePass(); // to 3 (last player)

  // Last player advances
  const endState = engine.advanceRolePass();
  assert(endState.phase === 'DISCUSSION', 'TEST 11 & 12: GameEngine transitions to DISCUSSION phase after last player');
}

// =========================================================================
// TEST 13: 4-Player Game Works
// =========================================================================
{
  const engine = new GameEngine();
  const names = ['فارس', 'ندى', 'سامي', 'منى'];
  const state = engine.startNewGame(sampleStory, names);
  assert(state.players.length === 4, 'TEST 13: 4-player game initialized');
  assert(state.players.filter((p) => p.guilty).length === 1, 'TEST 13: 4-player game has 1 guilty');
  assert(state.players.filter((p) => !p.guilty).length === 3, 'TEST 13: 4-player game has 3 innocents');
}

// =========================================================================
// TEST 14: 8-Player Game Works
// =========================================================================
{
  const engine = new GameEngine();
  const names = Array.from({ length: 8 }, (_, i) => `عضو_${i + 1}`);
  const state = engine.startNewGame(sampleStory, names);
  assert(state.players.length === 8, 'TEST 14: 8-player game initialized');
  const uniqueNames = new Set(state.players.map((p) => p.character.name));
  assert(uniqueNames.size === 8, 'TEST 14: All 8 players receive unique characters');
}

// =========================================================================
// TEST 15: 12-Player Game Works
// =========================================================================
{
  const engine = new GameEngine();
  const names = Array.from({ length: 12 }, (_, i) => `مشارك_${i + 1}`);
  const state = engine.startNewGame(sampleStory, names);
  assert(state.players.length === 12, 'TEST 15: 12-player game initialized');
  const uniqueNames = new Set(state.players.map((p) => p.character.name));
  assert(uniqueNames.size === 12, 'TEST 15: All 12 players receive unique characters from authentic story pool');
}

// =========================================================================
// TEST 16: Custom Story Characters Work
// =========================================================================
{
  const customStory: Story = {
    id: 'custom_mansion_case',
    title: 'لغز المخطوطة الأثرية',
    description: 'قضية مخصصة عن سرقة مخطوطة أندلسية نادرة',
    minPlayers: 4,
    maxPlayers: 4,
    isCustom: true,
    introduction: {
      setting: 'المتحف التراثي',
      situation: 'معرض ليلي خاص',
      incident: 'اختفاء المخطوطة الأندلسية من القاعة الكبرى',
      stakes: 'كشف المتورط قبل انتهاء الحراسة الصباحية',
      objective: 'تحديد من استولى على المخطوطة'
    },
    guiltyPool: [
      {
        name: 'جابر',
        profession: 'خبير الترميم',
        publicIdentity: 'المشرف على ترميم المخطوطات القديمة',
        knowledge: 'قمت بتبديل المخطوطة بنسخة مقلدة في تمام العاشرة',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'سلاف',
        profession: 'أمينة المعرض',
        publicIdentity: 'المسؤولة عن جدول الزوار والافتتاح',
        knowledge: 'تفقدت القاعة في التاسعة وكانت المخطوطة الأصلية في مكانها',
        guilty: false
      },
      {
        name: 'عصام',
        profession: 'حارس القاعة',
        publicIdentity: 'مراقبة حركة الدخول والخروج',
        knowledge: 'لم يدخل أي زائر غريب عبر البوابة الرئيسية',
        guilty: false
      },
      {
        name: 'رحاب',
        profession: 'المؤرخة الباحثة',
        publicIdentity: 'توثيق المقتنيات وتدقيق النصوص',
        knowledge: 'كنت أراجع فهرس المخطوطات في قاعة الأبحاث',
        guilty: false
      }
    ],
    clues: [
      'رائحة مواد ترميم كيميائية بالقرب من الخزانة الزجاجية',
      'بقايا شمع على مقبض الباب الجانبي',
      'سجل استعارة مفتاح الصيانة'
    ],
    wrongVoteHints: ['الجاني يمتلك خبرة دقيقة في التعامل مع المخطوطات الأثرية'],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'فحص القاعة الكبرى',
        publicClue: 'القفل الزجاجي سليم تماماً بدون خدوش',
        description: 'استخدم مفتاح مخصص للترميم',
        discussionPrompt: 'من كان بحوزته مفتاح الصيانة؟'
      }
    ],
    solution: 'جابر خبير الترميم هو من استبدل المخطوطة الأصلية بنسخة مقلدة.'
  };

  const engine = new GameEngine();
  const playerNames = ['زيد', 'رانيا', 'طارق', 'هدى'];
  const state = engine.startNewGame(customStory, playerNames);

  assert(state.phase === 'ROLE_PASS', 'TEST 16: Custom story game starts in ROLE_PASS');
  assert(state.players.length === 4, 'TEST 16: Custom story allocates 4 players');

  // Verify each player has character from custom story
  const customNames = ['جابر', 'سلاف', 'عصام', 'رحاب'];
  state.players.forEach((p) => {
    assert(customNames.includes(p.character.name), `TEST 16: Player ${p.name} assigned custom character ${p.character.name}`);
  });

  // Verify advance works through to last player
  engine.advanceRolePass();
  engine.advanceRolePass();
  engine.advanceRolePass();
  const endState = engine.advanceRolePass();
  assert(endState.phase === 'DISCUSSION', 'TEST 16: Custom story completes role pass and enters DISCUSSION');
}

// =========================================================================
// TEST 17 & 18: No secret or objective mechanics in character data
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['P1', 'P2', 'P3', 'P4']);
  state.players.forEach((p) => {
    const rawAny = p as any;
    assert(rawAny.secret === undefined, 'TEST 17: No secret field on player object');
    assert(rawAny.mission === undefined, 'TEST 18: No mission field on player object');
    assert(rawAny.objective === undefined, 'TEST 18: No objective field on player object');
  });
}

// =========================================================================
// TEST 19: Privacy Isolation — Each index accesses only that player's character
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['P1', 'P2', 'P3', 'P4'];
  engine.startNewGame(sampleStory, playerNames);

  for (let i = 0; i < playerNames.length; i++) {
    assert(engine.getCurrentViewingPlayerIndex() === i, `TEST 19: Viewing index is ${i}`);
    const viewing = engine.getCurrentViewingPlayer();
    assert(viewing?.name === playerNames[i], `TEST 19: Only player ${playerNames[i]} is returned at index ${i}`);
    if (i < playerNames.length - 1) {
      engine.advanceRolePass();
    }
  }
}

// =========================================================================
// TEST 20: Built-in story character knowledge verification (no secret missions)
// =========================================================================
{
  const builtInStories = StoryStore.getBuiltInStories();
  assert(builtInStories.length > 0, 'TEST 20: Built-in stories exist');

  builtInStories.forEach((story) => {
    const allCharacters = [...(story.guiltyPool || []), ...(story.innocentPool || []), ...(story.fixedCharacters || [])];
    allCharacters.forEach((char) => {
      assert(typeof char.knowledge === 'string' && char.knowledge.trim().length > 0, `TEST 20: Story [${story.id}] character [${char.name}] has knowledge testimony`);
      
      // Verify knowledge does NOT contain secret instructions or fake objectives
      const lowerKnowledge = char.knowledge.toLowerCase();
      assert(!lowerKnowledge.includes('مهمتك السرية'), `TEST 20: [${char.name}] knowledge does NOT contain "مهمتك السرية"`);
      assert(!lowerKnowledge.includes('عليك أن تكذب'), `TEST 20: [${char.name}] knowledge does NOT contain "عليك أن تكذب"`);
      assert(!lowerKnowledge.includes('ضلل اللاعبين'), `TEST 20: [${char.name}] knowledge does NOT contain "ضلل اللاعبين"`);
      assert(!lowerKnowledge.includes('سر مخفي'), `TEST 20: [${char.name}] knowledge does NOT contain "سر مخفي"`);
      assert(!lowerKnowledge.includes('your secret'), `TEST 20: [${char.name}] knowledge does NOT contain "your secret"`);
    });
  });
}

// =========================================================================
// TEST 21: Protected Role-Pass Flow
// =========================================================================
{
  const engine = new GameEngine();
  const playerNames = ['لاعب_1', 'لاعب_2', 'لاعب_3', 'لاعب_4'];
  const state = engine.startNewGame(sampleStory, playerNames);

  assert(engine.getCurrentViewingPlayerIndex() === 0, 'TEST 21: Starts at index 0');
  assert(!engine.isLastViewingPlayer(), 'TEST 21: Index 0 is not last player');

  // Advance to player 2
  engine.advanceRolePass();
  assert(engine.getCurrentViewingPlayerIndex() === 1, 'TEST 21: Advanced to index 1');

  // Advance to player 3
  engine.advanceRolePass();
  assert(engine.getCurrentViewingPlayerIndex() === 2, 'TEST 21: Advanced to index 2');

  // Advance to player 4 (last)
  engine.advanceRolePass();
  assert(engine.getCurrentViewingPlayerIndex() === 3, 'TEST 21: Advanced to index 3');
  assert(engine.isLastViewingPlayer(), 'TEST 21: Index 3 is last player in 4-player game');

  // Final advance transitions to DISCUSSION
  const finalState = engine.advanceRolePass();
  assert(finalState.phase === 'DISCUSSION', 'TEST 21: Final advance transitions to DISCUSSION phase');
}

console.log(`\n========================================`);
console.log(`PHASE 4 ROLE PASS: ALL 21 TEST SUITES PASSED!`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
