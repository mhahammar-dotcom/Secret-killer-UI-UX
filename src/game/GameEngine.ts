import {
  GameState,
  Story,
  Player,
  VoteResult,
  GamePhase,
  WinnerSide,
  GameEndReason
} from './types';
import { createInitialGameState, getAlivePlayers } from './GameState';
import { StoryEngine } from './StoryEngine';
import { CharacterAllocator, AllocatorOptions } from './CharacterAllocator';
import { PlayerManager } from './PlayerManager';
import { VotingEngine } from './VotingEngine';

export type GameStateListener = (state: GameState) => void;

/**
 * GameEngine coordinates the central game lifecycle, state transitions, and rules.
 * Completely headless and decoupled from UI.
 */
export class GameEngine {
  private state: GameState;
  private listeners: Set<GameStateListener> = new Set();

  constructor(initialState?: GameState) {
    this.state = initialState || createInitialGameState();
  }

  /**
   * Returns current immutable-safe snapshot of game state
   */
  public getState(): Readonly<GameState> {
    return { ...this.state };
  }

  /**
   * Subscribes a listener to state changes
   */
  public subscribe(listener: GameStateListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = this.getState();
    this.listeners.forEach(l => l(snapshot));
  }

  /**
   * Initializes and starts a new game with a selected story and player names
   */
  public startNewGame(
    story: Story,
    playerNames: string[],
    options?: AllocatorOptions
  ): GameState {
    const validation = StoryEngine.validateStory(story);
    if (!validation.valid) {
      throw new Error(`Cannot start game: invalid story. Errors: ${validation.errors.join(', ')}`);
    }

    if (playerNames.length < 4 || playerNames.length > 12) {
      throw new Error(`Player count must be between 4 and 12 (received ${playerNames.length}).`);
    }

    // Validate player names: non-empty and unique
    const trimmedNames = playerNames.map(n => n.trim()).filter(Boolean);
    if (trimmedNames.length !== playerNames.length) {
      throw new Error('All player names must be non-empty.');
    }
    const nameSet = new Set(trimmedNames.map(n => n.toLowerCase()));
    if (nameSet.size !== trimmedNames.length) {
      throw new Error('Duplicate player names are not allowed. Every player must have a unique name.');
    }

    // Allocate characters & guilt internally
    const players = CharacterAllocator.allocateCharacters(story, playerNames, options);

    // Initial revealed clues for round 1
    const initialClues = StoryEngine.getCluesForRound(story, 1);

    this.state = {
      phase: 'ROLE_PASS',
      story,
      players,
      currentViewingPlayerIndex: 0,
      currentRound: 1,
      revealedClues: initialClues,
      wrongVotesCount: 0,
      maxWrongVotes: 3,
      votes: {},
      lastVoteResult: null,
      winner: 'NONE',
      endReason: null,
      history: {
        roundsPlayed: 1,
        wrongVotes: 0,
        eliminations: [],
        votesByRound: {}
      }
    };

    this.notify();
    return this.getState();
  }

  /**
   * Advances role reveal pass to next player, or to discussion if all players viewed their roles
   */
  public advanceRolePass(): GameState {
    if (this.state.phase !== 'ROLE_PASS') {
      return this.getState();
    }

    const nextIndex = this.state.currentViewingPlayerIndex + 1;
    if (nextIndex < this.state.players.length) {
      this.state = {
        ...this.state,
        currentViewingPlayerIndex: nextIndex
      };
    } else {
      // All players have viewed their role, proceed to discussion
      this.state = {
        ...this.state,
        phase: 'DISCUSSION',
        currentViewingPlayerIndex: 0
      };
    }

    this.notify();
    return this.getState();
  }

  /**
   * Returns current viewing player in ROLE_PASS phase
   */
  public getCurrentViewingPlayer(): Player | null {
    if (this.state.players.length === 0) return null;
    return this.state.players[this.state.currentViewingPlayerIndex] || null;
  }

  /**
   * Returns current viewing player index
   */
  public getCurrentViewingPlayerIndex(): number {
    return this.state.currentViewingPlayerIndex;
  }

  /**
   * Checks if current viewing player is the last player in the list
   */
  public isLastViewingPlayer(): boolean {
    if (this.state.players.length === 0) return true;
    return this.state.currentViewingPlayerIndex >= this.state.players.length - 1;
  }

  /**
   * Resets role pass to first player
   */
  public resetRolePass(): GameState {
    if (this.state.phase === 'ROLE_PASS') {
      this.state = {
        ...this.state,
        currentViewingPlayerIndex: 0
      };
      this.notify();
    }
    return this.getState();
  }

  /**
   * Transitions from lobby or role reveal directly to discussion
   */
  public startDiscussion(): GameState {
    if (!this.state.story) {
      throw new Error('Cannot start discussion: no story active.');
    }

    const roundClues = StoryEngine.getCluesForRound(this.state.story, this.state.currentRound);
    const mergedClues = Array.from(new Set([...this.state.revealedClues, ...roundClues]));

    this.state = {
      ...this.state,
      phase: 'DISCUSSION',
      revealedClues: mergedClues
    };

    this.notify();
    return this.getState();
  }

  /**
   * Enters voting phase for the current round
   */
  public startVoting(): GameState {
    this.state = {
      ...this.state,
      phase: 'VOTING',
      votes: {}
    };

    this.notify();
    return this.getState();
  }

  /**
   * Records a vote from a living voter for a living target
   */
  public castVote(voterId: number, targetId: number): GameState {
    const voter = PlayerManager.getPlayerById(this.state.players, voterId);
    const target = PlayerManager.getPlayerById(this.state.players, targetId);

    if (!voter || voter.isEliminated) {
      throw new Error(`Player ${voterId} is eliminated or does not exist and cannot vote.`);
    }
    if (!target || target.isEliminated) {
      throw new Error(`Target player ${targetId} is eliminated or does not exist and cannot be voted for.`);
    }

    this.state = {
      ...this.state,
      votes: {
        ...this.state.votes,
        [voterId]: targetId
      }
    };

    this.notify();
    return this.getState();
  }

  /**
   * Submits all cast votes, resolves elimination, and checks win conditions
   */
  public resolveVotes(directVotes?: Record<number, number>): VoteResult {
    if (!this.state.story) {
      throw new Error('Cannot resolve votes: no active story.');
    }

    const activeVotes = directVotes || this.state.votes;

    const voteResult = VotingEngine.resolveVote({
      votes: activeVotes,
      players: this.state.players,
      story: this.state.story,
      currentRound: this.state.currentRound,
      wrongVotesCount: this.state.wrongVotesCount,
      maxWrongVotes: this.state.maxWrongVotes
    });

    let updatedPlayers = [...this.state.players];
    const newEliminations = [...this.state.history.eliminations];

    // If voteResult.isTie is true, voteResult.eliminatedPlayer is null.
    // The engine records no elimination, leaves wrongVotes unchanged, and proceeds.
    if (voteResult.eliminatedPlayer) {
      const elim = PlayerManager.eliminatePlayer(
        this.state.players,
        voteResult.eliminatedPlayer.id
      );
      updatedPlayers = elim.updatedPlayers;
      newEliminations.push({
        round: this.state.currentRound,
        player: voteResult.eliminatedPlayer,
        wasGuilty: voteResult.wasGuilty
      });
    }

    // Unlocked hints on wrong vote
    const newRevealedClues = [...this.state.revealedClues];
    if (voteResult.unlockedHint && !newRevealedClues.includes(voteResult.unlockedHint)) {
      newRevealedClues.push(voteResult.unlockedHint);
    }

    this.state = {
      ...this.state,
      phase: 'VOTE_RESULT',
      players: updatedPlayers,
      wrongVotesCount: voteResult.wrongVotesCount,
      revealedClues: newRevealedClues,
      lastVoteResult: voteResult,
      winner: voteResult.winner,
      endReason: voteResult.endReason,
      history: {
        ...this.state.history,
        wrongVotes: voteResult.wrongVotesCount,
        eliminations: newEliminations,
        votesByRound: {
          ...this.state.history.votesByRound,
          [this.state.currentRound]: activeVotes
        }
      }
    };

    this.notify();
    return voteResult;
  }

  /**
   * Proceeds from vote result screen to either next discussion round or killer reveal
   */
  public proceedAfterVoteResult(): GameState {
    if (this.state.winner !== 'NONE') {
      this.state = {
        ...this.state,
        phase: 'KILLER_REVEAL'
      };
    } else {
      // Continue to next round
      const nextRound = this.state.currentRound + 1;
      const roundClues = this.state.story
        ? StoryEngine.getCluesForRound(this.state.story, nextRound)
        : [];
      const mergedClues = Array.from(new Set([...this.state.revealedClues, ...roundClues]));

      this.state = {
        ...this.state,
        phase: 'DISCUSSION',
        currentRound: nextRound,
        revealedClues: mergedClues,
        votes: {},
        lastVoteResult: null,
        history: {
          ...this.state.history,
          roundsPlayed: nextRound
        }
      };
    }

    this.notify();
    return this.getState();
  }

  /**
   * Advances from Killer Reveal to Crime Explanation
   */
  public proceedToCrimeExplanation(): GameState {
    this.state = {
      ...this.state,
      phase: 'CRIME_EXPLANATION'
    };
    this.notify();
    return this.getState();
  }

  /**
   * Advances to Final Results / Game Over
   */
  public proceedToGameOver(): GameState {
    this.state = {
      ...this.state,
      phase: 'GAME_OVER'
    };
    this.notify();
    return this.getState();
  }

  /**
   * Resets the game back to the lobby / story select
   */
  public resetToLobby(): GameState {
    this.state = createInitialGameState();
    this.notify();
    return this.getState();
  }
}
