import { Story, StoryCharacter, Player, EvidenceItem } from './types';
import { StoryEngine } from './StoryEngine';

export interface AllocatorOptions {
  shuffle?: boolean;
  guiltyCount?: number;
  randomFn?: () => number;
}

export interface CharacterDependencyGraph {
  allCharacters: StoryCharacter[];
  charByName: Map<string, StoryCharacter>;
  dependencies: Map<string, Set<string>>; // charName -> Set of charNames it depends on
  closures: Map<string, Set<string>>;     // charName -> Set of all transitive charNames required
}

export class CharacterAllocator {
  /**
   * Normalizes Arabic text for robust name matching
   */
  public static normalizeArabic(text: string): string {
    if (!text) return '';
    return text
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // remove all tashkeel and tatweel
      .replace(/[إأآ]/g, 'ا')
      .trim();
  }

  /**
   * Detects character name references in a piece of narrative text
   */
  public static detectReferencesInText(
    sourceCharName: string,
    text: string,
    allCharacterNames: string[]
  ): string[] {
    if (!text) return [];
    const mentioned = new Set<string>();
    const cleanText = this.normalizeArabic(text);

    for (const targetName of allCharacterNames) {
      if (targetName === sourceCharName) continue;

      const cleanTarget = this.normalizeArabic(targetName);
      if (!cleanTarget) continue;

      const escaped = cleanTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Pattern:
      // Prefixes: و, ف, ب, ل, ك, ال, لل, د., دكتور
      // Suffixes: optional tanween alef ا
      // Word boundaries in Arabic & Unicode
      const pattern = new RegExp(
        '(?:^|[\\s\\p{P}\\p{S}])(?:و|ف|ب|ل|ك|ال|لل|د\\.|دكتور\\s+)?' +
        escaped +
        '(?:ا)?' +
        '(?=[\\s\\p{P}\\p{S}]|$)',
        'u'
      );

      if (pattern.test(cleanText)) {
        mentioned.add(targetName);
      }
    }

    return Array.from(mentioned);
  }

  /**
   * Builds a complete dependency graph for a story's character pool
   */
  public static buildDependencyGraph(story: Story): CharacterDependencyGraph {
    const allCharacters: StoryCharacter[] = [
      ...(story.guiltyPool || []),
      ...(story.innocentPool || [])
    ];

    const charByName = new Map<string, StoryCharacter>();
    allCharacters.forEach(c => {
      if (c.name) {
        charByName.set(c.name, c);
      }
    });

    const allNames = Array.from(charByName.keys());
    const dependencies = new Map<string, Set<string>>();
    allNames.forEach(name => dependencies.set(name, new Set<string>()));

    // 1. Character narrative dependencies (publicIdentity & knowledge)
    allCharacters.forEach(char => {
      const deps = dependencies.get(char.name)!;
      const narrativeText = `${char.publicIdentity || ''} ${char.knowledge || ''}`;
      const mentioned = this.detectReferencesInText(char.name, narrativeText, allNames);

      mentioned.forEach(targetName => {
        if (charByName.has(targetName) && targetName !== char.name) {
          deps.add(targetName);
        }
      });
    });

    // 2. Structured Evidence and Evidence text dependencies
    // Inspect all available evidence items (explicit story.evidence + legacy converted items)
    const rawEvidenceList: EvidenceItem[] = [
      ...(story.evidence || []),
      ...StoryEngine.getStoryEvidence(story)
    ];

    // De-duplicate evidence items by id or title+description
    const processedEvKeys = new Set<string>();
    const uniqueEvidence: EvidenceItem[] = [];
    for (const ev of rawEvidenceList) {
      const key = ev.id || `${ev.title}_${ev.description}`;
      if (!processedEvKeys.has(key)) {
        processedEvKeys.add(key);
        uniqueEvidence.push(ev);
      }
    }

    // Also inspect legacy clues and investigation rounds directly if not covered
    const additionalClueTexts: string[] = [
      ...(story.clues || []),
      ...(story.wrongVoteHints || [])
    ];

    uniqueEvidence.forEach(ev => {
      const referencedChars = new Set<string>();

      // A) Structured relatedCharacters
      if (Array.isArray(ev.relatedCharacters)) {
        ev.relatedCharacters.forEach(refName => {
          if (refName && typeof refName === 'string') {
            const cleanRef = this.normalizeArabic(refName);
            for (const name of allNames) {
              if (this.normalizeArabic(name) === cleanRef) {
                referencedChars.add(name);
                break;
              }
            }
          }
        });
      }

      // B) Text fields (title, description, publicClue, discussionPrompt, timelineInfo)
      const evText = `${ev.title || ''} ${ev.description || ''} ${ev.publicClue || ''} ${ev.discussionPrompt || ''} ${ev.timelineInfo || ''}`;
      const textMentioned = this.detectReferencesInText('', evText, allNames);
      textMentioned.forEach(name => referencedChars.add(name));

      const refArray = Array.from(referencedChars);
      if (refArray.length > 0) {
        // Cross-character dependencies within this evidence item
        if (refArray.length >= 2) {
          for (let i = 0; i < refArray.length; i++) {
            for (let j = 0; j < refArray.length; j++) {
              if (i !== j) {
                dependencies.get(refArray[i])?.add(refArray[j]);
              }
            }
          }
        }

        // Story/Crime evidence dependencies: all guilty candidates depend on characters referenced in story evidence
        (story.guiltyPool || []).forEach(guiltyChar => {
          refArray.forEach(target => {
            if (target !== guiltyChar.name) {
              dependencies.get(guiltyChar.name)?.add(target);
            }
          });
        });
      }
    });

    // Inspect additional clue texts
    additionalClueTexts.forEach(text => {
      const clueMentioned = this.detectReferencesInText('', text, allNames);
      if (clueMentioned.length > 0) {
        if (clueMentioned.length >= 2) {
          for (let i = 0; i < clueMentioned.length; i++) {
            for (let j = 0; j < clueMentioned.length; j++) {
              if (i !== j) {
                dependencies.get(clueMentioned[i])?.add(clueMentioned[j]);
              }
            }
          }
        }
        (story.guiltyPool || []).forEach(guiltyChar => {
          clueMentioned.forEach(target => {
            if (target !== guiltyChar.name) {
              dependencies.get(guiltyChar.name)?.add(target);
            }
          });
        });
      }
    });

    // Compute transitive closures
    const closures = new Map<string, Set<string>>();
    allNames.forEach(name => {
      const closure = new Set<string>();
      const queue: string[] = [name];
      closure.add(name);

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentDeps = dependencies.get(current);
        if (currentDeps) {
          currentDeps.forEach(dep => {
            if (!closure.has(dep)) {
              closure.add(dep);
              queue.push(dep);
            }
          });
        }
      }

      closures.set(name, closure);
    });

    return {
      allCharacters,
      charByName,
      dependencies,
      closures
    };
  }

  /**
   * Allocates characters from a story to a list of player names (4–12 players)
   * using dependency-aware selection.
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

    const totalAvailableChars = (story.guiltyPool?.length || 0) + (story.innocentPool?.length || 0);
    if (playerCount > totalAvailableChars) {
      throw new Error(
        `This story supports a maximum of ${totalAvailableChars} players because it only contains ${totalAvailableChars} valid characters.`
      );
    }

    // 1. Determine target guilty count
    const targetGuiltyCount = options?.guiltyCount !== undefined
      ? options.guiltyCount
      : StoryEngine.getGuiltyCountForScenario(story);

    if (targetGuiltyCount < 1) {
      throw new Error('At least 1 guilty character is required.');
    }
    if (targetGuiltyCount > (story.guiltyPool?.length || 0)) {
      throw new Error(
        `Requested ${targetGuiltyCount} guilty characters, but story guiltyPool only contains ${story.guiltyPool?.length || 0}.`
      );
    }
    if (targetGuiltyCount >= playerCount) {
      throw new Error(
        `Guilty characters count (${targetGuiltyCount}) must be less than total players (${playerCount}).`
      );
    }

    // 2. Build dependency graph
    const graph = this.buildDependencyGraph(story);

    // 3. Find a valid combination of guilty character(s) and full roster
    const selectedRoster = this.findValidRoster(
      story,
      graph,
      playerCount,
      targetGuiltyCount,
      doShuffle,
      random
    );

    if (!selectedRoster) {
      throw new Error(
        `This story cannot safely generate a ${playerCount}-player roster without unresolved character references.`
      );
    }

    // 4. Shuffle final characters so guilty isn't always player 1
    const finalCharacters = doShuffle
      ? this.shuffleArray(selectedRoster, random)
      : selectedRoster;

    // 5. Map to Player objects
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
   * Finds a valid character roster for the requested player count and guilty count
   */
  private static findValidRoster(
    story: Story,
    graph: CharacterDependencyGraph,
    playerCount: number,
    targetGuiltyCount: number,
    doShuffle: boolean,
    random: () => number
  ): StoryCharacter[] | null {
    const guiltyPool = story.guiltyPool || [];
    const guiltyCombinations = this.getCombinations(guiltyPool, targetGuiltyCount);

    const shuffledCombinations = doShuffle
      ? this.shuffleArray(guiltyCombinations, random)
      : guiltyCombinations;

    for (const guiltyComb of shuffledCombinations) {
      const activeGuiltyNames = new Set(guiltyComb.map(c => c.name));

      // Compute combined closure of all selected guilty characters
      const initialRosterNames = new Set<string>();
      guiltyComb.forEach(g => {
        const closure = graph.closures.get(g.name);
        if (closure) {
          closure.forEach(name => initialRosterNames.add(name));
        }
      });

      // If initial guilty closure exceeds playerCount, this combination cannot fit
      if (initialRosterNames.size > playerCount) {
        continue;
      }

      // Try to expand initial roster to exactly playerCount without dangling references
      const completeRoster = this.expandRosterToPlayerCount(
        initialRosterNames,
        graph,
        playerCount,
        doShuffle,
        random
      );

      if (completeRoster) {
        // Construct final StoryCharacter objects with proper guilt assignment:
        // Exactly activeGuiltyNames get guilty: true, others get guilty: false
        return completeRoster.map(charName => {
          const originalChar = graph.charByName.get(charName)!;
          const isActuallyGuilty = activeGuiltyNames.has(charName);
          return {
            ...originalChar,
            guilty: isActuallyGuilty
          };
        });
      }
    }

    return null;
  }

  /**
   * Expands an initial set of character names up to target playerCount
   * ensuring that any added character has all its transitive dependencies included.
   */
  private static expandRosterToPlayerCount(
    currentNames: Set<string>,
    graph: CharacterDependencyGraph,
    playerCount: number,
    doShuffle: boolean,
    random: () => number
  ): string[] | null {
    if (currentNames.size === playerCount) {
      // Validate that all dependencies of current roster are within current roster
      if (this.isRosterDependencySafe(currentNames, graph)) {
        return Array.from(currentNames);
      }
      return null;
    }

    if (currentNames.size > playerCount) {
      return null;
    }

    // Collect available candidate characters not yet in currentNames
    const allNames = Array.from(graph.charByName.keys());
    const remainingNames = allNames.filter(name => !currentNames.has(name));

    // For each candidate, find what additional names would be pulled in by its closure
    const candidateClusters: { repName: string; additionalNames: string[] }[] = [];

    for (const name of remainingNames) {
      const closure = graph.closures.get(name) || new Set([name]);
      const additional = Array.from(closure).filter(n => !currentNames.has(n));

      // If adding this cluster doesn't exceed playerCount, it's a valid candidate
      if (currentNames.size + additional.length <= playerCount) {
        candidateClusters.push({
          repName: name,
          additionalNames: additional
        });
      }
    }

    if (candidateClusters.length === 0) {
      return null;
    }

    const shuffledCandidates = doShuffle
      ? this.shuffleArray(candidateClusters, random)
      : candidateClusters;

    for (const cand of shuffledCandidates) {
      const nextNames = new Set(currentNames);
      cand.additionalNames.forEach(n => nextNames.add(n));

      const result = this.expandRosterToPlayerCount(
        nextNames,
        graph,
        playerCount,
        doShuffle,
        random
      );

      if (result) {
        return result;
      }
    }

    return null;
  }

  /**
   * Verifies that for every character in the roster, all their dependencies are in the roster
   */
  public static isRosterDependencySafe(
    rosterNames: Set<string>,
    graph: CharacterDependencyGraph
  ): boolean {
    for (const name of rosterNames) {
      const deps = graph.dependencies.get(name);
      if (deps) {
        for (const dep of deps) {
          if (!rosterNames.has(dep)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Generates all k-combinations from an array
   */
  private static getCombinations<T>(array: T[], k: number): T[][] {
    if (k === 0) return [[]];
    if (k > array.length) return [];
    if (k === array.length) return [[...array]];

    const [first, ...rest] = array;
    const withFirst = this.getCombinations(rest, k - 1).map(comb => [first, ...comb]);
    const withoutFirst = this.getCombinations(rest, k);

    return [...withFirst, ...withoutFirst];
  }

  /**
   * Fisher-Yates shuffle helper
   */
  public static shuffleArray<T>(array: T[], random: () => number): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
