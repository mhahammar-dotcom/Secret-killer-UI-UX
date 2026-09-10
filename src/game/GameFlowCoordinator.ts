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
 * CORE RULES:
 * 1. The UI screen must NEVER advance if the authoritative GameEngine transition fails.
 * 2. Destinations are determined by authoritative GameEngine state, NOT caller-controlled booleans.
 */
export class GameFlowCoordinator {
  constructor(
    private gameEngine: GameEngine,
    private callbacks: TransitionCallbacks
  ) {}

  /**
   * Starts voting phase.
   * UI screen advances to 'voting' ONLY if GameEngine transition succeeds and phase is VOTING.
   */
  public startVoting(): boolean {
    try {
      const state = this.gameEngine.startVoting();
      if (state.phase === 'VOTING') {
        this.callbacks.setScreen('voting');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Game failed to enter voting phase.'
            : 'فشل الانتقال إلى مرحلة التصويت.'
        );
      }
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
   * Cancels voting and returns UI to 'free_discussion' ONLY if GameEngine transition succeeds and phase is DISCUSSION.
   */
  public cancelVoting(): boolean {
    try {
      const state = this.gameEngine.cancelVoting();
      if (state.phase === 'DISCUSSION') {
        this.callbacks.setScreen('free_discussion');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Failed to return to discussion phase.'
            : 'فشل العودة إلى مرحلة النقاش.'
        );
      }
    } catch (e: any) {
      console.error('Error cancelling voting via GameEngine:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Cannot cancel voting in current game state.' : 'لا يمكن إلغاء التصويت في الحالة الحالية للعبة.')
      );
      return false;
    }
  }

  /**
   * Resolves votes cast in voting phase.
   * UI screen advances to 'vote_result' ONLY if GameEngine transition succeeds and phase is VOTE_RESULT.
   */
  public resolveVotes(votes: Record<number, number>): boolean {
    try {
      this.gameEngine.resolveVotes(votes);
      const state = this.gameEngine.getState();
      if (state.phase === 'VOTE_RESULT') {
        this.callbacks.setScreen('vote_result');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Failed to record vote results.'
            : 'فشل تسجيل نتائج التصويت.'
        );
      }
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
   * Destination is authoritatively determined from GameEngine state:
   * - If phase === 'KILLER_REVEAL' or winner !== 'NONE' -> 'killer_reveal'
   * - If phase === 'DISCUSSION' and winner === 'NONE' -> 'free_discussion'
   * UI screen advances ONLY if GameEngine transition succeeds.
   */
  public proceedAfterVoteResult(): boolean {
    try {
      const state = this.gameEngine.proceedAfterVoteResult();
      if (state.phase === 'KILLER_REVEAL' || state.winner !== 'NONE') {
        this.callbacks.setScreen('killer_reveal');
      } else if (state.phase === 'DISCUSSION') {
        this.callbacks.setScreen('free_discussion');
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Unexpected game state after vote result.'
            : 'حالة غير متوقعة للعبة بعد نتيجة التصويت.'
        );
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
   * UI screen advances to 'crime_explanation' ONLY if GameEngine transition succeeds and phase is CRIME_EXPLANATION.
   */
  public proceedToCrimeExplanation(): boolean {
    try {
      const state = this.gameEngine.proceedToCrimeExplanation();
      if (state.phase === 'CRIME_EXPLANATION') {
        this.callbacks.setScreen('crime_explanation');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Failed to advance to crime explanation.'
            : 'فشل الانتقال إلى تفاصيل الجريمة.'
        );
      }
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
   * Proceeds from crime explanation to reveal truth.
   * UI screen advances to 'reveal_truth' ONLY if GameEngine transition succeeds and phase is REVEAL_TRUTH.
   */
  public proceedToTruthReveal(): boolean {
    try {
      const state = this.gameEngine.proceedToTruthReveal();
      if (state.phase === 'REVEAL_TRUTH') {
        this.callbacks.setScreen('reveal_truth');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Failed to advance to reveal truth.'
            : 'فشل الانتقال إلى كشف الحقيقة.'
        );
      }
    } catch (e: any) {
      console.error('Error advancing to reveal truth:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to load reveal truth.' : 'تعذر الانتقال إلى كشف الحقيقة.')
      );
      return false;
    }
  }

  /**
   * Proceeds from reveal truth to final game results.
   * UI screen advances to 'results' ONLY if GameEngine transition succeeds and phase is GAME_OVER.
   */
  public proceedToGameOver(): boolean {
    try {
      const state = this.gameEngine.proceedToGameOver();
      if (state.phase === 'GAME_OVER') {
        this.callbacks.setScreen('results');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Failed to advance to game over.'
            : 'فشل الانتقال إلى نتائج اللعبة.'
        );
      }
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
      if (this.gameEngine.getState().phase !== 'ROLE_PASS') {
        return false;
      }
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
   * UI screen advances to 'role_pass' ONLY if GameEngine successfully starts match in ROLE_PASS phase.
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
      const state = this.gameEngine.resetRolePass();
      if (state.currentViewingPlayerIndex === 0) {
        this.callbacks.setScreen('player_setup');
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Failed to reset role pass.'
            : 'تعذر إعادة تعيين تمرير الأدوار.'
        );
      }
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
   * UI screen advances ONLY if reset succeeds and phase is LOBBY.
   */
  public resetToLobby(targetScreen: 'home' | 'story_select'): boolean {
    try {
      const state = this.gameEngine.resetToLobby();
      if (state.phase === 'LOBBY') {
        this.callbacks.setScreen(targetScreen);
        return true;
      } else {
        throw new Error(
          this.callbacks.getLanguage() === 'en'
            ? 'Failed to reset game state.'
            : 'فشل إعادة تعيين حالة اللعبة.'
        );
      }
    } catch (e: any) {
      console.error('Error resetting game to lobby:', e);
      const isEn = this.callbacks.getLanguage() === 'en';
      this.callbacks.setError(
        e?.message || (isEn ? 'Unable to reset game.' : 'تعذر العودة إلى القائمة الرئيسية.')
      );
      return false;
    }
  }

  /**
   * Authoritative back navigation for gameplay screens.
   * Delegates to existing coordinator authority:
   * - 'voting': cancels active voting and returns to 'free_discussion'
   * - 'role_pass': resets role pass to index 0 and returns to 'player_setup'
   * - 'results': resets game to lobby and returns to 'home'
   * Returns true if transition was executed, false if blocked during active gameplay.
   */
  public handleBack(currentScreen: GameScreen): boolean {
    switch (currentScreen) {
      case 'voting':
        return this.cancelVoting();
      case 'role_pass':
        return this.resetRolePass();
      case 'results':
        return this.resetToLobby('home');
      default:
        return false;
    }
  }
}
