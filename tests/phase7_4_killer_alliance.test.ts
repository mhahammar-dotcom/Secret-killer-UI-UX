import assert from 'node:assert';
import { GameEngine } from '../src/game/GameEngine';
import { PlayerManager, getKillerPartners } from '../src/game/PlayerManager';
import { BUILT_IN_STORIES_V2 } from '../src/data/stories';
import { Story, Player } from '../src/game/types';

console.log('\n========================================');
console.log('PHASE 7.4 — KILLER PARTNER AWARENESS TESTS');
console.log('========================================\n');

// ----------------------------------------------------
// TEST 1: Pure helper getKillerPartners with string arrays
// ----------------------------------------------------
console.log('TEST 1: Pure helper getKillerPartners with string arrays');
{
  const twoKillers = ['Firas', 'Karim'];
  assert.deepStrictEqual(getKillerPartners('Firas', twoKillers), ['Karim'], 'Firas sees Karim');
  assert.deepStrictEqual(getKillerPartners('Karim', twoKillers), ['Firas'], 'Karim sees Firas');
  assert.deepStrictEqual(getKillerPartners('Innocent', twoKillers), [], 'Innocent sees nobody');

  const threeKillers = ['Firas', 'Karim', 'Yasmine'];
  assert.deepStrictEqual(getKillerPartners('Firas', threeKillers), ['Karim', 'Yasmine'], 'Firas sees Karim & Yasmine');
  assert.deepStrictEqual(getKillerPartners('Karim', threeKillers), ['Firas', 'Yasmine'], 'Karim sees Firas & Yasmine');
  assert.deepStrictEqual(getKillerPartners('Yasmine', threeKillers), ['Firas', 'Karim'], 'Yasmine sees Firas & Karim');
  assert.deepStrictEqual(getKillerPartners('Tariq', threeKillers), [], 'Innocent Tariq sees nobody');

  const singleKiller = ['Firas'];
  assert.deepStrictEqual(getKillerPartners('Firas', singleKiller), [], 'Single killer has no partners');
  assert.deepStrictEqual(getKillerPartners('Karim', singleKiller), [], 'Innocent has no partners');

  console.log('  ✓ String-based pure helper tests passed.');
}

// ----------------------------------------------------
// TEST 2: Single-killer games (4–6 players)
// ----------------------------------------------------
console.log('TEST 2: Single-killer games (4–6 players)');
for (const count of [4, 5, 6]) {
  const story = BUILT_IN_STORIES_V2[0];
  const playerNames = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
  const engine = new GameEngine();
  engine.startNewGame(story, playerNames);

  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);

  assert.strictEqual(killers.length, 1, `${count}-player game has exactly 1 killer`);
  assert.strictEqual(innocents.length, count - 1, `${count}-player game has ${count - 1} innocents`);

  const killer = killers[0];
  const killerPartners = engine.getKillerPartners(killer.id);
  assert.strictEqual(killerPartners.length, 0, `Single killer in ${count}-player game has 0 partners`);

  for (const innocent of innocents) {
    const partners = engine.getKillerPartners(innocent.id);
    assert.strictEqual(partners.length, 0, `Innocent player ${innocent.id} in ${count}-player game receives 0 partners`);
  }
}
console.log('  ✓ Single-killer games (4-6 players) verified: no partners shown to anyone.');

// ----------------------------------------------------
// TEST 3: Two-killer games (7–9 players)
// ----------------------------------------------------
console.log('TEST 3: Two-killer games (7–9 players)');
for (const count of [7, 8, 9]) {
  const story = BUILT_IN_STORIES_V2[0];
  const playerNames = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
  const engine = new GameEngine();
  engine.startNewGame(story, playerNames);

  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);

  assert.strictEqual(killers.length, 2, `${count}-player game has exactly 2 killers`);

  const [k1, k2] = killers;

  // Mutual awareness
  const k1Partners = engine.getKillerPartners(k1.id);
  const k2Partners = engine.getKillerPartners(k2.id);

  assert.strictEqual(k1Partners.length, 1, `Killer 1 has 1 partner in ${count}-player game`);
  assert.strictEqual(k1Partners[0].id, k2.id, `Killer 1 sees Killer 2 (Player ${k2.id})`);
  assert.notStrictEqual(k1Partners[0].id, k1.id, 'Killer 1 does not see themselves');

  assert.strictEqual(k2Partners.length, 1, `Killer 2 has 1 partner in ${count}-player game`);
  assert.strictEqual(k2Partners[0].id, k1.id, `Killer 2 sees Killer 1 (Player ${k1.id})`);
  assert.notStrictEqual(k2Partners[0].id, k2.id, 'Killer 2 does not see themselves');

  // Innocents see nothing
  for (const innocent of innocents) {
    const partners = engine.getKillerPartners(innocent.id);
    assert.strictEqual(partners.length, 0, `Innocent player ${innocent.id} receives empty partner list`);
  }
}
console.log('  ✓ Two-killer games (7-9 players) verified: mutual awareness, no self-listing, innocents private.');

// ----------------------------------------------------
// TEST 4: Three-killer games (10–12 players)
// ----------------------------------------------------
console.log('TEST 4: Three-killer games (10–12 players)');
for (const count of [10, 11, 12]) {
  const story = BUILT_IN_STORIES_V2[0];
  const playerNames = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
  const engine = new GameEngine();
  engine.startNewGame(story, playerNames);

  const state = engine.getState();
  const killers = state.players.filter(p => p.guilty);
  const innocents = state.players.filter(p => !p.guilty);

  assert.strictEqual(killers.length, 3, `${count}-player game has exactly 3 killers`);

  const [k1, k2, k3] = killers;

  const k1Partners = engine.getKillerPartners(k1.id);
  const k2Partners = engine.getKillerPartners(k2.id);
  const k3Partners = engine.getKillerPartners(k3.id);

  assert.strictEqual(k1Partners.length, 2, `Killer 1 has 2 partners in ${count}-player game`);
  assert.deepStrictEqual(k1Partners.map(p => p.id), [k2.id, k3.id], 'Killer 1 sees Killer 2 & 3 in deterministic order');

  assert.strictEqual(k2Partners.length, 2, `Killer 2 has 2 partners in ${count}-player game`);
  assert.deepStrictEqual(k2Partners.map(p => p.id), [k1.id, k3.id], 'Killer 2 sees Killer 1 & 3 in deterministic order');

  assert.strictEqual(k3Partners.length, 2, `Killer 3 has 2 partners in ${count}-player game`);
  assert.deepStrictEqual(k3Partners.map(p => p.id), [k1.id, k2.id], 'Killer 3 sees Killer 1 & 2 in deterministic order');

  // Innocents see nothing
  for (const innocent of innocents) {
    const partners = engine.getKillerPartners(innocent.id);
    assert.strictEqual(partners.length, 0, `Innocent player ${innocent.id} receives empty partner list`);
  }
}
console.log('  ✓ Three-killer games (10-12 players) verified: full triangle awareness, deterministic order.');

// ----------------------------------------------------
// TEST 5: Actual selection vs. Guilty pool distinction
// ----------------------------------------------------
console.log('TEST 5: Actual selection vs. Guilty pool distinction');
{
  const customStory: Story = {
    id: 'test-guilty-pool',
    title: 'Test Story with Large Pool',
    description: 'Testing guilty pool isolation from actual selection',
    minPlayers: 4,
    maxPlayers: 6,
    introduction: {
      setting: 'A locked estate',
      situation: 'Someone was murdered during dinner.',
      incident: 'A scream in the dark',
      stakes: 'Identify the killer before escape',
    },
    solution: 'One of the guilty pool committed the crime.',
    guiltyPool: [
      { name: 'Candidate_A', profession: 'Doc', publicIdentity: 'Doctor', knowledge: 'Knows A', guilty: true },
      { name: 'Candidate_B', profession: 'Lawyer', publicIdentity: 'Lawyer', knowledge: 'Knows B', guilty: true },
      { name: 'Candidate_C', profession: 'Chef', publicIdentity: 'Chef', knowledge: 'Knows C', guilty: true },
      { name: 'Candidate_D', profession: 'Pilot', publicIdentity: 'Pilot', knowledge: 'Knows D', guilty: true },
    ],
    innocentPool: [
      { name: 'Innocent_1', profession: 'Artist', publicIdentity: 'Artist', knowledge: 'Knows 1', guilty: false },
      { name: 'Innocent_2', profession: 'Guard', publicIdentity: 'Guard', knowledge: 'Knows 2', guilty: false },
      { name: 'Innocent_3', profession: 'Nurse', publicIdentity: 'Nurse', knowledge: 'Knows 3', guilty: false },
      { name: 'Innocent_4', profession: 'Clerk', publicIdentity: 'Clerk', knowledge: 'Knows 4', guilty: false },
    ],
    evidence: [
      { id: 'c1', title: 'Clue 1', description: 'Clue 1', publicClue: 'Clue 1', category: 'physical' },
      { id: 'c2', title: 'Clue 2', description: 'Clue 2', publicClue: 'Clue 2', category: 'physical' },
      { id: 'c3', title: 'Clue 3', description: 'Clue 3', publicClue: 'Clue 3', category: 'physical' },
      { id: 'c4', title: 'Clue 4', description: 'Clue 4', publicClue: 'Clue 4', category: 'physical' },
    ]
  };

  // Run a 4-player game (1 killer required)
  const engine = new GameEngine();
  engine.startNewGame(customStory, ['P1', 'P2', 'P3', 'P4']);

  const state = engine.getState();
  const guiltyPlayers = state.players.filter(p => p.guilty);
  assert.strictEqual(guiltyPlayers.length, 1, 'Only 1 killer selected out of 4 in guiltyPool');

  const selectedKiller = guiltyPlayers[0];
  const partners = engine.getKillerPartners(selectedKiller.id);
  assert.strictEqual(partners.length, 0, 'Selected killer sees 0 partners despite guiltyPool having 4 candidates');

  // Other players who might have received characters from guiltyPool have guilty=false and see 0 partners
  const innocentPlayers = state.players.filter(p => !p.guilty);
  for (const innocent of innocentPlayers) {
    assert.strictEqual(innocent.guilty, false, `Player ${innocent.name} has guilty=false`);
    assert.strictEqual(engine.getKillerPartners(innocent.id).length, 0, `Player ${innocent.name} sees 0 partners`);
  }

  console.log('  ✓ Verified actualSelectedKillers isolation from guiltyPool.');
}

// ----------------------------------------------------
// TEST 6: Step-by-step role pass flow simulation
// ----------------------------------------------------
console.log('TEST 6: Step-by-step role pass flow simulation');
{
  const story = BUILT_IN_STORIES_V2[0];
  const engine = new GameEngine();
  engine.startNewGame(story, ['A', 'B', 'C', 'D', 'E', 'F', 'G']);

  const state = engine.getState();
  assert.strictEqual(state.phase, 'ROLE_PASS', 'Game starts in ROLE_PASS');

  const killerIds = new Set(state.players.filter(p => p.guilty).map(p => p.id));
  assert.strictEqual(killerIds.size, 2, '7-player game has 2 killers');

  for (let i = 0; i < 7; i++) {
    const current = engine.getCurrentViewingPlayer();
    assert(current !== null, `Viewing player ${i} exists`);
    assert.strictEqual(current.id, i + 1, `Viewing player matches index ${i}`);

    const partners = engine.getCurrentViewingPlayerPartners();
    if (killerIds.has(current.id)) {
      assert.strictEqual(partners.length, 1, `Killer player ${current.id} sees 1 partner`);
      assert(killerIds.has(partners[0].id), `Partner is a valid killer`);
      assert.notStrictEqual(partners[0].id, current.id, `Partner is not current player`);
    } else {
      assert.strictEqual(partners.length, 0, `Innocent player ${current.id} sees 0 partners`);
    }

    if (i < 6) {
      engine.advanceRolePass();
    }
  }

  console.log('  ✓ Role pass progression verifies zero leakage to innocent players.');
}

console.log('\n========================================');
console.log('ALL PHASE 7.4 TESTS PASSED PERFECTLY!');
console.log('========================================\n');
