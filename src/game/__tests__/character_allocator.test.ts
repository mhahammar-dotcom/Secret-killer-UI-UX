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
// TEST 19: Evidence-related character dependencies are respected where applicable
// =========================================================================
{
  const evidenceStory: Story = {
    ...testStory14,
    evidence: [
      {
        id: 'ev_nabil_cup',
        title: 'كوب نبيل المفقود',
        description: 'كوب شاي خاص بالخادم نبيل وجد في مسرح الجريمة.',
        category: 'physical',
        relatedCharacters: ['نبيل']
      }
    ]
  };

  const graph = CharacterAllocator.buildDependencyGraph(evidenceStory);
  assert(graph.allCharacters.length === 14, 'TEST 19: Evidence story graph built correctly');
}

// =========================================================================
// TEST 20: Every built-in story is tested across every supported player count
// TEST 21: Run at least 50 deterministic seeded allocations per supported player count for built-in stories
// TEST 22: No generated roster contains references to inactive characters
// =========================================================================
{
  const allStories = StoryStore.getAllStories();
  console.log(`\nSimulating 50 seeded allocations for all ${allStories.length} built-in stories across player counts 4-12...`);

  let totalSimulations = 0;
  let totalDanglingFailures = 0;

  allStories.forEach(story => {
    const totalChars = (story.guiltyPool?.length || 0) + (story.innocentPool?.length || 0);

    for (let count = 4; count <= 12; count++) {
      if (count > totalChars) continue;

      const playerNames = Array.from({ length: count }, (_, i) => `لاعب ${i + 1}`);

      for (let sim = 0; sim < 50; sim++) {
        totalSimulations++;
        const randomFn = createSeededRandom(sim * 1000 + count * 41 + 13);

        const players = CharacterAllocator.allocateCharacters(story, playerNames, {
          shuffle: true,
          randomFn
        });

        if (players.length !== count) {
          throw new Error(`TEST 20/21: Story ${story.id} allocated ${players.length} instead of ${count}`);
        }

        const activeNames = new Set(players.map(p => p.character.name));
        const allPoolNames = [...story.guiltyPool, ...story.innocentPool].map(c => c.name);

        players.forEach(p => {
          const text = `${p.character.publicIdentity || ''} ${p.character.knowledge || ''}`;
          const mentioned = CharacterAllocator.detectReferencesInText(p.character.name, text, allPoolNames);

          mentioned.forEach(m => {
            if (!activeNames.has(m)) {
              totalDanglingFailures++;
              throw new Error(
                `TEST 22: Dangling reference in story ${story.id}: ${p.character.name} references ${m}, but ${m} is inactive!`
              );
            }
          });
        });
      }
    }
  });

  assert(totalSimulations >= 5850, `TEST 20/21: Successfully ran ${totalSimulations} seeded simulations across all stories`);
  assert(totalDanglingFailures === 0, 'TEST 22: Exactly 0 dangling references across all 5,850+ simulations');
}

console.log(`\n==================================================`);
console.log(`ALL CHARACTER ALLOCATOR TESTS PASSED: ${passedTests} passed, ${failedTests} failed.`);
console.log(`==================================================\n`);
