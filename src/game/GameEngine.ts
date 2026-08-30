import {
  GameState,
  Story,
  Player,
  VoteResult,
  GamePhase,
  WinnerSide,
  GameEndReason,
  EvidenceItem,
  ClueState
} from './types';
import { createInitialGameState, getAlivePlayers } from './GameState';
import { StoryEngine } from './StoryEngine';
import { CharacterAllocator, AllocatorOptions } from './CharacterAllocator';
import { PlayerManager } from './PlayerManager';
import { VotingEngine } from './VotingEngine';
import { ClueEngine, getTotalClueCount } from './ClueEngine';

export type GameStateListener = (state: GameState) => void;

/**
 * GameEngine coordinates the central game lifecycle, state transitions, and rules.
 * Completely headless and decoupled from UI.
 */
export class GameEngine {
  private state: GameState;
  private listeners: Set<GameStateListener> = new Set();
  private eligibleClues: EvidenceItem[] = [];

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
   * Returns the actual selected killers for the current active game
   */
  public getActualSelectedKillers(): string[] {
    return this.state.players.filter(p => p.guilty).map(p => p.character.name);
  }

  /**
   * Returns the authoritative centralized ClueState snapshot
   */
  public getClueState(): ClueState {
    return ClueEngine.buildClueState(
      this.state.players.length,
      this.state.currentRound,
      this.state.revealedEvidenceIds,
      this.state.revealedClues,
      this.state.clueRevealedThisRound
    );
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

    const playerCount = playerNames.length;
    const maxMatchClues = getTotalClueCount(playerCount);

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
    const actualSelectedKillers = players.filter(p => p.guilty).map(p => p.character.name);

    // Filter eligible clues strictly by the actual selected killers
    this.eligibleClues = ClueEngine.getEligibleClues(story, actualSelectedKillers);
    const totalClues = getTotalClueCount(playerCount);

    if (this.eligibleClues.length < totalClues) {
      throw new Error(
        `Cannot start game: ${playerCount} players require ${totalClues} valid clues, but only ${this.eligibleClues.length} clues are compatible with the selected killers [${actualSelectedKillers.join(', ')}].`
      );
    }

    const initialEvidence = this.eligibleClues.filter(e => e.isInitialPublic);
    const initialRevealedIds = initialEvidence.map(e => e.id);
    const initialRevealedClues = initialEvidence.map(e => e.publicClue || e.description);

    if (initialRevealedIds.length > totalClues) {
      throw new Error(
        `Cannot start game: Initial public clues (${initialRevealedIds.length}) exceed total configured clues (${totalClues}).`
      );
    }

    this.state = {
      phase: 'ROLE_PASS',
      story,
      players,
      currentViewingPlayerIndex: 0,
      currentRound: 1,
      totalClues,
      remainingClues: totalClues - initialRevealedIds.length,
      clueRevealedThisRound: false,
      revealedEvidenceIds: initialRevealedIds,
      revealedClues: initialRevealedClues,
      wrongVotesCount: 0,
      maxWrongVotes: StoryEngine.getMaxWrongVotes(story),
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
   * Returns all eligible evidence items defined for the active story and current actual killers
   */
  public getAllEvidence(): EvidenceItem[] {
    if (!this.state.story) return [];
    if (this.eligibleClues && this.eligibleClues.length > 0) {
      return this.eligibleClues;
    }
    const actualKillers = this.getActualSelectedKillers();
    return ClueEngine.getEligibleClues(this.state.story, actualKillers);
  }

  /**
   * Returns evidence items that have already been revealed
   */
  public getRevealedEvidence(): EvidenceItem[] {
    if (!this.state.story) return [];
    const all = this.getAllEvidence();
    const revealedSet = new Set(this.state.revealedEvidenceIds || []);
    return all.filter(e => revealedSet.has(e.id));
  }

  /**
   * Returns evidence items that are not yet revealed
   */
  public getUnrevealedEvidence(): EvidenceItem[] {
    if (!this.state.story) return [];
    const all = this.getAllEvidence();
    const revealedSet = new Set(this.state.revealedEvidenceIds || []);
    return all.filter(e => !revealedSet.has(e.id));
  }

  /**
   * Checks whether a clue can be revealed in the current round
   */
  public canRevealClue(): boolean {
    if (!this.state.story) return false;
    if (this.state.clueRevealedThisRound) return false;
    if (this.state.remainingClues <= 0) return false;
    if (this.state.revealedEvidenceIds.length >= this.state.totalClues) return false;
    return this.getAvailableUnrevealedEvidence().length > 0;
  }

  /**
   * Checks whether a specific evidence item is currently available to be revealed
   */
  public isEvidenceAvailable(evidenceId: string): boolean {
    if (!this.state.story) return false;
    if (this.state.clueRevealedThisRound) return false;
    if (this.state.remainingClues <= 0) return false;
    if (this.state.revealedEvidenceIds.length >= this.state.totalClues) return false;

    const all = this.getAllEvidence();
    const item = all.find(e => e.id === evidenceId);
    if (!item) return false;

    // Already revealed items are not available to be revealed again
    const alreadyRevealed = (this.state.revealedEvidenceIds || []).includes(evidenceId);
    if (alreadyRevealed) return false;

    // Round gating check
    if (item.availableFromRound && item.availableFromRound > this.state.currentRound) {
      return false;
    }

    return true;
  }

  /**
   * Returns all unrevealed evidence items that are currently available to inspect/reveal
   */
  public getAvailableUnrevealedEvidence(): EvidenceItem[] {
    if (!this.state.story) return [];
    const all = this.getAllEvidence();
    const revealedSet = new Set(this.state.revealedEvidenceIds || []);
    return all.filter(
      e => !revealedSet.has(e.id) && (!e.availableFromRound || e.availableFromRound <= this.state.currentRound)
    );
  }

  /**
   * Checks if there are unrevealed evidence items currently eligible for revelation
   */
  public hasAvailableEvidence(): boolean {
    return this.canRevealClue();
  }

  /**
   * Checks if there are more unrevealed evidence items in total
   */
  public hasMoreEvidence(): boolean {
    return this.canRevealClue();
  }

  /**
   * Reveals a specific evidence item by its ID after validating availability rules
   */
  public revealEvidence(evidenceId?: string): GameState {
    if (!this.state.story) {
      throw new Error('Cannot reveal evidence: no active story.');
    }

    // Hard Rule 5: Only ONE clue can be revealed per round
    if (this.state.clueRevealedThisRound) {
      return this.getState();
    }

    // Hard Rule 11: Clue exhaustion
    if (
      this.state.remainingClues <= 0 ||
      this.state.revealedEvidenceIds.length >= this.state.totalClues
    ) {
      return this.getState();
    }

    const allAvailable = this.getAvailableUnrevealedEvidence();
    if (allAvailable.length === 0) {
      return this.getState();
    }

    let targetItem: EvidenceItem | undefined;
    if (evidenceId) {
      targetItem = allAvailable.find(e => e.id === evidenceId);
      if (!targetItem) return this.getState();
    } else {
      targetItem = allAvailable[0];
    }

    // Hard Rule 10: No duplicate clues
    if (this.state.revealedEvidenceIds.includes(targetItem.id)) {
      return this.getState();
    }

    const updatedRevealedIds = [...this.state.revealedEvidenceIds, targetItem.id];
    const clueText = targetItem.publicClue || targetItem.description || targetItem.title;
    const updatedRevealedClues = this.state.revealedClues.includes(clueText)
      ? this.state.revealedClues
      : [...this.state.revealedClues, clueText];

    const remainingClues = Math.max(0, this.state.totalClues - updatedRevealedIds.length);

    this.state = {
      ...this.state,
      clueRevealedThisRound: true,
      remainingClues,
      revealedEvidenceIds: updatedRevealedIds,
      revealedClues: updatedRevealedClues
    };

    this.notify();
    return this.getState();
  }

  /**
   * Helper to reveal the next available unrevealed evidence item
   */
  public revealNextEvidence(): GameState {
    return this.revealEvidence();
  }

  /**
   * Transitions from lobby or role reveal directly to discussion
   * Discussion begins with public story info and character statements (NO automatic evidence flood).
   */
  public startDiscussion(): GameState {
    if (!this.state.story) {
      throw new Error('Cannot start discussion: no story active.');
    }

    this.state = {
      ...this.state,
      phase: 'DISCUSSION'
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

    this.state = {
      ...this.state,
      phase: 'VOTE_RESULT',
      players: updatedPlayers,
      votes: activeVotes,
      wrongVotesCount: voteResult.wrongVotesCount,
      revealedClues: this.state.revealedClues,
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
      // Continue to next discussion round without hardcoded evidence IDs or auto-flood
      const nextRound = this.state.currentRound + 1;

      this.state = {
        ...this.state,
        phase: 'DISCUSSION',
        currentRound: nextRound,
        clueRevealedThisRound: false,
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
