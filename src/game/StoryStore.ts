import { Story, StoryValidationResult } from './types';
import { StoryEngine } from './StoryEngine';
import repoStoriesData from '../data/repoStories.json';

const CUSTOM_STORIES_STORAGE_KEY = 'secret_killer_custom_stories_v2';

/**
 * StoryStore manages built-in and user-created custom stories with persistent storage.
 */
export class StoryStore {
  private static builtInStoriesCache: Story[] | null = null;
  private static customStoriesCache: Story[] | null = null;

  /**
   * Returns all built-in default stories
   */
  static getBuiltInStories(): Story[] {
    if (!this.builtInStoriesCache) {
      this.builtInStoriesCache = (repoStoriesData as unknown as Story[]).map(story => {
        const defaultSolution = story.solution?.trim()
          ? story.solution
          : `أثبتت الأدلة والتحقيقات الجنائية تفاصيل الحادثة: ${story.introduction?.incident || story.description}.`;

        return {
          ...story,
          solution: defaultSolution,
          minPlayers: story.minPlayers || 4,
          maxPlayers: story.maxPlayers || 12,
          isCustom: false
        };
      });
    }
    return [...this.builtInStoriesCache];
  }

  /**
   * Returns all saved custom stories from localStorage
   */
  static getCustomStories(): Story[] {
    if (this.customStoriesCache) {
      return [...this.customStoriesCache];
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem(CUSTOM_STORIES_STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            this.customStoriesCache = parsed.map(s => ({
              ...s,
              isCustom: true
            }));
            return [...this.customStoriesCache];
          }
        }
      }
    } catch {
      // Ignore localStorage errors (e.g. in SSR / unit testing environments)
    }

    this.customStoriesCache = [];
    return [];
  }

  /**
   * Returns combined list of built-in and custom stories
   */
  static getAllStories(): Story[] {
    return [...this.getBuiltInStories(), ...this.getCustomStories()];
  }

  /**
   * Finds a story by its ID
   */
  static getStoryById(id: string): Story | undefined {
    return this.getAllStories().find(s => s.id === id);
  }

  /**
   * Saves a custom story after validating it
   */
  static saveCustomStory(story: Story): StoryValidationResult {
    const formattedStory: Story = {
      ...story,
      id: story.id?.trim() || `custom_${Date.now()}`,
      isCustom: true,
      minPlayers: story.minPlayers || 4,
      maxPlayers: story.maxPlayers || 12
    };

    const validation = StoryEngine.validateStory(formattedStory);
    if (!validation.valid) {
      return validation;
    }

    const currentCustom = this.getCustomStories();
    const existingIndex = currentCustom.findIndex(s => s.id === formattedStory.id);

    if (existingIndex >= 0) {
      currentCustom[existingIndex] = formattedStory;
    } else {
      currentCustom.unshift(formattedStory);
    }

    this.customStoriesCache = currentCustom;
    this.persistCustomStories(currentCustom);

    return {
      valid: true,
      errors: []
    };
  }

  /**
   * Deletes a custom story by ID
   */
  static deleteCustomStory(id: string): boolean {
    const currentCustom = this.getCustomStories();
    const filtered = currentCustom.filter(s => s.id !== id);

    if (filtered.length !== currentCustom.length) {
      this.customStoriesCache = filtered;
      this.persistCustomStories(filtered);
      return true;
    }
    return false;
  }

  /**
   * Clears custom stories (useful for tests)
   */
  static clearCustomStories(): void {
    this.customStoriesCache = [];
    this.persistCustomStories([]);
  }

  private static persistCustomStories(stories: Story[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(CUSTOM_STORIES_STORAGE_KEY, JSON.stringify(stories));
      }
    } catch {
      // Ignore write errors
    }
  }
}
