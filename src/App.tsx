import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameScreen, StoryData, PlayerData, GameSettings } from './types';
import { BUILT_IN_STORIES, loadCustomStories, saveCustomStory, localizeStory, localizeStories } from './data/cases';
import { GameEngine, StoryEngine, Story, GameState, GameFlowCoordinator } from './game';
import { HomeScreen } from './components/HomeScreen';
import { StorySelectScreen } from './components/StorySelectScreen';
import { CaseIntroScreen } from './components/CaseIntroScreen';
import { PlayerSetupScreen } from './components/PlayerSetupScreen';
import { RolePassScreen } from './components/RolePassScreen';
import { DiscussionEvidenceScreen } from './components/DiscussionEvidenceScreen';
import { VotingScreen } from './components/VotingScreen';
import { VoteResultScreen } from './components/VoteResultScreen';
import { KillerRevealScreen } from './components/KillerRevealScreen';
import { CrimeExplanationScreen } from './components/CrimeExplanationScreen';
import { RevealTruthScreen } from './components/RevealTruthScreen';
import { GameResultsScreen } from './components/GameResultsScreen';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { CustomStoryModal } from './components/CustomStoryModal';
import { BannerAd } from './components/ads/BannerAd';
import { InterstitialAdModal } from './components/ads/InterstitialAdModal';
import { adService } from './services/adService';
import { sound } from './utils/audio';
import { validateFirebaseConnection } from './services/firebase';

export default function App() {
  // Stable GameEngine instance that survives renders
  const gameEngineRef = useRef<GameEngine | null>(null);
  if (!gameEngineRef.current) {
    gameEngineRef.current = new GameEngine();
  }
  const gameEngine = gameEngineRef.current;

  // Settings with Language Support and LocalStorage persistence
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('secret_killer_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          language: parsed.language || 'ar',
          soundEnabled: parsed.soundEnabled ?? true,
          timerMinutes: parsed.timerMinutes || 4,
          dramaticEffects: parsed.dramaticEffects ?? true,
          secretBallotMode: parsed.secretBallotMode ?? false,
          fastVotingMode: parsed.fastVotingMode ?? false,
        };
      }
    } catch {}
    return {
      language: 'ar',
      soundEnabled: true,
      timerMinutes: 4,
      dramaticEffects: true,
    };
  });

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('secret_killer_settings', JSON.stringify(newSettings));
    } catch {}
  };

  const language = settings.language || 'ar';
  const isEn = language === 'en';
  const isRtl = !isEn;

  // Subscribe React to GameEngine state
  const [gameState, setGameState] = useState<GameState>(() => gameEngine.getState());

  useEffect(() => {
    return gameEngine.subscribe(setGameState);
  }, [gameEngine]);

  // Validate connection to Firebase Firestore on initial boot
  useEffect(() => {
    validateFirebaseConnection();
  }, []);

  // UI Navigation & Stories State
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [stories, setStories] = useState<StoryData[]>(BUILT_IN_STORIES);
  const [selectedStory, setSelectedStory] = useState<StoryData>(BUILT_IN_STORIES[0]);
  const [transitionError, setTransitionError] = useState<string | null>(null);

  // Auto-dismiss transition error message after 4.5 seconds
  useEffect(() => {
    if (transitionError) {
      const timer = setTimeout(() => {
        setTransitionError(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [transitionError]);

  // Keep references for stable coordinator callbacks
  const currentScreenRef = useRef<GameScreen>(currentScreen);
  currentScreenRef.current = currentScreen;

  const languageRef = useRef<'ar' | 'en'>(language);
  languageRef.current = language;

  const coordinatorRef = useRef<GameFlowCoordinator | null>(null);
  if (!coordinatorRef.current) {
    coordinatorRef.current = new GameFlowCoordinator(gameEngine, {
      getScreen: () => currentScreenRef.current,
      setScreen: (screen: GameScreen) => setCurrentScreen(screen),
      setError: (err: string | null) => setTransitionError(err),
      getLanguage: () => languageRef.current,
    });
  }
  const coordinator = coordinatorRef.current;

  // Modals state
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomStoryModal, setShowCustomStoryModal] = useState(false);

  // Load custom stories & preload/trigger opening title voice on startup
  useEffect(() => {
    sound.preloadTitleVoice();

    const custom = loadCustomStories();
    if (custom && custom.length > 0) {
      setStories([...custom, ...BUILT_IN_STORIES]);
    }

    // Play iconic Resident Evil title voice on initial user gesture (due to browser autoplay policies)
    const handleFirstUserInteraction = () => {
      sound.playTitleVoice();
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };

    window.addEventListener('pointerdown', handleFirstUserInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
    };
  }, []);

  // Save new custom story with StoryEngine validation
  const handleSaveCustomStory = (story: StoryData) => {
    const validation = StoryEngine.validateStory(story as unknown as Story);
    if (!validation.valid) {
      alert(isEn ? `Cannot save story:\n${validation.errors.join('\n')}` : `لا يمكن حفظ القصة:\n${validation.errors.join('\n')}`);
      return;
    }
    saveCustomStory(story);
    setStories([story, ...stories.filter((s) => s.id !== story.id)]);
    setSelectedStory(story);
    setCurrentScreen('story_intro');
  };

  // Screen Navigation handlers
  const handleStartGame = () => {
    setCurrentScreen('story_select');
  };

  const handleSelectStory = (story: StoryData) => {
    // Validate story using StoryEngine before proceeding
    const validation = StoryEngine.validateStory(story as unknown as Story);
    if (!validation.valid) {
      console.error('Invalid story rejected by StoryEngine:', validation.errors);
      alert(isEn ? `Invalid story:\n${validation.errors.join('\n')}` : `هذه القصة غير صالحة:\n${validation.errors.join('\n')}`);
      return;
    }
    setSelectedStory(story);
    setCurrentScreen('story_intro');
  };

  const handleProceedToSetup = () => {
    setCurrentScreen('player_setup');
  };

  // Start new game via GameEngine
  const handleConfirmPlayers = (playerNames: string[]) => {
    const localizedStory = localizeStory(selectedStory, language);
    coordinator.startNewGame(localizedStory as unknown as Story, playerNames);
  };

  const handleAdvanceRolePass = () => {
    coordinator.advanceRolePass();
  };

  const handleRevealNextEvidence = () => {
    try {
      gameEngine.revealNextEvidence();
    } catch (e: any) {
      console.error('Error revealing evidence:', e);
      setTransitionError(e?.message || (isEn ? 'Cannot reveal more evidence.' : 'لا يمكن كشف المزيد من الأدلة.'));
    }
  };

  const handleProceedToVoting = () => {
    coordinator.startVoting();
  };

  const handleCompleteVoting = (votes: Record<number, number>) => {
    coordinator.resolveVotes(votes);
  };

  const handleProceedNextRound = () => {
    adService.requestInterstitial('round_transition', () => {
      coordinator.proceedAfterVoteResult();
    });
  };

  const handleProceedToTruth = (_determinedWinner: 'innocents' | 'guilty') => {
    adService.requestInterstitial('game_end', () => {
      coordinator.proceedAfterVoteResult();
    });
  };

  const handleProceedToExplanation = () => {
    coordinator.proceedToCrimeExplanation();
  };

  const handleProceedToTruthReveal = () => {
    setCurrentScreen('reveal_truth');
  };

  const handleProceedToResults = () => {
    coordinator.proceedToGameOver();
  };

  const handlePlayAgain = () => {
    coordinator.resetToLobby('story_select');
  };

  const handleNavigateHome = () => {
    coordinator.resetToLobby('home');
  };

  // Data adapter: convert GameEngine Player shape to UI PlayerData shape
  const players: PlayerData[] = gameState.players.map((p) => ({
    id: p.id,
    name: p.name,
    character: {
      name: p.character.name,
      profession: p.character.profession,
      publicIdentity: p.character.publicIdentity,
      knowledge: p.character.knowledge,
      guilty: p.character.guilty,
    },
    guilty: p.guilty,
    eliminated: p.isEliminated,
    votedForId: p.votedForId,
  }));

  const round = gameState.currentRound;
  const wrongVotesCount = gameState.wrongVotesCount;
  const winner: 'innocents' | 'guilty' = gameState.winner === 'GUILTY' ? 'guilty' : 'innocents';
  const lastVotes = gameState.votes;
  
  const rawStory = (gameState.story as unknown as StoryData | null) || selectedStory;
  const activeStory = localizeStory(rawStory, language);
  const localizedStoriesList = localizeStories(stories, language);

  const customCount = stories.filter((s) => s.isCustom).length;

  return (
    <div className={`min-h-screen bg-[#07080c] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 ${isRtl ? "font-['Cairo',sans-serif]" : "font-sans"}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Main Screen Views */}
      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <HomeScreen
                onStartGame={handleStartGame}
                onOpenCustomStories={() => setShowCustomStoryModal(true)}
                onOpenSettings={() => setShowSettings(true)}
                onOpenRules={() => setShowRules(true)}
                totalStories={stories.length}
                customStoriesCount={customCount}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'story_select' && (
            <motion.div
              key="story_select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <StorySelectScreen
                stories={localizedStoriesList}
                onSelectStory={handleSelectStory}
                onOpenCustomStoryModal={() => setShowCustomStoryModal(true)}
                onBack={() => setCurrentScreen('home')}
                onNavigateHome={handleNavigateHome}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'story_intro' && (
            <motion.div
              key="story_intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <CaseIntroScreen
                story={activeStory}
                onProceedToSetup={handleProceedToSetup}
                onBack={() => setCurrentScreen('story_select')}
                onNavigateHome={handleNavigateHome}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'player_setup' && (
            <motion.div
              key="player_setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <PlayerSetupScreen
                story={activeStory}
                onConfirmPlayers={handleConfirmPlayers}
                onBack={() => setCurrentScreen('story_intro')}
                onNavigateHome={handleNavigateHome}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'role_pass' && (
            <motion.div
              key="role_pass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <RolePassScreen
                players={gameState.players}
                currentViewingIndex={gameState.currentViewingPlayerIndex}
                onAdvanceRolePass={handleAdvanceRolePass}
                onBack={() => coordinator.resetRolePass()}
                onNavigateHome={handleNavigateHome}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'free_discussion' && (
            <motion.div
              key="free_discussion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <DiscussionEvidenceScreen
                story={activeStory}
                players={players}
                round={round}
                revealedEvidenceIds={gameState.revealedEvidenceIds}
                revealedClues={gameState.revealedClues}
                totalClues={gameState.totalClues}
                remainingClues={gameState.remainingClues}
                clueRevealedThisRound={gameState.clueRevealedThisRound}
                canRevealClue={gameEngine.canRevealClue()}
                onRevealNextEvidence={handleRevealNextEvidence}
                hasMoreEvidence={gameEngine.hasMoreEvidence()}
                onProceedToVoting={handleProceedToVoting}
                onBack={handleNavigateHome}
                onNavigateHome={handleNavigateHome}
                language={language}
                timerMinutes={settings.timerMinutes}
              />
            </motion.div>
          )}

          {currentScreen === 'voting' && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <VotingScreen
                players={players}
                round={round}
                onCompleteVoting={handleCompleteVoting}
                onBack={() => setCurrentScreen('free_discussion')}
                onNavigateHome={handleNavigateHome}
                language={language}
                secretBallotMode={settings.secretBallotMode}
                fastVotingMode={settings.fastVotingMode}
              />
            </motion.div>
          )}

          {currentScreen === 'vote_result' && (
            <motion.div
              key="vote_result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <VoteResultScreen
                story={activeStory}
                players={players}
                votes={lastVotes}
                round={round}
                wrongVotesCount={wrongVotesCount}
                voteResult={gameState.lastVoteResult}
                onProceedNextRound={handleProceedNextRound}
                onProceedToTruth={handleProceedToTruth}
                onNavigateHome={handleNavigateHome}
                language={language}
                secretBallotMode={settings.secretBallotMode}
              />
            </motion.div>
          )}

          {currentScreen === 'killer_reveal' && (
            <motion.div
              key="killer_reveal"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full"
            >
              <KillerRevealScreen
                story={activeStory}
                players={players}
                winner={winner}
                onProceedToExplanation={handleProceedToExplanation}
                onBack={() => setCurrentScreen('vote_result')}
                onNavigateHome={handleNavigateHome}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'crime_explanation' && (
            <motion.div
              key="crime_explanation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <CrimeExplanationScreen
                story={activeStory}
                players={players}
                onProceedToResults={handleProceedToTruthReveal}
                onBack={() => setCurrentScreen('killer_reveal')}
                onNavigateHome={handleNavigateHome}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'reveal_truth' && (
            <motion.div
              key="reveal_truth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <RevealTruthScreen
                story={activeStory}
                players={players}
                winner={winner}
                onProceedToResults={handleProceedToResults}
                onBack={() => setCurrentScreen('crime_explanation')}
                onNavigateHome={handleNavigateHome}
                language={language}
              />
            </motion.div>
          )}

          {currentScreen === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <GameResultsScreen
                story={activeStory}
                players={players}
                winner={winner}
                votes={lastVotes}
                onPlayAgain={handlePlayAgain}
                onNavigateHome={handleNavigateHome}
                onBack={() => setCurrentScreen('reveal_truth')}
                language={language}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Localized Transition Error Banner */}
      <AnimatePresence>
        {transitionError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 pointer-events-auto"
          >
            <div className="bg-red-950/95 border border-red-500/80 text-red-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md">
              <span className="text-sm font-semibold">{transitionError}</span>
              <button
                type="button"
                onClick={() => setTransitionError(null)}
                className="text-red-300 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-red-900/60 font-bold hover:bg-red-900 transition-colors"
              >
                {isEn ? 'Dismiss' : 'إغلاق'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
        language={language}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />

      <CustomStoryModal
        isOpen={showCustomStoryModal}
        onClose={() => setShowCustomStoryModal(false)}
        onSaveStory={handleSaveCustomStory}
        language={language}
      />

      {/* Google AdMob Full-screen Interstitial Ad Modal */}
      <InterstitialAdModal language={language} />
    </div>
  );
}
