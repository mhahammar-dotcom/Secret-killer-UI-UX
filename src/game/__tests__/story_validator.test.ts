import { Story, EvidenceItem, StoryCharacter } from '../types';
import { StoryValidator } from '../StoryValidator';
import { StoryStore } from '../StoryStore';

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

console.log(`\n==================================================`);
console.log(`RUNNING PHASE 7 STORY VALIDATOR TEST SUITE`);
console.log(`==================================================\n`);

const baseValidCharacters: StoryCharacter[] = [
  {
    name: 'د. يوسف',
    profession: 'طبيب العائلة',
    publicIdentity: 'أنت طبيب العائلة المشرف على علاج الضحية منذ سنوات.',
    knowledge: 'تعرف أن جرعة الدواء كانت محددة بدقة، وكان هناك خلاف مالي حول أتعابك.',
    guilty: true
  },
  {
    name: 'سارة',
    profession: 'المحامية القانونية',
    publicIdentity: 'محامية العائلة المسؤولة عن كتابة الوصية الأخيرة.',
    knowledge: 'سمعت مشادة كلامية حول تغيير المستفيدين في الساعة 21:30، وكنت في المكتب.',
    guilty: false
  },
  {
    name: 'فارس',
    profession: 'شريك الأعمال',
    publicIdentity: 'شريك تجاري رئيسي في شركة الاستثمار.',
    knowledge: 'كنت في بهو القصر عند وقوع الحادث، وهناك ديون مشتركة بينك وبين الضحية.',
    guilty: false
  },
  {
    name: 'هدى',
    profession: 'مديرة المنزل',
    publicIdentity: 'المشرفة على الخدم وتنظيم الحفل.',
    knowledge: 'رأيت شخصاً يخرج مسرعاً من الممر الخلفي حوالي 21:40، وكنت في المطبخ.',
    guilty: false
  }
];

const sampleValidEvidence: EvidenceItem[] = [
  {
    id: 'ev_1',
    title: 'سجل الدخول والمغادرة',
    description: 'سجل إلكتروني يوضح أوقات الدخول بين 21:00 و 22:00.',
    publicClue: 'شوهد شخص يتحرك في الممر عند 21:35.',
    category: 'timeline',
    relatedCharacters: ['سارة', 'فارس'],
    isInitialPublic: true
  },
  {
    id: 'ev_2',
    title: 'خلاف مالي في الأوراق',
    description: 'وثيقة تظهر خلافاً مالياً بين الضحية وشريكه التجاري.',
    publicClue: 'هناك ديون متراكمة لم يتم تسويتها.',
    category: 'motive',
    relatedCharacters: ['فارس'],
    isInitialPublic: false
  },
  {
    id: 'ev_3',
    title: 'قارورة الدواء الفارغة',
    description: 'قارورة دواء في غرفة المكتب مع آثار بصمات جزئية.',
    publicClue: 'الجرعة تبدو مضاعفة عن المعتاد.',
    category: 'physical',
    relatedCharacters: ['د. يوسف'],
    isInitialPublic: false
  }
];

const sampleStory: Story = {
  id: 'manor_mystery',
  title: 'جريمة في القصر الإنجليزي',
  description: 'مقتل اللورد في غرفته الخاصة أثناء حفل العشاء السنوي.',
  minPlayers: 4,
  maxPlayers: 4,
  isBuiltInFixed: false,
  introduction: {
    setting: 'قصر ريفي معزول أثناء عاصفة رعدية شديدة.',
    situation: 'اجتمع أفراد العائلة والأصدقاء المقربون للاحتفال السنوي.',
    incident: 'في تمام الساعة 21:45 عُثر على اللورد مسموماً في مكتبه المغلق.',
    stakes: 'القاتل بين الحاضرين في القصر ويحاول توجيه الشكوك نحو الآخرين.'
  },
  guiltyPool: [baseValidCharacters[0]],
  innocentPool: baseValidCharacters.slice(1),
  evidence: sampleValidEvidence,
  clues: [],
  wrongVoteHints: ['دققوا في سجل الأدوية.', 'راجعوا دوافع كل شخص.'],
  investigationRounds: [],
  solution: 'د. يوسف هو القاتل حيث استبدل الدواء بجرعة سامة بسبب خلافه المالي واقتراب موعد مراجعته.',
  gameRules: {
    maxWrongVotes: 3
  }
};

// =========================================================================
// TEST 1: Valid 4-player story passes validation
// =========================================================================
{
  const result = StoryValidator.validateStory(sampleStory);
  assert(result.valid === true, 'TEST 1: Valid 4-player story is valid');
  assert(result.errors.length === 0, 'TEST 1: Valid 4-player story has 0 errors');
}

// =========================================================================
// TEST 2: Valid 12-player story passes validation
// =========================================================================
{
  const twelveChars: StoryCharacter[] = [
    { name: 'جاني 1', profession: 'طبيب', publicIdentity: 'طبيب العائلة', knowledge: 'خلاف مالي', guilty: true },
    { name: 'جاني 2', profession: 'شريك', publicIdentity: 'شريك تجاري', knowledge: 'ديون متراكمة', guilty: true },
    { name: 'جاني 3', profession: 'محام', publicIdentity: 'محامي الشركة', knowledge: 'عقود سرية', guilty: true },
    ...Array.from({ length: 9 }, (_, i) => ({
      name: `بريء ${i + 1}`,
      profession: `مهنة ${i + 1}`,
      publicIdentity: `الهوية العامة ${i + 1}`,
      knowledge: `كنت في غرفتي في الساعة 21:${30 + i} وشاهدت حركة في الممر.`,
      guilty: false
    }))
  ];

  const story12: Story = {
    ...sampleStory,
    id: 'story_12_players',
    minPlayers: 4,
    maxPlayers: 12,
    guiltyPool: twelveChars.slice(0, 3),
    innocentPool: twelveChars.slice(3),
    evidence: []
  };

  const result = StoryValidator.validateStory(story12);
  assert(result.valid === true, 'TEST 2: Valid 12-player story is valid');
  assert(result.errors.length === 0, 'TEST 2: Valid 12-player story has 0 errors');
}

// =========================================================================
// TEST 3: 3-player story fails (minPlayers < 4 or character count < 4)
// =========================================================================
{
  const story3Players: Story = {
    ...sampleStory,
    id: 'story_3_players',
    minPlayers: 3,
    maxPlayers: 3,
    guiltyPool: [baseValidCharacters[0]],
    innocentPool: [baseValidCharacters[1], baseValidCharacters[2]]
  };

  const result = StoryValidator.validateStory(story3Players);
  assert(result.valid === false, 'TEST 3: 3-player story fails validation');
  assert(result.errors.some(e => e.includes('cannot be less than 4') || e.includes('at least 4')), 'TEST 3: Contains player count error message');
}

// =========================================================================
// TEST 4: 13-player story fails (maxPlayers > 12 or pool > 12)
// =========================================================================
{
  const thirteenChars: StoryCharacter[] = Array.from({ length: 13 }, (_, i) => ({
    name: `شخصية ${i + 1}`,
    profession: `مهنة ${i + 1}`,
    publicIdentity: `هوية ${i + 1}`,
    knowledge: `معلومات ${i + 1}`,
    guilty: i === 0
  }));

  const story13: Story = {
    ...sampleStory,
    id: 'story_13_players',
    minPlayers: 4,
    maxPlayers: 13,
    guiltyPool: [thirteenChars[0]],
    innocentPool: thirteenChars.slice(1)
  };

  const result = StoryValidator.validateStory(story13);
  assert(result.valid === false, 'TEST 4: 13-player story fails validation');
  assert(result.errors.some(e => e.includes('cannot exceed 12') || e.includes('more than 12')), 'TEST 4: Error caught for exceeding 12 players');
}

// =========================================================================
// TEST 5: No guilty player fails
// =========================================================================
{
  const noGuiltyStory: Story = {
    ...sampleStory,
    id: 'no_guilty_story',
    guiltyPool: [],
    innocentPool: baseValidCharacters
  };

  const result = StoryValidator.validateStory(noGuiltyStory);
  assert(result.valid === false, 'TEST 5: Story with no guilty player fails');
  assert(result.errors.some(e => e.includes('guiltyPool') || e.includes('guilty')), 'TEST 5: Error specifies missing guilty pool');
}

// =========================================================================
// TEST 6: Duplicate character ID / name fails
// =========================================================================
{
  const duplicateStory: Story = {
    ...sampleStory,
    id: 'duplicate_char_story',
    guiltyPool: [baseValidCharacters[0]],
    innocentPool: [
      baseValidCharacters[1],
      baseValidCharacters[2],
      { ...baseValidCharacters[1] } // Duplicate of سارة
    ]
  };

  const result = StoryValidator.validateStory(duplicateStory);
  assert(result.valid === false, 'TEST 6: Story with duplicate character names fails');
  assert(result.errors.some(e => e.includes('Duplicate character name found')), 'TEST 6: Duplicate character error reported');
}

// =========================================================================
// TEST 7: Missing introduction fails
// =========================================================================
{
  const missingIntroStory = {
    ...sampleStory,
    id: 'missing_intro_story',
    introduction: undefined as any
  };

  const result = StoryValidator.validateStory(missingIntroStory);
  assert(result.valid === false, 'TEST 7: Story with missing introduction fails');
  assert(result.errors.some(e => e.includes('introduction')), 'TEST 7: Introduction error reported');
}

// =========================================================================
// TEST 8: Missing solution fails
// =========================================================================
{
  const missingSolutionStory: Story = {
    ...sampleStory,
    id: 'missing_solution_story',
    solution: ''
  };

  const result = StoryValidator.validateStory(missingSolutionStory);
  assert(result.valid === false, 'TEST 8: Story with missing solution fails');
  assert(result.errors.some(e => e.includes('solution')), 'TEST 8: Solution error reported');
}

// =========================================================================
// TEST 9: Invalid evidence reference fails
// =========================================================================
{
  const invalidRefEvidence: EvidenceItem[] = [
    {
      id: 'ev_invalid_ref',
      title: 'تقرير هاتف مجهول',
      description: 'مكالمة هاتفية غامضة.',
      category: 'document',
      relatedCharacters: ['شخص_غير_موجود_في_القصة']
    }
  ];

  const storyInvalidRef: Story = {
    ...sampleStory,
    id: 'story_invalid_evidence_ref',
    evidence: invalidRefEvidence
  };

  const result = StoryValidator.validateStory(storyInvalidRef);
  assert(result.valid === false, 'TEST 9: Story with unknown character reference in evidence fails');
  assert(result.errors.some(e => e.includes('references unknown character')), 'TEST 9: Invalid character reference error caught');
}

// =========================================================================
// TEST 10: Single-suspect story produces warning
// =========================================================================
{
  // Story where all innocents have zero knowledge/connection, and evidence only mentions the guilty
  const singleSuspectStory: Story = {
    ...sampleStory,
    id: 'single_suspect_story',
    innocentPool: [
      { name: 'بريء 1', profession: 'حارس', publicIdentity: 'حارس بعيد', knowledge: 'لا شيء', guilty: false },
      { name: 'بريء 2', profession: 'طاه', publicIdentity: 'طاه بالمطبخ', knowledge: 'لا شيء', guilty: false },
      { name: 'بريء 3', profession: 'سائق', publicIdentity: 'سائق بالخارج', knowledge: 'لا شيء', guilty: false }
    ],
    evidence: [
      {
        id: 'ev_only_doc',
        title: 'أدلة الطبيب',
        description: 'أدلة تشير للطبيب فقط.',
        category: 'motive',
        relatedCharacters: ['د. يوسف']
      }
    ]
  };

  const result = StoryValidator.validateStory(singleSuspectStory);
  assert(result.warnings?.some(w => w.includes('Only one plausible suspect') || w.includes('plausible suspects')) === true, 'TEST 10: Single suspect story produces warning');
}

// =========================================================================
// TEST 11: Direct killer evidence produces warning
// =========================================================================
{
  const directEvidenceStory: Story = {
    ...sampleStory,
    id: 'direct_evidence_story',
    evidence: [
      {
        id: 'ev_direct_cam',
        title: 'تسجيل الكاميرا الصريح',
        description: 'الكاميرا تكشف بوضوح قيام د. يوسف بوضع السم في الكأس وهو القاتل الحقيقي.',
        category: 'physical'
      }
    ]
  };

  const report = StoryValidator.auditStory(directEvidenceStory);
  assert(report.hasDirectKillerEvidence === true, 'TEST 11: Direct killer evidence detected');
  assert(report.evidenceBalance.DIRECT > 0, 'TEST 11: Direct evidence balance count > 0');
  assert(report.warnings.some(w => w.includes('DIRECT evidence')), 'TEST 11: Warning emitted for DIRECT evidence');
}

// =========================================================================
// TEST 12: Missing motive diversity produces warning
// =========================================================================
{
  const noMotivesStory: Story = {
    ...sampleStory,
    id: 'no_motives_story',
    guiltyPool: [{ ...baseValidCharacters[0], knowledge: 'كنت متواجداً فقط.' }],
    innocentPool: baseValidCharacters.slice(1).map(c => ({ ...c, knowledge: 'كنت متواجداً فقط.' }))
  };

  const report = StoryValidator.auditStory(noMotivesStory);
  assert(report.warnings.some(w => w.includes('motives') || w.includes('NO_MOTIVE_DIVERSITY') || w.includes('motive')), 'TEST 12: Missing motive diversity produces warning');
}

// =========================================================================
// TEST 13: Missing relationships produces warning
// =========================================================================
{
  const noRelationshipsStory: Story = {
    ...sampleStory,
    id: 'no_rel_story',
    guiltyPool: [{ name: 'أ', profession: 'مهندس', publicIdentity: 'أنا أعمل هنا', knowledge: 'لا أعرف أحداً', guilty: true }],
    innocentPool: [
      { name: 'ب', profession: 'فني', publicIdentity: 'أنا أعمل هنا', knowledge: 'لا أعرف أحداً', guilty: false },
      { name: 'ج', profession: 'عامل', publicIdentity: 'أنا أعمل هنا', knowledge: 'لا أعرف أحداً', guilty: false },
      { name: 'د', profession: 'حارس', publicIdentity: 'أنا أعمل هنا', knowledge: 'لا أعرف أحداً', guilty: false }
    ]
  };

  const report = StoryValidator.auditStory(noRelationshipsStory);
  assert(report.warnings.some(w => w.includes('relationships') || w.includes('Interpersonal')), 'TEST 13: Missing relationships produces warning');
}

// =========================================================================
// TEST 14: Timeline inconsistency produces warning
// =========================================================================
{
  const timelineStory: Story = {
    ...sampleStory,
    id: 'timeline_story',
    evidence: [
      {
        id: 'ev_timeline_clash',
        title: 'تناقض في التوقيت والتحركات',
        description: 'تقرير يوضح تعارض في المواعيد وتوقيت مستحيل للمغادرة.',
        category: 'timeline'
      }
    ]
  };

  const report = StoryValidator.auditStory(timelineStory);
  assert(
    report.timelineIssues.length > 0 &&
    report.warnings.some(w => w.includes('Timeline contradiction') || w.includes('TIMELINE')),
    'TEST 14: Timeline contradiction produces warning'
  );
}

// =========================================================================
// TEST 15: Legacy secret/objective fields produce warning
// =========================================================================
{
  const legacyStory = {
    ...sampleStory,
    id: 'legacy_story_secrets',
    secret: 'سر قديم للقصة',
    missions: ['مهمة 1'],
    guiltyPool: [
      {
        ...baseValidCharacters[0],
        privateSecret: 'سر خاص بالشخصية',
        killerObjective: 'اقتل الجميع'
      }
    ]
  } as unknown as Story;

  const report = StoryValidator.auditStory(legacyStory);
  assert(report.hasLegacySecrets === true, 'TEST 15: hasLegacySecrets is true');
  assert(report.warnings.some(w => w.includes('Legacy') && (w.includes('secret') || w.includes('objective') || w.includes('mission'))), 'TEST 15: Warnings produced for legacy secrets/objectives');
}

// =========================================================================
// TEST 16: Legacy investigation rounds produce warning
// =========================================================================
{
  const legacyRoundsStory: Story = {
    ...sampleStory,
    id: 'legacy_rounds_story',
    evidence: undefined,
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'الجولة 1',
        publicClue: 'أثر قديم',
        description: 'وصف',
        discussionPrompt: 'ناقشوا'
      }
    ]
  };

  const report = StoryValidator.auditStory(legacyRoundsStory);
  assert(report.hasLegacyRounds === true, 'TEST 16: hasLegacyRounds is true');
  assert(report.warnings.some(w => w.includes('investigationRounds') || w.includes('investigation round')), 'TEST 16: Warning produced for legacy investigation rounds');
}

// =========================================================================
// TEST 17: Story with zero evidence produces warning but remains valid
// =========================================================================
{
  const zeroEvidenceStory: Story = {
    ...sampleStory,
    id: 'zero_evidence_story',
    evidence: [],
    investigationRounds: [],
    clues: []
  };

  const report = StoryValidator.auditStory(zeroEvidenceStory);
  assert(report.isValid === true, 'TEST 17: Story with 0 evidence remains valid (no errors)');
  assert(report.warnings.some(w => w.includes('No investigation evidence defined')), 'TEST 17: Warning produced for zero evidence');
}

// =========================================================================
// TEST 18: Multiple guilty players validate correctly
// =========================================================================
{
  const multiGuiltyStory: Story = {
    ...sampleStory,
    id: 'multi_guilty_story',
    minPlayers: 6,
    maxPlayers: 7,
    requiredGuiltyCount: 2,
    guiltyPool: [
      baseValidCharacters[0],
      {
        name: 'كريم',
        profession: 'خبير الخزائن',
        publicIdentity: 'مستشار أمني',
        knowledge: 'ساعدت في فتح القفل',
        guilty: true
      }
    ],
    innocentPool: [
      ...baseValidCharacters.slice(1),
      {
        name: 'رامي',
        profession: 'مسؤول الاتصالات',
        publicIdentity: 'تقني',
        knowledge: 'سجلت المكالمات',
        guilty: false
      },
      {
        name: 'نور',
        profession: 'طبيبة مساعدة',
        publicIdentity: 'ممرضة',
        knowledge: 'حضرت الحقيبة الطبية',
        guilty: false
      }
    ]
  };

  const report = StoryValidator.auditStory(multiGuiltyStory);
  assert(report.isValid === true, 'TEST 18: Multiple guilty players story is valid');
  assert(report.guiltyCount === 2, 'TEST 18: Guilty count is 2');
}

// =========================================================================
// TEST 19: Custom story validation works seamlessly
// =========================================================================
{
  const customStory: Story = {
    ...sampleStory,
    id: 'custom_story_test_1',
    isCustom: true
  };

  const result = StoryValidator.validateStory(customStory);
  assert(result.valid === true, 'TEST 19: Custom story validation succeeds');

  const saveResult = StoryStore.saveCustomStory(customStory);
  assert(saveResult.valid === true, 'TEST 19: StoryStore successfully saves custom story');
}

// =========================================================================
// TEST 20: maxWrongVotes configuration validates correctly
// =========================================================================
{
  // Valid maxWrongVotes = 2
  const validVotesStory: Story = {
    ...sampleStory,
    id: 'valid_votes_story',
    gameRules: { maxWrongVotes: 2 }
  };
  const reportValid = StoryValidator.auditStory(validVotesStory);
  assert(reportValid.isValid === true, 'TEST 20: Configured maxWrongVotes = 2 is valid');
  assert(!reportValid.warnings.some(w => w.includes('maxWrongVotes')), 'TEST 20: No warning on valid maxWrongVotes');

  // Invalid maxWrongVotes = -1
  const invalidVotesStory: Story = {
    ...sampleStory,
    id: 'invalid_votes_story',
    gameRules: { maxWrongVotes: -1 }
  };
  const reportInvalid = StoryValidator.auditStory(invalidVotesStory);
  assert(reportInvalid.isValid === true, 'TEST 20: Story remains playable despite invalid rule (fallback)');
  assert(reportInvalid.warnings.some(w => w.includes('maxWrongVotes')), 'TEST 20: Warning emitted for invalid maxWrongVotes');
}

// =========================================================================
// TEST 21: 14-character pool with maxPlayers: 12 passes (pool headroom)
// =========================================================================
{
  const fourteenChars: StoryCharacter[] = [
    { name: 'جاني 1', profession: 'طبيب', publicIdentity: 'طبيب', knowledge: 'معلومة 1', guilty: true },
    { name: 'جاني 2', profession: 'شريك', publicIdentity: 'شريك', knowledge: 'معلومة 2', guilty: true },
    { name: 'جاني 3', profession: 'محاسب', publicIdentity: 'محاسب', knowledge: 'معلومة 3', guilty: true },
    ...Array.from({ length: 11 }, (_, i) => ({
      name: `بريء ${i + 1}`,
      profession: `مهنة ${i + 1}`,
      publicIdentity: `هوية ${i + 1}`,
      knowledge: `شهادة ${i + 1}`,
      guilty: false
    }))
  ];

  const story14Pool: Story = {
    ...sampleStory,
    id: 'story_14_pool',
    minPlayers: 4,
    maxPlayers: 12,
    guiltyPool: fourteenChars.slice(0, 3),
    innocentPool: fourteenChars.slice(3),
    evidence: []
  };

  const result = StoryValidator.validateStory(story14Pool);
  assert(result.valid === true, 'TEST 21: 14-character pool with maxPlayers 12 is valid (pool headroom)');
  assert(result.errors.length === 0, 'TEST 21: 0 errors for 14-character pool');
}

// =========================================================================
// TEST 22: Impossible dependency cluster fails validation cleanly
// =========================================================================
{
  // Story with 4 players min, but guilty character depends on a chain of 5 characters -> minimum closure is 6 characters
  const chainChars: StoryCharacter[] = [
    { name: 'قاتل', profession: 'طبيب', publicIdentity: 'طبيب', knowledge: 'شاهدت عضو1 وعضو2', guilty: true },
    { name: 'عضو1', profession: 'مهندس', publicIdentity: 'مهندس', knowledge: 'شاهدت عضو3', guilty: false },
    { name: 'عضو2', profession: 'محامي', publicIdentity: 'محامي', knowledge: 'شاهدت عضو4', guilty: false },
    { name: 'عضو3', profession: 'حارس', publicIdentity: 'حارس', knowledge: 'شاهدت عضو5', guilty: false },
    { name: 'عضو4', profession: 'سائق', publicIdentity: 'سائق', knowledge: 'في الشارع', guilty: false },
    { name: 'عضو5', profession: 'طاهي', publicIdentity: 'طاهي', knowledge: 'في المطبخ', guilty: false },
    { name: 'مستقل1', profession: 'كاتب', publicIdentity: 'كاتب', knowledge: 'في المكتبة', guilty: false },
    { name: 'مستقل2', profession: 'باحث', publicIdentity: 'باحث', knowledge: 'في المختبر', guilty: false }
  ];

  const impossibleStory: Story = {
    ...sampleStory,
    id: 'impossible_cluster_story',
    minPlayers: 4,
    maxPlayers: 8,
    guiltyPool: [chainChars[0]],
    innocentPool: chainChars.slice(1),
    evidence: []
  };

  const result = StoryValidator.validateStory(impossibleStory);
  assert(result.valid === false, 'TEST 22: Impossible 4-player dependency cluster fails validation');
  assert(result.errors.some(e => e.includes('4-player roster')), 'TEST 22: Error identifies unsupported 4-player roster');
}

// =========================================================================
// TEST 23: Evidence relatedCharacters pointing to invalid non-existent character fails
// =========================================================================
{
  const invalidEvidenceStory: Story = {
    ...sampleStory,
    id: 'invalid_evidence_story',
    evidence: [
      {
        id: 'ev_invalid_char',
        title: 'دليل وهمي',
        description: 'يشير إلى شخص غير موجود.',
        category: 'physical',
        relatedCharacters: ['شخص_غير_موجود']
      }
    ]
  };

  const result = StoryValidator.validateStory(invalidEvidenceStory);
  assert(result.valid === false, 'TEST 23: Evidence referencing non-existent character fails validation');
  assert(result.errors.some(e => e.includes('شخص_غير_موجود')), 'TEST 23: Error message mentions missing character name');
}

console.log(`\n==================================================`);
console.log(`ALL VALIDATOR TESTS PASSED: ${passedTests} passed, ${failedTests} failed.`);
console.log(`==================================================\n`);
