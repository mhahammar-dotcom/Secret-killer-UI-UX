import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameScreen, StoryData, PlayerData, GameSettings } from './types';
import { BUILT_IN_STORIES, loadCustomStories, saveCustomStory } from './data/cases';
import { GameEngine, StoryEngine, Story, GameState } from './game';
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
import { sound } from './utils/audio';

export default function App() {
  // Stable GameEngine instance that survives renders
  const gameEngineRef = useRef<GameEngine | null>(null);
  if (!gameEngineRef.current) {
    gameEngineRef.current = new GameEngine();
  }
  const gameEngine = gameEngineRef.current;

  // Subscribe React to GameEngine state
  const [gameState, setGameState] = useState<GameState>(() => gameEngine.getState());

  useEffect(() => {
    return gameEngine.subscribe(setGameState);
  }, [gameEngine]);

  // UI Navigation & Stories State
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('home');
  const [stories, setStories] = useState<StoryData[]>(BUILT_IN_STORIES);
  const [selectedStory, setSelectedStory] = useState<StoryData>(BUILT_IN_STORIES[0]);

  // Modals state
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomStoryModal, setShowCustomStoryModal] = useState(false);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    ambientSound: false,
    timerMinutes: 4,
    dramaticEffects: true,
  });

  // Load custom stories on startup
  useEffect(() => {
    const custom = loadCustomStories();
    if (custom && custom.length > 0) {
      setStories([...custom, ...BUILT_IN_STORIES]);
    }
  }, []);

  // Save new custom story with StoryEngine validation
  const handleSaveCustomStory = (story: StoryData) => {
    const validation = StoryEngine.validateStory(story as unknown as Story);
    if (!validation.valid) {
      alert(`لا يمكن حفظ القصة: ${validation.errors.join('\n')}`);
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
      alert(`هذه القصة غير صالحة:\n${validation.errors.join('\n')}`);
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
    try {
      const newState = gameEngine.startNewGame(selectedStory as unknown as Story, playerNames);
      if (newState.phase === 'ROLE_PASS') {
        setCurrentScreen('role_pass');
      }
    } catch (error: any) {
      console.error('Failed to start game via GameEngine:', error);
      alert(error?.message || 'تعذر بدء اللعبة، يرجى التأكد من صحة إعدادات اللاعبين');
    }
  };

  const handleAdvanceRolePass = () => {
    const updatedState = gameEngine.advanceRolePass();
    if (updatedState.phase === 'DISCUSSION') {
      setCurrentScreen('free_discussion');
    }
  };

  const handleRevealNextEvidence = () => {
    gameEngine.revealNextEvidence();
  };

  const handleProceedToVoting = () => {
    setCurrentScreen('voting');
  };

  const handleCompleteVoting = (votes: Record<number, number>) => {
    try {
      gameEngine.resolveVotes(votes);
    } catch (e) {
      console.error('Error resolving votes via GameEngine', e);
    }
    setCurrentScreen('vote_result');
  };

  const handleProceedNextRound = () => {
    gameEngine.proceedAfterVoteResult();
    setCurrentScreen('free_discussion');
  };

  const handleProceedToTruth = (determinedWinner: 'innocents' | 'guilty') => {
    setCurrentScreen('killer_reveal');
  };

  const handleProceedToExplanation = () => {
    setCurrentScreen('crime_explanation');
  };

  const handleProceedToTruthReveal = () => {
    setCurrentScreen('reveal_truth');
  };

  const handleProceedToResults = () => {
    setCurrentScreen('results');
  };

  const handlePlayAgain = () => {
    gameEngine.resetToLobby();
    setCurrentScreen('story_select');
  };

  const handleNavigateHome = () => {
    gameEngine.resetToLobby();
    setCurrentScreen('home');
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
  const activeStory = (gameState.story as unknown as StoryData | null) || selectedStory;

  const customCount = stories.filter((s) => s.isCustom).length;

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-['Cairo',sans-serif]" dir="rtl">
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
                stories={stories}
                onSelectStory={handleSelectStory}
                onOpenCustomStoryModal={() => setShowCustomStoryModal(true)}
                onBack={() => setCurrentScreen('home')}
                onNavigateHome={handleNavigateHome}
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
                story={selectedStory}
                onProceedToSetup={handleProceedToSetup}
                onBack={() => setCurrentScreen('story_select')}
                onNavigateHome={handleNavigateHome}
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
                story={selectedStory}
                onConfirmPlayers={handleConfirmPlayers}
                onBack={() => setCurrentScreen('story_intro')}
                onNavigateHome={handleNavigateHome}
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
                onBack={() => {
                  gameEngine.resetRolePass();
                  setCurrentScreen('player_setup');
                }}
                onNavigateHome={handleNavigateHome}
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
                onRevealNextEvidence={handleRevealNextEvidence}
                hasMoreEvidence={gameEngine.hasMoreEvidence()}
                onProceedToVoting={handleProceedToVoting}
                onBack={handleNavigateHome}
                onNavigateHome={handleNavigateHome}
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
                story={selectedStory}
                players={players}
                votes={lastVotes}
                round={round}
                wrongVotesCount={wrongVotesCount}
                onProceedNextRound={handleProceedNextRound}
                onProceedToTruth={handleProceedToTruth}
                onBack={() => setCurrentScreen('voting')}
                onNavigateHome={handleNavigateHome}
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
                story={selectedStory}
                players={players}
                winner={winner}
                onProceedToExplanation={handleProceedToExplanation}
                onBack={() => setCurrentScreen('vote_result')}
                onNavigateHome={handleNavigateHome}
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
                story={selectedStory}
                players={players}
                onProceedToResults={handleProceedToTruthReveal}
                onBack={() => setCurrentScreen('killer_reveal')}
                onNavigateHome={handleNavigateHome}
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
                story={selectedStory}
                players={players}
                winner={winner}
                onProceedToResults={handleProceedToResults}
                onBack={() => setCurrentScreen('crime_explanation')}
                onNavigateHome={handleNavigateHome}
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
                story={selectedStory}
                players={players}
                winner={winner}
                votes={lastVotes}
                onPlayAgain={handlePlayAgain}
                onNavigateHome={handleNavigateHome}
                onBack={() => setCurrentScreen('reveal_truth')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <RulesModal
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      <CustomStoryModal
        isOpen={showCustomStoryModal}
        onClose={() => setShowCustomStoryModal(false)}
        onSaveStory={handleSaveCustomStory}
      />
    </div>
  );
}
