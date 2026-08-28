import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vote, Lock, CheckCircle2, ChevronLeft, ArrowLeft, Home, AlertCircle, Zap } from 'lucide-react';
import { PlayerData } from '../types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface VotingScreenProps {
  players: PlayerData[];
  round: number;
  onCompleteVoting: (votes: Record<number, number>) => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
  secretBallotMode?: boolean;
  fastVotingMode?: boolean;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  players,
  round,
  onCompleteVoting,
  onBack,
  onNavigateHome,
  language = 'ar',
  secretBallotMode = false,
  fastVotingMode = false,
}) => {
  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  // Only living (non-eliminated) players participate in voting
  const activePlayers = players.filter((p) => !p.eliminated);
  const [currentVoterIdx, setCurrentVoterIdx] = useState<number>(0);
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [isPassReady, setIsPassReady] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [collectedVotes, setCollectedVotes] = useState<Record<number, number>>({});

  const currentVoter = activePlayers[currentVoterIdx];
  // Eligible targets: all living players except the current voter (self-voting prohibited)
  const eligibleTargets = activePlayers.filter((p) => p.id !== currentVoter?.id);
  const isLastVoter = currentVoterIdx === activePlayers.length - 1;

  const selectedTarget = activePlayers.find((p) => p.id === selectedTargetId);

  const handleStartVote = () => {
    sound.playClick();
    setIsPassReady(true);
    setSelectedTargetId(null);
    setIsConfirming(false);
  };

  const handleSelectSuspect = (targetId: number) => {
    if (fastVotingMode) {
      if (!currentVoter) return;
      sound.playVoteConfirm();

      const newVotes = {
        ...collectedVotes,
        [currentVoter.id]: targetId,
      };
      setCollectedVotes(newVotes);

      if (isLastVoter) {
        onCompleteVoting(newVotes);
      } else {
        setIsPassReady(false);
        setIsConfirming(false);
        setSelectedTargetId(null);
        setCurrentVoterIdx((prev) => prev + 1);
      }
    } else {
      sound.playClick();
      setSelectedTargetId(targetId);
    }
  };

  const handleProceedToConfirmation = () => {
    if (selectedTargetId === null) return;
    sound.playClick();
    setIsConfirming(true);
  };

  const handleChangeVote = () => {
    sound.playClick();
    setIsConfirming(false);
  };

  const handleFinalConfirmVote = () => {
    if (selectedTargetId === null || !currentVoter) return;
    sound.playVoteConfirm();

    const newVotes = {
      ...collectedVotes,
      [currentVoter.id]: selectedTargetId,
    };
    setCollectedVotes(newVotes);

    if (isLastVoter) {
      onCompleteVoting(newVotes);
    } else {
      setIsPassReady(false);
      setIsConfirming(false);
      setSelectedTargetId(null);
      setCurrentVoterIdx((prev) => prev + 1);
    }
  };

  const handleGoBack = () => {
    sound.playClick();
    if (isConfirming) {
      setIsConfirming(false);
    } else if (isPassReady) {
      setIsPassReady(false);
      setSelectedTargetId(null);
    } else if (currentVoterIdx > 0) {
      setCurrentVoterIdx((prev) => prev - 1);
      setIsPassReady(false);
      setIsConfirming(false);
      setSelectedTargetId(null);
    } else if (onBack) {
      onBack();
    }
  };

  if (!currentVoter) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Subtle Gradient & Ambient Noir Vignettes */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0e1117] via-[#090b0f] to-[#050608] pointer-events-none" />
      <div className="fixed top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(200,146,58,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Page Container */}
      <div className="relative z-10 w-full max-w-xl flex flex-col gap-5">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full pt-2 pb-1 border-b border-amber-900/20">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-center">
            <h1 className={`text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.votingAccusation}
            </h1>
            <p className={`text-xs sm:text-sm text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {isEn 
                ? `Vote ${currentVoterIdx + 1} of ${activePlayers.length} • Round ${round}` 
                : `صوت ${currentVoterIdx + 1} من ${activePlayers.length} • الجولة ${round}`}
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              if (onNavigateHome) onNavigateHome();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.home}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!isPassReady ? (
            /* Step 1: Pass Phone State */
            <motion.div
              key="pass-phone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="my-auto flex flex-col items-center text-center p-6 sm:p-8 rounded-[28px] bg-[#0d0f16] border border-[#7a5c2b]/50 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#c8923a]/20 to-red-600/20 border border-[#c8923a]/60 flex items-center justify-center mb-4 shadow-xl shadow-amber-950/40">
                <Lock className="w-9 h-9 text-[#f3cb79]" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/60 text-[#f3cb79] border border-[#c8923a]/40 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {secretBallotMode ? t.secretBallotActiveBadge : t.publicBallotActiveBadge}
                </span>
                {fastVotingMode && (
                  <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-500/20 text-[#f3cb79] border border-amber-500/50 flex items-center gap-1 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                    <Zap className="w-3.5 h-3.5" />
                    <span>{t.fastVoting}</span>
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-bold text-[#c4beb3] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {t.passDeviceToVoter}
              </h3>

              <div className="my-3 px-8 py-3.5 rounded-[22px] bg-gradient-to-r from-amber-500/15 via-[#c8923a]/25 to-amber-500/15 border border-[#c8923a]/70 shadow-inner">
                <h2 className={`text-3xl font-black text-[#f5ebd9] ${isRtl ? "font-['Cairo']" : 'font-sans'} drop-shadow-md`}>
                  {currentVoter.name}
                </h2>
                <span className={`text-xs text-[#e5b35a] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-1 block`}>
                  ({currentVoter.character.name} • {currentVoter.character.profession})
                </span>
              </div>

              <p className={`text-xs sm:text-sm text-[#a39a8c] font-medium max-w-[320px] leading-relaxed mt-2 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {t.ensureNoOneLooking}
              </p>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartVote}
                className={`mt-6 w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer`}
              >
                <Vote className="w-5 h-5 stroke-[2.5]" />
                <span>{t.readyToVote}</span>
              </motion.button>
            </motion.div>
          ) : isConfirming && selectedTarget ? (
            /* Step 3: Vote Confirmation */
            <motion.div
              key="vote-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="my-auto flex flex-col items-center text-center p-6 sm:p-8 rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/60 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-950/30 border border-red-500/50 flex items-center justify-center mb-3 shadow-lg">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>

              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/60 text-[#f3cb79] border border-[#c8923a]/40 mb-2 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {isEn ? 'Final Accusation Confirmation ⚖️' : 'تأكيد الاتهام النهائي ⚖️'}
              </span>

              <h3 className={`text-sm sm:text-base font-bold text-[#c4beb3] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {isEn ? 'Your formal accusation is aimed at:' : 'اتهامك الرسمي موجه ضد:'}
              </h3>

              {/* Accused Target Card */}
              <div className="my-4 w-full p-4 rounded-[22px] bg-red-950/20 border-2 border-red-500/60 flex flex-col items-center">
                <span className={`text-xs text-red-400 font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} mb-1`}>
                  {t.selectedSuspect}
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black text-[#f5ebd9] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {selectedTarget.character.name}
                </h2>
                <span className={`text-xs sm:text-sm text-[#e5b35a] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-1`}>
                  {isEn ? `Player: ${selectedTarget.name} • ${selectedTarget.character.profession}` : `اللاعب: ${selectedTarget.name} • ${selectedTarget.character.profession}`}
                </span>
              </div>

              <p className={`text-xs text-[#a39a8c] font-medium max-w-[320px] leading-relaxed mb-6 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {t.voteLockWarning}
              </p>

              {/* Action Buttons: Confirm vs Change Vote */}
              <div className="w-full flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleFinalConfirmVote}
                  className={`w-full rounded-[22px] py-3.5 px-6 bg-gradient-to-r from-red-600 via-red-500 to-amber-600 text-white font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base shadow-[0_6px_22px_rgba(220,38,38,0.35)] hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  <span>{t.confirmVoteFinal}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangeVote}
                  className={`w-full rounded-[22px] py-3 px-6 bg-black/60 border border-[#c8923a]/60 hover:border-[#f3cb79] text-[#f3cb79] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} text-sm flex items-center justify-center gap-2 cursor-pointer`}
                >
                  <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  <span>{t.changeSelection}</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Step 2: Suspects Selection List */
            <motion.div
              key="vote-selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="my-auto flex flex-col gap-3.5"
            >
              {/* Current voter indicator */}
              <div className={`p-3.5 rounded-2xl bg-[#0d0f16] border border-[#c8923a]/40 flex items-center justify-between text-xs sm:text-sm ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                <span className="font-black text-[#f3cb79]">
                  {isEn ? `Voter: ${currentVoter.name} (${currentVoter.character.name})` : `دور: ${currentVoter.name} (${currentVoter.character.name})`}
                </span>
                <span className="text-xs text-[#a39a8c] font-medium flex items-center gap-1">
                  {fastVotingMode ? (
                    <span className="text-[#f3cb79] font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{t.fastVoting}</span>
                    </span>
                  ) : (
                    <span>{secretBallotMode ? t.secretVoteIndicator : t.publicVoteIndicator}</span>
                  )}
                </span>
              </div>

              {/* Fast Vote Banner when active */}
              {fastVotingMode && (
                <div className={`px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-[#f3cb79] font-bold flex items-center gap-2 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>{t.fastVoteOneTapHint}</span>
                </div>
              )}

              {/* Suspects list */}
              <div className="flex flex-col gap-2.5 max-h-[48vh] overflow-y-auto pr-1 custom-scrollbar">
                {eligibleTargets.map((target) => {
                  const isSelected = selectedTargetId === target.id;
                  return (
                    <motion.div
                      key={target.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectSuspect(target.id)}
                      className={`p-3.5 sm:p-4 rounded-[22px] border transition-all cursor-pointer flex items-center justify-between shadow-md ${
                        isSelected
                          ? 'bg-[#2a130f] border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                          : 'bg-[#0d0f16] border-[#7a5c2b]/50 hover:border-[#c8923a]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md border ${
                            isSelected
                              ? 'bg-red-600/30 border-red-500 text-red-400'
                              : 'bg-black/60 border-[#7a5c2b]/60 text-[#f3cb79]'
                          }`}
                        >
                          👤
                        </div>
                        <div>
                          <h4 className={`text-base sm:text-lg font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] leading-tight`}>
                            {target.name}
                          </h4>
                          <span className={`text-xs text-[#e5b35a] font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                            {target.character.name} • {target.character.profession}
                          </span>
                        </div>
                      </div>

                      {fastVotingMode ? (
                        <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-red-500/50 hover:border-amber-400 text-xs font-black text-[#f3cb79] flex items-center gap-1.5 shadow-sm transition-all ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                          <Vote className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Vote' : 'تصويت'}</span>
                        </div>
                      ) : (
                        <div
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-red-600 border-red-400 text-white'
                              : 'border-slate-700 bg-black/40'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Proceed to Confirmation CTA (Only shown when fast voting is OFF) */}
              {!fastVotingMode && (
                <motion.button
                  disabled={selectedTargetId === null}
                  whileHover={{ scale: selectedTargetId !== null ? 1.015 : 1 }}
                  whileTap={{ scale: selectedTargetId !== null ? 0.98 : 1 }}
                  onClick={handleProceedToConfirmation}
                  className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all cursor-pointer`}
                >
                  <span>{t.proceedToConfirm}</span>
                  <ArrowLeft className={`w-5 h-5 stroke-[2.5] ${isRtl ? '' : 'rotate-180'}`} />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


