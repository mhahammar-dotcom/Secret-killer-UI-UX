import { Player, PublicPlayer } from './types';

/**
 * Calculates the exact killer count based on player count according to the core Secret Killer rules:
 * - 4 to 6 players: 1 Killer
 * - 7 to 9 players: 2 Killers
 * - 10 to 12 players: 3 Killers
 *
 * Throws an Error for invalid player counts (< 4 or > 12).
 */
export function getKillerCount(playerCount: number): number {
  if (typeof playerCount !== 'number' || Number.isNaN(playerCount) || !Number.isInteger(playerCount)) {
    throw new Error(`Invalid player count: ${playerCount}. Must be an integer between 4 and 12.`);
  }

  if (playerCount < 4 || playerCount > 12) {
    throw new Error(`Invalid player count: ${playerCount}. Supported player count is between 4 and 12.`);
  }

  if (playerCount >= 4 && playerCount <= 6) {
    return 1;
  }

  if (playerCount >= 7 && playerCount <= 9) {
    return 2;
  }

  if (playerCount >= 10 && playerCount <= 12) {
    return 3;
  }

  throw new Error(`Invalid player count: ${playerCount}. Must be between 4 and 12.`);
}

/**
 * Returns partner killer(s) for a given player based strictly on actualSelectedKillers / player guilt.
 *
 * Rules:
 * - If the target is NOT an actual killer (innocent), returns []
 * - If the target IS an actual killer, returns all other actual killers in deterministic order.
 * - A killer is never returned as their own partner.
 */
export function getKillerPartners(
  playerIdOrName: number | string,
  actualSelectedKillersOrPlayers: string[] | Player[],
  playersList?: Player[]
): any[] {
  if (!actualSelectedKillersOrPlayers || actualSelectedKillersOrPlayers.length === 0) {
    return [];
  }

  // Case 1: Called with string identifier and string[] of actualSelectedKillers
  if (typeof actualSelectedKillersOrPlayers[0] === 'string') {
    const killerNames = actualSelectedKillersOrPlayers as string[];
    const targetName = String(playerIdOrName).trim();

    // Check if target is among actualSelectedKillers
    const isKiller = killerNames.some(
      k => k.trim().toLowerCase() === targetName.toLowerCase()
    );
    if (!isKiller) {
      return [];
    }

    if (playersList && playersList.length > 0) {
      // If playersList was also provided, return the matching Player objects for the OTHER killers
      return playersList.filter(
        p =>
          p.guilty &&
          p.character.name.trim().toLowerCase() !== targetName.toLowerCase() &&
          p.name.trim().toLowerCase() !== targetName.toLowerCase()
      );
    }

    // Return the other killer names deterministically
    return killerNames.filter(
      k => k.trim().toLowerCase() !== targetName.toLowerCase()
    );
  }

  // Case 2: Called with playerId (or playerName) and Player[] array
  const players = actualSelectedKillersOrPlayers as Player[];
  const targetPlayer =
    typeof playerIdOrName === 'number'
      ? players.find(p => p.id === playerIdOrName)
      : players.find(
          p =>
            p.name.trim().toLowerCase() === String(playerIdOrName).trim().toLowerCase() ||
            p.character.name.trim().toLowerCase() === String(playerIdOrName).trim().toLowerCase()
        );

  if (!targetPlayer || !targetPlayer.guilty) {
    return [];
  }

  // Return all other guilty players in deterministic order
  return players.filter(p => p.guilty && p.id !== targetPlayer.id);
}

/**
 * PlayerManager provides pure functions to query and update player rosters.
 */
export class PlayerManager {
  /**
   * Authoritative killer count resolver based on player count
   */
  static getKillerCount(playerCount: number): number {
    return getKillerCount(playerCount);
  }

  /**
   * Returns partner killer(s) for a given player based strictly on actualSelectedKillers / player guilt.
   */
  static getKillerPartners(
    playerIdOrName: number | string,
    actualSelectedKillersOrPlayers: string[] | Player[],
    playersList?: Player[]
  ): any[] {
    return getKillerPartners(playerIdOrName, actualSelectedKillersOrPlayers, playersList);
  }

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
