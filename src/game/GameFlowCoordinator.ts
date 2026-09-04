import { GameEngine } from './GameEngine';
import { GameScreen } from '../types';
import { Story } from './types';

export interface TransitionCallbacks {
  getScreen: () => GameScreen;
  setScreen: (screen: GameScreen) => void;
  setError: (error: string | null) => void;
  getLanguage: () => 'ar' | 'en';
}

/**
 * GameFlowCoordinator enforces authoritative synchronization between GameEngine state transitions
 * and UI screen navigation.
 * 
 * CORE RULE:
 * The UI screen must NEVER advance if the authoritative GameEngine transition fails.
 */
export class GameFlowCoordinator {
  constructor(
    private gameEngine: GameEngine,
    private callbacks: TransitionCallbacks
  ) {}

  /**
   * Starts voting phase.
   * UI screen advances to 'voting' ONLY if GameEngine transition succeeds.
   */
  public startVoting(): boolean {
    try {
      this.gameEngine.startVoting();
      this.callbacks.setScreen('voting');
      return true;
    } catch (e: any) {
      console.error('Error starting voting via GameEngine:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Cannot start voting in current game state.' : 'لا يمكن بدء التصويت في الحالة الحالية للعبة.')
      );
      return false;
    }
  }

  /**
   * Resolves votes cast in voting phase.
   * UI screen advances to 'vote_result' ONLY if GameEngine transition succeeds.
   */
  public resolveVotes(votes: Record<number, number>): boolean {
    try {
      this.gameEngine.resolveVotes(votes);
      this.callbacks.setScreen('vote_result');
      return true;
    } catch (e: any) {
      console.error('Error resolving votes via GameEngine:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Failed to resolve votes.' : 'تعذر احتساب نتائج التصويت.')
      );
      return false;
    }
  }

  /**
   * Proceeds after vote result to next round ('free_discussion') or killer reveal ('killer_reveal').
   * UI screen advances ONLY if GameEngine transition succeeds.
   */
  public proceedAfterVoteResult(isGameOver: boolean): boolean {
    try {
      this.gameEngine.proceedAfterVoteResult();
      if (isGameOver) {
        this.callbacks.setScreen('killer_reveal');
      } else {
        this.callbacks.setScreen('free_discussion');
      }
      return true;
    } catch (e: any) {
      console.error('Error proceeding after vote result:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to advance game state.' : 'تعذر الانتقال في الحالة الحالية للعبة.')
      );
      return false;
    }
  }

  /**
   * Proceeds from killer reveal to crime explanation.
   * UI screen advances to 'crime_explanation' ONLY if GameEngine transition succeeds.
   */
  public proceedToCrimeExplanation(): boolean {
    try {
      this.gameEngine.proceedToCrimeExplanation();
      this.callbacks.setScreen('crime_explanation');
      return true;
    } catch (e: any) {
      console.error('Error advancing to crime explanation:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to load crime explanation.' : 'تعذر الانتقال إلى تفاصيل الجريمة.')
      );
      return false;
    }
  }

  /**
   * Proceeds from reveal truth to final game results.
   * UI screen advances to 'results' ONLY if GameEngine transition succeeds.
   */
  public proceedToGameOver(): boolean {
    try {
      this.gameEngine.proceedToGameOver();
      this.callbacks.setScreen('results');
      return true;
    } catch (e: any) {
      console.error('Error advancing to game over:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to conclude game.' : 'تعذر الانتقال إلى شاشة النتائج النهائية.')
      );
      return false;
    }
  }

  /**
   * Advances role pass to next player or to discussion once complete.
   * UI screen advances to 'free_discussion' ONLY if role-pass completes and phase becomes DISCUSSION.
   */
  public advanceRolePass(): boolean {
    try {
      const updatedState = this.gameEngine.advanceRolePass();
      if (updatedState.phase === 'DISCUSSION') {
        this.callbacks.setScreen('free_discussion');
      }
      return true;
    } catch (e: any) {
      console.error('Error advancing role pass:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to advance role pass.' : 'تعذر متابعة تمرير الأدوار.')
      );
      return false;
    }
  }

  /**
   * Starts a new game with authoritative validation.
   * UI screen advances to 'role_pass' ONLY if GameEngine successfully starts match.
   */
  public startNewGame(story: Story, playerNames: string[]): boolean {
    try {
      const newState = this.gameEngine.startNewGame(story, playerNames);
      if (newState.phase === 'ROLE_PASS') {
        this.callbacks.setScreen('role_pass');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Game failed to enter role-pass phase.'
            : 'فشل بدء اللعبة في مرحلة تمرير الأدوار.'
        );
      }
    } catch (e: any) {
      console.error('Failed to start game via GameEngine:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Failed to start game. Please verify player settings.' : 'تعذر بدء اللعبة، يرجى التأكد من صحة إعدادات اللاعبين.')
      );
      return false;
    }
  }

  /**
   * Resets role pass progression.
   * UI screen advances to 'player_setup' ONLY if reset succeeds.
   */
  public resetRolePass(): boolean {
    try {
      this.gameEngine.resetRolePass();
      this.callbacks.setScreen('player_setup');
      return true;
    } catch (e: any) {
      console.error('Failed to reset role pass:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to reset role pass.' : 'تعذر إعادة تعيين تمرير الأدوار.')
      );
      return false;
    }
  }

  /**
   * Resets game to lobby/home or story_select.
   * UI screen advances ONLY if reset succeeds.
   */
  public resetToLobby(targetScreen: 'home' | 'story_select'): boolean {
    try {
      this.gameEngine.resetToLobby();
      this.callbacks.setScreen(targetScreen);
      return true;
    } catch (e: any) {
      console.error('Error resetting game to lobby:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to reset game.' : 'تعذر العودة إلى القائمة الرئيسية.')
      );
      return false;
    }
  }
}
