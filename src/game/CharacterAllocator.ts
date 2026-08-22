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

    // 1. Determine guilty count based on story configuration or options
    const targetGuiltyCount = options?.guiltyCount !== undefined
      ? Math.min(Math.max(1, options.guiltyCount), story.guiltyPool.length)
      : StoryEngine.getGuiltyCountForScenario(story);

    // 2. Select guilty character(s) from guiltyPool
    const shuffledGuiltyPool = doShuffle
      ? this.shuffleArray([...story.guiltyPool], random)
      : [...story.guiltyPool];

    const selectedGuiltyChars = shuffledGuiltyPool.slice(0, targetGuiltyCount).map(char => ({
      ...char,
      guilty: true // Internal flag
    }));

    // 3. Determine innocent characters needed
    const innocentCountNeeded = playerCount - selectedGuiltyChars.length;
    const shuffledInnocentPool = doShuffle
      ? this.shuffleArray([...story.innocentPool], random)
      : [...story.innocentPool];

    // Ensure we have enough innocent characters (fill dynamically if pool is smaller than 12)
    const selectedInnocentChars: StoryCharacter[] = [];
    for (let i = 0; i < innocentCountNeeded; i++) {
      if (i < shuffledInnocentPool.length) {
        selectedInnocentChars.push({
          ...shuffledInnocentPool[i],
          guilty: false
        });
      } else {
        // Fallback generator for high player counts if custom story has fewer characters
        const baseIndex = i % (shuffledInnocentPool.length || 1);
        const baseChar = shuffledInnocentPool[baseIndex] || {
          name: `ضيف إضافي ${i + 1}`,
          profession: 'شاهد إضافي',
          publicIdentity: 'ضيف متواجد أثناء الحادثة',
          knowledge: 'كنت متواجداً في المكان ولكن لم ألحظ شيئاً مريباً للوهلة الأولى.'
        };
        selectedInnocentChars.push({
          name: `${baseChar.name} (${i + 1})`,
          profession: baseChar.profession,
          publicIdentity: baseChar.publicIdentity,
          knowledge: baseChar.knowledge,
          guilty: false
        });
      }
    }

    // 4. Combine all characters
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
