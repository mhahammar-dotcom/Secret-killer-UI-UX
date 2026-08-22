import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Lock, CheckCircle2, ArrowLeft, Shield, ShieldAlert, User, KeyRound, Sparkles, ChevronLeft, Home } from 'lucide-react';
import { PlayerData } from '../types';
import { sound } from '../utils/audio';

interface SecretRoleScreenProps {
  players: PlayerData[];
  onFinishRoles: () => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
}

export const SecretRoleScreen: React.FC<SecretRoleScreenProps> = ({
  players,
  onFinishRoles,
  onBack,
  onNavigateHome,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const currentPlayer = players[currentIndex];
  const isLastPlayer = currentIndex === players.length - 1;

  const handleReveal = () => {
    sound.playRoleReveal();
    setIsRevealed(true);
  };

  const handleNextPlayer = () => {
    sound.playClick();
    setIsRevealed(false);
    if (isLastPlayer) {
      onFinishRoles();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGoBack = () => {
    sound.playClick();
    if (isRevealed) {
      setIsRevealed(false);
    } else if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsRevealed(false);
    } else if (onBack) {
      onBack();
    }
  };

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
            onClick={handleGoBack}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title="رجوع"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.4] rtl:rotate-180" />
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-black font-['Cairo'] text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md">
              دورك السري
            </h1>
            <p className="text-xs sm:text-sm text-[#9b988f] font-medium font-['Cairo'] mt-0.5">
              لاعب {currentIndex + 1} من {players.length}
            </p>
          </div>

          {/* Right Actions: Progress Indicators + Home Button */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2">
              {players.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-5 bg-[#f3cb79] shadow-[0_0_10px_rgba(243,203,121,0.6)]'
                      : i < currentIndex
                      ? 'w-2 bg-[#4ade80]'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                sound.playClick();
                if (onNavigateHome) onNavigateHome();
              }}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
              title="الرئيسية"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* Step 1: Pass Phone State */
            <motion.div
              key="pass-phone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="my-auto flex flex-col items-center text-center p-6 sm:p-8 rounded-[28px] bg-[#0d0f16] border border-[#7a5c2b]/50 shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#c8923a]/20 to-red-600/20 border border-[#c8923a]/60 flex items-center justify-center mb-4 shadow-xl shadow-amber-950/40">
                <Lock className="w-9 h-9 text-[#f3cb79] animate-pulse" />
              </div>

              <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-black/60 text-[#f3cb79] border border-[#c8923a]/40 mb-3 font-['Cairo']">
                توزيع الأدوار بالسرية التامة 🔒
              </span>

              <h3 className="text-lg font-bold text-[#c4beb3] font-['Cairo']">
                مرر الهاتف إلى:
              </h3>

              <div className="my-3 px-8 py-3.5 rounded-[22px] bg-gradient-to-r from-amber-500/15 via-[#c8923a]/25 to-amber-500/15 border border-[#c8923a]/70 shadow-inner">
                <h2 className="text-3xl font-black text-[#f5ebd9] font-['Cairo'] drop-shadow-md">
                  {currentPlayer.name}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-red-300 font-medium max-w-[320px] leading-relaxed mt-2 bg-red-950/40 p-3.5 rounded-2xl border border-red-500/30 font-['Cairo']">
                ⚠️ لا تسمح لأي شخص برؤية الشاشة. اضغط للكشف عندما تصبح وحدك تماماً.
              </p>

              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReveal}
                className="mt-6 w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <Eye className="w-5 h-5 stroke-[2.5]" />
                <span>انقر للكشف السري</span>
              </motion.button>
            </motion.div>
          ) : (
            /* Step 2: Role Revealed Card */
            <motion.div
              key="revealed-role"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="my-auto flex flex-col gap-4"
            >
              {/* Identity Card */}
              <div className="rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/55 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col gap-4">
                
                {/* Header with Avatar, Name, Profession, Alignment */}
                <div className="flex items-center justify-between border-b border-amber-900/30 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1c2132] to-[#0d0f16] border border-[#c8923a]/50 flex items-center justify-center text-3xl shadow-md">
                      {currentPlayer.guilty ? '🕵️‍♂️' : '👤'}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-[#f5ebd9] font-['Cairo'] leading-tight">
                        {currentPlayer.character.name}
                      </h3>
                      <span className="text-xs sm:text-sm text-[#e5b35a] font-bold font-['Cairo']">
                        {currentPlayer.character.profession}
                      </span>
                    </div>
                  </div>

                  {/* Alignment Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-black font-['Cairo'] shadow-md flex items-center gap-1.5 ${
                      currentPlayer.guilty
                        ? 'bg-[#c52222]/25 border-red-500/60 text-red-400'
                        : 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                    }`}
                  >
                    {currentPlayer.guilty ? <ShieldAlert className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    <span>{currentPlayer.guilty ? 'القاتل (مذنب)' : 'بريء'}</span>
                  </div>
                </div>

                {/* Public Identity */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-[#7a5c2b]/40">
                  <span className="text-xs font-black text-[#e5b35a] font-['Cairo'] block mb-1">
                    هويتك المعروفة للجميع:
                  </span>
                  <p className="text-xs sm:text-sm text-[#d4cfc7] font-medium leading-relaxed font-['Cairo']">
                    {currentPlayer.character.publicIdentity}
                  </p>
                </div>

                {/* Secret Knowledge */}
                <div
                  className={`p-4 rounded-2xl border ${
                    currentPlayer.guilty
                      ? 'bg-red-950/30 border-red-500/40 text-red-200'
                      : 'bg-[#121520] border-[#c8923a]/40 text-[#f5ebd9]'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-black font-['Cairo'] flex items-center gap-1.5 mb-1.5 text-[#f3cb79]">
                    <KeyRound className="w-4 h-4 text-[#c8923a]" />
                    <span>ما تعرفه سراً عن الحادثة:</span>
                  </span>
                  <p className="text-xs sm:text-sm text-[#d4cfc7] leading-relaxed font-normal font-['Cairo']">
                    {currentPlayer.character.knowledge}
                  </p>
                </div>

                {/* Objective Advice */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 text-xs text-[#a39a8c] font-['Cairo']">
                  {currentPlayer.guilty
                    ? '💡 نصيحة: تظاهر بالبراءة، وجه أصابع الاتهام لغيرك، واستغل تفاصيل مسرح الجريمة لتبرير غيابك.'
                    : '💡 نصيحة: قارن بين روايات الحاضرين، ابحث عن التناقضات الزمنية في أحاديثهم لكشف الجاني.'}
                </div>
              </div>

              {/* Confirm & Next Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextPlayer}
                className="w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black font-['Cairo'] text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                <span>{isLastPlayer ? 'إنهاء التوزيع وبدء التحقيق' : 'حفظت معلوماتي - التالي'}</span>
                <ArrowLeft className="w-5 h-5 stroke-[2.5] rtl:rotate-0" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
