import { Story, EvidenceItem, ClueState, StoryCharacter } from './types';
import { StoryEngine } from './StoryEngine';
import { CharacterAllocator } from './CharacterAllocator';

/**
 * Authoritative total clue count function:
 * TOTAL CLUES = NUMBER OF PLAYERS
 * 4 -> 4, 5 -> 5, 6 -> 6, 7 -> 7, 8 -> 8, 9 -> 9, 10 -> 10, 11 -> 11, 12 -> 12.
 * Invalid player counts (< 4, > 12, non-integers, NaN) must throw an Error.
 */
export function getTotalClueCount(playerCount: number): number {
  if (
    typeof playerCount !== 'number' ||
    !Number.isInteger(playerCount) ||
    Number.isNaN(playerCount) ||
    playerCount < 4 ||
    playerCount > 12
  ) {
    throw new Error(`Invalid player count: ${playerCount}. Must be an integer between 4 and 12.`);
  }
  return playerCount;
}

export class ClueEngine {
  /**
   * Normalizes character/suspect name for robust Arabic and English matching
   */
  public static normalizeName(name: string): string {
    if (!name) return '';
    return CharacterAllocator.normalizeArabic(name.trim().toLowerCase());
  }

  /**
   * Checks whether a clue/evidence item is eligible for the current game
   * strictly based on the ACTUAL selected killers for this match.
   */
  public static isClueEligible(
    clue: EvidenceItem,
    actualSelectedKillers: string[],
    story?: Story
  ): boolean {
    const actualNorm = new Set(actualSelectedKillers.map(k => this.normalizeName(k)));

    // 1. Required Killers: ALL required killers MUST belong to actualSelectedKillers
    if (clue.requiredKillers && clue.requiredKillers.length > 0) {
      for (const req of clue.requiredKillers) {
        if (!actualNorm.has(this.normalizeName(req))) {
          return false;
        }
      }
    }

    // 2. Excluded Killers: NONE of the excluded killers may belong to actualSelectedKillers
    if (clue.excludedKillers && clue.excludedKillers.length > 0) {
      for (const exc of clue.excludedKillers) {
        if (actualNorm.has(this.normalizeName(exc))) {
          return false;
        }
      }
    }

    // 3. Killer-specific clue linked to an associated suspect
    if (clue.isKillerSpecific && clue.associatedSuspect) {
      if (!actualNorm.has(this.normalizeName(clue.associatedSuspect))) {
        return false;
      }
    }

    // 4. If an unselected guiltyPool character is the explicit subject of a culprit-only clue
    if (story && story.guiltyPool && clue.associatedSuspect) {
      const isGuiltyPoolChar = story.guiltyPool.some(
        g => this.normalizeName(g.name) === this.normalizeName(clue.associatedSuspect!)
      );
      const isActualKiller = actualNorm.has(this.normalizeName(clue.associatedSuspect));
      
      if (isGuiltyPoolChar && !isActualKiller && clue.isKillerSpecific) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns all eligible clues for a story given the actual selected killers.
   */
  public static getEligibleClues(
    story: Story,
    actualSelectedKillers: string[],
    language: 'ar' | 'en' = 'ar'
  ): EvidenceItem[] {
    const allEvidence = StoryEngine.getStoryEvidence(story);
    const eligible = allEvidence.filter(e => this.isClueEligible(e, actualSelectedKillers, story));

    if (language === 'en') {
      return eligible.map(e => ({
        ...e,
        title: e.titleEn || e.title,
        description: e.descriptionEn || e.description,
        publicClue: e.publicClueEn || e.publicClue || e.descriptionEn || e.description,
        discussionPrompt: e.discussionPromptEn || e.discussionPrompt
      }));
    }

    return eligible;
  }

  /**
   * Builds an authoritative ClueState snapshot
   */
  public static buildClueState(
    playerCount: number,
    currentRound: number,
    revealedEvidenceIds: string[],
    revealedClues: string[],
    clueRevealedThisRound: boolean
  ): ClueState {
    const totalClues = getTotalClueCount(playerCount);
    const remainingClues = Math.max(0, totalClues - revealedEvidenceIds.length);

    return {
      playerCount,
      totalClues,
      revealedClues,
      remainingClues,
      currentRound,
      clueRevealedThisRound,
      revealedClueIds: revealedEvidenceIds
    };
  }

  /**
   * Validates whether a story has sufficient eligible clues for all possible player counts (4..12)
   * and killer combinations.
   */
  public static validateStoryClueEconomy(story: Story): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const guiltyPool = story.guiltyPool || [];
    if (guiltyPool.length === 0) {
      return { valid: false, errors: ['Story has no guilty pool to validate clues.'] };
    }

    // 1-killer combinations (4, 5, 6 player counts -> require up to 6 clues)
    for (const g of guiltyPool) {
      const eligible = this.getEligibleClues(story, [g.name]);
      if (eligible.length < 6) {
        errors.push(
          `Story "${story.id}" / actual killer [${g.name}] has only ${eligible.length} valid clues but requires at least 6.`
        );
      }
    }

    // 2-killer combinations (7, 8, 9 player counts -> require up to 9 clues)
    if (guiltyPool.length >= 2) {
      for (let i = 0; i < guiltyPool.length; i++) {
        for (let j = i + 1; j < guiltyPool.length; j++) {
          const killers = [guiltyPool[i].name, guiltyPool[j].name];
          const eligible = this.getEligibleClues(story, killers);
          if (eligible.length < 9) {
            errors.push(
              `Story "${story.id}" / actual killers [${killers.join(', ')}] has only ${eligible.length} valid clues but requires at least 9.`
            );
          }
        }
      }
    }

    // 3-killer combinations (10, 11, 12 player counts -> require up to 12 clues)
    if (guiltyPool.length >= 3) {
      const killers = guiltyPool.slice(0, 3).map(g => g.name);
      const eligible = this.getEligibleClues(story, killers);
      if (eligible.length < 12) {
        errors.push(
          `Story "${story.id}" / actual killers [${killers.join(', ')}] has only ${eligible.length} valid clues but requires at least 12.`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
