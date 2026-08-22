import { Story, StoryCharacter, Player } from './types';
import { StoryEngine } from './StoryEngine';

export interface AllocatorOptions {
  shuffle?: boolean;
  guiltyCount?: number;
  randomFn?: () => number;
}

/**
 * CharacterAllocator distributes in-universe characters to players.
 * Guarantees that every player gets a legitimate story character and profession.
 * Guilt is strictly an internal boolean flag and is NEVER set as a role name.
 */
export class CharacterAllocator {
  /**
   * Allocates characters from a story to a list of player names (4–12 players)
   */
  static allocateCharacters(
    story: Story,
    playerNames: string[],
    options?: AllocatorOptions
  ): Player[] {
    const playerCount = playerNames.length;
    if (playerCount < 4 || playerCount > 12) {
      throw new Error(`Player count must be between 4 and 12 (received ${playerCount}).`);
    }

    const random = options?.randomFn || Math.random;
    const doShuffle = options?.shuffle ?? true;

    // Check if story supports this player count based on available unique characters
    const totalAvailableChars = (story.guiltyPool?.length || 0) + (story.innocentPool?.length || 0);
    if (playerCount > totalAvailableChars) {
      throw new Error(
        `This story supports a maximum of ${totalAvailableChars} players because it only contains ${totalAvailableChars} valid characters.`
      );
    }

    // 1. Determine guilty count based on story configuration or explicit options
    const targetGuiltyCount = options?.guiltyCount !== undefined
      ? options.guiltyCount
      : StoryEngine.getGuiltyCountForScenario(story);

    if (targetGuiltyCount < 1) {
      throw new Error('At least 1 guilty character is required.');
    }
    if (targetGuiltyCount > story.guiltyPool.length) {
      throw new Error(
        `Requested ${targetGuiltyCount} guilty characters, but story guiltyPool only contains ${story.guiltyPool.length}.`
      );
    }
    if (targetGuiltyCount >= playerCount) {
      throw new Error(
        `Guilty characters count (${targetGuiltyCount}) must be less than total players (${playerCount}).`
      );
    }

    // 2. Select guilty character(s) from guiltyPool
    const shuffledGuiltyPool = doShuffle
      ? this.shuffleArray([...story.guiltyPool], random)
      : [...story.guiltyPool];

    const selectedGuiltyChars = shuffledGuiltyPool.slice(0, targetGuiltyCount).map(char => ({
      ...char,
      guilty: true // Internal flag only
    }));

    // 3. Determine innocent characters needed (strictly from innocentPool, no fake characters)
    const innocentCountNeeded = playerCount - selectedGuiltyChars.length;
    if (innocentCountNeeded > story.innocentPool.length) {
      throw new Error(
        `Insufficient innocent characters in story (needed ${innocentCountNeeded}, available ${story.innocentPool.length}).`
      );
    }

    const shuffledInnocentPool = doShuffle
      ? this.shuffleArray([...story.innocentPool], random)
      : [...story.innocentPool];

    const selectedInnocentChars = shuffledInnocentPool.slice(0, innocentCountNeeded).map(char => ({
      ...char,
      guilty: false
    }));

    // 4. Combine all characters - strictly unique legitimate story characters
    const allAssignedCharacters = [...selectedGuiltyChars, ...selectedInnocentChars];

    // 5. Shuffle the characters so guilty isn't always player 1
    const finalCharacters = doShuffle
      ? this.shuffleArray(allAssignedCharacters, random)
      : allAssignedCharacters;

    // 6. Map to Player objects
    return playerNames.map((name, index) => {
      const char = finalCharacters[index];
      return {
        id: index + 1,
        name: name.trim() || `لاعب ${index + 1}`,
        character: {
          name: char.name,
          profession: char.profession,
          publicIdentity: char.publicIdentity,
          knowledge: char.knowledge,
          guilty: char.guilty
        },
        guilty: char.guilty, // Internal player guilt
        isEliminated: false
      };
    });
  }

  /**
   * Fisher-Yates shuffle helper
   */
  private static shuffleArray<T>(array: T[], random: () => number): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
