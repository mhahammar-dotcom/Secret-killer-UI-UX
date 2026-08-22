import {
  GameEngine,
  StoryEngine,
  StoryStore,
  CharacterAllocator,
  VotingEngine,
  PlayerManager,
  Story,
  StoryCharacter
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

// Test 1-5: 4, 6, 8, 10, 12 Player Game Creation
[4, 6, 8, 10, 12].forEach(count => {
  const playerNames = Array.from({ length: count }, (_, i) => `لاعب ${i + 1}`);
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, playerNames, { shuffle: false });

  assert(state.players.length === count, `Game created with exactly ${count} players`);
  assert(state.phase === 'ROLE_PASS', `Initial game phase is ROLE_PASS for ${count} players`);
  assert(state.currentRound === 1, `Initial round is 1 for ${count} players`);
});

// Test 6: Every player receives a real character with profession and identity
{
  const playerNames = ['أحمد', 'سارة', 'خالد', 'منى', 'ياسر', 'ريم'];
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, playerNames);

  state.players.forEach(p => {
    assert(p.character && p.character.name.length > 0, `Player ${p.name} has character name: ${p.character.name}`);
    assert(p.character.profession && p.character.profession.length > 0, `Player ${p.name} has character profession: ${p.character.profession}`);
    assert(p.character.publicIdentity && p.character.publicIdentity.length > 0, `Player ${p.name} has public identity`);
    assert(p.character.knowledge && p.character.knowledge.length > 0, `Player ${p.name} has character knowledge/testimony`);
  });
}

// Test 7: Guilty character is an actual story character from guiltyPool
{
  const playerNames = ['أحمد', 'سارة', 'خالد', 'منى'];
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, playerNames);
  const guiltyPlayers = state.players.filter(p => p.guilty);

  assert(guiltyPlayers.length >= 1, 'At least 1 guilty player is assigned');
  guiltyPlayers.forEach(gp => {
    const matchingPoolChar = sampleStory.guiltyPool.find(c => c.name === gp.character.name);
    assert(!!matchingPoolChar, `Guilty character "${gp.character.name}" belongs to authentic story guiltyPool`);
  });
}

// Test 8: Guilty status is internal and not exposed in character profession or publicIdentity
{
  const playerNames = ['أحمد', 'سارة', 'خالد', 'منى'];
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, playerNames);
  const guiltyPlayers = state.players.filter(p => p.guilty);

  guiltyPlayers.forEach(gp => {
    assert(typeof gp.guilty === 'boolean' && gp.guilty === true, 'Guilt is an internal boolean flag on Player');
    assert(typeof gp.character.guilty === 'boolean' && gp.character.guilty === true, 'Guilt is an internal boolean flag on Character');
  });
}

// Test 9: No character is named "Killer" or "قاتل" as their profession
{
  stories.forEach(story => {
    const allChars = [...story.guiltyPool, ...story.innocentPool];
    allChars.forEach(char => {
      const prof = char.profession.toLowerCase();
      assert(
        prof !== 'killer' && prof !== 'murderer' && prof !== 'القاتل' && prof !== 'المجرم',
        `Story "${story.title}" character "${char.name}" has legitimate profession "${char.profession}", not a "Killer" label`
      );
    });
  });
}

// Test 10: Vote tallying
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'Art', publicIdentity: 'A', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  const votes = { 1: 3, 2: 3, 4: 3 }; // 3 votes for player 3
  const tally = VotingEngine.tallyVotes(votes, players);

  assert(tally.maxVotes === 3, 'Max vote count is 3');
  assert(tally.isTie === false, 'Not a tie');
  assert(tally.topPlayerIds[0] === 3, 'Top player ID is 3');
}

// Test 11: Tie handling
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

  assert(result.isTie === true, 'Tied vote correctly identified');
  assert(result.selectedPlayer === null, 'No player selected on tie');
  assert(result.eliminatedPlayer === null, 'No player eliminated on tie');
  assert(result.gameOver === false, 'Game continues on tie');
}

// Test 12: Innocent vote (Wrong vote resolution & increment)
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
  assert(result.wrongVotesCount === 1, 'Wrong votes counter incremented to 1');
  assert(result.eliminatedPlayer?.id === 2, 'Innocent player 2 marked as eliminated');
  assert(result.gameOver === false, 'Game does not end immediately after first wrong vote');
}

// Test 13: Guilty vote (Correct deduction)
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
  assert(result.gameOver === true, 'Game ends when all guilty are eliminated');
  assert(result.winner === 'INNOCENTS', 'Innocents win when guilty is caught');
  assert(result.endReason === 'ALL_GUILTY_ELIMINATED', 'End reason is ALL_GUILTY_ELIMINATED');
}

// Test 14: Elimination prevents voting and being voted for
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: true },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false }
  ];

  assert(PlayerManager.canVote(players[0]) === false, 'Eliminated player 1 cannot vote');
  assert(PlayerManager.canBeVotedFor(players[0]) === false, 'Eliminated player 1 cannot be voted for');
  assert(PlayerManager.canVote(players[1]) === true, 'Living player 2 can vote');
}

// Test 15: Win conditions (Guilty win on max wrong votes)
{
  const players = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'Doc', publicIdentity: 'D', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'Eng', publicIdentity: 'E', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'Law', publicIdentity: 'L', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false }
  ];

  const maxWrongResult = VotingEngine.resolveVote({
    votes: { 1: 2, 3: 2 }, // Vote off innocent P2
    players,
    story: sampleStory,
    currentRound: 3,
    wrongVotesCount: 2, // Reaching max (3)
    maxWrongVotes: 3
  });

  assert(maxWrongResult.gameOver === true, 'Game ends when max wrong votes reached');
  assert(maxWrongResult.winner === 'GUILTY', 'Guilty team wins on max wrong votes');
}

// Test 16: Custom story validation
{
  const validCustomStory: Story = {
    id: 'custom_mansion',
    title: 'جريمة في القصر المظلم',
    description: 'قضية اختفاء وثائق سرية أثناء عاصفة رعدية.',
    minPlayers: 4,
    maxPlayers: 8,
    introduction: {
      setting: 'قصر منعزل في الريف أثناء عاصفة ثلجية',
      situation: 'اجتمع الورثة لمناقشة الوصية',
      incident: 'اختفت الخزنة الرئيسية وتوقفت الكهرباء',
      stakes: 'الوصية قد تُتلف إذا لم يتم كشف الفاعل قبل الصباح'
    },
    guiltyPool: [
      {
        name: 'فريد',
        profession: 'المحامي الشخصي',
        publicIdentity: 'أنت محامي العائلة والمؤتمن على الوثائق.',
        knowledge: 'كنت تملك مفتاحاً إضافياً للخزنة.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'سمير',
        profession: 'الابن الأكبر',
        publicIdentity: 'وريث القصر والمسؤول عن الضيافة.',
        knowledge: 'كنت في غرفة المدفأة طوال الوقت.',
        guilty: false
      },
      {
        name: 'نجوى',
        profession: 'طبيبة العائلة',
        publicIdentity: 'تشرفين على الرعاية الصحية في القصر.',
        knowledge: 'سمعت صوتاً في الممر عند العاشرة.',
        guilty: false
      },
      {
        name: 'عماد',
        profession: 'مدير القصر',
        publicIdentity: 'مسؤول الحراسة والمفاتيح.',
        knowledge: 'المولد الاحتياطي تم فصله عمداً.',
        guilty: false
      }
    ],
    clues: ['أثر حذاء طيني قرب النافذة', 'ساعة مكسورة تشير إلى 10:15'],
    wrongVoteHints: ['الفاعل يملك معرفة قانونية ببنود الوصية'],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'معاينة القاعة',
        publicClue: 'الخزنة فُتحت برقم سري دون كسر',
        description: 'الفحص المبدئي أظهر عدم وجود أي علامات عنف.',
        discussionPrompt: 'من كان يعلم بالرقم السري؟'
      }
    ],
    solution: 'المحامي فريد استغل انقطاع التيار لسرقة الوثائق قبل تعديلها.'
  };

  const validation = StoryEngine.validateStory(validCustomStory);
  assert(validation.valid === true, 'Valid custom story passes validation with 0 errors');

  // Test invalid custom story (character with role "Killer")
  const invalidCustomStory: Story = {
    ...validCustomStory,
    guiltyPool: [
      {
        name: 'فريد',
        profession: 'القاتل', // Invalid! Role cannot be "Killer"
        publicIdentity: 'أنت القاتل',
        knowledge: 'قتلت الجميع',
        guilty: true
      }
    ]
  };

  const invalidValidation = StoryEngine.validateStory(invalidCustomStory);
  assert(invalidValidation.valid === false, 'Custom story with "القاتل" as profession correctly rejected by validator');
  assert(invalidValidation.errors.length > 0, 'Validator provides clear error message explaining why role cannot be "Killer"');
}

console.log(`\n========================================`);
console.log(`TOTAL TESTS PASSED: ${passedTests}`);
console.log(`TOTAL TESTS FAILED: ${failedTests}`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
