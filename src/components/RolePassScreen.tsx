import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Lock, ArrowLeft, User, ChevronLeft, Home, MessageSquareQuote, BadgeCheck, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Player } from '../game/types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface RolePassScreenProps {
  players: Player[];
  currentViewingIndex: number;
  onAdvanceRolePass: () => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
}

export const RolePassScreen: React.FC<RolePassScreenProps> = ({
  players,
  currentViewingIndex,
  onAdvanceRolePass,
  onBack,
  onNavigateHome,
  language = 'ar',
}) => {
  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'back' | 'home' | null>(null);

  const currentPlayer = players[currentViewingIndex] || players[0];
  const isLastPlayer = currentViewingIndex >= players.length - 1;
  const totalPlayers = players.length;

  const handleReveal = () => {
    sound.playRoleReveal();
    setIsRevealed(true);
  };

  const handleAdvance = () => {
    sound.playClick();
    setIsRevealed(false);
    onAdvanceRolePass();
  };

  const handleGoBack = () => {
    sound.playClick();
    if (isRevealed) {
      // Safely conceal the character without rewinding or exposing other players
      setIsRevealed(false);
      return;
    }

    if (currentViewingIndex === 0) {
      // Safe to return to setup before any player has completed role viewing
      if (onBack) onBack();
    } else {
      // Protect active role distribution from accidental rewinds
      setPendingAction('back');
      setShowConfirmModal(true);
    }
  };

  const handleHomeClick = () => {
    sound.playClick();
    if (currentViewingIndex === 0 && !isRevealed) {
      if (onNavigateHome) onNavigateHome();
    } else {
      if (isRevealed) setIsRevealed(false);
      setPendingAction('home');
      setShowConfirmModal(true);
    }
  };

  const handleConfirmAbandon = () => {
    sound.playClick();
    setShowConfirmModal(false);
    setIsRevealed(false);
    if (pendingAction === 'home' && onNavigateHome) {
      onNavigateHome();
    } else if (onBack) {
      onBack();
    }
  };

  const handleCancelAbandon = () => {
    sound.playClick();
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  if (!currentPlayer) {
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
            title={isRevealed ? (isEn ? 'Hide character' : 'إخفاء الشخصية') : t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-center">
            <h1 className={`text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.characterCard}
            </h1>
            <p className={`text-xs sm:text-sm text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {isEn ? `Player ${currentViewingIndex + 1} of ${totalPlayers}` : `لاعب ${currentViewingIndex + 1} من ${totalPlayers}`}
            </p>
          </div>

          {/* Right Actions: Step Progress Indicators + Home Button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2">
              {players.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentViewingIndex
                      ? 'w-5 bg-[#f3cb79] shadow-[0_0_10px_rgba(243,203,121,0.6)]'
                      : i < currentViewingIndex
                      ? 'w-2 bg-[#c8923a]/60'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleHomeClick}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
              title={t.home}
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* Step 1: Pass Phone State (Neutral for all players) */
            <motion.div
              key={`pass-phone-${currentPlayer.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="my-auto flex flex-col items-center text-center p-6 sm:p-8 rounded-[28px] bg-[#0d0f16] border border-[#7a5c2b]/50 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#c8923a]/25 via-amber-900/20 to-black/40 border border-[#c8923a]/60 flex items-center justify-center mb-4 shadow-xl shadow-amber-950/40">
                <Lock className="w-9 h-9 text-[#f3cb79] animate-pulse" />
              </div>

              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/60 text-[#f3cb79] border border-[#c8923a]/40 mb-3 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {t.storyRolesDistribution}
              </span>

              <h3 className={`text-lg font-bold text-[#c4beb3] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {t.passDeviceTo}
              </h3>

              <div className="my-3 px-8 py-3.5 rounded-[22px] bg-gradient-to-r from-amber-500/15 via-[#c8923a]/25 to-amber-500/15 border border-[#c8923a]/70 shadow-inner">
                <h2 className={`text-3xl font-black text-[#f5ebd9] ${isRtl ? "font-['Cairo']" : 'font-sans'} drop-shadow-md`}>
                  {currentPlayer.name}
                </h2>
              </div>

              <p className={`text-xs sm:text-sm text-[#e2d8c7] font-medium max-w-[340px] leading-relaxed mt-2 bg-black/50 p-3.5 rounded-2xl border border-amber-900/35 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                {t.ensureNoOneLookingCard}
              </p>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReveal}
                className={`mt-6 w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer`}
              >
                <Eye className="w-5 h-5 stroke-[2.5]" />
                <span>{t.revealRole}</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Step 2: Private Character Card */
            <motion.div
              key={`revealed-${currentPlayer.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="my-auto flex flex-col gap-4"
            >
              {/* Identity Card */}
              <div className="rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/55 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col gap-4">
                
                {/* Header: Player badge, Character Name, Profession */}
                <div className="flex items-center justify-between border-b border-amber-900/30 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-3xl shadow-md transition-all ${
                        currentPlayer.guilty
                          ? 'bg-gradient-to-br from-red-950/60 to-[#0d0f16] border-red-500/70 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                          : 'bg-gradient-to-br from-[#1c2132] to-[#0d0f16] border-[#c8923a]/60 text-[#f3cb79]'
                      }`}
                    >
                      <User className={`w-7 h-7 ${currentPlayer.guilty ? 'text-red-400' : 'text-[#f3cb79]'}`} />
                    </div>
                    <div>
                      <h3
                        className={`text-xl sm:text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} leading-tight transition-colors ${
                          currentPlayer.guilty
                            ? 'text-red-400 drop-shadow-[0_2px_10px_rgba(239,68,68,0.35)]'
                            : 'text-[#f5ebd9]'
                        }`}
                      >
                        {currentPlayer.character.name}
                      </h3>
                      <span
                        className={`text-xs sm:text-sm font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} ${
                          currentPlayer.guilty ? 'text-red-300/90' : 'text-[#e5b35a]'
                        }`}
                      >
                        {currentPlayer.character.profession}
                      </span>
                    </div>
                  </div>

                  {/* Player Indicator */}
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} shadow-md flex items-center gap-1.5 transition-all ${
                      currentPlayer.guilty
                        ? 'border-red-500/80 bg-red-950/70 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                        : 'border-[#c8923a]/50 bg-black/60 text-[#f3cb79]'
                    }`}
                  >
                    <BadgeCheck className={`w-4 h-4 ${currentPlayer.guilty ? 'text-red-400' : 'text-[#e5b35a]'}`} />
                    <span className={currentPlayer.guilty ? 'text-red-400 font-black' : ''}>{currentPlayer.name}</span>
                  </div>
                </div>

                {/* Public Identity */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
                  <span className={`text-xs font-black text-[#e5b35a] ${isRtl ? "font-['Cairo']" : 'font-sans'} flex items-center gap-1.5 mb-1`}>
                    <FileText className="w-3.5 h-3.5 text-[#c8923a]" />
                    <span>{t.knownIdentityToAll}</span>
                  </span>
                  <p className={`text-xs sm:text-sm text-[#d4cfc7] font-medium leading-relaxed ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                    {currentPlayer.character.publicIdentity}
                  </p>
                </div>

                {/* Narrative Testimony / Character Story Information */}
                <div className="p-4 rounded-2xl bg-[#121520] border border-[#c8923a]/40 text-[#f5ebd9]">
                  <span className={`text-xs sm:text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} flex items-center gap-1.5 mb-1.5 text-[#f3cb79]`}>
                    <MessageSquareQuote className="w-4 h-4 text-[#c8923a]" />
                    <span>{t.testimonyAndKnowledge}</span>
                  </span>
                  <p className={`text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-normal ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                    {currentPlayer.character.knowledge}
                  </p>
                </div>

                {/* Private Hidden Role Notice */}
                {currentPlayer.guilty && (
                  <div
                    data-testid="private-guilty-indicator"
                    className="p-4 rounded-2xl bg-[#200b0b] border-2 border-red-600/70 text-[#fecaca] shadow-[0_0_20px_rgba(220,38,38,0.2)] flex flex-col gap-1.5"
                  >
                    <div className={`flex items-center gap-2 text-red-400 font-black text-sm ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                      <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
                      <span>{t.secretRoleWarning}</span>
                    </div>
                    <p className={`text-sm font-black text-white ${isRtl ? "font-['Cairo']" : 'font-sans'} leading-snug`}>
                      {t.youAreTheCulprit}
                    </p>
                  </div>
                )}

                {/* Investigation Guidance */}
                <div className={`p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-[#a39a8c] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                  {t.keepDetailsGuidance}
                </div>
              </div>

              {/* Confirm & Next Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAdvance}
                className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer`}
              >
                <span>{isLastPlayer ? t.finishPassingStartDiscussion : t.iMemorizedPassDevice}</span>
                <ArrowLeft className={`w-5 h-5 stroke-[2.5] ${isRtl ? '' : 'rotate-180'}`} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal to Protect Role-Pass from Accidental Rewinds */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-sm rounded-[28px] bg-[#0e1118] border border-[#c8923a]/60 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className={`text-xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
                    {isEn ? 'Cancel Role Distribution?' : 'إلغاء توزيع الأدوار؟'}
                  </h3>
                  <p className={`text-xs sm:text-sm text-[#b8b3a7] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} leading-relaxed`}>
                    {isEn ? 'Some players have already seen their identities. Exiting now will cancel this session and require starting over.' : 'بدأ بعض اللاعبين بالاطلاع على شخصياتهم بالفعل. العودة الآن ستلغي الجلسة الحالية وتتطلب إعادة توزيع الأدوار من جديد.'}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-2.5 mt-2">
                  <button
                    onClick={handleCancelAbandon}
                    className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-sm hover:brightness-105 transition-all cursor-pointer`}
                  >
                    {isEn ? 'Continue Distribution' : 'متابعة التوزيع'}
                  </button>

                  <button
                    onClick={handleConfirmAbandon}
                    className={`w-full py-3 rounded-xl bg-black/50 border border-red-900/50 text-red-400 hover:bg-red-950/40 font-bold ${isRtl ? "font-['Cairo']" : 'font-sans'} text-xs transition-all cursor-pointer`}
                  >
                    {isEn ? 'Confirm & Exit' : 'تأكيد الإلغاء والرجوع'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
