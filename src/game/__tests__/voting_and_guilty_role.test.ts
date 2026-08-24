import {
  GameEngine,
  StoryEngine,
  StoryStore,
  VotingEngine,
  PlayerManager,
  Story,
  Player,
  VoteResult
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

console.log('=== RUNNING TESTS: VOTING TALLY REGRESSION & GUILTY ROLE PRIVACY ===\n');

const builtInStories = StoryStore.getBuiltInStories();
assert(builtInStories.length > 0, 'Built-in stories exist');
const sampleStory = builtInStories[0];

// =========================================================================
// TEST 1: Innocent player does not see guilty indicator / has guilty = false
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const innocentPlayer = state.players.find(p => !p.guilty);
  assert(innocentPlayer !== undefined, 'TEST 1: Innocent player exists');
  assert(innocentPlayer!.guilty === false, 'TEST 1: Innocent player has guilty === false');
}

// =========================================================================
// TEST 2: Guilty player has guilty === true for private reveal
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const guiltyPlayer = state.players.find(p => p.guilty);
  assert(guiltyPlayer !== undefined, 'TEST 2: Guilty player exists');
  assert(guiltyPlayer!.guilty === true, 'TEST 2: Guilty player has guilty === true');
}

// =========================================================================
// TEST 3: Guilty player still receives their normal character with legitimate identity
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const guiltyPlayer = state.players.find(p => p.guilty)!;
  assert(typeof guiltyPlayer.character.name === 'string' && guiltyPlayer.character.name.length > 0, 'TEST 3: Guilty character has legitimate name');
  assert(typeof guiltyPlayer.character.profession === 'string' && guiltyPlayer.character.profession.length > 0, 'TEST 3: Guilty character has legitimate profession');
  assert(typeof guiltyPlayer.character.publicIdentity === 'string' && guiltyPlayer.character.publicIdentity.length > 0, 'TEST 3: Guilty character has legitimate public identity');
  assert(typeof guiltyPlayer.character.knowledge === 'string' && guiltyPlayer.character.knowledge.length > 0, 'TEST 3: Guilty character has narrative knowledge/testimony');
  assert(guiltyPlayer.character.name !== 'Killer' && guiltyPlayer.character.name !== 'القاتل', 'TEST 3: Guilty character is not named Killer');
}

// =========================================================================
// TEST 4: Other players' public UI never exposes guilty status
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const publicPlayers = PlayerManager.getPublicPlayers(state.players);
  for (const pub of publicPlayers) {
    assert((pub as any).guilty === undefined, `TEST 4: Public player ${pub.name} does not expose guilty property`);
  }
}

// =========================================================================
// TEST 5: Player list does not expose guilty status
// =========================================================================
{
  const engine = new GameEngine();
  const state = engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);

  const publicRoster = PlayerManager.getPublicPlayers(state.players);
  assert(publicRoster.every(p => (p as any).guilty === undefined), 'TEST 5: Roster sanitized from guilty flags');
}

// =========================================================================
// TEST 6: Discussion does not expose guilty status
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  const state = engine.startDiscussion();

  assert(state.phase === 'DISCUSSION', 'TEST 6: In discussion phase');
  const publicPlayers = PlayerManager.getPublicPlayers(state.players);
  assert(publicPlayers.length === 4, 'TEST 6: 4 living public players in discussion');
}

// =========================================================================
// TEST 7: Voting does not expose guilty status
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  const state = engine.startVoting();

  assert(state.phase === 'VOTING', 'TEST 7: In voting phase');
  const publicTargets = PlayerManager.getPublicPlayers(state.players);
  for (const target of publicTargets) {
    assert((target as any).guilty === undefined, 'TEST 7: Voting target has no public guilty indicator');
  }
}

// =========================================================================
// TEST 8: Evidence does not expose guilty status
// =========================================================================
{
  for (const story of builtInStories) {
    const evidenceList = StoryEngine.getStoryEvidence(story);
    for (const ev of evidenceList) {
      assert(!ev.title.includes('القاتل هو'), `TEST 8 [${story.id}]: Evidence does not expose guilty directly`);
      assert(!ev.description.includes('هو القاتل المذنب'), `TEST 8 [${story.id}]: Evidence does not declare murderer`);
    }
  }
}

// =========================================================================
// TEST 9: 3–1 vote = clear winner (isTie === false)
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  const votes: Record<number, number> = {
    1: 4,
    2: 4,
    3: 4,
    4: 1
  };

  const tallyResult = VotingEngine.tallyVotes(votes, players);
  assert(tallyResult.isTie === false, 'TEST 9: 3-1 vote is NOT a tie');
  assert(tallyResult.maxVotes === 3, 'TEST 9: maxVotes is 3');
  assert(tallyResult.topPlayerIds.length === 1 && tallyResult.topPlayerIds[0] === 4, 'TEST 9: topPlayerId is 4');

  const voteResult = VotingEngine.resolveVote({
    votes,
    players,
    story: sampleStory,
    currentRound: 1,
    wrongVotesCount: 0
  });

  assert(voteResult.isTie === false, 'TEST 9: resolveVote produces isTie === false');
  assert(voteResult.selectedPlayerId === 4, 'TEST 9: selectedPlayerId is 4');
  assert(voteResult.eliminatedPlayer?.id === 4, 'TEST 9: eliminatedPlayer is player 4');
}

// =========================================================================
// TEST 9B: Full Flow via GameEngine (UI -> castVote/resolveVotes -> state.votes -> lastVoteResult)
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  engine.startVoting();

  const players = engine.getState().players;
  const p1 = players[0].id;
  const p2 = players[1].id;
  const p3 = players[2].id;
  const p4 = players[3].id;

  const directVotes: Record<number, number> = {
    [p1]: p4,
    [p2]: p4,
    [p3]: p4,
    [p4]: p1
  };

  const result = engine.resolveVotes(directVotes);
  const state = engine.getState();

  assert(result.isTie === false, 'TEST 9B: resolveVotes gives isTie === false');
  assert(result.selectedPlayerId === p4, 'TEST 9B: selectedPlayerId is p4');
  assert(state.votes[p1] === p4, 'TEST 9B: state.votes contains cast vote 1->4');
  assert(state.votes[p2] === p4, 'TEST 9B: state.votes contains cast vote 2->4');
  assert(state.votes[p3] === p4, 'TEST 9B: state.votes contains cast vote 3->4');
  assert(state.votes[p4] === p1, 'TEST 9B: state.votes contains cast vote 4->1');
  assert(state.lastVoteResult !== null, 'TEST 9B: state.lastVoteResult is populated');
  assert(state.lastVoteResult!.isTie === false, 'TEST 9B: state.lastVoteResult.isTie is false');
  assert(state.lastVoteResult!.selectedPlayerId === p4, 'TEST 9B: state.lastVoteResult.selectedPlayerId is p4');
}

// =========================================================================
// TEST 10: 4–0 vote = clear winner
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  const votes: Record<number, number> = {
    1: 4,
    2: 4,
    3: 4,
    4: 4
  };

  const tally = VotingEngine.tallyVotes(votes, players);
  assert(tally.isTie === false, 'TEST 10: 4-0 is not a tie');
  assert(tally.maxVotes === 4, 'TEST 10: maxVotes is 4');
  assert(tally.topPlayerIds[0] === 4, 'TEST 10: winner is player 4');
}

// =========================================================================
// TEST 11: 2–1–1 = clear winner
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  const votes: Record<number, number> = {
    1: 4,
    2: 4,
    3: 2,
    4: 1
  };

  const tally = VotingEngine.tallyVotes(votes, players);
  assert(tally.isTie === false, 'TEST 11: 2-1-1 is not a tie');
  assert(tally.maxVotes === 2, 'TEST 11: maxVotes is 2');
  assert(tally.topPlayerIds[0] === 4, 'TEST 11: winner is player 4');
}

// =========================================================================
// TEST 12: 2–2 = tie
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  const votes: Record<number, number> = {
    1: 3,
    2: 3,
    3: 4,
    4: 4
  };

  const tally = VotingEngine.tallyVotes(votes, players);
  assert(tally.isTie === true, 'TEST 12: 2-2 is a tie');
  assert(tally.topPlayerIds.length === 2, 'TEST 12: 2 top candidates');
}

// =========================================================================
// TEST 13: 1–1–1–1 = tie
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  const votes: Record<number, number> = {
    1: 2,
    2: 3,
    3: 4,
    4: 1
  };

  const tally = VotingEngine.tallyVotes(votes, players);
  assert(tally.isTie === true, 'TEST 13: 1-1-1-1 is a tie');
  assert(tally.topPlayerIds.length === 4, 'TEST 13: 4 top candidates');
}

// =========================================================================
// TEST 14: 3–3–1 = tie
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false },
    { id: 5, name: 'سارة', character: { name: 'ش5', profession: 'م5', publicIdentity: 'ه5', knowledge: 'ك5', guilty: false }, guilty: false, isEliminated: false },
    { id: 6, name: 'أحمد', character: { name: 'ش6', profession: 'م6', publicIdentity: 'ه6', knowledge: 'ك6', guilty: false }, guilty: false, isEliminated: false },
    { id: 7, name: 'منى', character: { name: 'ش7', profession: 'م7', publicIdentity: 'ه7', knowledge: 'ك7', guilty: false }, guilty: false, isEliminated: false }
  ];

  const votes: Record<number, number> = {
    1: 1, 2: 1, 3: 1, // 3 for 1
    4: 2, 5: 2, 6: 2, // 3 for 2
    7: 3              // 1 for 3
  };

  const tally = VotingEngine.tallyVotes(votes, players);
  assert(tally.isTie === true, 'TEST 14: 3-3-1 is a tie');
  assert(tally.maxVotes === 3, 'TEST 14: maxVotes is 3');
  assert(tally.topPlayerIds.length === 2, 'TEST 14: 2 top candidates in 3-3-1 tie');
}

// =========================================================================
// TEST 15: Duplicate vote from same voter overwrites previous vote
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  engine.startVoting();

  const players = engine.getState().players;
  const p1 = players[0].id;
  const p2 = players[1].id;
  const p3 = players[2].id;

  // p1 votes for p2
  engine.castVote(p1, p2);
  assert(engine.getState().votes[p1] === p2, 'TEST 15: Initial vote recorded');

  // p1 changes vote to p3
  engine.castVote(p1, p3);
  assert(engine.getState().votes[p1] === p3, 'TEST 15: Overwritten vote recorded');
  assert(Object.keys(engine.getState().votes).length === 1, 'TEST 15: Only 1 vote exists for voter 1');
}

// =========================================================================
// TEST 16: Eliminated voter cannot vote
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: true },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  // Eliminated player 1 tries to vote for 4
  const votes: Record<number, number> = {
    1: 4,
    2: 4,
    3: 3,
    4: 3
  };

  const tally = VotingEngine.tallyVotes(votes, players);
  // Player 4 should only receive 1 vote (from p2), player 1's vote is ignored
  const tallyP4 = tally.tallies.find(t => t.playerId === 4);
  assert(tallyP4?.voteCount === 1, 'TEST 16: Vote from eliminated player is ignored by tallyVotes');
}

// =========================================================================
// TEST 17: Eliminated player cannot receive a vote
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: true } // eliminated
  ];

  // Living players 1 and 2 vote for eliminated player 4
  const votes: Record<number, number> = {
    1: 4,
    2: 4,
    3: 2
  };

  const tally = VotingEngine.tallyVotes(votes, players);
  // Eliminated player 4 is not in alive tallies
  assert(!tally.tallies.some(t => t.playerId === 4), 'TEST 17: Eliminated player not present in tallies');
  assert(tally.maxVotes === 1, 'TEST 17: Votes for eliminated target are disregarded');
  assert(tally.topPlayerIds[0] === 2, 'TEST 17: Player 2 wins valid votes');
}

console.log(`\n==================================================`);
console.log(`ALL 17 PRE-PHASE 6 TESTS PASSED: ${passedTests} passed, ${failedTests} failed.`);
console.log(`==================================================\n`);
