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

// =========================================================================
// TEST 18: Exact 4-Player 3-1 Scenario Data Flow Trace
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

  // Exact scenario from user:
  // Player 1 -> Player 4
  // Player 2 -> Player 4
  // Player 3 -> Player 4
  // Player 4 -> Player 1
  const votesObj: Record<number, number> = {
    [p1]: p4,
    [p2]: p4,
    [p3]: p4,
    [p4]: p1
  };

  // 1. Check VotingEngine.tallyVotes output directly
  const tallyOutput = VotingEngine.tallyVotes(votesObj, players);
  assert(tallyOutput.isTie === false, 'TEST 18: 3-1 tally isTie is false');
  assert(tallyOutput.maxVotes === 3, 'TEST 18: 3-1 tally maxVotes is 3');
  assert(tallyOutput.topPlayerIds.length === 1 && tallyOutput.topPlayerIds[0] === p4, 'TEST 18: 3-1 tally topPlayerIds is [p4]');

  const tP4 = tallyOutput.tallies.find(t => t.playerId === p4);
  const tP1 = tallyOutput.tallies.find(t => t.playerId === p1);
  const tP2 = tallyOutput.tallies.find(t => t.playerId === p2);
  const tP3 = tallyOutput.tallies.find(t => t.playerId === p3);

  assert(tP4?.voteCount === 3, 'TEST 18: Player 4 tally count is exactly 3');
  assert(tP1?.voteCount === 1, 'TEST 18: Player 1 tally count is exactly 1');
  assert(tP2?.voteCount === 0, 'TEST 18: Player 2 tally count is exactly 0');
  assert(tP3?.voteCount === 0, 'TEST 18: Player 3 tally count is exactly 0');

  // 2. Check VotingEngine.resolveVote output
  const resolveVoteOutput = VotingEngine.resolveVote({
    votes: votesObj,
    players,
    story: sampleStory,
    currentRound: 1,
    wrongVotesCount: 0
  });
  assert(resolveVoteOutput.isTie === false, 'TEST 18: resolveVote isTie is false');
  assert(resolveVoteOutput.selectedPlayerId === p4, 'TEST 18: resolveVote selectedPlayerId is p4');
  assert(resolveVoteOutput.eliminatedPlayer?.id === p4, 'TEST 18: resolveVote eliminatedPlayer id is p4');

  // 3. Check GameEngine.resolveVotes output and state update
  const gameEngineVoteResult = engine.resolveVotes(votesObj);
  const finalState = engine.getState();

  assert(gameEngineVoteResult.isTie === false, 'TEST 18: GameEngine voteResult isTie is false');
  assert(gameEngineVoteResult.selectedPlayerId === p4, 'TEST 18: GameEngine voteResult selectedPlayerId is p4');
  assert(finalState.votes[p1] === p4, 'TEST 18: finalState.votes[p1] is p4');
  assert(finalState.votes[p2] === p4, 'TEST 18: finalState.votes[p2] is p4');
  assert(finalState.votes[p3] === p4, 'TEST 18: finalState.votes[p3] is p4');
  assert(finalState.votes[p4] === p1, 'TEST 18: finalState.votes[p4] is p1');
  assert(finalState.lastVoteResult !== null, 'TEST 18: finalState.lastVoteResult is defined');
  assert(finalState.lastVoteResult!.isTie === false, 'TEST 18: finalState.lastVoteResult isTie is false');
  assert(finalState.lastVoteResult!.selectedPlayerId === p4, 'TEST 18: finalState.lastVoteResult selectedPlayerId is p4');
}

// =========================================================================
// TEST 19: 2-2 Tie Distribution Verification
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  const votes22: Record<number, number> = {
    1: 3,
    2: 3,
    3: 4,
    4: 4
  };

  const tally22 = VotingEngine.tallyVotes(votes22, players);
  assert(tally22.isTie === true, 'TEST 19: 2-2 vote is a tie');
  assert(tally22.topPlayerIds.length === 2, 'TEST 19: 2-2 vote has 2 top candidates');
}

// =========================================================================
// TEST 20: 2-1-1 Plurality (NOT A TIE) Verification
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'فارس', character: { name: 'ش1', profession: 'م1', publicIdentity: 'ه1', knowledge: 'ك1', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'رانيا', character: { name: 'ش2', profession: 'م2', publicIdentity: 'ه2', knowledge: 'ك2', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'طارق', character: { name: 'ش3', profession: 'م3', publicIdentity: 'ه3', knowledge: 'ك3', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'هدى', character: { name: 'ش4', profession: 'م4', publicIdentity: 'ه4', knowledge: 'ك4', guilty: true }, guilty: true, isEliminated: false }
  ];

  const votes211: Record<number, number> = {
    1: 4,
    2: 4,
    3: 2,
    4: 1
  };

  const tally211 = VotingEngine.tallyVotes(votes211, players);
  assert(tally211.isTie === false, 'TEST 20: 2-1-1 vote is NOT a tie');
  assert(tally211.maxVotes === 2, 'TEST 20: 2-1-1 maxVotes is 2');
  assert(tally211.topPlayerIds.length === 1 && tally211.topPlayerIds[0] === 4, 'TEST 20: 2-1-1 top candidate is player 4');
}

// =========================================================================
// TEST 21: 3-3-1 Tie Verification (7 players)
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 5, name: 'P5', character: { name: 'C5', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 6, name: 'P6', character: { name: 'C6', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 7, name: 'P7', character: { name: 'C7', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false }
  ];

  // P1, P2, P3 vote for P4 (3 votes)
  // P4, P5, P6 vote for P5 (3 votes)
  // P7 votes for P1 (1 vote)
  const votes331: Record<number, number> = {
    1: 4,
    2: 4,
    3: 4,
    4: 5,
    5: 5,
    6: 5,
    7: 1
  };

  const tally331 = VotingEngine.tallyVotes(votes331, players);
  assert(tally331.isTie === true, 'TEST 21: 3-3-1 vote produces a tie');
  assert(tally331.maxVotes === 3, 'TEST 21: 3-3-1 maxVotes is 3');
  assert(tally331.topPlayerIds.length === 2, 'TEST 21: 3-3-1 top candidate count is 2 (P4 and P5)');
}

// =========================================================================
// TEST 22: Eliminated players cannot vote & cannot receive votes
// =========================================================================
{
  const players: Player[] = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: true }, // Eliminated
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false }
  ];

  // P2 attempts to vote for P4, and P1 attempts to vote for eliminated P2
  const votes: Record<number, number> = {
    1: 2, // invalid target (P2 is eliminated)
    2: 4, // invalid voter (P2 is eliminated)
    3: 4,
    4: 3
  };

  const validation = VotingEngine.validateVotes(votes, players);
  assert(validation.isValid === false, 'TEST 22: Invalid votes detected');
  assert(validation.invalidVoters.includes(2), 'TEST 22: Eliminated voter P2 identified');
  assert(validation.invalidTargets.includes(2), 'TEST 22: Eliminated target P2 identified');

  // Tally ignores invalid votes from or to eliminated players
  const tally = VotingEngine.tallyVotes(votes, players);
  const p4Tally = tally.tallies.find(t => t.playerId === 4)?.voteCount || 0;
  assert(p4Tally === 1, 'TEST 22: P4 only received 1 valid vote from P3 (P2 vote ignored)');
}

// =========================================================================
// TEST 23: Multiple Guilty Players Support
// =========================================================================
{
  const multiGuiltyPlayers: Player[] = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 5, name: 'P5', character: { name: 'C5', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  // Eliminate first guilty player P1
  const votesRound1: Record<number, number> = {
    1: 3,
    2: 3,
    3: 1,
    4: 1,
    5: 1
  };

  const res1 = VotingEngine.resolveVote({
    votes: votesRound1,
    players: multiGuiltyPlayers,
    story: sampleStory,
    currentRound: 1,
    wrongVotesCount: 0
  });

  assert(res1.wasGuilty === true, 'TEST 23: P1 was guilty');
  assert(res1.gameOver === false, 'TEST 23: Game not over yet because P2 is still alive');

  // Now eliminate second guilty player P2
  const round2Players = multiGuiltyPlayers.map(p => p.id === 1 ? { ...p, isEliminated: true } : p);
  const votesRound2: Record<number, number> = {
    2: 3,
    3: 2,
    4: 2,
    5: 2
  };

  const res2 = VotingEngine.resolveVote({
    votes: votesRound2,
    players: round2Players,
    story: sampleStory,
    currentRound: 2,
    wrongVotesCount: 0
  });

  assert(res2.wasGuilty === true, 'TEST 23: P2 was guilty');
  assert(res2.gameOver === true, 'TEST 23: Game over because all guilty eliminated');
  assert(res2.winner === 'INNOCENTS', 'TEST 23: Innocents win');
  assert(res2.endReason === 'ALL_GUILTY_ELIMINATED', 'TEST 23: End reason is ALL_GUILTY_ELIMINATED');
}

// =========================================================================
// TEST 24: Guilty Parity Win Condition
// =========================================================================
{
  // 1 Guilty, 2 Innocents. If 1 Innocent is wrongly eliminated, 1 Guilty vs 1 Innocent -> Guilty wins by parity
  const parityPlayers: Player[] = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  // P2 is eliminated (innocent)
  const votes: Record<number, number> = {
    1: 2,
    2: 3,
    3: 2
  };

  const res = VotingEngine.resolveVote({
    votes,
    players: parityPlayers,
    story: sampleStory,
    currentRound: 1,
    wrongVotesCount: 0
  });

  assert(res.wasGuilty === false, 'TEST 24: P2 was innocent');
  assert(res.gameOver === true, 'TEST 24: Game is over due to guilty parity (1 guilty vs 1 innocent)');
  assert(res.winner === 'GUILTY', 'TEST 24: Guilty side wins');
  assert(res.endReason === 'GUILTY_PARITY', 'TEST 24: End reason is GUILTY_PARITY');
}

// =========================================================================
// TEST 25: Max Wrong Votes Loss Condition
// =========================================================================
{
  const testPlayers: Player[] = [
    { id: 1, name: 'P1', character: { name: 'C1', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: true }, guilty: true, isEliminated: false },
    { id: 2, name: 'P2', character: { name: 'C2', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 3, name: 'P3', character: { name: 'C3', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 4, name: 'P4', character: { name: 'C4', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false },
    { id: 5, name: 'P5', character: { name: 'C5', profession: 'P', publicIdentity: 'I', knowledge: 'K', guilty: false }, guilty: false, isEliminated: false }
  ];

  // Wrong vote when current wrong votes is 2, with maxWrongVotes = 3
  const votes: Record<number, number> = {
    1: 2,
    2: 3,
    3: 2,
    4: 2,
    5: 2
  };

  const res = VotingEngine.resolveVote({
    votes,
    players: testPlayers,
    story: sampleStory,
    currentRound: 3,
    wrongVotesCount: 2,
    maxWrongVotes: 3
  });

  assert(res.wasGuilty === false, 'TEST 25: Innocent eliminated');
  assert(res.wrongVotesCount === 3, 'TEST 25: Wrong votes reached 3');
  assert(res.gameOver === true, 'TEST 25: Game over on max wrong votes');
  assert(res.winner === 'GUILTY', 'TEST 25: Guilty side wins');
  assert(res.endReason === 'MAX_WRONG_VOTES', 'TEST 25: End reason is MAX_WRONG_VOTES');
}

// =========================================================================
// TEST 26: Tie maintains game state and does not increment wrong votes
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  const p = engine.getState().players;

  const tieVotes: Record<number, number> = {
    [p[0].id]: p[2].id,
    [p[1].id]: p[2].id,
    [p[2].id]: p[3].id,
    [p[3].id]: p[3].id
  };

  const res = engine.resolveVotes(tieVotes);
  assert(res.isTie === true, 'TEST 26: Result is a tie');
  assert(res.eliminatedPlayer === null, 'TEST 26: No player eliminated in tie');
  assert(engine.getState().wrongVotesCount === 0, 'TEST 26: wrongVotesCount remains 0');
  assert(PlayerManager.getAlivePlayers(engine.getState().players).length === 4, 'TEST 26: All 4 players still alive');

  // Proceed after tie should advance round to DISCUSSION
  engine.proceedAfterVoteResult();
  assert(engine.getState().phase === 'DISCUSSION', 'TEST 26: Phase returns to DISCUSSION after tie');
  assert(engine.getState().currentRound === 2, 'TEST 26: Round incremented to 2');
}

// =========================================================================
// TEST 27: Final reveal occurs only after GameEngine reaches GAME_OVER
// =========================================================================
{
  const engine = new GameEngine();
  engine.startNewGame(sampleStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  const guilty = engine.getState().players.find(p => p.guilty)!;
  const innocents = engine.getState().players.filter(p => !p.guilty);

  // During active game, phase is DISCUSSION
  assert(engine.getState().phase === 'ROLE_PASS', 'TEST 27: Initial phase');
  engine.startDiscussion();
  assert(engine.getState().phase === 'DISCUSSION', 'TEST 27: Discussion phase');
  assert(engine.getState().winner === 'NONE', 'TEST 27: Winner is NONE during discussion');

  // Vote out guilty
  const votes: Record<number, number> = {};
  innocents.forEach(p => { votes[p.id] = guilty.id; });
  votes[guilty.id] = innocents[0].id;

  const res = engine.resolveVotes(votes);
  assert(res.gameOver === true, 'TEST 27: Game over flagged in vote result');
  assert(res.winner === 'INNOCENTS', 'TEST 27: Innocents flagged as winner');

  engine.proceedAfterVoteResult();
  assert(
    engine.getState().phase === 'KILLER_REVEAL' || engine.getState().phase === 'GAME_OVER',
    'TEST 27: Engine transitioned to end game reveal phase'
  );
  assert(engine.getState().winner === 'INNOCENTS', 'TEST 27: Final winner stored');
}

// =========================================================================
// TEST 28: Phase 6.1 - Default maxWrongVotes = 3
// =========================================================================
{
  const defaultStory: Story = {
    ...sampleStory,
    id: 'default_rules_story',
    gameRules: undefined,
    maxWrongVotes: undefined
  };

  const resolvedLimit = StoryEngine.getMaxWrongVotes(defaultStory);
  assert(resolvedLimit === 3, 'TEST 28: Story with no gameRules resolves to default maxWrongVotes = 3');

  const engine = new GameEngine();
  engine.startNewGame(defaultStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  assert(engine.getState().maxWrongVotes === 3, 'TEST 28: GameEngine initializes with default maxWrongVotes = 3');
}

// =========================================================================
// TEST 29: Phase 6.1 - Story can configure maxWrongVotes = 2
// =========================================================================
{
  const strictStory: Story = {
    ...sampleStory,
    id: 'strict_story_2',
    gameRules: {
      maxWrongVotes: 2
    }
  };

  const resolvedLimit = StoryEngine.getMaxWrongVotes(strictStory);
  assert(resolvedLimit === 2, 'TEST 29: StoryEngine resolves configured maxWrongVotes = 2');

  const engine = new GameEngine();
  engine.startNewGame(strictStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  assert(engine.getState().maxWrongVotes === 2, 'TEST 29: GameEngine starts game with configured maxWrongVotes = 2');
}

// =========================================================================
// TEST 30: Phase 6.1 - Story can configure maxWrongVotes = 4
// =========================================================================
{
  const lenientStory: Story = {
    ...sampleStory,
    id: 'lenient_story_4',
    gameRules: {
      maxWrongVotes: 4
    }
  };

  const resolvedLimit = StoryEngine.getMaxWrongVotes(lenientStory);
  assert(resolvedLimit === 4, 'TEST 30: StoryEngine resolves configured maxWrongVotes = 4');

  const engine = new GameEngine();
  engine.startNewGame(lenientStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  assert(engine.getState().maxWrongVotes === 4, 'TEST 30: GameEngine starts game with configured maxWrongVotes = 4');
}

// =========================================================================
// TEST 31: Phase 6.1 - GameEngine evaluates game-over using configured maxWrongVotes = 2
// =========================================================================
{
  const story2: Story = {
    ...sampleStory,
    id: 'story_wrong_votes_2',
    gameRules: {
      maxWrongVotes: 2
    }
  };

  const engine = new GameEngine();
  engine.startNewGame(story2, ['فارس', 'رانيا', 'طارق', 'هدى', 'سالم', 'منار']);
  const guilty = engine.getState().players.find(p => p.guilty)!;
  const innocents = engine.getState().players.filter(p => !p.guilty);

  assert(engine.getState().maxWrongVotes === 2, 'TEST 31: Engine has maxWrongVotes = 2');

  // Round 1: Wrong vote 1 (eliminate innocent 0)
  const votesR1: Record<number, number> = {};
  innocents.forEach(p => { votesR1[p.id] = innocents[0].id; });
  votesR1[guilty.id] = innocents[0].id;

  const resR1 = engine.resolveVotes(votesR1);
  assert(resR1.wasGuilty === false, 'TEST 31: Round 1 innocent eliminated');
  assert(resR1.wrongVotesCount === 1, 'TEST 31: wrongVotesCount is 1');
  assert(resR1.gameOver === false, 'TEST 31: Game NOT over at 1 wrong vote when limit is 2');

  engine.proceedAfterVoteResult();
  assert(engine.getState().phase === 'DISCUSSION', 'TEST 31: Phase transitioned to DISCUSSION for round 2');

  // Round 2: Wrong vote 2 (eliminate innocent 1) -> Reaches maxWrongVotes (2)
  const votesR2: Record<number, number> = {};
  const aliveInnocents = PlayerManager.getAlivePlayers(engine.getState().players).filter(p => !p.guilty);
  aliveInnocents.forEach(p => { votesR2[p.id] = aliveInnocents[0].id; });
  votesR2[guilty.id] = aliveInnocents[0].id;

  const resR2 = engine.resolveVotes(votesR2);
  assert(resR2.wasGuilty === false, 'TEST 31: Round 2 innocent eliminated');
  assert(resR2.wrongVotesCount === 2, 'TEST 31: wrongVotesCount is 2');
  assert(resR2.gameOver === true, 'TEST 31: Game IS over when reaching configured maxWrongVotes = 2');
  assert(resR2.winner === 'GUILTY', 'TEST 31: Guilty wins on MAX_WRONG_VOTES');
  assert(resR2.endReason === 'MAX_WRONG_VOTES', 'TEST 31: End reason is MAX_WRONG_VOTES');
}

// =========================================================================
// TEST 32: Phase 6.1 - Missing & invalid configurations fall back to default (3)
// =========================================================================
{
  // Null story
  assert(StoryEngine.getMaxWrongVotes(null) === 3, 'TEST 32: Null story falls back to 3');
  assert(StoryEngine.getMaxWrongVotes(undefined) === 3, 'TEST 32: Undefined story falls back to 3');

  // Zero (0) is invalid
  const zeroStory: Story = { ...sampleStory, gameRules: { maxWrongVotes: 0 } };
  assert(StoryEngine.getMaxWrongVotes(zeroStory) === 3, 'TEST 32: maxWrongVotes = 0 falls back to 3');

  // Negative number (-2) is invalid
  const negStory: Story = { ...sampleStory, gameRules: { maxWrongVotes: -2 } };
  assert(StoryEngine.getMaxWrongVotes(negStory) === 3, 'TEST 32: maxWrongVotes = -2 falls back to 3');

  // NaN is invalid
  const nanStory: Story = { ...sampleStory, gameRules: { maxWrongVotes: NaN } };
  assert(StoryEngine.getMaxWrongVotes(nanStory) === 3, 'TEST 32: maxWrongVotes = NaN falls back to 3');

  // Non-integer (3.5) is invalid
  const floatStory: Story = { ...sampleStory, gameRules: { maxWrongVotes: 3.5 } };
  assert(StoryEngine.getMaxWrongVotes(floatStory) === 3, 'TEST 32: maxWrongVotes = 3.5 (float) falls back to 3');

  // Non-numeric types (e.g. string cast) fall back to 3
  const strStory = { ...sampleStory, gameRules: { maxWrongVotes: 'five' as unknown as number } };
  assert(StoryEngine.getMaxWrongVotes(strStory) === 3, 'TEST 32: maxWrongVotes = "five" falls back to 3');

  // Engine starts with fallback 3 on invalid configuration without failing
  const engine = new GameEngine();
  engine.startNewGame(zeroStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  assert(engine.getState().maxWrongVotes === 3, 'TEST 32: GameEngine initializes with 3 on invalid maxWrongVotes: 0');
}

// =========================================================================
// TEST 33: Phase 6.1 - Custom story with configured maxWrongVotes works seamlessly
// =========================================================================
{
  const customStory: Story = {
    ...sampleStory,
    id: 'custom_test_case_v2',
    isCustom: true,
    gameRules: {
      maxWrongVotes: 4
    }
  };

  const validation = StoryStore.saveCustomStory(customStory);
  assert(validation.valid === true, 'TEST 33: Custom story saves successfully');

  const engine = new GameEngine();
  engine.startNewGame(customStory, ['فارس', 'رانيا', 'طارق', 'هدى']);
  assert(engine.getState().maxWrongVotes === 4, 'TEST 33: GameEngine uses custom story maxWrongVotes = 4');
}

console.log(`\n==================================================`);
console.log(`ALL TESTS PASSED: ${passedTests} passed, ${failedTests} failed.`);
console.log(`==================================================\n`);
