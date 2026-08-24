import { Player, Story, VoteTally, VoteResult, WinnerSide, GameEndReason } from './types';
import { PlayerManager } from './PlayerManager';
import { StoryEngine } from './StoryEngine';

export interface ResolveVoteParams {
  votes: Record<number, number>; // voterId -> targetId
  players: Player[];
  story: Story;
  currentRound: number;
  wrongVotesCount: number;
  maxWrongVotes?: number;
}

/**
 * VotingEngine handles vote tallies, tie resolution, elimination, and win-condition checks.
 */
export class VotingEngine {
  /**
   * Validates whether all alive players have submitted valid votes for living targets.
   */
  static validateVotes(
    votes: Record<number, number>,
    players: Player[]
  ): {
    isValid: boolean;
    missingVoterIds: number[];
    invalidVoters: number[];
    invalidTargets: number[];
  } {
    const alivePlayers = PlayerManager.getAlivePlayers(players);
    const aliveIds = new Set(alivePlayers.map(p => p.id));
    const missingVoterIds: number[] = [];
    const invalidVoters: number[] = [];
    const invalidTargets: number[] = [];

    for (const player of alivePlayers) {
      if (!(player.id in votes)) {
        missingVoterIds.push(player.id);
      }
    }

    for (const [voterIdStr, targetId] of Object.entries(votes)) {
      const voterId = Number(voterIdStr);
      if (!aliveIds.has(voterId)) {
        invalidVoters.push(voterId);
      }
      if (!aliveIds.has(targetId)) {
        invalidTargets.push(targetId);
      }
    }

    const isValid =
      missingVoterIds.length === 0 &&
      invalidVoters.length === 0 &&
      invalidTargets.length === 0;

    return {
      isValid,
      missingVoterIds,
      invalidVoters,
      invalidTargets
    };
  }

  /**
   * Tallies cast votes and determines plurality / ties.
   */
  static tallyVotes(
    votes: Record<number, number>,
    players: Player[]
  ): {
    tallies: VoteTally[];
    maxVotes: number;
    topPlayerIds: number[];
    isTie: boolean;
  } {
    const alivePlayers = PlayerManager.getAlivePlayers(players);
    const countMap: Record<number, number> = {};

    // Initialize counts for all alive players
    alivePlayers.forEach(p => {
      countMap[p.id] = 0;
    });

    // Count valid votes from living voters for living targets
    Object.entries(votes).forEach(([voterIdStr, targetId]) => {
      const voterId = Number(voterIdStr);
      const voter = PlayerManager.getPlayerById(players, voterId);
      const target = PlayerManager.getPlayerById(players, targetId);

      if (voter && !voter.isEliminated && target && !target.isEliminated) {
        countMap[targetId] = (countMap[targetId] || 0) + 1;
      }
    });

    // Build structured tallies sorted descending by vote count
    const tallies: VoteTally[] = alivePlayers
      .map(p => ({
        playerId: p.id,
        playerName: p.name,
        characterName: p.character.name,
        voteCount: countMap[p.id] || 0
      }))
      .sort((a, b) => b.voteCount - a.voteCount);

    const maxVotes = tallies.length > 0 ? tallies[0].voteCount : 0;

    // Determine if top is a tie
    const topTallies = tallies.filter(t => t.voteCount === maxVotes);
    const topPlayerIds = topTallies.map(t => t.playerId);
    const isTie = maxVotes === 0 || topTallies.length > 1;

    return {
      tallies,
      maxVotes,
      topPlayerIds,
      isTie
    };
  }

  /**
   * Resolves the round's vote, performs elimination if applicable, and evaluates win conditions.
   */
  static resolveVote(params: ResolveVoteParams): VoteResult {
    const {
      votes,
      players,
      story,
      wrongVotesCount: currentWrongVotes,
      maxWrongVotes = 3
    } = params;

    const { tallies, isTie, topPlayerIds } = this.tallyVotes(votes, players);

    // Default result structure
    let selectedPlayerId: number | null = null;
    let selectedPlayer: Player | null = null;
    let eliminatedPlayer: Player | null = null;
    let wasGuilty = false;
    let newWrongVotesCount = currentWrongVotes;
    let unlockedHint: string | null = null;
    let gameOver = false;
    let winner: WinnerSide = 'NONE';
    let endReason: GameEndReason | null = null;

    /**
     * VOTING TIE BEHAVIOR SPECIFICATION:
     * When voting results in a tie (i.e., two or more living players receive the identical highest vote count, or zero votes cast):
     * 1. `isTie` is set to true.
     * 2. No player is eliminated for this round (`eliminatedPlayer` is null).
     * 3. The wrong-vote counter is NOT incremented (`wrongVotesCount` remains unchanged).
     * 4. No additional penalty hint is unlocked.
     * 5. The game continues to the next discussion round without elimination.
     */
    if (isTie || topPlayerIds.length === 0) {
      return {
        selectedPlayerId: null,
        selectedPlayer: null,
        isTie: true,
        tallies,
        wasGuilty: false,
        eliminatedPlayer: null,
        wrongVotesCount: currentWrongVotes,
        maxWrongVotes,
        unlockedHint: null,
        gameOver: false,
        winner: 'NONE',
        endReason: null
      };
    }

    selectedPlayerId = topPlayerIds[0];
    selectedPlayer = PlayerManager.getPlayerById(players, selectedPlayerId) || null;

    if (!selectedPlayer) {
      return {
        selectedPlayerId: null,
        selectedPlayer: null,
        isTie: true,
        tallies,
        wasGuilty: false,
        eliminatedPlayer: null,
        wrongVotesCount: currentWrongVotes,
        maxWrongVotes,
        unlockedHint: null,
        gameOver: false,
        winner: 'NONE',
        endReason: null
      };
    }

    wasGuilty = selectedPlayer.guilty;
    eliminatedPlayer = { ...selectedPlayer, isEliminated: true };

    // Update remaining roster simulation
    const updatedPlayers = players.map(p =>
      p.id === selectedPlayerId ? { ...p, isEliminated: true } : p
    );

    const guiltyStats = PlayerManager.getGuiltyStats(updatedPlayers);
    const innocentStats = PlayerManager.getInnocentStats(updatedPlayers);

    if (wasGuilty) {
      // Check if all guilty characters have been eliminated
      if (guiltyStats.alive === 0) {
        gameOver = true;
        winner = 'INNOCENTS';
        endReason = 'ALL_GUILTY_ELIMINATED';
      }
    } else {
      // Wrong vote (eliminated an innocent player)
      newWrongVotesCount = currentWrongVotes + 1;
      unlockedHint = StoryEngine.getWrongVoteHint(story, newWrongVotesCount - 1);

      // Check max wrong votes loss condition
      if (newWrongVotesCount >= maxWrongVotes) {
        gameOver = true;
        winner = 'GUILTY';
        endReason = 'MAX_WRONG_VOTES';
      } else if (guiltyStats.alive >= innocentStats.alive && innocentStats.alive > 0) {
        // Guilty parity condition
        gameOver = true;
        winner = 'GUILTY';
        endReason = 'GUILTY_PARITY';
      }
    }

    return {
      selectedPlayerId,
      selectedPlayer,
      isTie: false,
      tallies,
      wasGuilty,
      eliminatedPlayer,
      wrongVotesCount: newWrongVotesCount,
      maxWrongVotes,
      unlockedHint,
      gameOver,
      winner,
      endReason
    };
  }
}
