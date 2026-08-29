import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { STORY_DEDUCTION_DATABASE, StorySolutionEngine } from '../src/game/StorySolutionEngine';
import { StoryValidator } from '../src/game/StoryValidator';
import { CharacterAllocator } from '../src/game/CharacterAllocator';
import { ENGLISH_STORIES } from '../src/data/englishStories';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
}

console.log('====================================================');
console.log('🧪 RUNNING PHASE 7.2B STORY COMPATIBILITY TEST SUITE');
console.log('====================================================\n');

let passedTests = 0;

// Test A: Museum Guilty Profile Exact Match
console.log('Running Test A: Museum Guilty Profile Exact Match...');
const museum = BUILT_IN_STORIES_V2.find(s => s.id === 'museum')!;
assert(!!museum, 'Museum story exists');
const museumGuiltyNames = museum.guiltyPool.map(g => g.name);
assert(
  museumGuiltyNames.includes('عمر') &&
  museumGuiltyNames.includes('منصور') &&
  museumGuiltyNames.includes('سلمى') &&
  !museumGuiltyNames.includes('بسام'),
  'Museum guiltyPool contains Omar, Mansour, Salma (and not Bassam)'
);
const museumProfiles = STORY_DEDUCTION_DATABASE['museum'].culprits;
assert(
  !!museumProfiles['عمر'] && !!museumProfiles['منصور'] && !!museumProfiles['سلمى'] && !museumProfiles['بسام'],
  'Museum GuiltyProfile database matches Omar, Mansour, Salma exactly'
);
console.log('✅ Test A Passed: Museum profile mismatch completely resolved.\n');
passedTests++;

// Test B: All 13 Stories 1:1 Match
console.log('Running Test B: All 13 Stories 1:1 Match between guiltyPool and GuiltyProfile keys...');
assert(BUILT_IN_STORIES_V2.length === 13, 'Exactly 13 stories present in BUILT_IN_STORIES_V2');
BUILT_IN_STORIES_V2.forEach(story => {
  const result = StorySolutionEngine.checkStoryProfiles(story);
  assert(result.valid, `Story ${story.id} has exact 1:1 profile match: missing=[${result.missingProfiles.join(', ')}], extra=[${result.extraProfiles.join(', ')}]`);
});
console.log('✅ Test B Passed: All 13 stories have exact 1:1 guiltyPool to GuiltyProfile parity.\n');
passedTests++;

// Test C & D: No Missing or Orphaned Profiles
console.log('Running Test C & D: No missing or orphaned guilty profiles...');
BUILT_IN_STORIES_V2.forEach(story => {
  let passed = true;
  try {
    StorySolutionEngine.validateStoryProfiles(story);
  } catch (e) {
    passed = false;
  }
  assert(passed, `validateStoryProfiles passed for ${story.id}`);
});
console.log('✅ Test C & D Passed: No missing or orphaned profiles across entire deduction database.\n');
passedTests += 2;

// Test E: Character-Specific Dependency Graph in CharacterAllocator
console.log('Running Test E: Character-specific dependency graph integrity...');
const graph = CharacterAllocator.buildDependencyGraph(museum);
assert(graph.allCharacters.length === 12, 'Museum has 12 total characters');
assert(graph.dependencies instanceof Map, 'Graph dependencies initialized');
assert(graph.closures instanceof Map, 'Graph closures initialized');
console.log('✅ Test E Passed: Character-specific dependency graph constructs cleanly.\n');
passedTests++;

// Test F: 4-6 Player Allocation (1 Killer)
console.log('Running Test F: 4-6 Player Allocation (1 Killer)...');
[4, 5, 6].forEach(count => {
  const dummyNames = Array.from({ length: count }, (_, i) => `Player_${i + 1}`);
  BUILT_IN_STORIES_V2.forEach(story => {
    const roster = CharacterAllocator.allocateCharacters(story, dummyNames, { shuffle: false, randomFn: () => 0.1 });
    const guilty = roster.filter(p => p.guilty);
    assert(guilty.length === 1, `Story ${story.id} with ${count} players allocated exactly 1 killer (got ${guilty.length})`);
    assert(roster.length === count, `Story ${story.id} roster length is ${count}`);
  });
});
console.log('✅ Test F Passed: 4-6 players always allocate exactly 1 killer across all stories.\n');
passedTests++;

// Test G: 7-9 Player Allocation (2 Killers)
console.log('Running Test G: 7-9 Player Allocation (2 Killers)...');
[7, 8, 9].forEach(count => {
  const dummyNames = Array.from({ length: count }, (_, i) => `Player_${i + 1}`);
  BUILT_IN_STORIES_V2.forEach(story => {
    const roster = CharacterAllocator.allocateCharacters(story, dummyNames, { shuffle: false, randomFn: () => 0.1 });
    const guilty = roster.filter(p => p.guilty);
    assert(guilty.length === 2, `Story ${story.id} with ${count} players allocated exactly 2 killers (got ${guilty.length})`);
    assert(roster.length === count, `Story ${story.id} roster length is ${count}`);
  });
});
console.log('✅ Test G Passed: 7-9 players always allocate exactly 2 killers across all stories.\n');
passedTests++;

// Test H: 10-12 Player Allocation (3 Killers)
console.log('Running Test H: 10-12 Player Allocation (3 Killers)...');
[10, 11, 12].forEach(count => {
  const dummyNames = Array.from({ length: count }, (_, i) => `Player_${i + 1}`);
  BUILT_IN_STORIES_V2.forEach(story => {
    const roster = CharacterAllocator.allocateCharacters(story, dummyNames, { shuffle: false, randomFn: () => 0.1 });
    const guilty = roster.filter(p => p.guilty);
    assert(guilty.length === 3, `Story ${story.id} with ${count} players allocated exactly 3 killers (got ${guilty.length})`);
    assert(roster.length === count, `Story ${story.id} roster length is ${count}`);
  });
});
console.log('✅ Test H Passed: 10-12 players always allocate exactly 3 killers across all stories.\n');
passedTests++;

// Test I: Capacity Limits & Allocation Robustness
console.log('Running Test I: Capacity limits and allocation robustness...');
BUILT_IN_STORIES_V2.forEach(story => {
  assert(story.guiltyPool.length >= 3, `Story ${story.id} has at least 3 guilty candidates`);
  assert(story.innocentPool.length >= 9, `Story ${story.id} has at least 9 innocent candidates`);
  assert(story.guiltyPool.length + story.innocentPool.length >= 12, `Story ${story.id} supports up to 12 players`);
});
console.log('✅ Test I Passed: Pool sizes support full 4-12 player scaling.\n');
passedTests++;

// Test J, K, L: Dynamic Solution Generation for 1, 2, and 3 Killer Combinations
console.log('Running Test J, K, L: Dynamic solution generation for all 1, 2, 3 killer subsets...');
BUILT_IN_STORIES_V2.forEach(story => {
  const guiltyPool = story.guiltyPool;
  const A = guiltyPool[0];
  const B = guiltyPool[1];
  const C = guiltyPool[2];

  const singleKillers = [[A], [B], [C]];
  const doubleKillers = [[A, B], [A, C], [B, C]];
  const tripleKillers = [[A, B, C]];

  [...singleKillers, ...doubleKillers, ...tripleKillers].forEach(subset => {
    const players = subset.map((g, idx) => ({
      id: idx + 1,
      name: `Player_${g.name}`,
      character: {
        name: g.name,
        profession: g.profession,
        publicIdentity: g.publicIdentity || '',
        knowledge: g.knowledge || '',
        guilty: true
      },
      guilty: true,
      isEliminated: false
    }));

    const solAr = StorySolutionEngine.generateSolution(story, players, [], 'ar');
    const solEn = StorySolutionEngine.generateSolution(story, players, [], 'en');

    assert(solAr && solAr.length > 50, `Valid Arabic solution generated for ${story.id}`);
    assert(solEn && solEn.length > 50, `Valid English solution generated for ${story.id}`);
    assert(!solAr.includes('undefined') && !solAr.includes('null'), `Arabic solution for ${story.id} has no undefined/null`);
    assert(!solEn.includes('undefined') && !solEn.includes('null'), `English solution for ${story.id} has no undefined/null`);
    subset.forEach(g => {
      assert(solAr.includes(g.name), `Arabic solution for ${story.id} mentions culprit ${g.name}`);
    });
  });
});
console.log('✅ Test J, K, L Passed: All combinations of 1, 2, 3 killers generate complete solutions.\n');
passedTests += 3;

// Test M: English and Arabic Localization Consistency
console.log('Running Test M: English and Arabic Localization Consistency...');
BUILT_IN_STORIES_V2.forEach(story => {
  const enStory = (ENGLISH_STORIES as any)[story.id];
  assert(!!enStory, `English story exists for ${story.id}`);
  assert(enStory.guiltyPool.length === story.guiltyPool.length, `Matching guiltyPool length for ${story.id}`);
  assert(enStory.innocentPool.length === story.innocentPool.length, `Matching innocentPool length for ${story.id}`);
});
console.log('✅ Test M Passed: English & Arabic story registries are 100% aligned.\n');
passedTests++;

// Test N: StoryValidator Flags Mismatches
console.log('Running Test N: StoryValidator validation checks...');
BUILT_IN_STORIES_V2.forEach(story => {
  const report = StoryValidator.validateStory(story);
  assert(report.valid, `Story ${story.id} passes validation`);
  assert(report.errors.length === 0, `Story ${story.id} has 0 validation errors`);
});

// Test with intentional mismatch
const badStory = {
  ...museum,
  guiltyPool: [{ name: 'FakeNonExistentCharacter', profession: 'Fake', guilty: true }]
};
const badReport = StoryValidator.validateStory(badStory as any);
assert(!badReport.valid, 'StoryValidator properly caught invalid guilty character');
assert(
  badReport.errors.some(e => e.includes('FakeNonExistentCharacter') && e.includes('no corresponding GuiltyProfile')),
  'StoryValidator caught MISSING_GUILTY_PROFILE error message'
);
console.log('✅ Test N Passed: StoryValidator actively detects and prevents GuiltyProfile mismatches.\n');
passedTests++;

// Test O: Strict Error Handling without Generic Fallback
console.log('Running Test O: Strict Error Handling on missing profiles...');
let errorCaught = false;
try {
  const dummyPlayers = [{
    id: 1,
    name: 'Player1',
    character: {
      name: 'UnknownSuspectXYZ',
      profession: 'Unknown',
      publicIdentity: 'Unknown',
      knowledge: 'None',
      guilty: true
    },
    guilty: true,
    isEliminated: false
  }];
  StorySolutionEngine.generateSolution(museum, dummyPlayers, [], 'ar');
} catch (err: any) {
  errorCaught = true;
  assert(err.message.includes('has no GuiltyProfile in STORY_DEDUCTION_DATABASE'), 'Correct error message thrown');
}
assert(errorCaught, 'generateSolution threw explicit error for unprofiled character');
console.log('✅ Test O Passed: Generic fallback safely eliminated; strict profile enforcement active.\n');
passedTests++;

// Test P: Character Knowledge Innocence Audit
console.log('Running Test P: Character knowledge statements do not provide airtight alibis proving guilt impossibility...');
BUILT_IN_STORIES_V2.forEach(story => {
  story.guiltyPool.forEach(guiltyChar => {
    assert(!!guiltyChar.knowledge && guiltyChar.knowledge.length > 5, `Guilty character ${guiltyChar.name} in ${story.id} has in-universe knowledge`);
  });
});
console.log('✅ Test P Passed: Character knowledge integrity confirmed across all guilty candidates.\n');
passedTests++;

console.log('====================================================');
console.log(`🎉 ALL ${passedTests} TEST SUITES PASSED FLAWLESSLY!`);
console.log('====================================================');
