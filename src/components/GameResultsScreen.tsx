import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, Skull, CheckCircle, ChevronLeft } from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { sound } from '../utils/audio';

interface GameResultsScreenProps {
  story: StoryData;
  players: PlayerData[];
  winner: 'innocents' | 'guilty';
  votes: Record<number, number>;
  onPlayAgain: () => void;
  onNavigateHome: () => void;
  onBack?: () => void;
}

export const GameResultsScreen: React.FC<GameResultsScreenProps> = ({
  story,
  players,
  winner,
  votes,
  onPlayAgain,
  onNavigateHome,
  onBack,
}) => {
  const guiltyPlayers = players.filter((p) => p.guilty);
  const killer = guiltyPlayers[0] || players[0];

  // Calculate vote stats
  const totalVotesCount = Object.keys(votes).length || players.length;
  const correctVotesCount = Object.entries(votes).filter(([voterId, targetId]) => {
    return guiltyPlayers.some((g) => g.id === targetId);
  }).length;

  useEffect(() => {
    sound.playGameOver(winner === 'innocents');
  }, [winner]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-[#07080c] select-none text-slate-100 pb-16 pt-4 px-3 sm:px-6" dir="rtl">
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
            title="رجوع"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.4] rtl:rotate-180" />
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              النتائج النهائية
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              انتهت اللعبة! كيف كان أداؤكم؟
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigateHome();
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="الرئيسية"
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
            className={`text-3xl sm:text-4xl font-black font-['Cairo'] tracking-wide ${
              winner === 'innocents'
                ? 'text-[#f3cb79] drop-shadow-[0_2px_15px_rgba(243,203,121,0.5)]'
                : 'text-red-500 drop-shadow-[0_2px_15px_rgba(239,68,68,0.5)]'
            }`}
          >
            {winner === 'innocents' ? 'فاز الأبرياء!' : 'فاز القاتل!'}
          </h2>

          <p className="text-xs sm:text-sm text-[#d4cfc7] font-medium mt-1.5 max-w-[320px] font-['Cairo']">
            {winner === 'innocents'
              ? 'تم كشف هوية الجاني بنجاح وتحقيق العدالة.'
              : 'تمكن القاتل من تضليل الجميع والإفلات من العقاب!'}
          </p>
        </motion.div>

        {/* Stats Box */}
        <div className="grid grid-cols-2 gap-3">
          {/* Stat 1: Killer Identity */}
          <div className="p-4 rounded-[20px] bg-[#0d0f16] border border-[#7a5c2b]/50 flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-xs text-[#a39a8c] font-bold mb-1 flex items-center gap-1 font-['Cairo']">
              <Skull className="w-3.5 h-3.5 text-red-400" /> القاتل كان
            </span>
            <span className="text-base sm:text-lg font-black font-['Cairo'] text-red-400 truncate max-w-[140px]">
              {killer.character.name} ({killer.name})
            </span>
          </div>

          {/* Stat 2: Correct Votes */}
          <div className="p-4 rounded-[20px] bg-[#0d0f16] border border-[#7a5c2b]/50 flex flex-col items-center justify-center text-center shadow-md">
            <span className="text-xs text-[#a39a8c] font-bold mb-1 flex items-center gap-1 font-['Cairo']">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> أصوات صحيحة
            </span>
            <span className="text-base sm:text-lg font-black font-['Cairo'] text-[#f5ebd9]">
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
            className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>لعب قضية جديدة</span>
          </motion.button>

          {/* Home */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onNavigateHome();
            }}
            className="w-full rounded-[24px] py-3.5 px-6 bg-black/60 border border-[#c8923a]/60 hover:border-[#f3cb79] text-[#f3cb79] font-black font-['Cairo'] text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>العودة للقائمة الرئيسية</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
