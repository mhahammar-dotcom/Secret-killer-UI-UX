import { Player, PublicPlayer } from './types';

/**
 * PlayerManager provides pure functions to query and update player rosters.
 */
export class PlayerManager {
  /**
   * Sanitizes the player roster for public/shared displays (removes guilty flags and private knowledge)
   */
  static getPublicPlayers(players: Player[]): PublicPlayer[] {
    return players.map(p => ({
      id: p.id,
      name: p.name,
      character: {
        name: p.character.name,
        profession: p.character.profession,
        publicIdentity: p.character.publicIdentity,
      },
      isEliminated: p.isEliminated,
      votedForId: p.votedForId,
    }));
  }

  /**
   * Returns all living (non-eliminated) players
   */
  static getAlivePlayers(players: Player[]): Player[] {
    return players.filter(p => !p.isEliminated);
  }

  /**
   * Returns all eliminated players
   */
  static getEliminatedPlayers(players: Player[]): Player[] {
    return players.filter(p => p.isEliminated);
  }

  /**
   * Finds a player by their numeric ID
   */
  static getPlayerById(players: Player[], id: number): Player | undefined {
    return players.find(p => p.id === id);
  }

  /**
   * Checks if a player is permitted to vote
   */
  static canVote(player: Player | undefined): boolean {
    if (!player) return false;
    return !player.isEliminated;
  }

  /**
   * Checks if a player can be targeted for voting
   */
  static canBeVotedFor(player: Player | undefined): boolean {
    if (!player) return false;
    return !player.isEliminated;
  }

  /**
   * Eliminates a player and returns an updated player array
   */
  static eliminatePlayer(
    players: Player[],
    playerId: number
  ): { updatedPlayers: Player[]; eliminatedPlayer: Player | null } {
    let eliminatedPlayer: Player | null = null;

    const updatedPlayers = players.map(p => {
      if (p.id === playerId) {
        eliminatedPlayer = { ...p, isEliminated: true };
        return eliminatedPlayer;
      }
      return p;
    });

    return {
      updatedPlayers,
      eliminatedPlayer
    };
  }

  /**
   * Returns counts of alive and total guilty players
   */
  static getGuiltyStats(players: Player[]): { alive: number; total: number; eliminated: number } {
    const total = players.filter(p => p.guilty).length;
    const alive = players.filter(p => p.guilty && !p.isEliminated).length;
    return {
      total,
      alive,
      eliminated: total - alive
    };
  }

  /**
   * Returns counts of alive and total innocent players
   */
  static getInnocentStats(players: Player[]): { alive: number; total: number; eliminated: number } {
    const total = players.filter(p => !p.guilty).length;
    const alive = players.filter(p => !p.guilty && !p.isEliminated).length;
    return {
      total,
      alive,
      eliminated: total - alive
    };
  }
}
