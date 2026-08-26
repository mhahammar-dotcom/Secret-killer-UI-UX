import { Story, StoryCharacter, Player, EvidenceItem } from '../types';
import { CharacterAllocator } from '../CharacterAllocator';
import { StoryStore } from '../StoryStore';
import { StoryEngine } from '../StoryEngine';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passedTests++;
    console.log(`✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function createSeededRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

console.log(`\n==================================================`);
console.log(`RUNNING CHARACTER ALLOCATOR TEST SUITE (PHASE 7.1)`);
console.log(`==================================================\n`);

const testStory14: Story = {
  id: 'test_story_14',
  title: 'قصة اختبار 14 شخصية',
  description: 'قصة اختبار لفحص التوزيع الذكي للشخصيات.',
  minPlayers: 4,
  maxPlayers: 12,
  introduction: {
    setting: 'قصر ملكي واسع أثناء احتفال سنوي.',
    situation: 'تجمع الضيوف والموظفون للاحتفال في القاعة الكبرى.',
    incident: 'اختفت قطعة مجوهرات ثمينة من غرفة الخزينة.',
    stakes: 'يجب كشف الفاعل قبل انتهاء الليلة ومغادرة الحضور.'
  },
  guiltyPool: [
    {
      name: 'فارس',
      profession: 'رئيس الطهاة',
      publicIdentity: 'أنت رئيس الطهاة في القصر.',
      knowledge: 'تعرف أن نبيل مر قرب المطبخ.',
      guilty: true
    },
    {
      name: 'درة',
      profession: 'خبيرة الحلويات',
      publicIdentity: 'خبيرة إعداد الحلويات الفاخرة.',
      knowledge: 'تعرفين أن الشمعة انطفأت.',
      guilty: true
    },
    {
      name: 'نبيل',
      profession: 'خادم القاعة',
      publicIdentity: 'خادم القاعة الملكية الرئيسي.',
      knowledge: 'تعرف أن صوت العربة سُجل مرتين.',
      guilty: true
    }
  ],
  innocentPool: [
    {
      name: 'عزيزة',
      profession: 'عازفة القيثارة',
      publicIdentity: 'عازفة في الحفل الملكي.',
      knowledge: 'شاهدتِ نبيل يمر مسرعاً في الممر الخلفي.',
      guilty: false
    },
    {
      name: 'وردة',
      profession: 'مساعدة الحلويات',
      publicIdentity: 'مساعدة درة في المطبخ.',
      knowledge: 'تعرفين أن درة طلبت إعداد صينية بديلة.',
      guilty: false
    },
    {
      name: 'إحسان',
      profession: 'طاهي المقبلات',
      publicIdentity: 'طاهي المقبلات الباردة.',
      knowledge: 'شاهدتَ فارس متوتراً قرب الممر.',
      guilty: false
    },
    ...Array.from({ length: 8 }, (_, i) => ({
      name: `شخصية مستقلة ${i + 1}`,
      profession: `مهنة مستقلة ${i + 1}`,
      publicIdentity: `هوية ${i + 1}`,
      knowledge: `شهادة مستقلة ${i + 1} لا تذكر أحداً بالاسم.`,
      guilty: false
    }))
  ],
  evidence: [],
  clues: [],
  wrongVoteHints: [],
  investigationRounds: [],
  solution: 'فارس هو الجاني.'
};

// =========================================================================
// TEST 1: 14-character story can allocate 4 players
// =========================================================================
{
  const names = ['أحمد', 'سارة', 'خالد', 'منى'];
  const players = CharacterAllocator.allocateCharacters(testStory14, names);
  assert(players.length === 4, 'TEST 1: 14-character story allocates exactly 4 players');
}

// =========================================================================
// TEST 2: 14-character story can allocate 6 players
// =========================================================================
{
  const names = Array.from({ length: 6 }, (_, i) => `لاعب ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(testStory14, names);
  assert(players.length === 6, 'TEST 2: 14-character story allocates exactly 6 players');
}

// =========================================================================
// TEST 3: 14-character story can allocate 8 players
// =========================================================================
{
  const names = Array.from({ length: 8 }, (_, i) => `لاعب ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(testStory14, names);
  assert(players.length === 8, 'TEST 3: 14-character story allocates exactly 8 players');
}

// =========================================================================
// TEST 4: 14-character story can allocate 10 players
// =========================================================================
{
  const names = Array.from({ length: 10 }, (_, i) => `لاعب ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(testStory14, names);
  assert(players.length === 10, 'TEST 4: 14-character story allocates exactly 10 players');
}

// =========================================================================
// TEST 5: 14-character story can allocate 12 players when dependency-safe
// =========================================================================
{
  const names = Array.from({ length: 12 }, (_, i) => `لاعب ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(testStory14, names);
  assert(players.length === 12, 'TEST 5: 14-character story allocates exactly 12 players');
}

// =========================================================================
// TEST 6: Selected characters are unique
// =========================================================================
{
  const names = Array.from({ length: 8 }, (_, i) => `لاعب ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(testStory14, names);
  const assignedNames = players.map(p => p.character.name);
  const uniqueNames = new Set(assignedNames);
  assert(uniqueNames.size === 8, 'TEST 6: All assigned character names are unique');
}

// =========================================================================
// TEST 7: Exactly one guilty character is selected by default
// =========================================================================
{
  const names = Array.from({ length: 6 }, (_, i) => `لاعب ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(testStory14, names);
  const guiltyPlayers = players.filter(p => p.guilty);
  assert(guiltyPlayers.length === 1, 'TEST 7: Exactly one guilty player selected by default');
}

// =========================================================================
// TEST 8: Non-selected guilty candidates can appear as normal non-guilty suspects
// =========================================================================
{
  // If Faris is selected as guilty, he mentions Nabil.
  // Therefore Nabil (who is in guiltyPool) must be included as innocent (guilty: false).
  const names = ['أحمد', 'سارة', 'خالد', 'منى'];
  // Force selection of Faris
  const graph = CharacterAllocator.buildDependencyGraph(testStory14);
  const farisClosure = graph.closures.get('فارس');
  assert(farisClosure?.has('نبيل') === true, 'TEST 8: Faris requires Nabil via dependency');

  // Run allocation with fixed seed that picks Faris
  let foundGuiltyPoolAsInnocent = false;
  for (let s = 0; s < 20; s++) {
    const players = CharacterAllocator.allocateCharacters(testStory14, names, {
      randomFn: createSeededRandom(s * 17)
    });
    const farisPlayer = players.find(p => p.character.name === 'فارس');
    const nabilPlayer = players.find(p => p.character.name === 'نبيل');
    if (farisPlayer && farisPlayer.guilty && nabilPlayer) {
      assert(nabilPlayer.guilty === false, 'TEST 8: Nabil from guiltyPool is assigned guilty = false');
      foundGuiltyPoolAsInnocent = true;
      break;
    }
  }
  assert(foundGuiltyPoolAsInnocent, 'TEST 8: Found allocation where non-selected guiltyPool candidate is normal suspect');
}

// =========================================================================
// TEST 9: A selected character's referenced character is also active
// =========================================================================
{
  const names = Array.from({ length: 4 }, (_, i) => `لاعب ${i + 1}`);
  for (let s = 0; s < 10; s++) {
    const players = CharacterAllocator.allocateCharacters(testStory14, names, {
      randomFn: createSeededRandom(s * 53)
    });
    const activeNames = new Set(players.map(p => p.character.name));

    // If Azizah is in active, Nabil MUST be in active
    if (activeNames.has('عزيزة')) {
      assert(activeNames.has('نبيل'), 'TEST 9: Azizah being active forces Nabil to be active');
    }
    // If Warda is in active, Durra MUST be in active
    if (activeNames.has('وردة')) {
      assert(activeNames.has('درة'), 'TEST 9: Warda being active forces Durra to be active');
    }
    // If Ihsan is in active, Faris MUST be in active
    if (activeNames.has('إحسان')) {
      assert(activeNames.has('فارس'), 'TEST 9: Ihsan being active forces Faris to be active');
    }
  }
}

// =========================================================================
// TEST 10: Transitive dependencies are resolved (A -> B -> C)
// =========================================================================
{
  const transitiveStory: Story = {
    ...testStory14,
    id: 'transitive_story',
    guiltyPool: [
      {
        name: 'جاني',
        profession: 'طبيب',
        publicIdentity: 'طبيب',
        knowledge: 'شاهدت الشاهد1 في الممر.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'الشاهد1',
        profession: 'محامي',
        publicIdentity: 'محامي',
        knowledge: 'شاهدت الشاهد2 في الحديقة.',
        guilty: false
      },
      {
        name: 'الشاهد2',
        profession: 'حارس',
        publicIdentity: 'حارس',
        knowledge: 'شاهدت الشاهد3 عند البوابة.',
        guilty: false
      },
      {
        name: 'الشاهد3',
        profession: 'سائق',
        publicIdentity: 'سائق',
        knowledge: 'كنت في السيارة.',
        guilty: false
      },
      {
        name: 'مستقل1',
        profession: 'طاهي',
        publicIdentity: 'طاهي',
        knowledge: 'في المطبخ.',
        guilty: false
      },
      {
        name: 'مستقل2',
        profession: 'خادم',
        publicIdentity: 'خادم',
        knowledge: 'في البهو.',
        guilty: false
      }
    ]
  };

  const players = CharacterAllocator.allocateCharacters(
    transitiveStory,
    ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']
  );
  const activeNames = new Set(players.map(p => p.character.name));
  assert(activeNames.has('جاني'), 'TEST 10: Transitive root جاني is active');
  assert(activeNames.has('الشاهد1'), 'TEST 10: Step 1 الشاهد1 is active');
  assert(activeNames.has('الشاهد2'), 'TEST 10: Step 2 الشاهد2 is active');
  assert(activeNames.has('الشاهد3'), 'TEST 10: Step 3 الشاهد3 is active');
}

// =========================================================================
// TEST 11: No dangling references are produced
// =========================================================================
{
  const names = Array.from({ length: 5 }, (_, i) => `لاعب ${i + 1}`);
  for (let s = 0; s < 20; s++) {
    const players = CharacterAllocator.allocateCharacters(testStory14, names, {
      randomFn: createSeededRandom(s * 71)
    });
    const activeNames = new Set(players.map(p => p.character.name));
    const allPoolNames = [...testStory14.guiltyPool, ...testStory14.innocentPool].map(c => c.name);

    players.forEach(p => {
      const text = `${p.character.publicIdentity || ''} ${p.character.knowledge || ''}`;
      const mentioned = CharacterAllocator.detectReferencesInText(p.character.name, text, allPoolNames);
      mentioned.forEach(m => {
        assert(activeNames.has(m), `TEST 11: Mentioned character "${m}" is present in active roster`);
      });
    });
  }
}

// =========================================================================
// TEST 12: Allocation remains deterministic with a supplied randomFn
// =========================================================================
{
  const names = Array.from({ length: 6 }, (_, i) => `لاعب ${i + 1}`);
  const seed = 12345;
  const run1 = CharacterAllocator.allocateCharacters(testStory14, names, {
    randomFn: createSeededRandom(seed)
  });
  const run2 = CharacterAllocator.allocateCharacters(testStory14, names, {
    randomFn: createSeededRandom(seed)
  });

  const chars1 = run1.map(p => `${p.character.name}:${p.guilty}`).join(',');
  const chars2 = run2.map(p => `${p.character.name}:${p.guilty}`).join(',');
  assert(chars1 === chars2, 'TEST 12: Deterministic seeded runs produce identical rosters');
}

// =========================================================================
// TEST 13: Different random seeds can produce different valid rosters
// =========================================================================
{
  const names = Array.from({ length: 6 }, (_, i) => `لاعب ${i + 1}`);
  const rosterSet = new Set<string>();

  for (let s = 0; s < 10; s++) {
    const run = CharacterAllocator.allocateCharacters(testStory14, names, {
      randomFn: createSeededRandom(s * 9999 + 1)
    });
    const signature = run.map(p => p.character.name).sort().join(',');
    rosterSet.add(signature);
  }

  assert(rosterSet.size > 1, `TEST 13: Different seeds produced ${rosterSet.size} distinct valid rosters`);
}

// =========================================================================
// TEST 14: Impossible dependency clusters fail cleanly with an Error
// =========================================================================
{
  const impossibleStory: Story = {
    ...testStory14,
    id: 'impossible_alloc_story',
    guiltyPool: [
      {
        name: 'جاني كبير',
        profession: 'طبيب',
        publicIdentity: 'طبيب',
        knowledge: 'شاهدت شاهد1 وشاهد2 وشاهد3 وشاهد4 وشاهد5',
        guilty: true
      }
    ],
    innocentPool: [
      { name: 'شاهد1', profession: 'م1', publicIdentity: 'ه1', knowledge: '', guilty: false },
      { name: 'شاهد2', profession: 'م2', publicIdentity: 'ه2', knowledge: '', guilty: false },
      { name: 'شاهد3', profession: 'م3', publicIdentity: 'ه3', knowledge: '', guilty: false },
      { name: 'شاهد4', profession: 'م4', publicIdentity: 'ه4', knowledge: '', guilty: false },
      { name: 'شاهد5', profession: 'م5', publicIdentity: 'ه5', knowledge: '', guilty: false }
    ]
  };

  let threw = false;
  try {
    CharacterAllocator.allocateCharacters(impossibleStory, ['ل1', 'ل2', 'ل3', 'ل4']);
  } catch (err: any) {
    threw = true;
    assert(err.message.includes('cannot safely generate'), 'TEST 14: Clear error message thrown on impossible cluster');
  }
  assert(threw, 'TEST 14: Allocation throws on impossible dependency cluster');
}

// =========================================================================
// TEST 15: Player count below 4 fails
// =========================================================================
{
  let threw = false;
  try {
    CharacterAllocator.allocateCharacters(testStory14, ['ل1', 'ل2', 'ل3']);
  } catch (err: any) {
    threw = true;
    assert(err.message.includes('between 4 and 12'), 'TEST 15: Error thrown for < 4 players');
  }
  assert(threw, 'TEST 15: < 4 players rejected');
}

// =========================================================================
// TEST 16: Player count above 12 fails
// =========================================================================
{
  const names13 = Array.from({ length: 13 }, (_, i) => `لاعب ${i + 1}`);
  let threw = false;
  try {
    CharacterAllocator.allocateCharacters(testStory14, names13);
  } catch (err: any) {
    threw = true;
    assert(err.message.includes('between 4 and 12'), 'TEST 16: Error thrown for > 12 players');
  }
  assert(threw, 'TEST 16: > 12 players rejected');
}

// =========================================================================
// TEST 17: Insufficient total characters fails
// =========================================================================
{
  const smallPoolStory: Story = {
    ...testStory14,
    id: 'small_pool_story',
    guiltyPool: [{ name: 'جاني', profession: 'طبيب', publicIdentity: 'طبيب', knowledge: '', guilty: true }],
    innocentPool: [
      { name: 'بريء 1', profession: 'مهندس', publicIdentity: 'مهندس', knowledge: '', guilty: false },
      { name: 'بريء 2', profession: 'محامي', publicIdentity: 'محامي', knowledge: '', guilty: false },
      { name: 'بريء 3', profession: 'حارس', publicIdentity: 'حارس', knowledge: '', guilty: false }
    ]
  };

  let threw = false;
  try {
    CharacterAllocator.allocateCharacters(smallPoolStory, Array.from({ length: 6 }, (_, i) => `لاعب ${i + 1}`));
  } catch (err: any) {
    threw = true;
    assert(err.message.includes('maximum of 4 players'), 'TEST 17: Error thrown when pool is smaller than player count');
  }
  assert(threw, 'TEST 17: Insufficient pool rejected');
}

// =========================================================================
// TEST 18: Required guilty count is preserved
// =========================================================================
{
  const multiGuiltyStory: Story = {
    ...testStory14,
    requiredGuiltyCount: 2
  };
  const names = Array.from({ length: 8 }, (_, i) => `لاعب ${i + 1}`);
  const players = CharacterAllocator.allocateCharacters(multiGuiltyStory, names, {
    guiltyCount: 2
  });
  const guiltyPlayers = players.filter(p => p.guilty);
  assert(guiltyPlayers.length === 2, 'TEST 18: Explicit required guilty count (2) is preserved');
}

// =========================================================================
// TEST 19: Evidence relatedCharacters dependency pulls referenced characters into active roster
// =========================================================================
{
  const evidenceStory: Story = {
    ...testStory14,
    guiltyPool: [
      {
        name: 'فارس',
        profession: 'رئيس الطهاة',
        publicIdentity: 'أنت رئيس الطهاة في القصر.',
        knowledge: 'المطبخ كان هادئاً الليلة.', // No direct text mention of نبيل
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'نبيل',
        profession: 'خادم القاعة',
        publicIdentity: 'خادم القاعة الملكية الرئيسي.',
        knowledge: 'تعرف أن صوت العربة سُجل مرتين.',
        guilty: false
      },
      ...testStory14.innocentPool
    ],
    evidence: [
      {
        id: 'ev_nabil_cup',
        title: 'كوب شاي نبيل',
        description: 'كوب شاي مميز خاص بالخادم نبيل وجد في مسرح الجريمة.',
        category: 'physical',
        relatedCharacters: ['نبيل']
      }
    ]
  };

  const graph = CharacterAllocator.buildDependencyGraph(evidenceStory);
  assert(graph.allCharacters.length === 13, 'TEST 19A: Evidence story graph built correctly');
  assert(graph.dependencies.get('فارس')?.has('نبيل') === true, 'TEST 19B: Faris directly depends on Nabil due to evidence relatedCharacters');

  const names4 = ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4'];
  const players = CharacterAllocator.allocateCharacters(evidenceStory, names4, {
    shuffle: true,
    randomFn: createSeededRandom(42)
  });

  const activeNames = new Set(players.map(p => p.character.name));
  assert(activeNames.has('فارس'), 'TEST 19C: Faris (guilty) is active');
  assert(activeNames.has('نبيل'), 'TEST 19D: Nabil (from evidence relatedCharacters) is in active roster');
}

// =========================================================================
// TEST 20: Evidence text character references without relatedCharacters
// =========================================================================
{
  const textEvidenceStory: Story = {
    ...testStory14,
    guiltyPool: [
      {
        name: 'فارس',
        profession: 'رئيس الطهاة',
        publicIdentity: 'أنت رئيس الطهاة في القصر.',
        knowledge: 'لم أغادر موقعي.',
        guilty: true
      }
    ],
    evidence: [
      {
        id: 'ev_aziza_instrument',
        title: 'وتر قيثارة مقطوع',
        description: 'عثر المحققون على وتر مقطوع يعود لعازفة القيثارة عزيزة قرب الباب الخلفي.',
        category: 'physical'
      }
    ]
  };

  const graph = CharacterAllocator.buildDependencyGraph(textEvidenceStory);
  assert(graph.dependencies.get('فارس')?.has('عزيزة') === true, 'TEST 20A: Faris depends on Aziza via evidence text detection');

  const names4 = ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4'];
  const players = CharacterAllocator.allocateCharacters(textEvidenceStory, names4, {
    shuffle: true,
    randomFn: createSeededRandom(101)
  });
  const activeNames = new Set(players.map(p => p.character.name));
  assert(activeNames.has('عزيزة'), 'TEST 20B: Aziza (from evidence text) is in active roster');
}

// =========================================================================
// TEST 21: Transitive Evidence Dependencies (Guilty -> Evidence -> Char A -> Char B)
// =========================================================================
{
  const transitiveEvStory: Story = {
    ...testStory14,
    guiltyPool: [
      {
        name: 'فارس',
        profession: 'رئيس الطهاة',
        publicIdentity: 'أنت رئيس الطهاة.',
        knowledge: 'كل شيء كان معداً.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'نبيل',
        profession: 'خادم القاعة',
        publicIdentity: 'خادم القاعة الرئيسي.',
        knowledge: 'رأيت عزيزة تعبر الممر مسرعة.', // Nabil -> Aziza
        guilty: false
      },
      ...testStory14.innocentPool
    ],
    evidence: [
      {
        id: 'ev_nabil_badge',
        title: 'شارة نبيل المفقودة',
        description: 'شارة الخادم نبيل سقطت على الأرض.',
        category: 'physical',
        relatedCharacters: ['نبيل']
      }
    ]
  };

  const graph = CharacterAllocator.buildDependencyGraph(transitiveEvStory);
  assert(graph.closures.get('فارس')?.has('نبيل') === true, 'TEST 21A: Closure includes direct evidence dep Nabil');
  assert(graph.closures.get('فارس')?.has('عزيزة') === true, 'TEST 21B: Closure includes transitive dep Aziza');

  const names4 = ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4'];
  const players = CharacterAllocator.allocateCharacters(transitiveEvStory, names4, {
    shuffle: true,
    randomFn: createSeededRandom(777)
  });
  const activeNames = new Set(players.map(p => p.character.name));
  assert(activeNames.has('نبيل'), 'TEST 21C: Nabil in active roster');
  assert(activeNames.has('عزيزة'), 'TEST 21D: Aziza in active roster transitively');
}

// =========================================================================
// TEST 22: Deterministic seeded allocation produces exact same result for same seed
// and different valid rosters for different seeds
// =========================================================================
{
  const names6 = ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4', 'لاعب 5', 'لاعب 6'];
  const seedA = createSeededRandom(12345);
  const seedB = createSeededRandom(12345);
  const seedC = createSeededRandom(99999);

  const rosterA = CharacterAllocator.allocateCharacters(testStory14, names6, { shuffle: true, randomFn: seedA });
  const rosterB = CharacterAllocator.allocateCharacters(testStory14, names6, { shuffle: true, randomFn: seedB });
  const rosterC = CharacterAllocator.allocateCharacters(testStory14, names6, { shuffle: true, randomFn: seedC });

  const charsA = rosterA.map(p => p.character.name).join(',');
  const charsB = rosterB.map(p => p.character.name).join(',');
  const charsC = rosterC.map(p => p.character.name).join(',');

  assert(charsA === charsB, 'TEST 22A: Same seed produces identical character allocation');
  assert(charsA !== charsC, 'TEST 22B: Different seeds produce different character allocations');
}

// =========================================================================
// TEST 23: Impossible dependency closure fails clearly
// =========================================================================
{
  // Story where guilty character has a chain of 5 dependencies (total 6 characters), but only 4 players requested
  const impossibleChainStory: Story = {
    ...testStory14,
    guiltyPool: [
      {
        name: 'جاني_سلسلة',
        profession: 'قائد',
        publicIdentity: 'قائد',
        knowledge: 'أعرف أن شخص_1 تحرك.',
        guilty: true
      }
    ],
    innocentPool: [
      { name: 'شخص_1', profession: 'دور 1', publicIdentity: 'دور 1', knowledge: 'رأيت شخص_2.', guilty: false },
      { name: 'شخص_2', profession: 'دور 2', publicIdentity: 'دور 2', knowledge: 'سمعت شخص_3.', guilty: false },
      { name: 'شخص_3', profession: 'دور 3', publicIdentity: 'دور 3', knowledge: 'تحدثت مع شخص_4.', guilty: false },
      { name: 'شخص_4', profession: 'دور 4', publicIdentity: 'دور 4', knowledge: 'التقيت بـ شخص_5.', guilty: false },
      { name: 'شخص_5', profession: 'دور 5', publicIdentity: 'دور 5', knowledge: 'كنت بمفردي.', guilty: false }
    ]
  };

  let threw = false;
  try {
    CharacterAllocator.allocateCharacters(impossibleChainStory, ['لاعب 1', 'لاعب 2', 'لاعب 3', 'لاعب 4']);
  } catch (err: any) {
    threw = true;
    assert(
      err.message.includes('cannot safely generate a 4-player roster'),
      'TEST 23: Clear failure when dependency closure exceeds player count'
    );
  }
  assert(threw, 'TEST 23: Impossible dependency closure rejected');
}

// =========================================================================
// TEST 24: Comprehensive Stress Testing across ALL 16 Built-in Stories
// 16 stories × supported player counts × 50 deterministic seeds
// With all 12 Stress Test Assertions
// =========================================================================
{
  const allStories = StoryStore.getBuiltInStories();
  console.log(`\n==================================================`);
  console.log(`STRESS TEST COMPATIBILITY MATRIX REPORT`);
  console.log(`Stories to evaluate: ${allStories.length}`);
  console.log(`==================================================\n`);

  let totalAllocationsAttempted = 0;
  let totalSuccessfulAllocations = 0;
  let totalUnsupportedAllocations = 0;
  let totalDanglingFailures = 0;
  let totalStructuredEvidenceFailures = 0;

  const storyMatrixResults: Record<string, Record<number, string>> = {};

  allStories.forEach(story => {
    storyMatrixResults[story.id] = {};
    console.log(`Story: ${story.id} (${story.title})`);

    const min = story.minPlayers || 4;
    const max = story.maxPlayers || 12;
    const totalPoolChars = (story.guiltyPool?.length || 0) + (story.innocentPool?.length || 0);
    const targetGuiltyCount = StoryEngine.getGuiltyCountForScenario(story);
    const storyEvidence = StoryEngine.getStoryEvidence(story);

    for (let count = 4; count <= 12; count++) {
      if (count < min || count > max || count > totalPoolChars) {
        continue;
      }

      let validCount = 0;
      let unsupportedReason = '';
      const playerNames = Array.from({ length: count }, (_, i) => `لاعب ${i + 1}`);

      for (let seed = 1; seed <= 50; seed++) {
        totalAllocationsAttempted++;
        const randomFn = createSeededRandom(seed * 1000 + count * 37 + 7);

        try {
          const players = CharacterAllocator.allocateCharacters(story, playerNames, {
            shuffle: true,
            randomFn
          });

          // Assertion 1: roster.length === requestedPlayerCount
          if (players.length !== count) {
            throw new Error(`Roster length (${players.length}) does not match requested count (${count})`);
          }

          // Assertion 2: every player has a unique character
          const characterNames = players.map(p => p.character.name);
          const uniqueCharNames = new Set(characterNames);
          if (uniqueCharNames.size !== count) {
            throw new Error(`Duplicate character assigned in roster: ${characterNames.join(', ')}`);
          }

          // Assertion 3: every character has a valid name
          players.forEach(p => {
            if (!p.character.name || p.character.name.trim() === '') {
              throw new Error(`Invalid empty character name found in player ${p.id}`);
            }
          });

          // Assertion 4: every active character belongs to the story
          const allPoolChars = [...(story.guiltyPool || []), ...(story.innocentPool || [])];
          const allPoolNames = new Set(allPoolChars.map(c => c.name));
          players.forEach(p => {
            if (!allPoolNames.has(p.character.name)) {
              throw new Error(`Character ${p.character.name} does not belong to story ${story.id}`);
            }
          });

          // Assertion 5: exactly targetGuiltyCount active characters have guilty === true
          const guiltyPlayers = players.filter(p => p.guilty);
          if (guiltyPlayers.length !== targetGuiltyCount) {
            throw new Error(`Guilty count mismatch: expected ${targetGuiltyCount}, got ${guiltyPlayers.length}`);
          }

          // Assertion 6: all other active characters have guilty === false
          const innocentPlayers = players.filter(p => !p.guilty);
          if (innocentPlayers.length !== count - targetGuiltyCount) {
            throw new Error(`Innocent count mismatch: expected ${count - targetGuiltyCount}, got ${innocentPlayers.length}`);
          }

          // Assertion 7: no active character has a dangling character dependency
          const activeNameSet = new Set(characterNames);
          const allPoolNamesList = Array.from(allPoolNames);

          players.forEach(p => {
            const text = `${p.character.publicIdentity || ''} ${p.character.knowledge || ''}`;
            const mentioned = CharacterAllocator.detectReferencesInText(p.character.name, text, allPoolNamesList);
            mentioned.forEach(m => {
              if (!activeNameSet.has(m)) {
                totalDanglingFailures++;
                throw new Error(
                  `Dangling reference: Character "${p.character.name}" references "${m}", but "${m}" is not in active roster!`
                );
              }
            });
          });

          // Assertion 8: no structured EvidenceItem.relatedCharacters reference points to an inactive character when that evidence is active
          storyEvidence.forEach(ev => {
            if (Array.isArray(ev.relatedCharacters) && ev.relatedCharacters.length > 0) {
              // Check if any character in relatedCharacters is in active roster
              const activeInEvidence = ev.relatedCharacters.filter(rc => activeNameSet.has(rc));
              if (activeInEvidence.length > 0) {
                // If any related character is active, all other playable characters in relatedCharacters must also be active
                ev.relatedCharacters.forEach(rc => {
                  if (allPoolNames.has(rc) && !activeNameSet.has(rc)) {
                    totalStructuredEvidenceFailures++;
                    throw new Error(
                      `Structured evidence dangling ref in ${ev.id}: "${rc}" is missing from active roster!`
                    );
                  }
                });
              }
            }
          });

          // Assertion 9: no duplicate player IDs
          const playerIds = new Set(players.map(p => p.id));
          if (playerIds.size !== count) {
            throw new Error(`Duplicate player ID found`);
          }

          // Assertion 10: valid player assignment
          players.forEach((p, idx) => {
            if (p.id !== idx + 1 || p.name !== playerNames[idx]) {
              throw new Error(`Player mapping mismatch at index ${idx}`);
            }
          });

          // Assertion 11: all dependency chains are satisfied transitively
          const graph = CharacterAllocator.buildDependencyGraph(story);
          for (const charName of activeNameSet) {
            const closure = graph.closures.get(charName);
            if (closure) {
              for (const req of closure) {
                if (!activeNameSet.has(req)) {
                  throw new Error(`Transitive closure requirement "${req}" for "${charName}" missing from roster!`);
                }
              }
            }
          }

          validCount++;
          totalSuccessfulAllocations++;
        } catch (err: any) {
          unsupportedReason = err.message;
        }
      }

      if (validCount === 50) {
        storyMatrixResults[story.id][count] = `50/50 valid`;
        console.log(`  ${count} players: 50/50 valid`);
      } else {
        totalUnsupportedAllocations += (50 - validCount);
        storyMatrixResults[story.id][count] = `UNSUPPORTED (${validCount}/50 valid) - ${unsupportedReason}`;
        console.log(`  ${count} players: UNSUPPORTED - Reason: ${unsupportedReason}`);
      }
    }
  });

  console.log(`\n==================================================`);
  console.log(`STRESS TEST SUMMARY:`);
  console.log(`Total built-in stories tested: ${allStories.length}`);
  console.log(`Total allocations attempted: ${totalAllocationsAttempted}`);
  console.log(`Total successful allocations: ${totalSuccessfulAllocations}`);
  console.log(`Total unsupported allocations: ${totalUnsupportedAllocations}`);
  console.log(`Total dangling character references: ${totalDanglingFailures}`);
  console.log(`Total structured evidence failures: ${totalStructuredEvidenceFailures}`);
  console.log(`==================================================\n`);

  assert(allStories.length >= 13, 'TEST 24A: All built-in stories tested');
  assert(totalAllocationsAttempted >= 5750, `TEST 24B: Executed at least 5,750 allocation attempts across all built-in stories (Actual: ${totalAllocationsAttempted})`);
  assert(totalSuccessfulAllocations === totalAllocationsAttempted, `TEST 24C: 100% of supported allocation attempts were completely valid (${totalSuccessfulAllocations}/${totalAllocationsAttempted})`);
  assert(totalDanglingFailures === 0, 'TEST 24D: Exactly 0 dangling character references across all allocations');
  assert(totalStructuredEvidenceFailures === 0, 'TEST 24E: Exactly 0 structured evidence dangling references');
}

console.log(`\n==================================================`);
console.log(`ALL CHARACTER ALLOCATOR TESTS PASSED: ${passedTests} passed, ${failedTests} failed.`);
console.log(`==================================================\n`);
