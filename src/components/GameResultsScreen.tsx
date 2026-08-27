import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, Skull, CheckCircle, ChevronLeft } from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';

interface GameResultsScreenProps {
  story: StoryData;
  players: PlayerData[];
  winner: 'innocents' | 'guilty';
  votes: Record<number, number>;
  onPlayAgain: () => void;
  onNavigateHome: () => void;
  onBack?: () => void;
  language?: 'ar' | 'en';
}

export const GameResultsScreen: React.FC<GameResultsScreenProps> = ({
  story,
  players,
  winner,
  votes,
  onPlayAgain,
  onNavigateHome,
  onBack,
  language = 'ar',
}) => {
  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  const guiltyPlayers = players.filter((p) => p.guilty);

  // Calculate vote stats
  const totalVotesCount = Object.keys(votes).length || players.length;
  const correctVotesCount = Object.entries(votes).filter(([voterId, targetId]) => {
    return guiltyPlayers.some((g) => g.id === targetId);
  }).length;

  useEffect(() => {
    sound.playGameOver(winner === 'innocents');
  }, [winner]);

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
            onClick={() => {
              sound.playClick();
              if (onBack) onBack();
              else onNavigateHome();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-center">
            <h1 className={`text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.finalResults}
            </h1>
            <p className={`text-xs sm:text-sm text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {t.gameOverHowDidYouDo}
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigateHome();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.home}
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Victory Celebration Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col items-center text-center"
        >
          {/* Victory Trophy Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#c8923a]/25 via-amber-600/10 to-red-500/20 border border-[#c8923a]/70 flex items-center justify-center mb-3 shadow-xl shadow-amber-950/40">
            {winner === 'innocents' ? (
              <Trophy className="w-10 h-10 text-[#f3cb79] animate-bounce" />
            ) : (
              <Skull className="w-10 h-10 text-red-500 animate-pulse" />
            )}
          </div>

          {/* Winner Title */}
          <h2
            className={`text-3xl sm:text-4xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} tracking-wide ${
              winner === 'innocents'
                ? 'text-[#f3cb79] drop-shadow-[0_2px_15px_rgba(243,203,121,0.5)]'
                : 'text-red-500 drop-shadow-[0_2px_15px_rgba(239,68,68,0.5)]'
            }`}
          >
            {winner === 'innocents' ? (isEn ? 'Innocents Won!' : 'فاز الأبرياء!') : (isEn ? 'Culprit Won!' : 'فاز القاتل!')}
          </h2>

          <p className={`text-xs sm:text-sm text-[#d4cfc7] font-medium mt-1.5 max-w-[320px] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
            {winner === 'innocents'
              ? t.innocentsWonDesc
              : t.killerWonDesc}
          </p>
        </motion.div>

        {/* Stats Box */}
        <div className="grid grid-cols-2 gap-3">
          {/* Stat 1: Guilty Identity/List */}
          <div className="p-4 rounded-[20px] bg-[#0d0f16] border border-[#7a5c2b]/50 flex flex-col items-center justify-center text-center shadow-md">
            <span className={`text-xs text-[#a39a8c] font-bold mb-1 flex items-center gap-1 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
              <Skull className="w-3.5 h-3.5 text-red-400" /> {guiltyPlayers.length > 1 ? t.theCulpritsWere : t.theCulpritWas}
            </span>
            <div className="flex flex-col gap-0.5">
              {guiltyPlayers.map((g) => (
                <span key={g.id} className={`text-xs sm:text-sm font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-red-400 truncate max-w-[140px]`}>
                  {g.character.name} ({g.name})
                </span>
              ))}
            </div>
          </div>

          {/* Stat 2: Correct Votes */}
          <div className="p-4 rounded-[20px] bg-[#0d0f16] border border-[#7a5c2b]/50 flex flex-col items-center justify-center text-center shadow-md">
            <span className={`text-xs text-[#a39a8c] font-bold mb-1 flex items-center gap-1 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {t.correctVotes}
            </span>
            <span className={`text-base sm:text-lg font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9]`}>
              {correctVotesCount} / {totalVotesCount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          {/* Play Again */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer`}
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>{t.playNewCase}</span>
          </motion.button>

          {/* Home */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onNavigateHome();
            }}
            className={`w-full rounded-[24px] py-3.5 px-6 bg-black/60 border border-[#c8923a]/60 hover:border-[#f3cb79] text-[#f3cb79] font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer`}
          >
            <Home className="w-4 h-4" />
            <span>{t.returnToMainMenu}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
