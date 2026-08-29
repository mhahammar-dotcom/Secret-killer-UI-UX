import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, ChevronLeft, Home } from 'lucide-react';
import { StoryData, PlayerData } from '../types';
import { sound } from '../utils/audio';
import { AR_STRINGS, EN_STRINGS } from '../data/translations';
import { StorySolutionEngine } from '../game/StorySolutionEngine';

interface RevealTruthScreenProps {
  story: StoryData;
  players: PlayerData[];
  winner: 'innocents' | 'guilty';
  onProceedToResults: () => void;
  onBack?: () => void;
  onNavigateHome?: () => void;
  language?: 'ar' | 'en';
}

export const RevealTruthScreen: React.FC<RevealTruthScreenProps> = ({
  story,
  players,
  winner,
  onProceedToResults,
  onBack,
  onNavigateHome,
  language = 'ar',
}) => {
  const isEn = language === 'en';
  const t = isEn ? EN_STRINGS : AR_STRINGS;
  const isRtl = !isEn;

  const guiltyPlayers = players.filter((p) => p.guilty);
  const innocentPlayers = players.filter((p) => !p.guilty);
  const solutionText = StorySolutionEngine.generateSolution(
    story,
    guiltyPlayers,
    innocentPlayers,
    language
  );

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
            }}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-[#c8923a]/70 text-[#e5b35a] flex items-center justify-center hover:bg-black/90 hover:border-[#f3cb79] transition-all cursor-pointer active:scale-95 shadow-lg shadow-black/80"
            title={t.back}
          >
            <ChevronLeft className={`w-6 h-6 stroke-[2.4] ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <div className="text-center">
            <h1 className={`text-2xl font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f5ebd9] tracking-wide leading-tight drop-shadow-md`}>
              {t.theFullTruth}
            </h1>
            <p className={`text-xs sm:text-sm text-[#9b988f] font-medium ${isRtl ? "font-['Cairo']" : 'font-sans'} mt-0.5`}>
              {isEn ? `Solving the mystery of ${story.title}` : `حل لغز ${story.title}`}
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

        {/* Narrative Box */}
        <div className="rounded-[28px] bg-[#0d0f16] border-2 border-[#c8923a]/50 p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col gap-3.5 max-h-[54vh] overflow-y-auto pr-1 custom-scrollbar">
          <div className="flex items-center gap-2 border-b border-amber-900/30 pb-3">
            <Sparkles className="w-5 h-5 text-[#f3cb79]" />
            <h3 className={`text-sm sm:text-base font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-[#f3cb79]`}>
              {t.investigationSummaryConfessions}
            </h3>
          </div>

          <div className={`text-xs sm:text-sm text-[#f5ebd9] leading-relaxed font-normal whitespace-pre-line bg-black/40 p-4 rounded-2xl border border-[#7a5c2b]/40 ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
            {solutionText}
          </div>

          {/* All Players Identity Lineup */}
          <div className="mt-2 pt-3 border-t border-amber-900/30">
            <span className={`text-xs sm:text-sm font-black text-[#e5b35a] ${isRtl ? "font-['Cairo']" : 'font-sans'} block mb-2.5`}>
              {t.realPlayerIdentities}
            </span>

            <div className="flex flex-col gap-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs sm:text-sm ${
                    player.guilty
                      ? 'bg-red-950/35 border-red-500/50 text-red-200'
                      : 'bg-black/40 border-[#7a5c2b]/40 text-[#d4cfc7]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`font-bold text-[#f5ebd9] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                      {player.name}
                    </span>
                    <span className={`text-xs text-[#a39a8c] ${isRtl ? "font-['Cairo']" : 'font-sans'}`}>
                      ({player.character.name} • {player.character.profession})
                    </span>
                  </div>

                  <span
                    className={`font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} px-2.5 py-1 rounded-xl text-xs ${
                      player.guilty
                        ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                        : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {player.guilty ? (isEn ? '🔴 Guilty (Culprit)' : '🔴 مذنب (القاتل)') : (isEn ? '🟢 Innocent' : '🟢 بريء')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA to Results Screen */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playClick();
              onProceedToResults();
            }}
            className={`w-full rounded-[24px] py-4 px-6 bg-gradient-to-r from-[#d49e3d] via-[#f1bf66] to-[#c8923a] text-slate-950 font-black ${isRtl ? "font-['Cairo']" : 'font-sans'} text-base sm:text-lg shadow-[0_6px_22px_rgba(200,146,58,0.3)] hover:brightness-105 flex items-center justify-center gap-3 transition-all cursor-pointer`}
          >
            <Trophy className="w-5 h-5 fill-slate-950 stroke-none" />
            <span>{t.viewFinalStats}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
