import { GameState, Player, WinnerSide, StoryCharacter, PublicPlayer } from './types';

/**
 * Creates a clean default GameState
 */
export function createInitialGameState(overrides?: Partial<GameState>): GameState {
  return {
    phase: 'LOBBY',
    story: null,
    players: [],
    currentViewingPlayerIndex: 0,
    currentRound: 1,
    revealedEvidenceIds: [],
    revealedClues: [],
    wrongVotesCount: 0,
    maxWrongVotes: 3,
    votes: {},
    lastVoteResult: null,
    winner: 'NONE',
    endReason: null,
    history: {
      roundsPlayed: 0,
      wrongVotes: 0,
      eliminations: [],
      votesByRound: {}
    },
    ...overrides
  };
}

/**
 * Returns all active (not eliminated) players
 */
export function getAlivePlayers(state: GameState): Player[] {
  return state.players.filter(p => !p.isEliminated);
}

/**
 * Returns all eliminated players
 */
export function getEliminatedPlayers(state: GameState): Player[] {
  return state.players.filter(p => p.isEliminated);
}

/**
 * Returns all guilty players (internal check)
 */
export function getGuiltyPlayers(state: GameState): Player[] {
  return state.players.filter(p => p.guilty);
}

/**
 * Returns all alive guilty players
 */
export function getAliveGuiltyPlayers(state: GameState): Player[] {
  return state.players.filter(p => p.guilty && !p.isEliminated);
}

/**
 * Returns all innocent players
 */
export function getInnocentPlayers(state: GameState): Player[] {
  return state.players.filter(p => !p.guilty);
}

/**
 * Returns all alive innocent players
 */
export function getAliveInnocentPlayers(state: GameState): Player[] {
  return state.players.filter(p => !p.guilty && !p.isEliminated);
}

/**
 * Checks if the game has reached an end state
 */
export function isGameOver(state: GameState): boolean {
  return state.phase === 'GAME_OVER' || state.winner !== 'NONE';
}

/**
 * Sanitizes a Player object for public display (strips internal guilt flags)
 */
export function getSafePublicPlayer(player: Player): PublicPlayer {
  const { guilty: _charGuilty, ...safeChar } = player.character;
  const { guilty: _playerGuilty, ...safePlayer } = player;
  return {
    ...safePlayer,
    character: safeChar
  };
}
