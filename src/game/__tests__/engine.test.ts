import {
  GameEngine,
  StoryEngine,
  StoryStore,
  CharacterAllocator,
  VotingEngine,
  PlayerManager,
  Story
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

console.log('=== RUNNING SECRET KILLER GAME ENGINE TEST SUITE ===\n');

const stories = StoryStore.getBuiltInStories();
assert(stories.length >= 1, 'Built-in stories must be loaded from repoStories.json');
const sampleStory = stories[0];

// =========================================================================
// TEST 1: Story with exactly one guilty character
// =========================================================================
{
  const singleGuiltyStory: Story = {
    id: 'single_guilty_test',
    title: 'قصة بقاتل واحد',
    description: 'قضية تحتوي على فاعل واحد فقط محدد في القصة.',
    minPlayers: 4,
    maxPlayers: 6,
    requiredGuiltyCount: 1,
    introduction: {
      setting: 'المكتبة القديمة',
      situation: 'الجميع متواجدون في القاعة',
      incident: 'اختفت مخطوطة نادرة',
      stakes: 'قد يُتهم بريء بالسرقة'
    },
    guiltyPool: [
      {
        name: 'حاتم',
        profession: 'مساعد الباحث',
        publicIdentity: 'أنت مساعد الباحث الرئيسي ومكلف بتصنيف الكتب القديمة.',
        knowledge: 'تعرف أن الخزانة فُتحت بالمفتاح الاحتياطي.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'سميرة',
        profession: 'أمينة المكتبة',
        publicIdentity: 'مسؤولة عن إعارة الكتب وحفظ السجلات.',
        knowledge: 'كنتِ في مكتب الاستقبال عند وقوع الحادثة.',
        guilty: false
      },
      {
        name: 'ياسين',
        profession: 'طالب الدراسات',
        publicIdentity: 'تجري بحثاً تاريخياً في ركن المخطوطات.',
        knowledge: 'سمعتَ صرير الباب الخلفي يفتح عند الغروب.',
        guilty: false
      },
      {
        name: 'لمياء',
        profession: 'مرممة الوثائق',
        publicIdentity: 'تعملين على صيانة الورق القديم والأحبار التاريخية.',
        knowledge: 'شاهدتِ خيالاً يمر مسرعاً في الممر الغربي.',
        guilty: false
      },
      {
        name: 'عزيز',
        profession: 'حارس البوابة',
        publicIdentity: 'تتولى مراقبة الدخول والخروج من الباب الرئيسي.',
        knowledge: 'تؤكد أن أحداً لم يخرج من البوابة بعد السادسة.',
        guilty: false
      },
      {
        name: 'منى',
        profession: 'زائرة باحثة',
        publicIdentity: 'تطالعين المراجع الأدبية في الطابق العلوي.',
        knowledge: 'رأيتِ حاتم يتفقد خزانة المخطوطات قبل الحادث بدقائق.',
        guilty: false
      }
    ],
    clues: ['أثر حبر على المقبض'],
    wrongVoteHints: ['الفاعل يعرف مكان المفتاح الاحتياطي'],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'فحص الخزانة',
        publicClue: 'الخزانة فُتحت دون كسر',
        description: 'المفتاح الاحتياطي مفقود',
        discussionPrompt: 'من كان يعلم بوجود المفتاح؟'
      }
    ],
    solution: 'حاتم هو من أخذ المخطوطة مستخدماً المفتاح الاحتياطي.'
  };

  const players = CharacterAllocator.allocateCharacters(
    singleGuiltyStory,
    ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']
  );
  const guiltyPlayers = players.filter(p => p.guilty);

  assert(guiltyPlayers.length === 1, 'Story with exactly 1 guilty character assigns exactly 1 guilty player');
  assert(guiltyPlayers[0].character.name === 'حاتم', 'Guilty player is the authentic guilty character from the story');
  assert(guiltyPlayers[0].character.profession === 'مساعد الباحث', 'Guilty character retains authentic profession');
}

// =========================================================================
// TEST 2: Story with multiple guilty characters
// =========================================================================
{
  const multiGuiltyStory: Story = {
    id: 'multi_guilty_test',
    title: 'قصة بشريكين متواطئين',
    description: 'قضية تتضمن فاعلين اثنين متآمرين محددين من القصة.',
    minPlayers: 4,
    maxPlayers: 6,
    requiredGuiltyCount: 2,
    introduction: {
      setting: 'المعمل الكيميائي',
      situation: 'الفريق يعمل على تجربة مشتركة',
      incident: 'تلف الجهاز الرئيسي واختفت النتائج',
      stakes: 'قد يُفصل الفريق بأكمله'
    },
    guiltyPool: [
      {
        name: 'كمال',
        profession: 'فني المحاليل',
        publicIdentity: 'أنت المسؤول عن تحضير المواد الكيميائية للتجربة.',
        knowledge: 'قمت بتعطيل صمام الضغط بالاتفاق مع شريكك.',
        guilty: true
      },
      {
        name: 'روان',
        profession: 'مبرمجة المستشعرات',
        publicIdentity: 'تراقبين قراءات الحرارة والضغط الرقمية.',
        knowledge: 'مسحتِ سجل التنبيهات لإخفاء وقت التخريب.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'طارق',
        profession: 'رئيس الفريق البحثي',
        publicIdentity: 'تشرف على دقة المعايير وسلامة الإجراءات.',
        knowledge: 'كنت تكتب التقرير النهائي في المكتب المجاور.',
        guilty: false
      },
      {
        name: 'نجوى',
        profession: 'خبيرة السلامة المهنية',
        publicIdentity: 'تتأكدين من ارتداء الأقنعة وعزل المواد الخطرة.',
        knowledge: 'لاحظتِ أن أجهزة الإنذار تم كتمها يدوياً.',
        guilty: false
      },
      {
        name: 'سامي',
        profession: 'طالب متدرب',
        publicIdentity: 'تسجل القياسات اليدوية في دفتر المعمل.',
        knowledge: 'شاهدتَ كمال وروان يتحدثان سراً قرب لوحة التحكم.',
        guilty: false
      },
      {
        name: 'هدى',
        profession: 'مسؤولة التخزين واللوجستيات',
        publicIdentity: 'تديرين مستودع العينات المبردة.',
        knowledge: 'تؤكدين أن عينات التجربة كانت سليمة قبل ساعة من الحادث.',
        guilty: false
      }
    ],
    clues: ['صمام الضغط مفصول يدوياً'],
    wrongVoteHints: ['هناك تنسيق بين طرفين في المعمل'],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'معاينة الجهاز',
        publicClue: 'التخريب تطلب معرفة كيميائية وبرمجية في آن واحد',
        description: 'الجهاز تم تعطيله من جهتين',
        discussionPrompt: 'كيف تم التنسيق لتعطيل الجهاز؟'
      }
    ],
    solution: 'كمال وروان تعاونا على تخريب التجربة ومسح سجلات الحاسوب.'
  };

  const players = CharacterAllocator.allocateCharacters(
    multiGuiltyStory,
    ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4', 'لاعب 5']
  );
  const guiltyPlayers = players.filter(p => p.guilty);

  assert(guiltyPlayers.length === 2, 'Story with requiredGuiltyCount = 2 assigns exactly 2 guilty players');
  const guiltyNames = guiltyPlayers.map(p => p.character.name);
  assert(guiltyNames.includes('كمال') && guiltyNames.includes('روان'), 'Both allocated guilty players are authentic story characters');
}

// =========================================================================
// TEST 3–7: 4, 6, 8, 10, 12 Player Games
// =========================================================================
[4, 6, 8, 10, 12].forEach(count => {
  const playerNames = Array.from({ length: count }, (_, i) => `مشارك ${i + 1}`);
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, playerNames);

  assert(state.players.length === count, `Successfully instantiated a valid ${count}-player game`);
  assert(state.phase === 'ROLE_PASS', `Initial phase is ROLE_PASS for ${count}-player game`);

  // Verify all assigned characters are unique
  const assignedNames = state.players.map(p => p.character.name);
  const uniqueNames = new Set(assignedNames);
  assert(uniqueNames.size === count, `All ${count} players received unique story characters (no duplicates)`);
});

// =========================================================================
// TEST 8: Story with insufficient characters must fail
// =========================================================================
{
  const smallStory: Story = {
    id: 'small_story_test',
    title: 'قصة قصيرة جداً',
    description: 'تحتوي على 4 شخصيات فقط.',
    minPlayers: 4,
    maxPlayers: 4,
    introduction: {
      setting: 'غرفة مغلقة',
      situation: '4 أشخاص محتجزون',
      incident: 'اختفى المفتاح',
      stakes: 'البقاء عالقين'
    },
    guiltyPool: [
      {
        name: 'عمرو',
        profession: 'صانع الأقفال',
        publicIdentity: 'خبير في المفاتيح والأقفال.',
        knowledge: 'أنت من أخفى المفتاح.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'سالي',
        profession: 'المعلمة',
        publicIdentity: 'معلمة مسافرة.',
        knowledge: 'كنت تقرئين كتابك.',
        guilty: false
      },
      {
        name: 'محمود',
        profession: 'السائق',
        publicIdentity: 'سائق الحافلة.',
        knowledge: 'كنت تنتظر انتهاء العاصفة.',
        guilty: false
      },
      {
        name: 'علا',
        profession: 'الممرضة',
        publicIdentity: 'ممرضة ميدانية.',
        knowledge: 'كنت تعتنين بالمصابين.',
        guilty: false
      }
    ],
    clues: ['المفتاح في جيب أحدهم'],
    wrongVoteHints: ['ابحثوا عن خبير بالأقفال'],
    investigationRounds: [],
    solution: 'عمرو أخفى المفتاح.'
  };

  // Attempting to allocate 6 players on a 4-character story must throw
  let threwError = false;
  try {
    CharacterAllocator.allocateCharacters(smallStory, [
      'لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4', 'لاعب 5', 'لاعب 6'
    ]);
  } catch (err: any) {
    threwError = true;
    assert(
      err.message.includes('supports a maximum of 4 players'),
      `Throws clear error when story has insufficient characters: "${err.message}"`
    );
  }
  assert(threwError === true, 'Allocation failed as expected for insufficient characters');
}

// =========================================================================
// TEST 9: Duplicate characters must never be assigned
// =========================================================================
{
  const testStory = stories[1]; // Museum story
  const playerNames = Array.from({ length: 10 }, (_, i) => `محقق ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(testStory, playerNames);

  const characterNames = players.map(p => p.character.name);
  const uniqueSet = new Set(characterNames);
  assert(
    uniqueSet.size === players.length,
    `Character uniqueness verified: 0 duplicates among ${players.length} players`
  );
}

// =========================================================================
// TEST 10: Custom story with insufficient characters must fail validation
// =========================================================================
{
  const invalidCustomStory: Story = {
    id: 'invalid_custom_count',
    title: 'قصة غير مكتملة',
    description: 'تزعم دعم 8 لاعبين لكنها تحتوي على 3 شخصيات فقط',
    minPlayers: 4,
    maxPlayers: 8,
    introduction: {
      setting: 'مكان ما',
      situation: 'حالة ما',
      incident: 'حدث ما',
      stakes: 'خطر ما'
    },
    guiltyPool: [
      {
        name: 'شخص 1',
        profession: 'مهندس',
        publicIdentity: 'مهندس الموقع',
        knowledge: 'معلومات سرية',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'شخص 2',
        profession: 'طبيب',
        publicIdentity: 'طبيب الموقع',
        knowledge: 'معلومات طبية',
        guilty: false
      }
    ],
    clues: ['دليل 1'],
    wrongVoteHints: ['تلميح 1'],
    investigationRounds: [],
    solution: 'الحل النهائي'
  };

  const validation = StoryEngine.validateStory(invalidCustomStory);
  assert(validation.valid === false, 'Story with insufficient characters fails StoryEngine validation');
  assert(
    validation.errors.some(e => e.includes('less than minPlayers') || e.includes('exceeds total unique characters')),
    'Validation error explicitly flags insufficient characters'
  );
}

// =========================================================================
// TEST 11: Guilty character is always a legitimate story character
// =========================================================================
{
  stories.forEach(story => {
    const players = CharacterAllocator.allocateCharacters(
      story,
      ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']
    );
    const guiltyPlayers = players.filter(p => p.guilty);

    guiltyPlayers.forEach(gp => {
      const matchInPool = story.guiltyPool.find(c => c.name === gp.character.name);
      assert(!!matchInPool, `Guilty character "${gp.character.name}" in story "${story.title}" is from legitimate story guiltyPool`);
      assert(
        gp.character.profession.toLowerCase() !== 'killer' &&
        gp.character.profession.toLowerCase() !== 'القاتل',
        `Guilty character "${gp.character.name}" has authentic in-universe profession "${gp.character.profession}"`
      );
    });
  });
}

// =========================================================================
// TEST 12: No automatically generated "additional guest" characters
// =========================================================================
{
  stories.forEach(story => {
    const maxCount = Math.min(12, story.guiltyPool.length + story.innocentPool.length);
    const playerNames = Array.from({ length: maxCount }, (_, i) => `عضو ${i + 1}`);
    const players = CharacterAllocator.allocateCharacters(story, playerNames);

    players.forEach(p => {
      assert(
        !p.character.name.includes('ضيف إضافي') &&
        !p.character.name.includes('شاهد إضافي') &&
        !p.character.profession.includes('شاهد إضافي'),
        `Player ${p.name} has authentic story character "${p.character.name}" (${p.character.profession}), NO generated fallback filler`
      );
    });
  });
}

// =========================================================================
// TEST 13: Voting Engine Plurality Tallying
// =========================================================================
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'Art', publicIdentity: 'A', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  const votes = { 1: 3, 2: 3, 4: 3 }; // 3 votes for P3
  const tally = VotingEngine.tallyVotes(votes, players);

  assert(tally.maxVotes === 3, 'Max vote count is 3');
  assert(tally.isTie === false, 'Not a tie');
  assert(tally.topPlayerIds[0] === 3, 'Top player ID is 3');
}

// =========================================================================
// TEST 14: Voting Ties (Explicit Behavior: No elimination, game continues)
// =========================================================================
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'Art', publicIdentity: 'A', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  const tieVotes = { 1: 2, 3: 2, 2: 4, 4: 4 }; // 2 votes for P2, 2 votes for P4
  const result = VotingEngine.resolveVote({
    votes: tieVotes,
    players,
    story: sampleStory,
    currentRound: 1,
    wrongVotesCount: 0
  });

  assert(result.isTie === true, 'Tied vote correctly flagged as isTie: true');
  assert(result.selectedPlayer === null, 'No player selected on tie');
  assert(result.eliminatedPlayer === null, 'No player eliminated on tie');
  assert(result.wrongVotesCount === 0, 'Wrong votes count NOT incremented on tie');
  assert(result.gameOver === false, 'Game continues on tie');
}

// =========================================================================
// TEST 15: Innocent Elimination (Wrong vote incrementation)
// =========================================================================
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'Art', publicIdentity: 'A', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  const innocentVotes = { 1: 2, 3: 2, 4: 2 }; // Voted for P2 (innocent)
  const result = VotingEngine.resolveVote({
    votes: innocentVotes,
    players,
    story: sampleStory,
    currentRound: 1,
    wrongVotesCount: 0,
    maxWrongVotes: 3
  });

  assert(result.wasGuilty === false, 'Identified selected player as innocent');
  assert(result.wrongVotesCount === 1, 'Wrong votes counter incremented from 0 to 1');
  assert(result.eliminatedPlayer?.id === 2, 'Innocent player 2 marked as eliminated');
  assert(result.gameOver === false, 'Game does not end immediately after first wrong vote');
}

// =========================================================================
// TEST 16: Guilty Elimination & Victory Condition
// =========================================================================
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'Art', publicIdentity: 'A', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  const guiltyVotes = { 1: 3, 2: 3, 4: 3 }; // Voted for P3 (guilty)
  const result = VotingEngine.resolveVote({
    votes: guiltyVotes,
    players,
    story: sampleStory,
    currentRound: 1,
    wrongVotesCount: 0
  });

  assert(result.wasGuilty === true, 'Identified selected player as guilty');
  assert(result.eliminatedPlayer?.id === 3, 'Guilty player 3 eliminated');
  assert(result.gameOver === true, 'Game ends when all guilty players are eliminated');
  assert(result.winner === 'INNOCENTS', 'Innocents win when guilty is caught');
  assert(result.endReason === 'ALL_GUILTY_ELIMINATED', 'End reason is ALL_GUILTY_ELIMINATED');
}

// =========================================================================
// TEST 17: Eliminated Players Restricted from Voting / Being Voted
// =========================================================================
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: true },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false }
  ];

  assert(PlayerManager.canVote(players[0]) === false, 'Eliminated player 1 cannot vote');
  assert(PlayerManager.canBeVotedFor(players[0]) === false, 'Eliminated player 1 cannot be voted for');
  assert(PlayerManager.canVote(players[1]) === true, 'Living player 2 can vote');
  assert(PlayerManager.canBeVotedFor(players[1]) === true, 'Living player 2 can be voted for');
}

console.log(`\n========================================`);
console.log(`TOTAL TESTS PASSED: ${passedTests}`);
console.log(`TOTAL TESTS FAILED: ${failedTests}`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
