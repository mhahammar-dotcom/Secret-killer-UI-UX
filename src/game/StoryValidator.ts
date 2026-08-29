import {
  Story,
  StoryCharacter,
  EvidenceItem,
  EvidenceStrength,
  EvidenceType,
  SuspectProfile,
  EvidenceClassification,
  StoryValidationResult,
  StoryAuditReport,
  StoryValidationIssue
} from './types';
import { StoryEngine, DEFAULT_MAX_WRONG_VOTES } from './StoryEngine';
import { CharacterAllocator } from './CharacterAllocator';
import { getKillerCount } from './PlayerManager';

/**
 * StoryValidator enforces story quality, structural integrity, fairness, and balance.
 * Distinguishes between fatal ERRORS (preventing execution) and WARNINGS (quality/balance notes).
 */
export class StoryValidator {
  /**
   * Validates a story and returns structured issues, errors, warnings, and audit report.
   */
  static validateStory(story: Story): StoryValidationResult {
    const report = this.auditStory(story);
    return {
      valid: report.isValid,
      errors: report.errors,
      warnings: report.warnings,
      report
    };
  }

  /**
   * Generates a comprehensive audit report for a single story.
   */
  static auditStory(story: Story): StoryAuditReport {
    const issues: StoryValidationIssue[] = [];

    // --- 1. Structural & Player Count Validation ---
    this.validateBasicStructure(story, issues);
    this.validatePlayerCounts(story, issues);
    this.validateIntroductionAndSolution(story, issues);
    this.validateCharacters(story, issues);
    this.validateGameRules(story, issues);
    this.validateRosterCompatibility(story, issues);

    // --- 2. Evidence & Legacy Mechanics Auditing ---
    const legacyIssues = this.detectLegacyMechanics(story);
    legacyIssues.forEach(msg => {
      issues.push({
        severity: 'WARNING',
        code: 'LEGACY_MECHANIC_DETECTED',
        message: msg
      });
    });

    const allEvidence = StoryEngine.getStoryEvidence(story);
    this.validateEvidenceStructure(allEvidence, story, issues);

    // --- 3. Evidence Balance Classification ---
    const evidenceClassifications = allEvidence.map(ev => this.classifyEvidence(ev, story));
    const evidenceBalance = {
      DIRECT: evidenceClassifications.filter(e => e.strength === 'DIRECT').length,
      STRONG: evidenceClassifications.filter(e => e.strength === 'STRONG').length,
      MODERATE: evidenceClassifications.filter(e => e.strength === 'MODERATE').length,
      WEAK: evidenceClassifications.filter(e => e.strength === 'WEAK').length,
      CONTEXTUAL: evidenceClassifications.filter(e => e.strength === 'CONTEXTUAL').length
    };

    // Check for excessive direct evidence
    if (evidenceBalance.DIRECT > 0) {
      issues.push({
        severity: 'WARNING',
        code: 'DIRECT_KILLER_EVIDENCE',
        message: `Story contains ${evidenceBalance.DIRECT} piece(s) of DIRECT evidence. Direct evidence eliminates player deduction.`
      });
    }

    // Check for insufficient evidence
    if (allEvidence.length === 0) {
      issues.push({
        severity: 'WARNING',
        code: 'NO_EVIDENCE_DEFINED',
        message: 'No investigation evidence defined. While playable as a social deduction game, evidence enriches the mystery.'
      });
    } else if (allEvidence.length === 1) {
      issues.push({
        severity: 'WARNING',
        code: 'INSUFFICIENT_EVIDENCE',
        message: 'Story has only 1 piece of evidence. Recommend at least 3-4 pieces of evidence for a 4-12 player game.'
      });
    }

    // --- 4. Suspect Diversity & Suspicion Balance ---
    const suspects = this.detectSuspects(story, allEvidence);
    const plausibleSuspects = suspects.filter(s => s.suspicionScore > 0);
    if (plausibleSuspects.length < 2 && (story.guiltyPool?.length || 0) + (story.innocentPool?.length || 0) >= 4) {
      issues.push({
        severity: 'WARNING',
        code: 'SINGLE_PLAUSIBLE_SUSPECT',
        message: 'Only one plausible suspect identified. High quality mysteries must contain multiple plausible suspects.'
      });
    }

    // Check evidence concentration
    if (allEvidence.length >= 3 && plausibleSuspects.length > 0) {
      const topSuspect = suspects[0];
      const totalImplications = suspects.reduce((acc, s) => acc + s.suspicionScore, 0);
      if (totalImplications > 0 && topSuspect.suspicionScore / totalImplications > 0.7) {
        issues.push({
          severity: 'WARNING',
          code: 'EVIDENCE_HEAVILY_CONCENTRATED',
          message: `Evidence is heavily concentrated on suspect "${topSuspect.name}" (${Math.round((topSuspect.suspicionScore / totalImplications) * 100)}% of suspicion).`
        });
      }
    }

    // --- 5. Motives, Relationships, and Alibis ---
    this.auditNarrativeDepth(story, issues);

    // --- 6. Timeline Consistency ---
    const timelineIssues = this.detectTimelineInconsistencies(story, allEvidence);
    timelineIssues.forEach(tIssue => {
      issues.push({
        severity: 'WARNING',
        code: 'TIMELINE_INCONSISTENCY',
        message: tIssue
      });
    });

    // Compile report
    const errors = issues.filter(i => i.severity === 'ERROR').map(i => i.message);
    const warnings = issues.filter(i => i.severity === 'WARNING').map(i => i.message);
    const allCharacters = [...(story.guiltyPool || []), ...(story.innocentPool || [])];

    const hasLegacySecrets = legacyIssues.some(msg => /secret|objective|mission/i.test(msg));
    const hasLegacyRounds = legacyIssues.some(msg => /investigation round|investigationRounds/i.test(msg)) || Boolean(story.investigationRounds?.length);
    const hasDirectKillerEvidence = evidenceBalance.DIRECT > 0;

    return {
      storyId: story.id || 'unknown',
      storyTitle: story.title || 'Untitled Story',
      minPlayers: story.minPlayers || 4,
      maxPlayers: story.maxPlayers || 12,
      guiltyCount: story.guiltyPool?.length || 0,
      characterCount: allCharacters.length,
      evidenceCount: allEvidence.length,
      suspects,
      evidenceBalance,
      evidenceClassifications,
      warnings,
      errors,
      isValid: errors.length === 0,
      hasLegacySecrets,
      hasLegacyRounds,
      hasDirectKillerEvidence,
      timelineIssues
    };
  }

  /**
   * Audits all stories in an array and returns an array of reports.
   */
  static auditAllStories(stories: Story[]): StoryAuditReport[] {
    return stories.map(story => this.auditStory(story));
  }

  // =========================================================================
  // STRUCTURAL & ERROR VALIDATION HELPERS
  // =========================================================================

  private static validateBasicStructure(story: Story, issues: StoryValidationIssue[]): void {
    if (!story.id || story.id.trim() === '') {
      issues.push({ severity: 'ERROR', code: 'MISSING_ID', message: 'Story ID is required.', field: 'id' });
    }
    if (!story.title || story.title.trim() === '') {
      issues.push({ severity: 'ERROR', code: 'MISSING_TITLE', message: 'Story title is required.', field: 'title' });
    }
    if (!story.description || story.description.trim() === '') {
      issues.push({ severity: 'ERROR', code: 'MISSING_DESCRIPTION', message: 'Story description is required.', field: 'description' });
    }
  }

  private static validatePlayerCounts(story: Story, issues: StoryValidationIssue[]): void {
    const min = story.minPlayers;
    const max = story.maxPlayers;

    if (min === undefined || min < 4) {
      issues.push({
        severity: 'ERROR',
        code: 'INVALID_MIN_PLAYERS',
        message: `Minimum player count cannot be less than 4 (received ${min}).`,
        field: 'minPlayers'
      });
    }

    if (max === undefined || max > 12) {
      issues.push({
        severity: 'ERROR',
        code: 'INVALID_MAX_PLAYERS',
        message: `Maximum player count cannot exceed 12 (received ${max}).`,
        field: 'maxPlayers'
      });
    }

    if (min !== undefined && max !== undefined && min > max) {
      issues.push({
        severity: 'ERROR',
        code: 'MIN_EXCEEDS_MAX_PLAYERS',
        message: `minPlayers (${min}) cannot be greater than maxPlayers (${max}).`,
        field: 'minPlayers'
      });
    }
  }

  private static validateIntroductionAndSolution(story: Story, issues: StoryValidationIssue[]): void {
    if (!story.introduction) {
      issues.push({
        severity: 'ERROR',
        code: 'MISSING_INTRODUCTION',
        message: 'Story introduction is required.',
        field: 'introduction'
      });
    } else {
      if (!story.introduction.setting || story.introduction.setting.trim() === '') {
        issues.push({ severity: 'ERROR', code: 'MISSING_INTRO_SETTING', message: 'Introduction setting is required.', field: 'introduction.setting' });
      }
      if (!story.introduction.situation || story.introduction.situation.trim() === '') {
        issues.push({ severity: 'ERROR', code: 'MISSING_INTRO_SITUATION', message: 'Introduction situation is required.', field: 'introduction.situation' });
      }
      if (!story.introduction.incident || story.introduction.incident.trim() === '') {
        issues.push({ severity: 'ERROR', code: 'MISSING_INTRO_INCIDENT', message: 'Introduction incident is required.', field: 'introduction.incident' });
      }
      if (!story.introduction.stakes || story.introduction.stakes.trim() === '') {
        issues.push({ severity: 'ERROR', code: 'MISSING_INTRO_STAKES', message: 'Introduction stakes is required.', field: 'introduction.stakes' });
      }
    }

    const hasSolution = Boolean(story.solution && story.solution.trim().length > 0);
    if (!hasSolution) {
      issues.push({
        severity: 'ERROR',
        code: 'MISSING_SOLUTION',
        message: 'Story solution / crime explanation is required.',
        field: 'solution'
      });
    }
  }

  private static validateCharacters(story: Story, issues: StoryValidationIssue[]): void {
    const guiltyPool = story.guiltyPool || [];
    const innocentPool = story.innocentPool || [];
    const allCharacters = [...guiltyPool, ...innocentPool];

    if (guiltyPool.length === 0) {
      issues.push({
        severity: 'ERROR',
        code: 'NO_GUILTY_PLAYERS',
        message: 'Story must have at least one guilty character in guiltyPool.',
        field: 'guiltyPool'
      });
    }

    if (innocentPool.length === 0) {
      issues.push({
        severity: 'ERROR',
        code: 'NO_INNOCENT_PLAYERS',
        message: 'Story must have innocent characters in innocentPool.',
        field: 'innocentPool'
      });
    }

    if (allCharacters.length < (story.minPlayers || 4)) {
      issues.push({
        severity: 'ERROR',
        code: 'FEWER_THAN_MIN_CHARACTERS',
        message: `Total available characters (${allCharacters.length}) is less than minPlayers (${story.minPlayers || 4}).`,
        field: 'characters'
      });
    }

    if (allCharacters.length < 4) {
      issues.push({
        severity: 'ERROR',
        code: 'FEWER_THAN_4_CHARACTERS',
        message: `Story must have at least 4 unique characters (found ${allCharacters.length}).`,
        field: 'characters'
      });
    }

    if ((story.maxPlayers || 12) > allCharacters.length) {
      issues.push({
        severity: 'ERROR',
        code: 'MAX_PLAYERS_EXCEEDS_POOL',
        message: `Story maxPlayers (${story.maxPlayers}) exceeds total unique characters in pool (${allCharacters.length}).`,
        field: 'maxPlayers'
      });
    }

    // Validate duplicate character names / IDs
    const seenNames = new Set<string>();
    allCharacters.forEach(char => {
      if (!char.name || char.name.trim() === '') {
        issues.push({
          severity: 'ERROR',
          code: 'MISSING_CHARACTER_NAME',
          message: 'All characters must have a valid name.',
          field: 'character.name'
        });
        return;
      }

      const normalized = char.name.trim().toLowerCase();
      if (seenNames.has(normalized)) {
        issues.push({
          severity: 'ERROR',
          code: 'DUPLICATE_CHARACTER_NAME',
          message: `Duplicate character name found: "${char.name}". Every character must be unique.`,
          characterName: char.name
        });
      }
      seenNames.add(normalized);

      if (!char.profession || char.profession.trim() === '') {
        issues.push({
          severity: 'ERROR',
          code: 'MISSING_CHARACTER_PROFESSION',
          message: `Character "${char.name}" must have a legitimate profession/role.`,
          characterName: char.name
        });
      }

      const lowerProf = (char.profession || '').toLowerCase().trim();
      const lowerName = (char.name || '').toLowerCase().trim();
      const bannedRoles = ['killer', 'murderer', 'thief', 'القاتل', 'المجرم', 'السارق'];
      if (bannedRoles.includes(lowerProf) || bannedRoles.includes(lowerName)) {
        issues.push({
          severity: 'ERROR',
          code: 'GUILT_EXPOSED_AS_ROLE',
          message: `Character "${char.name}" has an invalid role name "${char.profession}". Guilt must remain an internal state.`,
          characterName: char.name
        });
      }
    });

    // Validate that guiltyPool has enough characters for maxPlayers killer scaling
    const effectiveMax = typeof story.maxPlayers === 'number' && story.maxPlayers >= 4 && story.maxPlayers <= 12
      ? story.maxPlayers
      : (typeof story.maxPlayers === 'number' && story.maxPlayers > 12 ? 12 : 4);
    const maxKillersNeeded = getKillerCount(effectiveMax);
    if (guiltyPool.length < maxKillersNeeded) {
      issues.push({
        severity: 'ERROR',
        code: 'INSUFFICIENT_GUILTY_POOL',
        message: `Story supports up to ${story.maxPlayers || 12} players which requires ${maxKillersNeeded} killers, but guiltyPool only has ${guiltyPool.length} characters.`,
        field: 'guiltyPool'
      });
    }

    // Validate guilty count configuration
    if (story.requiredGuiltyCount !== undefined) {
      if (story.requiredGuiltyCount < 1) {
        issues.push({
          severity: 'ERROR',
          code: 'INVALID_REQUIRED_GUILTY_COUNT',
          message: 'Story requiredGuiltyCount must be at least 1.',
          field: 'requiredGuiltyCount'
        });
      }
      if (story.requiredGuiltyCount > guiltyPool.length) {
        issues.push({
          severity: 'ERROR',
          code: 'REQUIRED_GUILTY_EXCEEDS_POOL',
          message: `Story requires ${story.requiredGuiltyCount} guilty characters, but only ${guiltyPool.length} are in guiltyPool.`,
          field: 'requiredGuiltyCount'
        });
      }
      if (story.requiredGuiltyCount >= (story.minPlayers || 4)) {
        issues.push({
          severity: 'ERROR',
          code: 'GUILTY_COUNT_EXCEEDS_PLAYERS',
          message: `Guilty count (${story.requiredGuiltyCount}) must be less than minPlayers (${story.minPlayers}).`,
          field: 'requiredGuiltyCount'
        });
      }
    }
  }

  private static validateGameRules(story: Story, issues: StoryValidationIssue[]): void {
    const rawVal = story.gameRules?.maxWrongVotes ?? story.maxWrongVotes;
    if (rawVal !== undefined) {
      if (
        typeof rawVal !== 'number' ||
        Number.isNaN(rawVal) ||
        !Number.isInteger(rawVal) ||
        rawVal <= 0
      ) {
        issues.push({
          severity: 'WARNING',
          code: 'INVALID_MAX_WRONG_VOTES_CONFIG',
          message: `Configured maxWrongVotes (${rawVal}) is invalid. Fallback value of ${DEFAULT_MAX_WRONG_VOTES} will be used.`,
          field: 'gameRules.maxWrongVotes'
        });
      }
    }
  }

  private static validateRosterCompatibility(story: Story, issues: StoryValidationIssue[]): void {
    if (!story.guiltyPool || story.guiltyPool.length === 0) return;
    if (!story.innocentPool || story.innocentPool.length === 0) return;

    const min = story.minPlayers || 4;
    const max = story.maxPlayers || 12;
    if (min > max || min < 4 || max > 12) return;

    const totalChars = story.guiltyPool.length + story.innocentPool.length;
    if (totalChars < min) return;

    for (let count = min; count <= max; count++) {
      if (count > totalChars) {
        issues.push({
          severity: 'ERROR',
          code: 'INSUFFICIENT_CHARACTERS_FOR_ROSTER',
          message: `Story cannot generate ${count}-player roster: total available characters (${totalChars}) is less than ${count}.`,
          field: 'characters'
        });
        continue;
      }

      const dummyNames = Array.from({ length: count }, (_, i) => `Player ${i + 1}`);
      try {
        const roster = CharacterAllocator.allocateCharacters(story, dummyNames, {
          shuffle: false,
          randomFn: () => 0
        });

        if (!roster || roster.length !== count) {
          issues.push({
            severity: 'ERROR',
            code: 'UNSUPPORTED_PLAYER_COUNT_ROSTER',
            message: `Story cannot safely generate ${count}-player roster without unresolved character references.`,
            field: 'characters'
          });
        }
      } catch (err: any) {
        issues.push({
          severity: 'ERROR',
          code: 'UNSUPPORTED_PLAYER_COUNT_ROSTER',
          message: `Story cannot safely generate ${count}-player roster: ${err.message}`,
          field: 'characters'
        });
      }
    }
  }

  private static validateEvidenceStructure(
    evidence: EvidenceItem[],
    story: Story,
    issues: StoryValidationIssue[]
  ): void {
    const allCharacterNames = new Set(
      [...(story.guiltyPool || []), ...(story.innocentPool || [])].map(c => c.name.trim())
    );

    evidence.forEach(ev => {
      if (!ev.id || ev.id.trim() === '') {
        issues.push({
          severity: 'ERROR',
          code: 'INVALID_EVIDENCE_ID',
          message: 'Evidence item must have a valid non-empty ID.',
          evidenceId: ev.id
        });
      }
      if (!ev.title || ev.title.trim() === '') {
        issues.push({
          severity: 'ERROR',
          code: 'INVALID_EVIDENCE_TITLE',
          message: `Evidence item "${ev.id}" must have a valid title.`,
          evidenceId: ev.id
        });
      }

      // Check relatedCharacters references
      if (ev.relatedCharacters && ev.relatedCharacters.length > 0) {
        ev.relatedCharacters.forEach(name => {
          if (!allCharacterNames.has(name.trim())) {
            issues.push({
              severity: 'ERROR',
              code: 'INVALID_EVIDENCE_CHARACTER_REFERENCE',
              message: `Evidence "${ev.id}" references unknown character "${name}".`,
              evidenceId: ev.id,
              characterName: name
            });
          }
        });
      }
    });
  }

  // =========================================================================
  // LEGACY MECHANICS DETECTION (Secrets, Objectives, Missions, Rounds)
  // =========================================================================

  /**
   * Scans story object for legacy mechanics fields (secret, objective, mission, etc.).
   */
  static detectLegacyMechanics(story: any): string[] {
    const legacyWarnings: string[] = [];
    if (!story) return legacyWarnings;

    // Check top-level story fields
    const legacyStoryKeys = [
      'secret', 'secrets', 'privateSecret', 'hiddenSecret',
      'mission', 'missions', 'killerObjective', 'playerObjective',
      'objectives'
    ];

    legacyStoryKeys.forEach(k => {
      if (story[k] !== undefined) {
        legacyWarnings.push(`Legacy story property "${k}" detected. The redesigned game engine does not use ${k}.`);
      }
    });

    if (story.investigationRounds && story.investigationRounds.length > 0) {
      legacyWarnings.push(
        `Legacy "investigationRounds" property detected (${story.investigationRounds.length} rounds). Modern stories should define explicit "evidence" items.`
      );
    }

    if (story.clues && story.clues.length > 0 && !story.evidence) {
      legacyWarnings.push(
        `Legacy "clues" array detected (${story.clues.length} clues). Modern stories should use structured EvidenceItem records.`
      );
    }

    // Check all characters in pools
    const pools = [story.guiltyPool, story.innocentPool, story.fixedCharacters, story.characters];
    pools.forEach(pool => {
      if (Array.isArray(pool)) {
        pool.forEach((char: any) => {
          if (!char) return;
          const legacyCharKeys = [
            'secret', 'privateSecret', 'hiddenSecret', 'objective', 'objectives',
            'mission', 'missions', 'killerObjective', 'playerObjective'
          ];
          legacyCharKeys.forEach(k => {
            if (char[k] !== undefined) {
              legacyWarnings.push(
                `Legacy property "${k}" detected on character "${char.name || 'unnamed'}". Secrets/objectives have been removed from the game design.`
              );
            }
          });
        });
      }
    });

    return legacyWarnings;
  }

  // =========================================================================
  // EVIDENCE CLASSIFICATION
  // =========================================================================

  /**
   * Classifies an evidence item's strength: DIRECT, STRONG, MODERATE, WEAK, CONTEXTUAL.
   */
  static classifyEvidence(ev: EvidenceItem, story: Story): EvidenceClassification {
    const text = `${ev.title} ${ev.description} ${ev.publicClue || ''} ${ev.discussionPrompt || ''}`.toLowerCase();
    const allCharacters = [...(story.guiltyPool || []), ...(story.innocentPool || [])];

    // Find characters mentioned in evidence text
    const implicatedCharacters: string[] = [];
    allCharacters.forEach(char => {
      if (text.includes(char.name.toLowerCase())) {
        implicatedCharacters.push(char.name);
      }
    });

    // 1. Check for DIRECT evidence (explicitly exposes crime/killer with certainty)
    const directPatterns = [
      /هو القاتل|هي القاتلة|هو الفاعل|هي الفاعلة/,
      /تم التقاطه بالجرم المشهود|الكاميرا تكشف بوضوح قيام|الفيديو يثبت قيام/,
      /البصمة تثبت إدانة|اعتراف صريح|شاهد عيان رآه يرتكب الجريمة مباشرة/,
      /proves? .* killed|camera shows .* committing/
    ];
    for (const pattern of directPatterns) {
      if (pattern.test(text)) {
        return {
          id: ev.id,
          title: ev.title,
          strength: 'DIRECT',
          category: ev.category,
          reason: 'Directly implicates or explicitly names the culprit, removing deduction ambiguity.',
          implicatedCharacters
        };
      }
    }

    // 2. Check for STRONG evidence (exclusive access, physical possession, exact time seen leaving scene)
    const strongPatterns = [
      /بطاقة دخول حصرية|رمز دخول خاص|بصمة على سلاح|سم في خزانة|مادة سامة في حقيبة/,
      /شوهد يخرج مسرعاً من غرفة الحادث في لحظة|ألياف مطابقة من ثياب/,
      /exclusive access|dna on weapon|poison found in/
    ];
    for (const pattern of strongPatterns) {
      if (pattern.test(text)) {
        return {
          id: ev.id,
          title: ev.title,
          strength: 'STRONG',
          category: ev.category,
          reason: 'Strongly narrows the investigation to specific suspects with high physical/timeline specificity.',
          implicatedCharacters
        };
      }
    }

    // 3. Check for MODERATE evidence (motive conflict, contradictory statement, partial alibi mismatch)
    const moderatePatterns = [
      /تناقض|تضارب|خلاف مالي|مشادة كلامية|وثيقة محذوفة|تعديل في السجل|رسالة تهديد|انقطاع في الكاميرات|بصمة جزئية/,
      /financial conflict|heated argument|discrepancy|partial fingerprint/
    ];
    for (const pattern of moderatePatterns) {
      if (pattern.test(text)) {
        return {
          id: ev.id,
          title: ev.title,
          strength: 'MODERATE',
          category: ev.category,
          reason: 'Provides a solid investigative lead requiring deduction and comparison against suspect alibis.',
          implicatedCharacters
        };
      }
    }

    // 4. Check for CONTEXTUAL evidence (room layout, environmental conditions, weather, general facts)
    const contextualPatterns = [
      /مخطط|خريطة|حالة الطقس|درجة الحرارة|جدول المواعيد العام|تاريخ المنشأة|قائمة الحضور/,
      /layout|weather|schedule|room diagram/
    ];
    for (const pattern of contextualPatterns) {
      if (pattern.test(text)) {
        return {
          id: ev.id,
          title: ev.title,
          strength: 'CONTEXTUAL',
          category: ev.category,
          reason: 'Provides background layout, environment, or timing context without directly incriminating any individual.',
          implicatedCharacters
        };
      }
    }

    // 5. Default to WEAK (broad observations, ambient sounds, open gates)
    return {
      id: ev.id,
      title: ev.title,
      strength: 'WEAK',
      category: ev.category,
      reason: 'General observation or subtle clue compatible with multiple interpretations.',
      implicatedCharacters
    };
  }

  // =========================================================================
  // SUSPECT IDENTIFICATION & NARRATIVE BALANCE
  // =========================================================================

  /**
   * Scans character knowledge, alibis, and evidence to identify all plausible suspects.
   */
  static detectSuspects(story: Story, evidence: EvidenceItem[]): SuspectProfile[] {
    const allCharacters = [...(story.guiltyPool || []), ...(story.innocentPool || [])];
    const profiles: SuspectProfile[] = [];

    allCharacters.forEach(char => {
      let score = 0;
      const reasons: string[] = [];
      const charName = char.name.toLowerCase();

      // Check character knowledge & public identity for suspicious keywords
      const bioText = `${char.publicIdentity} ${char.knowledge}`.toLowerCase();
      if (/خلاف|سر|بطاقة|كاميرات|صلاحية|سلاح|سم|مال|دين|تهديد|شريحة|خزنة|ممر/.test(bioText)) {
        score += 1;
        reasons.push('Has knowledge of critical access, tools, or timeline discrepancies.');
      }
      if (/تراقب|مسؤول|أنت من صمم|مهمتك|المشرف/.test(bioText)) {
        score += 1;
        reasons.push('Holds authoritative access to the crime scene or systems.');
      }

      // Check if mentioned in evidence
      evidence.forEach(ev => {
        const evText = `${ev.title} ${ev.description} ${ev.publicClue || ''}`.toLowerCase();
        if (evText.includes(charName) || ev.relatedCharacters?.some(rc => rc.toLowerCase() === charName)) {
          score += 2;
          reasons.push(`Implicated by evidence: "${ev.title}".`);
        }
      });

      // Guilty characters inherently have a reason
      if (char.guilty) {
        score += 1;
        reasons.push('Authoritative in-universe perpetrator with crime methodology.');
      }

      profiles.push({
        name: char.name,
        profession: char.profession,
        isGuilty: Boolean(char.guilty),
        suspicionScore: score,
        reasons
      });
    });

    return profiles.sort((a, b) => b.suspicionScore - a.suspicionScore);
  }

  private static auditNarrativeDepth(story: Story, issues: StoryValidationIssue[]): void {
    const allCharacters = [...(story.guiltyPool || []), ...(story.innocentPool || [])];
    if (allCharacters.length === 0) return;

    // Check alibis / testimonies
    const charactersWithTestimony = allCharacters.filter(c => {
      const text = `${c.publicIdentity} ${c.knowledge}`.toLowerCase();
      return /كنت|رأيت|شاهدت|سمعت|تواجد|مكتبي|غرفتي|موقعي|ساعة|دقيقة|وقت/.test(text);
    });

    if (charactersWithTestimony.length < 2 && allCharacters.length >= 4) {
      issues.push({
        severity: 'WARNING',
        code: 'FEW_CHARACTER_ALIBIS',
        message: 'Fewer than 2 characters have alibis or timeline statements in their narrative context.'
      });
    }

    // Check relationships
    const charactersWithRelationships = allCharacters.filter(c => {
      const text = `${c.publicIdentity} ${c.knowledge}`.toLowerCase();
      return /صديق|شريك|زميل|مساعد|رئيس|ابن|أخت|عائلة|محامي|طبيب|خادم|منافس/.test(text);
    });

    if (charactersWithRelationships.length < 2 && allCharacters.length >= 4) {
      issues.push({
        severity: 'WARNING',
        code: 'FEW_RELATIONSHIPS',
        message: 'Few interpersonal relationships defined among characters. Interpersonal dynamics foster richer deduction.'
      });
    }

    // Check motive diversity
    const charactersWithMotives = allCharacters.filter(c => {
      const text = `${c.publicIdentity} ${c.knowledge}`.toLowerCase();
      return /مال|ديون|بيع|شراء|صفقة|انتقام|خلاف|منصب|حماية|عزل|تهريب|ابتزاز/.test(text);
    });

    if (charactersWithMotives.length === 0 && allCharacters.length >= 4) {
      issues.push({
        severity: 'WARNING',
        code: 'NO_MOTIVE_DIVERSITY',
        message: 'No distinct motives or conflicts identified across the cast.'
      });
    }
  }

  // =========================================================================
  // TIMELINE INCONSISTENCIES DETECTION
  // =========================================================================

  /**
   * Scans timestamps in evidence and characters to detect potential unflagged timeline issues.
   */
  static detectTimelineInconsistencies(story: Story, evidence: EvidenceItem[]): string[] {
    const timelineIssues: string[] = [];
    const timeRegex = /\b([0-1]?[0-9]|2[0-3]):([0-5][0-9])\b/g;

    const allTexts: { source: string; text: string }[] = [];
    if (story.introduction?.incident) {
      allTexts.push({ source: 'Introduction Incident', text: story.introduction.incident });
    }
    evidence.forEach(ev => {
      allTexts.push({ source: `Evidence "${ev.title}"`, text: `${ev.title} ${ev.description} ${ev.publicClue || ''}` });
    });
    [...(story.guiltyPool || []), ...(story.innocentPool || [])].forEach(char => {
      allTexts.push({ source: `Character "${char.name}"`, text: `${char.publicIdentity} ${char.knowledge}` });
    });

    // Extract all referenced times
    const foundTimes: { time: string; source: string }[] = [];
    allTexts.forEach(item => {
      let match;
      while ((match = timeRegex.exec(item.text)) !== null) {
        foundTimes.push({ time: match[0], source: item.source });
      }
    });

    // Check for explicit contradiction keywords in timeline
    evidence.forEach(ev => {
      const evText = `${ev.title} ${ev.description} ${ev.publicClue || ''}`.toLowerCase();
      if (/تناقض في التوقيت|تضارب زمني|تعارض في المواعيد|توقيت مستحيل|timeline contradiction|impossible timeline/.test(evText)) {
        timelineIssues.push(`Timeline contradiction noted in evidence "${ev.title}".`);
      }
    });

    // If there are no timestamps found anywhere in the entire story
    if (foundTimes.length === 0) {
      timelineIssues.push('No explicit chronological timestamps found in incident, evidence, or character testimonies.');
    }

    return timelineIssues;
  }

  // =========================================================================
  // AUDIT REPORT FORMATTER (Developer-Facing)
  // =========================================================================

  /**
   * Formats a StoryAuditReport into a clean, human-readable text output.
   */
  static formatReportAsText(report: StoryAuditReport): string {
    const lines: string[] = [];
    lines.push(`==================================================`);
    lines.push(`STORY AUDIT: ${report.storyTitle} [${report.storyId}]`);
    lines.push(`==================================================`);
    lines.push(`Status:          ${report.isValid ? 'VALID' : 'INVALID (ERRORS FOUND)'}`);
    lines.push(`Player Range:    ${report.minPlayers} – ${report.maxPlayers} players`);
    lines.push(`Characters:      ${report.characterCount} total (${report.guiltyCount} guilty)`);
    lines.push(`Evidence Count:  ${report.evidenceCount} items`);
    lines.push(``);
    lines.push(`EVIDENCE BALANCE:`);
    lines.push(`  - DIRECT:     ${report.evidenceBalance.DIRECT}`);
    lines.push(`  - STRONG:     ${report.evidenceBalance.STRONG}`);
    lines.push(`  - MODERATE:   ${report.evidenceBalance.MODERATE}`);
    lines.push(`  - WEAK:       ${report.evidenceBalance.WEAK}`);
    lines.push(`  - CONTEXTUAL: ${report.evidenceBalance.CONTEXTUAL}`);
    lines.push(``);
    lines.push(`SUSPECT PROFILES (${report.suspects.length}):`);
    report.suspects.slice(0, 5).forEach(s => {
      const roleTag = s.isGuilty ? '[GUILTY]' : '[INNOCENT]';
      lines.push(`  • ${s.name} (${s.profession}) ${roleTag} - Score: ${s.suspicionScore}`);
      s.reasons.forEach(r => lines.push(`      ↳ ${r}`));
    });
    lines.push(``);
    lines.push(`LEGACY STATUS:`);
    lines.push(`  - Legacy Secrets/Objectives: ${report.hasLegacySecrets ? 'DETECTED (WARNING)' : 'CLEAN'}`);
    lines.push(`  - Legacy Rounds/Clues:       ${report.hasLegacyRounds ? 'DETECTED (WARNING)' : 'CLEAN'}`);
    lines.push(`  - Direct Killer Evidence:    ${report.hasDirectKillerEvidence ? 'DETECTED (WARNING)' : 'NONE'}`);
    lines.push(``);
    if (report.errors.length > 0) {
      lines.push(`ERRORS (${report.errors.length}):`);
      report.errors.forEach(e => lines.push(`  ❌ [ERROR] ${e}`));
      lines.push(``);
    }
    if (report.warnings.length > 0) {
      lines.push(`WARNINGS (${report.warnings.length}):`);
      report.warnings.forEach(w => lines.push(`  ⚠️ [WARNING] ${w}`));
      lines.push(``);
    }
    lines.push(`==================================================\n`);

    return lines.join('\n');
  }
}
