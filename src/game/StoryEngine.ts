import { Story, StoryValidationResult, InvestigationRound } from './types';

/**
 * StoryEngine handles validation, compatibility checks, and story data retrieval.
 */
export class StoryEngine {
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
   * If the story explicitly specifies requiredGuiltyCount, use it (clamped to guiltyPool.length).
   * Otherwise defaults to 1 (or min of pool and 1).
   * Player count NEVER automatically determines guilty count.
   */
  static getGuiltyCountForScenario(story: Story): number {
    if (story.requiredGuiltyCount !== undefined && story.requiredGuiltyCount > 0) {
      return Math.min(story.requiredGuiltyCount, story.guiltyPool.length);
    }
    // If story defines a guilty pool, use 1 by default unless requiredGuiltyCount is set
    return Math.min(1, story.guiltyPool?.length || 1);
  }

  /**
   * Gets investigation round data for a given round number
   */
  static getInvestigationRound(story: Story, roundNumber: number): InvestigationRound | null {
    if (!story.investigationRounds || story.investigationRounds.length === 0) {
      return null;
    }
    const found = story.investigationRounds.find(r => r.roundNumber === roundNumber);
    if (found) return found;
    // Fallback to cycling or last round if past end
    const index = (roundNumber - 1) % story.investigationRounds.length;
    return story.investigationRounds[index] || null;
  }

  /**
   * Unlocks clues for the given round
   */
  static getCluesForRound(story: Story, roundNumber: number): string[] {
    const revealed: string[] = [];
    // Include base clues up to round number
    if (story.clues && story.clues.length > 0) {
      const count = Math.min(roundNumber, story.clues.length);
      for (let i = 0; i < count; i++) {
        revealed.push(story.clues[i]);
      }
    }
    // Add public clue from investigation round if present
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
