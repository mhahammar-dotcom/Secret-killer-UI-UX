import { Story, StoryValidationResult, InvestigationRound, EvidenceItem, EvidenceType } from './types';
import { getKillerCount } from './PlayerManager';

export const DEFAULT_MAX_WRONG_VOTES = 3;

/**
 * StoryEngine handles validation, compatibility checks, and story data retrieval.
 */
export class StoryEngine {
  /**
   * Authoritative killer count resolver based on player count
   */
  static getKillerCount(playerCount: number): number {
    return getKillerCount(playerCount);
  }

  /**
   * Resolves and validates maxWrongVotes from story configuration with fallback to default (3).
   * Validates that maxWrongVotes is a sensible positive integer (> 0).
   * If missing, non-numeric, NaN, <= 0, or non-integer, falls back to 3.
   */
  static getMaxWrongVotes(story?: Partial<Story> | null): number {
    if (!story) return DEFAULT_MAX_WRONG_VOTES;

    const rawValue = story.gameRules?.maxWrongVotes ?? story.maxWrongVotes;

    if (
      typeof rawValue === 'number' &&
      !Number.isNaN(rawValue) &&
      Number.isInteger(rawValue) &&
      rawValue > 0
    ) {
      return rawValue;
    }

    return DEFAULT_MAX_WRONG_VOTES;
  }

  /**
   * Validates a Story entity against game design constraints
   */
  static validateStory(story: Story): StoryValidationResult {
    const errors: string[] = [];

    if (!story.id || story.id.trim() === '') {
      errors.push('Story ID is required.');
    }
    if (!story.title || story.title.trim() === '') {
      errors.push('Story title is required.');
    }
    if (!story.description || story.description.trim() === '') {
      errors.push('Story description is required.');
    }
    // Validate solution / explanation
    const hasSolution = Boolean(story.solution?.trim() || story.introduction?.incident?.trim());
    if (!hasSolution) {
      errors.push('Story solution / crime explanation is required.');
    }

    // Player bounds validation
    if (story.minPlayers < 4) {
      errors.push(`Minimum player count cannot be less than 4 (received ${story.minPlayers}).`);
    }
    if (story.maxPlayers > 12) {
      errors.push(`Maximum player count cannot exceed 12 (received ${story.maxPlayers}).`);
    }
    if (story.minPlayers > story.maxPlayers) {
      errors.push(`minPlayers (${story.minPlayers}) cannot be greater than maxPlayers (${story.maxPlayers}).`);
    }

    // Introduction validation
    if (!story.introduction) {
      errors.push('Story introduction is required.');
    } else {
      if (!story.introduction.setting || story.introduction.setting.trim() === '') {
        errors.push('Introduction setting is required.');
      }
      if (!story.introduction.situation || story.introduction.situation.trim() === '') {
        errors.push('Introduction situation is required.');
      }
      if (!story.introduction.incident || story.introduction.incident.trim() === '') {
        errors.push('Introduction incident is required.');
      }
      if (!story.introduction.stakes || story.introduction.stakes.trim() === '') {
        errors.push('Introduction stakes is required.');
      }
    }

    // Character pools validation
    if (!story.guiltyPool || story.guiltyPool.length === 0) {
      errors.push('Story must have at least one guilty character in guiltyPool.');
    }
    if (!story.innocentPool || story.innocentPool.length === 0) {
      errors.push('Story must have innocent characters in innocentPool.');
    }

    const totalCharacters = (story.guiltyPool?.length || 0) + (story.innocentPool?.length || 0);
    if (totalCharacters < story.minPlayers) {
      errors.push(`Total available characters (${totalCharacters}) is less than minPlayers (${story.minPlayers}).`);
    }
    if (story.maxPlayers > totalCharacters) {
      errors.push(`Story maxPlayers (${story.maxPlayers}) exceeds total unique characters in pool (${totalCharacters}).`);
    }

    const effectiveMax = typeof story.maxPlayers === 'number' && story.maxPlayers >= 4 && story.maxPlayers <= 12
      ? story.maxPlayers
      : (typeof story.maxPlayers === 'number' && story.maxPlayers > 12 ? 12 : 4);
    const maxKillersNeeded = getKillerCount(effectiveMax);
    if ((story.guiltyPool?.length || 0) < maxKillersNeeded) {
      errors.push(
        `Story supports up to ${story.maxPlayers || 12} players which requires ${maxKillersNeeded} killers, but guiltyPool only has ${story.guiltyPool?.length || 0} characters.`
      );
    }

    // Validate guilty count configuration
    if (story.requiredGuiltyCount !== undefined) {
      if (story.requiredGuiltyCount < 1) {
        errors.push('Story requiredGuiltyCount must be at least 1.');
      }
      if (story.requiredGuiltyCount > (story.guiltyPool?.length || 0)) {
        errors.push(`Story requires ${story.requiredGuiltyCount} guilty characters, but only ${story.guiltyPool?.length || 0} are in guiltyPool.`);
      }
      if (story.requiredGuiltyCount >= (story.minPlayers || 4)) {
        errors.push(`Guilty count (${story.requiredGuiltyCount}) must be less than minPlayers (${story.minPlayers}).`);
      }
    }

    // Validate character uniqueness across all pools
    const seenNames = new Set<string>();
    const allCharacters = [...(story.guiltyPool || []), ...(story.innocentPool || [])];
    for (const char of allCharacters) {
      if (!char.name || char.name.trim() === '') {
        errors.push('All characters must have a valid name.');
        continue;
      }
      const normalizedName = char.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        errors.push(`Duplicate character name found: "${char.name}". Every character must be unique.`);
      }
      seenNames.add(normalizedName);

      if (!char.profession || char.profession.trim() === '') {
        errors.push(`Character "${char.name}" must have a legitimate profession/role.`);
      }
      const lowerProf = (char.profession || '').toLowerCase().trim();
      const lowerName = (char.name || '').toLowerCase().trim();
      if (
        lowerProf === 'killer' ||
        lowerProf === 'murderer' ||
        lowerProf === 'thief' ||
        lowerProf === 'القاتل' ||
        lowerProf === 'المجرم' ||
        lowerProf === 'السارق' ||
        lowerName === 'killer' ||
        lowerName === 'القاتل'
      ) {
        errors.push(
          `Character "${char.name}" has an invalid role name "${char.profession}". Characters must have legitimate in-universe roles; guilt is an internal state.`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Checks whether the given player count is supported by the story
   */
  static isPlayerCountSupported(story: Story, count: number): boolean {
    if (count < 4 || count > 12) return false;
    const min = story.minPlayers || 4;
    const max = story.maxPlayers || 12;
    return count >= min && count <= max;
  }

  /**
   * Determines the configured guilty count for a scenario.
   */
  static getGuiltyCountForScenario(story: Story, playerCount?: number): number {
    if (story.requiredGuiltyCount !== undefined && story.requiredGuiltyCount > 0) {
      return Math.min(story.requiredGuiltyCount, story.guiltyPool.length);
    }
    if (playerCount !== undefined) {
      return getKillerCount(playerCount);
    }
    return Math.min(1, story.guiltyPool?.length || 1);
  }

  /**
   * Gets investigation round data for a given round number without cycling.
   * If roundNumber exceeds available rounds, returns null (never loops or fabricates).
   */
  static getInvestigationRound(story: Story, roundNumber: number): InvestigationRound | null {
    if (!story.investigationRounds || story.investigationRounds.length === 0) {
      return null;
    }
    const found = story.investigationRounds.find(r => r.roundNumber === roundNumber);
    return found || null;
  }

  /**
   * Determines evidence category based on title and content keywords
   */
  static categorizeEvidence(title: string, content: string): EvidenceType {
    const text = `${title} ${content}`.toLowerCase();
    if (/تناقض|تضارب|اختلاف|فارق|مريب|تناقضت|كذب/.test(text)) return 'contradiction';
    if (/توقيت|ساعة|دقيقة|جدول|زمن|تزامن|تأخير|لحظة|منتصف الليل/.test(text)) return 'timeline';
    if (/سجل|مستند|وثيقة|تقرير|ملف|عقد|ورق|فاتورة/.test(text)) return 'document';
    if (/شاهد|رأى|سمع|إفادة|شهادة|حارس|خادم/.test(text)) return 'witness';
    if (/ممر|غرفة|قاعة|موقع|نافذة|باب|دفيئة|خيمة|مقصورة|خزنة/.test(text)) return 'location';
    if (/علاقة|صلة|قرابة|صداقة|معرفة|سر/.test(text)) return 'relationship';
    if (/دافع|مصلحة|تأمين|مكسب|مال|انتقام/.test(text)) return 'motive';
    return 'physical';
  }

  /**
   * Returns all normalized EvidenceItem objects for a story
   */
  static getStoryEvidence(story: Story): EvidenceItem[] {
    if (story.evidence && story.evidence.length > 0) {
      return story.evidence;
    }

    const items: EvidenceItem[] = [];

    // Compatibility layer: Map legacy investigation rounds to EvidenceItems without hardcoding gameplay behavior
    if (story.investigationRounds && story.investigationRounds.length > 0) {
      story.investigationRounds.forEach((round) => {
        items.push({
          id: `ev_round_${round.roundNumber}`,
          title: round.title || `أثر تحقيقي #${round.roundNumber}`,
          description: round.description || round.publicClue,
          publicClue: round.publicClue,
          discussionPrompt: round.discussionPrompt,
          category: this.categorizeEvidence(round.title || '', `${round.publicClue} ${round.description}`),
          availableFromRound: round.roundNumber,
          isInitialPublic: false
        });
      });
    }

    // Compatibility layer: Include additional base clues from legacy story.clues as investigation items
    if (story.clues && story.clues.length > 0) {
      story.clues.forEach((clue, idx) => {
        const alreadyCovered = items.some(item => item.publicClue === clue || item.description === clue);
        if (!alreadyCovered) {
          items.push({
            id: `ev_clue_${idx + 1}`,
            title: `ملاحظة جنائية #${idx + 1}`,
            description: clue,
            publicClue: clue,
            category: this.categorizeEvidence(`ملاحظة ${idx + 1}`, clue),
            availableFromRound: idx + 1,
            isInitialPublic: false
          });
        }
      });
    }

    return items;
  }

  /**
   * Returns explicit opening public clues, separate from unrevealed investigation evidence.
   */
  static getInitialPublicClues(story: Story): string[] {
    const publicClues: string[] = [];
    
    // Only items explicitly marked isInitialPublic are returned at game start
    const allEvidence = this.getStoryEvidence(story);
    allEvidence.forEach(e => {
      if (e.isInitialPublic && e.publicClue) {
        publicClues.push(e.publicClue);
      }
    });

    return publicClues;
  }

  /**
   * Unlocks clues for the given round without repeating or cycling
   */
  static getCluesForRound(story: Story, roundNumber: number): string[] {
    const revealed: string[] = [];
    if (story.clues && story.clues.length > 0) {
      const count = Math.min(roundNumber, story.clues.length);
      for (let i = 0; i < count; i++) {
        revealed.push(story.clues[i]);
      }
    }
    const roundData = this.getInvestigationRound(story, roundNumber);
    if (roundData && roundData.publicClue && !revealed.includes(roundData.publicClue)) {
      revealed.push(roundData.publicClue);
    }
    return revealed;
  }

  /**
   * Returns a progressive hint for wrong votes
   */
  static getWrongVoteHint(story: Story, wrongVoteIndex: number): string | null {
    if (!story.wrongVoteHints || story.wrongVoteHints.length === 0) {
      return null;
    }
    if (wrongVoteIndex < 0 || wrongVoteIndex >= story.wrongVoteHints.length) {
      return null;
    }
    return story.wrongVoteHints[wrongVoteIndex];
  }
}
